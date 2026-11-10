import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function AuthPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/welcome', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return false; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return false; }
    if (mode === 'signup' && password !== confirmPassword) { setError('Passwords do not match.'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login/' : '/api/auth/register/';
      const { data } = await api.post(endpoint, { email, password });
      login(data.access, data.refresh);
      navigate('/welcome', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.detail
        || err.response?.data?.email?.[0]
        || err.response?.data?.password?.[0]
        || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(m => m === 'login' ? 'signup' : 'login');
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'var(--font-body)',
    }}>
      {/* Left hero panel */}
      <div
        className="auth-hero"
        style={{
          flex: '0 0 42%',
          background: 'linear-gradient(160deg, var(--color-blue) 0%, #0d3550 55%, #1e5f6b 100%)',
          backgroundImage: `
            radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(160deg, var(--color-blue) 0%, #0d3550 55%, #1e5f6b 100%)
          `,
          backgroundSize: '24px 24px, cover',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 2.5rem',
          color: '#fff',
        }}
      >
        {/* Eyebrow label */}
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.65rem',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'var(--color-teal)',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          width: '100%',
          maxWidth: 320,
        }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(59,127,130,0.4)' }} />
          Applicant Portal
          <div style={{ flex: 1, height: 1, background: 'rgba(59,127,130,0.4)' }} />
        </div>

        <div style={{
          fontFamily: 'var(--font-accent)',
          fontSize: '3.5rem',
          color: 'var(--color-orange)',
          marginBottom: '0.4rem',
          lineHeight: 1,
        }}>
          Code Platoon
        </div>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.85rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.55)',
          marginBottom: '3rem',
        }}>
          Coding Challenges
        </div>

        {/* Mission steps */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.12)',
          paddingTop: '2rem',
          width: '100%',
          maxWidth: 320,
        }}>
          {[
            'Complete 3 Python challenges',
            'Each with a guided mini-lesson',
            'Submit your application',
          ].map((label) => (
            <div key={label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              marginBottom: '1.1rem',
            }}>
              <span style={{
                color: 'var(--color-orange)',
                fontSize: '1.4rem',
                lineHeight: 1,
                flexShrink: 0,
              }}>•</span>
              <span style={{ fontSize: '0.9rem', opacity: 0.85, lineHeight: 1.4 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0EDE6',
        padding: '2rem',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 420,
          backgroundColor: '#fff',
          borderTop: '1px solid #ddd',
          borderRight: '1px solid #ddd',
          borderBottom: '1px solid #ddd',
          borderLeft: '4px solid var(--color-green)',
          borderRadius: '2px',
          padding: '2.5rem',
          boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
        }}>
          {/* Mobile-only branding */}
          <div style={{
            display: 'none',
            textAlign: 'center',
            marginBottom: '1.5rem',
          }} className="auth-mobile-brand">
            <div style={{
              fontFamily: 'var(--font-accent)',
              fontSize: '2rem',
              color: 'var(--color-orange)',
            }}>Code Platoon</div>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.6rem',
            color: 'var(--color-blue)',
            marginBottom: '0.25rem',
            textAlign: 'center',
          }}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={{
            textAlign: 'center',
            color: 'var(--color-teal)',
            fontSize: '0.875rem',
            marginBottom: '2rem',
          }}>
            {mode === 'login' ? 'Sign in to continue your coding challenges' : 'Start your coding challenges'}
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-gray)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-gray)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={inputStyle}
                placeholder="Min. 8 characters"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {mode === 'signup' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.8rem', color: 'var(--color-gray)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  style={inputStyle}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />
              </div>
            )}

            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                borderLeft: '4px solid #dc2626',
                borderRadius: '2px',
                padding: '0.75rem 1rem',
                color: '#dc2626',
                fontSize: '0.875rem',
                marginBottom: '1.25rem',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', marginBottom: '1rem', letterSpacing: '0.05em' }}
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={toggleMode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-teal)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  padding: 0,
                  textDecoration: 'underline',
                  textDecorationColor: 'rgba(59,127,130,0.4)',
                  textUnderlineOffset: '3px',
                }}
              >
                {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.875rem',
  border: '1.5px solid var(--color-stealth)',
  borderRadius: '2px',
  fontSize: '1rem',
  fontFamily: 'var(--font-body)',
  outline: 'none',
  transition: 'border-color 0.2s',
  backgroundColor: '#fff',
};
