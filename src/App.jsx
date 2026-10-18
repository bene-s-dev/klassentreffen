import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StepProgress from './components/StepProgress';
import StepName from './components/StepName';
import StepSchedule from './components/StepSchedule';
import StepLocation from './components/StepLocation';
import StepMessage from './components/StepMessage';
import StepResults from './components/StepResults';
import NarratorBubble from './components/NarratorBubble';
import PseudoLoaderModal from './components/PseudoLoaderModal';
import SupabaseModal from './components/SupabaseModal';
import BackgroundEffects from './components/BackgroundEffects';
import { 
  fetchAllVotes, 
  submitVote, 
  getSupabaseCredentials, 
  getSupabaseClient 
} from './lib/supabase';
import { sounds } from './lib/sounds';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(1);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('😎');
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [customLocation, setCustomLocation] = useState('');
  const [message, setMessage] = useState('');

  const [allVotes, setAllVotes] = useState([]);
  const [myVote, setMyVote] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [pseudoLoaderType, setPseudoLoaderType] = useState(null);

  // Load initial data and existing vote
  const loadVotes = useCallback(async () => {
    const creds = getSupabaseCredentials();
    setIsSupabaseConnected(creds.isConfigured);

    const votes = await fetchAllVotes();
    setAllVotes(votes);

    // Check if user already voted in this browser
    if (typeof window !== 'undefined') {
      const savedMyVote = localStorage.getItem('klassentreffen_my_vote');
      if (savedMyVote) {
        try {
          const parsed = JSON.parse(savedMyVote);
          setMyVote(parsed);
          setHasVoted(true);
          setName(parsed.name || '');
          setAvatar(parsed.avatar || '😎');
          setSelectedSlots(parsed.selected_slots || []);
          setSelectedLocations(parsed.selected_locations || []);
          setCustomLocation(parsed.custom_location || '');
          setMessage(parsed.message || '');
          setMaxUnlockedStep(5);
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    loadVotes();
  }, [loadVotes]);

  // Supabase Realtime channel setup
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) return;

    try {
      const channel = client
        .channel('public:votes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, () => {
          loadVotes();
        })
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    } catch {}
  }, [loadVotes, isSupabaseConnected]);

  // Handle step transitions with funny pseudo loading screens
  const triggerTransition = (type, nextStep) => {
    setPseudoLoaderType(type);
    // On loader finish, nextStep is set
  };

  const handleLoaderFinish = () => {
    if (pseudoLoaderType === '1-to-2') {
      setCurrentStep(2);
      setMaxUnlockedStep(prev => Math.max(prev, 2));
    } else if (pseudoLoaderType === '2-to-3') {
      setCurrentStep(3);
      setMaxUnlockedStep(prev => Math.max(prev, 3));
    } else if (pseudoLoaderType === '3-to-4') {
      setCurrentStep(4);
      setMaxUnlockedStep(prev => Math.max(prev, 4));
    } else if (pseudoLoaderType === 'final-submit') {
      setCurrentStep(5);
      setMaxUnlockedStep(5);
      setHasVoted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setPseudoLoaderType(null);
  };

  // Submit vote to Supabase/localStorage
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const voteData = {
      name: name.trim(),
      avatar,
      selected_slots: selectedSlots,
      selected_locations: selectedLocations,
      custom_location: customLocation.trim(),
      message: message.trim()
    };

    const res = await submitVote(voteData);
    setMyVote(res.vote);
    await loadVotes();
    setIsSubmitting(false);

    // Launch celebratory submission pseudo loader
    triggerTransition('final-submit', 5);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-fuchsia-500 selection:text-white">
      {/* Background visual effects */}
      <BackgroundEffects />

      {/* Main Container */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Sticky Header Navbar */}
        <Navbar
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          votesCount={allVotes.length}
          isSupabaseConnected={isSupabaseConnected}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          hasVoted={hasVoted}
        />

        {/* Content Wrapper */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-6 sm:pt-8 pb-12">
          
          {/* Animated Stepper Progress */}
          <StepProgress
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            maxUnlockedStep={maxUnlockedStep}
          />

          {/* Interactive Narrator / Bot Speech Bubble */}
          <NarratorBubble
            currentStep={currentStep}
            name={name}
            selectedSlotsCount={selectedSlots.length}
            selectedLocationsCount={selectedLocations.length + (customLocation ? 1 : 0)}
          />

          {/* Step 1: Name & Avatar */}
          {currentStep === 1 && (
            <StepName
              name={name}
              setName={setName}
              avatar={avatar}
              setAvatar={setAvatar}
              onNext={() => triggerTransition('1-to-2', 2)}
            />
          )}

          {/* Step 2: Doodle Schedule Grid */}
          {currentStep === 2 && (
            <StepSchedule
              selectedSlots={selectedSlots}
              setSelectedSlots={setSelectedSlots}
              allVotes={allVotes}
              onNext={() => triggerTransition('2-to-3', 3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {/* Step 3: Locations Selection */}
          {currentStep === 3 && (
            <StepLocation
              selectedLocations={selectedLocations}
              setSelectedLocations={setSelectedLocations}
              customLocation={customLocation}
              setCustomLocation={setCustomLocation}
              onNext={() => triggerTransition('3-to-4', 4)}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {/* Step 4: Message & Guestbook */}
          {currentStep === 4 && (
            <StepMessage
              message={message}
              setMessage={setMessage}
              name={name}
              avatar={avatar}
              selectedSlots={selectedSlots}
              selectedLocations={selectedLocations}
              customLocation={customLocation}
              onSubmit={handleFinalSubmit}
              onBack={() => setCurrentStep(3)}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Step 5: Live Results & Heatmap */}
          {currentStep === 5 && (
            <StepResults
              allVotes={allVotes}
              myVote={myVote}
              onEditVote={() => setCurrentStep(1)}
              onRefresh={loadVotes}
              isSupabaseConnected={isSupabaseConnected}
            />
          )}

        </main>
      </div>

      {/* Pseudo Loader Modal with funny math/tech logs */}
      {pseudoLoaderType && (
        <PseudoLoaderModal
          transitionType={pseudoLoaderType}
          onFinish={handleLoaderFinish}
        />
      )}

      {/* Supabase Connection & SQL Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigSaved={loadVotes}
      />
    </div>
  );
}
