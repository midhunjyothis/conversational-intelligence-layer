import { evaluateMessage } from "../packages/sdk";

async function main() {
  const text = process.argv.slice(2).join(" ") || "You never sent the report. Let's do this soon.";
  const result = await evaluateMessage({
    text,
    context: { participants: ["you", "other"], relationship: "peer", channel: "slack" }
  });
  console.dir(result, { depth: null });
}

main();
