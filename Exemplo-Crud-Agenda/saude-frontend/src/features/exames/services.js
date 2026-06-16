import api from "../../services/api";

export const examesService = {
  listarPorAtendimento: (atendimentoId) =>
    api.get(`/exames/atendimento/${atendimentoId}`).then((res) => res.data),
  inserir: (dados) => api.post("/exames", dados).then((res) => res.data),
  alterar: (id, dados) =>
    api.put(`/exames/${id}`, dados).then((res) => res.data),
  excluir: (id) => api.delete(`/exames/${id}`),
};
