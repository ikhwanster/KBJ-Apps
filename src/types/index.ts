export type UserRole = 'kader' | 'ketua_rw' | 'petugas_puskesmas' | 'warga';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  email: string;
  phone: string;
  assignedRT?: string;
  is2FAEnabled: boolean;
  avatarUrl?: string;
}

export type ContainerType = 
  | 'bak_mandi'
  | 'dispenser'
  | 'penampungan_kulkas'
  | 'vas_bunga'
  | 'talang_air'
  | 'toren_air'
  | 'barang_bekas'
  | 'kolam_hias'
  | 'lainnya';

export interface ContainerDetail {
  type: ContainerType;
  label: string;
  count: number;
  isPositive: boolean;
  actionTaken: 'dikuras' | 'diberi_abate' | 'ditutup' | 'dibersihkan' | 'dibuang' | 'tidak_ada';
  notes?: string;
}

export interface EncryptedResidentData {
  ciphertext: string;
  iv: string;
  salt: string;
  algorithm: string;
  lastEncryptedAt: string;
}

export interface DecryptedResidentData {
  nik: string;
  residentCount: number;
  elderlyCount: number;
  infantCount: number;
  pregnantCount: number;
  dengueHistoryCount: number;
  lastDengueDate?: string;
  medicalNotes: string;
}

export interface House {
  id: string;
  houseNumber: string;
  block: 'Blok A' | 'Blok B' | 'Blok C' | 'Blok D' | 'Blok E';
  rt: 'RT 01' | 'RT 02' | 'RT 03' | 'RT 04' | 'RT 05';
  rw: 'RW 08';
  headOfFamily: string;
  phone: string;
  coords: { x: number; y: number }; // Percentage 0 - 100 on interactive map
  latestStatus: 'bebas' | 'positif' | 'belum_periksa';
  lastInspectedAt?: string;
  lastInspectorName?: string;
  riskLevel: 'rendah' | 'sedang' | 'tinggi';
  encryptedResidentData: EncryptedResidentData;
  positiveContainersCount: number;
}

export interface InspectionRecord {
  id: string;
  houseId: string;
  houseNumber: string;
  rt: string;
  rw: string;
  headOfFamily: string;
  phone: string;
  inspectedAt: string;
  inspectorId: string;
  inspectorName: string;
  inspectorRole: UserRole;
  status: 'bebas' | 'positif';
  containers: ContainerDetail[];
  totalContainersChecked: number;
  totalPositiveContainers: number;
  abatementGiven: boolean;
  photoUrl?: string;
  notes: string;
  actionPlan: string;
  syncStatus: 'synced' | 'pending_sync';
  createdAt: number;
}

export interface WeeklyReminder {
  id: string;
  title: string;
  dayOfWeek: 'Jumat' | 'Sabtu' | 'Minggu';
  time: string;
  messageTemplate: string;
  targetRT: string | 'all';
  isActive: boolean;
  lastSentAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'reminder' | 'sync' | 'info';
  timestamp: string;
  read: boolean;
  houseId?: string;
  houseNumber?: string;
}

export interface SyncQueueItem {
  id: string;
  action: 'CREATE_INSPECTION' | 'UPDATE_HOUSE_STATUS';
  payload: any;
  timestamp: number;
  retries: number;
}

export interface CommunityMetrics {
  totalHouses: number;
  inspectedThisWeek: number;
  freeCount: number;
  positiveCount: number;
  pendingCount: number;
  abjPercentage: number; // Angka Bebas Jentik: (freeCount / inspectedThisWeek) * 100
  houseIndex: number;    // HI: (positiveCount / inspectedThisWeek) * 100
  containerIndex: number;// CI: (positiveContainers / totalContainers) * 100
  breteauIndex: number;  // BI: (positiveContainers / inspectedHouses) * 100
  highRiskHousesCount: number;
}
