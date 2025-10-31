-- Add has_completed_tour column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS has_completed_tour BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.has_completed_tour IS 'Tracks whether user has completed the onboarding tour';
