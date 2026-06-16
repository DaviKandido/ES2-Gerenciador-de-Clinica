// src/features/profissionais/pages/Listagem.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Edit, Trash2 } from "lucide-react";
import { profissionaisService } from "../services";

export default function ProfissionaisList() {
  const [profissionais, setProfissionais] = useState([]);
  const navigate = useNavigate();

  const carregarDados = () => {
    profissionaisService
      .listarTodos()
      .then(setProfissionais)
      .catch((err) => console.error("Erro ao carregar profissionais", err));
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir?")) {
      await profissionaisService.excluir(id);
      carregarDados(); // Recarrega a lista após excluir
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Profissionais</h2>
          <p className="text-gray-500 text-sm mt-1">
            Gerencie a equipe de saúde clínica.
          </p>
        </div>
        <button
          onClick={() => navigate("/profissionais/novo")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors"
        >
          <UserPlus className="w-5 h-5" /> Novo Profissional
        </button>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profissionais.length === 0 ? (
          <p className="text-gray-500">Nenhum profissional cadastrado ainda.</p>
        ) : (
          profissionais.map((prof) => (
            <div
              key={prof.id}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="text-lg font-semibold">{prof.nome}</h3>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
                  {prof.categoria}
                </span>
              </div>
              <div className="mt-6 flex gap-4 border-t pt-4">
                <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium">
                  <Edit className="w-4 h-4" /> Editar
                </button>
                <button
                  onClick={() => handleExcluir(prof.id)}
                  className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-4 h-4" /> Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
