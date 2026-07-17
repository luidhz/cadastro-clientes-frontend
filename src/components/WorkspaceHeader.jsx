export function WorkspaceHeader({ loading, onRefresh, section }) {
  return (
    <header className="workspace-header">
      <div>
        {/* <span className={`section-marker ${section.accent}`}>{section.title}</span> */}
        <h1>{section.title}</h1>
        <p>{section.subtitle}</p>
      </div>
      <button className="ghost-button" disabled={loading} onClick={onRefresh} type="button">
        Atualizar
      </button>
    </header>
  )
}
