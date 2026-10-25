import { Link } from 'react-router-dom';

/**
 * Breadcrumbs component.
 * crumbs: Array of { label, to? } — last item is current page (no link).
 */
export default function Breadcrumbs({ crumbs = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb mb-4">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true" className="text-white/40">›</span>}
            {isLast || !crumb.to ? (
              <span className={isLast ? 'text-white font-medium' : ''}>{crumb.label}</span>
            ) : (
              <Link to={crumb.to}>{crumb.label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
