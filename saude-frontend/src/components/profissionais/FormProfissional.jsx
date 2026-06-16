import { useForm } from 'react-hook-form'
import { profissionalService } from '../../services/api'
import toast from 'react-hot-toast'

const categorias = [
  { value: 'MEDICO', label: 'Médico' },
  { value: 'FISIOTERAPEUTA', label: 'Fisioterapeuta' },
  { value: 'PSICOLOGO', label: 'Psicólogo' },
]

export default function FormProfissional({ inicial, onSuccess, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: inicial || {}
  })

  const onSubmit = async (data) => {
    try {
      if (inicial?.id) {
        await profissionalService.alterar(inicial.id, data)
        toast.success('Profissional atualizado!')
      } else {
        await profissionalService.inserir(data)
        toast.success('Profissional cadastrado!')
      }
      onSuccess()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Nome completo</label>
        <input className="input" placeholder="Dr. João Silva"
          {...register('nome', { required: 'Nome é obrigatório' })} />
        {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome.message}</p>}
      </div>

      <div>
        <label className="label">Telefone</label>
        <input className="input" placeholder="(31) 99999-9999"
          {...register('telefone', { required: 'Telefone é obrigatório' })} />
        {errors.telefone && <p className="text-xs text-red-500 mt-1">{errors.telefone.message}</p>}
      </div>

      <div>
        <label className="label">Endereço</label>
        <input className="input" placeholder="Rua A, 100, Belo Horizonte"
          {...register('endereco', { required: 'Endereço é obrigatório' })} />
        {errors.endereco && <p className="text-xs text-red-500 mt-1">{errors.endereco.message}</p>}
      </div>

      <div>
        <label className="label">Categoria</label>
        <select className="input" {...register('categoria', { required: 'Categoria é obrigatória' })}>
          <option value="">Selecione...</option>
          {categorias.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        {errors.categoria && <p className="text-xs text-red-500 mt-1">{errors.categoria.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Salvando...' : inicial?.id ? 'Salvar alterações' : 'Cadastrar'}
        </button>
      </div>
    </form>
  )
}
