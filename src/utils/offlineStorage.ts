import { SyncQueueItem, InspectionRecord } from '../types';

const STORAGE_KEYS = {
  HOUSES: 'sijentik_houses_v1',
  INSPECTIONS: 'sijentik_inspections_v1',
  QUEUE: 'sijentik_sync_queue_v1',
  SIMULATED_OFFLINE: 'sijentik_simulated_offline',
  REMINDERS: 'sijentik_reminders_v1',
  NOTIFICATIONS: 'sijentik_notifications_v1',
};

export const offlineStorage = {
  getSimulatedOffline(): boolean {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.SIMULATED_OFFLINE);
      return val === 'true';
    } catch {
      return false;
    }
  },

  setSimulatedOffline(val: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SIMULATED_OFFLINE, String(val));
    } catch (e) {
      console.error(e);
    }
  },

  isEffectivelyOnline(): boolean {
    if (this.getSimulatedOffline()) return false;
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  },

  getSyncQueue(): SyncQueueItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.QUEUE);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addToQueue(item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retries'>): SyncQueueItem {
    const queue = this.getSyncQueue();
    const newItem: SyncQueueItem = {
      ...item,
      id: 'QUEUE-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
      retries: 0,
    };
    queue.push(newItem);
    localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue));
    return newItem;
  },

  clearQueue(): void {
    localStorage.removeItem(STORAGE_KEYS.QUEUE);
  },

  saveHouses(houses: any[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HOUSES, JSON.stringify(houses));
    } catch (e) {
      console.error(e);
    }
  },

  getSavedHouses(): any[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.HOUSES);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  saveInspections(inspections: InspectionRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(inspections));
    } catch (e) {
      console.error(e);
    }
  },

  getSavedInspections(): InspectionRecord[] | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.INSPECTIONS);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
};
