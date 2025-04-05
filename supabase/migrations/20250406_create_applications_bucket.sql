
-- Create storage bucket for application resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('applications', 'Application Files', true);

-- Set up RLS policies for the applications bucket
CREATE POLICY "Anyone can read application files" 
ON storage.objects 
FOR SELECT
USING (bucket_id = 'applications');

CREATE POLICY "Authenticated users can upload application files" 
ON storage.objects 
FOR INSERT
WITH CHECK (
  bucket_id = 'applications' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own application files" 
ON storage.objects 
FOR UPDATE
USING (
  bucket_id = 'applications' 
  AND auth.uid() = owner
);

CREATE POLICY "Users can delete their own application files" 
ON storage.objects 
FOR DELETE
USING (
  bucket_id = 'applications' 
  AND auth.uid() = owner
);
