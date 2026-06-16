import { useEffect, useState } from 'react'
import { Calendar, Plus, Pencil, Trash2, Eye } from 'lucide-react'
import { atendimentoService } from '../services/api'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import FormAtendimento from '../components/atendimentos/FormAtendimento'
import CategoriaBadge from '../components/ui/Badge'
import EmptyState from '../components/ui/EmptyState'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export default function AtendimentosPage() {
  const [lista, setLista] = useState([])
  const [modal, setModal] = useState(null)
  const [selecionado, setSelecionado] = useState(null)
  const [loadingExcluir, setLoadingExcluir] = useState(false)
  const navigate = useNavigate()

  const carregar = () => atendimentoService.listar().then(setLista).catch(() => toast.error('Erro ao carregar'))

  useEffect(() => { carregar() }, [])

  const fechar = () => { setModal(null); setSelecionado(null) }

  const excluir = async () => {
    setLoadingExcluir(true)
    try {
      await atendimentoService.excluir(selecionado.id)
      toast.success('Atendimento excluído')
      fechar(); carregar()
    } catch (err) {
      toast.error(err.message)
    } finally { setLoadingExcluir(false) }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Atendimentos</h1>
          <p className="text-sm text-muted mt-0.5">{lista.length} registrados</p>
        </div>
        <button onClick={() => setModal('novo')} className="btn-primary">
          <Plus size={16} /> Novo atendimento
        </button>
      </div>

      <div className="card overflow-hidden">
        {lista.length === 0 ? (
          <EmptyState icon={Calendar} title="Nenhum atendimento registrado"
            action={<button onClick={() => setModal('novo')} className="btn-primary">Registrar atendimento</button>} />
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Data', 'Horário', 'Profissional', 'Categoria', 'Problema', 'Receitas', 'Exames', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {lista.map(a => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">{a.data}</td>
                  <td className="px-4 py-3 text-sm text-muted">{a.horario}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{a.profissional?.nome}</td>
                  <td className="px-4 py-3"><CategoriaBadge categoria={a.profissional?.categoria} /></td>
                  <td className="px-4 py-3 text-sm text-muted max-w-xs truncate">{a.problemaTexto || '—'}</td>
                  <td className="px-4 py-3 text-sm text-center">{a.receitas?.length || 0}</td>
                  <td className="px-4 py-3 text-sm text-center">{a.examesLab?.length || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => navigate(`/atendimentos/${a.id}`)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-muted hover:text-brand-600 transition-colors" title="Ver detalhes">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => { setSelecionado(a); setModal('editar') }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-muted hover:text-brand-600 transition-colors">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => { setSelecionado(a); setModal('excluir') }}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-muted hover:text-red-500 transition-colors">
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
        <Modal title={modal === 'novo' ? 'Novo atendimento' : 'Editar atendimento'} onClose={fechar}>
          <FormAtendimento inicial={selecionado} onSuccess={() => { fechar(); carregar() }} onCancel={fechar} />
        </Modal>
      )}

      {modal === 'excluir' && (
        <ConfirmDialog title="Excluir atendimento"
          message="Tem certeza? Todas as receitas e exames deste atendimento serão removidos."
          onConfirm={excluir} onCancel={fechar} loading={loadingExcluir} />
      )}
    </div>
  )
}
