import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertOctagon, Plus, Minus, Save, WifiOff, Camera } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ContainerDetail, ContainerType, House } from '../../types';

interface QuickInspectionModalProps {
  initialHouse?: House | null;
  onClose: () => void;
}

const DEFAULT_CONTAINERS: Array<{ type: ContainerType; label: string }> = [
  { type: 'bak_mandi', label: 'Bak Mandi Utama' },
  { type: 'dispenser', label: 'Tatakan Dispenser Galon' },
  { type: 'penampungan_kulkas', label: 'Baki Belakang Kulkas' },
  { type: 'vas_bunga', label: 'Vas Bunga / Pot Tanaman' },
  { type: 'talang_air', label: 'Talang Air Hujan' },
  { type: 'toren_air', label: 'Toren Penampung Air' },
  { type: 'barang_bekas', label: 'Ember / Barang Bekas Luar' },
];

export const QuickInspectionModal: React.FC<QuickInspectionModalProps> = ({
  initialHouse,
  onClose,
}) => {
  const { houses, recordInspection, isOffline, setSelectedHouseForReport } = useData();
  const { currentUser } = useAuth();

  const [selectedHouseId, setSelectedHouseId] = useState<string>(
    initialHouse ? initialHouse.id : (houses[0]?.id || '')
  );

  const [containers, setContainers] = useState<ContainerDetail[]>(() => {
    return DEFAULT_CONTAINERS.map((c) => ({
      type: c.type,
      label: c.label,
      count: 1,
      isPositive: false,
      actionTaken: 'tidak_ada',
      notes: '',
    }));
  });

  const [abatementGiven, setAbatementGiven] = useState<boolean>(false);
  const [actionPlan, setActionPlan] = useState<string>('Pembersihan rutin dan pengurasan berkala.');
  const [notes, setNotes] = useState<string>('Warga kooperatif dan menerima edukasi PSN 3M Plus.');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Selected house object
  const currentHouse = houses.find((h) => h.id === selectedHouseId) || initialHouse || houses[0];

  const totalPositiveContainers = containers.filter((c) => c.isPositive).length;
  const isOverallPositive = totalPositiveContainers > 0;

  const updateContainer = (index: number, updates: Partial<ContainerDetail>) => {
    setContainers((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentHouse) return;

    setIsSubmitting(true);

    try {
      const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');

      const record = await recordInspection({
        houseId: currentHouse.id,
        houseNumber: currentHouse.houseNumber,
        rt: currentHouse.rt,
        rw: currentHouse.rw,
        headOfFamily: currentHouse.headOfFamily,
        phone: currentHouse.phone,
        inspectedAt: nowStr,
        inspectorId: currentUser.id,
        inspectorName: currentUser.name,
        inspectorRole: currentUser.role,
        status: isOverallPositive ? 'positif' : 'bebas',
        containers: containers,
        totalContainersChecked: containers.reduce((acc, c) => acc + c.count, 0),
        totalPositiveContainers: totalPositiveContainers,
        abatementGiven: abatementGiven,
        actionPlan: isOverallPositive
          ? actionPlan
          : 'Kondisi sanitasi sangat baik. Menjaga kebersihan rutin.',
        notes: notes,
      });

      setIsSubmitting(false);
      onClose();

      // If positive, prompt automatic report modal for citizen
      if (isOverallPositive) {
        setSelectedHouseForReport(currentHouse);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Formulir Pemeriksaan Bebas Jentik
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pencatatan lapangan oleh Kader Jumantik · RW 08
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline indicator bar if in offline mode */}
        {isOffline && (
          <div className="px-5 py-2 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>Mode Luring Aktif: Data akan disimpan lokal dan disinkronkan otomatis saat ada koneksi.</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Target House Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Pilih Rumah / Kepala Keluarga
            </label>
            <select
              value={selectedHouseId}
              onChange={(e) => setSelectedHouseId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {houses.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.houseNumber} · {h.headOfFamily} ({h.rt})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Overall Status Preview */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
              isOverallPositive
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {isOverallPositive ? (
                <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
              <span className="font-semibold">
                Status Hasil:{' '}
                {isOverallPositive
                  ? `DITEMUKAN JENTIK (${totalPositiveContainers} Sarang)`
                  : 'RUMAH BEBAS JENTIK'}
              </span>
            </div>
            <span className="font-mono text-[11px]">
              {totalPositiveContainers} Positif
            </span>
          </div>

          {/* Container Checklist Table */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Pemeriksaan Wadah & Tempat Penampungan Air (TPA)
            </label>
            <div className="space-y-2">
              {containers.map((container, idx) => (
                <div
                  key={container.type}
                  className={`p-3 rounded-lg border transition-colors ${
                    container.isPositive
                      ? 'border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-medium text-slate-900 dark:text-white">
                      {container.label}
                    </span>

                    {/* Toggle Positive / Bebas Button */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateContainer(idx, {
                            isPositive: !container.isPositive,
                            actionTaken: !container.isPositive ? 'dikuras' : 'tidak_ada',
                          })
                        }
                        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                          container.isPositive
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                        }`}
                      >
                        {container.isPositive ? 'Positif Jentik' : 'Bebas Jentik'}
                      </button>

                      {/* Action selector if positive */}
                      {container.isPositive && (
                        <select
                          value={container.actionTaken}
                          onChange={(e) =>
                            updateContainer(idx, { actionTaken: e.target.value as any })
                          }
                          className="px-2 py-1 text-xs rounded border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                        >
                          <option value="dikuras">Langsung Dikuras</option>
                          <option value="diberi_abate">Ditaburi Abate</option>
                          <option value="ditutup">Ditutup Rapat</option>
                          <option value="dibersihkan">Dibersihkan</option>
                          <option value="dibuang">Daur Ulang/Buang</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Abate & Action Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <input
                type="checkbox"
                id="abateCheck"
                checked={abatementGiven}
                onChange={(e) => setAbatementGiven(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="abateCheck" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                Berikan Bubuk Larvasida (Abate 1%)
              </label>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500">
              <Camera className="w-4 h-4 text-slate-400" />
              <span>Lampirkan Foto Sarang (Opsional)</span>
            </div>
          </div>

          {/* Action Plan Textarea */}
          {isOverallPositive && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Rekomendasi Tindakan Warga (PSN 3M Plus)
              </label>
              <textarea
                value={actionPlan}
                onChange={(e) => setActionPlan(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="Misal: Kuras bak mandi tiap 5 hari, pasang kasa kawat pada talang..."
              />
            </div>
          )}

          {/* Catatan Lapangan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Catatan Kader Jumantik
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              placeholder="Catatan respon warga atau kondisi lingkungan..."
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isOffline ? 'Simpan di Perangkat (Luring)' : 'Simpan & Publikasikan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
