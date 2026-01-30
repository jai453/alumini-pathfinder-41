import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { ProfileStepper } from '@/components/ProfileStepper';
import { MultiSelect } from '@/components/MultiSelect';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Loader2, BookOpen, Building } from 'lucide-react';
import { toast } from 'sonner';

const ACADEMIC_OPTIONS = [
  'Computer Science',
  'Data Structures & Algorithms',
  'Database Systems',
  'Software Engineering',
  'Artificial Intelligence',
  'Machine Learning',
  'Computer Networks',
  'Operating Systems',
  'Web Technologies',
  'Mobile Computing',
  'Cloud Computing',
  'Cybersecurity',
  'IoT',
  'Blockchain'
];

const INDUSTRY_OPTIONS = [
  'IT Services',
  'Product Companies',
  'Startups',
  'E-Commerce',
  'FinTech',
  'HealthTech',
  'EdTech',
  'Gaming',
  'Consulting',
  'Banking & Finance',
  'Telecommunications',
  'Government/Public Sector',
  'Research & Development',
  'Manufacturing'
];

const steps = [
  { number: 1, title: 'Skills & Domains', description: 'Your expertise' },
  { number: 2, title: 'Interests & Goals', description: 'Your aspirations' },
  { number: 3, title: 'Recommendations', description: 'Your matches' }
];

export default function ProfileStep2() {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading, updateProfile } = useStudentProfile();
  const navigate = useNavigate();
  
  const [academics, setAcademics] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setAcademics(profile.academic_interests || []);
      setIndustries(profile.preferred_industries || []);
    }
  }, [profile]);

  const handleContinue = async () => {
    if (academics.length === 0) {
      toast.error('Please select at least one academic interest');
      return;
    }
    if (industries.length === 0) {
      toast.error('Please select at least one industry');
      return;
    }

    setSaving(true);
    try {
      await updateProfile.mutateAsync({
        academic_interests: academics,
        preferred_industries: industries,
        profile_completed: true
      });
      navigate('/recommendations');
    } catch (error) {
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <ProfileStepper currentStep={2} steps={steps} />
        
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg animate-slide-up">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Academic & Career Goals</CardTitle>
              <CardDescription>
                Help us match you with the right mentors for your future
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Academic Interests */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Academic Interests</h3>
                    <p className="text-sm text-muted-foreground">
                      Subjects you're passionate about
                    </p>
                  </div>
                </div>
                <MultiSelect
                  options={ACADEMIC_OPTIONS}
                  selected={academics}
                  onChange={setAcademics}
                  placeholder="Add academic interests..."
                />
              </div>

              {/* Preferred Industries */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Building className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Preferred Industry Sectors</h3>
                    <p className="text-sm text-muted-foreground">
                      Where do you see yourself working?
                    </p>
                  </div>
                </div>
                <MultiSelect
                  options={INDUSTRY_OPTIONS}
                  selected={industries}
                  onChange={setIndustries}
                  placeholder="Add preferred industries..."
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/profile/step-1')}
                  className="flex-1"
                  size="lg"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button 
                  onClick={handleContinue}
                  disabled={saving}
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                  size="lg"
                >
                  {saving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Find Mentors
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
