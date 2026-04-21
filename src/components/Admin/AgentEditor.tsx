import { useState } from 'react';
import { Send } from 'lucide-react';
import type { AgentId } from '../../agents/AgentEngine';
import { AGENT_PROFILES, sendAgentMessage } from '../../agents/AgentEngine';

interface AgentConfig {
  id: AgentId;
  name: string;
  role: string;
  tone: 'formal' | 'casual' | 'mixed';
  background: string;
  systemPromptPreview: string;
}

const AGENTS_CONFIG: AgentConfig[] = [
  { id: 'sarah', name: 'Sarah Lee', role: 'Engineering Lead', tone: 'mixed', background: 'San Francisco, USA', systemPromptPreview: 'Direct, technical, data-driven. Pushes back on vague requirements.' },
  { id: 'mark', name: 'Mark Kim', role: 'VP Product', tone: 'formal', background: 'Experienced VP', systemPromptPreview: 'Formal, strategic, KPI-focused. Expects deadlines and clear metrics.' },
  { id: 'priya', name: 'Priya Rao', role: 'UX Design Partner', tone: 'mixed', background: 'Bangalore, India', systemPromptPreview: 'Collaborative, thoughtful, user-focused. Indirect in disagreement.' },
  { id: 'tom', name: 'Tom Carter', role: 'Enterprise Client', tone: 'formal', background: 'Enterprise IT Manager', systemPromptPreview: 'Formal, impatient. Cares about ROI. Escalates when not heard.' },
  { id: 'jamie', name: 'Jamie Walsh', role: 'Junior Developer', tone: 'casual', background: 'New team member', systemPromptPreview: 'Enthusiastic, needs clear instructions. Asks clarifying questions.' },
];

export function AgentEditor() {
  const [selected, setSelected] = useState<AgentId>('sarah');
  const [testMessage, setTestMessage] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [testLoading, setTestLoading] = useState(false);

  const agent = AGENTS_CONFIG.find(a => a.id === selected)!;

  const handleTest = async () => {
    if (!testMessage.trim() || testLoading) return;
    setTestLoading(true);
    try {
      const response = await sendAgentMessage(selected, testMessage, [], {
        scenarioId: 'test',
        scenarioTitle: 'Agent Test',
        goal: 'Test the agent personality',
      });
      setTestResponse(response.message);
    } catch {
      setTestResponse('Error: Could not get response. Check your API key.');
    }
    setTestLoading(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Agent Editor</h2>
        <p className="text-slate-500 text-sm">View agent personalities and test responses</p>
      </div>

      <div className="grid grid-cols-5 gap-2 mb-6">
        {AGENTS_CONFIG.map(a => (
          <button
            key={a.id}
            onClick={() => { setSelected(a.id); setTestResponse(''); }}
            className={`p-3 rounded-xl border text-left transition-colors ${
              selected === a.id ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className={`w-10 h-10 ${AGENT_PROFILES[a.id].color} rounded-full flex items-center justify-center text-white text-sm font-bold mb-2`}>
              {AGENT_PROFILES[a.id].avatar}
            </div>
            <div className="text-xs font-semibold text-slate-700">{a.name}</div>
            <div className="text-xs text-slate-400">{a.role}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-bold text-slate-700 mb-4">{agent.name} — Profile</h3>
          <div className="space-y-3">
            {[
              { label: 'Role', value: agent.role },
              { label: 'Background', value: agent.background },
              { label: 'Tone', value: agent.tone },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-sm text-slate-500">{label}</span>
                <span className="text-sm font-medium text-slate-700 capitalize">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-500 font-semibold mb-1">Personality Summary</p>
            <p className="text-sm text-slate-600">{agent.systemPromptPreview}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-bold text-slate-700 mb-4">Test Agent Response</h3>
          <textarea
            value={testMessage}
            onChange={e => setTestMessage(e.target.value)}
            placeholder={`Send a message to ${agent.name}…`}
            rows={3}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none mb-3"
          />
          <button
            onClick={handleTest}
            disabled={!testMessage.trim() || testLoading}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-medium mb-4"
          >
            <Send size={14} /> {testLoading ? 'Sending…' : 'Send Test'}
          </button>
          {testResponse && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 ${AGENT_PROFILES[selected].color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                  {AGENT_PROFILES[selected].avatar}
                </div>
                <span className="text-xs font-semibold text-slate-600">{agent.name}</span>
              </div>
              <p className="text-sm text-slate-700">{testResponse}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
