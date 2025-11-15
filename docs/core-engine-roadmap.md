# Core Engine Roadmap

- [ ] Parse Toon specs → internal TypeScript types
- [ ] Implement detectors for each `trigger`
- [ ] Map `signals` → MQS sub-scores
- [ ] Map `trigger` → `nudge` selection logic
- [ ] Expose `evaluateMessage()` SDK entrypoint

## Package roles (mental model)

- core: contracts, Toon specs, shared types
- detectors: rules/regex/model hooks that emit signals
- nudge-engine: maps triggers → nudges + rewrites
- scorer: turns signals into MQS + sub-scores
- sdk: public API (evaluateMessage) used by apps/adapters
