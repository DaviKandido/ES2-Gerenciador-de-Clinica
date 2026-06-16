import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { atendimentoService, profissionalService } from '../../services/api'
import toast from 'react-hot-toast'

export default function FormAtendimento({ inicial, onSuccess, onCancel }) {
  const [profissionais, setProfissionais] = useState([])
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: inicial ? {
      ...inicial,
      profissionalId: inicial.profissional?.id,
    } : {}
  })

  useEffect(() => {
    profissionalService.listar().then(setProfissionais).catch(() => {})
  }, [])

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, profissionalId: Number(data.profissionalId) }
      if (inicial?.id) {
        await atendimentoService.alterar(inicial.id, payload)
        toast.success('Atendimento atualizado!')
      } else {
        await atendimentoService.inserir(payload)
        toast.success('Atendimento registrado!')
      }
      onSuccess()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Data</label>
          <input type="date" className="input"
            {...register('data', { required: 'Data é obrigatória' })} />
          {errors.data && <p className="text-xs text-red-500 mt-1">{errors.data.message}</p>}
        </div>
        <div>
          <label className="label">Horário</label>
          <input type="time" className="input"
            {...register('horario', { required: 'Horário é obrigatório' })} />
          {errors.horario && <p className="text-xs text-red-500 mt-1">{errors.horario.message}</p>}
        </div>
      </div>

      <div>
        <label className="label">Profissional</label>
        <select className="input" {...register('profissionalId', { required: 'Profissional é obrigatório' })}>
          <option value="">Selecione o profissional...</option>
          {profissionais.map(p => (
            <option key={p.id} value={p.id}>{p.nome} — {p.categoria}</option>
          ))}
        </select>
        {errors.profissionalId && <p className="text-xs text-red-500 mt-1">{errors.profissionalId.message}</p>}
      </div>

      <div>
        <label className="label">Descrição do problema</label>
        <textarea rows={3} className="input resize-none" placeholder="Descreva o motivo do atendimento..."
          {...register('problemaTexto')} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Salvando...' : inicial?.id ? 'Salvar alterações' : 'Registrar'}
        </button>
      </div>
    </form>
  )
}
