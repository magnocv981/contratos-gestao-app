// src/pages/Vendedor/Vendedor.jsx
import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatarData(data) {
  if (!data) return ''
  return new Date(data).toLocaleDateString('pt-BR')
}

export default function Vendedor() {
  const [contratos, setContratos] = useState([])
  const [filtroAno, setFiltroAno] = useState(new Date().getFullYear())

  useEffect(() => {
    buscarContratos()
  }, [filtroAno])

  async function buscarContratos() {
    const inicioAno = `${filtroAno}-01-01`
    const fimAno = `${filtroAno}-12-31`

    const { data, error } = await supabase
      .from('contratos')
      .select('*')
      .gte('inicio', inicioAno)
      .lte('inicio', fimAno)
      .order('inicio')

    if (!error) setContratos(data)
  }

  const totalVendas = contratos.reduce((acc, c) => acc + Number(c.valor_global || 0), 0)
  const totalComissao = totalVendas * 0.04

  function exportarPDF() {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
    doc.setFontSize(14)
    doc.text(`Relatório de Vendas – ${filtroAno}`, 40, 40)

     autoTable(doc, {
    startY: 60,              // onde a tabela começa no Y
    head: [['Cliente', 'Valor', 'Comissão', 'Início']], // cabeçalho
    body: contratos.map(c => [
      c.cliente,
      formatarMoeda(c.valor_global),
      formatarMoeda(c.valor_global * 0.04),
      formatarData(c.inicio)
    ]),
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    headStyles: { fillColor: [30, 64, 175] }, // azul-900
    alternateRowStyles: { fillColor: [30, 41, 59] }, // gray-800
  })

    const yFinal = doc.lastAutoTable.finalY + 20
  doc.setFontSize(12)
  doc.text(`Total de Vendas:  ${formatarMoeda(totalVendas)}`, 40, yFinal)
  doc.text(`Comissão (4%):    ${formatarMoeda(totalVendas * 0.04)}`, 40, yFinal + 16)


    doc.save(`relatorio-vendas-${filtroAno}.pdf`)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 text-white">
      <h1 className="text-2xl font-bold text-blue-400 mb-4">Módulo Vendedor</h1>

      {/* Filtro por ano */}
      <div className="flex flex-wrap gap-2 items-center mb-6">
        <select
          value={filtroAno}
          onChange={(e) => setFiltroAno(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 border border-gray-600"
        >
          {[...Array(5)].map((_, i) => {
            const ano = new Date().getFullYear() - i
            return (
              <option key={ano} value={ano}>
                {ano}
              </option>
            )
          })}
        </select>
        <button
          onClick={exportarPDF}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
        >
          Exportar PDF
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-blue-400 font-bold text-sm">Total de Vendas</h2>
          <p className="text-xl font-semibold">{formatarMoeda(totalVendas)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-blue-400 font-bold text-sm">Comissão (4%)</h2>
          <p className="text-xl font-semibold">{formatarMoeda(totalComissao)}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-blue-400 font-bold text-sm">Contratos no Ano</h2>
          <p className="text-xl font-semibold">{contratos.length}</p>
        </div>
      </div>

      {/* Tabela Responsiva */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th className="p-2 text-left">Cliente</th>
              <th className="p-2 text-left hidden sm:table-cell">Valor</th>
              <th className="p-2 text-left">Comissão</th>
              <th className="p-2 text-left hidden md:table-cell">Início</th>
            </tr>
          </thead>
          <tbody>
            {contratos.map((c) => (
              <tr key={c.id} className="border-b border-gray-700 hover:bg-gray-800">
                <td className="p-2">{c.cliente}</td>
                <td className="p-2 hidden sm:table-cell">{formatarMoeda(c.valor_global)}</td>
                <td className="p-2">{formatarMoeda(c.valor_global * 0.04)}</td>
                <td className="p-2 hidden md:table-cell">{formatarData(c.inicio)}</td>
              </tr>
            ))}
            {contratos.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">
                  Nenhum contrato encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}