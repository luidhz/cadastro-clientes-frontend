import { ClienteForm } from '../forms/ClienteForm'
import { CompraForm } from '../forms/CompraForm'
import { ProdutoForm } from '../forms/ProdutoForm'

export function ResourceForm({
  editingRecord,
  form,
  loading,
  onCancelEdit,
  onChange,
  onSubmit,
  sectionKey,
}) {
  return (
    <form className="panel form-panel" onSubmit={onSubmit}>
      <h2>{editingRecord ? `Editando registro #${editingRecord.id}` : 'Novo cadastro'}</h2>

      {sectionKey === 'clientes' && <ClienteForm form={form} onChange={onChange} />}
      {sectionKey === 'produtos' && <ProdutoForm form={form} onChange={onChange} />}
      {sectionKey === 'compras' && <CompraForm form={form} onChange={onChange} />}

      <div className="button-row">
        <button disabled={loading} type="submit">
          {editingRecord ? 'Atualizar' : 'Salvar'}
        </button>

        {editingRecord && (
          <button className="ghost-button" disabled={loading} onClick={onCancelEdit} type="button">
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
