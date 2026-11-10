import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CARDS = [
  {
    title: 'Track Your Progress',
    body: "You'll complete three coding challenges in order. The progress bar shows which challenge you're working on and which ones you've completed.",
    image: '/guide/1-your_progress.png',
    alt: 'Progress bar showing challenge 1 in progress and challenges 2 and 3 locked',
  },
  {
    title: "Review the Lesson",
    body: "Each challenge includes a short Python lesson on the left side of your screen. Read the lesson and examples before starting your challenge.",
    image: '/guide/2-lesson.png',
    alt: 'Lesson panel showing a Python code example',
  },
  {
    title: "Complete the Challenge",
    body: "At the bottom of each lesson, you'll find instructions for what you need to build. Review them carefully before writing your code.",
    image: '/guide/3-challenge.png',
    alt: 'Lesson panel with the challenge task highlighted',
  },
  {
    title: 'Write & Run Your Code',
    body: "Use the editor on the right to write your solution. Click 'Run Code' to test your work. You can try as many times as needed. Once your solution passes, you'll move to the next challenge.",
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
        Coding Challenges
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
        Application Coding Challenges
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
        You're ready to complete the Coding Challenges portion of your Code Platoon application.
        <br/><br/>
        You'll work through three Python coding challenges designed to demonstrate your problem-solving skills and ability to follow instructions.
        <br/><br/>
        Complete each challenge successfully to unlock the next one. Once you've finished all three, you'll continue to the final section of Part Two, where you'll submit your written responses and video.
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
          {loading ? 'Loading…' : 'Start Coding Challenges →'}
        </button>
      </div>
      <p style={{
        fontSize: '0.95rem',
        color: 'rgba(255,255,255,0.6)',
        marginBottom: '2rem',
        maxWidth: 600,
        lineHeight: 1.6,
        textAlign: 'center',
      }}>
        Complete all three challenges to continue to the final section of your application.
      </p>
    </div>
  );
}
