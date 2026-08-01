import { useState, useEffect, useRef } from 'react'
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom'
import { LayoutDashboard, Users, Home, KanbanSquare, Building2, Menu, X, Search, Bell, CheckSquare, Contact, Calendar, BarChart3, UserCog, LogOut, Megaphone, Settings as SettingsIcon, Target, MessageCircle, TrendingUp, ChevronDown, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const navItems = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/resumen-ejecutivo', label: 'Resumen Ejecutivo', icon: TrendingUp },
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
]

function TopNavLinks() {
  return (
    <>
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
              isActive
                ? 'border-sf-blue text-sf-blue'
                : 'border-transparent text-sf-text-muted hover:text-sf-text hover:border-sf-border'
            }`
          }
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}
    </>
  )
}

function MobileNavLinks({ onClick }) {
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
      <NavLink
        to="/configuracion"
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
            isActive ? 'bg-sf-blue/10 text-sf-blue' : 'text-sf-text-muted hover:bg-sf-bg hover:text-sf-text'
          }`
        }
      >
        <SettingsIcon size={18} />
        Configuración
      </NavLink>
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

function NotificationBell() {
  const { profile } = useAuth()
  const [show, setShow] = useState(false)
  const [avisos, setAvisos] = useState({ tareasVencidas: [], leadsSinCalificar: [] })
  const ref = useRef(null)

  useEffect(() => {
    function fuera(e) {
      if (ref.current && !ref.current.contains(e.target)) setShow(false)
    }
    document.addEventListener('mousedown', fuera)
    return () => document.removeEventListener('mousedown', fuera)
  }, [])

  async function cargarAvisos() {
    const hoy = new Date().toISOString().slice(0, 10)
    const isAdmin = profile?.rol === 'admin'

    let tareasQuery = supabase.from('tasks').select('id, titulo, fecha_limite').eq('completada', false).lt('fecha_limite', hoy)
    const { data: tareasVencidas } = await tareasQuery

    let leadsQuery = supabase.from('leads').select('id, nombre').is('calificacion', null).not('estado', 'in', '("Cerrado","Perdido")')
    if (!isAdmin && profile?.vendedor_id) {
      leadsQuery = leadsQuery.eq('vendedor_id', profile.vendedor_id)
    }
    const { data: leadsSinCalificar } = await leadsQuery

    setAvisos({ tareasVencidas: tareasVencidas || [], leadsSinCalificar: leadsSinCalificar || [] })
  }

  useEffect(() => {
    cargarAvisos()
    const interval = setInterval(cargarAvisos, 60000)
    return () => clearInterval(interval)
  }, [profile])

  const total = avisos.tareasVencidas.length + avisos.leadsSinCalificar.length

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setShow(!show)} className="relative text-white/80 hover:text-white">
        <Bell size={18} />
        {total > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-sf-danger text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {total > 9 ? '9+' : total}
          </span>
        )}
      </button>

      {show && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-sf-border rounded-md shadow-lg text-sf-text z-40 max-h-80 overflow-y-auto">
          <p className="px-4 py-3 text-xs font-semibold text-sf-text-muted uppercase border-b border-sf-border">Avisos</p>
          {total === 0 && <p className="px-4 py-4 text-sm text-sf-text-muted">Todo al día, sin pendientes.</p>}

          {avisos.tareasVencidas.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-sf-danger uppercase">Tareas vencidas</p>
              {avisos.tareasVencidas.map(t => (
                <Link key={t.id} to="/tareas" onClick={() => setShow(false)} className="flex items-start gap-2 px-4 py-2 text-sm hover:bg-sf-bg">
                  <AlertCircle size={14} className="text-sf-danger mt-0.5 shrink-0" />
                  <span className="truncate">{t.titulo}</span>
                </Link>
              ))}
            </div>
          )}

          {avisos.leadsSinCalificar.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-xs font-semibold text-sf-warning uppercase">Leads sin calificar</p>
              {avisos.leadsSinCalificar.map(l => (
                <Link key={l.id} to="/leads" onClick={() => setShow(false)} className="flex items-start gap-2 px-4 py-2 text-sm hover:bg-sf-bg">
                  <AlertCircle size={14} className="text-sf-warning mt-0.5 shrink-0" />
                  <span className="truncate">{l.nombre}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function UserMenu() {
  const { profile, session, signOut } = useAuth()
  const [show, setShow] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function fuera(e) {
      if (ref.current && !ref.current.contains(e.target)) setShow(false)
    }
    document.addEventListener('mousedown', fuera)
    return () => document.removeEventListener('mousedown', fuera)
  }, [])

  const nombreMostrado = profile?.nombre || session?.user?.email?.split('@')[0] || 'Usuario'

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setShow(!show)} className="flex items-center gap-2 text-white">
        <span className="hidden sm:block text-sm">{nombreMostrado}</span>
        <div className="w-8 h-8 rounded-full bg-sf-blue flex items-center justify-center text-sm font-semibold">
          {nombreMostrado[0].toUpperCase()}
        </div>
        <ChevronDown size={14} className="text-white/70 hidden sm:block" />
      </button>

      {show && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-sf-border rounded-md shadow-lg text-sf-text z-40 overflow-hidden">
          <div className="px-4 py-3 border-b border-sf-border">
            <p className="text-sm font-medium truncate">{nombreMostrado}</p>
            <p className="text-xs text-sf-text-muted truncate">{session?.user?.email}</p>
          </div>
          <Link to="/configuracion" onClick={() => setShow(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-sf-bg">
            <SettingsIcon size={16} /> Configuración
          </Link>
          <button onClick={signOut} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-sf-danger hover:bg-sf-bg">
            <LogOut size={16} /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-sf-bg text-sf-text flex flex-col">
      <header className="bg-sf-navy text-white h-14 flex items-center px-4 gap-4 sticky top-0 z-30 shrink-0">
        <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div className="flex items-center gap-2 font-bold text-lg whitespace-nowrap">
          <Building2 className="text-sf-blue" size={22} />
          Estatera
        </div>

        <GlobalSearch />

        <div className="ml-auto flex items-center gap-4">
          <NotificationBell />
          <UserMenu />
        </div>
      </header>

      <nav className="hidden lg:flex bg-white border-b border-sf-border px-4 overflow-x-auto sticky top-14 z-20 shrink-0">
        <TopNavLinks />
      </nav>

      {menuOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setMenuOpen(false)} />
          <aside className="fixed top-14 left-0 bottom-0 w-64 bg-white border-r border-sf-border p-3 z-30 lg:hidden overflow-y-auto">
            <MobileNavLinks onClick={() => setMenuOpen(false)} />
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
  )
}