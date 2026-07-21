export function SearchPanel({ onChange, onSubmit, searchTerm, section }) {
  const isItemCompra = section.endpoint === '/itens-compra'

  return (
    <form className="panel search-panel" onSubmit={onSubmit}>
      <h2>Pesquisar {section.title.toLowerCase()}</h2>
      <label>
        {isItemCompra ? 'ID da compra e ID do produto' : 'ID, email ou codigo'}
        <input
          onChange={(event) => onChange(event.target.value)}
          placeholder={isItemCompra ? 'Exemplo: 1/2' : 'Digite para pesquisar'}
          value={searchTerm}
        />
      </label>
      <div className="button-row">
        <button type="submit">Pesquisar</button>
      </div>
    </form>
  )
}
