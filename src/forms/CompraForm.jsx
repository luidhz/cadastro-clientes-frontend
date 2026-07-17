export function CompraForm({ form, onChange }) {
  return (
    <>
      <label>
        ID do cliente
        <input
          min="1"
          onChange={(event) => onChange('clienteId', event.target.value)}
          placeholder="1"
          required
          type="number"
          value={form.clienteId}
        />
      </label>
      <label>
        Valor total
        <input
          min="0"
          onChange={(event) => onChange('valorTotal', event.target.value)}
          placeholder="129.90"
          required
          step="0.01"
          type="number"
          value={form.valorTotal}
        />
      </label>
    </>
  )
}
