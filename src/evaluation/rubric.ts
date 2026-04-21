export interface EvaluationScore {
  clarityOfCommunication: 1 | 2 | 3 | 4;
  professionalTone: 'inappropriate' | 'acceptable' | 'professional' | 'excellent';
  vocabularyRange: number;
  techComprehension: 1 | 2 | 3 | 4 | 5;
  stakeholderAwareness: 1 | 2 | 3 | 4 | 5;
  presentationQuality?: number;
  teamCollaboration: 1 | 2 | 3 | 4 | 5;
  scenarioCompletion: boolean;
  complexityBonus: number;
  feedbackText: string;
  wellDone: string[];
  toImprove: string[];
}

export interface EvaluationRubric {
  scenarioId: string;
  scenarioTitle: string;
  level: string;
  goal: string;
  hasPresentation: boolean;
}

export const TONE_SCORES = {
  inappropriate: 0,
  acceptable: 1,
  professional: 2,
  excellent: 3,
} as const;

export function calculateTotalScore(score: EvaluationScore): number {
  const toneValue = TONE_SCORES[score.professionalTone];
  const presentationValue = score.presentationQuality ?? 0;
  const completionBonus = score.scenarioCompletion ? 10 : 0;

  return Math.round(
    score.clarityOfCommunication * 5 +
    toneValue * 5 +
    Math.min(score.vocabularyRange * 2, 20) +
    score.techComprehension * 3 +
    score.stakeholderAwareness * 3 +
    presentationValue +
    score.teamCollaboration * 3 +
    completionBonus +
    score.complexityBonus * 3
  );
}

export function getTotalScoreMax(hasPresentation: boolean): number {
  return hasPresentation ? 100 : 92;
}
