import { SECTIONS } from '../constants/sections'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function getToken() {
  const salvo = localStorage.getItem('usuarioLogado')
  if (!salvo) return null

  try {
    return JSON.parse(salvo).token || null
  } catch {
    return null
  }
}

async function apiRequest(path, options = {}) {
  const token = getToken()

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  })

  if (response.status === 401) {
  localStorage.removeItem('usuarioLogado')
  window.location.reload()
  throw new Error('Sessao expirada. Faca login novamente.')
}

if (response.status === 403) {
  throw new Error('Voce nao tem permissao para executar esta acao.')
}


  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Não foi possível concluir a operação.')
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export function listResources(sectionKey) {
  return apiRequest(SECTIONS[sectionKey].endpoint)
}

export function createResource(sectionKey, form) {
  return apiRequest(SECTIONS[sectionKey].endpoint, {
    method: 'POST',
    body: JSON.stringify(buildPayload(sectionKey, form)),
  })
}

export function updateResource(sectionKey, id, form) {
  return apiRequest(`${SECTIONS[sectionKey].endpoint}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(buildPayload(sectionKey, form)),
  })
}

export function deleteResource(sectionKey, id) {
  return apiRequest(`${SECTIONS[sectionKey].endpoint}/${id}`, {
    method: 'DELETE',
  })
}

export async function searchResource(sectionKey, term) {
  const cleanTerm = term.trim()

  if (sectionKey === 'usuarios' && cleanTerm.includes('@')) {
    return apiRequest(`/usuarios/buscar?email=${encodeURIComponent(cleanTerm)}`)
  }

  if (sectionKey === 'produtos') {
    if (!Number.isNaN(Number(cleanTerm))) {
      try {
        return await apiRequest(`/produtos/${cleanTerm}`)
      } catch {
        return apiRequest(`/produtos/buscar?codigo-de-barras=${encodeURIComponent(cleanTerm)}`)
      }
    }

    return apiRequest(`/produtos/buscar?codigo-de-barras=${encodeURIComponent(cleanTerm)}`)
  }

  return apiRequest(`${SECTIONS[sectionKey].endpoint}/${cleanTerm}`)
}

function buildPayload(sectionKey, form) {
  if (sectionKey === 'usuarios') {
    return {
      nome: form.nome,
      email: form.email,
      idade: Number(form.idade),
      senha: form.senha,
      role: form.role,
    }
  }

  return {
    codigoDeBarras: form.codigoDeBarras,
    nome: form.nome,
    preco: Number(form.preco),
    qtdeEmEstoque: Number(form.qtdeEmEstoque),
  }
}

// ---- Compras (fluxo dedicado com carrinho de itens) ----

export function listCompras() {
  return apiRequest('/compras')
}

export function getCompra(id) {
  return apiRequest(`/compras/${id}`)
}

export function listProdutosCatalogo() {
  return apiRequest('/produtos')
}

export function listUsuariosCatalogo() {
  return apiRequest('/usuarios')
}

export function buildCompraPayload(usuarioId, itens) {
  return {
    usuario: {
      id: Number(usuarioId),
    },
    itens: itens.map((item) => ({
      produto: {
        id: Number(item.produtoId),
      },
      quantidade: Number(item.quantidade),
    })),
  }
}

export function createCompra(usuarioId, itens) {
  return apiRequest('/compras', {
    method: 'POST',
    body: JSON.stringify(buildCompraPayload(usuarioId, itens)),
  })
}

export function updateCompra(id, usuarioId, itens) {
  return apiRequest(`/compras/${id}`, {
    method: 'PUT',
    body: JSON.stringify(buildCompraPayload(usuarioId, itens)),
  })
}

export function deleteCompra(id) {
  return apiRequest(`/compras/${id}`, {
    method: 'DELETE',
  })
}
