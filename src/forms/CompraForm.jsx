export function CompraForm({ form, onChange }) {
  return (
    <>
      <label>
        ID do usuário
        <input
          min="1"
          onChange={(event) => onChange('usuarioId', event.target.value)}
          placeholder="1"
          required
          type="number"
          value={form.usuarioId}
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
