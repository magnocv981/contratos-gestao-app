import React from 'react'
import Navbar from '../components/Navbar'

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex flex-col">
      {/* Navbar fixa no topo */}
      <Navbar />

      {/* Conteúdo principal centralizado e responsivo */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
