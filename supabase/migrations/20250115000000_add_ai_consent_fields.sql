-- Add AI consent fields to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS ai_consent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS consent_date TIMESTAMP WITH TIME ZONE;

-- Add comment to explain the fields
COMMENT ON COLUMN applications.ai_consent IS 'Whether the applicant consented to AI processing of their application materials';
COMMENT ON COLUMN applications.consent_date IS 'When the AI consent was given by the applicant'; 