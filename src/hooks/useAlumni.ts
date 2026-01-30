import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Alumni {
  id: number;
  name: string;
  skill: string;
  current_job: string;
  years_of_experience: number;
  linkedin_search_url: string;
}

export function useAlumni() {
  return useQuery({
    queryKey: ['alumni'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Alumni[];
    },
  });
}
