import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentProfile } from '@/hooks/useStudentProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { ProfileStepper } from '@/components/ProfileStepper';
import { MultiSelect } from '@/components/MultiSelect';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Loader2, Code, Compass } from 'lucide-react';
import { toast } from 'sonner';

const SKILLS_OPTIONS = [
  'Python',
  'JavaScript',
  'Java',
  'C++',
  'SQL',
  'HTML/CSS',
  'React',
  'Node.js',
  'Data Analysis',
  'Machine Learning',
  'Cloud Computing',
  'DevOps',
  'Cybersecurity',
  'Mobile Development',
  'UI/UX Design'
];

const DOMAINS_OPTIONS = [
  'Web Development',
  'Data Science',
  'Artificial Intelligence',
  'Cloud Computing',
  'Cybersecurity',
  'Mobile App Development',
  'DevOps',
  'Backend Development',
  'Frontend Development',
  'Full Stack Development',
  'Database Management',
  'Network Engineering',
  'IT Support',
  'Quality Assurance'
];

const steps = [
  { number: 1, title: 'Skills & Domains', description: 'Your expertise' },
  { number: 2, title: 'Interests & Goals', description: 'Your aspirations' },
  { number: 3, title: 'Recommendations', description: 'Your matches' }
];

export default function ProfileStep1() {
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading, updateProfile } = useStudentProfile();
  const navigate = useNavigate();
  
  const [skills, setSkills] = useState<string[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile) {
      setSkills(profile.skills || []);
      setDomains(profile.interested_domains || []);
    }
  }, [profile]);

  const handleContinue = async () => {
    if (skills.length === 0) {
      toast.error('Please select at least one skill');
      return;
    }
    if (domains.length === 0) {
      toast.error('Please select at least one domain');
      return;
    }

    setSaving(true);
    try {
      await updateProfile.mutateAsync({
        skills,
        interested_domains: domains
      });
      navigate('/profile/step-2');
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
        <ProfileStepper currentStep={1} steps={steps} />
        
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg animate-slide-up">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Tell us about yourself</CardTitle>
              <CardDescription>
                Help us understand your current skills and areas of interest
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Skills Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Current Skills</h3>
                    <p className="text-sm text-muted-foreground">
                      Select skills you're proficient in
                    </p>
                  </div>
                </div>
                <MultiSelect
                  options={SKILLS_OPTIONS}
                  selected={skills}
                  onChange={setSkills}
                  placeholder="Add your skills..."
                />
              </div>

              {/* Domains Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Compass className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Interested Domains</h3>
                    <p className="text-sm text-muted-foreground">
                      What areas do you want to explore?
                    </p>
                  </div>
                </div>
                <MultiSelect
                  options={DOMAINS_OPTIONS}
                  selected={domains}
                  onChange={setDomains}
                  placeholder="Add domains of interest..."
                />
              </div>

              {/* Continue Button */}
              <Button 
                onClick={handleContinue}
                disabled={saving}
                className="w-full bg-gradient-primary hover:opacity-90"
                size="lg"
              >
                {saving ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
