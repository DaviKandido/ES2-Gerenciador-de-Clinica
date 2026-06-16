import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProfissionaisList from "./features/profissionais/pages/Listagem";
import ProfissionalForm from "./features/profissionais/pages/Formulario";

// 1. Importe a listagem de atendimentos
import AtendimentosList from "./features/atendimentos/pages/Listagem";
import AtendimentoForm from "./features/atendimentos/pages/Formulario";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={<h2 className="text-2xl font-bold">Dashboard Geral</h2>}
          />

          <Route path="/profissionais" element={<ProfissionaisList />} />
          <Route path="/profissionais/novo" element={<ProfissionalForm />} />

          <Route path="/atendimentos" element={<AtendimentosList />} />
          <Route path="/atendimentos/novo" element={<AtendimentoForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
