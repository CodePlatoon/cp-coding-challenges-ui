import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChallenges } from '../hooks/useChallenges';
import { useDebounce } from '../hooks/useDebounce';
import ProgressBar from '../components/ProgressBar';
import MiniLesson from '../components/MiniLesson';
import EditorPane from '../components/EditorPane';
import Loader from '../components/Loader';
import api from '../api/axios';

export default function ChallengePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { challenges, loading, error, updateChallenge } = useChallenges();

  const [code, setCode] = useState('');
  const [saveStatus, setSaveStatus] = useState(''); // '' | 'saving' | 'saved'
  const [runLoading, setRunLoading] = useState(false);
  const [runResult, setRunResult] = useState(null); // { passed, stdout, stderr }
  const [mobileTab, setMobileTab] = useState('lesson');

  const debouncedCode = useDebounce(code, 1000);

  const seededIdRef = useRef(null);

  const current = challenges.find(sc => sc.id === id);

  useEffect(() => {
    if (!loading && challenges.length > 0 && !current) {
      const first = challenges.find(sc => !sc.passed) || challenges[0];
      navigate(`/challenges/${first.id}`, { replace: true });
    }
  }, [loading, challenges, current, navigate]);

  useEffect(() => {
    if (!current || seededIdRef.current === current.id) return;
    const nextCode = current.submission || current.challenge.init_temp || '';
    Promise.resolve().then(() => {
      setCode(nextCode);
      setRunResult(null);
      seededIdRef.current = current.id;
    });
  }, [current]);

  useEffect(() => {
    if (!current || !debouncedCode) return;
    const id = current.id;
    const save = async () => {
      setSaveStatus('saving');
      try {
        await api.patch(`/api/challenges/${id}/save/`, { submission: debouncedCode });
        setSaveStatus('saved');
      } catch {
        setSaveStatus('');
      } finally {
        setTimeout(() => setSaveStatus(''), 2500);
      }
    };
    save();
  }, [debouncedCode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRunCode = async () => {
    if (!current || runLoading) return;
    setRunLoading(true);
    setRunResult(null);
    try {
      const { data } = await api.post(`/api/challenges/${current.id}/run/`, {
        submission: code,
      });
      setRunResult(data);
      if (data.passed) {
        updateChallenge(current.id, { passed: true });
      }
    } catch (err) {
      setRunResult({
        passed: false,
        stdout: '',
        stderr: err.response?.data?.detail || 'An error occurred while running your code.',
      });
    } finally {
      setRunLoading(false);
    }
  };

  const handleNext = () => {
    const nextIncomplete = challenges.find(sc => !sc.passed && sc.id !== current?.id);
    if (nextIncomplete) {
      navigate(`/challenges/${nextIncomplete.id}`);
    } else {
      navigate('/complete');
    }
  };

  if (loading) return <Loader />;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
  if (!current) return <Loader />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Progress Bar */}
      <ProgressBar challenges={challenges} currentId={id} />

      {/* Header toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        height: 44,
        backgroundColor: 'var(--color-blue)',
        color: '#fff',
        flexShrink: 0,
        borderBottom: '2px solid rgba(59,127,130,0.3)',
      }}>
        {/* Brand + counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            fontFamily: 'var(--font-accent)',
            fontSize: '1.1rem',
            color: 'var(--color-orange)',
            lineHeight: 1,
          }}>
            Code Platoon
          </span>
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.2)' }} />
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.78rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}>
            Challenge {current.challenge.order} / {challenges.length}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          {saveStatus && (
            <span style={{
              fontSize: '0.7rem',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              opacity: 0.8,
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: saveStatus === 'saved' ? '#4caf50' : 'var(--color-orange)',
                display: 'inline-block',
                animation: saveStatus === 'saving' ? 'pulse-dot 0.8s ease-in-out infinite' : 'none',
              }} />
              {saveStatus === 'saving' ? 'Saving' : 'Saved'}
            </span>
          )}
          <button
            className="btn-secondary"
            onClick={handleRunCode}
            disabled={runLoading}
            style={{ padding: '0.35rem 1rem', fontSize: '0.85rem', letterSpacing: '0.04em' }}
          >
            {runLoading ? 'Running…' : 'Run Code'}
          </button>
          {current.passed && (
            <button
              className="btn-primary"
              onClick={handleNext}
              style={{ padding: '0.35rem 1rem', fontSize: '0.85rem', letterSpacing: '0.04em' }}
            >
              Next &rarr;
            </button>
          )}
        </div>
      </div>

      {/* Mobile tab switcher — hidden on desktop via CSS */}
      <div className="mobile-tabs">
        <button
          className={`mobile-tab ${mobileTab === 'lesson' ? 'active' : ''}`}
          onClick={() => setMobileTab('lesson')}
        >
          Lesson
        </button>
        <button
          className={`mobile-tab ${mobileTab === 'editor' ? 'active' : ''}`}
          onClick={() => setMobileTab('editor')}
        >
          Editor
        </button>
      </div>

      {/* Main split pane */}
      <div className="challenge-split" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left pane: mini lesson */}
        <div
          style={{
            width: '38%',
            minWidth: 280,
            borderRight: '2px solid var(--color-green)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
          className={`challenge-left-pane${mobileTab === 'editor' ? ' mobile-hidden' : ''}`}
        >
          <MiniLesson content={current.challenge.mini_lesson} />
        </div>

        {/* Right pane: editor + results */}
        <div className={`challenge-right-pane${mobileTab === 'lesson' ? ' mobile-hidden' : ''}`} style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#1a1a2e',
        }}>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <EditorPane value={code} onChange={(val) => setCode(val || '')} />
          </div>

          {/* Test results panel */}
          {runResult && (
            <div style={{
              maxHeight: '38%',
              overflowY: 'auto',
              padding: '0.875rem 1.25rem',
              backgroundColor: runResult.passed ? '#061a06' : '#1a0606',
              borderTop: `2px solid ${runResult.passed ? 'var(--color-green)' : '#c0392b'}`,
              color: '#e0e0e0',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              animation: 'fade-up 0.25s ease-out',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.75rem',
                borderBottom: `1px solid ${runResult.passed ? 'rgba(80,119,55,0.3)' : 'rgba(192,57,43,0.3)'}`,
                paddingBottom: '0.6rem',
              }}>
                <span style={{
                  fontSize: '1.25rem',
                  color: runResult.passed ? '#4caf50' : '#f44336',
                  lineHeight: 1,
                }}>
                  {runResult.passed ? '✓' : '✗'}
                </span>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.6rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: runResult.passed ? 'rgba(76,175,80,0.7)' : 'rgba(244,67,54,0.7)',
                    marginBottom: '0.15rem',
                  }}>
                    Objective Status
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.95rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: runResult.passed ? '#4caf50' : '#f44336',
                  }}>
                    {runResult.passed ? 'Complete' : 'Code Review Needed'}
                  </div>
                </div>
              </div>
              {runResult.stdout && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ opacity: 0.5, marginBottom: '0.25rem', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Output</div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#c8e6c9' }}>{runResult.stdout}</pre>
                </div>
              )}
              {runResult.stderr && (
                <div>
                  <div style={{ opacity: 0.5, color: '#ffab91', marginBottom: '0.25rem', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Error</div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#ffab91' }}>{runResult.stderr}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
