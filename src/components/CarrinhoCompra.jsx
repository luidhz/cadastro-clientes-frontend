import { useState } from 'react'
import { formatCurrency } from '../utils/formatters'

export function CarrinhoCompra({ itens, onAdd, onRemove, produtos }) {
  const [produtoId, setProdutoId] = useState('')
  const [quantidade, setQuantidade] = useState(1)

  const total = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0)

  function handleAdd(event) {
    event.preventDefault()
    event.stopPropagation()

    if (!produtoId || quantidade <= 0) {
      return
    }

    const produto = produtos.find((item) => String(item.id) === String(produtoId))
    if (!produto) {
      return
    }

    onAdd({
      produtoId: produto.id,
      nome: produto.nome,
      preco: produto.preco,
      quantidade: Number(quantidade),
    })

    setProdutoId('')
    setQuantidade(1)
  }

  return (
    <div className="cart-panel">
      <div className="cart-add-row">
        <label>
          Produto
          <select onChange={(event) => setProdutoId(event.target.value)} value={produtoId}>
            <option value="">Selecione um produto</option>
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome} — {formatCurrency(produto.preco)} (estoque: {produto.qtdeEmEstoque})
              </option>
            ))}
          </select>
        </label>

        <label className="cart-qtd-label">
          Qtde
          <input
            min="1"
            onChange={(event) => setQuantidade(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleAdd(event)
              }
            }}
            type="number"
            value={quantidade}
          />
        </label>

        <button className="ghost-button" disabled={!produtoId} onClick={handleAdd} type="button">
          Adicionar
        </button>
      </div>

      {!itens.length ? (
        <div className="empty-state">Nenhum item adicionado ainda.</div>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Qtde</th>
              <th>Preço unit.</th>
              <th>Subtotal</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => (
              <tr key={item.produtoId}>
                <td>{item.nome}</td>
                <td>{item.quantidade}</td>
                <td>{formatCurrency(item.preco)}</td>
                <td>{formatCurrency(item.preco * item.quantidade)}</td>
                <td>
                  <button className="danger-button small-button" onClick={() => onRemove(item.produtoId)} type="button">
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="cart-total">
        Total: <strong>{formatCurrency(total)}</strong>
      </div>
    </div>
  )
}
