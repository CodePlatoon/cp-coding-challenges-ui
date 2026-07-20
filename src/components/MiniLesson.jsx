export default function MiniLesson({ content }) {
  const renderMarkdown = (text) => {
    const lines = text.split('\n');
    const result = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Fenced code block
      if (line.trim().startsWith('```')) {
        const codeLines = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        result.push(
          <pre key={i} style={{
            background: '#1a1a2e',
            color: '#a8d8a8',
            padding: '1rem',
            borderRadius: '3px',
            overflowX: 'auto',
            fontSize: '0.85rem',
            margin: '0.75rem 0',
            lineHeight: 1.6,
            borderLeft: '3px solid var(--color-teal)',
          }}>
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        i++;
        continue;
      }

      // H1
      if (line.startsWith('# ')) {
        result.push(
          <h2 key={i} style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            color: 'var(--color-blue)',
            margin: '0 0 1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid var(--color-green)',
          }}>
            {line.slice(2)}
          </h2>
        );
        i++;
        continue;
      }

      // H2
      if (line.startsWith('## ')) {
        result.push(
          <h3 key={i} style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            color: 'var(--color-blue)',
            margin: '1.25rem 0 0.5rem',
            letterSpacing: '0.03em',
          }}>
            {line.slice(3)}
          </h3>
        );
        i++;
        continue;
      }

      // Table row (starts with |)
      if (line.trim().startsWith('|')) {
        const tableLines = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i]);
          i++;
        }
        const rows = tableLines.filter(r => !r.match(/^\|[-| :]+\|$/));
        result.push(
          <div key={i} style={{ overflowX: 'auto', margin: '0.75rem 0' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '0.875rem' }}>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: '1px solid var(--color-stealth)' }}>
                    {row.split('|').filter((_, ci) => ci > 0 && ci < row.split('|').length - 1).map((cell, ci) => {
                      const Tag = ri === 0 ? 'th' : 'td';
                      return (
                        <Tag key={ci} style={{
                          padding: '0.4rem 0.75rem',
                          textAlign: 'left',
                          fontWeight: ri === 0 ? 'bold' : 'normal',
                          backgroundColor: ri === 0 ? '#E8E4DC' : 'transparent',
                          fontSize: ri === 0 ? '0.8rem' : '0.875rem',
                          letterSpacing: ri === 0 ? '0.05em' : 0,
                          textTransform: ri === 0 ? 'uppercase' : 'none',
                        }}>
                          {inlineFormat(cell.trim())}
                        </Tag>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }

      // Empty line
      if (line.trim() === '') {
        result.push(<div key={i} style={{ height: '0.5rem' }} />);
        i++;
        continue;
      }

      // Regular paragraph with inline formatting
      result.push(
        <p key={i} style={{ margin: '0.25rem 0', lineHeight: 1.75 }}>
          {inlineFormat(line)}
        </p>
      );
      i++;
    }

    return result;
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Mission Briefing header */}
      <div style={{
        padding: '0.5rem 1.25rem',
        background: 'var(--color-blue)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(59,127,130,0.35)' }} />
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.62rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--color-teal)',
          whiteSpace: 'nowrap',
        }}>
          Mission Briefing
        </span>
        <div style={{ flex: 1, height: 1, background: 'rgba(59,127,130,0.35)' }} />
      </div>

      {/* Scrollable content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem',
        fontFamily: 'var(--font-body)',
        fontSize: '0.95rem',
        color: 'var(--color-gray)',
        lineHeight: 1.7,
        backgroundColor: '#F8F5EF',
      }}>
        {renderMarkdown(content)}
      </div>
    </div>
  );
}

function inlineFormat(text) {
  const parts = [];
  const regex = /(\*\*(.+?)\*\*|`([^`]+)`)/g;
  let last = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    if (match[0].startsWith('**')) {
      parts.push(<strong key={key++}>{match[2]}</strong>);
    } else {
      parts.push(
        <code key={key++} style={{
          background: '#E8E4DC',
          padding: '0.1rem 0.35rem',
          borderRadius: '2px',
          fontSize: '0.875em',
          fontFamily: 'monospace',
          color: '#c0392b',
        }}>
          {match[3]}
        </code>
      );
    }
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts.length === 0 ? text : parts;
}
