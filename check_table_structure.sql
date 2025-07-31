-- Check and fix applications table structure
-- This script ensures all required columns exist and have correct types

-- 1. Check current table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'applications' 
ORDER BY ordinal_position;

-- 2. Check if required columns exist
DO $$
BEGIN
  -- Check if score column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'applications' AND column_name = 'score'
  ) THEN
    ALTER TABLE applications ADD COLUMN score INTEGER DEFAULT 0;
    RAISE NOTICE 'Added score column';
  END IF;
  
  -- Check if feedback column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'applications' AND column_name = 'feedback'
  ) THEN
    ALTER TABLE applications ADD COLUMN feedback TEXT;
    RAISE NOTICE 'Added feedback column';
  END IF;
  
  -- Check if updated_at column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'applications' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE applications ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Added updated_at column';
  END IF;
  
  -- Check if skills column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'applications' AND column_name = 'skills'
  ) THEN
    ALTER TABLE applications ADD COLUMN skills TEXT[];
    RAISE NOTICE 'Added skills column';
  END IF;
  
  -- Check if experience column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'applications' AND column_name = 'experience'
  ) THEN
    ALTER TABLE applications ADD COLUMN experience TEXT;
    RAISE NOTICE 'Added experience column';
  END IF;
  
  -- Check if education column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'applications' AND column_name = 'education'
  ) THEN
    ALTER TABLE applications ADD COLUMN education TEXT;
    RAISE NOTICE 'Added education column';
  END IF;
END $$;

-- 3. Disable RLS if not already disabled
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- 4. Verify the fix
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'applications';

-- 5. Test permissions
DO $$
DECLARE
  test_id UUID;
BEGIN
  -- Get a test application ID
  SELECT id INTO test_id FROM applications LIMIT 1;
  
  IF test_id IS NOT NULL THEN
    -- Test update
    UPDATE applications 
    SET updated_at = NOW() 
    WHERE id = test_id;
    
    RAISE NOTICE 'Update test successful for application: %', test_id;
  ELSE
    RAISE NOTICE 'No applications found for testing';
  END IF;
END $$; 