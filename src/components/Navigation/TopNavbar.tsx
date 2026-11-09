import React from 'react';
import { 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Bell, 
  FileDown, 
  User, 
  PlusCircle,
  Lock,
  Unlock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface TopNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenExport: () => void;
  onOpenNotifications: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenExport,
  onOpenNotifications,
}) => {
  const { currentUser, openLoginModal, switchRoleDirectly, logout } = useAuth();
  const {
    isOffline,
    syncQueue,
    isSyncing,
    toggleOfflineSimulation,
    syncOfflineData,
    unreadNotificationsCount,
    setSelectedHouseForInspection,
    isDecryptedMode,
    toggleDecryptedMode,
  } = useData();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-left cursor-pointer focus:outline-none"
            >
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 block">
                SiJentik RW 08
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block -mt-1 font-medium">
                Sistem Bebas Jentik Komplek
              </span>
            </button>
          </div>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400 pb-1 -mb-1'
                  : ''
              }`}
            >
              Dasbor Pantau
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'map'
                  ? 'text-emerald-600 dark:hover:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400 pb-1 -mb-1'
                  : ''
              }`}
            >
              Peta Rumah
            </button>
            <button
              onClick={() => setActiveTab('inspections')}
              className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'inspections'
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400 pb-1 -mb-1'
                  : ''
              }`}
            >
              Catatan Lapangan
            </button>
            <button
              onClick={() => setActiveTab('reminders')}
              className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'reminders'
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400 pb-1 -mb-1'
                  : ''
              }`}
            >
              Jadwal & Pengingat
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'reports'
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold border-b-2 border-emerald-600 dark:border-emerald-400 pb-1 -mb-1'
                  : ''
              }`}
            >
              Laporan Warga
            </button>
          </nav>

          {/* Zone 3: Primary Action & Status Affordances */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Offline/Online Mode Indicator & Toggle */}
            <button
              onClick={toggleOfflineSimulation}
              title={isOffline ? 'Mode Luring Aktif (Klik untuk Online)' : 'Mode Daring (Klik untuk simulasi Luring)'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isOffline
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isOffline ? 'Luring (Offline)' : 'Daring (Online)'}</span>
              {syncQueue.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-amber-600 text-white rounded font-mono">
                  {syncQueue.length}
                </span>
              )}
            </button>

            {/* Sync trigger button when pending */}
            {syncQueue.length > 0 && !isOffline && (
              <button
                onClick={syncOfflineData}
                disabled={isSyncing}
                title="Sinkronkan data pemeriksaan luring"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span className="hidden lg:inline">Sinkronkan</span>
              </button>
            )}

            {/* AES-256 Medical Data Decryption Key Toggle */}
            <button
              onClick={toggleDecryptedMode}
              title={isDecryptedMode ? 'Sembunyikan data sensitif pasien' : 'Dekripsi data NIK & kesehatan keluarga (AES-256)'}
              className={`hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                isDecryptedMode
                  ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {isDecryptedMode ? <Unlock className="w-3.5 h-3.5 text-blue-600" /> : <Lock className="w-3.5 h-3.5" />}
              <span className="text-[11px] font-mono">{isDecryptedMode ? 'AES Terbuka' : 'AES Terenkripsi'}</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Notifikasi & Peringatan Jentik"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            {/* Export Report CTA */}
            <button
              onClick={onOpenExport}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Ekspor laporan PDF & CSV"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Ekspor</span>
            </button>

            {/* Quick Inspection CTA */}
            <button
              onClick={() => setSelectedHouseForInspection(null)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Catat Pemeriksaan</span>
              <span className="sm:hidden">Catat</span>
            </button>

            {/* User Profile / Multi-level Role Switch */}
            <button
              onClick={openLoginModal}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 text-left cursor-pointer group"
              title={`Masuk sebagai: ${currentUser.name} (${currentUser.roleTitle})`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-600 group-hover:border-emerald-500">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden xl:block">
                <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">
                  {currentUser.role.replace('_', ' ')} · 2FA
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
