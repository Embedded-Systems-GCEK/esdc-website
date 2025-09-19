# ESDC Website - Supabase Integration Setup

This document explains how to set up Supabase authentication and database integration for the ESDC website.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A GitHub OAuth app for authentication

## Supabase Setup

### 1. Create a New Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in your project details and wait for it to be created

### 2. Get Your Project Credentials

1. Go to your project dashboard
2. Navigate to Settings → API
3. Copy your Project URL and anon/public key

### 3. Configure GitHub OAuth

1. Go to Settings → Authentication → Providers
2. Enable GitHub provider
3. Create a GitHub OAuth App:
   - Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/applications/new)
   - Set Authorization callback URL to: `https://your-project.supabase.co/auth/v1/callback`
   - Copy Client ID and Client Secret to Supabase

### 4. Update Configuration

Edit `js/config.js` and replace the placeholder values:

```javascript
const SUPABASE_CONFIG = {
    URL: 'https://your-project-id.supabase.co', // Your actual Supabase URL
    ANON_KEY: 'your-anon-key-here', // Your actual anon key
    REDIRECT_URL: window.location.origin + '/user_profile.html'
};
```

## Database Schema

Create the following tables in your Supabase database:

### 1. Users Table
```sql
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    username TEXT UNIQUE,
    github_url TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Challenges Table
```sql
CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Submissions Table
```sql
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    challenge_id INTEGER REFERENCES challenges(id),
    code TEXT,
    passed BOOLEAN DEFAULT FALSE,
    execution_time INTEGER, -- in milliseconds
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    git_url TEXT
);
```

### 4. User Progress Table
```sql
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) UNIQUE,
    total_solved INTEGER DEFAULT 0,
    beginner_solved INTEGER DEFAULT 0,
    intermediate_solved INTEGER DEFAULT 0,
    advanced_solved INTEGER DEFAULT 0,
    last_sync TIMESTAMP WITH TIME ZONE,
    git_repository_url TEXT
);
```

## Row Level Security (RLS) Policies

Enable RLS and create policies for data access:

### Users Table Policies
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Allow new user creation
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);
```

### Challenges Table Policies
```sql
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read challenges
CREATE POLICY "Anyone can view challenges" ON challenges
    FOR SELECT USING (true);
```

### Submissions Table Policies
```sql
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own submissions
CREATE POLICY "Users can view own submissions" ON submissions
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to create their own submissions
CREATE POLICY "Users can create own submissions" ON submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### User Progress Table Policies
```sql
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own progress
CREATE POLICY "Users can view own progress" ON user_progress
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own progress
CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to create their own progress
CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Testing the Integration

1. Update `js/config.js` with your Supabase credentials
2. Open `index.html` in your browser
3. Click the "Login" button
4. You should be redirected to GitHub for authentication
5. After authentication, you should be redirected to `user_profile.html`

## Features Implemented

- ✅ GitHub OAuth authentication
- ✅ User profile display with GitHub avatar
- ✅ Challenge progress tracking
- ✅ Submission history
- ✅ Repository synchronization
- ✅ Responsive Bootstrap UI
- ✅ Authentication state management

## Next Steps

1. Add sample challenges to the database
2. Implement challenge submission functionality
3. Add leaderboard/scoreboard features
4. Create admin panel for challenge management
5. Add real-time notifications

## Troubleshooting

### Common Issues:

1. **"Invalid login credentials"**
   - Check your Supabase URL and anon key in `js/config.js`
   - Ensure GitHub OAuth is properly configured

2. **"Redirect URL mismatch"**
   - Update the redirect URL in your GitHub OAuth app settings
   - Make sure it matches your Supabase callback URL

3. **Database connection issues**
   - Verify your database schema matches the examples above
   - Check RLS policies are correctly applied

### Debug Mode

Add this to your browser console to enable debug logging:

```javascript
localStorage.setItem('supabase.auth.debug', 'true');
```

## Support

For issues with Supabase integration, check:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://supabase.com/community)
- [GitHub Issues](https://github.com/supabase/supabase/issues)