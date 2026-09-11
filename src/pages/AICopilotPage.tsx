import React, { useState, useRef, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Brain,
  Send,
  Sparkles,
  BookOpen,
  Target,
  RefreshCw,
  User,
  Bot,
  CheckCircle2,
  ChevronRight,
  HelpCircle
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  followUps?: string[];
}

export const AICopilotPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      text: `Namaste **${user?.name || "Officer"}**! I am **SkillForge Copilot**, your dedicated AI learning mentor grounded in India's Official Statistical System.\n\nI have reviewed your competency profile:\n- **Department:** ${user?.department || "National Accounts Division"}\n- **Top Priority Gap:** National Accounts & GVA Estimation (Deficit: -28 pts)\n- **Secondary Gap:** Python for Microdata Processing\n\nHow can I support your capacity building today?`,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      followUps: [
        "Explain the Production Approach for Gross Value Added (GVA)",
        "What are my compliance requirements under DPDP Act 2023?",
        "Recommend an iGOT module to improve my Python microdata score",
        "Explain Multi-Stage Stratified Sampling in NSS rounds"
      ]
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || inputText).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const res = await api.chatWithCopilot(textToSend);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text: res.reply,
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        followUps: res.followUps
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error("Chat error", err);
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: "assistant",
        text: "I encountered an issue connecting to the statistical intelligence engine. Please try again or rephrase your inquiry.",
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Copilot Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 text-white flex items-center justify-center shadow-xs">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">SkillForge Copilot</h1>
              <span className="text-[10px] bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded font-mono">
                Gemini 3.8-Flash
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Context-Aware Statistical Assistant grounded in MoSPI, NSSTA & NQAF Frameworks
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: "msg-welcome-reset",
                sender: "assistant",
                text: "Chat session refreshed. How can I assist you with official statistical methodologies today?",
                timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
                followUps: [
                  "Explain the Production Approach for Gross Value Added (GVA)",
                  "What are my compliance requirements under DPDP Act 2023?"
                ]
              }
            ])
          }
          className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 p-1.5 rounded hover:bg-slate-100"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[560px]">
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === "user" ? "bg-[#0B2545] text-white" : "bg-cyan-100 text-cyan-800"
                }`}
              >
                {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-xl p-4 text-xs leading-relaxed space-y-2 ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white shadow-xs rounded-tr-none"
                    : "bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[10px] text-right font-mono ${
                    msg.sender === "user" ? "text-blue-200" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </div>

                {/* Optional Follow-up suggestion chips from Assistant */}
                {msg.followUps && msg.followUps.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Suggested Follow-Ups:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.followUps.map((fu, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(fu)}
                          className="text-[11px] bg-white hover:bg-blue-50 border border-slate-300 text-blue-900 px-2.5 py-1 rounded-md text-left transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>{fu}</span>
                          <ChevronRight className="w-3 h-3 text-blue-500 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Synthesizing statistical advisory...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Copilot about statistical formulas, DPDP Act compliance, or iGOT modules..."
              className="flex-1 text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
