// SDK Entrypoint (MVP placeholder)

export async function evaluateMessage(message: any): Promise<any> {
  // TODO: integrate detectors → scorer → nudges
  return {
    mqs: 0,
    sub_scores: {},
    detections: [],
    nudges: [],
  };
}
