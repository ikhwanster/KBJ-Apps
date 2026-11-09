import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  House,
  InspectionRecord,
  WeeklyReminder,
  NotificationItem,
  CommunityMetrics,
  DecryptedResidentData,
  SyncQueueItem,
} from '../types';
import {
  INITIAL_HOUSES,
  INITIAL_INSPECTIONS,
  INITIAL_REMINDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_DECRYPTED_DATA,
} from '../utils/initialData';
import { offlineStorage } from '../utils/offlineStorage';
import { encryptResidentData, decryptResidentData } from '../utils/crypto';
import { useAuth } from './AuthContext';

interface DataContextType {
  houses: House[];
  inspections: InspectionRecord[];
  reminders: WeeklyReminder[];
  notifications: NotificationItem[];
  isOffline: boolean;
  syncQueue: SyncQueueItem[];
  isSyncing: boolean;
  selectedRT: string;
  selectedHouseForDetail: House | null;
  selectedHouseForInspection: House | null;
  selectedHouseForReport: House | null;
  decryptedDataCache: Record<string, DecryptedResidentData>;
  isDecryptedMode: boolean;
  communityMetrics: CommunityMetrics;
  unreadNotificationsCount: number;

  // Actions
  setSelectedRT: (rt: string) => void;
  setSelectedHouseForDetail: (house: House | null) => void;
  setSelectedHouseForInspection: (house: House | null) => void;
  setSelectedHouseForReport: (house: House | null) => void;
  toggleOfflineSimulation: () => void;
  syncOfflineData: () => Promise<void>;
  recordInspection: (inspection: Omit<InspectionRecord, 'id' | 'createdAt' | 'syncStatus'>) => Promise<InspectionRecord>;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  toggleReminder: (id: string) => void;
  broadcastReminderNow: (reminderId: string) => void;
  toggleDecryptedMode: () => Promise<void>;
  getHouseDecryptedData: (houseId: string) => DecryptedResidentData | null;
  updateHouseDecryptedData: (houseId: string, data: DecryptedResidentData) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [houses, setHouses] = useState<House[]>(() => {
    return offlineStorage.getSavedHouses() || INITIAL_HOUSES;
  });

  const [inspections, setInspections] = useState<InspectionRecord[]>(() => {
    return offlineStorage.getSavedInspections() || INITIAL_INSPECTIONS;
  });

