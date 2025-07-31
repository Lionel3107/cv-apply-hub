// Using native fetch (available in Node.js 18+)

const pdfCoApiKey = 'dlmsonelterror@gmail.com_up3BBLN0ZhbNpIvqzyKQCGBSPe1TyYTY2rDf5aYmBiTfbUC3ik1aXAYZPk3Jfd9Z';
const testPdfUrl = 'https://kifyevnjincgqhszqyis.supabase.co/storage/v1/object/public/applications/resumes/9770ba0b-9b5d-4d42-a368-fe056890f51b-1753833713397.pdf';

async function testPdfCoAPI() {
  try {
    console.log('🧪 Testing Pdf.co API...');
    console.log('📄 PDF URL:', testPdfUrl);
    
    const response = await fetch('https://api.pdf.co/v1/pdf/convert/to/text', {
      method: 'POST',
      headers: {
        'x-api-key': pdfCoApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: testPdfUrl,
        pages: 'all',
        outputFormat: 'text'
      })
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', response.headers);
    
    const responseText = await response.text();
    console.log('📡 Response text:', responseText);
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('✅ Pdf.co API response:', data);
      
      if (data.success) {
        console.log('✅ Text extracted successfully!');
        console.log('📄 Extracted text length:', data.text?.length || data.content?.length || 0);
        console.log('📄 First 500 characters:', (data.text || data.content || '').substring(0, 500));
      } else {
        console.error('❌ Pdf.co API returned error:', data.message);
      }
    } else {
      console.error('❌ Pdf.co API request failed:', response.status, responseText);
    }
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

testPdfCoAPI(); 