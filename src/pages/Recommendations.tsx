import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { useAlumni } from '@/hooks/useAlumni';
import { useMentorSelection } from '@/hooks/useMentorSelection';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { ProfileStepper } from '@/components/ProfileStepper';
import { MentorCard } from '@/components/MentorCard';
import { Button } from '@/components/ui/button';
import { getTopRecommendations } from '@/lib/matchingAlgorithm';
import { Loader2, Sparkles, RefreshCw, History } from 'lucide-react';
import { toast } from 'sonner';

const steps = [
  { number: 1, title: 'Skills & Domains', description: 'Your expertise' },
  { number: 2, title: 'Interests & Goals', description: 'Your aspirations' },
  { number: 3, title: 'Recommendations', description: 'Your matches' }
];

export default function Recommendations() {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useStudentProfile();
  const { data: alumni, isLoading: alumniLoading } = useAlumni();
  const { selections, selectMentor, isLoading: selectionsLoading } = useMentorSelection();
  const navigate = useNavigate();
  
  const [selectingId, setSelectingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
    }
  }, [user, authLoading, navigate]);

  // Calculate recommendations using ML algorithm
  const recommendations = useMemo(() => {
    if (!profile || !alumni || alumni.length === 0) return [];
    
    const studentProfile = {
      skills: profile.skills || [],
      interested_domains: profile.interested_domains || [],
      academic_interests: profile.academic_interests || [],
      preferred_industries: profile.preferred_industries || []
    };

    return getTopRecommendations(studentProfile, alumni, 3);
  }, [profile, alumni]);

  const handleSelectMentor = async (alumniId: number, matchScore: number, explanation: string) => {
    setSelectingId(alumniId);
    try {
      await selectMentor.mutateAsync({
        alumniId,
        matchScore,
        matchExplanation: explanation
      });
      toast.success('Mentor selected successfully! You can view your selections anytime.');
    } catch (error: any) {
      if (error?.code === '23505') {
        toast.error('You have already selected this mentor');
      } else {
        toast.error('Failed to select mentor');
      }
    } finally {
      setSelectingId(null);
    }
  };

  const isAlumniSelected = (alumniId: number) => {
    return selections?.some(s => s.alumni_id === alumniId) || false;
  };

  const isLoading = authLoading || profileLoading || alumniLoading || selectionsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Finding your perfect mentors...</p>
      </div>
    );
  }

  if (!profile?.profile_completed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <h2 className="text-2xl font-display font-bold mb-4">Complete Your Profile First</h2>
          <p className="text-muted-foreground mb-6">
            Please complete your profile to get personalized mentor recommendations.
          </p>
          <Button onClick={() => navigate('/profile/step-1')}>
            Complete Profile
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <ProfileStepper currentStep={3} steps={steps} />
        
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Recommendations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold mb-3">
              Your Top 3 Mentor Matches
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Based on your skills, interests, and career goals, we've found these mentors who can guide your journey.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/profile/step-1')}
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/my-selections')}
              size="sm"
            >
              <History className="h-4 w-4 mr-2" />
              View My Selections
            </Button>
          </div>

          {/* Mentor Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {recommendations.map((match, index) => (
              <MentorCard
                key={match.alumni.id}
                alumni={match.alumni}
                matchScore={match.matchScore}
                explanation={match.explanation}
                rank={index + 1}
                onSelect={() => handleSelectMentor(
                  match.alumni.id,
                  match.matchScore,
                  match.explanation
                )}
                isSelected={isAlumniSelected(match.alumni.id)}
                isSelecting={selectingId === match.alumni.id}
              />
            ))}
          </div>

          {/* Info section */}
          <div className="mt-12 p-6 bg-accent/50 rounded-2xl">
            <h3 className="font-display font-semibold text-lg mb-2">How Our Matching Works</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Our Random Forest algorithm analyzes multiple factors including your technical skills, 
              domain interests, academic background, and career preferences. It compares these with 
              each alumni's expertise, current role, and industry experience to calculate a 
              compatibility score. The top 3 matches represent the mentors most aligned with your 
              professional growth trajectory.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
