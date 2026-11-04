import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CARDS = [
  {
    title: 'Track Your Progress',
    body: 'The bar at the top shows all 3 challenges. Your active challenge is highlighted in orange — completed steps stay lit, locked ones unlock as you advance.',
    image: '/guide/1-your_progress.png',
    alt: 'Progress bar showing challenge 1 in progress and challenges 2 and 3 locked',
  },
  {
    title: 'Read the Mini-Lesson',
    body: 'Every challenge opens with a short Python lesson on the left. Read the examples carefully — your challenge is always a direct application of what the lesson covers.',
    image: '/guide/2-lesson.png',
    alt: 'Lesson panel showing a Python code example',
  },
  {
    title: 'Find Your Challenge',
    body: 'At the bottom of the lesson is your specific task. It tells you exactly what to build — no guessing. Make sure you understand it before writing a single line.',
    image: '/guide/3-challenge.png',
    alt: 'Lesson panel with the challenge task highlighted',
  },
  {
    title: 'Write & Run Your Code',
    body: "Type your solution in the editor on the right. When you're ready, click 'Run Code' to test it. Retries are unlimited and your work saves automatically.",
    image: '/guide/4-code-editor.png',
    alt: 'Code editor with Run Code button highlighted',
  },
];

export default function WelcomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/challenges/');
      const first = data.find(sc => !sc.passed);
      if (first) {
        navigate(`/challenges/${first.id}`, { replace: true });
      } else {
        navigate('/complete', { replace: true });
      }
    } catch {
      navigate('/auth', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      background: 'linear-gradient(160deg, var(--color-blue) 0%, #0d3550 55%, #1e5f6b 100%)',
      backgroundImage: `
        radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px),
        linear-gradient(160deg, var(--color-blue) 0%, #0d3550 55%, #1e5f6b 100%)
      `,
      backgroundSize: '24px 24px, cover',
      padding: '3rem 2rem',
      color: '#fff',
      fontFamily: 'var(--font-body)',
    }}>
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
        maxWidth: 600,
        justifyContent: 'center',
      }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(59,127,130,0.4)' }} />
        Applicant Portal
        <div style={{ flex: 1, height: 1, background: 'rgba(59,127,130,0.4)' }} />
      </div>

      {/* Brand accent — matches AuthPage and CongratsPage */}
      <div style={{
        fontFamily: 'var(--font-accent)',
        fontSize: '2.8rem',
        color: 'var(--color-orange)',
        lineHeight: 1,
        marginBottom: '0.3rem',
      }}>
        Code Platoon
      </div>
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '0.8rem',
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '2rem',
      }}>
        Coding Assessment
      </div>

      {/* Welcome heading */}
      <h1 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
        fontWeight: 'bold',
        color: 'var(--color-green)',
        letterSpacing: '0.04em',
        marginBottom: '0.5rem',
        textAlign: 'center',
      }}>
        Welcome Aboard!
      </h1>

      {/* Intro paragraph */}
      <p style={{
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.6)',
        marginBottom: '2rem',
        maxWidth: 600,
        lineHeight: 1.6,
        textAlign: 'center',
      }}>
        Before you begin, here&apos;s what to expect from your assessment.
      </p>

      {/* What to Expect cards */}
      <div style={{
        width: '100%',
        maxWidth: 600,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
        {CARDS.map(({ title, body, image, alt }) => (
          <div key={title} style={{
            borderLeft: '4px solid var(--color-green)',
            background: 'rgba(80,119,55,0.08)',
            borderRadius: '2px',
            padding: '1rem 1.25rem',
          }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              letterSpacing: '0.04em',
              color: '#fff',
              marginBottom: '0.4rem',
            }}>
              {title}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.7)',
              lineHeight: 1.6,
              marginBottom: '0.75rem',
            }}>
              {body}
            </div>
            <img
              src={image}
              alt={alt}
              style={{
                width: '100%',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.12)',
                display: 'block',
              }}
            />
          </div>
        ))}
      </div>

      {/* CTA button */}
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleStart}
          disabled={loading}
          className="btn-primary"
          style={{
            width: '100%',
            padding: '0.9rem',
            fontSize: '1rem',
            letterSpacing: '0.08em',
          }}
        >
          {loading ? 'Loading…' : 'Start Assessment →'}
        </button>
      </div>
    </div>
  );
}
