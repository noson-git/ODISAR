import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  KeyRound,
  FileCheck,
} from 'lucide-react';

interface AdminLoginPageProps {
  onLogin: (role: string) => void;
  onNavigateHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin, onNavigateHome }) => {
  const [officerId, setOfficerId] = useState('commissioner@endowments.odisha.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState('Administrator');
  const [twoFactorCode, setTwoFactorCode] = useState('KHETRA-2026');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!officerId.trim()) {
      setError('Please provide an official Officer ID or Department Email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your authorized security passcode.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(selectedRole);
    }, 400);
  };

  const handleQuickDemoFill = (role: string) => {
    if (role === 'Administrator') {
      setOfficerId('commissioner@endowments.odisha.gov.in');
      setPassword('KhetraAdmin#2026');
      setSelectedRole('Administrator');
      setTwoFactorCode('KHETRA-ADMIN');
    } else if (role === 'Reviewer') {
      setOfficerId('tahasil.officer.nayak@khordha.odisha.gov.in');
      setPassword('ReviewerPass#2026');
      setSelectedRole('Reviewer');
      setTwoFactorCode('KHETRA-SURVEY');
    } else {
      setOfficerId('digitization.operator@khetra.ai');
      setPassword('DataEntryPass#2026');
      setSelectedRole('Data Entry Operator');
      setTwoFactorCode('KHETRA-DEO');
    }
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#1A1411] via-[#201814] to-[#140f0c]">
      {/* Background Decorative Heritage Grid */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C6A15B_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="relative z-10 w-full max-w-lg space-y-8">
        {/* Seal & Department Title Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B1F24] via-[#38201b] to-[#C6A15B]/30 border border-[#C6A15B]/50 shadow-2xl p-0.5 mx-auto">
            <div className="w-full h-full rounded-[14px] bg-[#251D18] flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-[#C6A15B]" />
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold tracking-widest text-[#C6A15B] uppercase block">
              Government of Odisha • Law &amp; Endowments Department
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-wide mt-1">
              Administration Login
            </h1>
            <p className="text-xs text-[#D8C5A3]/80 mt-1.5 font-sans max-w-sm mx-auto">
              Secure institutional access for Tahasil revenue officers, endowment commissioners, and cadastral survey auditors.
            </p>
          </div>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="p-7 sm:p-8 rounded-2xl bg-[#201814]/85 backdrop-blur-xl border border-[#C6A15B]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6">
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-950/80 border border-rose-600/50 flex items-center gap-2.5 text-xs text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Officer ID / Email */}
            <div>
              <label className="block text-xs font-semibold text-[#D8C5A3] uppercase tracking-wider mb-1.5">
                Officer ID / Department Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C6A15B]/70" />
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="e.g. commissioner@endowments.odisha.gov.in"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#140F0C] border border-[#C6A15B]/30 text-white text-xs font-medium placeholder-[#D8C5A3]/40 focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/50 transition-all"
                  required
                />
              </div>
            </div>

            {/* Passcode */}
            <div>
              <label className="block text-xs font-semibold text-[#D8C5A3] uppercase tracking-wider mb-1.5">
                Authorized Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C6A15B]/70" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security passcode"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#140F0C] border border-[#C6A15B]/30 text-white text-xs font-medium placeholder-[#D8C5A3]/40 focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/50 transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#D8C5A3] uppercase tracking-wider mb-1.5">
                Jurisdiction &amp; Role Level
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#140F0C] border border-[#C6A15B]/30 text-white text-xs font-medium focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/50 cursor-pointer"
              >
                <option value="Administrator">Administrator (Endowment Commissioner &amp; State Board)</option>
                <option value="Reviewer">Reviewer (Tahasil Revenue Officer - Khordha / Puri / Cuttack)</option>
                <option value="Data Entry Operator">Data Entry Operator (Cadastral Record Digitization Assistant)</option>
              </select>
            </div>

            {/* 2FA Token Code */}
            <div>
              <label className="block text-xs font-semibold text-[#D8C5A3] uppercase tracking-wider mb-1.5">
                Two-Factor Security Token
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#C6A15B]/70" />
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  placeholder="2FA Token"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-[#140F0C] border border-[#C6A15B]/30 text-[#C6A15B] text-xs font-mono font-bold tracking-wider placeholder-[#D8C5A3]/40 focus:outline-none focus:border-[#C6A15B] focus:ring-1 focus:ring-[#C6A15B]/50"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-lg bg-gradient-to-r from-[#C6A15B] via-[#d4af65] to-[#C6A15B] text-[#251D18] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#251D18]" />
                  <span>Sign In to Administration Portal</span>
                  <ArrowRight className="w-4 h-4 text-[#251D18]" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill Options for Evaluation */}
          <div className="pt-4 border-t border-[#C6A15B]/20">
            <span className="text-[10px] text-[#D8C5A3]/70 font-semibold uppercase tracking-wider block mb-2">
              Evaluation Quick-Fill Profiles (Single Click):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('Administrator')}
                className={`py-1.5 px-2 rounded text-[10px] font-semibold transition-all border ${
                  selectedRole === 'Administrator'
                    ? 'bg-[#5B1F24] text-[#C6A15B] border-[#C6A15B]'
                    : 'bg-[#140F0C] text-[#D8C5A3] border-[#C6A15B]/20 hover:border-[#C6A15B]/50'
                }`}
              >
                Commissioner
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('Reviewer')}
                className={`py-1.5 px-2 rounded text-[10px] font-semibold transition-all border ${
                  selectedRole === 'Reviewer'
                    ? 'bg-[#5B1F24] text-[#C6A15B] border-[#C6A15B]'
                    : 'bg-[#140F0C] text-[#D8C5A3] border-[#C6A15B]/20 hover:border-[#C6A15B]/50'
                }`}
              >
                Revenue Officer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('Data Entry Operator')}
                className={`py-1.5 px-2 rounded text-[10px] font-semibold transition-all border ${
                  selectedRole === 'Data Entry Operator'
                    ? 'bg-[#5B1F24] text-[#C6A15B] border-[#C6A15B]'
                    : 'bg-[#140F0C] text-[#D8C5A3] border-[#C6A15B]/20 hover:border-[#C6A15B]/50'
                }`}
              >
                Data Entry
              </button>
            </div>
          </div>

          {/* Return to Public Portal */}
          <div className="text-center pt-2">
            <button
              onClick={onNavigateHome}
              className="text-xs text-[#D8C5A3]/60 hover:text-[#C6A15B] transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>← Return to Public Portal</span>
            </button>
          </div>
        </div>

        {/* Statutory Legal Advisory */}
        <div className="p-3.5 rounded-lg bg-[#201814]/60 border border-[#C6A15B]/15 text-[10px] text-[#D8C5A3]/70 text-center leading-relaxed font-sans">
          Protected institutional system. Authorized for designated officers under the Odisha Hindu Religious Endowments Act 1951. All access and decision logs are cryptographically timestamped in the audit ledger.
        </div>
      </div>
    </div>
  );
};
