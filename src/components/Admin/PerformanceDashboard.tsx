import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Download } from 'lucide-react';

const MOCK_STUDENTS = [
  { name: 'Student A', class: '7A', scenariosCompleted: 4, avgScore: 72, vocabGrowth: 12 },
  { name: 'Student B', class: '7A', scenariosCompleted: 6, avgScore: 88, vocabGrowth: 18 },
  { name: 'Student C', class: '8B', scenariosCompleted: 3, avgScore: 65, vocabGrowth: 8 },
  { name: 'Student D', class: '8B', scenariosCompleted: 5, avgScore: 79, vocabGrowth: 15 },
  { name: 'Student E', class: '9C', scenariosCompleted: 6, avgScore: 91, vocabGrowth: 21 },
];

const MOCK_SCENARIO_STATS = [
  { id: 'B-01', title: 'Monday Standup', avgScore: 78, attempts: 24, completed: 22 },
  { id: 'B-02', title: 'Feature Request Email', avgScore: 71, attempts: 20, completed: 17 },
  { id: 'I-01', title: 'Sprint Review Gone Wrong', avgScore: 65, attempts: 15, completed: 11 },
  { id: 'I-02', title: 'Cross-Cultural Conflict', avgScore: 62, attempts: 12, completed: 9 },
  { id: 'A-01', title: 'Board Pitch', avgScore: 74, attempts: 8, completed: 6 },
  { id: 'A-02', title: 'Budget Cut Crisis', avgScore: 68, attempts: 6, completed: 4 },
];

const CLASS_RADAR_DATA = [
  { metric: 'Clarity', value: 72 },
  { metric: 'Tone', value: 68 },
  { metric: 'Vocabulary', value: 75 },
  { metric: 'Tech Know.', value: 65 },
  { metric: 'Stakeholders', value: 70 },
  { metric: 'Teamwork', value: 73 },
];

export function PerformanceDashboard() {
  const exportCSV = () => {
    const rows = [
      ['Name', 'Class', 'Scenarios Completed', 'Avg Score', 'Vocab Growth'],
      ...MOCK_STUDENTS.map(s => [s.name, s.class, s.scenariosCompleted, s.avgScore, s.vocabGrowth]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'techspace-results.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Performance Dashboard</h2>
          <p className="text-slate-500 text-sm">Class overview · {MOCK_STUDENTS.length} students</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-sm hover:bg-slate-50"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Avg Score', value: '75%', sub: 'Across all scenarios' },
          { label: 'Completion Rate', value: '82%', sub: 'Scenarios finished' },
          { label: 'Vocab Growth', value: '+14 terms', sub: 'B-01 → A-02 average' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="text-2xl font-black text-sky-600">{value}</div>
            <div className="font-semibold text-slate-700 text-sm">{label}</div>
            <div className="text-xs text-slate-400">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-bold text-slate-700 mb-4">Class Average — 8 Metrics</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={CLASS_RADAR_DATA}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Radar dataKey="value" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="font-bold text-slate-700 mb-4">Scenario Completion Rates</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MOCK_SCENARIO_STATS} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="id" tick={{ fontSize: 10 }} width={40} />
              <Tooltip />
              <Bar dataKey="avgScore" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Student', 'Class', 'Scenarios', 'Avg Score', 'Vocab Growth'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_STUDENTS.map(s => (
              <tr key={s.name} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-sm font-medium text-slate-800">{s.name}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{s.class}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{s.scenariosCompleted}/6</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-100 rounded-full h-1.5">
                      <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${s.avgScore}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{s.avgScore}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-green-600 font-semibold">+{s.vocabGrowth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-700">Scenario Statistics</h3>
        </div>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Scenario', 'Attempts', 'Completed', 'Completion Rate', 'Avg Score'].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_SCENARIO_STATS.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-slate-800">{s.title}</div>
                  <div className="text-xs text-slate-400">{s.id}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{s.attempts}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{s.completed}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    s.completed / s.attempts > 0.85 ? 'bg-green-100 text-green-700' :
                    s.completed / s.attempts > 0.7 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {Math.round((s.completed / s.attempts) * 100)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-700">{s.avgScore}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
