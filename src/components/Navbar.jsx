// src/components/Navbar.jsx
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Users } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()

  const links = [
    { to: '/', label: 'Início', icon: <LayoutDashboard size={18} /> },
    { to: '/contratos', label: 'Contratos', icon: <FileText size={18} /> },
    { to: '/vendedor', label: 'Vendedor', icon: <Users size={18} /> },
  ]

  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-blue-400">Contrakto</span>

        <div className="flex gap-4 items-center">
          {links.map(({ to, label, icon }) => {
            const ativo = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded transition 
                  ${ativo ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
