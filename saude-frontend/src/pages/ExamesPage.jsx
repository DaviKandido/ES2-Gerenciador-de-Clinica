import { useState, useEffect, useCallback } from 'react'
import { FlaskConical, Plus, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { exameService, atendimentoService } from '../../services/api'
import {
  Layout, PageHeader, LoadingSpinner, EmptyState, Modal, ConfirmDialog
} from '../../components/shared'
import { useForm } from 'react-hook-form'

function ExameForm({ defaultValues, atendimentos, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Atendimento</label>
        <select className="input"
          {...register('atendimentoId', { required: 'Selecione o atendimento' })}>
          <option value="">Selecione...</option>
          {atendimentos.map(a => (
            <option key={a.id} value={a.id}>
              #{a.id} — {a.profissional.nome} ({new Date(a.data + 'T00:00').toLocaleDateString('pt-BR')})
            </option>
          ))}
        </select>
        {errors.atendimentoId && <p className="text-red-500 text-xs mt-1">{errors.atendimentoId.message}</p>}
      </div>
      <div>
        <label className="label">Descrição</label>
        <input className="input" placeholder="Ex: Hemograma completo"
          {...register('descricao', { required: 'Descrição é obrigatória' })} />
        {errors.descricao && <p className="text-red-500 text-xs mt-1">{errors.descricao.message}</p>}
      </div>
      <div>
        <label className="label">Resultado</label>
        <textarea rows={3} className="input resize-none" placeholder="Resultado do exame..."
          {...register('resultado')} />
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}

export default function ExamesPage() {
  const [exames, setExames] = useState([])
  const [atendimentos, setAtendimentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, data: null })
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
  const [saving, setSaving] = useState(false)

  const carregar = useCallback(async () => {
    setLoading(true)
    try {
      const [ats] = await Promise.all([atendimentoService.listar()])
      setAtendimentos(ats)
      const allExames = ats.flatMap(a =>
        (a.examesLab || []).map(e => ({ ...e, atendimento: a }))
      )
      setExames(allExames)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const handleSalvar = async (formData) => {
    setSaving(true)
    try {
      const payload = { ...formData, atendimentoId: Number(formData.atendimentoId) }
      if (modal.data) {
        await exameService.alterar(modal.data.id, payload)
        toast.success('Exame atualizado!')
      } else {
        await exameService.inserir(payload)
        toast.success('Exame registrado!')
      }
      setModal({ open: false, data: null })
      carregar()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const handleExcluir = async () => {
    try {
      await exameService.excluir(deleteDialog.id)
      toast.success('Exame removido.')
      setDeleteDialog({ open: false, id: null })
      carregar()
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <Layout>
      <PageHeader
        title="Exames Laboratoriais"
        subtitle={`${exames.length} exame${exames.length !== 1 ? 's' : ''}`}
        action={
          <button className="btn-primary" onClick={() => setModal({ open: true, data: null })}>
            <Plus size={16} /> Novo Exame
          </button>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : exames.length === 0 ? (
        <div className="card">
          <EmptyState icon={FlaskConical} title="Nenhum exame registrado"
            description="Adicione exames através dos atendimentos ou aqui."
            action={<button className="btn-primary" onClick={() => setModal({ open: true, data: null })}>
              <Plus size={16} /> Registrar
            </button>}
          />
        </div>
      ) : (
        <div className="grid gap-3">
          {exames.map(e => (
            <div key={e.id} className="card px-5 py-4 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="bg-amber-50 rounded-lg p-2.5 flex-shrink-0 mt-0.5">
                  <FlaskConical size={18} className="text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">{e.descricao}</p>
                  {e.resultado && <p className="text-slate-500 text-sm mt-1">{e.resultado}</p>}
                  <p className="text-slate-400 text-xs mt-1">
                    Atendimento #{e.atendimentoId} — {e.atendimento?.profissional?.nome}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="btn-secondary px-3"
                  onClick={() => setModal({ open: true, data: { ...e, atendimentoId: e.atendimentoId } })}>
                  <Pencil size={14} />
                </button>
                <button className="btn-danger px-3"
                  onClick={() => setDeleteDialog({ open: true, id: e.id })}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal.open} onClose={() => setModal({ open: false, data: null })}
        title={modal.data ? 'Editar Exame' : 'Novo Exame'}>
        <ExameForm
          defaultValues={modal.data || {}}
          atendimentos={atendimentos}
          onSubmit={handleSalvar}
          loading={saving}
        />
      </Modal>

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleExcluir}
        title="Remover exame?"
        description="Esta ação não pode ser desfeita."
      />
    </Layout>
  )
}
