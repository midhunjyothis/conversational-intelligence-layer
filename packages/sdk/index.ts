// SDK Entrypoint (MVP placeholder)

export async function evaluateMessage(message: any): Promise<any> {
  // placeholder pipeline
  const triggers = [];      // runDetectors(message.text)
  const scores = { mqs: 0, sub_scores: {} }; // scoreMessage(triggers)
  const nudges = [];        // selectNudges(triggers)

  return { ...scores, detections: triggers, nudges };
}

