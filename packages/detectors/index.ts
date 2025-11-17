import type { Detection, Severity } from "../core/types";

function makeDetection(
  type: string,
  span: [number, number],
  evidence: string,
  severity: Severity,
  confidence = 0.8
): Detection {
  return { type, span, severity, evidence, confidence };
}

export function runDetectors(text: string): Detection[] {
  const detections: Detection[] = [];
  const lower = text.toLowerCase();

  const vagueMatches = ["soon", "later", "sometime", "eventually", "at some point"];
  for (const phrase of vagueMatches) {
    const idx = lower.indexOf(phrase);
    if (idx !== -1) {
      detections.push(
        makeDetection(
          "vague_time_or_action",
          [idx, idx + phrase.length],
          text.slice(idx, idx + phrase.length),
          "notice"
        )
      );
    }
  }

  const blamePatterns = [/you never/i, /you always/i, /your fault/i, /because of you/i];
  for (const re of blamePatterns) {
    const match = text.match(re);
    if (match?.index !== undefined) {
      const start = match.index;
      const end = start + match[0].length;
      detections.push(
        makeDetection("accusation_blame", [start, end], match[0], "warn", 0.9)
      );
    }
  }

  const harshPatterns = [/completely wrong/i, /ridiculous/i, /stupid/i, /this is getting ridiculous/i];
  for (const re of harshPatterns) {
    const match = text.match(re);
    if (match?.index !== undefined) {
      const start = match.index;
      const end = start + match[0].length;
      detections.push(
        makeDetection("harsh_tone", [start, end], match[0], "warn", 0.85)
      );
    }
  }

  const hedges = ["maybe", "sort of", "kind of", "possibly", "I think", "I guess"];
  for (const h of hedges) {
    const idx = lower.indexOf(h.toLowerCase());
    if (idx !== -1) {
      detections.push(
        makeDetection(
          "excessive_hedging",
          [idx, idx + h.length],
          text.slice(idx, idx + h.length),
          "notice"
        )
      );
    }
  }

  const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
  for (const s of sentences) {
    if (s.length > 140) {
      const idx = text.indexOf(s);
      if (idx !== -1) {
        detections.push(
          makeDetection("long_sentence", [idx, idx + s.length], s, "notice", 0.7)
        );
      }
    }
  }

  if (/^[A-Za-z]+\s/.test(text) && !/please|could you|can you/i.test(text)) {
    detections.push(
      makeDetection(
        "direct_imperative",
        [0, Math.min(text.length, 40)],
        text.slice(0, 40),
        "info",
        0.6
      )
    );
  }

  return detections;
}
