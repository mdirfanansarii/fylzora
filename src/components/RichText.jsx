import { Link } from 'react-router-dom';

// Tiny renderer for the guide text in src/data/blogArticles.js.
// Supports **bold** and [link text](/internal-path) inside a string.
const TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\(\/[^)\s]*\))/g;
const LINK = /^\[([^\]]+)\]\((\/[^)\s]*)\)$/;

export function Inline({ text }) {
  return text.split(TOKEN).filter(Boolean).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    const link = part.match(LINK);
    if (link) return <Link key={i} to={link[2]}>{link[1]}</Link>;
    return part;
  });
}

// blocks: [['h2', text], ['p', text], ['ul', [text, ...]], ['ol', [...]], ['code', text]]
export function Blocks({ blocks }) {
  return blocks.map(([type, content], i) => {
    switch (type) {
      case 'h2': return <h2 key={i}><Inline text={content} /></h2>;
      case 'h3': return <h3 key={i}><Inline text={content} /></h3>;
      case 'p': return <p key={i}><Inline text={content} /></p>;
      case 'ul': return <ul key={i} className="plain-list">{content.map((t) => <li key={t}><Inline text={t} /></li>)}</ul>;
      case 'ol': return <ol key={i} className="plain-list">{content.map((t) => <li key={t}><Inline text={t} /></li>)}</ol>;
      case 'code': return <pre key={i} className="code-block"><code>{content}</code></pre>;
      default: return null;
    }
  });
}
