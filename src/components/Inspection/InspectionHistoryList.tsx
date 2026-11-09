import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Search, 
  Plus, 
  Send, 
  CheckCircle2, 
  AlertOctagon, 
  WifiOff, 
  Check, 
  Calendar,
  Filter
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { InspectionRecord } from '../../types';

interface InspectionHistoryListProps {
  onStartInspection: () => void;
  onSendReport: (houseId: string) => void;
}

export const InspectionHistoryList: React.FC<InspectionHistoryListProps> = ({
  onStartInspection,
  onSendReport,
}) => {
  const { inspections, houses } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'bebas' | 'positif'>('all');
  const [rtFilter, setRtFilter] = useState<string>('all');

  const filteredInspections = useMemo(() => {
    return inspections.filter((insp) => {
      const matchStatus = statusFilter === 'all' || insp.status === statusFilter;
      const matchRt = rtFilter === 'all' || insp.rt === rtFilter;
      const matchSearch =
        searchQuery === '' ||
        insp.houseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        insp.headOfFamily.toLowerCase().includes(searchQuery.toLowerCase()) ||
        insp.inspectorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchRt && matchSearch;
    });
  }, [inspections, statusFilter, rtFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Log Riwayat Pemeriksaan Lapangan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daftar seluruh laporan pemeriksaan pintu ke pintu oleh Kader Jumantik RW 08
            </p>
          </div>
          <button
            onClick={onStartInspection}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Pemeriksaan Baru</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="mt-3 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor rumah, kepala keluarga, atau kader..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={rtFilter}
              onChange={(e) => setRtFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">Semua RT</option>
              <option value="RT 01">RT 01</option>
              <option value="RT 02">RT 02</option>
              <option value="RT 03">RT 03</option>
              <option value="RT 04">RT 04</option>
              <option value="RT 05">RT 05</option>
            </select>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setStatusFilter('positif')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer text-rose-600 ${
                  statusFilter === 'positif'
                    ? 'bg-white dark:bg-slate-900 font-semibold shadow-sm'
                    : ''
                }`}
              >
                Positif
              </button>
              <button
                onClick={() => setStatusFilter('bebas')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer text-emerald-600 ${
                  statusFilter === 'bebas'
                    ? 'bg-white dark:bg-slate-900 font-semibold shadow-sm'
                    : ''
                }`}
              >
                Bebas
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {filteredInspections.length > 0 ? (
          filteredInspections.map((insp) => (
            <div
              key={insp.id}
              className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      insp.status === 'bebas'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                    }`}
                  >
                    {insp.status === 'bebas' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <AlertOctagon className="w-4 h-4" />
                    )}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {insp.houseNumber} · {insp.headOfFamily}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {insp.rt} / {insp.rw} · Diperiksa: {insp.inspectedAt} oleh {insp.inspectorName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {/* Offline/Online Sync Badge */}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                      insp.syncStatus === 'synced'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {insp.syncStatus === 'synced' ? 'Tersinkronisasi' : 'Luring (Antrean)'}
                  </span>

                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                      insp.status === 'bebas'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {insp.status === 'bebas' ? 'Bebas Jentik' : 'Positif Jentik'}
                  </span>
                </div>
              </div>

              {/* Rincian Kontainer */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Wadah / Kontainer yang Diperiksa ({insp.totalContainersChecked} Titik):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {insp.containers.map((c, i) => (
                      <span
                        key={i}
                        className={`text-[11px] px-2 py-0.5 rounded border ${
                          c.isPositive
                            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-medium'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {c.label} {c.isPositive ? `(Positif: ${c.actionTaken})` : '(Bersih)'}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">
                    Tindakan & Rekomendasi 3M Plus:
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px]">
                    {insp.actionPlan}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              {insp.status === 'positif' && (
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => onSendReport(insp.houseId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Laporan Otomatis ke {insp.headOfFamily}</span>
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 text-xs">
            Tidak ditemukan riwayat pemeriksaan dengan filter ini.
          </div>
        )}
      </div>
    </div>
  );
};
