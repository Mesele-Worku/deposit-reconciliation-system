console.log('🔍 Testing app import...');

try {
  const app = require('./app.js');
  console.log('✅ App loaded successfully');
  console.log('📦 Type of app:', typeof app);
  console.log('🔧 Properties:', Object.keys(app));
  console.log('🎯 Is app a function?', typeof app === 'function');
  console.log('👂 Does app have listen?', typeof app.listen);
} catch (error) {
  console.error('❌ Error:', error.message);
}