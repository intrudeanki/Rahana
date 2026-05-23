import { Heart, Plus, Trash2, LogOut, MessageCircle } from "lucide-react";

export default function ChatSidebar({ conversations, activeConvoId, onSelect, onNewChat, onDelete, onLogout, userName }) {
  return (
    <div
      className="h-full flex flex-col bg-[#F3F1ED] border-r border-stone-200/50"
      data-testid="chat-sidebar"
    >
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-full bg-[#8BA888]/20 flex items-center justify-center">
            <Heart className="w-4 h-4 text-[#8BA888]" strokeWidth={1.5} />
          </div>
          <span
            className="text-xl tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2C332A" }}
          >
            EmoChat
          </span>
        </div>

        <button
          onClick={onNewChat}
          data-testid="new-chat-button"
          className="w-full py-3 rounded-full bg-[#8BA888] text-white text-sm font-medium flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-md transition-transform duration-300"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          New conversation
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1" data-testid="conversation-list">
        {conversations.length === 0 && (
          <div className="px-4 py-8 text-center">
            <MessageCircle className="w-8 h-8 mx-auto mb-3 text-[#8A9488]/40" strokeWidth={1.5} />
            <p className="text-xs" style={{ color: "#8A9488" }}>
              Start a conversation and<br />I'll be right here for you.
            </p>
          </div>
        )}
        {conversations.map((c) => (
          <div
            key={c.id}
            className={`group flex items-center rounded-xl cursor-pointer transition-colors duration-300 ${
              activeConvoId === c.id
                ? "bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                : "hover:bg-stone-200/50"
            }`}
            data-testid={`conversation-item-${c.id}`}
          >
            <button
              onClick={() => onSelect(c.id)}
              className="flex-1 text-left p-4 min-w-0"
              data-testid={`select-conversation-${c.id}`}
            >
              <p
                className="text-sm truncate mb-0.5"
                style={{ color: activeConvoId === c.id ? "#2C332A" : "#5C665A" }}
              >
                {c.title}
              </p>
              <p className="text-[10px]" style={{ color: "#8A9488" }}>
                {c.message_count} messages
              </p>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
              className="p-2 mr-2 opacity-0 group-hover:opacity-100 hover:text-[#D38C7D] transition-opacity duration-300"
              data-testid={`delete-conversation-${c.id}`}
            >
              <Trash2 className="w-3.5 h-3.5 text-[#8A9488]" strokeWidth={1.5} />
            </button>
          </div>
        ))}
      </div>

      {/* User footer */}
      <div className="p-4 border-t border-stone-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#E3D5CA] flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium" style={{ color: "#5C665A" }}>
                {userName?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <span className="text-sm truncate" style={{ color: "#5C665A" }}>
              {userName}
            </span>
          </div>
          <button
            onClick={onLogout}
            data-testid="logout-button"
            className="p-2 rounded-lg hover:bg-stone-200/50 transition-colors duration-300"
            title="Sign out"
          >
            <LogOut className="w-4 h-4 text-[#8A9488]" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}