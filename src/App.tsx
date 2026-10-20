import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { GisExplorer } from './components/GisExplorer';
import { PropertiesPage } from './components/PropertiesPage';
import { FieldVerificationView } from './components/FieldVerificationView';
import { HistoricalRecordsView } from './components/HistoricalRecordsView';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AboutPage } from './components/AboutPage';
import { AssetDetailModal } from './components/AssetDetailModal';
import { GeminiIntelligenceModal } from './components/GeminiIntelligenceModal';
import { AssetRecord } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'home' | 'gis' | 'properties' | 'field-verification' | 'records' | 'about' | 'admin'
  >('home');
  const [selectedAsset, setSelectedAsset] = useState<AssetRecord | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [userRole, setUserRole] = useState('Administrator');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleNavigate = (view: 'home' | 'gis' | 'properties' | 'field-verification' | 'records' | 'about' | 'admin') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAsset = (asset: AssetRecord) => {
    setSelectedAsset(asset);
  };

  return (
    <div className="min-h-screen bg-[#1A1411] text-[#F1E5CC] flex flex-col font-sans selection:bg-[#C6A15B]/30 selection:text-white">
      {/* Site-wide Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        userRole={userRole}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-x-hidden">
        {currentView === 'home' && (
          <LandingPage
            onNavigate={handleNavigate}
            onSelectSampleAsset={(id) => {
              handleNavigate('properties');
            }}
          />
        )}

        {currentView === 'gis' && (
          <GisExplorer
            onSelectAsset={handleSelectAsset}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'properties' && (
          <PropertiesPage
            onSelectAsset={handleSelectAsset}
            onNavigateToGis={() => handleNavigate('gis')}
          />
        )}

        {currentView === 'field-verification' && (
          <FieldVerificationView
            onNavigateToGis={() => handleNavigate('gis')}
          />
        )}

        {currentView === 'records' && <HistoricalRecordsView />}

        {currentView === 'admin' && (
          !isAdminLoggedIn ? (
            <AdminLoginPage
              onLogin={(role) => {
                setUserRole(role);
                setIsAdminLoggedIn(true);
              }}
              onNavigateHome={() => handleNavigate('home')}
            />
          ) : (
            <AdminDashboard
              userRole={userRole}
              onSwitchRole={setUserRole}
              onSelectAsset={handleSelectAsset}
              onLogout={() => setIsAdminLoggedIn(false)}
            />
          )
        )}

        {currentView === 'about' && (
          <AboutPage onNavigateToGis={() => handleNavigate('gis')} />
        )}
      </main>

      {/* Site-wide Footer (Shown on landing and informational pages) */}
      {currentView !== 'gis' && <Footer onNavigate={handleNavigate} />}

      {/* Asset Detail Dossier Modal */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onNavigateToGis={() => {
            setSelectedAsset(null);
            handleNavigate('gis');
          }}
        />
      )}

      {/* Gemini Multimodal Intelligence Modal */}
      <GeminiIntelligenceModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />
    </div>
  );
}
