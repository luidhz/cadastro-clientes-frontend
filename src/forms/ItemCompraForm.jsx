export function ItemCompraForm({ form, onChange }) {
  return (
    <>
      <label>
        ID da compra
        <input
          min="1"
          onChange={(event) => onChange('compraId', event.target.value)}
          placeholder="1"
          required
          type="number"
          value={form.compraId}
        />
      </label>
      <label>
        ID do produto
        <input
          min="1"
          onChange={(event) => onChange('produtoId', event.target.value)}
          placeholder="1"
          required
          type="number"
          value={form.produtoId}
        />
      </label>
      <label>
        Quantidade
        <input
          min="1"
          onChange={(event) => onChange('quantidade', event.target.value)}
          placeholder="2"
          required
          type="number"
          value={form.quantidade}
        />
      </label>
      <label>
        Preco unitario
        <input
          min="0"
          onChange={(event) => onChange('precoUnitario', event.target.value)}
          placeholder="49.90"
          required
          step="0.01"
          type="number"
          value={form.precoUnitario}
        />
      </label>
    </>
  )
}
