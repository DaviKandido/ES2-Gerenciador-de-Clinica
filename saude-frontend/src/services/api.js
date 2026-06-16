import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message
      || Object.values(err.response?.data || {}).join(', ')
      || 'Erro ao conectar com o servidor'
    return Promise.reject(new Error(msg))
  }
)

export const profissionalService = {
  listar: () => api.get('/profissionais').then(r => r.data),
  buscarPorId: (id) => api.get(`/profissionais/${id}`).then(r => r.data),
  buscarPorNome: (nome) => api.get(`/profissionais/buscar?nome=${nome}`).then(r => r.data),
  buscarPorCategoria: (cat) => api.get(`/profissionais/categoria/${cat}`).then(r => r.data),
  inserir: (data) => api.post('/profissionais', data).then(r => r.data),
  alterar: (id, data) => api.put(`/profissionais/${id}`, data).then(r => r.data),
  excluir: (id) => api.delete(`/profissionais/${id}`),
}

export const atendimentoService = {
  listar: () => api.get('/atendimentos').then(r => r.data),
  buscarPorId: (id) => api.get(`/atendimentos/${id}`).then(r => r.data),
  listarPorProfissional: (id) => api.get(`/atendimentos/profissional/${id}`).then(r => r.data),
  inserir: (data) => api.post('/atendimentos', data).then(r => r.data),
  alterar: (id, data) => api.put(`/atendimentos/${id}`, data).then(r => r.data),
  excluir: (id) => api.delete(`/atendimentos/${id}`),
  adicionarReceita: (id, data) => api.post(`/atendimentos/${id}/receitas`, data).then(r => r.data),
  listarReceitas: (id) => api.get(`/atendimentos/${id}/receitas`).then(r => r.data),
}

export const exameService = {
  listarPorAtendimento: (id) => api.get(`/exames/atendimento/${id}`).then(r => r.data),
  inserir: (data) => api.post('/exames', data).then(r => r.data),
  alterar: (id, data) => api.put(`/exames/${id}`, data).then(r => r.data),
  excluir: (id) => api.delete(`/exames/${id}`),
}

export default api
