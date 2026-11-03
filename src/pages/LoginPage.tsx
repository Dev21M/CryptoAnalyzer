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
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { sendEmailOtp, User, verifyEmailOtp } from '../services/auth';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  onNavigate: (route: string) => void;
  onNotifyOtp: (otp: string, email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigate,
  onNotifyOtp,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
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

  // Resend countdown timer
  useEffect(() => {
    let timer: any;
    if (step === 'otp' && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCountdown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please provide a valid research email address.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setErrorMsg('Please specify your researcher / analyst name.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendEmailOtp(email, mode);
      if (!result.success) {
        setErrorMsg(result.message);
        return;
      }

      if (result.code) {
        setActiveGeneratedOtp(result.code);
        onNotifyOtp(result.code, email);
      }

      setStep('otp');
      setResendCountdown(60);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => {
        digitInputs.current[0]?.focus();
      }, 100);
    } catch {
      setErrorMsg('Network anomaly encountered while issuing OTP token.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDigitChange = (index: number, val: string) => {
    const char = val.replace(/\D/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = char;
    setOtpDigits(updated);
    setErrorMsg(null);

    if (char && index < 5) {
      digitInputs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitInputs.current[index - 1]?.focus();
    }
  };

  const handlePasteOtp = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!paste) return;
    const updated = ['', '', '', '', '', ''];
    for (let i = 0; i < paste.length; i++) {
      updated[i] = paste[i];
    }
    setOtpDigits(updated);
    if (paste.length === 6) {
      digitInputs.current[5]?.focus();
    }
  };

  const handleAutoFill = () => {
    if (!activeGeneratedOtp) return;
    const digits = activeGeneratedOtp.split('').slice(0, 6);
    setOtpDigits(digits);
    setErrorMsg(null);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const pin = otpDigits.join('');
    if (pin.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyEmailOtp(email, pin, name, institution);
      if (!result.success || !result.user) {
        setErrorMsg(result.message || 'Invalid or expired OTP token.');
        return;
      }
      onLoginSuccess(result.user);
      onNavigate('/');
    } catch {
      setErrorMsg('An error occurred during token verification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center font-mono font-bold text-lg shadow-sm">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          {mode === 'login' ? 'Researcher Portal Sign In' : 'Register Academic Account'}
        </h1>
        <p className="text-xs text-slate-400">
          Passwordless cryptographic session access via single-use email OTP PIN
        </p>
      </div>

      <Card>
        {/* Toggle Mode */}
        <div className="grid grid-cols-2 gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setStep('email');
              setErrorMsg(null);
            }}
            className={`py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In (OTP)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setStep('email');
              setErrorMsg(null);
            }}
            className={`py-2 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            New Registration
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <span>{errorMsg}</span>
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                    Researcher / Analyst Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. Dr. Aryan Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                    University / Research Lab (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Department of Quantitative Finance"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                Academic or Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  placeholder="e.g. tdev0786@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                We'll dispatch a 6-digit real-time one-time password (OTP) instantly.
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
              isLoading={isLoading}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Dispatch Real-Time OTP PIN
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
              <span className="text-slate-400">Target: <strong className="text-slate-200 font-mono">{email}</strong></span>
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                Change
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2 text-center">
                Enter 6-Digit Verification PIN
              </label>

              {/* 6 Digit Inputs */}
              <div className="flex items-center justify-center gap-2" onPaste={handlePasteOtp}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { digitInputs.current[idx] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                    className="w-10 h-12 text-center bg-slate-950 border border-slate-700 rounded-lg font-mono text-lg font-bold text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
                  />
                ))}
              </div>

              {activeGeneratedOtp && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    className="text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    Auto-fill OTP: <span className="font-bold underline">{activeGeneratedOtp}</span>
                  </button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
              isLoading={isLoading}
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              Verify PIN & Authenticate
            </Button>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3 text-slate-500" />
                Resend in: {resendCountdown}s
              </span>

              <button
                type="button"
                disabled={resendCountdown > 0 || isLoading}
                onClick={handleSendOtp}
                className="text-emerald-400 hover:underline disabled:opacity-40 disabled:hover:no-underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Resend Token
              </button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
