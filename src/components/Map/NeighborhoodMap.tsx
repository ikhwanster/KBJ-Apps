import React, { useState, useMemo } from 'react';
import { 
  Home, 
  Search, 
  Filter, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  Lock, 
  Plus, 
  Send,
  Eye
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { House } from '../../types';

export const NeighborhoodMap: React.FC = () => {
  const {
    houses,
    selectedRT,
    setSelectedRT,
    setSelectedHouseForDetail,
    setSelectedHouseForInspection,
    setSelectedHouseForReport,
    isDecryptedMode,
  } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'bebas' | 'positif' | 'belum_periksa'>('all');
  const [selectedHousePin, setSelectedHousePin] = useState<House | null>(null);

  // Filter houses based on search, RT, and status
  const filteredHouses = useMemo(() => {
    return houses.filter((h) => {
      const matchRT = selectedRT === 'ALL' || h.rt === selectedRT;
      const matchStatus = statusFilter === 'all' || h.latestStatus === statusFilter;
      const matchSearch =
        searchQuery === '' ||
        h.houseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.headOfFamily.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.block.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRT && matchStatus && matchSearch;
    });
  }, [houses, selectedRT, statusFilter, searchQuery]);

  // Counts for filters
  const counts = useMemo(() => {
    return {
      all: houses.length,
      bebas: houses.filter((h) => h.latestStatus === 'bebas').length,
      positif: houses.filter((h) => h.latestStatus === 'positif').length,
      belum_periksa: houses.filter((h) => h.latestStatus === 'belum_periksa').length,
    };
  }, [houses]);

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor rumah, blok, atau nama kepala keluarga..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* RT Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
            {['ALL', 'RT 01', 'RT 02', 'RT 03', 'RT 04', 'RT 05'].map((rt) => (
              <button
                key={rt}
                onClick={() => setSelectedRT(rt)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  selectedRT === rt
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {rt === 'ALL' ? 'Semua RT' : rt}
              </button>
            ))}
          </div>

          {/* Status Filter Segmented Controls */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Semua ({counts.all})
            </button>
            <button
              onClick={() => setStatusFilter('positif')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer text-rose-600 ${
                statusFilter === 'positif'
                  ? 'bg-white dark:bg-slate-900 font-semibold shadow-sm'
                  : ''
              }`}
            >
              Positif ({counts.positif})
            </button>
            <button
              onClick={() => setStatusFilter('bebas')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer text-emerald-600 ${
                statusFilter === 'bebas'
                  ? 'bg-white dark:bg-slate-900 font-semibold shadow-sm'
                  : ''
              }`}
            >
              Bebas ({counts.bebas})
            </button>
            <button
              onClick={() => setStatusFilter('belum_periksa')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer text-slate-500 ${
                statusFilter === 'belum_periksa'
                  ? 'bg-white dark:bg-slate-900 font-semibold shadow-sm'
                  : ''
              }`}
            >
              Belum ({counts.belum_periksa})
            </button>
          </div>
        </div>
      </div>

      {/* Main Map View Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Interactive Visual Map Graphic & Grid */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Peta Blok Komplek RW 08
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Klik ikon rumah untuk memeriksa riwayat atau input laporan jentik
              </p>
            </div>
            {/* Map Legend */}
            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Bebas</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>Positif Jentik</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Belum Periksa</span>
              </span>
            </div>
          </div>

          {/* Map Canvas Frame */}
          <div className="relative w-full h-[400px] sm:h-[460px] rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-950">
            {/* Background Image of Suburban Complex with opacity scrim */}
            <img
              src="/src/assets/images/rw_neighborhood_overview_1794250049332.jpg"
              alt="Peta Komplek RW 08"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-25 dark:opacity-20 pointer-events-none"
            />

            {/* Block & Street Labels */}
            <div className="absolute top-4 left-6 text-xs font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase bg-white/70 dark:bg-slate-900/70 px-2 py-0.5 rounded backdrop-blur-xs">
              Blok A (RT 01)
            </div>
            <div className="absolute top-4 right-8 text-xs font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase bg-white/70 dark:bg-slate-900/70 px-2 py-0.5 rounded backdrop-blur-xs">
              Blok B (RT 02)
            </div>
            <div className="absolute top-[48%] left-6 text-xs font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase bg-white/70 dark:bg-slate-900/70 px-2 py-0.5 rounded backdrop-blur-xs">
              Blok C (RT 03)
            </div>
            <div className="absolute top-[48%] right-8 text-xs font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase bg-white/70 dark:bg-slate-900/70 px-2 py-0.5 rounded backdrop-blur-xs">
              Blok D (RT 04)
            </div>
            <div className="absolute bottom-4 left-1/3 text-xs font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase bg-white/70 dark:bg-slate-900/70 px-2 py-0.5 rounded backdrop-blur-xs">
              Blok E (RT 05) - Taman Warga
            </div>

            {/* House Interactive Pins on Coords */}
            {filteredHouses.map((house) => {
              const isSelected = selectedHousePin?.id === house.id;

              const statusColor =
                house.latestStatus === 'bebas'
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : house.latestStatus === 'positif'
                  ? 'bg-rose-600 text-white ring-4 ring-rose-200 dark:ring-rose-950/80 animate-bounce'
                  : 'bg-amber-400 text-slate-900 hover:bg-amber-500';

              return (
                <button
                  key={house.id}
                  onClick={() => setSelectedHousePin(house)}
                  style={{ left: `${house.coords.x}%`, top: `${house.coords.y}%` }}
                  title={`${house.houseNumber} (${house.headOfFamily}) - Status: ${house.latestStatus}`}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center ${statusColor} ${
                    isSelected ? 'scale-125 z-20 ring-2 ring-slate-900 dark:ring-white' : 'hover:scale-110 z-10'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span className="sr-only">{house.houseNumber}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Selected House Action Panel / Resident Info */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 transition-colors flex flex-col justify-between">
          {selectedHousePin ? (
            <div className="space-y-4">
              {/* House Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {selectedHousePin.rt} · {selectedHousePin.block}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedHousePin.houseNumber}
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    KK: {selectedHousePin.headOfFamily}
                  </p>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    selectedHousePin.latestStatus === 'bebas'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : selectedHousePin.latestStatus === 'positif'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}
                >
                  {selectedHousePin.latestStatus === 'bebas'
                    ? 'Bebas Jentik'
                    : selectedHousePin.latestStatus === 'positif'
                    ? 'Positif Jentik'
                    : 'Belum Diperiksa'}
                </div>
              </div>

              {/* Status details */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Pemeriksaan Terakhir:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {selectedHousePin.lastInspectedAt || 'Belum ada data'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Kader Pemeriksa:</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {selectedHousePin.lastInspectorName || '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Tingkat Risiko DBD:</span>
                  <span
                    className={`font-semibold capitalize ${
                      selectedHousePin.riskLevel === 'tinggi'
                        ? 'text-rose-600 dark:text-rose-400'
                        : selectedHousePin.riskLevel === 'sedang'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {selectedHousePin.riskLevel}
                  </span>
                </div>
                {selectedHousePin.positiveContainersCount > 0 && (
                  <div className="flex justify-between text-rose-600 dark:text-rose-400 font-semibold">
                    <span>Kontainer Positif:</span>
                    <span>{selectedHousePin.positiveContainersCount} wadah</span>
                  </div>
                )}
              </div>

              {/* AES-256 Resident Medical Protection Badge */}
              <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-medium">Data Pasien & NIK (Terenkripsi AES-256)</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {isDecryptedMode
                    ? 'Dekripsi aktif. Data riwayat DBD & kelompok rentan dapat diakses petugas.'
                    : 'Informasi privasi disandikan. Aktifkan dekripsi di bilah atas untuk melihat.'}
                </p>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setSelectedHouseForInspection(selectedHousePin)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Catat Pemeriksaan Rumah Ini</span>
                </button>

                {selectedHousePin.latestStatus === 'positif' && (
                  <button
                    onClick={() => setSelectedHouseForReport(selectedHousePin)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Laporan Otomatis ke Warga</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedHouseForDetail(selectedHousePin)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Rincian Lengkap & Catatan Medis</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
              <Home className="w-10 h-10 mb-2 stroke-1 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Pilih Rumah pada Peta
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Sentuh atau klik pin rumah di peta sebelah kiri untuk melihat status pemantauan jentik, nomor kontak, dan riwayat pemeriksaan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
