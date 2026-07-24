import { UsuarioForm } from '../forms/UsuarioForm'
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
      <h2>{editingRecord ? 'Editando registro' : 'Novo cadastro'}</h2>

      {sectionKey === 'usuarios' && <UsuarioForm form={form} onChange={onChange} />}
      {sectionKey === 'produtos' && <ProdutoForm form={form} onChange={onChange} />}

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
