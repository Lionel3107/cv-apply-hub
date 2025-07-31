-- Fix Database Permissions for Edge Functions
-- This script resolves the "Write: FAIL" issue in the dashboard

-- Option 1: Disable RLS on applications table (Quick fix)
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;

-- Option 2: Create policies that allow Edge Functions to write (Alternative)
-- Uncomment the lines below if you want to keep RLS enabled

-- CREATE POLICY "Enable update for edge functions" ON applications
-- FOR UPDATE USING (true)
-- WITH CHECK (true);

-- CREATE POLICY "Enable select for edge functions" ON applications
-- FOR SELECT USING (true);

-- Verify the fix
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'applications'; 