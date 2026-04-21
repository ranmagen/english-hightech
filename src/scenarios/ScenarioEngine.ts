import type { AgentId, Message } from '../agents/AgentEngine';

export interface ScenarioBranch {
  trigger: string;
  agent_response: string;
  consequence: string;
}

export interface SuccessCriteria {
  goal_achieved: boolean;
  min_vocabulary_terms: number;
  agent_satisfaction_score: number;
  presentation_quality_min?: number;
}

export interface Scenario {
  id: string;
  title: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  agents: AgentId[];
  goal: string;
  context_doc: string | null;
  hint: string;
  success_criteria: SuccessCriteria;
  branches: ScenarioBranch[];
  opening_message: string;
  opening_agent: AgentId;
  writing_mode?: 'chat' | 'email' | 'presentation';
  unlock_requires?: string[];
}

export interface ScenarioState {
  scenario: Scenario;
  messages: Message[];
  vocabularyUsed: Set<string>;
  agentSatisfactionScores: number[];
  hintsUsed: number;
  startTime: number;
  isComplete: boolean;
  goalAchieved: boolean;
  complexityBonusEarned: number;
  messageCount: number;
}

export function createScenarioState(scenario: Scenario): ScenarioState {
  const openingMessage: Message = {
    role: 'assistant',
    content: scenario.opening_message,
    agentId: scenario.opening_agent,
    timestamp: Date.now(),
  };

  return {
    scenario,
    messages: [openingMessage],
    vocabularyUsed: new Set(),
    agentSatisfactionScores: [],
    hintsUsed: 0,
    startTime: Date.now(),
    isComplete: false,
    goalAchieved: false,
    complexityBonusEarned: 0,
    messageCount: 0,
  };
}

export function updateScenarioState(
  state: ScenarioState,
  newMessages: Message[],
  vocabularyTerms: string[],
  agentSatisfaction: number
): ScenarioState {
  const updatedVocab = new Set(state.vocabularyUsed);
  vocabularyTerms.forEach(t => updatedVocab.add(t));

  return {
    ...state,
    messages: [...state.messages, ...newMessages],
    vocabularyUsed: updatedVocab,
    agentSatisfactionScores: [...state.agentSatisfactionScores, agentSatisfaction],
    messageCount: state.messageCount + 1,
  };
}

export function checkGoalAchieved(state: ScenarioState): boolean {
  const avgSatisfaction =
    state.agentSatisfactionScores.length > 0
      ? state.agentSatisfactionScores.reduce((a, b) => a + b, 0) /
        state.agentSatisfactionScores.length
      : 0;

  const meetsVocab =
    state.vocabularyUsed.size >= state.scenario.success_criteria.min_vocabulary_terms;
  const meetsSatisfaction =
    avgSatisfaction >= state.scenario.success_criteria.agent_satisfaction_score;
  const hasEnoughMessages = state.messageCount >= 3;

  return meetsVocab && meetsSatisfaction && hasEnoughMessages;
}

export function getComplexityBonus(state: ScenarioState): number {
  const userMessages = state.messages.filter(m => m.role === 'user');
  const avgLength =
    userMessages.length > 0
      ? userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length
      : 0;

  if (avgLength > 300 && state.vocabularyUsed.size > 6) return 3;
  if (avgLength > 150 && state.vocabularyUsed.size > 4) return 2;
  if (avgLength > 80) return 1;
  return 0;
}

const SCENARIO_MODULES = {
  'B-01': () => import('./library/B-01.json'),
  'B-02': () => import('./library/B-02.json'),
  'I-01': () => import('./library/I-01.json'),
  'I-02': () => import('./library/I-02.json'),
  'A-01': () => import('./library/A-01.json'),
  'A-02': () => import('./library/A-02.json'),
};

export async function loadScenario(id: string): Promise<Scenario> {
  const loader = SCENARIO_MODULES[id as keyof typeof SCENARIO_MODULES];
  if (!loader) throw new Error(`Scenario ${id} not found`);
  const module = await loader();
  return module.default as Scenario;
}

export async function loadAllScenarios(): Promise<Scenario[]> {
  const ids = ['B-01', 'B-02', 'I-01', 'I-02', 'A-01', 'A-02'];
  return Promise.all(ids.map(loadScenario));
}
