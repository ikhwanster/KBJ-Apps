/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { TopNavbar } from './components/Navigation/TopNavbar';
import { MobileBottomNav } from './components/Navigation/MobileBottomNav';
import { AnalyticsDashboard } from './components/Dashboard/AnalyticsDashboard';
import { NeighborhoodMap } from './components/Map/NeighborhoodMap';
import { InspectionHistoryList } from './components/Inspection/InspectionHistoryList';
import { ReminderManager } from './components/Notifications/ReminderManager';
import { CitizenReportsHub } from './components/CitizenReport/CitizenReportsHub';
import { QuickInspectionModal } from './components/Inspection/QuickInspectionModal';
import { HouseDetailModal } from './components/Map/HouseDetailModal';
import { AutomatedReportModal } from './components/CitizenReport/AutomatedReportModal';
import { ExportModal } from './components/Export/ExportModal';
import { NotificationDrawer } from './components/Notifications/NotificationDrawer';
import { LoginModal } from './components/Auth/LoginModal';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState<boolean>(false);
  const [isQuickInspectModalOpen, setIsQuickInspectModalOpen] = useState<boolean>(false);

  const {
    houses,
    selectedHouseForDetail,
    setSelectedHouseForDetail,
    selectedHouseForInspection,
    setSelectedHouseForInspection,
    selectedHouseForReport,
    setSelectedHouseForReport,
  } = useData();

  const handleStartInspectionFromDetail = (house: any) => {
    setSelectedHouseForInspection(house);
  };

  const handleSendReportFromDetail = (house: any) => {
    setSelectedHouseForReport(house);
  };

  const handleSendReportFromHistory = (houseId: string) => {
    const targetHouse = houses.find((h) => h.id === houseId) || houses[0];
    setSelectedHouseForReport(targetHouse);
  };

  const handleSelectHouseFromNotification = (houseId: string) => {
    const targetHouse = houses.find((h) => h.id === houseId);
    if (targetHouse) {
      setSelectedHouseForDetail(targetHouse);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <TopNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
      />

      {/* Main Container Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8">
        {activeTab === 'dashboard' && (
          <AnalyticsDashboard
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenQuickInspect={() => setIsQuickInspectModalOpen(true)}
            onOpenExport={() => setIsExportModalOpen(true)}
          />
        )}

        {activeTab === 'map' && <NeighborhoodMap />}

        {activeTab === 'inspections' && (
          <InspectionHistoryList
            onStartInspection={() => setIsQuickInspectModalOpen(true)}
            onSendReport={handleSendReportFromHistory}
          />
        )}

        {activeTab === 'reminders' && <ReminderManager />}

        {activeTab === 'reports' && (
          <CitizenReportsHub
            onOpenReportModal={(house) => setSelectedHouseForReport(house)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickInspect={() => setIsQuickInspectModalOpen(true)}
      />

      {/* Modals & Drawers */}
      {(isQuickInspectModalOpen || selectedHouseForInspection) && (
        <QuickInspectionModal
          initialHouse={selectedHouseForInspection}
          onClose={() => {
            setIsQuickInspectModalOpen(false);
            setSelectedHouseForInspection(null);
          }}
        />
      )}

      {selectedHouseForDetail && (
        <HouseDetailModal
          house={selectedHouseForDetail}
          onClose={() => setSelectedHouseForDetail(null)}
          onStartInspection={handleStartInspectionFromDetail}
          onSendReport={handleSendReportFromDetail}
        />
      )}

      {selectedHouseForReport && (
        <AutomatedReportModal
          house={selectedHouseForReport}
          onClose={() => setSelectedHouseForReport(null)}
        />
      )}

      {isExportModalOpen && (
        <ExportModal onClose={() => setIsExportModalOpen(false)} />
      )}

      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onSelectHouse={handleSelectHouseFromNotification}
      />

      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainAppContent />
      </DataProvider>
    </AuthProvider>
  );
}
