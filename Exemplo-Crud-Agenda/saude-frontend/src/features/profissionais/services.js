import api from "../../services/api";

export const profissionaisService = {
  listarTodos: () => api.get("/profissionais").then((res) => res.data),
  buscarPorId: (id) => api.get(`/profissionais/${id}`).then((res) => res.data),
  inserir: (dados) => api.post("/profissionais", dados).then((res) => res.data),
  alterar: (id, dados) =>
    api.put(`/profissionais/${id}`, dados).then((res) => res.data),
  excluir: (id) => api.delete(`/profissionais/${id}`),
};
