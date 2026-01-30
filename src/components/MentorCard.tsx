import { Alumni } from '@/hooks/useAlumni';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Briefcase, Award, User, Check, Loader2 } from 'lucide-react';

interface MentorCardProps {
  alumni: Alumni;
  matchScore: number;
  explanation: string;
  rank: number;
  onSelect: () => void;
  isSelected?: boolean;
  isSelecting?: boolean;
}

export function MentorCard({ 
  alumni, 
  matchScore, 
  explanation, 
  rank,
  onSelect,
  isSelected = false,
  isSelecting = false
}: MentorCardProps) {
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-amber-500';
      case 2:
        return 'from-gray-300 to-gray-400';
      case 3:
        return 'from-amber-600 to-amber-700';
      default:
        return 'from-primary to-primary';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-success';
    if (score >= 70) return 'text-primary';
    return 'text-secondary';
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-up" style={{ animationDelay: `${rank * 100}ms` }}>
      {/* Rank badge */}
      <div className={`absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br ${getRankStyle(rank)} rotate-12 opacity-20 group-hover:opacity-30 transition-opacity`} />
      <div className={`absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br ${getRankStyle(rank)} flex items-center justify-center text-sm font-bold text-white shadow-lg`}>
        #{rank}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
            {alumni.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-lg truncate pr-12">
              {alumni.name}
            </h3>
            <p className="text-muted-foreground text-sm flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {alumni.current_job}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Match score */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Match Score</span>
          <span className={`text-2xl font-bold ${getScoreColor(matchScore)}`}>
            {matchScore}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-primary rounded-full transition-all duration-1000"
            style={{ width: `${matchScore}%` }}
          />
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Skill:</span>
            <Badge variant="secondary" className="text-xs">
              {alumni.skill}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Experience:</span>
            <span className="font-medium">{alumni.years_of_experience} years</span>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-accent/50 rounded-lg p-3">
          <p className="text-sm text-accent-foreground leading-relaxed">
            {explanation}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={onSelect}
            disabled={isSelected || isSelecting}
            className={`flex-1 ${isSelected ? 'bg-success hover:bg-success' : 'bg-gradient-primary hover:opacity-90'}`}
          >
            {isSelecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSelected ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Selected
              </>
            ) : (
              'Select as Mentor'
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            asChild
          >
            <a 
              href={alumni.linkedin_search_url} 
              target="_blank" 
              rel="noopener noreferrer"
              title="Find on LinkedIn"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
