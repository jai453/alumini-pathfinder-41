import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMentorSelection } from '@/hooks/useMentorSelection';
import { useAlumni } from '@/hooks/useAlumni';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Loader2, 
  ArrowLeft, 
  Calendar, 
  ExternalLink, 
  Briefcase, 
  Award,
  Clock,
  UserCheck
} from 'lucide-react';
import { format, addMonths } from 'date-fns';

export default function MySelections() {
  const { user, loading: authLoading } = useAuth();
  const { selections, isLoading: selectionsLoading } = useMentorSelection();
  const { data: alumni, isLoading: alumniLoading } = useAlumni();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
    }
  }, [user, authLoading, navigate]);

  const getAlumniDetails = (alumniId: number) => {
    return alumni?.find(a => a.id === alumniId);
  };

  const isLoading = authLoading || selectionsLoading || alumniLoading;

  if (isLoading) {
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/recommendations')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold">
                My Selected Mentors
              </h1>
              <p className="text-muted-foreground">
                Track your mentorship connections over time
              </p>
            </div>
          </div>

          {selections && selections.length > 0 ? (
            <div className="space-y-4">
              {selections.map((selection) => {
                const alumniDetails = getAlumniDetails(selection.alumni_id);
                const selectedDate = new Date(selection.selected_at);
                const threeMonthsLater = addMonths(selectedDate, 3);
                const isActive = new Date() < threeMonthsLater;

                return (
                  <Card key={selection.id} className="animate-slide-up">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-lg font-bold">
                            {alumniDetails?.name.split(' ').map(n => n[0]).join('').slice(0, 2) || '??'}
                          </div>
                          <div>
                            <CardTitle className="font-display text-xl">
                              {alumniDetails?.name || 'Unknown Mentor'}
                            </CardTitle>
                            <p className="text-muted-foreground text-sm flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {alumniDetails?.current_job || 'Position not available'}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={isActive ? 'default' : 'secondary'}
                          className={isActive ? 'bg-success' : ''}
                        >
                          {isActive ? 'Active' : 'Completed'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">Skill:</span>
                          <span className="font-medium">{alumniDetails?.skill}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <UserCheck className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">Experience:</span>
                          <span className="font-medium">{alumniDetails?.years_of_experience} years</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">Selected:</span>
                          <span className="font-medium">{format(selectedDate, 'MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground">Until:</span>
                          <span className="font-medium">{format(threeMonthsLater, 'MMM d, yyyy')}</span>
                        </div>
                      </div>

                      {/* Match explanation */}
                      <div className="bg-accent/50 rounded-lg p-3">
                        <p className="text-sm text-accent-foreground">
                          {selection.match_explanation}
                        </p>
                      </div>

                      {/* LinkedIn button */}
                      {alumniDetails?.linkedin_search_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="w-full sm:w-auto"
                        >
                          <a 
                            href={alumniDetails.linkedin_search_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Find on LinkedIn
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">No Mentors Selected Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get personalized recommendations and select your mentors.
                </p>
                <Button onClick={() => navigate('/recommendations')}>
                  View Recommendations
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
