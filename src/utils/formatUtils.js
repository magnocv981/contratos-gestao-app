// src/utils/formatUtils.js

export function formatarData(data) {
  if (!data) return '';
  const date = new Date(data);
  return date.toLocaleDateString('pt-BR');
}

export function formatarDataInput(data) {
  if (!data) return '';
  const date = new Date(data);
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
}

export function formatarMoeda(valor) {
  if (!valor && valor !== 0) return '';
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}
