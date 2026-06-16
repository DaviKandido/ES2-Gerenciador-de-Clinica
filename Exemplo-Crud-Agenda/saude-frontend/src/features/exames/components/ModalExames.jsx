import { useState, useEffect } from "react";
import { X, TestTube, Trash2, Plus } from "lucide-react";
import { examesService } from "../services";

export default function ModalExames({ atendimentoId, onClose }) {
  const [exames, setExames] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estado do formulário
  const [descricao, setDescricao] = useState("");
  const [resultado, setResultado] = useState("");

  const carregarExames = () => {
    examesService
      .listarPorAtendimento(atendimentoId)
      .then(setExames)
      .catch((err) => console.error("Erro ao carregar exames", err));
  };

  useEffect(() => {
    carregarExames();
  }, [atendimentoId]);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // O backend espera o atendimentoId junto com os dados do exame
      await examesService.inserir({ descricao, resultado, atendimentoId });
      setDescricao("");
      setResultado("");
      carregarExames(); // Recarrega a listinha dentro do modal
    } catch (error) {
      alert("Erro ao salvar o exame: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (id) => {
    if (window.confirm("Excluir este exame?")) {
      await examesService.excluir(id);
      carregarExames();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header do Modal */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 text-purple-700">
            <TestTube className="w-6 h-6" />
            <h2 className="text-xl font-bold text-gray-800">
              Exames Laboratoriais
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Corpo (Lista + Formulário) */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Formulário de Novo Exame */}
          <form
            onSubmit={handleSalvar}
            className="bg-purple-50 p-4 rounded-lg border border-purple-100 space-y-3"
          >
            <h3 className="text-sm font-semibold text-purple-800 mb-2">
              Registrar Novo Exame
            </h3>
            <div>
              <input
                type="text"
                placeholder="Descrição (ex: Hemograma Completo)"
                required
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <textarea
                placeholder="Resultado / Observações"
                required
                value={resultado}
                onChange={(e) => setResultado(e.target.value)}
                className="w-full p-2 border rounded-md text-sm"
                rows="2"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md text-sm font-medium transition-colors flex justify-center items-center gap-2"
            >
              <Plus className="w-4 h-4" />{" "}
              {loading ? "Salvando..." : "Adicionar Exame"}
            </button>
          </form>

          {/* Listagem dos Exames atuais */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">
              Exames Registrados
            </h3>
            {exames.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                Nenhum exame para este atendimento.
              </p>
            ) : (
              <ul className="space-y-3">
                {exames.map((exame) => (
                  <li
                    key={exame.id}
                    className="p-3 border border-gray-100 rounded-lg bg-gray-50 flex justify-between items-start gap-4"
                  >
                    <div>
                      <strong className="block text-sm text-gray-800">
                        {exame.descricao}
                      </strong>
                      <p className="text-sm text-gray-600 mt-1">
                        {exame.resultado}
                      </p>
                    </div>
                    <button
                      onClick={() => handleExcluir(exame.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
