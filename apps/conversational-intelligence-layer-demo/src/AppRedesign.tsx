import React, { useState, useEffect } from "react";
import { evaluateMessage } from "../../../packages/sdk";
import type { MessageIn, InsightsOut } from "../../../packages/core/types";
import "./AppRedesign.css";

const defaultContext: MessageIn["context"] = {
    participants: ["You", "Other"],
    relationship: "peer",
    channel: "slack",
    locale: "en-US"
};

export const AppRedesign: React.FC = () => {
    const [text, setText] = useState("");
    const [insights, setInsights] = useState<InsightsOut | null>(null);
    const [loading, setLoading] = useState(false);
    const [showSuggestion, setShowSuggestion] = useState(false);

    const onEvaluate = async () => {
        if (!text.trim()) return;
        const message: MessageIn = { text, context: defaultContext };
        setLoading(true);
        try {
            const result = await evaluateMessage(message);
            setInsights(result);
            setShowSuggestion(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!text.trim()) {
            setShowSuggestion(false);
            setInsights(null);
            return;
        }

        const timer = setTimeout(() => {
            onEvaluate();
        }, 2000);

        return () => clearTimeout(timer);
    }, [text]);

    const applySuggestion = () => {
        if (insights?.suggested_rewrite) {
            setText(insights.suggested_rewrite);
            setShowSuggestion(false);
            setInsights(null);
        }
    };

    return (
        <div className="app-container">
            <div className="content-wrapper">

                <div className="hero">
                    <h1>Conversational Intelligence Layer</h1>
                    <p className="hero-subtitle">
                        Real-time communication coach that detects tone, clarity, and empathy before you hit send
                    </p>
                    <p className="hero-tagline">
                        Building a semantic-logic intelligence layer that converts conversations into structured meaning
                    </p>
                </div>

                <div className="chat-container">
                    {text && !showSuggestion && (
                        <div className="message-bubble">
                            {text}
                        </div>
                    )}

                    {showSuggestion && insights?.suggested_rewrite && (
                        <div style={{ marginBottom: '16px' }}>
                            <div className="message-bubble" style={{ opacity: 0.6 }}>
                                {text}
                            </div>

                            <div className="suggestions-container">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <span style={{ fontSize: '20px' }}>✨</span>
                                    <span style={{ fontWeight: '700', color: '#0a1929' }}>Suggested improvements</span>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                                    <div className="suggestion-chip">
                                        <span>💬</span> Change tone to polite
                                    </div>
                                    <div className="suggestion-chip">
                                        <span>✍️</span> Grammar correction
                                    </div>
                                    <div className="suggestion-chip">
                                        <span>🎯</span> Make simpler
                                    </div>
                                </div>

                                <div style={{
                                    background: '#f0f9ff',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    borderLeft: '4px solid #667eea',
                                    marginBottom: '16px'
                                }}>
                                    <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px', fontWeight: '600' }}>REWRITTEN MESSAGE:</div>
                                    <div style={{ fontSize: '15px', color: '#0a1929', lineHeight: '1.6' }}>
                                        {insights.suggested_rewrite}
                                    </div>
                                </div>

                                <button
                                    onClick={applySuggestion}
                                    style={{
                                        background: '#667eea',
                                        color: 'white',
                                        border: 'none',
                                        padding: '12px 24px',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        width: '100%'
                                    }}
                                >
                                    Apply Suggestion
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="input-area">
                        <textarea
                            className="message-input"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Type your message..."
                            rows={1}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (text.trim()) onEvaluate();
                                }
                            }}
                        />
                        <button
                            className="send-button"
                            onClick={onEvaluate}
                            disabled={loading || !text.trim()}
                        >
                            {loading ? "⏳" : "➤"}
                        </button>
                    </div>
                </div>

                {insights && (
                    <div style={{ background: 'white', borderRadius: '20px', padding: '32px', marginTop: '24px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Message Quality Score
                            </div>
                            <div style={{ fontSize: '64px', fontWeight: '700', color: '#667eea' }}>
                                {insights.mqs}
                            </div>
                            <div style={{ fontSize: '14px', color: '#999' }}>out of 100</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
                            {Object.entries(insights.sub_scores).map(([key, value]) => (
                                <div key={key} style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>
                                        {key}
                                    </div>
                                    <div style={{ fontSize: '28px', fontWeight: '600', color: '#667eea' }}>
                                        {value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AppRedesign;