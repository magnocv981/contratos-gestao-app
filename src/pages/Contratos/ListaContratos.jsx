import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { formatarMoeda, formatarData } from '../../utils/formatUtils'
import CardsResumoContratos from '../../components/CardResumo' // ✅ Importando os cards

export default function ListaContratos() {
  const [contratos, setContratos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function carregarContratos() {
      setCarregando(true)
      const { data, error } = await supabase
        .from('contratos')
        .select('*')
        .order('inicio', { ascending: true })

      if (error) {
        setErro('Erro ao carregar contratos: ' + error.message)
      } else {
        setContratos(data)
      }
      setCarregando(false)
    }

    carregarContratos()
  }, [])

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold text-azul-claro">Contratos</h1>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Voltar à Dashboard
          </button>
          <button
            onClick={() => navigate('/contratos/novo')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Novo Contrato
          </button>
        </div>
      </div>

      {/* ✅ Cards de resumo acima da tabela */}
      <CardsResumoContratos />

      {carregando && <p className="text-gray-300">Carregando contratos...</p>}
      {erro && <p className="text-red-500">{erro}</p>}

      {!carregando && contratos.length === 0 && (
        <p className="text-gray-400">Nenhum contrato encontrado.</p>
      )}

      {!carregando && contratos.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow border border-gray-700">
          <table className="min-w-full text-sm text-left text-gray-200 bg-gray-900">
            <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Valor Global</th>
                <th className="px-6 py-3">Início</th>
                <th className="px-6 py-3">Encerramento</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {contratos.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-gray-800 hover:bg-gray-800"
                >
                  <td className="px-6 py-3 whitespace-nowrap">{c.cliente}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{c.estado}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{formatarMoeda(c.valor_global)}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{formatarData(c.inicio)}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{formatarData(c.encerramento)}</td>
                  <td className="px-6 py-3 whitespace-nowrap">{c.status}</td>
                  <td className="px-6 py-3 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => navigate(`/contratos/visualizar/${c.id}`)}
                      className="text-blue-400 hover:underline"
                    >
                      Visualizar
                    </button>
                    <button
                      onClick={() => navigate(`/contratos/editar/${c.id}`)}
                      className="text-green-400 hover:underline"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
