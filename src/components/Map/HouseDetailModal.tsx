import React, { useState } from 'react';
import { X, Lock, Unlock, ShieldAlert, History, Plus, Send, FileText, CheckCircle2 } from 'lucide-react';
import { House, InspectionRecord, DecryptedResidentData } from '../../types';
import { useData } from '../../context/DataContext';

interface HouseDetailModalProps {
  house: House;
  onClose: () => void;
  onStartInspection: (house: House) => void;
  onSendReport: (house: House) => void;
}

export const HouseDetailModal: React.FC<HouseDetailModalProps> = ({
  house,
  onClose,
  onStartInspection,
  onSendReport,
}) => {
  const { inspections, isDecryptedMode, toggleDecryptedMode, getHouseDecryptedData } = useData();

  const [activeTab, setActiveTab] = useState<'info' | 'medical_encrypted' | 'history'>('info');

  const houseInspections = inspections.filter((i) => i.houseId === house.id);
  const decryptedData = getHouseDecryptedData(house.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {house.rt} · {house.block}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                  house.latestStatus === 'bebas'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : house.latestStatus === 'positif'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
              >
                {house.latestStatus === 'bebas'
                  ? 'Bebas Jentik'
                  : house.latestStatus === 'positif'
                  ? 'Positif Jentik'
                  : 'Belum Diperiksa'}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {house.houseNumber} · {house.headOfFamily}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented Modal Tabs */}
        <div className="px-5 pt-3 border-b border-slate-100 dark:border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'info'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Informasi Rumah
          </button>
          <button
            onClick={() => setActiveTab('medical_encrypted')}
            className={`pb-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'medical_encrypted'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>Data Pasien & Enkripsi AES-256</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Riwayat Pemeriksaan ({houseInspections.length})
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 max-h-[65vh] overflow-y-auto space-y-4">
          {activeTab === 'info' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 block">Nomor Telepon:</span>
                  <span className="font-semibold text-slate-900 dark:text-white mt-0.5 block font-mono">
                    {house.phone}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-500 dark:text-slate-400 block">Tingkat Risiko DBD:</span>
                  <span
                    className={`font-semibold capitalize mt-0.5 block ${
                      house.riskLevel === 'tinggi'
                        ? 'text-rose-600'
                        : house.riskLevel === 'sedang'
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {house.riskLevel}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Pemeriksaan Terakhir:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {house.lastInspectedAt || 'Belum pernah diperiksa'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Kader Jumantik Terakhir:</span>
                  <span className="text-slate-800 dark:text-slate-200">{house.lastInspectorName || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Jumlah Kontainer Positif:</span>
                  <span className="font-semibold text-rose-600">{house.positiveContainersCount} wadah</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onStartInspection(house);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Catat Pemeriksaan Baru</span>
                </button>
                {house.latestStatus === 'positif' && (
                  <button
                    onClick={() => {
                      onClose();
                      onSendReport(house);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Laporan Warga</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'medical_encrypted' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900 dark:text-blue-200">
                      Enkripsi Web Crypto AES-256-GCM
                    </span>
                    <button
                      onClick={toggleDecryptedMode}
                      className="px-2 py-0.5 rounded bg-blue-600 text-white font-medium text-[11px] hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      {isDecryptedMode ? 'Kunci Kembali' : 'Buka Kunci (Dekripsi)'}
                    </button>
                  </div>
                  <p className="text-blue-800 dark:text-blue-300 mt-1">
                    Informasi medis, NIK, dan kerentanan DBD dienkripsi di peramban kader sebelum disimpan untuk menjamin kerahasiaan data pasien warga RW 08.
                  </p>
                </div>
              </div>

              {isDecryptedMode && decryptedData ? (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Nomor Induk Kependudukan (NIK):</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {decryptedData.nik}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">Anggota Keluarga</span>
                      <span className="font-bold font-mono text-sm">{decryptedData.residentCount} Jiwa</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">Balita & Bayi</span>
                      <span className="font-bold font-mono text-sm text-indigo-600">{decryptedData.infantCount}</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] text-slate-500 block">Lansia / Hamil</span>
                      <span className="font-bold font-mono text-sm text-amber-600">
                        {decryptedData.elderlyCount + (decryptedData.pregnantCount || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200">
                    <div className="flex items-center gap-1.5 font-bold">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Riwayat Kasus DBD Keluarga: {decryptedData.dengueHistoryCount} Kali</span>
                    </div>
                    {decryptedData.lastDengueDate && (
                      <p className="text-[11px] mt-0.5">Kasus terakhir: {decryptedData.lastDengueDate}</p>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block font-medium">Catatan Khusus Kesehatan:</span>
                    <p className="mt-1 p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      {decryptedData.medicalNotes}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 font-mono text-[11px] text-slate-500 space-y-1">
                  <div className="text-slate-400 font-bold mb-1">// AES-256-GCM Ciphertext Payload:</div>
                  <div className="break-all p-2 bg-slate-200 dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400">
                    {house.encryptedResidentData?.ciphertext || 'CIPHERTEXT_AES256_eK8201...99X'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Algoritma: AES-GCM (PBKDF2 SHA-256) · IV: 96-bit · Tag: 128-bit
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              {houseInspections.length > 0 ? (
                houseInspections.map((insp) => (
                  <div
                    key={insp.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-medium text-slate-500 dark:text-slate-400">
                        {insp.inspectedAt}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          insp.status === 'bebas'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        {insp.status === 'bebas' ? 'Bebas Jentik' : 'Positif Jentik'}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300">
                      <strong>Tindakan:</strong> {insp.actionPlan}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span>Kader: {insp.inspectorName}</span>
                      <span>{insp.abatementGiven ? 'Diberi Abate 1%' : 'Tanpa Abate'}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Belum ada riwayat pemeriksaan tercatat untuk rumah ini.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
