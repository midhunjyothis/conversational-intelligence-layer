import type { Detection, InsightsOut, SubScores } from "../core/types";

interface ScoreAccumulator {
  clarity: number;
  respect: number;
  empathy: number;
  specificity: number;
  actionability: number;
}

const BASE_SCORE = 80;

export function scoreMessage(text: string, detections: Detection[]): InsightsOut {
  const scores: ScoreAccumulator = {
    clarity: BASE_SCORE,
    respect: BASE_SCORE,
    empathy: BASE_SCORE,
    specificity: BASE_SCORE,
    actionability: BASE_SCORE
  };

  for (const d of detections) {
    switch (d.type) {
      case "vague_time_or_action":
        scores.clarity -= 8;
        scores.actionability -= 6;
        break;
      case "accusation_blame":
        scores.respect -= 20;
        scores.empathy -= 10;
        break;
      case "harsh_tone":
        scores.respect -= 15;
        break;
      case "excessive_hedging":
        scores.clarity -= 5;
        break;
      case "long_sentence":
        scores.clarity -= 5;
        break;
      case "direct_imperative":
        scores.respect -= 5;
        break;
      default:
        break;
    }
  }

  const sub_scores: SubScores = {
    clarity: clamp(scores.clarity),
    respect: clamp(scores.respect),
    empathy: clamp(scores.empathy),
    specificity: clamp(scores.specificity),
    actionability: clamp(scores.actionability)
  };

  const mqs = Math.round(
    (sub_scores.clarity +
      sub_scores.respect +
      sub_scores.empathy +
      sub_scores.specificity +
      sub_scores.actionability) /
      5
  );

  return {
    mqs,
    sub_scores,
    detections,
    nudges: [],
    suggested_rewrite: text,
    rationale: []
  };
}

function clamp(v: number): number {
  return Math.max(0, Math.min(100, v));
}
