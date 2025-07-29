// src/components/CardsResumoContratos.jsx
import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { formatarMoeda } from '../utils/formatUtils'

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
      if (error) {
        console.error('Erro:', error.message)
        return
      }

      const hoje = new Date()
      const em30dias = new Date()
      em30dias.setDate(hoje.getDate() + 30)

      const total = data.length
      const ativos = data.filter((c) => c.status === 'Ativo').length
      const pendentes = data.filter((c) => c.status === 'Pendente').length
      const concluidos = data.filter((c) => c.status === 'Encerrado').length
      const valorGlobal = data.reduce((acc, c) => acc + Number(c.valor_global || 0), 0)
      const proximosEncerrar = data.filter((c) => {
        const dtEnc = new Date(c.encerramento)
        return dtEnc >= hoje && dtEnc <= em30dias
      }).length

      setDados({ total, ativos, pendentes, concluidos, valorGlobal, proximosEncerrar })
    }

    carregarResumo()
  }, [])

  // Classe comum para todos os cards
  const cardClass = 'rounded-x1 shadow-card p-5 text-white flex flex-col justify-between transition transform hover:scale-105 duration-200'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card title="Total de Contratos" value={dados.total} bg="bg-gray-900" />
      <Card title="Contratos Ativos" value={dados.ativos} bg="bg-gray-900" />
      <Card title="Pendentes" value={dados.pendentes} bg="bg-gray-900 text-black" />
      <Card title="Concluídos" value={dados.concluidos} bg="bg-gray-900" />
      <Card title="Valor Global Total" value={formatarMoeda(dados.valorGlobal)} bg="bg-gray-900" />
      <Card title="Encerrando em 30 dias" value={dados.proximosEncerrar} bg="bg-gray-900" />
    </div>
  )
}

function Card({ title, value, bg }) {
  return (
    <div className={`${bg} rounded-xl shadow-card p-4 text-white flex flex-col justify-between transition transform hover:scale-105 duration-200`}>
      <h4 className="text-md font-semibold mb-3 text-white opacity-90">{title}</h4>
      <p className="text-2xl font-semibold text-azul-claro">{value}</p>
    </div>
  )
}

