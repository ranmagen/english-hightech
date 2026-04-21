import { anthropic } from '../lib/anthropic';
import { sarahSystemPrompt } from './prompts/sarah';
import { markSystemPrompt } from './prompts/mark';
import { priyaSystemPrompt } from './prompts/priya';
import { tomSystemPrompt } from './prompts/tom';
import { jamieSystemPrompt } from './prompts/jamie';
import { GLOSSARY_TERMS } from '../data/glossary';

export type AgentId = 'sarah' | 'mark' | 'priya' | 'tom' | 'jamie';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  agentId?: AgentId;
  timestamp?: number;
}

export interface ScenarioContext {
  scenarioId: string;
  scenarioTitle: string;
  goal: string;
  contextDoc?: string;
}

export interface AgentResponse {
  message: string;
  agentId: AgentId;
  agentSatisfaction: number;
  vocabularyUsed: string[];
  timestamp: number;
}

export const AGENT_PROFILES: Record<AgentId, { name: string; role: string; avatar: string; color: string }> = {
  sarah: { name: 'Sarah Lee', role: 'Engineering Lead', avatar: 'SL', color: 'bg-blue-500' },
  mark: { name: 'Mark Kim', role: 'VP Product', avatar: 'MK', color: 'bg-purple-600' },
  priya: { name: 'Priya Rao', role: 'UX Design Partner', avatar: 'PR', color: 'bg-pink-500' },
  tom: { name: 'Tom Carter', role: 'Enterprise Client', avatar: 'TC', color: 'bg-orange-600' },
  jamie: { name: 'Jamie Walsh', role: 'Junior Developer', avatar: 'JW', color: 'bg-green-500' },
};

function buildSystemPrompt(agentId: AgentId, context: ScenarioContext): string {
  const ctx = `
Scenario: ${context.scenarioTitle}
Goal for the student: ${context.goal}
${context.contextDoc ? `Context document available: ${context.contextDoc}` : ''}
`.trim();

  switch (agentId) {
    case 'sarah': return sarahSystemPrompt(ctx);
    case 'mark': return markSystemPrompt(ctx);
    case 'priya': return priyaSystemPrompt(ctx);
    case 'tom': return tomSystemPrompt(ctx);
    case 'jamie': return jamieSystemPrompt(ctx);
  }
}

function extractVocabularyTerms(message: string): string[] {
  const lower = message.toLowerCase();
  return GLOSSARY_TERMS
    .filter(t => lower.includes(t.term.toLowerCase()))
    .map(t => t.term);
}

function extractSatisfactionSignal(responseText: string): number {
  const positiveSignals = [
    'good', 'clear', 'thank you', 'appreciate', 'great', 'excellent',
    'understood', 'perfect', 'helpful', 'makes sense', 'got it',
  ];
  const negativeSignals = [
    'vague', 'unclear', 'unacceptable', 'disappointed', 'confused',
    'need specifics', 'not enough', 'escalate', 'concern',
  ];

  const lower = responseText.toLowerCase();
  const positiveCount = positiveSignals.filter(s => lower.includes(s)).length;
  const negativeCount = negativeSignals.filter(s => lower.includes(s)).length;

  if (negativeCount > positiveCount) return Math.max(1, 2 - negativeCount);
  if (positiveCount > 0) return Math.min(5, 3 + positiveCount);
  return 3;
}

export async function sendAgentMessage(
  agentId: AgentId,
  userMessage: string,
  conversationHistory: Message[],
  scenarioContext: ScenarioContext
): Promise<AgentResponse> {
  const systemPrompt = buildSystemPrompt(agentId, scenarioContext);

  const apiMessages = conversationHistory
    .filter(m => m.agentId === agentId || m.role === 'user')
    .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: systemPrompt,
    messages: [
      ...apiMessages,
      { role: 'user', content: userMessage },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  return {
    message: text,
    agentId,
    agentSatisfaction: extractSatisfactionSignal(text),
    vocabularyUsed: extractVocabularyTerms(userMessage),
    timestamp: Date.now(),
  };
}
