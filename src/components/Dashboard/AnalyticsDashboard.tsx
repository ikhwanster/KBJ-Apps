import React from 'react';
import { 
  Plus, 
  FileDown, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { StatSummaryCards } from './StatSummaryCards';
import { TrendCharts } from './TrendCharts';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface AnalyticsDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenQuickInspect: () => void;
  onOpenExport: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  onNavigateTab,
  onOpenQuickInspect,
  onOpenExport,
}) => {
  const { inspections, houses, communityMetrics } = useData();
  const { currentUser } = useAuth();

  const recentInspections = inspections.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Editorial Header / Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Text Zone */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Pusat Komando Bebas Jentik RW 08 Komplek Griya Asri</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                Pemantauan Real-Time & Gerakan Pemberantasan Sarang Nyamuk (PSN 3M+)
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                Platform terpadu Kader Jumantik untuk pelaporan luring, pemetaan sebaran jentik per RT, notifikasi pengingat terjadwal, dan peringatan otomatis bagi warga.
              </p>
            </div>

            {/* Quick Action Button Strip */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                onClick={onOpenQuickInspect}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Catat Pemeriksaan Rumah</span>
              </button>
              <button
                onClick={() => onNavigateTab('map')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4" />
                <span>Buka Peta Komplek</span>
              </button>
              <button
                onClick={onOpenExport}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Ekspor Laporan</span>
              </button>
            </div>
          </div>

          {/* Right Image Zone: Natural Leica documentary photo */}
          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
            <img
              src="/src/assets/images/jumantik_field_inspection_1794250049533.jpg"
              alt="Kader Jumantik Memeriksa Wadah Air"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
            <div className="absolute bottom-3 left-3 text-white text-[11px] font-medium drop-shadow-sm">
              Kader Jumantik RT 01 sedang melakukan pemantauan TPA
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Stat Summary Metric Cards */}
      <StatSummaryCards />

      {/* Visual Analytics & Trend Charts */}
      <TrendCharts />

      {/* Two Column Section: Recent Inspections & Community Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pemeriksaan Terbaru di Wilayah RW 08
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Laporan masuk real-time dari seluruh kader lapangan
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('inspections')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Semua ({inspections.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {recentInspections.map((insp) => (
              <div key={insp.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      insp.status === 'bebas'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                    }`}
                  >
                    {insp.status === 'bebas' ? 'ABJ' : '!'}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white">
                      {insp.houseNumber} · {insp.headOfFamily}
                    </h5>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {insp.rt} · {insp.inspectedAt} oleh {insp.inspectorName}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold block ${
                      insp.status === 'bebas'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {insp.status === 'bebas' ? 'Bebas Jentik' : 'Positif Jentik'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    {insp.syncStatus === 'synced' ? 'Tersinkron' : 'Luring'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Reference & Priority Tips */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 transition-colors flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              Siklus Pemantauan Mingguan
            </h3>

            <div className="mt-3 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Jumat Bersih (07:30 - 09:30)
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  Kader Jumantik menyisir blok RT masing-masing dan mencatat kondisi TPA langsung di aplikasi.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Sabtu Sehat Mandiri
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  Warga yang menerima laporan jentik melakukan pengurasan dan melaporkan balik konfirmasi pembersihan.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700/60">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Minggu Sore: Rekap Puskesmas
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  Ketua RW mengunduh berkas laporan CSV & PDF resmi untuk diserahkan ke Puskesmas Pembina.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300">
            <span className="font-bold block">Status Keamanan Wilayah:</span>
            <span>ABJ {communityMetrics.abjPercentage}% ({communityMetrics.positiveCount} rumah dalam pengawasan khusus).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
