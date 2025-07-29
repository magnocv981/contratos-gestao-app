export const formatCurrency = (value) => {
  if (isNaN(value)) return 'R$ 0,00'
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export const formatDate = (value) => {
  if (!value) return ''
  return new Date(value).toLocaleDateString('pt-BR')
}
