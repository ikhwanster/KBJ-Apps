import React, { useState } from 'react';
import { X, FileDown, Printer, FileSpreadsheet, Check, Building2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { exportToCSV, triggerPrintReport } from '../../utils/exportUtils';

interface ExportModalProps {
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ onClose }) => {
  const { inspections, communityMetrics, houses } = useData();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadCSV = () => {
    exportToCSV(inspections);
    setDownloadSuccess('Berkas CSV berhasil diunduh ke perangkat.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handlePrintPDF = () => {
    triggerPrintReport();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl shadow-2xl overflow-hidden my-auto">
        {/* Header (Hidden on Print) */}
        <div className="no-print px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileDown className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ekspor Laporan Pemantauan Jentik RW 08
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih format berkas untuk pelaporan ke Puskesmas & Arsip Lingkungan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Choice Bar (Hidden on Print) */}
        <div className="no-print p-5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800">
          {downloadSuccess && (
            <div className="mb-4 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-emerald-50 dark:hover:bg-slate-700/60 transition-colors shadow-xs cursor-pointer text-xs font-semibold"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Unduh Format CSV (Excel / SIM-Kes)</span>
            </button>

            <button
              onClick={handlePrintPDF}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors shadow-xs cursor-pointer text-xs font-semibold"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF (Kop Resmi)</span>
            </button>
          </div>
        </div>

        {/* Formal Printable Document Preview Area */}
        <div className="p-6 max-h-[60vh] overflow-y-auto print:overflow-visible print:max-h-none print:p-0 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900">
          {/* Formal Kop Surat */}
          <div className="text-center pb-4 border-b-2 border-slate-900 dark:border-slate-200">
            <h2 className="text-sm font-bold tracking-wider uppercase text-slate-900 dark:text-white">
              Pemerintah Kota / Dinas Kesehatan
            </h2>
            <h1 className="text-base font-extrabold uppercase text-slate-900 dark:text-white mt-0.5">
              Puskesmas Pembina & Kelompok Kerja Jumantik RW 08
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Komplek Griya Asri, Kelurahan Sukamaju · Kontak: (021) 8872-9901
            </p>
            <div className="mt-2 text-xs font-semibold uppercase text-slate-800 dark:text-slate-200 underline">
              Laporan Rekapitulasi Pemantauan Jentik Mingguan (PJB)
            </div>
          </div>

          {/* Metadata Bar */}
          <div className="grid grid-cols-2 gap-2 text-xs py-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-500">Wilayah:</span>{' '}
              <strong className="text-slate-800 dark:text-slate-200">RW 08 (RT 01 s/d RT 05)</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500">Tanggal Rekap:</span>{' '}
              <strong className="font-mono text-slate-800 dark:text-slate-200">
                {new Date().toISOString().slice(0, 10)}
              </strong>
            </div>
          </div>

          {/* Summary Box */}
          <div className="my-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">
              Indikator Keberhasilan Epidemiologi:
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              <div className="p-1.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">Angka Bebas Jentik (ABJ)</span>
                <span className="text-base font-bold text-emerald-600">{communityMetrics.abjPercentage}%</span>
              </div>
              <div className="p-1.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">House Index (HI)</span>
                <span className="text-base font-bold text-rose-600">{communityMetrics.houseIndex}%</span>
              </div>
              <div className="p-1.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">Total Diperiksa</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {communityMetrics.inspectedThisWeek} / {communityMetrics.totalHouses}
                </span>
              </div>
              <div className="p-1.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-500 block">Positif Jentik</span>
                <span className="text-base font-bold text-rose-600">{communityMetrics.positiveCount} Rumah</span>
              </div>
            </div>
          </div>

          {/* Table Preview */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                  <th className="py-2 px-1">No</th>
                  <th className="py-2 px-2">Tanggal</th>
                  <th className="py-2 px-2">No. Rumah</th>
                  <th className="py-2 px-2">Nama KK</th>
                  <th className="py-2 px-2 text-center">Status</th>
                  <th className="py-2 px-2">Tindakan Lapangan</th>
                  <th className="py-2 px-2">Kader</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-[11px]">
                {inspections.slice(0, 10).map((insp, index) => (
                  <tr key={insp.id}>
                    <td className="py-2 px-1">{index + 1}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{insp.inspectedAt.slice(0, 10)}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{insp.houseNumber}</td>
                    <td className="py-2 px-2 font-sans font-medium">{insp.headOfFamily}</td>
                    <td className="py-2 px-2 text-center">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-sans font-bold ${
                          insp.status === 'bebas'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {insp.status === 'bebas' ? 'Bebas' : 'POSITIF'}
                      </span>
                    </td>
                    <td className="py-2 px-2 font-sans text-slate-600 dark:text-slate-300 truncate max-w-[140px]">
                      {insp.actionPlan}
                    </td>
                    <td className="py-2 px-2 font-sans whitespace-nowrap text-slate-600 dark:text-slate-400">
                      {insp.inspectorName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signature Block */}
          <div className="mt-8 pt-4 grid grid-cols-2 text-center text-xs text-slate-800 dark:text-slate-200">
            <div>
              <p>Mengetahui,</p>
              <p className="font-semibold">Ketua RW 08 Komplek Griya Asri</p>
              <div className="h-16"></div>
              <p className="font-bold underline">Drs. H. Bambang Suhartono</p>
            </div>
            <div>
              <p>Diverifikasi oleh,</p>
              <p className="font-semibold">Sanitarian Petugas Puskesmas</p>
              <div className="h-16"></div>
              <p className="font-bold underline">dr. Ratna Dewi, Sp.KKLP</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
