import api from "../../services/api";

export const atendimentosService = {
  listarTodos: () => api.get("/atendimentos").then((res) => res.data),
  inserir: (dados) => api.post("/atendimentos", dados).then((res) => res.data),
  excluir: (id) => api.delete(`/atendimentos/${id}`),
  adicionarReceita: (atendimentoId, dados) =>
    api
      .post(`/atendimentos/${atendimentoId}/receitas`, dados)
      .then((res) => res.data),
};
