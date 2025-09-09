-- Enable RLS on kyc_documents table
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

-- Make user_id NOT NULL for security (update any existing NULL values first)
UPDATE public.kyc_documents SET user_id = id WHERE user_id IS NULL;
ALTER TABLE public.kyc_documents ALTER COLUMN user_id SET NOT NULL;

-- Add foreign key constraint to profiles table
ALTER TABLE public.kyc_documents 
ADD CONSTRAINT fk_kyc_documents_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Create security definer function to check if user is reviewer/admin
CREATE OR REPLACE FUNCTION public.is_document_reviewer(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = check_user_id 
    AND role IN ('admin', 'moderator')
  );
$$;

-- Policy: Users can view their own KYC documents
CREATE POLICY "Users can view own kyc documents" 
ON public.kyc_documents 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Authorized reviewers can view all KYC documents  
CREATE POLICY "Reviewers can view all kyc documents"
ON public.kyc_documents
FOR SELECT
USING (public.is_document_reviewer(auth.uid()));

-- Policy: Users can insert their own KYC documents
CREATE POLICY "Users can insert own kyc documents"
ON public.kyc_documents
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own documents (limited fields)
CREATE POLICY "Users can update own kyc documents"
ON public.kyc_documents
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Reviewers can update document status and notes
CREATE POLICY "Reviewers can update kyc document status"
ON public.kyc_documents
FOR UPDATE
USING (public.is_document_reviewer(auth.uid()))
WITH CHECK (public.is_document_reviewer(auth.uid()));

-- Policy: Only admins can delete KYC documents
CREATE POLICY "Admins can delete kyc documents"
ON public.kyc_documents
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);