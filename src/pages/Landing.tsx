import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { ArrowRight, Sparkles, Users, Target, GraduationCap } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: 'AI-Powered Matching',
      description: 'Our Random Forest algorithm finds mentors aligned with your skills and goals.'
    },
    {
      icon: Users,
      title: '100+ Alumni Network',
      description: 'Connect with experienced professionals from diverse industries.'
    },
    {
      icon: Sparkles,
      title: 'Personalized Insights',
      description: 'Get detailed explanations for why each mentor is recommended.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero overflow-hidden">
      {/* Header */}
      <header className="container py-6">
        <div className="flex items-center justify-between">
          <Logo className="text-primary-foreground" />
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate('/signin')}
            >
              Sign In
            </Button>
            <Button 
              className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="container">
        <div className="py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-6 animate-fade-in">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
              <span className="text-sm text-primary-foreground/90">KLU Alumni Mentorship Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-primary-foreground leading-tight mb-6 animate-slide-up">
              Find Your Perfect
              <span className="text-gradient-hero block">Alumni Mentor</span>
            </h1>
            
            <p className="text-lg text-primary-foreground/70 mb-8 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              Connect with experienced KLU alumni who match your skills, interests, and career aspirations using our AI-powered recommendation system.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Button 
                size="lg"
                className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 shadow-xl"
                onClick={() => navigate('/signup')}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => navigate('/signin')}
              >
                Already have an account?
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="pb-20">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-primary-foreground/5 backdrop-blur border border-primary-foreground/10 rounded-2xl p-6 text-center animate-slide-up"
                style={{ animationDelay: `${300 + index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-primary-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-primary-foreground/60">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container py-8 border-t border-primary-foreground/10">
        <p className="text-center text-sm text-primary-foreground/50">
          © 2026 Alumino. Built for KLU Hackathon.
        </p>
      </footer>
    </div>
  );
}
