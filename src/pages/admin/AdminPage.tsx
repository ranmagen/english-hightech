import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, BookOpen, Users, BarChart3, Plus, ArrowLeft } from 'lucide-react';
import { AdminLogin } from '../../components/Admin/AdminLogin';
import { GlossaryManager } from '../../components/Admin/GlossaryManager';
import { AgentEditor } from '../../components/Admin/AgentEditor';
import { PerformanceDashboard } from '../../components/Admin/PerformanceDashboard';
import { ScenarioCreator } from '../../components/Admin/ScenarioCreator';

type Tab = 'dashboard' | 'scenarios' | 'agents' | 'glossary';

const TABS: { id: Tab; label: string; labelHe: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', labelHe: 'לוח ביצועים', icon: <BarChart3 size={16} /> },
  { id: 'scenarios', label: 'Scenarios', labelHe: 'תרחישים', icon: <Plus size={16} /> },
  { id: 'agents', label: 'Agents', labelHe: 'סוכנים', icon: <Users size={16} /> },
  { id: 'glossary', label: 'Glossary', labelHe: 'מילון', icon: <BookOpen size={16} /> },
];

export function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === '1') setIsAuthed(true);
  }, []);

  if (!isAuthed) {
    return <AdminLogin onLogin={() => setIsAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-slate-900 text-white flex flex-col">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center">
              <Zap size={16} />
            </div>
            <span className="font-black text-lg">TechSpace</span>
          </div>
          <div className="text-xs text-slate-400">לוח בקרה למורה</div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab.icon}
              <div>
                <div className="font-medium">{tab.label}</div>
                <div className="text-xs opacity-60" dir="rtl">{tab.labelHe}</div>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => { sessionStorage.removeItem('admin_auth'); navigate('/'); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={14} /> Back to TechSpace
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === 'dashboard' && <PerformanceDashboard />}
        {activeTab === 'scenarios' && <ScenarioCreator />}
        {activeTab === 'agents' && <AgentEditor />}
        {activeTab === 'glossary' && <GlossaryManager />}
      </main>
    </div>
  );
}
