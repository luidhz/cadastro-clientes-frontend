export function SearchPanel({ onChange, onSubmit, searchTerm, section }) {
  return (
    <form className="panel search-panel" onSubmit={onSubmit}>
      <h2>Pesquisar {section.title.toLowerCase()}</h2>
      <label>
        ID, email ou codigo
        <input
          onChange={(event) => onChange(event.target.value)}
          placeholder="Digite para pesquisar"
          value={searchTerm}
        />
      </label>
      <div className="button-row">
        <button type="submit">Pesquisar</button>
      </div>
    </form>
  )
}
