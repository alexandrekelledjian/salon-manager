require('dotenv').config();

// Fail fast: validate JWT_SECRET
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32) {
    console.error('========================================');
    console.error('FATAL ERROR: JWT_SECRET is missing or too short.');
    console.error('JWT_SECRET must be at least 32 characters.');
    console.error('');
    console.error('Fix: Set JWT_SECRET in your .env file:');
    console.error('  JWT_SECRET=your-secret-key-at-least-32-characters-long');
    console.error('========================================');
    process.exit(1);
}

const app = require('./app');

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 API running on http://localhost:${PORT}`);
});
