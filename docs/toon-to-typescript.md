# Toon → TypeScript Mapping

Toon files define:
- schemas
- signals
- nudges
- includes

Mapping rules:
- `schema X` → TS interface `X`
- `field a.b.c` → nested object `{ a: { b: { c: type }}}`
- `enum(...)` → TypeScript union type
- `nudge name:` → TS object in NudgeCatalog[]
- `include` → load and merge spec files

This mapping will be used by the future parser that generates TS types at build-time.
