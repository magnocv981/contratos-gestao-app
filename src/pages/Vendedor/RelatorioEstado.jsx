import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useNavigate } from 'react-router-dom'

export default function RelatorioEstado() {
  const [contratos, setContratos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    async function buscarContratos() {
      const { data, error } = await supabase.from('contratos').select('*')
      if (!error && data) setContratos(data)
    }
    buscarContratos()
  }, [])

  const contratosPorEstado = Object.values(
    contratos.reduce((acc, curr) => {
      const estado = curr.estado || 'N/A'
      if (!acc[estado]) {
        acc[estado] = { estado, total: 0, valor: 0 }
      }
      acc[estado].total += 1
      acc[estado].valor += parseFloat(curr.valor_global || 0)
      return acc
    }, {})
  ).sort((a, b) => a.estado.localeCompare(b.estado))

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function exportarPDF() {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })

    doc.setFontSize(20)
    doc.setTextColor(0, 0, 0)
    doc.text(`Relatório Contratos por Estado – ${new Date().getFullYear()}`, 40, 40)

    autoTable(doc, {
      startY: 60,
      head: [['Estado', 'Qtd. Contratos', 'Valor Total']],
      body: contratosPorEstado.map((c) => [
        c.estado,
        c.total,
        formatarMoeda(c.valor),
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 6,
        textColor: [0, 0, 0], // Texto preto
      },
      headStyles: {
        fillColor: [0, 0, 0], // Cabeçalho preto
        textColor: 255,       // Texto branco
        fontStyle: 'bold',
      },
      // Sem linhas alternadas: estilo limpo
    })

    doc.save(`relatorio-estado-${new Date().getFullYear()}.pdf`)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Relatório por Estado</h1>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => navigate('/vendedor')}
          className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
        >
          Voltar
        </button>
        <button
          onClick={exportarPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Exportar PDF
        </button>
      </div>

      <div className="bg-blue-950 rounded shadow overflow-x-auto border border-blue-900">
        <table className="min-w-full text-sm text-white">
          <thead className="bg-blue-900">
            <tr>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Qtd. Contratos</th>
              <th className="px-4 py-3 text-left">Valor Total</th>
            </tr>
          </thead>
          <tbody>
            {contratosPorEstado.map((c, i) => (
              <tr key={c.estado} className="border-t border-blue-900 hover:bg-blue-800">
                <td className="px-4 py-2">{c.estado}</td>
                <td className="px-4 py-2">{c.total}</td>
                <td className="px-4 py-2">{formatarMoeda(c.valor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

