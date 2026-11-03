import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  KeyRound,
  Mail,
  RefreshCw,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import { sendEmailOtp, User, verifyEmailOtp } from '../../services/auth';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onNotifyOtp: (otp: string, email: string) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onNotifyOtp,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [step, setStep] = useState<'email' | 'otp'>('email');

  // Form Fields
  const [email, setEmail] = useState('tdev0786@gmail.com');
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');

  // OTP Fields
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [activeGeneratedOtp, setActiveGeneratedOtp] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);

  const digitInputs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('email');
      setOtpDigits(['', '', '', '', '', '']);
      setErrorMsg(null);
      setIsLoading(false);
      setResendCountdown(60);
    }
  }, [isOpen]);

  // Resend countdown timer
  useEffect(() => {
    let timer: any = null;
    if (step === 'otp' && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, resendCountdown]);

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid academic or professional email address.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setErrorMsg('Please enter your full name for the researcher profile.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = sendEmailOtp(email, mode, name, institution);
      setIsLoading(false);
      if (res.success) {
        setActiveGeneratedOtp(res.otp);
        setStep('otp');
        setResendCountdown(60);
        onNotifyOtp(res.otp, email);

        // Focus first OTP digit input
        setTimeout(() => {
          digitInputs.current[0]?.focus();
        }, 150);
      }
    }, 400);
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = cleaned;
    setOtpDigits(updated);
    setErrorMsg(null);

    // Auto advance to next box
    if (cleaned && index < 5) {
      digitInputs.current[index + 1]?.focus();
    }

    // Auto verify if all 6 digits entered
    if (cleaned && index === 5 && updated.every((d) => d !== '')) {
      handleVerify(updated.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitInputs.current[index - 1]?.focus();
    }
  };

  const handlePasteOtp = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const updated = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      updated[i] = pasted[i] || '';
    }
    setOtpDigits(updated);

    if (pasted.length === 6) {
      digitInputs.current[5]?.focus();
      handleVerify(pasted);
    } else {
      digitInputs.current[Math.min(5, pasted.length)]?.focus();
    }
  };

  const handleAutoFillDemoOtp = () => {
    if (!activeGeneratedOtp) return;
    const digits = activeGeneratedOtp.split('').slice(0, 6);
    setOtpDigits(digits);
    handleVerify(activeGeneratedOtp);
  };

  const handleVerify = (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      const res = verifyEmailOtp(email, code);
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setErrorMsg(res.error || 'Verification failed. Please check the code.');
      }
    }, 450);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        step === 'email'
          ? mode === 'login'
            ? 'Sign In to CryptoAnalyzer Lab'
            : 'Register Research Account'
          : 'Enter 6-Digit Email OTP'
      }
      subtitle={
        step === 'email'
          ? 'Secure access with instant real-time one-time password'
          : `Verification code sent to ${email}`
      }
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Error notice */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Email & Mode */}
        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {/* Mode Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  mode === 'login'
                    ? 'bg-slate-800 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Researcher Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                }}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  mode === 'register'
                    ? 'bg-slate-800 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Full Name & Title
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Dr. Jane Doe (Quant Analyst)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Academic Institution / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MIT Computational Finance Lab"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Work or Academic Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="analyst@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                A 6-digit real-time verification code will be generated instantly.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Button variant="ghost" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading}
                icon={isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              >
                {isLoading ? 'Generating OTP...' : 'Send Real-Time OTP'}
              </Button>
            </div>
          </form>
        ) : (
          /* STEP 2: 6-Digit OTP Verification */
          <div className="space-y-5">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white font-mono">
                    Real-Time OTP Dispatched
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Target: <strong className="text-slate-200">{email}</strong>
                  </div>
                </div>
              </div>

              {activeGeneratedOtp && (
                <button
                  type="button"
                  onClick={handleAutoFillDemoOtp}
                  className="px-2.5 py-1 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-mono transition-colors"
                  title="Click to auto-fill generated OTP"
                >
                  Auto-fill: <strong>{activeGeneratedOtp}</strong>
                </button>
              )}
            </div>

            {/* 6 Digit Input Boxes */}
            <div>
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2 text-center">
                Enter 6-Digit Verification PIN
              </label>

              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      digitInputs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handlePasteOtp}
                    className="w-10 h-12 sm:w-12 sm:h-14 text-center font-mono font-bold text-lg sm:text-xl text-white bg-slate-950 border-2 border-slate-800 rounded-xl focus:border-emerald-500 focus:outline-none transition-all shadow-inner"
                  />
                ))}
              </div>
            </div>

            {/* Resend & Timer */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="inline-flex items-center gap-1 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Change Email</span>
              </button>

              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {resendCountdown > 0 ? (
                  <span className="font-mono">Resend in {resendCountdown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-emerald-400 hover:text-emerald-300 font-medium underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button variant="ghost" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="button"
                disabled={isLoading || otpDigits.some((d) => !d)}
                icon={isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                onClick={() => handleVerify()}
              >
                {isLoading ? 'Verifying Code...' : 'Verify & Sign In'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
