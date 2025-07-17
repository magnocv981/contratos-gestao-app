import React, { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { formatarData, formatarMoeda } from "../../utils/formatUtils";

export default function ComentariosContrato({ contratoId }) {
  const [comentarios, setComentarios] = useState([])
  const [novoComentario, setNovoComentario] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    if (contratoId) carregarComentarios()
  }, [contratoId])

  async function carregarComentarios() {
    const { data } = await supabase
      .from('historico_comentarios')
      .select('*')
      .eq('contrato_id', contratoId)
      .order('criado_em', { ascending: false })
    setComentarios(data)
  }

  async function handleAddComentario(e) {
    e.preventDefault()
    if (!novoComentario.trim()) return
    setCarregando(true)

    const { data, error } = await supabase
      .from('historico_comentarios')
      .insert({
        contrato_id: contratoId,
        comentario: novoComentario.trim(),
      })
      .select()

    if (!error && data?.length) {
      setComentarios((prev) => [data[0], ...prev])
      setNovoComentario('')
    }
    setCarregando(false)
  }

  return (
    <div className="mt-8 bg-gray-900 p-4 rounded">
      <h2 className="text-xl font-bold text-blue-300 mb-4">📝 Histórico de Comentários</h2>

      <form onSubmit={handleAddComentario} className="mb-6">
        <textarea
          rows={3}
          value={novoComentario}
          onChange={(e) => setNovoComentario(e.target.value)}
          placeholder="Adicionar comentário..."
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white mb-2"
        />
        <button
          type="submit"
          disabled={carregando}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
        >
          {carregando ? 'Salvando…' : '➕ Adicionar Comentário'}
        </button>
      </form>

      {comentarios.length === 0 ? (
        <p className="text-gray-400">Nenhum comentário ainda.</p>
      ) : (
        <ul className="space-y-3">
          {comentarios.map((c) => (
            <li key={c.id} className="bg-gray-800 p-3 rounded border border-gray-700">
              <p className="text-sm">{c.comentario}</p>
              <p className="text-xs text-gray-400 mt-1">{formatarData(c.criado_em, true)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
