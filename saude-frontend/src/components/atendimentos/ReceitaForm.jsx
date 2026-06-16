import { useForm } from 'react-hook-form'

const TIPO_MAP = {
  MEDICO:         'REMEDIO',
  FISIOTERAPEUTA: 'ATIVIDADE_FISICA',
  PSICOLOGO:      'ATIVIDADE_MENTAL',
}

export function ReceitaForm({ categoria, onSubmit, loading }) {
  const tipo = TIPO_MAP[categoria]
  const { register, handleSubmit, formState: { errors } } = useForm()

  const submit = (data) => onSubmit({ ...data, tipoReceita: tipo })

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="bg-slate-50 px-4 py-2 rounded-lg text-sm text-slate-600 mb-2">
        Tipo de receita: <strong>{tipo?.replace('_', ' ')}</strong>
      </div>

      {tipo === 'REMEDIO' && (
        <>
          <div>
            <label className="label">Nome do remédio</label>
            <input className="input" placeholder="Ex: Dipirona"
              {...register('nomeRemedio', { required: 'Obrigatório' })} />
            {errors.nomeRemedio && <p className="text-red-500 text-xs mt-1">{errors.nomeRemedio.message}</p>}
          </div>
          <div>
            <label className="label">Dosagem</label>
            <input className="input" placeholder="Ex: 500mg"
              {...register('dosagem', { required: 'Obrigatório' })} />
            {errors.dosagem && <p className="text-red-500 text-xs mt-1">{errors.dosagem.message}</p>}
          </div>
          <div>
            <label className="label">Posologia</label>
            <input className="input" placeholder="Ex: 1x ao dia por 5 dias"
              {...register('posologia')} />
          </div>
        </>
      )}

      {(tipo === 'ATIVIDADE_FISICA' || tipo === 'ATIVIDADE_MENTAL') && (
        <>
          <div>
            <label className="label">Descrição da atividade</label>
            <input className="input"
              placeholder={tipo === 'ATIVIDADE_FISICA' ? 'Ex: Agachamento' : 'Ex: Meditação guiada'}
              {...register('descricaoAtividade', { required: 'Obrigatório' })} />
            {errors.descricaoAtividade && <p className="text-red-500 text-xs mt-1">{errors.descricaoAtividade.message}</p>}
          </div>
          {tipo === 'ATIVIDADE_FISICA' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Repetições</label>
                <input type="number" className="input" {...register('repeticoes')} />
              </div>
              <div>
                <label className="label">Séries</label>
                <input type="number" className="input" {...register('series')} />
              </div>
            </div>
          )}
          {tipo === 'ATIVIDADE_MENTAL' && (
            <div>
              <label className="label">Objetivo</label>
              <input className="input" placeholder="Ex: Reduzir ansiedade"
                {...register('objetivo')} />
            </div>
          )}
          <div>
            <label className="label">Frequência semanal</label>
            <input className="input" placeholder="Ex: 3x por semana"
              {...register('frequenciaSemanal')} />
          </div>
        </>
      )}

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Salvando...' : 'Adicionar Receita'}
        </button>
      </div>
    </form>
  )
}
