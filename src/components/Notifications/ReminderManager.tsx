import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  Check, 
  Clock, 
  Calendar, 
  MessageSquare, 
  ShieldCheck, 
  AlertCircle,
  Plus
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { WeeklyReminder } from '../../types';

export const ReminderManager: React.FC = () => {
  const { reminders, toggleReminder, broadcastReminderNow, addNotification } = useData();
  const { currentUser } = useAuth();

  const [pushStatus, setPushStatus] = useState<string>('default');
  const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        setPushStatus(permission);
        if (permission === 'granted') {
          addNotification({
            title: 'Notifikasi Push Berhasil Diaktifkan',
            message: 'Perangkat ini kini akan menerima pembaruan real-time saat kader menemukan jentik atau ada jadwal pengingat mingguan.',
            type: 'info',
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleBroadcast = (reminder: WeeklyReminder) => {
    broadcastReminderNow(reminder.id);
    setBroadcastSuccess(`Pengingat "${reminder.title}" berhasil disiarkan ke seluruh warga.`);
    setTimeout(() => setBroadcastSuccess(null), 4000);
  };

  return (
    <div className="space-y-5">
      {/* Push Notification Permission Card */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Notifikasi Push Petugas Lapangan & Warga
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Aktifkan izin peramban untuk menerima sinyal instan saat jentik Aedes ditemukan atau jadwal PSN 3M+ tiba.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          {pushStatus === 'granted' ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              <Check className="w-3.5 h-3.5" />
              <span>Notifikasi Push Aktif</span>
            </div>
          ) : (
            <button
              onClick={requestNotificationPermission}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Aktifkan Notifikasi Push</span>
            </button>
          )}
        </div>
      </div>

      {broadcastSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{broadcastSuccess}</span>
        </div>
      )}

      {/* Scheduled Reminders List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 transition-colors">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Jadwal Pengingat Pemeriksaan Mingguan (Jum'at Bersih & PSN)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pesan terprogram yang otomatis disebarkan kepada para kader jumantik dan grup warga komplek
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {reminder.title}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    · Setiap {reminder.dayOfWeek}, Pukul {reminder.time} WIB
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={reminder.isActive}
                      onChange={() => toggleReminder(reminder.id)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>Otomatis Aktif</span>
                  </label>

                  <button
                    onClick={() => handleBroadcast(reminder)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Siarkan Sekarang</span>
                  </button>
                </div>
              </div>

              {/* Message Template Preview */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                "{reminder.messageTemplate}"
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Target: {reminder.targetRT === 'all' ? 'Seluruh RW 08 (RT 01 - RT 05)' : reminder.targetRT}</span>
                <span>Terakhir Disiarkan: {reminder.lastSentAt || 'Belum disiarkan'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
