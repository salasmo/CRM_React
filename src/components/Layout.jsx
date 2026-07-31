import { LayoutDashboard, Users, Home, KanbanSquare, Building2, Menu, X, Search, Bell, CheckSquare, Contact, Calendar, BarChart3 } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/propiedades', label: 'Propiedades', icon: Home },
  { to: '/pipeline', label: 'Pipeline', icon: KanbanSquare },
  { to: '/tareas', label: 'Tareas', icon: CheckSquare },
  { to: '/contactos', label: 'Contactos', icon: Contact },
  { to: '/calendario', label: 'Calendario', icon: Calendar },
  { to: '/reportes', label: 'Reportes', icon: BarChart3 },
]