const { createClient } = require('@supabase/supabase-js');

// Configuration - utilisez vos vraies clés
const supabaseUrl = 'https://kifyevnjincgqhszqyis.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpZnlldm5qaW5jZ3Foc3pxeWlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NjQ4MDAsImV4cCI6MjA1OTM0MDgwMH0.fMRJEgd1rwy77um8pHSv3CstDbP1bc3Xc-ULSUNSAug'; // Remplacez par votre vraie clé anon

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEdgeFunction() {
  try {
    console.log('🧪 Testing Edge Function with simple data...');
    
    // Données de test simples
    const testData = {
      applicationId: 'test-application-id',
      jobDescription: 'Software Developer position requiring JavaScript and React experience.'
    };
    
    console.log('📤 Sending test data:', JSON.stringify(testData, null, 2));
    
    const { data, error } = await supabase.functions.invoke('analyze-cv', {
      body: testData
    });
    
    if (error) {
      console.error('❌ Edge Function error:', error);
      console.error('Error details:', {
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

testEdgeFunction(); 