import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Layout
import MainLayout from './layouts/MainLayout'

// Páginas
import Dashboard from './pages/Dashboard'
import ListaContratos from './pages/Contratos/ListaContratos'
import FormularioContrato from './pages/Contratos/FormularioContrato'
import VisualizarContrato from './pages/Contratos/VisualizarContrato'
import Vendedor from './pages/Vendedor/Vendedor'
import RelatorioEstado from './pages/Vendedor/RelatorioEstado' // ajuste o caminho se necessário

// Estilos globais (importante se estiver usando Tailwind)
import './index.css'

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contratos" element={<ListaContratos />} />
          <Route path="/contratos/novo" element={<FormularioContrato />} />
          <Route path="/contratos/editar/:id" element={<FormularioContrato />} />
          <Route path="/contratos/visualizar/:id" element={<VisualizarContrato />} />
          <Route path="/vendedor" element={<Vendedor />} />
          <Route path="/relatorio-estado" element={<RelatorioEstado />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

// Inicializa o React (caso ainda não esteja no seu projeto principal)
const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)
