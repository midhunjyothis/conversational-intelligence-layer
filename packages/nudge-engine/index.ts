import type { Detection, Nudge } from "../core/types";
import { NUDGE_CATALOG } from "./nudges";

export function selectNudges(detections: Detection[]): Nudge[] {
  const triggerTypes = new Set(detections.map(d => d.type));
  const nudges: Nudge[] = [];

  for (const n of NUDGE_CATALOG) {
    if (triggerTypes.has(n.trigger)) {
      nudges.push(n);
    }
    if (nudges.length >= 3) break;
  }

  return nudges;
}
