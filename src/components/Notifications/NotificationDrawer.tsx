import React from 'react';
import { X, Check, Bell, AlertTriangle, RefreshCw, Calendar, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHouse: (houseId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectHouse,
}) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, houses } = useData();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Pemberitahuan Real-Time
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              Tandai Semua Dibaca
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  markNotificationAsRead(item.id);
                  if (item.houseId) {
                    onSelectHouse(item.houseId);
                    onClose();
                  }
                }}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  item.read
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 opacity-75'
                    : 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 shrink-0">
                    {item.type === 'alert' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    ) : item.type === 'sync' ? (
                      <RefreshCw className="w-4 h-4 text-amber-600" />
                    ) : item.type === 'reminder' ? (
                      <Calendar className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Check className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-normal">
                      {item.message}
                    </p>

                    {item.houseNumber && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1.5">
                        <span>Buka {item.houseNumber}</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Belum ada notifikasi baru.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 text-center">
          Pembaruan instan tersambung otomatis ke sistem Jumantik RW 08
        </div>
      </div>
    </div>
  );
};
