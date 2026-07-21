export function ProdutoForm({ form, onChange }) {
  return (
    <>
      <label>
        Codigo de barras
        <input
          onChange={(event) => onChange('codigoDeBarras', event.target.value)}
          placeholder="0000000 000000"
          required
          value={form.codigoDeBarras}
        />
      </label>
      <label>
        Nome
        <input
          onChange={(event) => onChange('nome', event.target.value)}
          placeholder="Nome do produto"
          required
          value={form.nome}
        />
      </label>
      <label>
        Preco
        <input
          min="0"
          onChange={(event) => onChange('preco', event.target.value)}
          placeholder="0.00"
          required
          step="0.01"
          type="number"
          value={form.preco}
        />
      </label>
      <label>
        Estoque
        <input
          min="0"
          onChange={(event) => onChange('qtdeEmEstoque', event.target.value)}
          placeholder="0"
          required
          type="number"
          value={form.qtdeEmEstoque}
        />
      </label>
    </>
  )
}
