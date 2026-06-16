import { useForm } from 'react-hook-form'

const CATEGORIAS = [
  { value: 'MEDICO',         label: 'Médico' },
  { value: 'FISIOTERAPEUTA', label: 'Fisioterapeuta' },
  { value: 'PSICOLOGO',      label: 'Psicólogo' },
]

export function ProfissionalForm({ defaultValues, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Nome completo</label>
        <input className="input" placeholder="Dr. João Silva"
          {...register('nome', { required: 'Nome é obrigatório' })} />
        {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome.message}</p>}
      </div>

      <div>
        <label className="label">Telefone</label>
        <input className="input" placeholder="31999999999"
          {...register('telefone', { required: 'Telefone é obrigatório' })} />
        {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone.message}</p>}
      </div>

      <div>
        <label className="label">Endereço</label>
        <input className="input" placeholder="Rua A, 100, Belo Horizonte"
          {...register('endereco', { required: 'Endereço é obrigatório' })} />
        {errors.endereco && <p className="text-red-500 text-xs mt-1">{errors.endereco.message}</p>}
      </div>

      <div>
        <label className="label">Categoria</label>
        <select className="input"
          {...register('categoria', { required: 'Categoria é obrigatória' })}>
          <option value="">Selecione...</option>
          {CATEGORIAS.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        {errors.categoria && <p className="text-red-500 text-xs mt-1">{errors.categoria.message}</p>}
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
