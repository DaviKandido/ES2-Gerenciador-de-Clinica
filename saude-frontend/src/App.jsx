import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import ProfissionaisPage from './pages/ProfissionaisPage'
import AtendimentosPage from './pages/AtendimentosPage'
import AtendimentoDetalhe from './pages/AtendimentoDetalhe'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="profissionais" element={<ProfissionaisPage />} />
        <Route path="atendimentos" element={<AtendimentosPage />} />
        <Route path="atendimentos/:id" element={<AtendimentoDetalhe />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
