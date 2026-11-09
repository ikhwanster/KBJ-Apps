import { InspectionRecord, House, CommunityMetrics } from '../types';

/**
 * Exports inspection records to a standard CSV file with UTF-8 BOM for Excel compatibility.
 */
export function exportToCSV(inspections: InspectionRecord[], filename = 'Laporan_Pemeriksaan_Jumantik_RW08.csv'): void {
  const headers = [
    'No',
    'ID Laporan',
    'Tanggal Pemeriksaan',
    'Blok & No Rumah',
    'RT',
    'RW',
    'Nama Kepala Keluarga',
    'No Telepon',
    'Status Jentik',
    'Total Kontainer Diperiksa',
    'Kontainer Positif Jentik',
    'Diberikan Abate',
    'Rincian Kontainer',
    'Tindakan Kader',
    'Nama Kader Pemeriksa',
    'Status Sinkronisasi',
    'Catatan Lapangan',
  ];

  const rows = inspections.map((insp, index) => {
    const containerSummary = insp.containers
      .map((c) => `${c.label} (${c.isPositive ? 'Positif' : 'Negatif'} - ${c.actionTaken})`)
      .join('; ');

    return [
      index + 1,
      insp.id,
      insp.inspectedAt,
      `"${insp.houseNumber}"`,
      insp.rt,
      insp.rw,
      `"${insp.headOfFamily}"`,
      `"${insp.phone}"`,
      insp.status === 'bebas' ? 'Bebas Jentik' : 'POSITIF JENTIK',
      insp.totalContainersChecked,
      insp.totalPositiveContainers,
      insp.abatementGiven ? 'Ya' : 'Tidak',
      `"${containerSummary}"`,
      `"${insp.actionPlan.replace(/"/g, '""')}"`,
      `"${insp.inspectorName}"`,
      insp.syncStatus === 'synced' ? 'Tersinkronisasi' : 'Menunggu Sinkronisasi',
      `"${insp.notes.replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers native browser print dialog for printing or saving as PDF.
 */
export function triggerPrintReport(): void {
  window.print();
}
