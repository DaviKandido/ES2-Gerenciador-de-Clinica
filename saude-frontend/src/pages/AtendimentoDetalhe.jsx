import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { atendimentoService, exameService } from '../services/api'
import { ArrowLeft, Plus, Trash2, Pill, Dumbbell, Brain, FlaskConical } from 'lucide-react'
import Modal from '../components/ui/Modal'
import FormReceita from '../components/atendimentos/FormReceita'
import FormExame from '../components/atendimentos/FormExame'
import CategoriaBadge from '../components/ui/Badge'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import toast from 'react-hot-toast'

const ICONE_RECEITA = { REMEDIO: Pill, ATIVIDADE_FISICA: Dumbbell, ATIVIDADE_MENTAL: Brain }
const LABEL_RECEITA = { REMEDIO: 'Remédio', ATIVIDADE_FISICA: 'Atividade Física', ATIVIDADE_MENTAL: 'Atividade Mental' }
const COR_RECEITA = {
  REMEDIO: 'bg-blue-50 border-blue-100',
  ATIVIDADE_FISICA: 'bg-green-50 border-green-100',
  ATIVIDADE_MENTAL: 'bg-purple-50 border-purple-100',
}

function ReceitaCard({ receita }) {
  const Icon = ICONE_RECEITA[receita.tipoReceita] || Pill
  return (
    <div className={`p-4 rounded-xl border ${COR_RECEITA[receita.tipoReceita]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={15} className="text-slate-500" />
        <span className="text-xs font-semibold text-slate-500 uppercase">{LABEL_RECEITA[receita.tipoReceita]}</span>
      </div>
      {receita.tipoReceita === 'REMEDIO' && (
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-800">{receita.nomeRemedio}</p>
          <p className="text-xs text-muted">{receita.dosagem} — {receita.posologia}</p>
        </div>
      )}
      {(receita.tipoReceita === 'ATIVIDADE_FISICA' || receita.tipoReceita === 'ATIVIDADE_MENTAL') && (
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-800">{receita.descricaoAtividade}</p>
          {receita.frequenciaSemanal && <p className="text-xs text-muted">{receita.frequenciaSemanal}</p>}
          {receita.objetivo && <p className="text-xs text-muted">Objetivo: {receita.objetivo}</p>}
          {receita.series && <p className="text-xs text-muted">{receita.series} séries × {receita.repeticoes} reps</p>}
        </div>
      )}
    </div>
  )
}

export default function AtendimentoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [atendimento, setAtendimento] = useState(null)
  const [modal, setModal] = useState(null)
  const [exameSelecionado, setExameSelecionado] = useState(null)
  const [loadingExcluirExame, setLoadingExcluirExame] = useState(false)

  const carregar = () =>
    atendimentoService.buscarPorId(id).then(setAtendimento).catch(() => toast.error('Atendimento não encontrado'))

  useEffect(() => { carregar() }, [id])

  const excluirExame = async () => {
    setLoadingExcluirExame(true)
    try {
      await exameService.excluir(exameSelecionado.id)
      toast.success('Exame removido')
      setModal(null); setExameSelecionado(null)
      carregar()
    } catch (err) {
      toast.error(err.message)
    } finally { setLoadingExcluirExame(false) }
  }

  if (!atendimento) return (
    <div className="p-8 flex items-center justify-center h-64">
      <p className="text-muted">Carregando...</p>
    </div>
  )

  const prof = atendimento.profissional

  return (
    <div className="p-8 max-w-4xl">
      <button onClick={() => navigate('/atendimentos')}
        className="flex items-center gap-2 text-sm text-muted hover:text-brand-600 mb-6 transition-colors">
        <ArrowLeft size={16} /> Voltar
      </button>

      {/* Cabeçalho */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800 mb-1">Atendimento #{atendimento.id}</h1>
            <p className="text-sm text-muted">{atendimento.data} às {atendimento.horario}</p>
          </div>
          <CategoriaBadge categoria={prof?.categoria} />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-muted font-medium uppercase mb-1">Profissional</p>
            <p className="text-sm font-semibold text-slate-700">{prof?.nome}</p>
            <p className="text-xs text-muted">{prof?.telefone}</p>
          </div>
          <div>
            <p className="text-xs text-muted font-medium uppercase mb-1">Problema relatado</p>
            <p className="text-sm text-slate-700">{atendimento.problemaTexto || 'Não informado'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Receitas */}
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-700">Receitas</h2>
            <button onClick={() => setModal('receita')} className="btn-primary text-xs py-1.5 px-3">
              <Plus size={14} /> Adicionar
            </button>
          </div>
          <div className="p-4 space-y-3">
            {atendimento.receitas?.length === 0 && (
              <p className="text-sm text-center text-muted py-6">Nenhuma receita adicionada</p>
            )}
            {atendimento.receitas?.map(r => <ReceitaCard key={r.id} receita={r} />)}
          </div>
        </div>

        {/* Exames */}
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-700">Exames Laboratoriais</h2>
            <button onClick={() => setModal('exame')} className="btn-primary text-xs py-1.5 px-3">
              <Plus size={14} /> Adicionar
            </button>
          </div>
          <div className="p-4 space-y-3">
            {atendimento.examesLab?.length === 0 && (
              <p className="text-sm text-center text-muted py-6">Nenhum exame registrado</p>
            )}
            {atendimento.examesLab?.map(e => (
              <div key={e.id} className="p-4 rounded-xl border border-amber-100 bg-amber-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-1">
                    <FlaskConical size={14} className="text-amber-600" />
                    <p className="text-sm font-semibold text-slate-800">{e.descricao}</p>
                  </div>
                  <button onClick={() => { setExameSelecionado(e); setModal('excluirExame') }}
                    className="p-1 rounded hover:bg-red-50 text-muted hover:text-red-500 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
                {e.resultado && <p className="text-xs text-muted mt-1">{e.resultado}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {modal === 'receita' && (
        <Modal title="Adicionar receita" onClose={() => setModal(null)}>
          <FormReceita atendimentoId={id} categoriaProfissional={prof?.categoria}
            onSuccess={() => { setModal(null); carregar() }} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {modal === 'exame' && (
        <Modal title="Registrar exame" onClose={() => setModal(null)}>
          <FormExame atendimentoId={id}
            onSuccess={() => { setModal(null); carregar() }} onCancel={() => setModal(null)} />
        </Modal>
      )}

      {modal === 'excluirExame' && (
        <ConfirmDialog title="Remover exame"
          message={`Remover o exame "${exameSelecionado?.descricao}"?`}
          onConfirm={excluirExame} onCancel={() => { setModal(null); setExameSelecionado(null) }}
          loading={loadingExcluirExame} />
      )}
    </div>
  )
}
