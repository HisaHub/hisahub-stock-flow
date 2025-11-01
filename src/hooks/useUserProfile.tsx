
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['profiles']['Row'];
type UserProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export const useUserProfile = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      // Check if user is already authenticated from the global auth state
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Use faster single query with error handling
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid errors

      if (error) {
        console.error('Error fetching profile:', error);
        toast({ title: "Error", description: "Failed to load profile", variant: "destructive" });
        setLoading(false);
        return;
      }

      if (!data) {
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
          toast({ title: "Error", description: "Failed to create user profile", variant: "destructive" });
        } else {
          setProfile(newProfile);
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast({ title: "Error", description: "Failed to load profile", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: UserProfileUpdate) => {
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
        toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
        return false;
      }

      setProfile(data);
      toast({ title: "Success", description: "Profile updated successfully" });
      return true;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
      return false;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    // Add a small delay to prevent too many rapid API calls
    const timer = setTimeout(() => {
      fetchProfile();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return {
    profile,
    loading,
    updating,
    updateProfile,
    refetchProfile: fetchProfile
  };
};
