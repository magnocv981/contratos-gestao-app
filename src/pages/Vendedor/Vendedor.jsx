import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useNavigate } from 'react-router-dom'

function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatarData(data) {
  if (!data) return ''
  const [ano, mes, dia] = data.split('T')[0].split('-')
  return `${dia}/${mes}/${ano}`
}


export default function Vendedor() {
  const [contratos, setContratos] = useState([])
  const [filtroAno, setFiltroAno] = useState(new Date().getFullYear())
  const navigate = useNavigate()

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
  doc.setFontSize(20)
  doc.setTextColor(0, 0, 0) // Preto título
  doc.text(`Relatório de Vendas – ${filtroAno}`, 40, 40)

  autoTable(doc, {
  startY: 60,
  head: [['Cliente', 'Valor', 'Comissão']],
  body: contratos.map(c => [
    c.cliente,
    formatarMoeda(c.valor_global),
    formatarMoeda(c.valor_global * 0.04),
    
  ]),
  styles: {
    fontSize: 10,
    cellPadding: 6,
    textColor: [0, 0, 0],       // Texto preto nas células
  },
  headStyles: {
    fillColor: [0, 0, 0],       // Fundo preto no cabeçalho
    textColor: 255,             // Texto branco no cabeçalho
    fontStyle: 'bold',
  },
  // Nenhuma linha alternada: clean
})

  const yFinal = doc.lastAutoTable.finalY + 30
  doc.setFontSize(12)
  doc.setTextColor(0)
  doc.setFillColor(233, 236, 235)
  doc.rect(40, yFinal - 14, 480, 50, 'F')

  doc.text(`Total de Vendas:  ${formatarMoeda(totalVendas)}`, 50, yFinal)
  doc.text(`Comissão (4%):    ${formatarMoeda(totalComissao)}`, 50, yFinal + 18)

  doc.save(`relatorio-vendas-${filtroAno}.pdf`)
}


  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Relatório de Vendas – {filtroAno}</h1>

      {/* Filtros e Botões */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={filtroAno}
          onChange={(e) => setFiltroAno(e.target.value)}
          className="bg-gray-900 text-white border border-gray-700 px-3 py-2 rounded"
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
          className="bg-blue-900 hover:bg-blue-800 text-white font-medium px-4 py-2 rounded"
        >
          Exportar PDF
        </button>

        <button
          onClick={() => navigate('/relatorio-estado')}
          className="bg-blue-900 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded"
        >
          Relatório por Estado
        </button>
      </div>

      {/* Cards Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow">
          <h2 className="text-s font-semibold opacity-1">Total de Vendas</h2>
          <p className="text-2xl font-semibold mt-1">{formatarMoeda(totalVendas)}</p>
        </div>
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow">
          <h2 className="text-s font-semibold opacity-80">Comissão (4%)</h2>
          <p className="text-2xl font-semibold mt-1">{formatarMoeda(totalComissao)}</p>
        </div>
        <div className="bg-gray-900 text-white p-4 rounded-lg shadow">
          <h2 className="text-s font-semibold opacity-80">Contratos no Ano</h2>
          <p className="text-2xl font-semibold mt-1">{contratos.length}</p>
        </div>
      </div>

      {/* Tabela de Contratos */}
      <div className="overflow-x-auto rounded-lg border border-blue-900 shadow">
  <table className="min-w-full text-sm text-white bg-blue-950">
    <thead>
      <tr className="bg-blue-900 text-white text-left">
        <th className="px-4 py-3">Cliente</th>
        <th className="px-4 py-3">Valor</th>
        <th className="px-4 py-3">Comissão</th>
        <th className="px-4 py-3">Início</th>
      </tr>
    </thead>
    <tbody>
      {contratos.length > 0 ? (
        contratos.map((c, i) => (
          <tr
            key={c.id}
            className="border-t border-blue-900 hover:bg-blue-800 transition"
          >
            <td className="px-4 py-2">{c.cliente}</td>
            <td className="px-4 py-2">{formatarMoeda(c.valor_global)}</td>
            <td className="px-4 py-2">{formatarMoeda(c.valor_global * 0.04)}</td>
            <td className="px-4 py-2">{formatarData(c.inicio)}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="4" className="text-center py-5 text-gray-400">
            Nenhum contrato encontrado para {filtroAno}.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
    </div>
  )
}
