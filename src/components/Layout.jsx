import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, Users, Home, KanbanSquare, Building2, Menu, X, Search, Bell, CheckSquare, Contact, Calendar, BarChart3, UserCog, LogOut, Megaphone, Settings as SettingsIcon, Target, MessageCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

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
  { to: '/scoring', label: 'Scoring', icon: Target },
  { to: '/whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { to: '/configuracion', label: 'Configuración', icon: SettingsIcon },
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

function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState({ leads: [], properties: [], contacts: [] })
  const [showResults, setShowResults] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!query.trim()) {
      setResults({ leads: [], properties: [], contacts: [] })
      return
    }
    const timeout = setTimeout(async () => {
      const [leadsRes, propertiesRes, contactsRes] = await Promise.all([
        supabase.from('leads').select('id, nombre').ilike('nombre', `%${query}%`).limit(5),
        supabase.from('properties').select('id, nombre').ilike('nombre', `%${query}%`).limit(5),
        supabase.from('contacts').select('id, nombre').ilike('nombre', `%${query}%`).limit(5),
      ])
      setResults({
        leads: leadsRes.data || [],
        properties: propertiesRes.data || [],
        contacts: contactsRes.data || [],
      })
    }, 300)
    return () => clearTimeout(timeout)
  }, [query])

  function goTo(path) {
    navigate(path)
    setQuery('')
    setShowResults(false)
  }

  const totalResults = results.leads.length + results.properties.length + results.contacts.length

  return (
    <div className="hidden md:block relative flex-1 max-w-md ml-4">
      <div className="flex items-center gap-2 bg-white/10 rounded-md px-3 py-1.5">
        <Search size={16} className="text-white/60" />
        <input
          placeholder="Buscar leads, propiedades, contactos..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
          className="bg-transparent outline-none text-sm placeholder-white/50 flex-1 text-white"
        />
      </div>

      {showResults && query.trim() && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-sf-border rounded-md shadow-lg overflow-hidden text-sf-text z-40">
          {totalResults === 0 && (
            <p className="px-4 py-3 text-sm text-sf-text-muted">Sin resultados para "{query}"</p>
          )}
          {results.leads.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-sf-text-muted uppercase">Leads</p>
              {results.leads.map(l => (
                <button key={l.id} onClick={() => goTo('/leads')} className="w-full text-left px-4 py-2 text-sm hover:bg-sf-bg">{l.nombre}</button>
              ))}
            </div>
          )}
          {results.properties.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-sf-text-muted uppercase">Propiedades</p>
              {results.properties.map(p => (
                <button key={p.id} onClick={() => goTo('/propiedades')} className="w-full text-left px-4 py-2 text-sm hover:bg-sf-bg">{p.nombre}</button>
              ))}
            </div>
          )}
          {results.contacts.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-sf-text-muted uppercase">Contactos</p>
              {results.contacts.map(c => (
                <button key={c.id} onClick={() => goTo('/contactos')} className="w-full text-left px-4 py-2 text-sm hover:bg-sf-bg">{c.nombre}</button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
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
          Estatera
        </div>

        <GlobalSearch />

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
        <aside className="hidden lg:flex w-56 flex-col gap-1 bg-white border-r border-sf-border p-3 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
          <SidebarLinks onClick={() => {}} />
        </aside>

        {menuOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setMenuOpen(false)} />
            <aside className="fixed top-14 left-0 bottom-0 w-64 bg-white border-r border-sf-border p-3 z-30 lg:hidden overflow-y-auto">
              <SidebarLinks onClick={() => setMenuOpen(false)} />
            </aside>
          </>
        )}

        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 p-4 md:p-8">
            <Outlet />
          </div>
          <footer className="px-4 md:px-8 py-4 text-center">
            <Link to="/privacy-policy" className="text-xs text-sf-text-muted hover:text-sf-blue transition">
              Aviso de privacidad
            </Link>
          </footer>
        </main>
      </div>
    </div>
  )
}