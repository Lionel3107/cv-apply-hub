// Debug script for Edge Function
// This will help identify the exact issue

const { createClient } = require('@supabase/supabase-js');

// Replace with your actual values
const supabaseUrl = 'https://kifyevnjincgqhszqyis.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpZnlldm5qaW5jZ3Foc3pxeWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NjQ4MDAsImV4cCI6MjA1OTM0MDgwMH0.fMRJEgd1rwy77um8pHSv3CstDbP1bc3Xc-ULSUNSAug'; // Replace with your actual anon key

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEdgeFunctionWithRealData() {
  try {
    console.log('🔍 Testing Edge Function with real application data...');
    
    // First, get a real application from the database
    const { data: applications, error: fetchError } = await supabase
      .from('applications')
      .select('id, name, email, experience, education, skills')
      .limit(1);
    
    if (fetchError) {
      console.error('❌ Error fetching applications:', fetchError);
      return;
    }
    
    if (!applications || applications.length === 0) {
      console.log('⚠️ No applications found in database');
      return;
    }
    
    const app = applications[0];
    console.log('📋 Found application:', app);
    
    const testData = {
      applicationId: app.id,
      jobDescription: 'Software Developer position requiring JavaScript, React, and Node.js experience.',
      candidateData: {
        name: app.name,
        email: app.email,
        experience: app.experience || '',
        education: app.education || '',
        skills: app.skills || []
      }
    };
    
    console.log('🚀 Sending test data to Edge Function:', JSON.stringify(testData, null, 2));
    
    const { data, error } = await supabase.functions.invoke('analyze-cv', {
      body: testData
    });
    
    if (error) {
      console.error('❌ Edge Function error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText
      });
    } else {
      console.log('✅ Edge Function response:', data);
    }
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

testEdgeFunctionWithRealData(); 