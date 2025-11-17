import type { Nudge } from "../core/types";

export const NUDGE_CATALOG: Nudge[] = [
  {
    id: "clarify_request",
    title: "Clarify the ask",
    goal: "Actionability",
    trigger: "ambiguity",
    micro_copy: "State who, what, and when.",
    example_before_after: {
      before: "Can you handle it?",
      after: "@Alex, can you send the draft by Fri 5pm?"
    }
  },
  {
    id: "soften_blame",
    title: "Remove blame",
    goal: "Respect",
    trigger: "accusation_blame",
    micro_copy: "Remove blame—focus on the task, not the person.",
    example_before_after: {
      before: "You never sent the report.",
      after: "I’m missing the report—can you share it?"
    }
  },
  {
    id: "add_empathy",
    title: "Add empathy",
    goal: "Empathy",
    trigger: "missing_acknowledgment",
    micro_copy: "Add a brief acknowledgment before your request.",
    example_before_after: {
      before: "Send me the draft.",
      after: "Thanks for working on this — could you send me the draft?"
    }
  },
  {
    id: "remove_vagueness",
    title: "Replace vague terms",
    goal: "Clarity",
    trigger: "vague_time_or_action",
    micro_copy: "Replace vague terms with specific details.",
    example_before_after: {
      before: "Let’s do this soon.",
      after: "Let’s finalize this by tomorrow 5pm."
    }
  },
  {
    id: "reduce_hedging",
    title: "Reduce hedging",
    goal: "Clarity",
    trigger: "excessive_hedging",
    micro_copy: "Remove extra hedges so your message sounds clear and confident.",
    example_before_after: {
      before: "I think maybe we could possibly try updating it?",
      after: "We should update it."
    }
  },
  {
    id: "deescalate_tension",
    title: "De-escalate tension",
    goal: "Respect",
    trigger: "escalating_emotion",
    micro_copy: "Add a calming phrase to reduce tension.",
    example_before_after: {
      before: "This is getting ridiculous.",
      after: "Let’s slow down and sort this out together."
    }
  },
  {
    id: "polite_request",
    title: "Make it a polite request",
    goal: "Respect",
    trigger: "direct_imperative",
    micro_copy: "Turn a command into a polite request.",
    example_before_after: {
      before: "Send me the file.",
      after: "Could you send me the file when you get a moment?"
    }
  },
  {
    id: "split_overlong",
    title: "Split long sentence",
    goal: "Clarity",
    trigger: "long_sentence",
    micro_copy: "Break long sentences into two shorter points.",
    example_before_after: {
      before:
        "We need to finalize the proposal and update the metrics and prepare the slide deck.",
      after:
        "Let’s finalize the proposal first. Then update the metrics and prep the slide deck."
    }
  },
  {
    id: "replace_idiom",
    title: "Replace idiom",
    goal: "Clarity",
    trigger: "cultural_risk",
    micro_copy: "Swap idioms for neutral language that works globally.",
    example_before_after: {
      before: "Let's crush this meeting.",
      after: "Let's make this meeting a success."
    }
  }
];
