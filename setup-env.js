#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables...');

const envExamplePath = path.join(__dirname, 'env.example');
const envPath = path.join(__dirname, '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Skipping...');
  console.log('📝 You can manually copy env.example to .env and update the values.');
} else {
  try {
    // Copy env.example to .env
    const envContent = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file from env.example');
    console.log('📝 Please update the values in .env with your actual credentials');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    console.log('📝 Please manually copy env.example to .env and update the values');
  }
}

console.log('\n📋 Next steps:');
console.log('1. Update the values in .env with your actual Supabase credentials');
console.log('2. Restart your development server: npm run dev');
console.log('3. The "process is not defined" error should be resolved'); 