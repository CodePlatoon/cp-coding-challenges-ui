import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';

const OBJECTIVES = [
  'Python Fundamentals',
  'Problem Solving',
  'Code Execution',
];

export default function CongratsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/challenges/')
      .then(({ data }) => {
        const allPassed = data.every(sc => sc.passed);
        if (!allPassed) {
          const firstIncomplete = data.find(sc => !sc.passed);
          navigate(`/challenges/${firstIncomplete.id}`, { replace: true });
        }
      })
      .catch(() => navigate('/auth', { replace: true }))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      // await api.patch('/api/user/complete/');
      setSubmitted(true);
      const targetUrl = 'https://launchyourcareer.codeplatoon.org/application-2';
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      const msg = err.response?.data?.detail || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(160deg, var(--color-blue) 0%, #0d3a52 55%, #1a5a6e 100%)',
      backgroundImage: `
        radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(160deg, var(--color-blue) 0%, #0d3a52 55%, #1a5a6e 100%)
      `,
      backgroundSize: '24px 24px, cover',
      padding: '2rem',
      textAlign: 'center',
      color: '#fff',
    }}>
      {/* Eyebrow */}
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '0.65rem',
        letterSpacing: '0.35em',
        textTransform: 'uppercase',
        color: 'var(--color-teal)',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        width: '100%',
        maxWidth: 480,
        justifyContent: 'center',
      }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(59,127,130,0.4)' }} />
        Coding Challenges Complete
        <div style={{ flex: 1, height: 1, background: 'rgba(59,127,130,0.4)' }} />
      </div>

      {/* Mission Complete headline */}
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(2.75rem, 9vw, 5.5rem)',
        fontWeight: 'bold',
        color: 'var(--color-green)',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        lineHeight: 1,
        marginBottom: '0.75rem',
        textShadow: '0 0 60px rgba(80,119,55,0.35)',
      }}>
        Coding Challenges<br />Complete
      </h1>

      {/* Accent subtitle */}
      <div style={{
        fontFamily: 'var(--font-accent)',
        fontSize: '2rem',
        color: 'var(--color-orange)',
        marginBottom: '0.5rem',
        lineHeight: 1.2,
      }}>
        Congratulations!
      </div>

      <p style={{
        fontSize: '0.95rem',
        opacity: 0.6,
        marginBottom: '2.5rem',
        maxWidth: 380,
        lineHeight: 1.6,
      }}>
        You&apos;ve successfully completed all three Coding Challenges.
      </p>

      {/* Objective list */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        marginBottom: '2.5rem',
        textAlign: 'left',
      }}>
        {OBJECTIVES.map((label, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.75rem 1rem',
            borderTop: '1px solid rgba(80,119,55,0.3)',
            borderRight: '1px solid rgba(80,119,55,0.3)',
            borderBottom: '1px solid rgba(80,119,55,0.3)',
            borderLeft: '4px solid var(--color-green)',
            backgroundColor: 'rgba(80,119,55,0.1)',
            marginBottom: '0.5rem',
            borderRadius: '2px',
            animation: `fade-up 0.4s ease-out ${i * 0.1}s both`,
          }}>
            <span style={{ color: 'var(--color-green)', fontSize: '1.1rem', fontWeight: 'bold', flexShrink: 0 }}>✓</span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)',
                marginBottom: '0.1rem',
              }}>
                Challenge {i + 1}
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.9)',
              }}>
                {label}
              </div>
            </div>
            <div style={{
              backgroundColor: 'var(--color-green)',
              color: '#fff',
              fontSize: '0.6rem',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.12em',
              padding: '0.2rem 0.6rem',
              textTransform: 'uppercase',
              flexShrink: 0,
            }}>
              COMPLETE
            </div>
          </div>
        ))}
      </div>

      {/* Submit section */}
      {submitted ? (
        <div style={{
          padding: '1rem 1.5rem',
          border: '2px solid var(--color-green)',
          borderRadius: '2px',
          backgroundColor: 'rgba(80,119,55,0.15)',
          color: 'var(--color-green)',
          fontFamily: 'var(--font-heading)',
          letterSpacing: '0.04em',
          maxWidth: 440,
          animation: 'fade-up 0.3s ease-out',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          <div style={{ fontSize: '1rem' }}>✓ Coding Challenges submitted.</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.75, fontFamily: 'var(--font-body)', letterSpacing: '0.01em' }}>
            Ensure to complete your written responses and video submission in <a href='https://launchyourcareer.codeplatoon.org/application-2' target="_blank">
              <strong style={{color:'var(--color-orange)'}}>STEP 2</strong>
            </a>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          {error && (
            <p style={{ color: '#ff8a65', fontSize: '0.875rem' }}>{error}</p>
          )}
          <span style={{ fontSize: '0.78rem', opacity: 0.4, fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <strong>You&apos;re almost finished with your application!</strong>
            <br/><br/>
            Next, you&apos;ll return to Part Two to complete your written responses and video submission. 
            <br/>
            Once those are submitted, your application will be complete.
          </span>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              background: submitting ? 'rgba(255,96,13,0.5)' : 'var(--color-orange)',
              color: '#fff',
              border: 'none',
              padding: '0.9rem 3rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 'bold',
              fontSize: '1rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              borderRadius: '2px',
            }}
          >
            {submitting ? 'Submitting…' : 'Submit Coding Challenges →'}
          </button>
          <span style={{ fontSize: '0.78rem', opacity: 0.4, fontFamily: 'var(--font-heading)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            You&apos;ll continue to the final section of Part Two of your application.
          </span>
        </div>
      )}
    </div>
  );
}
