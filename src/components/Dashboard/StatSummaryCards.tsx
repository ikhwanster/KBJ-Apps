import React from 'react';
import { ShieldCheck, AlertOctagon, Home, Activity, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const StatSummaryCards: React.FC = () => {
  const { communityMetrics, isOffline, syncQueue } = useData();

  const isTargetAchieved = communityMetrics.abjPercentage >= 95;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Angka Bebas Jentik (ABJ) */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Angka Bebas Jentik (ABJ)
          </span>
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
              isTargetAchieved
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
            {communityMetrics.abjPercentage}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            / Target 95%
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          {isTargetAchieved ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Memenuhi Standar Kemenkes
            </span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              Perlu Peningkatan PSN 3M+
            </span>
          )}
        </div>
      </div>

      {/* Metric 2: Rumah Diperiksa Minggu Ini */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Cakupan Pemeriksaan
          </span>
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center">
            <Home className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
            {communityMetrics.inspectedThisWeek}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            / {communityMetrics.totalHouses} Total Rumah
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{communityMetrics.pendingCount} rumah menunggu jadwal</span>
        </div>
      </div>

      {/* Metric 3: Temuan Jentik Positif */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Positif Jentik (Perlu Tindakan)
          </span>
          <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-600 dark:text-rose-400 font-mono tabular-nums">
            {communityMetrics.positiveCount}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Rumah ({communityMetrics.houseIndex}% HI)
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{communityMetrics.freeCount} rumah dinyatakan bersih</span>
        </div>
      </div>

      {/* Metric 4: Indeks Entomologi & Status Luring */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Indeks Risiko & Sinkronisasi
          </span>
          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
            {communityMetrics.breteauIndex}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Breteau Index (BI)
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Antrean Luring:</span>
          <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
            {syncQueue.length} data tersimpan
          </span>
        </div>
      </div>
    </div>
  );
};
