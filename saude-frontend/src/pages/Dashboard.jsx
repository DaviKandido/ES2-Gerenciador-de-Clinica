import { useEffect, useState } from 'react'
import { Users, Calendar, Stethoscope, FlaskConical } from 'lucide-react'
import { profissionalService, atendimentoService } from '../services/api'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNavigate } from 'react-router-dom'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value ?? '—'}</p>
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [profissionais, setProfissionais] = useState([])
  const [atendimentos, setAtendimentos] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    profissionalService.listar().then(setProfissionais).catch(() => {})
    atendimentoService.listar().then(setAtendimentos).catch(() => {})
  }, [])

  const hoje = atendimentos.filter(a => a.data === format(new Date(), 'yyyy-MM-dd'))
  const totalExames = atendimentos.reduce((acc, a) => acc + (a.examesLab?.length || 0), 0)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-muted text-sm mt-1">
          {format(new Date(), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Profissionais" value={profissionais.length} color="bg-brand-600" />
        <StatCard icon={Calendar} label="Atendimentos" value={atendimentos.length} color="bg-emerald-500" />
        <StatCard icon={Stethoscope} label="Hoje" value={hoje.length} color="bg-violet-500" />
        <StatCard icon={FlaskConical} label="Exames" value={totalExames} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Últimos atendimentos */}
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-semibold text-slate-700">Últimos atendimentos</h2>
            <button onClick={() => navigate('/atendimentos')} className="text-xs text-brand-600 hover:underline">
              Ver todos
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {atendimentos.slice(0, 5).map(a => (
              <div key={a.id} onClick={() => navigate(`/atendimentos/${a.id}`)}
                className="px-5 py-3 hover:bg-slate-50 cursor-pointer transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{a.profissional?.nome}</p>
                    <p className="text-xs text-muted mt-0.5 line-clamp-1">{a.problemaTexto || 'Sem descrição'}</p>
                  </div>
                  <span className="text-xs text-muted shrink-0 ml-3">{a.data} {a.horario}</span>
                </div>
              </div>
            ))}
            {atendimentos.length === 0 && (
              <p className="px-5 py-8 text-sm text-center text-muted">Nenhum atendimento registrado</p>
            )}
          </div>
        </div>

        {/* Profissionais por categoria */}
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700">Profissionais por categoria</h2>
          </div>
          <div className="p-5 space-y-4">
            {['MEDICO','FISIOTERAPEUTA','PSICOLOGO'].map(cat => {
              const count = profissionais.filter(p => p.categoria === cat).length
              const labels = { MEDICO: 'Médicos', FISIOTERAPEUTA: 'Fisioterapeutas', PSICOLOGO: 'Psicólogos' }
              const colors = { MEDICO: 'bg-blue-500', FISIOTERAPEUTA: 'bg-green-500', PSICOLOGO: 'bg-purple-500' }
              const pct = profissionais.length ? Math.round((count / profissionais.length) * 100) : 0
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{labels[cat]}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[cat]} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
