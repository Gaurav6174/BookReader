/**
 * EmptyState component for pages/sections with no data.
 */
export default function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-8 text-center animate-fade-in"
      role="status"
      aria-label={title}
    >
      <div className="text-6xl mb-4" aria-hidden="true">{icon}</div>
      <h3
        className="text-2xl mb-2 text-charcoal"
        style={{ fontFamily: "'Gaegu', cursive", fontWeight: 700 }}
      >
        {title}
      </h3>
      {message && (
        <p className="text-sm text-gray-500 mb-6 max-w-xs" style={{ fontFamily: "'Patrick Hand', cursive" }}>
          {message}
        </p>
      )}
      {action}
    </div>
  );
}
