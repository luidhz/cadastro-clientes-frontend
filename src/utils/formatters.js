export function formatCurrency(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    currency: 'BRL',
    style: 'currency',
  })
}

export function formatDate(value) {
  if (!value) {
    return '-'
  }

  return new Date(value).toLocaleString('pt-BR')
}
