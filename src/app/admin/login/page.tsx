'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage('');
    
    if (!username.trim() || !password) {
      setErrorMessage('Please enter both username and password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: username.trim(), 
          password: password,
          role: 'admin' 
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem('adminToken', 'true');
        localStorage.setItem('adminUser', JSON.stringify({ username }));
        localStorage.setItem('eagle_admin_auth', 'true');
        router.push('/admin/dashboard');
      } else {
        setErrorMessage(result.message || 'Authentication failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-dark-100 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full login-container">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold gradient-text">
            Eagle Aura
          </Link>
          <h2 className="mt-4 text-2xl font-bold text-light-100 header-text">Admin Portal</h2>
          <p className="mt-2 text-sm text-light-400">Secure access to dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-dark-200 rounded-lg shadow-lg p-8 login-box border border-dark-300">
          <form onSubmit={handleSubmit} id="login-form" className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-light-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent text-light-200 input-field"
                placeholder="admin"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-light-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-transparent text-light-200 input-field"
                placeholder="••••••••"
              />
            </div>

            {errorMessage && (
              <div id="error-message" className="bg-red-900 bg-opacity-20 border border-red-700 text-red-400 px-4 py-3 rounded-lg text-sm animate-shake">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              id="login-btn"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-light to-primary-dark text-white py-3 px-4 rounded-lg hover:shadow-glow transition-all font-medium login-btn disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Back to Store */}
        <div className="text-center mt-6">
          <Link href="/" className="text-primary-light hover:text-primary-dark transition-colors text-sm flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
