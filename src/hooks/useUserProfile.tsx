
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  national_id: string | null;
  account_status: string | null;
  biometric_enabled: boolean | null;
  created_at: string | null;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              first_name: user.user_metadata?.first_name || null,
              last_name: user.user_metadata?.last_name || null,
            })
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            toast.error('Failed to create user profile');
          } else {
            setProfile(newProfile);
          }
        } else {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile');
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return false;

    setUpdating(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile');
        return false;
      }

      setProfile(data);
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      toast.error('Failed to update profile');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    updating,
    updateProfile,
    refetchProfile: fetchProfile
  };
};
