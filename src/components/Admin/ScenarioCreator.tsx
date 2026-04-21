import { useState } from 'react';
import { Save, Eye } from 'lucide-react';
import type { AgentId } from '../../agents/AgentEngine';
import { AGENT_PROFILES } from '../../agents/AgentEngine';

interface ScenarioForm {
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  agents: AgentId[];
  goal: string;
  context_doc: string;
  hint: string;
}

const DEFAULT_FORM: ScenarioForm = {
  title: '',
  level: 'beginner',
  agents: ['sarah'],
  goal: '',
  context_doc: '',
  hint: '',
};

const ALL_AGENTS: AgentId[] = ['sarah', 'mark', 'priya', 'tom', 'jamie'];

export function ScenarioCreator() {
  const [form, setForm] = useState<ScenarioForm>(DEFAULT_FORM);
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  const toggleAgent = (id: AgentId) => {
    setForm(p => ({
      ...p,
      agents: p.agents.includes(id) ? p.agents.filter(a => a !== id) : [...p.agents, id],
    }));
  };

  const handleSave = () => {
    const scenario = { id: `CUSTOM-${Date.now()}`, ...form, branches: [], success_criteria: { goal_achieved: true, min_vocabulary_terms: 3, agent_satisfaction_score: 3 }, is_published: false, unlock_requires: [], opening_message: 'Hello! Let\'s get started.', opening_agent: form.agents[0] };
    console.log('Scenario saved (would persist to Supabase):', scenario);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Scenario Creator</h2>
          <p className="text-slate-500 text-sm">Create a new scenario for students</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50"
          >
            <Eye size={16} /> {preview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={!form.title || !form.goal || form.agents.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-medium"
          >
            <Save size={16} /> {saved ? 'Saved!' : 'Save Scenario'}
          </button>
        </div>
      </div>

      {preview ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
            form.level === 'beginner' ? 'bg-green-100 text-green-700' :
            form.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>{form.level}</div>
          <h2 className="text-2xl font-bold text-slate-800">{form.title || 'Untitled Scenario'}</h2>
          <p className="text-slate-600">{form.goal || 'No goal set.'}</p>
          {form.context_doc && (
            <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap text-slate-700">
              {form.context_doc}
            </div>
          )}
          <div className="flex gap-2">
            {form.agents.map(id => (
              <div key={id} className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white ${AGENT_PROFILES[id].color}`}>
                {AGENT_PROFILES[id].name}
              </div>
            ))}
          </div>
          {form.hint && <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">💡 {form.hint}</div>}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Scenario Title *</label>
              <input
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Emergency Stakeholder Meeting"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Difficulty Level *</label>
              <select
                value={form.level}
                onChange={e => setForm(p => ({ ...p, level: e.target.value as ScenarioForm['level'] }))}
                className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Agents *</label>
            <div className="flex flex-wrap gap-2">
              {ALL_AGENTS.map(id => (
                <button
                  key={id}
                  onClick={() => toggleAgent(id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-colors ${
                    form.agents.includes(id)
                      ? 'bg-sky-600 border-sky-600 text-white'
                      : 'border-slate-300 text-slate-600 hover:border-sky-400'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${form.agents.includes(id) ? 'bg-sky-700' : AGENT_PROFILES[id].color} text-white`}>
                    {AGENT_PROFILES[id].avatar}
                  </div>
                  {AGENT_PROFILES[id].name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Goal *</label>
            <textarea
              value={form.goal}
              onChange={e => setForm(p => ({ ...p, goal: e.target.value }))}
              placeholder="What must the student accomplish in this scenario?"
              rows={2}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Context Document <span className="font-normal text-slate-400">(optional)</span></label>
            <textarea
              value={form.context_doc}
              onChange={e => setForm(p => ({ ...p, context_doc: e.target.value }))}
              placeholder="Paste a PRD, email, data table, or any background document the student should read before starting..."
              rows={6}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Hint</label>
            <textarea
              value={form.hint}
              onChange={e => setForm(p => ({ ...p, hint: e.target.value }))}
              placeholder="What tip should appear when the student clicks 'Need a hint?'"
              rows={2}
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
