// src/pages/Contratos/FormContrato.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../supabaseClient'

const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

function formatarMoeda(valor) {
  const numero = parseFloat(valor.toString().replace(/\D/g, '')) / 100 || 0
  return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function desformatarMoeda(valor) {
  return parseFloat(valor.toString().replace(/\D/g, '')) / 100 || 0
}

export default function FormContrato() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState({
    cliente: '',
    estado: '',
    valor_global: '',
    status: 'Ativo',
    quantidade_plataforma: 0,
    quantidade_elevador: 0,
    objeto: '',
    contato_nome: '',
    contato_email: '',
    contato_telefone: '',
    inicio: '',
    encerramento: '',
  })

  const [carregando, setCarregando] = useState(false)
  const [mensagem, setMensagem] = useState(null)

  useEffect(() => {
    async function carregarContrato() {
      if (id) {
        const { data, error } = await supabase
          .from('contratos')
          .select('*')
          .eq('id', id)
          .single()
        if (data) {
          setForm({ ...data, valor_global: formatarMoeda(data.valor_global) })
        } else if (error) {
          setMensagem('Erro ao carregar contrato: ' + error.message)
        }
      }
    }
    carregarContrato()
  }, [id])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setCarregando(true)
    setMensagem(null)

    const formEnviar = {
      ...form,
      valor_global: desformatarMoeda(form.valor_global),
    }

    const resultado = id
      ? await supabase.from('contratos').update(formEnviar).eq('id', id)
      : await supabase.from('contratos').insert([formEnviar])

    const { error } = resultado

    if (error) {
      setMensagem('Erro ao salvar: ' + error.message)
    } else {
      setMensagem('Contrato salvo com sucesso!')
      setTimeout(() => navigate('/contratos'), 1000)
    }
    setCarregando(false)
  }

  const inputClass = "w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 text-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold text-blue-400 mb-4">{id ? 'Editar Contrato' : 'Cadastro de Contrato'}</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-300">Cliente / Órgão</label>
          <input type="text" name="cliente" value={form.cliente} onChange={handleChange} className={inputClass} required />
        </div>

        <div>
          <label className="text-sm text-gray-300">Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange} className={inputClass} required>
            <option value="">Selecione o Estado</option>
            {ESTADOS_BR.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-300">Valor Global (R$)</label>
          <input
            type="text"
            name="valor_global"
            value={form.valor_global}
            onChange={handleChange}
            onBlur={(e) => setForm({ ...form, valor_global: formatarMoeda(e.target.value) })}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
            <option value="Ativo">Ativo</option>
            <option value="Pendente">Pendente</option>
            <option value="Concluído">Concluído</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-gray-300">Qtde Plataformas</label>
          <input type="number" name="quantidade_plataforma" value={form.quantidade_plataforma} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="text-sm text-gray-300">Qtde Elevadores</label>
          <input type="number" name="quantidade_elevador" value={form.quantidade_elevador} onChange={handleChange} className={inputClass} />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm text-gray-300">Objeto do Contrato</label>
          <textarea
            name="objeto"
            value={form.objeto}
            onChange={handleChange}
            className={`${inputClass} min-h-[100px] resize-y`}
            rows={4}
            required
          />
        </div>

        <div>
          <label className="text-sm text-gray-300">Contato - Nome</label>
          <input type="text" name="contato_nome" value={form.contato_nome} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="text-sm text-gray-300">Contato - Email</label>
          <input type="email" name="contato_email" value={form.contato_email} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="text-sm text-gray-300">Contato - Telefone</label>
          <input type="text" name="contato_telefone" value={form.contato_telefone} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="text-sm text-gray-300">Início</label>
          <input type="date" name="inicio" value={form.inicio} onChange={handleChange} className={inputClass} required />
        </div>

        <div>
          <label className="text-sm text-gray-300">Encerramento</label>
          <input type="date" name="encerramento" value={form.encerramento} onChange={handleChange} className={inputClass} required />
        </div>

        <div className="col-span-2 mt-4">
          <button
            type="submit"
            disabled={carregando}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white w-full"
          >
            {carregando ? 'Salvando...' : 'Salvar Contrato'}
          </button>
        </div>
      </form>

      {mensagem && <p className="mt-4 text-sm text-center text-blue-400">{mensagem}</p>}
    </div>
  )
}
