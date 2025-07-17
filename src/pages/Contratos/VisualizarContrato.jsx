import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import ComentariosContrato from './ComentariosContrato'
import { formatarData, formatarMoeda } from '../../utils/formatUtils'

export default function VisualizarContrato() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contrato, setContrato] = useState(null)

  useEffect(() => {
    async function fetchContrato() {
      const { data } = await supabase.from('contratos').select('*').eq('id', id).single()
      setContrato(data)
    }
    fetchContrato()
  }, [id])

  if (!contrato) return <p className="p-6 text-white">Carregando…</p>

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-400">Contrato • {contrato.cliente}</h1>
        <button
          onClick={() => navigate(`/contratos/editar/${id}`)}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          Editar
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 bg-gray-900 p-4 rounded">
        <Info label="Cliente / Órgão" value={contrato.cliente} />
        <Info label="Estado" value={contrato.estado} />
        <Info label="Valor Global" value={formatarMoeda(contrato.valor_global)} />
        <Info label="Status" value={contrato.status} />
        <Info label="Qtde Plataformas" value={contrato.quantidade_plataforma} />
        <Info label="Qtde Elevadores" value={contrato.quantidade_elevador} />
        <Info label="Início" value={formatarData(contrato.inicio)} />
        <Info label="Encerramento" value={formatarData(contrato.encerramento)} />
        <Info label="Objeto do Contrato" value={contrato.objeto} className="sm:col-span-2" />

        <Info label="Contato - Nome" value={contrato.contato_nome || '-'} className="sm:col-span-2" />
        <Info label="Contato - Email" value={contrato.contato_email || '-'} className="sm:col-span-2" />
        <Info label="Contato - Telefone" value={contrato.contato_telefone || '-'} className="sm:col-span-2" />
      </div>

      <ComentariosContrato contratoId={id} />
    </div>
  )
}

const Info = ({ label, value, className = '' }) => (
  <div className={`bg-gray-800 p-3 rounded ${className}`}>
    <p className="text-xs text-gray-400">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
)
