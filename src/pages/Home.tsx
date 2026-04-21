import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Lock, ChevronRight, Globe, Users, BookOpen, Presentation } from 'lucide-react';
import type { Scenario } from '../scenarios/ScenarioEngine';
import { loadAllScenarios } from '../scenarios/ScenarioEngine';
import type { AgentId } from '../agents/AgentEngine';
import { AGENT_PROFILES } from '../agents/AgentEngine';

const LEVEL_COLORS = {
  beginner: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
  advanced: 'bg-rose-100 text-rose-700 border-rose-200',
};

const LEVEL_LABELS_HE = {
  beginner: 'מתחיל',
  intermediate: 'בינוני',
  advanced: 'מתקדם',
};

const CORE_COMPONENTS = [
  { icon: <Globe size={18} />, label: 'Professional Communication', desc: 'Chat with AI teammates in English' },
  { icon: <BookOpen size={18} />, label: 'Tech Knowledge Processing', desc: 'Read PRDs, roadmaps, data tables' },
  { icon: <Users size={18} />, label: 'Global Teamwork', desc: 'Agents from US, India, enterprise clients' },
  { icon: <Presentation size={18} />, label: 'Authentic Simulations', desc: '6 branching scenarios with real consequences' },
];

export function Home() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [completedIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('completedScenarios') || '[]'); } catch { return []; }
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadAllScenarios().then(setScenarios).catch(console.error);
  }, []);

  const isUnlocked = (scenario: Scenario): boolean => {
    if (!scenario.unlock_requires || scenario.unlock_requires.length === 0) return true;
    return scenario.unlock_requires.every(id => completedIds.includes(id));
  };

  const groupedByLevel = {
    beginner: scenarios.filter(s => s.level === 'beginner'),
    intermediate: scenarios.filter(s => s.level === 'intermediate'),
    advanced: scenarios.filter(s => s.level === 'advanced'),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <div className="font-black text-slate-800 text-lg leading-none">TechSpace</div>
              <div className="text-xs text-slate-400">PM Simulation · English Learning</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/admin')}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Teacher Login →
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-slate-800 mb-4">
            Welcome to <span className="text-sky-600">TechSpace</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            You're the <strong>Product Manager</strong> at a global tech company.
            Communicate with your AI teammates in English. Navigate real workplace challenges.
          </p>
        </div>

        {/* Core components */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          {CORE_COMPONENTS.map(({ icon, label, desc }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-sky-600 mb-2">{icon}</div>
              <div className="text-sm font-semibold text-slate-700 mb-1">{label}</div>
              <div className="text-xs text-slate-400">{desc}</div>
            </div>
          ))}
        </div>

        {/* Scenarios */}
        {scenarios.length === 0 ? (
          <div className="text-center py-12 text-slate-400">Loading scenarios…</div>
        ) : (
          <div className="space-y-8">
            {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
              <div key={level}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-lg font-bold text-slate-700 capitalize">{level}</h2>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${LEVEL_COLORS[level]}`} dir="rtl">
                    {LEVEL_LABELS_HE[level]}
                  </span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {groupedByLevel[level].map(scenario => {
                    const unlocked = isUnlocked(scenario);
                    const completed = completedIds.includes(scenario.id);
                    return (
                      <button
                        key={scenario.id}
                        onClick={() => unlocked && navigate(`/scenario/${scenario.id}`)}
                        disabled={!unlocked}
                        className={`text-left p-5 rounded-2xl border-2 transition-all ${
                          completed ? 'border-green-400 bg-green-50' :
                          unlocked ? 'border-slate-200 bg-white hover:border-sky-400 hover:shadow-md' :
                          'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-400">{scenario.id}</span>
                            {completed && <span className="text-xs text-green-600 font-semibold">✓ Done</span>}
                            {!unlocked && <Lock size={12} className="text-slate-400" />}
                          </div>
                          {unlocked && !completed && (
                            <ChevronRight size={18} className="text-slate-300" />
                          )}
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg mb-2">{scenario.title}</h3>
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">{scenario.goal}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {scenario.agents.map(agentId => (
                            <div key={agentId} className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${AGENT_PROFILES[agentId as AgentId].color} bg-opacity-10`}>
                              <div className={`w-5 h-5 ${AGENT_PROFILES[agentId as AgentId].color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                                {AGENT_PROFILES[agentId as AgentId].avatar}
                              </div>
                              <span className="text-xs font-medium text-slate-700">
                                {AGENT_PROFILES[agentId as AgentId].name}
                              </span>
                            </div>
                          ))}
                        </div>
                        {!unlocked && scenario.unlock_requires && (
                          <p className="text-xs text-slate-400 mt-3">
                            Complete {scenario.unlock_requires.join(', ')} to unlock
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
