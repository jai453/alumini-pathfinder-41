import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MentorSelection {
  id: string;
  student_id: string;
  alumni_id: number;
  match_score: number;
  match_explanation: string | null;
  selected_at: string;
}

export function useMentorSelection() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: selections, isLoading } = useQuery({
    queryKey: ['mentorSelections', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('mentor_selections')
        .select('*')
        .eq('student_id', user.id)
        .order('selected_at', { ascending: false });

      if (error) throw error;
      return data as MentorSelection[];
    },
    enabled: !!user,
  });

  const selectMentor = useMutation({
    mutationFn: async ({ 
      alumniId, 
      matchScore, 
      matchExplanation 
    }: { 
      alumniId: number; 
      matchScore: number; 
      matchExplanation: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('mentor_selections')
        .insert({
          student_id: user.id,
          alumni_id: alumniId,
          match_score: matchScore,
          match_explanation: matchExplanation,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorSelections', user?.id] });
    },
  });

  return {
    selections,
    isLoading,
    selectMentor,
  };
}
