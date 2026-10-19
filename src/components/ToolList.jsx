import { Link } from 'react-router-dom';
import { toolPath } from '../data/tools.js';

export default function ToolList({ items }) {
  return (
    <ul className="tool-list">
      {items.map((tool) => (
        <li key={tool.slug}>
          <Link to={toolPath(tool)}>
            <span className="tool-name">{tool.name}</span>
            <span className="tool-desc">{tool.description}</span>
          </Link>
          {!tool.live && <span className="badge">Coming soon</span>}
        </li>
      ))}
    </ul>
  );
}
