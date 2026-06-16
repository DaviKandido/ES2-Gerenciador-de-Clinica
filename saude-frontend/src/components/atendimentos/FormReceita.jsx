import { useForm, useWatch } from 'react-hook-form'
import { atendimentoService } from '../../services/api'
import toast from 'react-hot-toast'

const TIPO_POR_CATEGORIA = {
  MEDICO: 'REMEDIO',
  FISIOTERAPEUTA: 'ATIVIDADE_FISICA',
  PSICOLOGO: 'ATIVIDADE_MENTAL',
}

export default function FormReceita({ atendimentoId, categoriaProfissional, onSuccess, onCancel }) {
  const tipoFixo = TIPO_POR_CATEGORIA[categoriaProfissional]
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { tipoReceita: tipoFixo }
  })

  const onSubmit = async (data) => {
    try {
      await atendimentoService.adicionarReceita(atendimentoId, { ...data, tipoReceita: tipoFixo })
      toast.success('Receita adicionada!')
      onSuccess()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {tipoFixo === 'REMEDIO' && (
        <>
          <div>
            <label className="label">Nome do remédio</label>
            <input className="input" placeholder="Ex: Dipirona"
              {...register('nomeRemedio', { required: 'Obrigatório' })} />
            {errors.nomeRemedio && <p className="text-xs text-red-500 mt-1">{errors.nomeRemedio.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Dosagem</label>
              <input className="input" placeholder="500mg"
                {...register('dosagem', { required: 'Obrigatório' })} />
            </div>
            <div>
              <label className="label">Posologia</label>
              <input className="input" placeholder="1x ao dia" {...register('posologia')} />
            </div>
          </div>
        </>
      )}

      {tipoFixo === 'ATIVIDADE_FISICA' && (
        <>
          <div>
            <label className="label">Atividade</label>
            <input className="input" placeholder="Ex: Caminhada"
              {...register('descricaoAtividade', { required: 'Obrigatório' })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Séries</label>
              <input type="number" className="input" {...register('series')} />
            </div>
            <div>
              <label className="label">Repetições</label>
              <input type="number" className="input" {...register('repeticoes')} />
            </div>
            <div>
              <label className="label">Frequência</label>
              <input className="input" placeholder="3x por semana" {...register('frequenciaSemanal')} />
            </div>
          </div>
        </>
      )}

      {tipoFixo === 'ATIVIDADE_MENTAL' && (
        <>
          <div>
            <label className="label">Atividade</label>
            <input className="input" placeholder="Ex: Meditação guiada"
              {...register('descricaoAtividade', { required: 'Obrigatório' })} />
          </div>
          <div>
            <label className="label">Objetivo</label>
            <input className="input" placeholder="Ex: Reduzir ansiedade" {...register('objetivo')} />
          </div>
          <div>
            <label className="label">Frequência</label>
            <input className="input" placeholder="3x por semana" {...register('frequenciaSemanal')} />
          </div>
        </>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Salvando...' : 'Adicionar receita'}
        </button>
      </div>
    </form>
  )
}
