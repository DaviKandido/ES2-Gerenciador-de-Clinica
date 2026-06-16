import { useForm } from 'react-hook-form'
import { exameService } from '../../services/api'
import toast from 'react-hot-toast'

export default function FormExame({ atendimentoId, onSuccess, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await exameService.inserir({ ...data, atendimentoId })
      toast.success('Exame registrado!')
      onSuccess()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Descrição do exame</label>
        <input className="input" placeholder="Ex: Hemograma completo"
          {...register('descricao', { required: 'Descrição é obrigatória' })} />
        {errors.descricao && <p className="text-xs text-red-500 mt-1">{errors.descricao.message}</p>}
      </div>
      <div>
        <label className="label">Resultado (opcional)</label>
        <textarea rows={3} className="input resize-none" placeholder="Insira o resultado do exame..."
          {...register('resultado')} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Salvando...' : 'Registrar exame'}
        </button>
      </div>
    </form>
  )
}
