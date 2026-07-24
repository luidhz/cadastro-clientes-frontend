import { Fragment, useEffect, useState } from 'react'
import {
  createCompra,
  deleteCompra,
  listCompras,
  listProdutosCatalogo,
  listUsuariosCatalogo,
  updateCompra,
} from '../services/api'
import { formatCurrency, formatDate } from '../utils/formatters'
import { CarrinhoCompra } from './CarrinhoCompra'
import { Message } from './Message'

const ITENS_INICIAIS = []

export function ComprasAdmin() {
  const [compras, setCompras] = useState([])
  const [produtos, setProdutos] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [usuarioId, setUsuarioId] = useState('')
  const [itens, setItens] = useState(ITENS_INICIAIS)
  const [editingCompra, setEditingCompra] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    setMessage('')

    try {
      const [comprasData, produtosData, usuariosData] = await Promise.all([
        listCompras(),
        listProdutosCatalogo(),
        listUsuariosCatalogo(),
      ])
      setCompras(comprasData)
      setProdutos(produtosData)
      setUsuarios(usuariosData)
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  function handleAddItem(item) {
    setItens((current) => {
      const existente = current.find((atual) => atual.produtoId === item.produtoId)

      if (existente) {
        return current.map((atual) =>
          atual.produtoId === item.produtoId
            ? { ...atual, quantidade: atual.quantidade + item.quantidade }
            : atual
        )
      }

      return [...current, item]
    })
  }

  function handleRemoveItem(produtoId) {
    setItens((current) => current.filter((item) => item.produtoId !== produtoId))
  }

  function resetForm() {
    setUsuarioId('')
    setItens(ITENS_INICIAIS)
    setEditingCompra(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!usuarioId) {
      setMessage('Selecione um usuário para associar a compra.')
      return
    }

    if (!itens.length) {
      setMessage('Adicione ao menos um produto à compra.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      if (editingCompra) {
        await updateCompra(editingCompra.id, usuarioId, itens)
      } else {
        await createCompra(usuarioId, itens)
      }

      resetForm()
      await loadAll()
      setMessage(editingCompra ? 'Compra atualizada com sucesso.' : 'Compra criada com sucesso.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  function handleEdit(compra) {
    setEditingCompra(compra)
    setUsuarioId(compra.usuario?.id ?? '')
    setItens(
      (compra.itens || []).map((item) => ({
        produtoId: item.produtoId,
        nome: item.produtoNome,
        preco: item.precoUnitario ?? 0,
        quantidade: item.quantidade,
      }))
    )
    setMessage('')
  }

  async function handleDelete(compra) {
    setLoading(true)
    setMessage('')

    try {
      await deleteCompra(compra.id)
      await loadAll()
      setMessage('Compra removida com sucesso.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page">
      <header className="workspace-header">
        <div>
          <h1>Compras</h1>
          <p>Crie compras e associe a um usuário, visualize, atualize e remova compras.</p>
        </div>
      </header>

      <form className="panel form-panel" onSubmit={handleSubmit}>
        <h2>{editingCompra ? `Editando compra #${editingCompra.id}` : 'Nova compra'}</h2>

        <label>
          Usuário
          <select onChange={(event) => setUsuarioId(event.target.value)} value={usuarioId}>
            <option value="">Selecione um usuário</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nome} — {usuario.email}
              </option>
            ))}
          </select>
        </label>

        <CarrinhoCompra itens={itens} onAdd={handleAddItem} onRemove={handleRemoveItem} produtos={produtos} />

        <div className="button-row">
          <button disabled={loading} type="submit">
            {editingCompra ? 'Atualizar compra' : 'Criar compra'}
          </button>

          {editingCompra && (
            <button className="ghost-button" disabled={loading} onClick={resetForm} type="button">
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      <Message text={message} />

      <section className="panel table-panel">
        <div className="table-header">
          <h2>Todas as compras</h2>
          {loading && <span>Carregando...</span>}
        </div>

        {!compras.length ? (
          <div className="empty-state">Nenhuma compra encontrada.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuário</th>
                  <th>Data</th>
                  <th>Itens</th>
                  <th>Total</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((compra) => (
                  <Fragment key={compra.id}>
                    <tr>
                      <td>{compra.id}</td>
                      <td>{compra.usuario?.nome || compra.usuario?.email || compra.usuario?.id}</td>
                      <td>{formatDate(compra.dataCompra)}</td>
                      <td>
                        <button
                          className="ghost-button small-button"
                          onClick={() => setExpandedId(expandedId === compra.id ? null : compra.id)}
                          type="button"
                        >
                          {expandedId === compra.id ? 'Ocultar' : `Ver (${(compra.itens || []).length})`}
                        </button>
                      </td>
                      <td>{formatCurrency(compra.valorTotal)}</td>
                      <td>
                        <div className="table-actions">
                          <button className="ghost-button small-button" onClick={() => handleEdit(compra)} type="button">
                            Editar
                          </button>
                          <button className="danger-button" onClick={() => handleDelete(compra)} type="button">
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>

                    {expandedId === compra.id && (
                      <tr>
                        <td colSpan={6}>
                          <ul className="itens-detalhe">
                            {(compra.itens || []).map((item) => (
                              <li key={item.produtoId}>
                                {item.produtoNome} — {item.quantidade}x {formatCurrency(item.precoUnitario)}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  )
}
