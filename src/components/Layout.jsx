import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Users, Home, KanbanSquare, Building2, Menu, X, Search, Bell, CheckSquare, Contact, Calendar, BarChart3, UserCog, LogOut, Megaphone } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/propiedades', label: 'Propiedades', icon: Home },
  { to: '/pipeline', label: 'Pipeline', icon: KanbanSquare },
  { to: '/tareas', label: 'Tareas', icon: CheckSquare },
  { to: '/contactos', label: 'Contactos', icon: Contact },
  { to: '/calendario', label: 'Calendario', icon: Calendar },
  { to: '/reportes', label: 'Reportes', icon: BarChart3 },
  { to: '/vendedores', label: 'Vendedores', icon: UserCog },
  { to: '/meta-ads', label: 'Meta Ads', icon: Megaphone },
]

function SidebarLinks({ onClick }) {
  return (
    <>
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
              isActive ? 'bg-sf-blue/10 text-sf-blue' : 'text-sf-text-muted hover:bg-sf-bg hover:text-sf-text'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </>
  )
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { profile, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-sf-bg text-sf-text">
      <header className="bg-sf-navy text-white h-14 flex items-center px-4 gap-4 sticky top-0 z-30">
        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className="flex items-center gap-2 font-bold text-lg whitespace-nowrap">
          <Building2 className="text-sf-blue" size={22} />
          Terralta CRM
        </div>
        <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-md px-3 py-1.5 flex-1 max-w-md ml-4">
          <Search size={16} className="text-white/60" />
          <input placeholder="Buscar..." className="bg-transparent outline-none text-sm placeholder-white/50 flex-1 text-white" />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Bell size={18} className="text-white/80" />
          <span className="hidden sm:block text-sm">{profile?.nombre || 'Usuario'}</span>
          <div className="w-8 h-8 rounded-full bg-sf-blue flex items-center justify-center text-sm font-semibold">
            {(profile?.nombre || 'U')[0].toUpperCase()}
          </div>
          <button onClick={signOut} title="Cerrar sesión" className="text-white/70 hover:text-white">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden lg:flex w-56 flex-col gap-1 bg-white border-r border-sf-border p-3 sticky top-14 h-[calc(100vh-56px)]">
          <SidebarLinks onClick={() => {}} />
        </aside>

        {menuOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setMenuOpen(false)} />
            <aside className="fixed top-14 left-0 bottom-0 w-64 bg-white border-r border-sf-border p-3 z-30 lg:hidden">
              <SidebarLinks onClick={() => setMenuOpen(false)} />
            </aside>
          </>
        )}

        <main className="flex-1 p-4 md:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}