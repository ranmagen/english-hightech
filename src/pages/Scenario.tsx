import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';
import type { Scenario as ScenarioType, ScenarioState } from '../scenarios/ScenarioEngine';
import { createScenarioState, loadScenario } from '../scenarios/ScenarioEngine';
import { ChatInterface } from '../components/Chat/ChatInterface';
import { PresentationMode } from '../components/PresentationMode/PresentationMode';
import { ScoreScreen } from '../components/ScoreScreen/ScoreScreen';

const SCENARIO_ORDER = ['B-01', 'B-02', 'I-01', 'I-02', 'A-01', 'A-02'];

type Phase = 'loading' | 'active' | 'score';

export function ScenarioPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scenario, setScenario] = useState<ScenarioType | null>(null);
  const [scenarioState, setScenarioState] = useState<ScenarioState | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setPhase('loading');
    loadScenario(id)
      .then(s => {
        setScenario(s);
        setScenarioState(createScenarioState(s));
        setPhase('active');
      })
      .catch(() => setError(`Scenario "${id}" not found.`));
  }, [id]);

  const handleComplete = (finalState: ScenarioState) => {
    setScenarioState(finalState);
    setPhase('score');
    const completed: string[] = JSON.parse(localStorage.getItem('completedScenarios') || '[]');
    if (!completed.includes(id!)) {
      localStorage.setItem('completedScenarios', JSON.stringify([...completed, id!]));
    }
  };

  const handleTryAgain = () => {
    if (scenario) {
      setScenarioState(createScenarioState(scenario));
      setPhase('active');
    }
  };

  const handleNext = () => {
    const currentIdx = SCENARIO_ORDER.indexOf(id!);
    const nextId = SCENARIO_ORDER[currentIdx + 1];
    if (nextId) navigate(`/scenario/${nextId}`);
    else navigate('/');
  };

  const currentIdx = SCENARIO_ORDER.indexOf(id || '');
  const hasNext = currentIdx < SCENARIO_ORDER.length - 1;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-4">{error}</p>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-sky-600 text-white rounded-xl">Back Home</button>
        </div>
      </div>
    );
  }

  if (phase === 'loading' || !scenarioState || !scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading scenario…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-4 flex-shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={16} /> Home
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-sky-600 rounded-lg flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-bold text-slate-700 text-sm">TechSpace</span>
        </div>
        <div className="flex-1 text-center">
          <span className="text-sm font-semibold text-slate-600">{scenario.title}</span>
        </div>
        <div className="text-xs text-slate-400">
          {currentIdx + 1} / {SCENARIO_ORDER.length}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {phase === 'active' && (
          scenario.writing_mode === 'presentation' ? (
            <PresentationMode
              scenarioState={scenarioState}
              onStateUpdate={setScenarioState}
              onPresentationComplete={handleComplete}
            />
          ) : (
            <ChatInterface
              scenarioState={scenarioState}
              onStateUpdate={setScenarioState}
              onComplete={handleComplete}
            />
          )
        )}
        {phase === 'score' && (
          <div className="flex-1 overflow-y-auto bg-slate-50 py-6">
            <ScoreScreen
              scenarioState={scenarioState}
              onTryAgain={handleTryAgain}
              onNextScenario={handleNext}
              hasNextScenario={hasNext}
            />
          </div>
        )}
      </div>
    </div>
  );
}
