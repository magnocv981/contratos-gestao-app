import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { supabase } from "../../supabaseClient"

const estados = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT",
  "MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO",
  "RR","SC","SP","SE","TO"
]

export default function FormularioContrato() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editando = Boolean(id)

  const [form, setForm] = useState({
    cliente: "",
    estado: "",
    valor_global: "",
    status: "Ativo",
    qtde_plataformas: "",
    qtde_elevadores: "",
    objeto_contrato: "",
    contato_nome: "",
    contato_email: "",
    contato_telefone: "",
    inicio: "",
    encerramento: "",
  })

  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if (editando) {
      async function carregarContrato() {
        setCarregando(true)
        const { data, error } = await supabase
          .from("contratos")
          .select("*")
          .eq("id", id)
          .single()

        if (error) {
          setErro("Erro ao carregar contrato: " + error.message)
        } else if (data) {
          setForm({
            cliente: data.cliente || "",
            estado: data.estado || "",
            valor_global: data.valor_global?.toString() || "",
            status: data.status || "Ativo",
            qtde_plataformas: data.qtde_plataformas?.toString() || "",
            qtde_elevadores: data.qtde_elevadores?.toString() || "",
            objeto_contrato: data.objeto_contrato || "",
            contato_nome: data.contato_nome || "",
            contato_email: data.contato_email || "",
            contato_telefone: data.contato_telefone || "",
            inicio: data.inicio?.split("T")[0] || "",
            encerramento: data.encerramento?.split("T")[0] || "",
          })
        }
        setCarregando(false)
      }
      carregarContrato()
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCarregando(true)
    setErro(null)

    const dadosEnviar = {
      cliente: form.cliente,
      estado: form.estado,
      valor_global: parseFloat(form.valor_global) || 0,
      status: form.status,
      qtde_plataformas: parseInt(form.qtde_plataformas) || 0,
      qtde_elevadores: parseInt(form.qtde_elevadores) || 0,
      objeto_contrato: form.objeto_contrato,
      contato_nome: form.contato_nome,
      contato_email: form.contato_email,
      contato_telefone: form.contato_telefone,
      inicio: form.inicio,
      encerramento: form.encerramento,
    }

    const { error } = editando
      ? await supabase.from("contratos").update(dadosEnviar).eq("id", id)
      : await supabase.from("contratos").insert([dadosEnviar])

    if (error) {
      setErro("Erro ao salvar: " + error.message)
    } else {
      navigate("/contratos")
    }

    setCarregando(false)
  }

  const inputClass =
    "w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-azul-claro"

  return (
    <div className="max-w-4xl mx-auto p-6 bg-cinza-900 rounded-xl shadow-card">
      <h1 className="text-3xl font-bold text-azul-claro mb-6">
        {editando ? "Editar Contrato" : "Novo Contrato"}
      </h1>

      {erro && <p className="text-red-500 mb-4">{erro}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="block">
          Cliente / Órgão
          <input type="text" name="cliente" value={form.cliente} onChange={handleChange} required className={inputClass} />
        </label>

        <label className="block">
          Estado
          <select name="estado" value={form.estado} onChange={handleChange} required className={inputClass}>
            <option value="">Selecione o estado</option>
            {estados.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </label>

        <label className="block">
          Valor Global (R$)
          <input type="number" step="0.01" name="valor_global" value={form.valor_global} onChange={handleChange} required className={inputClass} />
        </label>

        <label className="block">
          Status
          <select name="status" value={form.status} onChange={handleChange} required className={inputClass}>
            <option value="Ativo">Ativo</option>
            <option value="Encerrado">Encerrado</option>
            <option value="Pendente">Pendente</option>
          </select>
        </label>

        <label className="block">
          Qtde Plataformas
          <input type="number" name="qtde_plataformas" value={form.qtde_plataformas} onChange={handleChange} className={inputClass} />
        </label>

        <label className="block">
          Qtde Elevadores
          <input type="number" name="qtde_elevadores" value={form.qtde_elevadores} onChange={handleChange} className={inputClass} />
        </label>

        <label className="block md:col-span-2">
          Objeto do Contrato
          <textarea name="objeto_contrato" value={form.objeto_contrato} onChange={handleChange} rows={4} required className={inputClass} />
        </label>

        <label className="block">
          Contato - Nome
          <input type="text" name="contato_nome" value={form.contato_nome} onChange={handleChange} className={inputClass} />
        </label>

        <label className="block">
          Contato - Email
          <input type="email" name="contato_email" value={form.contato_email} onChange={handleChange} className={inputClass} />
        </label>

        <label className="block">
          Contato - Telefone
          <input type="text" name="contato_telefone" value={form.contato_telefone} onChange={handleChange} className={inputClass} />
        </label>

        <label className="block">
          Início
          <input type="date" name="inicio" value={form.inicio} onChange={handleChange} required className={inputClass} />
        </label>

        <label className="block">
          Encerramento
          <input type="date" name="encerramento" value={form.encerramento} onChange={handleChange} required className={inputClass} />
        </label>

        <div className="md:col-span-2 flex justify-end gap-4 mt-4">
          <button type="button" onClick={() => navigate("/contratos")} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded">
            Cancelar
          </button>
          <button type="submit" disabled={carregando} className="bg-azul-escuro hover:bg-blue-900 text-white px-6 py-2 rounded disabled:opacity-60">
            {carregando ? "Salvando..." : "Salvar Contrato"}
          </button>
        </div>
      </form>
    </div>
  )
}
