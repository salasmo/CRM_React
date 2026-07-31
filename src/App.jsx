import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Properties from './pages/Properties'
import Pipeline from './pages/Pipeline'
import { useLocalStorage } from './hooks/useLocalStorage'
import { initialLeads, initialProperties } from './data/mockData'

function App() {
  const [leads, setLeads] = useLocalStorage('crm-leads', initialLeads)
  const [properties, setProperties] = useLocalStorage('crm-properties', initialProperties)

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard leads={leads} properties={properties} />} />
        <Route path="/leads" element={<Leads leads={leads} setLeads={setLeads} properties={properties} />} />
        <Route path="/propiedades" element={<Properties properties={properties} setProperties={setProperties} />} />
        <Route path="/pipeline" element={<Pipeline leads={leads} setLeads={setLeads} />} />
      </Route>
    </Routes>
  )
}

export default App