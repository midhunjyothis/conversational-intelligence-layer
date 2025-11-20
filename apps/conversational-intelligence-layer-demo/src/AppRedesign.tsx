import React, { useState, useEffect, useRef, useCallback } from "react";
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
    const [error, setError] = useState<string | null>(null);

    const abortControllerRef = useRef<AbortController | null>(null);
    const evaluationCountRef = useRef(0);

    const isCasualGreeting = useCallback((message: string): boolean => {
        const lowerText = message.trim().toLowerCase();
        const casualPhrases = [
            'hi', 'hey', 'hello', 'thanks', 'thank you', 'ok', 'okay', 'sure',
            'yes', 'no', 'good', 'great', 'awesome', 'fine', 'noted',
            'hi how are you', 'hello how are you', 'hey how are you',
            'how are you', 'hows it going', 'whats up', 'got it', 'will do', 'done'
        ];

        return casualPhrases.some(phrase =>
            lowerText === phrase ||
            lowerText.startsWith(phrase + ' ') ||
            lowerText.startsWith(phrase + '?')
        );
    }, []);

    const onEvaluate = useCallback(async (textToEvaluate: string) => {
        if (!textToEvaluate.trim()) return;

        // Skip casual greetings
        if (isCasualGreeting(textToEvaluate)) {
            setShowSuggestion(false);
            setInsights(null);
            setError(null);
            return;
        }

        // Cancel any pending evaluation
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const currentEvaluation = ++evaluationCountRef.current;
        const message: MessageIn = { text: textToEvaluate, context: defaultContext };

        setLoading(true);
        setError(null);

        try {
            const result = await evaluateMessage(message);

            // Ignore if this is not the latest evaluation
            if (currentEvaluation !== evaluationCountRef.current) {
                return;
            }

            // Only show suggestions if MQS is below 85 or there are actual issues
            if (result.mqs < 85 || result.detections.length > 0) {
                setInsights(result);
                setShowSuggestion(true);
            } else {
                setInsights(result);
                setShowSuggestion(false);
            }
        } catch (err) {
            // Ignore if this is not the latest evaluation
            if (currentEvaluation !== evaluationCountRef.current) {
                return;
            }

            console.error('Evaluation error:', err);
            setError('Failed to analyze message. Please try again.');
            setInsights(null);
            setShowSuggestion(false);
        } finally {
            if (currentEvaluation === evaluationCountRef.current) {
                setLoading(false);
            }
        }
    }, [isCasualGreeting]);

    useEffect(() => {
        // Clear suggestions when text is empty
        if (!text.trim()) {
            setShowSuggestion(false);
            setInsights(null);
            setError(null);
            return;
        }

        // Hide suggestions while typing
        setShowSuggestion(false);

        const timer = setTimeout(() => {
            onEvaluate(text);
        }, 2500);

        return () => clearTimeout(timer);
    }, [text, onEvaluate]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const applySuggestion = () => {
        if (insights?.suggested_rewrite) {
            setText(insights.suggested_rewrite);
            setShowSuggestion(false);
            setInsights(null);
            setError(null);
        }
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        setError(null);
    };

    return (
        <div className="app-container">
            <div className="content-wrapper">

                <div className="hero">
                    <h1>Conversational Intelligence Layer</h1>
                    <p className="hero-subtitle">
                        Professional communication coach that detects tone, clarity, and empathy in workplace messages
                    </p>
                    <p className="hero-tagline">
                        Building a semantic-logic intelligence layer that converts conversations into structured meaning
                    </p>
                </div>

                <div className="chat-container">
                    {text && !showSuggestion && !error && (
                        <div className="message-bubble">
                            {text}
                        </div>
                    )}

                    {error && (
                        <div style={{
                            padding: '16px',
                            background: '#fee',
                            borderLeft: '4px solid #f44336',
                            borderRadius: '8px',
                            marginBottom: '16px',
                            color: '#c62828'
                        }}>
                            {error}
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

                                {insights.detections.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                                        {insights.detections.map((detection, idx) => (
                                            <div key={idx} className="suggestion-chip">
                                                <span>
                                                    {detection.type.includes('tone') && '💬'}
                                                    {detection.type.includes('clarity') && '🔍'}
                                                    {detection.type.includes('empathy') && '❤️'}
                                                    {detection.type.includes('grammar') && '✍️'}
                                                    {!detection.type.includes('tone') && !detection.type.includes('clarity') && !detection.type.includes('empathy') && !detection.type.includes('grammar') && '⚠️'}
                                                </span>
                                                {detection.type.replace(/_/g, ' ')}
                                            </div>
                                        ))}
                                    </div>
                                )}

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
                            onChange={handleTextChange}
                            placeholder="Type your professional message here..."
                            rows={1}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    if (text.trim() && !loading) {
                                        onEvaluate(text);
                                    }
                                }
                            }}
                        />
                        <button
                            className="send-button"
                            onClick={() => onEvaluate(text)}
                            disabled={loading || !text.trim()}
                            aria-label="Analyze message"
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
                            <div style={{
                                fontSize: '64px',
                                fontWeight: '700',
                                color: insights.mqs >= 85 ? '#4caf50' : insights.mqs >= 70 ? '#667eea' : '#ff9800'
                            }}>
                                {insights.mqs}
                            </div>
                            <div style={{ fontSize: '14px', color: '#999' }}>
                                {insights.mqs >= 85 ? 'Excellent communication' : insights.mqs >= 70 ? 'Good, minor improvements suggested' : 'Needs improvement'}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                            {Object.entries(insights.sub_scores).map(([key, value]) => (
                                <div key={key} style={{ textAlign: 'center', padding: '16px', background: '#f8f9fa', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>
                                        {key}
                                    </div>
                                    <div style={{ fontSize: '28px', fontWeight: '600', color: value >= 80 ? '#4caf50' : value >= 65 ? '#667eea' : '#ff9800' }}>
                                        {value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {insights.detections.length > 0 && (
                            <div style={{ marginTop: '24px' }}>
                                <h3 style={{ fontSize: '16px', marginBottom: '12px', color: '#666' }}>Issues Detected</h3>
                                {insights.detections.map((detection, idx) => (
                                    <div key={idx} style={{
                                        padding: '12px',
                                        marginBottom: '8px',
                                        background: '#fff3cd',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        color: '#856404'
                                    }}>
                                        <strong>{detection.type.replace(/_/g, ' ')}</strong>: "{detection.evidence}"
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Vision & Roadmap */}
                <div style={{ marginTop: '48px', padding: '40px 32px', background: 'rgba(255,255,255,0.15)', borderRadius: '20px', color: 'white', backdropFilter: 'blur(10px)' }}>
                    <h2 style={{ fontSize: '28px', marginBottom: '16px', textAlign: 'center', fontWeight: '700' }}>Building the Future of Professional Communication</h2>
                    <p style={{ fontSize: '15px', lineHeight: '1.8', textAlign: 'center', opacity: 0.9, maxWidth: '650px', margin: '0 auto 32px' }}>
                        A <strong>semantic intelligence layer</strong> that transforms workplace conversations into structured meaning, shared context, and actionable clarity.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                            <h3 style={{ fontSize: '16px', marginBottom: '10px', fontWeight: '600' }}>Current: Real-time Detection</h3>
                            <p style={{ fontSize: '13px', opacity: 0.9, lineHeight: '1.6' }}>Sub-150ms latency for tone, clarity, and empathy analysis</p>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                            <h3 style={{ fontSize: '16px', marginBottom: '10px', fontWeight: '600' }}>Next: Context Intelligence</h3>
                            <p style={{ fontSize: '13px', opacity: 0.9, lineHeight: '1.6' }}>Team-aware assistant that understands intent and alignment</p>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                            <h3 style={{ fontSize: '16px', marginBottom: '10px', fontWeight: '600' }}>Vision: Organizational OS</h3>
                            <p style={{ fontSize: '13px', opacity: 0.9, lineHeight: '1.6' }}>Convert dialog into narrative, plans, and intelligent dashboards</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AppRedesign;