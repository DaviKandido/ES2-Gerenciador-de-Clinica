import { Outlet, NavLink } from 'react-router-dom'
import { Stethoscope, Users, Calendar, LayoutDashboard } from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/profissionais', icon: Users, label: 'Profissionais' },
  { to: '/atendimentos', icon: Calendar, label: 'Atendimentos' },
]

export default function Layout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 bg-brand-900 text-white flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-400 rounded-lg flex items-center justify-center">
            <Stethoscope size={16} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm">Clínica Saúde</p>
            <p className="text-xs text-brand-200">Gerenciamento</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-600 text-white' : 'text-blue-100 hover:bg-white/10'
                }`}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-xs text-blue-300">Sistema v1.0</p>
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-surface">
        <Outlet />
      </main>
    </div>
  )
}
