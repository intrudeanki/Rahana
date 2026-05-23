import { Heart, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

const EMOTION_COLORS = {
  empathy: { bg: "rgba(232, 180, 184, 0.15)", border: "#E8B4B8", label: "Feeling empathetic" },
  joy: { bg: "rgba(226, 194, 117, 0.15)", border: "#E2C275", label: "Feeling joyful" },
  sadness: { bg: "rgba(181, 177, 203, 0.15)", border: "#B5B1CB", label: "Feeling compassionate" },
  logic: { bg: "rgba(168, 192, 206, 0.15)", border: "#A8C0CE", label: "Thinking clearly" },
  neutral: { bg: "rgba(139, 168, 136, 0.10)", border: "#8BA888", label: "Listening attentively" },
};

const AI_AVATAR_IMG = "https://images.pexels.com/photos/36078805/pexels-photo-36078805.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

export default function MessageBubble({ message, index }) {
  const isUser = message.role === "user";
  const emotion = message.emotion || "neutral";
  const emotionStyle = EMOTION_COLORS[emotion] || EMOTION_COLORS.neutral;

  return (
    <div
      className={`flex items-start gap-3 animate-fade-in-up ${isUser ? "flex-row-reverse" : ""}`}
      style={{ animationDelay: `${index * 0.05}s` }}
      data-testid={`message-bubble-${message.id}`}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="w-8 h-8 rounded-full bg-[#E3D5CA] flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-[#5C665A]" strokeWidth={1.5} />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-[#A8C0CE]/20">
          <img src={AI_AVATAR_IMG} alt="AI" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Bubble */}
      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`px-5 py-3.5 text-sm leading-relaxed ${
            isUser
              ? "rounded-2xl rounded-tr-sm bg-[#8BA888] text-white"
              : "rounded-2xl rounded-tl-sm shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
          }`}
          style={
            !isUser
              ? {
                  backgroundColor: emotionStyle.bg,
                  borderLeft: `2px solid ${emotionStyle.border}`,
                  color: "#2C332A",
                }
              : {}
          }
          data-testid={`message-content-${message.id}`}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none [&>p]:mb-1.5 [&>p:last-child]:mb-0">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>

        {/* Emotion tag for AI messages */}
        {!isUser && message.emotion && (
          <div
            className="flex items-center gap-1.5 mt-1.5 ml-1"
            data-testid={`emotion-tag-${message.id}`}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: emotionStyle.border }}
            />
            <span className="text-[10px] tracking-wide" style={{ color: "#8A9488" }}>
              {emotionStyle.label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}