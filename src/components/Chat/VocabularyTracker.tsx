import { GLOSSARY_TERMS } from '../../data/glossary';

interface Props {
  usedTerms: Set<string>;
}

export function VocabularyTracker({ usedTerms }: Props) {
  const usedList = [...usedTerms];
  const unusedSample = GLOSSARY_TERMS
    .filter(t => !usedTerms.has(t.term))
    .slice(0, 5);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-700 text-sm">Vocabulary Tracker</h3>
        <p className="text-xs text-slate-500 mt-1">Terms you've used in this scenario</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {usedList.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No terms detected yet. Try using professional vocabulary!</p>
        ) : (
          <div className="space-y-2">
            {usedList.map(term => {
              const glossary = GLOSSARY_TERMS.find(t => t.term.toLowerCase() === term.toLowerCase());
              return (
                <div key={term} className="bg-green-50 border border-green-200 rounded-lg p-2">
                  <div className="text-sm font-semibold text-green-800">{term} ✓</div>
                  {glossary && (
                    <div className="text-xs text-green-600 mt-0.5 text-right" dir="rtl">
                      {glossary.definition_he}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {unusedSample.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-slate-500 font-semibold mb-2">Try using these terms:</p>
            <div className="space-y-1">
              {unusedSample.map(t => (
                <div key={t.term} className="bg-slate-50 border border-slate-200 rounded p-2">
                  <div className="text-xs font-medium text-slate-700">{t.term}</div>
                  <div className="text-xs text-slate-400 text-right" dir="rtl">{t.definition_he}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="text-xs text-slate-500">
          <span className="font-semibold text-sky-600">{usedList.length}</span> terms used
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
          <div
            className="bg-sky-500 h-1.5 rounded-full transition-all"
            style={{ width: `${Math.min(100, (usedList.length / 8) * 100)}%` }}
          />
        </div>
        <div className="text-xs text-slate-400 mt-1">Goal: 8+ terms</div>
      </div>
    </div>
  );
}
