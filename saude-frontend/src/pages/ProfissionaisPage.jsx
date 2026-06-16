import { useEffect, useState } from 'react'
import { Users, Plus, Search, Pencil, Trash2 } from 'lucide-react'
import { profissionalService } from '../services/api'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import FormProfissional from '../components/profissionais/FormProfissional'
import CategoriaBadge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import toast from 'react-hot-toast'

export default function ProfissionaisPage() {
  const [lista, setLista] = useState([])
  const [busca, setBusca] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [modal, setModal] = useState(null) // 'novo' | 'editar' | 'excluir'
  const [selecionado, setSelecionado] = useState(null)
  const [loadingExcluir, setLoadingExcluir] = useState(false)

  const carregar = () => profissionalService.listar().then(setLista).catch(() => toast.error('Erro ao carregar'))

  useEffect(() => { carregar() }, [])

  const filtrados = lista.filter(p => {
    const okBusca = p.nome.toLowerCase().includes(busca.toLowerCase())
    const okCat = !categoriaFiltro || p.categoria === categoriaFiltro
    return okBusca && okCat
  })

  const abrirEditar = (p) => { setSelecionado(p); setModal('editar') }
  const abrirExcluir = (p) => { setSelecionado(p); setModal('excluir') }
  const fechar = () => { setModal(null); setSelecionado(null) }

  const excluir = async () => {
    setLoadingExcluir(true)
    try {
      await profissionalService.excluir(selecionado.id)
      toast.success('Profissional excluído')
      fechar(); carregar()
    } catch (err) {
      toast.error(err.message)
    } finally { setLoadingExcluir(false) }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Profissionais</h1>
          <p className="text-sm text-muted mt-0.5">{lista.length} cadastrados</p>
        </div>
        <button onClick={() => setModal('novo')} className="btn-primary">
          <Plus size={16} /> Novo profissional
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input pl-9" placeholder="Buscar por nome..."
            value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
        <select className="input w-48" value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)}>
          <option value="">Todas as categorias</option>
          <option value="MEDICO">Médico</option>
          <option value="FISIOTERAPEUTA">Fisioterapeuta</option>
          <option value="PSICOLOGO">Psicólogo</option>
        </select>
      </div>

      {/* Tabela */}
      <div className="card overflow-hidden">
        {filtrados.length === 0 ? (
          <EmptyState icon={Users} title="Nenhum profissional encontrado"
            description="Cadastre o primeiro profissional para começar"
            action={<button onClick={() => setModal('novo')} className="btn-primary">Cadastrar profissional</button>} />
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Nome', 'Telefone', 'Endereço', 'Categoria', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtrados.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{p.nome}</td>
                  <td className="px-4 py-3 text-sm text-muted">{p.telefone}</td>
                  <td className="px-4 py-3 text-sm text-muted max-w-xs truncate">{p.endereco}</td>
                  <td className="px-4 py-3"><CategoriaBadge categoria={p.categoria} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => abrirEditar(p)} className="p-1.5 rounded-lg hover:bg-slate-100 text-muted hover:text-brand-600 transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => abrirExcluir(p)} className="p-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {(modal === 'novo' || modal === 'editar') && (
        <Modal title={modal === 'novo' ? 'Novo profissional' : 'Editar profissional'} onClose={fechar}>
          <FormProfissional inicial={selecionado} onSuccess={() => { fechar(); carregar() }} onCancel={fechar} />
        </Modal>
      )}

      {modal === 'excluir' && (
        <ConfirmDialog
          title="Excluir profissional"
          message={`Tem certeza que deseja excluir ${selecionado?.nome}? Esta ação não pode ser desfeita.`}
          onConfirm={excluir} onCancel={fechar} loading={loadingExcluir} />
      )}
    </div>
  )
}
