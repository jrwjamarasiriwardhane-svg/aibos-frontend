import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Bot,
  X,
  Send,
  Loader2,
  Zap,
  MapPin,
  Star,
  ChevronDown,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  suggestions?: string[];
  recommendations?: Recommendation[];
  timestamp: Date;
}

interface Recommendation {
  id: string;
  name: string;
  role?: string;
  skills?: string[];
  location: string;
  rating: number;
  hourlyRate?: string;
  type: "professional" | "travel";
}

const API_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "ai",
  text: "👋 **Hi! I'm AIBOS AI Assistant!**\n\nI can help you:\n- 🔍 Find verified professionals (Electricians, Plumbers, Developers...)\n- ✈️ Plan custom travel packages & itineraries\n- 📋 Guide you through registration & booking\n\nWhat can I help you with today?",
  suggestions: [
    "Find Electrician in Colombo",
    "Plan 3-day Ella Trip",
    "How to Register?",
    "Travel Agencies Near Me",
  ],
  timestamp: new Date(),
};

export default function AiChatWidget() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ==============================
  // DETECT IF USER IS LOGGED IN
  // ==============================
  const PUBLIC_ROUTES = [
    "/",
    "/customer/login",
    "/customer/register",
    "/professional/login",
    "/professional/register",
    "/company/login",
    "/company/register",
    "/admin/login",
    "/verify-email",
    "/auth/verify-email",
    "/forgot-password",
  ];

  const isPublicPage = PUBLIC_ROUTES.some(
    (route) => location.pathname === route
  );

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (open && !minimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, minimized]);

  // Focus input when opened
  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open, minimized]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Get token from localStorage (set during login)
      const token = localStorage.getItem("token") || localStorage.getItem("aibos_token") || "";

      const res = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: text.trim(),
          // Tell backend whether this is a public or private context
          mode: isPublicPage ? "public" : "private",
        }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: data.reply || "I'm sorry, I couldn't understand that. Please try again.",
        suggestions: data.suggestions || [],
        recommendations: data.recommendations || [],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: "⚠️ I'm having trouble connecting to the server. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const renderText = (text: string) => {
    // Simple bold markdown rendering
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j}>{part.slice(2, -2)}</strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <>
      {/* ==============================
          FLOATING BUTTON
      ============================== */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          id="ai-chat-open-btn"
          className="ai-chat-fab"
          aria-label="Open AI Assistant"
        >
          <div className="ai-chat-fab-pulse" />
          <Bot size={26} />
          <span className="ai-chat-fab-label">AI Assistant</span>
        </button>
      )}

      {/* ==============================
          CHAT WINDOW
      ============================== */}
      {open && (
        <div className={`ai-chat-window ${minimized ? "ai-chat-minimized" : ""}`}>
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-header-left">
              <div className="ai-chat-avatar">
                <Bot size={18} />
                <span className="ai-chat-avatar-dot" />
              </div>
              <div>
                <p className="ai-chat-header-title">AIBOS AI Assistant</p>
                <p className="ai-chat-header-status">
                  {loading ? "Thinking..." : "Online • Always Ready"}
                </p>
              </div>
            </div>
            <div className="ai-chat-header-actions">
              <button
                onClick={() => setMinimized((v) => !v)}
                className="ai-chat-icon-btn"
                aria-label="Minimize"
              >
                <ChevronDown
                  size={18}
                  style={{
                    transform: minimized ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                  }}
                />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="ai-chat-icon-btn"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          {!minimized && (
            <>
              <div className="ai-chat-body" id="ai-chat-messages">
                {messages.map((msg) => (
                  <div key={msg.id} className={`ai-msg-row ${msg.role}`}>
                    {/* AI Avatar */}
                    {msg.role === "ai" && (
                      <div className="ai-msg-bot-avatar">
                        <Bot size={14} />
                      </div>
                    )}

                    <div className={`ai-msg-bubble ${msg.role}`}>
                      <p className="ai-msg-text">{renderText(msg.text)}</p>

                      {/* Recommendation Cards */}
                      {msg.recommendations && msg.recommendations.length > 0 && (
                        <div className="ai-rec-grid">
                          {msg.recommendations.map((rec) => (
                            <div key={rec.id} className="ai-rec-card">
                              <div className="ai-rec-card-top">
                                <div className="ai-rec-avatar">
                                  {rec.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="ai-rec-name">{rec.name}</p>
                                  <p className="ai-rec-role">
                                    {rec.role ||
                                      (rec.skills && rec.skills[0]) ||
                                      "Specialist"}
                                  </p>
                                </div>
                              </div>
                              <div className="ai-rec-card-meta">
                                <span className="ai-rec-meta-item">
                                  <MapPin size={11} />
                                  {rec.location}
                                </span>
                                <span className="ai-rec-meta-item">
                                  <Star size={11} />
                                  {rec.rating.toFixed(1)}
                                </span>
                                {rec.hourlyRate && (
                                  <span className="ai-rec-meta-item ai-rec-rate">
                                    {rec.hourlyRate}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Suggestion Chips */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="ai-chips">
                          {msg.suggestions.map((s) => (
                            <button
                              key={s}
                              className="ai-chip"
                              onClick={() => sendMessage(s)}
                            >
                              <Zap size={10} />
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="ai-msg-row ai">
                    <div className="ai-msg-bot-avatar">
                      <Bot size={14} />
                    </div>
                    <div className="ai-msg-bubble ai ai-typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="ai-chat-input-area">
                <input
                  ref={inputRef}
                  id="ai-chat-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything... (e.g. Find plumber in Galle)"
                  className="ai-chat-input"
                  disabled={loading}
                />
                <button
                  id="ai-chat-send-btn"
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="ai-chat-send-btn"
                  aria-label="Send message"
                >
                  {loading ? (
                    <Loader2 size={16} className="ai-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ==============================
          STYLES
      ============================== */}
      <style>{`
        /* FAB Button */
        .ai-chat-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 20px;
          background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(37,99,235,0.45);
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        .ai-chat-fab:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 12px 40px rgba(37,99,235,0.55);
        }
        .ai-chat-fab-pulse {
          position: absolute;
          inset: 0;
          border-radius: 50px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          animation: aibos-pulse 2s ease-in-out infinite;
          z-index: -1;
        }
        @keyframes aibos-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.12); opacity: 0; }
        }
        .ai-chat-fab-label { letter-spacing: 0.01em; }

        /* Chat Window */
        .ai-chat-window {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          width: 380px;
          max-width: calc(100vw - 32px);
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(37,99,235,0.12);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: ai-window-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
          border: 1.5px solid rgba(37,99,235,0.1);
        }
        @keyframes ai-window-in {
          from { transform: scale(0.7) translateY(40px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .ai-chat-minimized {
          height: auto !important;
        }

        /* Header */
        .ai-chat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: linear-gradient(135deg, #1e40af 0%, #6d28d9 100%);
          color: white;
          flex-shrink: 0;
        }
        .ai-chat-header-left { display: flex; align-items: center; gap: 10px; }
        .ai-chat-avatar {
          position: relative;
          width: 36px; height: 36px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }
        .ai-chat-avatar-dot {
          position: absolute;
          bottom: 1px; right: 1px;
          width: 9px; height: 9px;
          background: #22c55e;
          border-radius: 50%;
          border: 2px solid #1e40af;
        }
        .ai-chat-header-title { font-weight: 700; font-size: 14px; margin: 0; line-height: 1.2; }
        .ai-chat-header-status { font-size: 11px; opacity: 0.8; margin: 0; }
        .ai-chat-header-actions { display: flex; gap: 4px; }
        .ai-chat-icon-btn {
          width: 30px; height: 30px;
          background: rgba(255,255,255,0.15);
          border: none; border-radius: 8px;
          color: white; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
        }
        .ai-chat-icon-btn:hover { background: rgba(255,255,255,0.3); }

        /* Body */
        .ai-chat-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 380px;
          background: #f8fafc;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        /* Messages */
        .ai-msg-row {
          display: flex;
          gap: 8px;
          align-items: flex-end;
        }
        .ai-msg-row.user { flex-direction: row-reverse; }
        .ai-msg-bot-avatar {
          width: 28px; height: 28px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        .ai-msg-bubble {
          max-width: 82%;
          padding: 10px 13px;
          border-radius: 16px;
          font-size: 13.5px;
          line-height: 1.55;
        }
        .ai-msg-bubble.ai {
          background: white;
          color: #1e293b;
          border-bottom-left-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.07);
        }
        .ai-msg-bubble.user {
          background: linear-gradient(135deg, #2563eb, #6d28d9);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .ai-msg-text { margin: 0; white-space: pre-wrap; }

        /* Typing indicator */
        .ai-typing {
          display: flex;
          gap: 4px;
          align-items: center;
          padding: 12px 16px !important;
        }
        .ai-typing span {
          width: 7px; height: 7px;
          background: #94a3b8;
          border-radius: 50%;
          animation: ai-bounce 1.2s ease-in-out infinite;
        }
        .ai-typing span:nth-child(2) { animation-delay: 0.15s; }
        .ai-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes ai-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }

        /* Recommendation Cards */
        .ai-rec-grid {
          display: flex;
          flex-direction: column;
          gap: 7px;
          margin-top: 10px;
        }
        .ai-rec-card {
          background: #f1f5f9;
          border-radius: 10px;
          padding: 9px 11px;
          border: 1px solid #e2e8f0;
          transition: border-color 0.2s;
        }
        .ai-rec-card:hover { border-color: #93c5fd; }
        .ai-rec-card-top { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
        .ai-rec-avatar {
          width: 30px; height: 30px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: white;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 13px;
          flex-shrink: 0;
        }
        .ai-rec-name { font-size: 12.5px; font-weight: 600; color: #1e293b; margin: 0; }
        .ai-rec-role { font-size: 11px; color: #64748b; margin: 0; }
        .ai-rec-card-meta { display: flex; gap: 8px; flex-wrap: wrap; }
        .ai-rec-meta-item {
          display: flex; align-items: center; gap: 3px;
          font-size: 11px; color: #64748b;
        }
        .ai-rec-rate { color: #16a34a; font-weight: 600; }

        /* Chips */
        .ai-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 10px;
        }
        .ai-chip {
          display: flex; align-items: center; gap: 4px;
          padding: 4px 10px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 20px;
          color: #2563eb;
          font-size: 11.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }
        .ai-chip:hover {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        /* Input Area */
        .ai-chat-input-area {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          background: white;
          border-top: 1.5px solid #f1f5f9;
          flex-shrink: 0;
        }
        .ai-chat-input {
          flex: 1;
          padding: 10px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 13.5px;
          outline: none;
          background: #f8fafc;
          color: #1e293b;
          font-family: inherit;
          transition: border-color 0.2s;
        }
        .ai-chat-input:focus { border-color: #2563eb; background: white; }
        .ai-chat-input::placeholder { color: #94a3b8; }
        .ai-chat-send-btn {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          border: none;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .ai-chat-send-btn:hover:not(:disabled) { transform: scale(1.08); }
        .ai-chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .ai-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
