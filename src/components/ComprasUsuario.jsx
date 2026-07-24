import { Fragment, useEffect, useState } from 'react'
import { createCompra, listCompras, listProdutosCatalogo } from '../services/api'
import { formatCurrency, formatDate } from '../utils/formatters'
import { CarrinhoCompra } from './CarrinhoCompra'
import { Message } from './Message'

export function ComprasUsuario({ usuarioLogado }) {
  const [minhasCompras, setMinhasCompras] = useState([])
  const [produtos, setProdutos] = useState([])
  const [itens, setItens] = useState([])
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
      const [comprasData, produtosData] = await Promise.all([listCompras(), listProdutosCatalogo()])
      setMinhasCompras(comprasData)
      setProdutos(produtosData)
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

  async function handleFinalizarCompra(event) {
    event.preventDefault()

    if (!itens.length) {
      setMessage('Adicione ao menos um produto ao carrinho.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      await createCompra(usuarioLogado.id, itens)
      setItens([])
      await loadAll()
      setMessage('Compra realizada com sucesso!')
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
          <p>Escolha produtos e finalize sua compra. Aqui você também acompanha o que já comprou.</p>
        </div>
      </header>

      <form className="panel form-panel" onSubmit={handleFinalizarCompra}>
        <h2>Nova compra</h2>

        <CarrinhoCompra itens={itens} onAdd={handleAddItem} onRemove={handleRemoveItem} produtos={produtos} />

        <div className="button-row">
          <button disabled={loading || !itens.length} type="submit">
            Finalizar compra
          </button>
        </div>
      </form>

      <Message text={message} />

      <section className="panel table-panel">
        <div className="table-header">
          <h2>Minhas compras</h2>
          {loading && <span>Carregando...</span>}
        </div>

        {!minhasCompras.length ? (
          <div className="empty-state">Você ainda não fez nenhuma compra.</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Data</th>
                  <th>Itens</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {minhasCompras.map((compra) => (
                  <Fragment key={compra.id}>
                    <tr>
                      <td>{compra.id}</td>
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
                    </tr>

                    {expandedId === compra.id && (
                      <tr>
                        <td colSpan={4}>
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
