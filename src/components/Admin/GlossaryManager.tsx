import { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import type { GlossaryTerm } from '../../data/glossary';
import { GLOSSARY_TERMS } from '../../data/glossary';

export function GlossaryManager() {
  const [terms, setTerms] = useState<GlossaryTerm[]>(GLOSSARY_TERMS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<GlossaryTerm | null>(null);
  const [newTerm, setNewTerm] = useState({ term: '', definition_he: '', category: 'general' });
  const [showAdd, setShowAdd] = useState(false);

  const handleEdit = (term: GlossaryTerm) => {
    setEditingId(term.term);
    setEditValue({ ...term });
  };

  const handleSave = () => {
    if (!editValue) return;
    setTerms(prev => prev.map(t => t.term === editingId ? editValue : t));
    setEditingId(null);
    setEditValue(null);
  };

  const handleDelete = (term: string) => {
    setTerms(prev => prev.filter(t => t.term !== term));
  };

  const handleAdd = () => {
    if (!newTerm.term || !newTerm.definition_he) return;
    setTerms(prev => [...prev, { ...newTerm }]);
    setNewTerm({ term: '', definition_he: '', category: 'general' });
    setShowAdd(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Glossary Manager</h2>
          <p className="text-slate-500 text-sm">{terms.length} terms · Tooltips apply automatically across all scenarios</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={16} /> Add Term
        </button>
      </div>

      {showAdd && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-4 grid grid-cols-3 gap-3">
          <input
            value={newTerm.term}
            onChange={e => setNewTerm(p => ({ ...p, term: e.target.value }))}
            placeholder="English term"
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
          />
          <input
            value={newTerm.definition_he}
            onChange={e => setNewTerm(p => ({ ...p, definition_he: e.target.value }))}
            placeholder="הגדרה בעברית"
            dir="rtl"
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
          />
          <div className="flex gap-2">
            <input
              value={newTerm.category}
              onChange={e => setNewTerm(p => ({ ...p, category: e.target.value }))}
              placeholder="category"
              className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
            />
            <button onClick={handleAdd} className="px-3 py-2 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700">
              <Save size={14} />
            </button>
            <button onClick={() => setShowAdd(false)} className="px-3 py-2 text-slate-500 hover:text-slate-700 rounded-lg">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">English Term</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Hebrew Definition</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">Category</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {terms.map(t => (
              <tr key={t.term} className="hover:bg-slate-50">
                {editingId === t.term && editValue ? (
                  <>
                    <td className="px-4 py-3">
                      <input value={editValue.term} onChange={e => setEditValue(p => p ? { ...p, term: e.target.value } : p)} className="border border-sky-400 rounded px-2 py-1 text-sm w-full" />
                    </td>
                    <td className="px-4 py-3">
                      <input value={editValue.definition_he} onChange={e => setEditValue(p => p ? { ...p, definition_he: e.target.value } : p)} dir="rtl" className="border border-sky-400 rounded px-2 py-1 text-sm w-full text-right" />
                    </td>
                    <td className="px-4 py-3">
                      <input value={editValue.category} onChange={e => setEditValue(p => p ? { ...p, category: e.target.value } : p)} className="border border-sky-400 rounded px-2 py-1 text-sm w-full" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={handleSave} className="p-1.5 text-green-600 hover:bg-green-50 rounded"><Save size={14} /></button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"><X size={14} /></button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-sm font-medium text-slate-800">{t.term}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 text-right" dir="rtl">{t.definition_he}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(t)} className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded"><Edit3 size={14} /></button>
                        <button onClick={() => handleDelete(t.term)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
