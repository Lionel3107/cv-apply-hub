// Test script for the analyze-cv Edge Function
// Run this with: node test_edge_function.js

const { createClient } = require('@supabase/supabase-js');

// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'https://kifyevnjincgqhszqyis.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpZnlldm5qaW5jZ3Foc3pxeWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NjQ4MDAsImV4cCI6MjA1OTM0MDgwMH0.fMRJEgd1rwy77um8pHSv3CstDbP1bc3Xc-ULSUNSAug'; // Replace with your actual anon key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEdgeFunction() {
  try {
    console.log('Testing Edge Function...');
    
    const testData = {
      applicationId: 'test-application-id',
      jobDescription: 'Software Developer position requiring JavaScript, React, and Node.js experience.',
      candidateData: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        experience: '5 years of web development experience with React and Node.js',
        education: 'Bachelor in Computer Science',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript']
      }
    };
    
    console.log('Sending test data:', JSON.stringify(testData, null, 2));
    
    const { data, error } = await supabase.functions.invoke('analyze-cv', {
      body: testData
    });
    
    if (error) {
      console.error('Edge Function error:', error);
    } else {
      console.log('Edge Function response:', data);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testEdgeFunction(); 