import React, { useState } from 'react';
import { X, ShieldCheck, KeyRound, User, Lock, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_USERS } from '../../utils/initialData';
import { UserProfile } from '../../types';

export const LoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    closeLoginModal,
    currentUser,
    pendingUser,
    totpCode,
    loginError,
    initiateLogin,
    verify2FA,
    logout,
  } = useAuth();

  const [inputCode, setInputCode] = useState<string>('');

  if (!isLoginModalOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verify2FA(inputCode);
  };

  const handleQuickFill = () => {
    setInputCode(totpCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Autentikasi Multi-Level & 2FA
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sistem Keamanan Akses Terintegrasi RW 08
              </p>
            </div>
          </div>
          <button
            onClick={closeLoginModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5">
          {pendingUser ? (
            /* STEP 2: Two-Factor Authentication TOTP Screen */
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-900 dark:text-blue-200 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Verifikasi Dua Langkah (2FA)</span>
                </div>
                <p className="text-blue-800 dark:text-blue-300">
                  Masukkan 6-digit kode OTP dari aplikasi Authenticator untuk akun <strong>{pendingUser.name}</strong>.
                </p>
              </div>

              {loginError && (
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
                  {loginError}
                </div>
              )}

              {/* Demo Token Simulator Box */}
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">
                    Simulasi Kode TOTP Terikirim:
                  </span>
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-white tracking-widest">
                    {totpCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="px-2.5 py-1 text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded text-slate-800 dark:text-slate-200 font-medium transition-colors cursor-pointer"
                >
                  Salin Kode
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kode Verifikasi 6-Digit
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Contoh: 482910"
                  className="w-full text-center text-lg tracking-widest font-mono py-2.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeLoginModal}
                  className="flex-1 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Verifikasi & Masuk
                </button>
              </div>
            </form>
          ) : (
            /* STEP 1: Multi-Level Role Selection */
            <div className="space-y-4">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Pilih profil pengguna untuk beralih peran atau menguji alur otorisasi multi-level:
              </div>

              <div className="space-y-2">
                {INITIAL_USERS.map((user) => {
                  const isCurrent = currentUser.id === user.id;

                  return (
                    <button
                      key={user.id}
                      onClick={() => initiateLogin(user)}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isCurrent
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                            user.role === 'kader'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : user.role === 'ketua_rw'
                              ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                              : user.role === 'petugas_puskesmas'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {user.name}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                (Aktif)
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                            {user.roleTitle}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        {user.is2FAEnabled && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            2FA
                          </span>
                        )}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Status Sesi: Terotentikasi</span>
                <button
                  type="button"
                  onClick={logout}
                  className="text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                >
                  Keluar / Reset ke Warga
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
