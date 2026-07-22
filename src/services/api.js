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

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem('usuarioLogado')
    window.location.reload()
    throw new Error('Sessão expirada. Faça login novamente.')
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
  return apiRequest(`${SECTIONS[sectionKey].endpoint}/${buildResourceId(sectionKey, id)}`, {
    method: 'PUT',
    body: JSON.stringify(buildPayload(sectionKey, form)),
  })
}

export function deleteResource(sectionKey, id) {
  return apiRequest(`${SECTIONS[sectionKey].endpoint}/${buildResourceId(sectionKey, id)}`, {
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

  if (sectionKey === 'itensCompra') {
    const [compraId, produtoId] = cleanTerm.split(/[,\s/;-]+/)

    if (!compraId || !produtoId) {
      throw new Error('Digite o ID da compra e o ID do produto. Exemplo: 1/2')
    }

    return apiRequest(`/itens-compra/${compraId}/${produtoId}`)
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

  if (sectionKey === 'produtos') {
    return {
      codigoDeBarras: form.codigoDeBarras,
      nome: form.nome,
      preco: Number(form.preco),
      qtdeEmEstoque: Number(form.qtdeEmEstoque),
    }
  }

  if (sectionKey === 'compras') {
    return {
      usuario: {
        id: Number(form.usuarioId),
      },
      valorTotal: Number(form.valorTotal),
      itens: [],
    }
  }

  return {
    compra: {
      id: Number(form.compraId),
    },
    produto: {
      id: Number(form.produtoId),
    },
    quantidade: Number(form.quantidade),
    precoUnitario: Number(form.precoUnitario),
  }
}

function buildResourceId(sectionKey, id) {
  if (sectionKey === 'itensCompra') {
    return `${id.compraId}/${id.produtoId}`
  }

  return id
}
