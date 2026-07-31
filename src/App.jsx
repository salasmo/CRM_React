import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Properties from './pages/Properties'
import Pipeline from './pages/Pipeline'
import Tasks from './pages/Tasks'
import Contacts from './pages/Contacts'
import CalendarPage from './pages/Calendar'
import Reports from './pages/Reports'
import Vendedores from './pages/Vendedores'
import MetaAds from './pages/MetaAds'
import { useSupabaseTable } from './hooks/useSupabaseTable'

function ProtectedApp() {
  const { session, loading } = useAuth()
  const leadsTable = useSupabaseTable('leads')
  const propertiesTable = useSupabaseTable('properties')
  const tasksTable = useSupabaseTable('tasks')
  const contactsTable = useSupabaseTable('contacts')
  const eventsTable = useSupabaseTable('events')
  const vendedoresTable = useSupabaseTable('vendedores')

  if (loading) return <div className="min-h-screen flex items-center justify-center text-sf-text-muted">Cargando...</div>
  if (!session) return <Navigate to="/login" replace />

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard leads={leadsTable.data} properties={propertiesTable.data} tasks={tasksTable.data} />} />
        <Route path="/leads" element={<Leads leadsTable={leadsTable} properties={propertiesTable.data} vendedores={vendedoresTable.data} />} />
        <Route path="/propiedades" element={<Properties propertiesTable={propertiesTable} />} />
        <Route path="/pipeline" element={<Pipeline leadsTable={leadsTable} />} />
        <Route path="/tareas" element={<Tasks tasksTable={tasksTable} leads={leadsTable.data} />} />
        <Route path="/contactos" element={<Contacts contactsTable={contactsTable} />} />
        <Route path="/calendario" element={<CalendarPage eventsTable={eventsTable} leads={leadsTable.data} />} />
        <Route path="/reportes" element={<Reports leads={leadsTable.data} properties={propertiesTable.data} />} />
        <Route path="/vendedores" element={<Vendedores vendedoresTable={vendedoresTable} leads={leadsTable.data} />} />
        <Route path="/meta-ads" element={<MetaAds />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

function AppRoutes() {
  const { session, loading } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={!loading && session ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/*" element={<ProtectedApp />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}