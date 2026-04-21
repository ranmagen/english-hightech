import { anthropic } from '../lib/anthropic';
import type { Message } from '../agents/AgentEngine';
import type { EvaluationScore, EvaluationRubric } from './rubric';
import type { ScenarioState } from '../scenarios/ScenarioEngine';

function buildEvaluationPrompt(
  conversation: Message[],
  rubric: EvaluationRubric,
  vocabularyCount: number,
  complexityBonus: number,
  goalAchieved: boolean
): string {
  const conversationText = conversation
    .map(m => `[${m.role === 'user' ? 'STUDENT (PM)' : m.agentId?.toUpperCase() + ' (AGENT)'}]: ${m.content}`)
    .join('\n\n');

  return `You are an English language evaluator for middle school students (grades 7-9) in Israel who are learning professional English through a tech PM simulation.

SCENARIO: ${rubric.scenarioTitle} (${rubric.level} level)
GOAL: ${rubric.goal}

CONVERSATION:
${conversationText}

VOCABULARY TERMS USED: ${vocabularyCount} unique tech/business terms

Evaluate the student's performance using this exact JSON structure. Be encouraging but honest. Consider that these are middle school students learning English:

{
  "clarityOfCommunication": <1-4, where 1=very unclear, 4=very clear and structured>,
  "professionalTone": <"inappropriate"|"acceptable"|"professional"|"excellent">,
  "vocabularyRange": ${vocabularyCount},
  "techComprehension": <1-5, how well they understood and used the context document/scenario info>,
  "stakeholderAwareness": <1-5, did they adapt communication to each agent's needs and personality>,
  "teamCollaboration": <1-5, did they listen, respond to pushback, and work with the team>,
  "scenarioCompletion": ${goalAchieved},
  "complexityBonus": ${complexityBonus},
  "feedbackText": "<2-3 specific sentences about their overall performance, mentioning specific moments from the conversation>",
  "wellDone": ["<specific thing they did well>", "<another specific thing>"],
  "toImprove": ["<specific thing to improve>", "<another specific thing>"]
}

Return ONLY valid JSON. No markdown, no code blocks.`;
}

export async function evaluateConversation(state: ScenarioState): Promise<EvaluationScore> {
  const rubric: EvaluationRubric = {
    scenarioId: state.scenario.id,
    scenarioTitle: state.scenario.title,
    level: state.scenario.level,
    goal: state.scenario.goal,
    hasPresentation: state.scenario.writing_mode === 'presentation',
  };

  const evalPrompt = buildEvaluationPrompt(
    state.messages,
    rubric,
    state.vocabularyUsed.size,
    state.complexityBonusEarned,
    state.goalAchieved
  );

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system:
        'You are an English language evaluator for middle school students in Israel. Evaluate the student\'s performance based on the rubric. Return JSON only.',
      messages: [{ role: 'user', content: evalPrompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}';
    const parsed = JSON.parse(text);

    return {
      clarityOfCommunication: Math.min(4, Math.max(1, parsed.clarityOfCommunication)) as 1 | 2 | 3 | 4,
      professionalTone: parsed.professionalTone || 'acceptable',
      vocabularyRange: state.vocabularyUsed.size,
      techComprehension: Math.min(5, Math.max(1, parsed.techComprehension)) as 1 | 2 | 3 | 4 | 5,
      stakeholderAwareness: Math.min(5, Math.max(1, parsed.stakeholderAwareness)) as 1 | 2 | 3 | 4 | 5,
      presentationQuality: parsed.presentationQuality,
      teamCollaboration: Math.min(5, Math.max(1, parsed.teamCollaboration)) as 1 | 2 | 3 | 4 | 5,
      scenarioCompletion: state.goalAchieved,
      complexityBonus: state.complexityBonusEarned,
      feedbackText: parsed.feedbackText || 'Good effort! Keep practicing your professional English.',
      wellDone: parsed.wellDone || [],
      toImprove: parsed.toImprove || [],
    };
  } catch (err) {
    console.error('Evaluation error:', err);
    return getFallbackScore(state);
  }
}

function getFallbackScore(state: ScenarioState): EvaluationScore {
  return {
    clarityOfCommunication: 2,
    professionalTone: 'acceptable',
    vocabularyRange: state.vocabularyUsed.size,
    techComprehension: 3,
    stakeholderAwareness: 3,
    teamCollaboration: 3,
    scenarioCompletion: state.goalAchieved,
    complexityBonus: state.complexityBonusEarned,
    feedbackText: 'Great effort on this scenario! Keep practicing your professional English communication.',
    wellDone: ['You participated in the scenario', 'You used some professional vocabulary'],
    toImprove: ['Try to be more specific in your updates', 'Use more professional vocabulary terms'],
  };
}
