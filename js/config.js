// Supabase Configuration
// Replace these values with your actual Supabase project credentials

const SUPABASE_CONFIG = {
    URL: 'https://ozmmrpjujsyivuwblchk.supabase.co',
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96bW1ycGp1anN5aXZ1d2JsY2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MDY2ODEsImV4cCI6MjA3Mjk4MjY4MX0.UcG_qojYvNkNNe1N-Tou1qnjrZXDJO6hcKEN1ov00Wk', // Your project's anon/public key
    REDIRECT_URL: window.location.origin + '/user_profile.html'
};

// Database table names (create these in your Supabase dashboard)
const TABLES = {
    USERS: 'users',
    CHALLENGES: 'challenges',
    SUBMISSIONS: 'submissions',
    PROGRESS: 'user_progress'
};

// Authentication providers
const AUTH_PROVIDERS = {
    GITHUB: 'github'
};

// GitHub OAuth Configuration - Client-side only (no server)
const GITHUB_CONFIG = {
    CLIENT_ID: 'Ov23liJPTUu1tiN54ppx',
    REDIRECT_URI: 'http://127.0.0.1:5500/login.html',
    SCOPE: 'read:user'
    // CLIENT_SECRET removed - not safe for client-side
};

// Mock authentication for development
const MOCK_AUTH = true;

// Make variables globally available
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.GITHUB_CONFIG = GITHUB_CONFIG;
window.TABLES = TABLES;
window.AUTH_PROVIDERS = AUTH_PROVIDERS;