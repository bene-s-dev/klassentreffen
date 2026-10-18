import React, { useState, useEffect, useCallback } from 'react';
import StepName from './components/StepName';
import StepSchedule from './components/StepSchedule';
import StepLocation from './components/StepLocation';
import StepMessage from './components/StepMessage';
import StepResults from './components/StepResults';
import PseudoLoaderModal from './components/PseudoLoaderModal';
import BackgroundEffects from './components/BackgroundEffects';
import HeroTitle from './components/HeroTitle';
import { 
  fetchAllVotes, 
  submitVote, 
  deleteVote,
  getSupabaseClient 
} from './lib/supabase';
import { sounds } from './lib/sounds';
import confetti from 'canvas-confetti';

const getStoredVote = () => {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('klassentreffen_my_vote');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (parsed && String(parsed.id).startsWith('mock-')) {
      localStorage.removeItem('klassentreffen_my_vote');
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export default function App() {
  const initialVote = getStoredVote();
  const [currentStep, setCurrentStep] = useState(initialVote ? 5 : 1);
  const [name, setName] = useState(initialVote?.name || '');
  const [selectedSlots, setSelectedSlots] = useState(initialVote?.selected_slots || []);
  const [selectedLocations, setSelectedLocations] = useState(initialVote?.selected_locations || []);
  const [customLocation, setCustomLocation] = useState(initialVote?.custom_location || '');
  const [message, setMessage] = useState(initialVote?.message || '');

  const [allVotes, setAllVotes] = useState([]);
  const [myVote, setMyVote] = useState(initialVote);
  const [hasVoted, setHasVoted] = useState(Boolean(initialVote));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pseudoLoaderType, setPseudoLoaderType] = useState(null);

  // Device lock guard: if an answer is already submitted on this device, lock to results page (step 5)
  useEffect(() => {
    if (hasVoted && currentStep !== 5) {
      setCurrentStep(5);
    }
  }, [hasVoted, currentStep]);

  // Load initial data and existing vote
  const loadVotes = useCallback(async () => {
    const votes = await fetchAllVotes();
    setAllVotes(votes);

    const savedMyVote = getStoredVote();
    if (savedMyVote) {
      const found = votes.find(
        v => (v.id && savedMyVote.id && v.id === savedMyVote.id) || 
             (v.name && savedMyVote.name && v.name.toLowerCase() === savedMyVote.name.toLowerCase())
      );
      const activeVote = found || savedMyVote;
      setMyVote(activeVote);
      setHasVoted(true);
      setName(activeVote.name || '');
      setSelectedSlots(activeVote.selected_slots || []);
      setSelectedLocations(activeVote.selected_locations || []);
      setCustomLocation(activeVote.custom_location || '');
      setMessage(activeVote.message || '');
      setCurrentStep(5);
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
        .channel('public:klassentreffen_votes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'klassentreffen_votes' }, () => {
          loadVotes();
        })
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    } catch {}
  }, [loadVotes]);

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

  // Submit vote to Supabase/localStorage and go directly to results
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    const voteData = {
      name: name.trim(),
      avatar: '😎',
      selected_slots: selectedSlots,
      selected_locations: selectedLocations,
      custom_location: customLocation.trim(),
      message: message.trim()
    };

    const res = await submitVote(voteData);
    setMyVote(res.vote);
    await loadVotes();
    setIsSubmitting(false);

    try {
      confetti({
        particleCount: 85,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#d946ef', '#c026d3', '#9333ea', '#a855f7', '#ec4899', '#7c3aed', '#3b82f6', '#ffffff']
      });
    } catch {}

    // Directly to results (no loader, no chat!)
    setCurrentStep(5);
    setHasVoted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete answer and return to start page
  const handleDeleteVote = async () => {
    sounds.playPop();
    const currentName = name || myVote?.name;
    const currentId = myVote?.id;

    await deleteVote(currentId, currentName);

    // Reset local state
    setName('');
    setSelectedSlots([]);
    setSelectedLocations([]);
    setCustomLocation('');
    setMessage('');
    setMyVote(null);
    setHasVoted(false);
    setCurrentStep(1);

    await loadVotes();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-fuchsia-500 selection:text-white bg-slate-950">
      <BackgroundEffects />

      {/* Main Container - No Navbar, No Header */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-6 sm:py-10">
        
        <main className="max-w-4xl w-full mx-auto px-4">
          
          {/* Step 1 Hero Header */}
          {currentStep === 1 && (
            <div className="text-center mb-6 animate-slide-in relative">
              <HeroTitle />
            </div>
          )}

          {/* Step 1: Name (Mandatory, No Emojis) */}
          {currentStep === 1 && (
            <StepName
              name={name}
              setName={setName}
              onNext={() => triggerTransition('1-to-2')}
              allVotes={allVotes}
            />
          )}

          {/* Step 2: Schedule (Mandatory >=1 Day) */}
          {currentStep === 2 && (
            <StepSchedule
              selectedSlots={selectedSlots}
              setSelectedSlots={setSelectedSlots}
              allVotes={allVotes}
              onNext={() => triggerTransition('2-to-3')}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {/* Step 3: Locations (Mandatory >=1 Location) */}
          {currentStep === 3 && (
            <StepLocation
              selectedLocations={selectedLocations}
              setSelectedLocations={setSelectedLocations}
              customLocation={customLocation}
              setCustomLocation={setCustomLocation}
              onNext={handleFinalSubmit}
              onBack={() => setCurrentStep(2)}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Step 4: Message (Can be skipped) */}
          {currentStep === 4 && (
            <StepMessage
              message={message}
              setMessage={setMessage}
              name={name}
              selectedSlots={selectedSlots}
              selectedLocations={selectedLocations}
              customLocation={customLocation}
              onSubmit={handleFinalSubmit}
              onBack={() => setCurrentStep(3)}
              isSubmitting={isSubmitting}
            />
          )}

          {/* Step 5: Live Results (Delete vote button, No share button) */}
          {currentStep === 5 && (
            <StepResults
              allVotes={allVotes}
              myVote={myVote}
              onEditVote={() => setCurrentStep(1)}
              onDeleteVote={handleDeleteVote}
              onRefresh={loadVotes}
            />
          )}

        </main>
      </div>

      {/* Pseudo Loader Modal with longer duration + funny pseudo AI typewriter window */}
      {pseudoLoaderType && (
        <PseudoLoaderModal
          transitionType={pseudoLoaderType}
          voterName={name}
          selectedSlotsCount={selectedSlots.length}
          locationsCount={selectedLocations.length + (customLocation.trim() ? 1 : 0)}
          onFinish={handleLoaderFinish}
        />
      )}
    </div>
  );
}
