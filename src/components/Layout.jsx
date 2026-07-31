import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Users, Home, KanbanSquare, Building2 } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/propiedades', label: 'Propiedades', icon: Home },
  { to: '/pipeline', label: 'Pipeline', icon: KanbanSquare },
]

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-8">
          <Building2 className="text-emerald-400" size={28} />
          <span className="text-xl font-bold">Terralta CRM</span>
        </div>
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}