import React, { useState, useEffect, useCallback } from 'react';
import StepProgress from './components/StepProgress';
import StepName from './components/StepName';
import StepSchedule from './components/StepSchedule';
import StepLocation from './components/StepLocation';
import StepMessage from './components/StepMessage';
import StepResults from './components/StepResults';
import NarratorBubble from './components/NarratorBubble';
import PseudoLoaderModal from './components/PseudoLoaderModal';
import BackgroundEffects from './components/BackgroundEffects';
import { 
  fetchAllVotes, 
  submitVote, 
  getSupabaseCredentials, 
  getSupabaseClient 
} from './lib/supabase';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
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
  const [pseudoLoaderType, setPseudoLoaderType] = useState(null);

  // Load initial data and existing vote
  const loadVotes = useCallback(async () => {
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
          // If already voted, land on results
          setCurrentStep(5);
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
  }, [loadVotes]);

  // Handle step transitions with funny school pseudo loading screens
  const triggerTransition = (type) => {
    setPseudoLoaderType(type);
  };

  const handleLoaderFinish = () => {
    if (pseudoLoaderType === '1-to-2') {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (pseudoLoaderType === '2-to-3') {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (pseudoLoaderType === '3-to-4') {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (pseudoLoaderType === 'final-submit') {
      setCurrentStep(5);
      setHasVoted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setPseudoLoaderType(null);
  };

  // Submit vote to Supabase/localStorage
  const handleFinalSubmit = async (customMsg) => {
    setIsSubmitting(true);
    const voteData = {
      name: name.trim(),
      avatar,
      selected_slots: selectedSlots,
      selected_locations: selectedLocations,
      custom_location: customLocation.trim(),
      message: (typeof customMsg === 'string' ? customMsg : message).trim()
    };

    const res = await submitVote(voteData);
    setMyVote(res.vote);
    await loadVotes();
    setIsSubmitting(false);

    // Launch submission pseudo loader
    triggerTransition('final-submit');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-fuchsia-500 selection:text-white bg-slate-950">
      {/* Background visual effects */}
      <BackgroundEffects />

      {/* Main Container - No Navbar, No Header */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-6 sm:py-10">
        
        {/* Content Wrapper */}
        <main className="max-w-4xl w-full mx-auto px-4">
          
          {/* Minimal Non-Clickable Stepper */}
          <StepProgress currentStep={currentStep} />

          {/* Interactive Narrator Companion */}
          <NarratorBubble
            currentStep={currentStep}
            name={name}
            selectedSlotsCount={selectedSlots.length}
            selectedLocationsCount={selectedLocations.length + (customLocation ? 1 : 0)}
          />

          {/* Step 1: Name & Avatar (Mandatory) */}
          {currentStep === 1 && (
            <StepName
              name={name}
              setName={setName}
              avatar={avatar}
              setAvatar={setAvatar}
              onNext={() => triggerTransition('1-to-2')}
            />
          )}

          {/* Step 2: Doodle Schedule Grid (Mandatory >=1 Slot) */}
          {currentStep === 2 && (
            <StepSchedule
              selectedSlots={selectedSlots}
              setSelectedSlots={setSelectedSlots}
              allVotes={allVotes}
              onNext={() => triggerTransition('2-to-3')}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {/* Step 3: Locations Selection (Mandatory >=1 Location or custom) */}
          {currentStep === 3 && (
            <StepLocation
              selectedLocations={selectedLocations}
              setSelectedLocations={setSelectedLocations}
              customLocation={customLocation}
              setCustomLocation={setCustomLocation}
              onNext={() => triggerTransition('3-to-4')}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {/* Step 4: Message & Guestbook (Only step that CAN be skipped) */}
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
            />
          )}

        </main>
      </div>

      {/* Pseudo Loader Modal with school jokes - Unskippable */}
      {pseudoLoaderType && (
        <PseudoLoaderModal
          transitionType={pseudoLoaderType}
          onFinish={handleLoaderFinish}
        />
      )}
    </div>
  );
}
