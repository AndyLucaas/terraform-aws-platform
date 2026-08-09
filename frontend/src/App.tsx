import React, { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroBanner } from './components/catalog/HeroBanner';
import { VideoGrid } from './components/catalog/VideoGrid';
import { VideoPlayerModal } from './components/video/VideoPlayerModal';
import { ProfileSelectorModal } from './components/common/ProfileSelectorModal';
import { IngestionHub } from './components/upload/IngestionHub';
import { EnterpriseDashboard } from './components/admin/EnterpriseDashboard';
import { KeycloakAuthModal } from './components/auth/KeycloakAuthModal';
import { ElasticSearchModal } from './components/search/ElasticSearchModal';

import {
  INITIAL_PROFILES,
  MOCK_TRANSCODE_JOBS,
} from './data/mockData';

import { Video, UserProfile, TranscodeJob } from './types';

export const App: React.FC = () => {
  // Application State
  const [profiles, setProfiles] = useState<UserProfile[]>(INITIAL_PROFILES);
  const [activeProfile, setActiveProfile] = useState<UserProfile>(INITIAL_PROFILES[0]);
  //const [videos, setVideos] = useState<Video[]>(MOCK_VIDEOS);
  const [favorites, setFavorites] = useState<string[]>(['v-101', 'v-102']);
  const [transcodeJobs, setTranscodeJobs] = useState<TranscodeJob[]>(MOCK_TRANSCODE_JOBS);
  //const [telemetry, setTelemetry] = useState(INITIAL_TELEMETRY);

  // Active Category Navigation Tab ('accueil', 'films', 'series', 'tech', 'favoris')
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('accueil');

  // Modals visibility state
  const [activePlayingVideo, setActivePlayingVideo] = useState<Video | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Toggle favorite helper
  const handleToggleFavorite = (videoId: string) => {
    setFavorites(prev =>
      prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]
    );
  };

  // Add new profile helper
  const handleAddProfile = (newProfile: UserProfile) => {
    setProfiles(prev => [...prev, newProfile]);
  };

  // Add new transcode job helper
  const handleAddTranscodeJob = (newJob: TranscodeJob) => {
    setTranscodeJobs(prev => [newJob, ...prev]);
  };

  const heroVideo = videos[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      
      {/* Sticky Navigation Header */}
      <Navbar
        activeProfile={activeProfile}
        onOpenProfileSelector={() => setIsProfileModalOpen(true)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        activeTab={activeCategoryTab}
        setActiveTab={setActiveCategoryTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Cinematic Hero Banner (Displayed on Home Tab) */}
        {activeCategoryTab === 'accueil' && (
          <HeroBanner
            video={heroVideo}
            onPlay={(vid) => setActivePlayingVideo(vid)}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={favorites.includes(heroVideo.id)}
          />
        )}

        {/* Video Catalog Grid */}
        <VideoGrid
          videos={videos}
          favorites={favorites}
          onPlay={(vid) => setActivePlayingVideo(vid)}
          onToggleFavorite={handleToggleFavorite}
          activeCategory={activeCategoryTab}
        />

      </main>

      {/* Enterprise SLA Footer */}
      <Footer />

      {/* Modals & Overlay Workstations */}

      {/* 1. HLS / ABR Stream Video Player Modal */}
      <VideoPlayerModal
        video={activePlayingVideo}
        onClose={() => setActivePlayingVideo(null)}
      />

      {/* 2. User Profiles Switcher Modal */}
      <ProfileSelectorModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profiles={profiles}
        activeProfile={activeProfile}
        onSelectProfile={setActiveProfile}
        onAddProfile={handleAddProfile}
      />

      {/* 3. Ingestion & Transcoding SaaS Hub Modal */}
      <IngestionHub
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        transcodeJobs={transcodeJobs}
        onAddJob={handleAddTranscodeJob}
      />

      {/* 4. Executive Telemetry & K8s Dashboard Modal */}
      <EnterpriseDashboard
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        telemetry={telemetry}
        videos={videos}
      />

      {/* 5. Keycloak Security & Token Inspector Modal */}
      <KeycloakAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* 6. Elastic Instant Fuzzy Search Modal */}
      <ElasticSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        videos={videos}
        onPlayVideo={(vid) => setActivePlayingVideo(vid)}
      />

    </div>
  );
};
