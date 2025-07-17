export function formatarMoeda(valor) {
  const numero = typeof valor === 'string' ? parseFloat(valor.replace(',', '.')) : valor;

  if (isNaN(numero)) return 'R$ 0,00';

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatarData(data, comHora = false) {
  const date = new Date(data);
  if (isNaN(date)) return '';

  const options = comHora
    ? {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
    : {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      };

  return date.toLocaleDateString('pt-BR', options);
}
