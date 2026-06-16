// src/features/atendimentos/pages/Formulario.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { atendimentosService } from "../services";
import { profissionaisService } from "../../profissionais/services";

export default function AtendimentoForm() {
  const navigate = useNavigate();
  const [profissionais, setProfissionais] = useState([]);
  const [formData, setFormData] = useState({
    data: "",
    horario: "",
    problemaTexto: "",
    profissionalId: "",
  });

  useEffect(() => {
    const carregarProfissionais = () => {
      profissionaisService
        .listarTodos()
        .then(setProfissionais)
        .catch((err) => console.error("Erro ao carregar profissionais", err));
    };

    carregarProfissionais();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await atendimentosService.inserir(formData);
      alert("Atendimento registrado!");
      navigate("/atendimentos");
    } catch (err) {
      alert("Erro ao salvar atendimento: " + err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl"
    >
      <h2 className="text-xl font-bold mb-6">Novo Atendimento</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profissional
          </label>
          <select
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.profissionalId}
            onChange={(e) =>
              setFormData({ ...formData, profissionalId: e.target.value })
            }
          >
            <option value="">Selecione...</option>
            {profissionais.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.categoria})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <input
              type="date"
              required
              className="w-full p-2 border rounded-lg"
              value={formData.data}
              onChange={(e) =>
                setFormData({ ...formData, data: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horário
            </label>
            <input
              type="time"
              required
              className="w-full p-2 border rounded-lg"
              value={formData.horario}
              onChange={(e) =>
                setFormData({ ...formData, horario: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Problema/Queixa
          </label>
          <textarea
            required
            rows="4"
            className="w-full p-2 border rounded-lg"
            value={formData.problemaTexto}
            onChange={(e) =>
              setFormData({ ...formData, problemaTexto: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
        >
          Salvar Atendimento
        </button>
      </div>
    </form>
  );
}
