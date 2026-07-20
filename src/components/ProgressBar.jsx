export default function ProgressBar({ challenges, currentId }) {
  const getStatus = (sc) => {
    if (sc.id === currentId) return 'active';
    if (sc.passed) return 'completed';
    return 'future';
  };

  const statusStyle = {
    active: { background: 'var(--color-orange)', color: '#fff' },
    completed: { background: 'var(--color-green)', color: '#fff' },
    future: { background: 'var(--color-stealth)', color: 'var(--color-gray)' },
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'stretch',
      width: '100%',
      height: 48,
      marginBottom: 0,
      overflow: 'hidden',
    }}>
      {challenges.map((sc, idx) => {
        const status = getStatus(sc);
        return (
          <div
            key={sc.id}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              ...statusStyle[status],
              fontFamily: 'var(--font-heading)',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              position: 'relative',
              clipPath: idx < challenges.length - 1
                ? 'polygon(0 0, calc(100% - 16px) 0, 100% 50%, calc(100% - 16px) 100%, 0 100%, 16px 50%)'
                : 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 16px 50%)',
              marginLeft: idx === 0 ? 0 : -1,
              zIndex: challenges.length - idx,
              transition: 'background 0.3s',
            }}
          >
            <span style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 'bold',
            }}>
              {idx + 1}
            </span>
            <span style={{ fontSize: '0.85rem' }}>
              {status === 'completed' ? 'Complete' : status === 'active' ? 'In Progress' : 'Locked'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
