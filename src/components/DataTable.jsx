import { formatCurrency } from '../utils/formatters'

export function DataTable({ canManage, items, loading, onDelete, onEdit, sectionKey, title }) {
  return (
    <section className="panel table-panel">
      <div className="table-header">
        <h2>{title}</h2>
        {loading && <span>Carregando...</span>}
      </div>

      {!items.length ? (
        <div className="empty-state">Nenhum registro encontrado.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <TableHead canManage={canManage} sectionKey={sectionKey} />
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <TableCells item={item} sectionKey={sectionKey} />

                  {canManage && (
                    <td>
                      <div className="table-actions">
                        <button className="ghost-button small-button" onClick={() => onEdit(item)} type="button">
                          Editar
                        </button>
                        <button className="danger-button" onClick={() => onDelete(item)} type="button">
                          Excluir
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function TableHead({ canManage, sectionKey }) {
  const headers = {
    usuarios: ['ID', 'Nome', 'Email', 'Idade'],
    produtos: ['ID', 'Codigo', 'Produto', 'Preco', 'Estoque'],
  }

  return (
    <thead>
      <tr>
        {headers[sectionKey].map((header) => (
          <th key={header}>{header}</th>
        ))}
        {canManage && <th>Acoes</th>}
      </tr>
    </thead>
  )
}

function TableCells({ item, sectionKey }) {
  if (sectionKey === 'usuarios') {
    return (
      <>
        <td>{item.id}</td>
        <td>{item.nome}</td>
        <td>{item.email}</td>
        <td>{item.idade}</td>
      </>
    )
  }

  return (
    <>
      <td>{item.id}</td>
      <td>{item.codigoDeBarras}</td>
      <td>{item.nome}</td>
      <td>{formatCurrency(item.preco)}</td>
      <td>{item.qtdeEmEstoque}</td>
    </>
  )
}
