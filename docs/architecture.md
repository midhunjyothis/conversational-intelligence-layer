# Architecture Overview

- Toon specs → canonical source of truth
- Parser → converts Toon into TS types + rules
- Detectors → map text → signals
- Scorer → compute MQS + sub-scores
- Nudge Engine → map triggers → rewrites
- SDK → expose evaluateMessage()
- UI Layer → inline hints + dashboards
