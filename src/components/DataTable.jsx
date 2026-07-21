import { formatCurrency, formatDate } from '../utils/formatters'

export function DataTable({ items, loading, onDelete, onEdit, sectionKey, title }) {
  return (
    <section className="panel table-panel">
      <div className="table-header">
        <h2>{title} cadastrados</h2>
        {loading && <span>Carregando...</span>}
      </div>

      {!items.length ? (
        <div className="empty-state">Nenhum registro encontrado.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <TableHead sectionKey={sectionKey} />
            <tbody>
              {items.map((item) => (
                <tr key={getRowKey(sectionKey, item)}>
                  <TableCells item={item} sectionKey={sectionKey} />
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function TableHead({ sectionKey }) {
  const headers = {
    clientes: ['ID', 'Nome', 'Email', 'Idade', 'Ações'],
    produtos: ['ID', 'Código', 'Produto', 'Preço', 'Estoque', 'Ações'],
    compras: ['ID', 'Cliente', 'Data', 'Total', 'Ações'],
    itensCompra: ['Compra', 'Produto', 'Quantidade', 'Preco unitario', 'Subtotal', 'Ações'],
  }

  return (
    <thead>
      <tr>
        {headers[sectionKey].map((header) => (
          <th key={header}>{header}</th>
        ))}
      </tr>
    </thead>
  )
}

function TableCells({ item, sectionKey }) {
  if (sectionKey === 'clientes') {
    return (
      <>
        <td>{item.id}</td>
        <td>{item.nome}</td>
        <td>{item.email}</td>
        <td>{item.idade}</td>
      </>
    )
  }

  if (sectionKey === 'produtos') {
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

  if (sectionKey === 'itensCompra') {
    return (
      <>
        <td>{item.compra?.id || '-'}</td>
        <td>{item.produto?.nome || `Produto ${item.produto?.id || '-'}`}</td>
        <td>{item.quantidade}</td>
        <td>{formatCurrency(item.precoUnitario)}</td>
        <td>{formatCurrency(item.subTotal)}</td>
      </>
    )
  }

  return (
    <>
      <td>{item.id}</td>
      <td>{item.usuario?.nome || `Cliente ${item.usuario?.id || '-'}`}</td>
      <td>{formatDate(item.dataCompra)}</td>
      <td>{formatCurrency(item.valorTotal)}</td>
    </>
  )
}

function getRowKey(sectionKey, item) {
  if (sectionKey === 'itensCompra') {
    return `${item.compra?.id || 'compra'}-${item.produto?.id || 'produto'}`
  }

  return item.id
}
