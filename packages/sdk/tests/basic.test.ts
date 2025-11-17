import { evaluateMessage } from "../index";

(async () => {
  console.log(await evaluateMessage({
    text: "You never sent the report. Let's do this soon.",
    context: { participants: ["a","b"], relationship:"peer", channel:"slack" }
  }));
})();
