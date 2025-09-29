-- Fix critical security vulnerability in kyc_documents table
-- Add RLS policies to protect sensitive identity verification documents

-- First, make user_id NOT NULL since it's essential for security
-- We'll set a default for any existing records without user_id
UPDATE public.kyc_documents 
SET user_id = '00000000-0000-0000-0000-000000000000'::uuid 
WHERE user_id IS NULL;

-- Now make the column NOT NULL to prevent future security issues
ALTER TABLE public.kyc_documents 
ALTER COLUMN user_id SET NOT NULL;

-- Enable RLS if not already enabled (it should be by default)
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own KYC documents
CREATE POLICY "Users can view own KYC documents" 
ON public.kyc_documents
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own KYC documents
CREATE POLICY "Users can submit own KYC documents" 
ON public.kyc_documents
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own documents (only if pending)
CREATE POLICY "Users can update own pending KYC documents" 
ON public.kyc_documents
FOR UPDATE 
USING (auth.uid() = user_id AND status = 'pending');

-- Policy 4: Users can delete their own pending documents
CREATE POLICY "Users can delete own pending KYC documents" 
ON public.kyc_documents
FOR DELETE 
USING (auth.uid() = user_id AND status = 'pending');

-- Add comment for future admin access implementation
COMMENT ON TABLE public.kyc_documents IS 'Contains sensitive identity verification documents. Admin access policies should be implemented when user roles system is added.';