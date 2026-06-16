// src/features/atendimentos/pages/Listagem.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Pill, Activity, CalendarClock } from "lucide-react";
import { atendimentosService } from "../services";
import ModalExames from "../../exames/components/ModalExames";

export default function AtendimentosList() {
  const [atendimentos, setAtendimentos] = useState([]);
  const [atendimentoSelecionadoParaExame, setAtendimentoSelecionadoParaExame] =
    useState(null);
  const navigate = useNavigate();

  const carregarDados = () => {
    atendimentosService
      .listarTodos()
      .then(setAtendimentos)
      .catch((err) => console.error("Erro ao carregar atendimentos", err));
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este atendimento?")) {
      await atendimentosService.excluir(id);
      carregarDados(); // Recarrega a lista
    }
  };

  // Função simples para formatar a data de YYYY-MM-DD para DD/MM/YYYY
  const formatarData = (dataIso) => {
    if (!dataIso) return "";
    const [ano, mes, dia] = dataIso.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Atendimentos</h2>
          <p className="text-gray-500 text-sm mt-1">
            Histórico de consultas e sessões.
          </p>
        </div>
        <button
          onClick={() => navigate("/atendimentos/novo")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" /> Novo Atendimento
        </button>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {atendimentos.length === 0 ? (
          <p className="text-gray-500">Nenhum atendimento registrado ainda.</p>
        ) : (
          atendimentos.map((atendimento) => (
            <div
              key={atendimento.id}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between"
            >
              {/* Info principal */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 text-blue-700 font-semibold mb-1">
                    <CalendarClock className="w-5 h-5" />
                    {formatarData(atendimento.data)} às {atendimento.horario}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {atendimento.profissional.nome}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {atendimento.profissional.categoria}
                  </span>
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-medium">
                  ID: {atendimento.id}
                </span>
              </div>

              {/* Queixa do paciente */}
              <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm text-gray-700 border border-gray-100">
                <strong>Queixa/Problema:</strong> <br />
                {atendimento.problemaTexto}
              </div>

              {/* Contadores de Receitas/Exames (Visual) */}
              <div className="flex gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-1">
                  <Pill className="w-4 h-4 text-emerald-500" />
                  {atendimento.receitas?.length || 0} Receita(s)
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-4 h-4 text-purple-500" />
                  {atendimento.exames?.length || 0} Exame(s)
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-4 border-t pt-4">
                {/* Botão que abre o modal de exames */}
                <button
                  onClick={() =>
                    setAtendimentoSelecionadoParaExame(atendimento.id)
                  }
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                >
                  <Activity className="w-4 h-4" /> Gerir Exames
                </button>

                <button
                  onClick={() => handleExcluir(atendimento.id)}
                  className="text-sm text-red-500 hover:text-red-700 font-medium ml-auto flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Exames */}
      {atendimentoSelecionadoParaExame && (
        <ModalExames
          atendimentoId={atendimentoSelecionadoParaExame}
          onClose={() => {
            setAtendimentoSelecionadoParaExame(null);
            carregarDados(); // Recarrega os dados para atualizar o contador de exames no card
          }}
        />
      )}
    </div>
  );
}
