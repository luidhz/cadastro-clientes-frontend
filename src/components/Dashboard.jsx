export function Dashboard({ activeSection, onSelectSection, sections, stats }) {
  return (
    <header className="dashboard">
      <div className="module-grid">
        {Object.entries(sections).map(([sectionKey, section]) => (
          <button
            className={`module-card ${section.accent} ${
              activeSection === sectionKey ? 'active' : ''
            }`}
            key={sectionKey}
            onClick={() => onSelectSection(sectionKey)}
            type="button"
          >
            <span className="module-label">{section.title}</span>
            <strong>{stats[sectionKey]}</strong>
            <small>{section.subtitle}</small>
          </button>
        ))}
      </div>
    </header>
  )
}
