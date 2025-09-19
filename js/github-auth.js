// GitHub OAuth Configuration
// Replace these with your GitHub OAuth App credentials
const GITHUB_CONFIG = {
    CLIENT_ID: 'YOUR_GITHUB_CLIENT_ID', // From GitHub OAuth App
    REDIRECT_URI: window.location.origin + '/login.html',
    SCOPE: 'read:user,user:email',
    AUTH_URL: 'https://github.com/login/oauth/authorize',
    TOKEN_URL: 'https://github.com/login/oauth/access_token',
    API_BASE: 'https://api.github.com'
};

// Authentication state management
class GitHubAuth {
    constructor() {
        this.token = localStorage.getItem('github_token');
        this.user = JSON.parse(localStorage.getItem('github_user') || 'null');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!(this.token && this.user);
    }

    // Get authorization URL
    getAuthUrl() {
        const params = new URLSearchParams({
            client_id: GITHUB_CONFIG.CLIENT_ID,
            redirect_uri: GITHUB_CONFIG.REDIRECT_URI,
            scope: GITHUB_CONFIG.SCOPE,
            state: this.generateState()
        });
        return `${GITHUB_CONFIG.AUTH_URL}?${params}`;
    }

    // Generate random state for security
    generateState() {
        const state = Math.random().toString(36).substring(2);
        sessionStorage.setItem('oauth_state', state);
        return state;
    }

    // Handle OAuth callback
    async handleCallback(code, state) {
        // Verify state
        const storedState = sessionStorage.getItem('oauth_state');
        if (state !== storedState) {
            throw new Error('Invalid OAuth state');
        }

        // Exchange code for token
        const token = await this.exchangeCodeForToken(code);

        // Get user info
        const user = await this.getUserInfo(token);

        // Store authentication data
        this.token = token;
        this.user = user;
        localStorage.setItem('github_token', token);
        localStorage.setItem('github_user', JSON.stringify(user));

        return { token, user };
    }

    // Exchange authorization code for access token
    async exchangeCodeForToken(code) {
        const response = await fetch(GITHUB_CONFIG.TOKEN_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                client_id: GITHUB_CONFIG.CLIENT_ID,
                client_secret: 'YOUR_GITHUB_CLIENT_SECRET', // This should be server-side in production!
                code: code,
                redirect_uri: GITHUB_CONFIG.REDIRECT_URI
            })
        });

        if (!response.ok) {
            throw new Error('Failed to exchange code for token');
        }

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error_description || data.error);
        }

        return data.access_token;
    }

    // Get user information from GitHub API
    async getUserInfo(token) {
        const response = await fetch(`${GITHUB_CONFIG.API_BASE}/user`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get user info');
        }

        const user = await response.json();

        // Also get user email if not public
        if (!user.email) {
            const emailResponse = await fetch(`${GITHUB_CONFIG.API_BASE}/user/emails`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (emailResponse.ok) {
                const emails = await emailResponse.json();
                const primaryEmail = emails.find(email => email.primary);
                if (primaryEmail) {
                    user.email = primaryEmail.email;
                }
            }
        }

        return {
            id: user.id,
            login: user.login,
            name: user.name || user.login,
            email: user.email,
            avatar_url: user.avatar_url,
            html_url: user.html_url,
            bio: user.bio,
            company: user.company,
            location: user.location
        };
    }

    // Logout
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('github_token');
        localStorage.removeItem('github_user');
        sessionStorage.removeItem('oauth_state');
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Get access token
    getToken() {
        return this.token;
    }
}

// Create global auth instance
const githubAuth = new GitHubAuth();

// Make it globally available
window.GitHubAuth = GitHubAuth;
window.githubAuth = githubAuth;