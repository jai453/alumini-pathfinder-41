import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface StudentProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  skills: string[];
  interested_domains: string[];
  academic_interests: string[];
  preferred_industries: string[];
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

export function useStudentProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['studentProfile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as StudentProfile | null;
    },
    enabled: !!user,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<StudentProfile>) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('student_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studentProfile', user?.id] });
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile,
  };
}
