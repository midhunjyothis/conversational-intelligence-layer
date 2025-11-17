import type { MessageIn, InsightsOut } from "../core/types";
import { runDetectors } from "../detectors";
import { scoreMessage } from "../scorer";
import { selectNudges } from "../nudge-engine";

export async function evaluateMessage(message: MessageIn): Promise<InsightsOut> {
  const detections = runDetectors(message.text);
  const scored = scoreMessage(message.text, detections);
  const nudges = selectNudges(detections);

  let suggested_rewrite = message.text;
  if (nudges.length > 0 && nudges[0].example_before_after) {
    suggested_rewrite = nudges[0].example_before_after.after;
  }

  return {
    ...scored,
    detections,
    nudges,
    suggested_rewrite,
    rationale: []
  };
}
