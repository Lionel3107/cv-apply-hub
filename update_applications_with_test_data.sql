-- Update existing applications with test data for CV analysis
-- This will help test the Edge Function with realistic data

-- First, let's see what applications we have
SELECT 
  id, 
  name, 
  email, 
  skills, 
  experience, 
  education,
  score,
  feedback
FROM applications 
LIMIT 5;

-- Update applications with test data
UPDATE applications 
SET 
  skills = ARRAY['JavaScript', 'React', 'Node.js', 'TypeScript'],
  experience = '3 years of software development experience with focus on web technologies. Worked on multiple projects using React and Node.js.',
  education = 'Bachelor of Science in Computer Science from University of Technology',
  updated_at = NOW()
WHERE 
  skills IS NULL 
  AND experience IS NULL 
  AND education IS NULL;

-- Update a few more with different test data
UPDATE applications 
SET 
  skills = ARRAY['Python', 'Django', 'PostgreSQL', 'AWS'],
  experience = '5 years of backend development experience. Expert in Python and Django framework. Led development of multiple web applications.',
  education = 'Master of Computer Science from Engineering School',
  updated_at = NOW()
WHERE 
  id IN (
    SELECT id FROM applications 
    WHERE skills IS NULL 
    LIMIT 2
  );

-- Update another set with different data
UPDATE applications 
SET 
  skills = ARRAY['Java', 'Spring Boot', 'MySQL', 'Docker'],
  experience = '4 years of enterprise software development. Specialized in Java Spring Boot applications and microservices architecture.',
  education = 'Bachelor in Software Engineering',
  updated_at = NOW()
WHERE 
  id IN (
    SELECT id FROM applications 
    WHERE skills IS NULL 
    LIMIT 2
  );

-- Verify the updates
SELECT 
  id, 
  name, 
  email, 
  skills, 
  experience, 
  education,
  score,
  feedback
FROM applications 
ORDER BY updated_at DESC
LIMIT 10; 