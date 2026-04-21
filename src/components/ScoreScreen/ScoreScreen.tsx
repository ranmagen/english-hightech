import { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { CheckCircle, XCircle, Star, RotateCcw, ArrowRight } from 'lucide-react';
import type { EvaluationScore } from '../../evaluation/rubric';
import { calculateTotalScore, TONE_SCORES } from '../../evaluation/rubric';
import type { ScenarioState } from '../../scenarios/ScenarioEngine';
import { evaluateConversation } from '../../evaluation/EvaluationEngine';

interface Props {
  scenarioState: ScenarioState;
  onTryAgain: () => void;
  onNextScenario: () => void;
  hasNextScenario: boolean;
}

export function ScoreScreen({ scenarioState, onTryAgain, onNextScenario, hasNextScenario }: Props) {
  const [score, setScore] = useState<EvaluationScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    evaluateConversation(scenarioState).then(result => {
      setScore(result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600 font-medium">Evaluating your performance…</p>
        <p className="text-slate-400 text-sm">Claude is analyzing your conversation</p>
      </div>
    );
  }

  if (!score) return null;

  const total = calculateTotalScore(score);
  const toneValue = TONE_SCORES[score.professionalTone];

  const radarData = [
    { metric: 'Clarity', value: (score.clarityOfCommunication / 4) * 100, fullMark: 100 },
    { metric: 'Tone', value: (toneValue / 3) * 100, fullMark: 100 },
    { metric: 'Vocabulary', value: Math.min(100, (score.vocabularyRange / 8) * 100), fullMark: 100 },
    { metric: 'Tech Know.', value: (score.techComprehension / 5) * 100, fullMark: 100 },
    { metric: 'Stakeholders', value: (score.stakeholderAwareness / 5) * 100, fullMark: 100 },
    { metric: 'Teamwork', value: (score.teamCollaboration / 5) * 100, fullMark: 100 },
  ];

  const totalPercent = Math.min(100, Math.round((total / 80) * 100));
  const isSuccess = scenarioState.goalAchieved && score.professionalTone !== 'inappropriate';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className={`rounded-2xl p-6 text-white ${isSuccess ? 'bg-gradient-to-r from-sky-600 to-blue-700' : 'bg-gradient-to-r from-slate-600 to-slate-700'}`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isSuccess ? <CheckCircle size={24} /> : <XCircle size={24} />}
              <span className="text-lg font-bold">
                {isSuccess ? 'Scenario Complete!' : 'Keep Practicing!'}
              </span>
            </div>
            <h2 className="text-2xl font-bold">{scenarioState.scenario.title}</h2>
            <p className="text-sky-200 mt-1 text-sm">{scenarioState.scenario.level} level</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-black">{totalPercent}%</div>
            <div className="text-sky-200 text-sm">Overall Score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-700 mb-4">Performance Breakdown</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#64748b' }} />
              <Radar name="Score" dataKey="value" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.25} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Metric details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <h3 className="font-bold text-slate-700 mb-4">Metrics</h3>
          {[
            { label: 'Clarity of Communication', value: score.clarityOfCommunication, max: 4 },
            { label: 'Tech Comprehension', value: score.techComprehension, max: 5 },
            { label: 'Stakeholder Awareness', value: score.stakeholderAwareness, max: 5 },
            { label: 'Team Collaboration', value: score.teamCollaboration, max: 5 },
            { label: 'Vocabulary Terms Used', value: score.vocabularyRange, max: 8 },
          ].map(({ label, value, max }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">{label}</span>
                <span className="font-semibold text-slate-800">{value}/{max}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-sky-500 h-2 rounded-full transition-all"
                  style={{ width: `${(value / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Professional Tone</span>
              <span className={`font-semibold px-2 py-0.5 rounded text-xs ${
                score.professionalTone === 'excellent' ? 'bg-green-100 text-green-700' :
                score.professionalTone === 'professional' ? 'bg-sky-100 text-sky-700' :
                score.professionalTone === 'acceptable' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {score.professionalTone}
              </span>
            </div>
          </div>
          {score.complexityBonus > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-2">
              <Star size={14} className="text-amber-500" />
              <span className="text-xs text-amber-700 font-semibold">Complexity bonus +{score.complexityBonus}</span>
            </div>
          )}
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <p className="text-slate-700 leading-relaxed mb-4">{score.feedbackText}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-1">
              <CheckCircle size={14} /> What you did well
            </h4>
            <ul className="space-y-1">
              {score.wellDone.map((item, i) => (
                <li key={i} className="text-sm text-green-700">• {item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-semibold text-amber-800 mb-2">What to improve</h4>
            <ul className="space-y-1">
              {score.toImprove.map((item, i) => (
                <li key={i} className="text-sm text-amber-700">• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={onTryAgain}
          className="flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
        >
          <RotateCcw size={16} />
          Try Again
        </button>
        {hasNextScenario && (
          <button
            onClick={onNextScenario}
            className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition-colors font-medium"
          >
            Next Scenario
            <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
