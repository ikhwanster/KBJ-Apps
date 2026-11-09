import React from 'react';
import { AlertTriangle, Send, CheckCircle2, MessageSquare, Phone, Home, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { House } from '../../types';

interface CitizenReportsHubProps {
  onOpenReportModal: (house: House) => void;
}

export const CitizenReportsHub: React.FC<CitizenReportsHubProps> = ({ onOpenReportModal }) => {
  const { houses } = useData();

  const positiveHouses = houses.filter((h) => h.latestStatus === 'positif');
  const bebasHouses = houses.filter((h) => h.latestStatus === 'bebas');

  return (
    <div className="space-y-5">
      {/* Overview Banner */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Sistem Pelaporan Otomatis Warga Berjentik
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Kirimkan pemberitahuan resmi & panduan 3M Plus langsung ke nomor WhatsApp kepala keluarga untuk percepatan eliminasi jentik.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-center">
            <span className="text-[10px] text-rose-600 dark:text-rose-400 block font-semibold">
              Perlu Tindakan
            </span>
            <span className="text-lg font-bold font-mono text-rose-700 dark:text-rose-300">
              {positiveHouses.length} Rumah
            </span>
          </div>
        </div>
      </div>

      {/* Positive Houses Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 transition-colors">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
          Daftar Rumah Terindikasi Jentik Aedes (Prioritas Intervensi)
        </h4>

        {positiveHouses.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {positiveHouses.map((house) => (
              <div
                key={house.id}
                className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      {house.rt} · {house.block}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300">
                      {house.positiveContainersCount} Wadah Positif
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                    {house.houseNumber}
                  </h5>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Kepala Keluarga: {house.headOfFamily}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Kontak: {house.phone}
                  </p>
                </div>

                <div className="pt-2 border-t border-rose-100 dark:border-rose-900/40 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Diperiksa: {house.lastInspectedAt?.slice(0, 10) || 'Terbaru'}
                  </span>
                  <button
                    onClick={() => onOpenReportModal(house)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Buat Laporan Otomatis</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-xs">
            Selamat! Tidak ada rumah yang terdeteksi memiliki jentik saat ini.
          </div>
        )}
      </div>

      {/* 3M Plus Guidelines Card */}
      <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 rounded-xl border border-emerald-200 dark:border-emerald-900/60">
        <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Panduan Baku Gerakan 1 Rumah 1 Jumantik (G1R1J)</span>
        </h4>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-900 dark:text-emerald-300">
          <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-emerald-200/60 dark:border-emerald-800">
            <span className="font-bold block text-emerald-700 dark:text-emerald-400 mb-1">1. Menguras</span>
            Membersihkan dan menyikat dinding bak mandi, kolam penampungan air minimal 1x seminggu.
          </div>
          <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-emerald-200/60 dark:border-emerald-800">
            <span className="font-bold block text-emerald-700 dark:text-emerald-400 mb-1">2. Menutup</span>
            Menutup rapat toren air, gentong, dan drum penampungan cadangan agar nyamuk tidak bertelur.
          </div>
          <div className="p-3 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-emerald-200/60 dark:border-emerald-800">
            <span className="font-bold block text-emerald-700 dark:text-emerald-400 mb-1">3. Mendaur Ulang</span>
            Menyingkirkan barang bekas (ban, botol, plastik) di pekarangan yang berpotensi menampung air hujan.
          </div>
        </div>
      </div>
    </div>
  );
};
