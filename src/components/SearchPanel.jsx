export function SearchPanel({ onChange, onSubmit, searchTerm, section }) {

  return (
    <form className="panel search-panel" onSubmit={onSubmit}>
      <h2>Pesquisar {section.title.toLowerCase()}</h2>
      <label>
        {section.searchLabel}
        <input
          onChange={(event) => onChange(event.target.value)}
          placeholder={section.searchPlaceholder}
          value={searchTerm}
        />
      </label>

      <div className="button-row">
        <button type="submit">Pesquisar</button>
      </div>
    </form>
  )
}
