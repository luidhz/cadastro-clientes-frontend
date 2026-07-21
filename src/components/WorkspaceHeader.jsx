export function WorkspaceHeader({ section }) {
  return (
    <header className="workspace-header">
      <div>
        <h1>{section.title}</h1>
        <p>{section.subtitle}</p>
      </div>
    </header>
  )
}
