import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  KeyRound,
  Lock,
  LogOut,
  Mail,
  Shield,
  ShieldAlert,
  Sliders,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { User } from '../services/auth';

interface ProfilePageProps {
  currentUser: User | null;
  onLogout: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'error') => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onLogout,
  onOpenAuth,
  onShowToast,
}) => {
  const [riskTolerance, setRiskTolerance] = useState<'Conservative' | 'Balanced' | 'Aggressive'>('Balanced');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          <UserIcon className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Sign In Required</h2>
        <p className="text-xs text-slate-400">
          Sign in or create a researcher profile to customize portfolio preferences and security parameters.
        </p>
        <Button variant="primary" onClick={() => onOpenAuth('login')}>
          Sign In / Create Account
        </Button>
      </div>
    );
  }

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      onShowToast('Password Too Short', 'Password must be at least 6 characters.', 'error');
      return;
    }
    setIsEditingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    onShowToast('Credentials Updated', 'Security credentials and session keys refreshed.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">User Profile & Account Security</h1>
          <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
            Authenticated Session
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Manage identity parameters, security keys, active workstation sessions, and investment risk profile
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <Card className="p-6 text-center space-y-4 flex flex-col items-center">
          <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono font-bold text-2xl shadow-lg">
            {currentUser.avatarSeed || currentUser.name.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <h3 className="text-base font-bold text-white">{currentUser.name}</h3>
            <span className="text-xs font-mono text-emerald-400 block mt-0.5">{currentUser.role}</span>
            <span className="text-xs text-slate-400 block mt-1">{currentUser.institution}</span>
          </div>

          <div className="w-full pt-4 border-t border-slate-800 text-left space-y-2 text-xs font-mono text-slate-400">
            <div className="flex justify-between">
              <span className="text-slate-500">Email:</span>
              <span className="text-slate-300 truncate max-w-[140px]">{currentUser.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Member Since:</span>
              <span className="text-slate-300">
                {new Date(currentUser.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Session Status:</span>
              <span className="text-emerald-400 font-bold">Verified</span>
            </div>
          </div>

          <Button
            variant="danger"
            size="sm"
            className="w-full mt-4"
            onClick={onLogout}
            icon={<LogOut className="w-3.5 h-3.5" />}
          >
            Sign Out of Lab
          </Button>
        </Card>

        {/* Security & Risk Preferences */}
        <div className="md:col-span-2 space-y-6">
          {/* Risk Profile Selection */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Investment Risk Tolerance Preference</span>
            </div>
            <p className="text-xs text-slate-400">
              Personalize risk warnings and asset allocation recommendations across the platform.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {(['Conservative', 'Balanced', 'Aggressive'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRiskTolerance(r);
                    onShowToast('Risk Preference Updated', `Set profile risk tolerance to ${r}.`, 'info');
                  }}
                  className={`p-3 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                    riskTolerance === r
                      ? 'bg-emerald-500/10 border-emerald-500 text-white font-bold shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-mono text-xs">{r}</div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    {r === 'Conservative' ? 'BTC/ETH focus' : r === 'Balanced' ? 'Layer 1 & DeFi' : 'High Beta Altcoins'}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Security Credentials */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>Security & Verification Credentials</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
                2FA OTP Protected
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <div>
                <span className="font-semibold text-white block">Email One-Time Password (OTP)</span>
                <span className="text-[11px] text-slate-400">
                  Real-time cryptographic 6-digit tokens sent to {currentUser.email}
                </span>
              </div>
              <span className="text-emerald-400 font-mono text-xs font-semibold">Active</span>
            </div>

            <div className="pt-2">
              {!isEditingPassword ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingPassword(true)}
                  icon={<Lock className="w-3.5 h-3.5" />}
                >
                  Update Account Password
                </Button>
              ) : (
                <form onSubmit={handleSaveSecurity} className="space-y-3 pt-2 animate-slide-in">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Current Password / PIN</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">New Secure Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters..."
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="ghost" size="sm" type="button" onClick={() => setIsEditingPassword(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      Save Password
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
