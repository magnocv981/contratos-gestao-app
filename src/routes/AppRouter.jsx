import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import FormContrato from '../pages/Contratos/FormularioContrato'
import ListaContratos from '../pages/Contratos/ListaContratos'
import Vendedor from '../pages/Vendedor/Vendedor'
import VisualizarContrato from '../pages/Contratos/VisualizarContrato'



export default function AppRouter() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<FormContrato />} />
        <Route path="/contratos/novo" element={<FormContrato />} />
        <Route path="/contratos" element={<ListaContratos />} />
        <Route path="/vendedor" element={<Vendedor />} />
        <Route path="/contratos/visualizar/:id" element={<VisualizarContrato />} />
        <Route path="/contratos/editar/:id" element={<FormContrato />} />

      </Routes>
    </MainLayout>
  )
}
