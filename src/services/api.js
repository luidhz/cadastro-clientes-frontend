import { SECTIONS } from '../constants/sections'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Nao foi possivel concluir a operacao.')
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

  if (sectionKey === 'clientes' && cleanTerm.includes('@')) {
    return apiRequest(`/clientes/buscar?email=${encodeURIComponent(cleanTerm)}`)
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
  if (sectionKey === 'clientes') {
    return {
      nome: form.nome,
      email: form.email,
      idade: Number(form.idade),
      senha: form.senha,
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

  return {
    cliente: {
      id: Number(form.clienteId),
    },
    valorTotal: Number(form.valorTotal),
    itens: [],
  }
}
