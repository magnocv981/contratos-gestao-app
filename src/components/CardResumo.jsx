// src/components/CardsResumoContratos.jsx
import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { formatarMoeda, formatarData } from '../utils/formatUtils'



export default function CardsResumoContratos() {
  const [dados, setDados] = useState({
    total: 0,
    ativos: 0,
    pendentes: 0,
    concluidos: 0,
    valorGlobal: 0,
    proximosEncerrar: 0,
  })

  useEffect(() => {
    async function carregarResumo() {
      const { data, error } = await supabase.from('contratos').select('*')
      if (error) return console.error('Erro:', error.message)

      const hoje = new Date()
      const em30dias = new Date()
      em30dias.setDate(hoje.getDate() + 30)

      const total = data.length
      const ativos = data.filter((c) => c.status === 'Ativo').length
      const pendentes = data.filter((c) => c.status === 'Pendente').length
      const concluidos = data.filter((c) => c.status === 'Concluído').length
      const valorGlobal = data.reduce((acc, c) => acc + Number(c.valor_global || 0), 0)
      const proximosEncerrar = data.filter((c) => new Date(c.encerramento) <= em30dias).length

      setDados({ total, ativos, pendentes, concluidos, valorGlobal, proximosEncerrar })
    }

    carregarResumo()
  }, [])

  const cardClass = 'rounded-xl shadow-md p-5 text-white flex flex-col justify-between transition transform hover:scale-105 duration-200'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card title="Total de Contratos" value={dados.total} bg="bg-blue-500" />
      <Card title="Contratos Ativos" value={dados.ativos} bg="bg-green-600" />
      <Card title="Pendentes" value={dados.pendentes} bg="bg-yellow-500 text-black" />
      <Card title="Concluídos" value={dados.concluidos} bg="bg-blue-700" />
      <Card title="Valor Global Total" value={formatarMoeda(dados.valorGlobal)} bg="bg-green-500" />
      <Card title="Encerrando em 30 dias" value={dados.proximosEncerrar} bg="bg-red-400" />
    </div>
  )
}

function Card({ title, value, bg }) {
  return (
    <div className={`${bg} ${'rounded-xl shadow-md p-5 text-white flex flex-col justify-between transition transform hover:scale-105 duration-200'}`}>
      <h3 className="text-md font-medium mb-2 opacity-90">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}
