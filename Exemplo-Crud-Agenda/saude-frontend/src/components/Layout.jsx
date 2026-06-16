// src/components/Layout.jsx
import { Link, useLocation } from "react-router-dom";
import { Users, FileText, Activity, HeartPulse } from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();

  const menuItems = [
    { name: "Início", path: "/", icon: HeartPulse },
    { name: "Profissionais", path: "/profissionais", icon: Users },
    { name: "Atendimentos", path: "/atendimentos", icon: FileText },
    { name: "Exames", path: "/exames", icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <HeartPulse className="text-blue-600 w-8 h-8" />
          <h1 className="text-xl font-bold text-gray-900">Saúde API</h1>
        </div>

        <nav className="flex-1 px-4 mt-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
