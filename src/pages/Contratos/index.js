import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import CardResumo from './CardResumo'

export default function Contratos() {
  const [contratos, setContratos] = useState([])

  useEffect(() => {
    fetchContratos()
  }, [])

  async function fetchContratos() {
    const { data, error } = await supabase.from('contratos').select('*')
    if (!error && data) setContratos(data)
  }

  const totalContratos = contratos.length
  const totalAtivos = contratos.filter((c) => c.status === 'Ativo').length
  const totalPendentes = contratos.filter((c) => c.status === 'Pendente').length
  const valorGlobal = contratos.reduce((acc, c) => acc + (parseFloat(c.valor_global) || 0), 0)

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-400 mb-6">Contratos</h1>

        {/* Cards Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <CardResumo titulo="Total de Contratos" valor={totalContratos} />
          <CardResumo titulo="Contratos Ativos" valor={totalAtivos} />
          <CardResumo titulo="Contratos Pendentes" valor={totalPendentes} />
          <CardResumo titulo="Valor Global (R$)" valor={valorGlobal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
        </div>

        {/* Aqui vai a listagem dos contratos */}
        <div className="bg-gray-900 p-4 rounded shadow">
          <p className="text-gray-300">Tabela de contratos será exibida aqui...</p>
        </div>
      </div>
    </div>
  )
}
