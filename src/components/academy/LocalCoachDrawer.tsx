/* ===================================================================
   ANOXPASS — Self-Hosted Open-Weights Local AI Coach Drawer
   Supports 4 coaching modes with Python RAG -> Ollama -> Offline fallback.
   =================================================================== */

import { useState, useEffect, useRef } from 'react';
import {
  askLocalCoach,
  checkLocalCoachHealth,
  COACH_MODE_CONFIG,
  type LocalCoachHealth,
  type LocalCoachMode,
  type LocalCoachSource,
} from '../../lib/ai/localCoachService';
import { EditorialMarkdown } from '../common/EditorialMarkdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  engine?: string;
  sources?: LocalCoachSource[];
}

interface LocalCoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: LocalCoachMode;
  initialPrompt?: string;
  contextDomain?: string;
}

const MODE_ICONS: Record<LocalCoachMode, string> = {
  exam_proctor: '🎯',
  speech_coach: '🎙️',
  reading_coach: '📖',
  leadership_mentor: '🏆',
};

export function LocalCoachDrawer({
  isOpen,
  onClose,
  initialMode = 'exam_proctor',
  initialPrompt,
  contextDomain,
}: LocalCoachDrawerProps) {
  const [mode, setMode] = useState<LocalCoachMode>(initialMode);
  const [health, setHealth] = useState<LocalCoachHealth | null>(null);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (isOpen) {
      checkLocalCoachHealth().then(setHealth).catch(() => {});
      if (initialPrompt) {
        setInput(initialPrompt);
      }
    }
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) return null;

  const config = COACH_MODE_CONFIG[mode];

  async function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const res = await askLocalCoach({
        mode,
        message: trimmed,
        domain: contextDomain,
      });
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'ai',
        text: res.response,
        engine: res.engine,
        sources: res.sources,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'ai',
          text: 'Local AI Coach encountered an error. Ensure Ollama or `python local_ai_pipeline.py --serve` is running, or try again for offline coaching.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="coach-overlay" role="dialog" aria-modal="true" aria-label="Local Open-Weights AI Coach">
      <div className="coach-drawer">
        <div className="coach-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem' }}>{MODE_ICONS[mode]}</span>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                {config.title}
              </h3>
            </div>
            <div style={{ fontSize: '11px', opacity: 0.85, marginTop: '2px' }}>
              100% Open-Weights Local AI ·{' '}
              {health?.activeEngine === 'python-rag-bridge'
                ? `RAG Bridge (${health.ragChunks} chunks)`
                : health?.activeEngine === 'ollama-direct'
                ? 'Ollama Local'
                : 'Offline Deterministic Engine'}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ color: '#fff', fontSize: '1.1rem', padding: '4px 10px' }}
            aria-label="Close AI Coach"
          >
            ✕
          </button>
        </div>

        <div className="coach-modes">
          {(Object.keys(COACH_MODE_CONFIG) as LocalCoachMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`coach-mode-btn ${mode === m ? 'active' : ''}`}
            >
              <span>{MODE_ICONS[m]}</span>
              <span>{COACH_MODE_CONFIG[m].title}</span>
            </button>
          ))}
        </div>

        <div className="coach-messages" ref={scrollRef}>
          {messages.length === 0 && (
            <div className="coach-bubble coach-bubble--ai">
              <strong>{config.title}</strong> ({config.badge})
              {'\n\n'}
              {config.subtitle}
              {'\n\n'}
              Tip: Run <code>python local_ai_pipeline.py --serve</code> with Ollama for full RAG over your <code>my_documents/</code> library, or chat right now with the built-in offline engine.
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`coach-bubble ${
                msg.role === 'user' ? 'coach-bubble--user' : 'coach-bubble--ai'
              }`}
            >
              {msg.role === 'ai' ? (
                <EditorialMarkdown content={msg.text} compact />
              ) : (
                <div>{msg.text}</div>
              )}
              {msg.engine && (
                <div style={{ fontSize: '10px', opacity: 0.65, marginTop: '6px' }}>
                  Engine: {msg.engine}
                  {msg.sources && msg.sources.length > 0 && (
                    <> · Sources: {msg.sources.map((s) => s.document_name || s.certification_code).filter(Boolean).join(', ')}</>
                  )}
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="coach-bubble coach-bubble--ai" style={{ opacity: 0.7 }}>
              Thinking locally...
            </div>
          )}
        </div>

        <form className="coach-input-bar" onSubmit={handleSend}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={config.placeholder}
            disabled={isSending}
          />
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={isSending || !input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default LocalCoachDrawer;
