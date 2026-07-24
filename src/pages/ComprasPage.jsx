import { ComprasAdmin } from '../components/ComprasAdmin'
import { ComprasUsuario } from '../components/ComprasUsuario'

export function ComprasPage({ canManage, usuarioLogado }) {
  if (canManage) {
    return <ComprasAdmin />
  }

  return <ComprasUsuario usuarioLogado={usuarioLogado} />
}
