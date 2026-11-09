import React, { useState } from 'react';
import { X, Send, Copy, Check, Printer, AlertTriangle, MessageSquare, PhoneCall } from 'lucide-react';
import { House, InspectionRecord } from '../../types';
import { useData } from '../../context/DataContext';

interface AutomatedReportModalProps {
  house: House;
  onClose: () => void;
}

export const AutomatedReportModal: React.FC<AutomatedReportModalProps> = ({ house, onClose }) => {
  const { inspections, addNotification } = useData();
  const [copied, setCopied] = useState(false);
  const [sentStatus, setSentStatus] = useState<string | null>(null);

  // Find latest inspection for this house
  const latestInspection =
    inspections.find((i) => i.houseId === house.id) || inspections[0];

  const positiveContainers = latestInspection?.containers.filter((c) => c.isPositive) || [];

  const positiveSummary = positiveContainers.length > 0
    ? positiveContainers.map((c) => `• ${c.label} (${c.actionTaken})`).join('\n')
    : '• Wadah penampungan air pekarangan';

  // Courteous Indonesian automated message text
  const reportMessage = `*PEMBERITAHUAN PEMANTAUAN JENTIK RUTIN (PSN 3M PLUS)*
*PENGURUS RW 08 & KADER JUMANTIK*
--------------------------------------------------
Kepada Yth:
*${house.headOfFamily}*
Alamat: *${house.houseNumber} (${house.rt} / RW 08)*

Berdasarkan pemeriksaan lapangan berkala oleh Kader Jumantik pada *${house.lastInspectedAt || 'Hari Ini'}*, kami menemukan adanya jentik nyamuk *Aedes aegypti* pada:
${positiveSummary}

*TINDAKAN YANG TELAH / PERLU DILAKUKAN (3M PLUS):*
1. *MENGURAS:* Bersihkan & sikat dinding wadah air minimal 1x seminggu.
2. *MENUTUP:* Pastikan toren / drum penampungan air tertutup rapat.
3. *MENDAUR ULANG:* Singkirkan barang bekas di pekarangan yang berpotensi menampung air hujan.
4. *PLUS:* Taburkan bubuk Abate pada wadah yang sulit dikuras atau pelihara ikan pemakan jentik.

Mari bersama kita lindungi keluarga dan tetangga dari bahaya Demam Berdarah Dengue (DBD). Pemeriksaan ulang akan dilakukan 3 hari ke depan.

Terima kasih atas kerja sama dan kepedulian Bpk/Ibu.
_Salam Sehat, Tim Kader Jumantik RW 08_`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    const cleanPhone = house.phone.replace(/[^0-9]/g, '');
    const intlPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const encoded = encodeURIComponent(reportMessage);
    const waUrl = `https://api.whatsapp.com/send?phone=${intlPhone}&text=${encoded}`;
    
    window.open(waUrl, '_blank');
    setSentStatus('Laporan otomatis berhasil diarahkan ke WhatsApp warga.');

    addNotification({
      title: `Laporan Otomatis Terkirim (${house.houseNumber})`,
      message: `Surat pemberitahuan temuan jentik telah dikirimkan ke kontak ${house.headOfFamily}.`,
      type: 'info',
      houseId: house.id,
      houseNumber: house.houseNumber,
    });
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sistem Laporan Otomatis Warga
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pemberitahuan ramah & rekomendasi 3M Plus untuk rumah dengan jentik
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

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {sentStatus && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{sentStatus}</span>
            </div>
          )}

          {/* Citizen Target Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Nomor Rumah: {house.houseNumber} ({house.rt})
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {house.headOfFamily}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300 block">
                  {house.phone}
                </span>
                <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                  {positiveContainers.length} Sarang Jentik
                </span>
              </div>
            </div>
          </div>

          {/* Formatted Message Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Format Pesan Otomatis (WhatsApp / Surat Resmi)
              </span>
              <button
                onClick={handleCopy}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
              </button>
            </div>
            <pre className="p-3.5 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto">
              {reportMessage}
            </pre>
          </div>

          {/* Dispatch Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            <button
              onClick={handleSendWhatsApp}
              className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Kirim via WhatsApp</span>
            </button>

            <button
              onClick={handlePrintSlip}
              className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Lembar Fisik</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
