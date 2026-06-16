import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { profissionalService } from '../../services/api'

export function AtendimentoForm({ defaultValues, onSubmit, loading }) {
  const [profissionais, setProfissionais] = useState([])

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      ...defaultValues,
      profissionalId: defaultValues?.profissional?.id || defaultValues?.profissionalId || '',
    }
  })

  useEffect(() => {
    profissionalService.listar().then(setProfissionais).catch(() => {})
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Profissional</label>
        <select className="input"
          {...register('profissionalId', { required: 'Selecione um profissional' })}>
          <option value="">Selecione...</option>
          {profissionais.map(p => (
            <option key={p.id} value={p.id}>{p.nome} — {p.categoria}</option>
          ))}
        </select>
        {errors.profissionalId && <p className="text-red-500 text-xs mt-1">{errors.profissionalId.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Data</label>
          <input type="date" className="input"
            {...register('data', { required: 'Data é obrigatória' })} />
          {errors.data && <p className="text-red-500 text-xs mt-1">{errors.data.message}</p>}
        </div>
        <div>
          <label className="label">Horário</label>
          <input type="time" className="input"
            {...register('horario', { required: 'Horário é obrigatório' })} />
          {errors.horario && <p className="text-red-500 text-xs mt-1">{errors.horario.message}</p>}
        </div>
      </div>

      <div>
        <label className="label">Problema / Observações</label>
        <textarea rows={3} className="input resize-none"
          placeholder="Descreva o problema relatado pelo paciente..."
          {...register('problemaTexto')} />
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
