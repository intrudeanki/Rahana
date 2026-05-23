import { useState, useRef, useEffect } from "react";
import { Send, Heart } from "lucide-react";
import MessageBubble from "@/components/MessageBubble";
import { motion } from "framer-motion";

const EMPTY_STATE_IMG = "https://images.unsplash.com/photo-1771644293343-9ce2fe03b840?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2OTV8MHwxfHNlYXJjaHwxfHxjYWxtJTIwYWJzdHJhY3QlMjB3YXRlcmNvbG9yfGVufDB8fHx8MTc3NDA4NzM1OXww&ixlib=rb-4.1.0&q=85";

export default function ChatArea({ messages, onSend, sending, activeConvoId }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeConvoId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative" data-testid="chat-area">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-0">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] px-8">
              <div className="relative mb-8">
                <img
                  src={EMPTY_STATE_IMG}
                  alt="Calm watercolor"
                  className="w-32 h-32 rounded-full object-cover opacity-30"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Heart className="w-10 h-10 text-[#8BA888]/60" strokeWidth={1} />
                </div>
              </div>
              <h2
                className="text-2xl mb-3 text-center"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2C332A" }}
                data-testid="empty-state-title"
              >
                I'm here whenever you're ready
              </h2>
              <p className="text-sm text-center max-w-sm" style={{ color: "#8A9488" }}>
                Share what's on your mind. I'll listen with empathy, respond with care, and walk alongside you through whatever you're feeling.
              </p>
              <div className="flex flex-wrap gap-2 mt-8 justify-center">
                {[
                  "How are you feeling today?",
                  "Tell me about yourself",
                  "I need someone to talk to",
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => onSend(prompt)}
                    data-testid={`suggestion-${i}`}
                    className="px-4 py-2.5 rounded-full bg-white border border-stone-200/50 text-sm hover:-translate-y-0.5 hover:shadow-md transition-transform duration-300"
                    style={{ color: "#5C665A" }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {messages.map((msg, idx) => (
                <MessageBubble key={msg.id || idx} message={msg} index={idx} />
              ))}
              {sending && (
                <div className="flex items-start gap-3 animate-fade-in-up">
                  <div className="w-8 h-8 rounded-full bg-[#A8C0CE]/30 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-[#8BA888]" strokeWidth={1.5} />
                  </div>
                  <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#8BA888] animate-breathe" style={{ animationDelay: "0s" }} />
                      <div className="w-2 h-2 rounded-full bg-[#8BA888] animate-breathe" style={{ animationDelay: "0.3s" }} />
                      <div className="w-2 h-2 rounded-full bg-[#8BA888] animate-breathe" style={{ animationDelay: "0.6s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="px-4 pb-6 pt-2 lg:px-0">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="relative flex items-center bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-stone-200/50"
          >
            <input
              ref={inputRef}
              data-testid="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share what's on your mind..."
              className="flex-1 px-6 py-4 bg-transparent text-sm focus:outline-none placeholder:text-[#8A9488]/60"
              style={{ color: "#2C332A" }}
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              data-testid="send-message-button"
              className="mr-2 p-2.5 rounded-full bg-[#8BA888] text-white disabled:opacity-30 hover:-translate-y-0.5 transition-transform duration-300 flex items-center justify-center"
            >
              <Send className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}