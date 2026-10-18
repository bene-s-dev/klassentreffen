import React, { useState, useEffect, useCallback } from 'react';
import StepProgress from './components/StepProgress';
import StepName from './components/StepName';
import StepSchedule from './components/StepSchedule';
import StepLocation from './components/StepLocation';
import StepMessage from './components/StepMessage';
import StepResults from './components/StepResults';
import PseudoLoaderModal from './components/PseudoLoaderModal';
import BackgroundEffects from './components/BackgroundEffects';
import { 
  fetchAllVotes, 
  submitVote, 
  deleteVote,
  getSupabaseClient 
} from './lib/supabase';
import { sounds } from './lib/sounds';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
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

    if (typeof window !== 'undefined') {
      const savedMyVote = localStorage.getItem('klassentreffen_my_vote');
      if (savedMyVote) {
        try {
          const parsed = JSON.parse(savedMyVote);
          setMyVote(parsed);
          setHasVoted(true);
          setName(parsed.name || '');
          setSelectedSlots(parsed.selected_slots || []);
          setSelectedLocations(parsed.selected_locations || []);
          setCustomLocation(parsed.custom_location || '');
          setMessage(parsed.message || '');
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
            <div className="text-center mb-6 animate-slide-in">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Klassentreffen 2.0
              </h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide mt-0.5">
                Orga-Tool
              </p>
              <div className="mt-1">
                <span className="text-[10px] text-fuchsia-400 font-mono tracking-wider uppercase font-semibold">
                  powered by Bene
                </span>
              </div>
            </div>
          )}

          {/* Minimal Stepper */}
          <StepProgress currentStep={currentStep} />

          {/* Step 1: Name (Mandatory, No Emojis) */}
          {currentStep === 1 && (
            <StepName
              name={name}
              setName={setName}
              onNext={() => triggerTransition('1-to-2')}
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
