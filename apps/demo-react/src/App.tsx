import React, { useState } from "react";
import { evaluateMessage } from "../../../packages/sdk";
import type { MessageIn, InsightsOut } from "../../../packages/core/types";

const defaultContext: MessageIn["context"] = {
  participants: ["You", "Other"],
  relationship: "peer",
  channel: "slack",
  locale: "en-US"
};

export const App: React.FC = () => {
  const [text, setText] = useState("");
  const [insights, setInsights] = useState<InsightsOut | null>(null);
  const [loading, setLoading] = useState(false);

  const onEvaluate = async () => {
    const message: MessageIn = {
      text,
      context: defaultContext
    };
    setLoading(true);
    try {
      const result = await evaluateMessage(message);
      setInsights(result);
    } finally {
      setLoading(false);
    }
  };

  const topNudge = insights?.nudges[0];

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Conversational Intelligence Demo</h1>

      {topNudge && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 8,
            marginBottom: 8,
            background: "#f7f7ff"
          }}
        >
          <strong>Hint:</strong> {topNudge.micro_copy}
        </div>
      )}

      <textarea
        rows={5}
        style={{ width: "100%", marginBottom: 8 }}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type a message (e.g. 'You never sent the report. I needed it yesterday!')"
      />

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onEvaluate} disabled={loading || !text.trim()}>
          {loading ? "Evaluating..." : "Check message"}
        </button>
      </div>

      {insights && (
        <div style={{ marginTop: 16 }}>
          <h3>Message Quality</h3>
          <p>
            MQS: <strong>{insights.mqs}</strong>
          </p>
          <ul>
            <li>Clarity: {insights.sub_scores.clarity}</li>
            <li>Respect: {insights.sub_scores.respect}</li>
            <li>Empathy: {insights.sub_scores.empathy}</li>
            <li>Specificity: {insights.sub_scores.specificity}</li>
            <li>Actionability: {insights.sub_scores.actionability}</li>
          </ul>

          <h3>Detections</h3>
          <ul>
            {insights.detections.map((d, idx) => (
              <li key={idx}>
                <strong>{d.type}</strong> ({d.severity}) — "{d.evidence}"
              </li>
            ))}
          </ul>

          {insights.suggested_rewrite && (
            <>
              <h3>Suggested Rewrite</h3>
              <p>{insights.suggested_rewrite}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
