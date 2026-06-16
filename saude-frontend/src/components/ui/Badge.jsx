const map = {
  MEDICO:         { label: 'Médico',          cls: 'badge-medico' },
  FISIOTERAPEUTA: { label: 'Fisioterapeuta',  cls: 'badge-fisio' },
  PSICOLOGO:      { label: 'Psicólogo',       cls: 'badge-psicologo' },
}

export default function CategoriaBadge({ categoria }) {
  const { label, cls } = map[categoria] || { label: categoria, cls: 'badge-medico' }
  return <span className={cls}>{label}</span>
}