  const [reminders, setReminders] = useState<WeeklyReminder[]>(INITIAL_REMINDERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(() => offlineStorage.getSyncQueue());
  const [isOffline, setIsOffline] = useState<boolean>(() => !offlineStorage.isEffectivelyOnline());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [selectedRT, setSelectedRT] = useState<string>('ALL');
  const [selectedHouseForDetail, setSelectedHouseForDetail] = useState<House | null>(null);
  const [selectedHouseForInspection, setSelectedHouseForInspection] = useState<House | null>(null);
  const [selectedHouseForReport, setSelectedHouseForReport] = useState<House | null>(null);

  const [decryptedDataCache, setDecryptedDataCache] = useState<Record<string, DecryptedResidentData>>(INITIAL_DECRYPTED_DATA);
  const [isDecryptedMode, setIsDecryptedMode] = useState<boolean>(false);

  // Sync state to local storage
  useEffect(() => {
    offlineStorage.saveHouses(houses);
  }, [houses]);

  useEffect(() => {
    offlineStorage.saveInspections(inspections);
  }, [inspections]);

  // Network listener
  useEffect(() => {
    const handleOnline = () => {
      if (!offlineStorage.getSimulatedOffline()) {
        setIsOffline(false);
      }
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleOfflineSimulation = () => {
    const nextState = !isOffline;
    setIsOffline(nextState);
    offlineStorage.setSimulatedOffline(nextState);

    if (!nextState && syncQueue.length > 0) {
      // Reconnected! Auto-sync pending items
      syncOfflineData();
    }
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newItem: NotificationItem = {
      ...notif,
      id: 'NOTIF-' + Date.now(),
      timestamp: 'Baru saja',
      read: false,
    };
    setNotifications((prev) => [newItem, ...prev]);

    // Native browser push notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(newItem.title, {
          body: newItem.message,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Web notification failed:', e);
      }
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Record an inspection (online or offline)
  const recordInspection = async (
    inspectionData: Omit<InspectionRecord, 'id' | 'createdAt' | 'syncStatus'>
  ): Promise<InspectionRecord> => {
    const newId = 'INSP-' + Date.now().toString().slice(-6);
    const isCurrentlyOffline = isOffline;

    const newRecord: InspectionRecord = {
      ...inspectionData,
      id: newId,
      createdAt: Date.now(),
      syncStatus: isCurrentlyOffline ? 'pending_sync' : 'synced',
    };

    // Update local inspections list
    setInspections((prev) => [newRecord, ...prev]);

    // Update house status
    setHouses((prev) =>
      prev.map((h) => {
        if (h.id === newRecord.houseId) {
          return {
            ...h,
            latestStatus: newRecord.status,
            lastInspectedAt: newRecord.inspectedAt,
            lastInspectorName: newRecord.inspectorName,
            positiveContainersCount: newRecord.totalPositiveContainers,
            riskLevel:
              newRecord.status === 'positif'
                ? newRecord.totalPositiveContainers > 1
                  ? 'tinggi'
                  : 'sedang'
                : 'rendah',
          };
        }
        return h;
      })
    );

    if (isCurrentlyOffline) {
      // Add to sync queue
      const queued = offlineStorage.addToQueue({
        action: 'CREATE_INSPECTION',
        payload: newRecord,
      });
      setSyncQueue((prev) => [...prev, queued]);

      addNotification({
        title: 'Tersimpan di Penyimpanan Luring (Offline)',
        message: `Pemeriksaan ${newRecord.houseNumber} disimpan di perangkat. Akan otomatis disinkronkan saat kembali online.`,
        type: 'sync',
        houseId: newRecord.houseId,
        houseNumber: newRecord.houseNumber,
      });
    } else {
      addNotification({
        title: newRecord.status === 'positif' ? 'PERINGATAN: Jentik Ditemukan!' : 'Pemeriksaan Selesai',
        message: `${newRecord.houseNumber} (${newRecord.headOfFamily}) diperiksa: ${
          newRecord.status === 'positif'
            ? `${newRecord.totalPositiveContainers} kontainer positif jentik. Segera tindak lanjuti!`
            : 'Kondisi bersih dan bebas jentik.'
        }`,
        type: newRecord.status === 'positif' ? 'alert' : 'info',
        houseId: newRecord.houseId,
        houseNumber: newRecord.houseNumber,
      });
    }

    return newRecord;
  };

  // Synchronize offline queue
  const syncOfflineData = async (): Promise<void> => {
    const currentQueue = offlineStorage.getSyncQueue();
    if (currentQueue.length === 0) return;

    setIsSyncing(true);

    // Simulate network transmission delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Mark all pending inspections as synced
    setInspections((prev) =>
      prev.map((i) => (i.syncStatus === 'pending_sync' ? { ...i, syncStatus: 'synced' } : i))
    );

    offlineStorage.clearQueue();
    setSyncQueue([]);
    setIsSyncing(false);

    addNotification({
      title: 'Sinkronisasi Luring Berhasil',
      message: `${currentQueue.length} laporan pemeriksaan dari lapangan berhasil diunggah ke server RW 08.`,
      type: 'sync',
    });
  };

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const broadcastReminderNow = (reminderId: string) => {
    const reminder = reminders.find((r) => r.id === reminderId);
    if (!reminder) return;

    setReminders((prev) =>
      prev.map((r) =>
        r.id === reminderId ? { ...r, lastSentAt: new Date().toISOString().slice(0, 16).replace('T', ' ') } : r
      )
    );

    addNotification({
      title: `Siaran Pengingat: ${reminder.title}`,
      message: `Pesan pengingat mingguan telah disiarkan ke seluruh kontak warga di ${
        reminder.targetRT === 'all' ? 'seluruh RT (RW 08)' : reminder.targetRT
      }.`,
      type: 'reminder',
    });
  };

  const toggleDecryptedMode = async () => {
    setIsDecryptedMode((prev) => !prev);
  };

  const getHouseDecryptedData = (houseId: string): DecryptedResidentData | null => {
    if (decryptedDataCache[houseId]) {
      return decryptedDataCache[houseId];
    }
    // Fallback default mock profile
    return {
      nik: '327311' + Math.floor(1000000000 + Math.random() * 9000000000),
      residentCount: 4,
      elderlyCount: 0,
      infantCount: 0,
      pregnantCount: 0,
      dengueHistoryCount: 0,
      medicalNotes: 'Data keluarga terlindungi enkripsi AES-256 GCM standar kesehatan.',
    };
  };

  const updateHouseDecryptedData = async (houseId: string, data: DecryptedResidentData) => {
    // Re-encrypt and cache
    const encrypted = await encryptResidentData(data);
    setHouses((prev) =>
      prev.map((h) => (h.id === houseId ? { ...h, encryptedResidentData: encrypted } : h))
    );
    setDecryptedDataCache((prev) => ({ ...prev, [houseId]: data }));
  };

  // Real-time Community Metrics Calculation
  const communityMetrics = useMemo<CommunityMetrics>(() => {
    const totalHouses = houses.length;
    let inspectedCount = 0;
    let freeCount = 0;
    let positiveCount = 0;
    let pendingCount = 0;
    let totalPosContainers = 0;
    let totalCheckedContainers = 0;
    let highRiskCount = 0;

    houses.forEach((h) => {
      if (h.latestStatus === 'bebas') {
        inspectedCount++;
        freeCount++;
      } else if (h.latestStatus === 'positif') {
        inspectedCount++;
        positiveCount++;
      } else {
        pendingCount++;
      }

      if (h.riskLevel === 'tinggi') {
        highRiskCount++;
      }
      totalPosContainers += h.positiveContainersCount || 0;
    });

    inspections.forEach((insp) => {
      totalCheckedContainers += insp.totalContainersChecked || 3;
    });

    // ABJ = (Rumah Bebas Jentik / Total Rumah Diperiksa) * 100
    const abjPercentage = inspectedCount > 0 ? (freeCount / inspectedCount) * 100 : 100;
    // House Index (HI) = (Rumah Positif Jentik / Total Rumah Diperiksa) * 100
    const houseIndex = inspectedCount > 0 ? (positiveCount / inspectedCount) * 100 : 0;
    // Container Index (CI) = (Kontainer Positif / Total Kontainer Diperiksa) * 100
    const containerIndex =
      totalCheckedContainers > 0 ? (totalPosContainers / totalCheckedContainers) * 100 : 0;
    // Breteau Index (BI) = (Total Kontainer Positif / Total Rumah Diperiksa) * 100
    const breteauIndex = inspectedCount > 0 ? (totalPosContainers / inspectedCount) * 100 : 0;

    return {
      totalHouses,
      inspectedThisWeek: inspectedCount,
      freeCount,
      positiveCount,
      pendingCount,
      abjPercentage: Math.round(abjPercentage * 10) / 10,
      houseIndex: Math.round(houseIndex * 10) / 10,
      containerIndex: Math.round(containerIndex * 10) / 10,
      breteauIndex: Math.round(breteauIndex * 10) / 10,
      highRiskHousesCount: highRiskCount,
    };
  }, [houses, inspections]);

  return (
    <DataContext.Provider
      value={{
        houses,
        inspections,
        reminders,
        notifications,
        isOffline,
        syncQueue,
        isSyncing,
        selectedRT,
        selectedHouseForDetail,
        selectedHouseForInspection,
        selectedHouseForReport,
        decryptedDataCache,
        isDecryptedMode,
        communityMetrics,
        unreadNotificationsCount,
        setSelectedRT,
        setSelectedHouseForDetail,
        setSelectedHouseForInspection,
        setSelectedHouseForReport,
        toggleOfflineSimulation,
        syncOfflineData,
        recordInspection,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        toggleReminder,
        broadcastReminderNow,
        toggleDecryptedMode,
        getHouseDecryptedData,
        updateHouseDecryptedData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
