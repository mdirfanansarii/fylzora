import { useId, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchTools, toolPath } from '../data/tools.js';

export default function SearchBox({ large = false }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const navigate = useNavigate();
  const listId = useId();
  const results = useMemo(() => searchTools(q).slice(0, 7), [q]);
  const showList = open && q.trim().length > 0;

  const go = (tool) => {
    setOpen(false);
    setQ('');
    navigate(toolPath(tool));
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (active >= 0 && results[active]) go(results[active]);
      else if (q.trim()) {
        setOpen(false);
        navigate(`/all-tools?q=${encodeURIComponent(q.trim())}`);
      }
    }
  };

  return (
    <div
      className={`search ${large ? 'search-lg' : ''}`}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}
    >
      <label className="sr-only" htmlFor={`${listId}-input`}>Search tools</label>
      <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10.5 3a7.5 7.5 0 015.9 12.1l4.3 4.3-1.4 1.4-4.3-4.3A7.5 7.5 0 1110.5 3zm0 2a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" fill="currentColor" />
      </svg>
      <input
        id={`${listId}-input`}
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        placeholder={large ? 'Search tools, e.g. “merge pdf” or “compress image”' : 'Search tools'}
        value={q}
        autoComplete="off"
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {showList && (
        <ul id={listId} role="listbox" className="search-results">
          {results.length === 0 && <li className="search-empty">No tool matches “{q}”. Try a file type like “pdf” or “xlsx”.</li>}
          {results.map((tool, i) => (
            <li
              key={tool.slug}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? 'is-active' : ''}
              onMouseDown={(e) => { e.preventDefault(); go(tool); }}
              onMouseEnter={() => setActive(i)}
            >
              <strong>{tool.name}</strong>
              <span>{tool.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
