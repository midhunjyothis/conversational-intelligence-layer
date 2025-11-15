# SDK

Role:
- Provide a single entrypoint: `evaluateMessage()`
- Hide detectors, scorer, and nudge-engine internals
- Accept `MessageIn` and return `InsightsOut` (from Toon specs)
- Be usable in Node (backend) and React (frontend) apps

MVP API idea:
- `evaluateMessage(message: MessageIn): Promise<InsightsOut>`
