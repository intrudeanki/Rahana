import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ChatSidebar from "@/components/ChatSidebar";
import ChatArea from "@/components/ChatArea";
import EmotionPanel from "@/components/EmotionPanel";
import { Menu, X, BarChart3 } from "lucide-react";

export default function ChatPage({ api, user, onLogout }) {
  const [conversations, setConversations] = useState([]);
  const [activeConvoId, setActiveConvoId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [emotionData, setEmotionData] = useState(null);
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emotionPanelOpen, setEmotionPanelOpen] = useState(false);

  const headers = { Authorization: `Bearer ${user.token}` };

  const loadConversations = useCallback(async () => {
    try {
      const { data } = await axios.get(`${api}/conversations`, { headers });
      setConversations(data);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  }, [api]);

  const loadMessages = useCallback(async (convoId) => {
    try {
      const { data } = await axios.get(`${api}/conversations/${convoId}/messages`, { headers });
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  }, [api]);

  const loadEmotions = useCallback(async (convoId) => {
    try {
      const { data } = await axios.get(`${api}/conversations/${convoId}/emotions`, { headers });
      setEmotionData(data);
    } catch (err) {
      console.error("Failed to load emotions:", err);
    }
  }, [api]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (activeConvoId) {
      loadMessages(activeConvoId);
      loadEmotions(activeConvoId);
    }
  }, [activeConvoId, loadMessages, loadEmotions]);

  const handleSelectConvo = (convoId) => {
    setActiveConvoId(convoId);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    setActiveConvoId(null);
    setMessages([]);
    setEmotionData(null);
    setSidebarOpen(false);
  };

  const handleDeleteConvo = async (convoId) => {
    try {
      await axios.delete(`${api}/conversations/${convoId}`, { headers });
      if (activeConvoId === convoId) {
        setActiveConvoId(null);
        setMessages([]);
        setEmotionData(null);
      }
      loadConversations();
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || sending) return;
    setSending(true);

    const tempUserMsg = {
      id: "temp-user-" + Date.now(),
      role: "user",
      content: text,
      emotion: null,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const { data } = await axios.post(
        `${api}/chat`,
        { conversation_id: activeConvoId || null, message: text },
        { headers }
      );

      if (!activeConvoId) {
        setActiveConvoId(data.conversation_id);
      }

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempUserMsg.id);
        return [...filtered, data.user_message, data.ai_message];
      });

      loadConversations();
      if (data.conversation_id) {
        loadEmotions(data.conversation_id);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-screen flex bg-[#F9F8F6]" data-testid="chat-page">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative z-40 lg:z-auto h-full transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ width: "270px", minWidth: "270px" }}
      >
        <ChatSidebar
          conversations={conversations}
          activeConvoId={activeConvoId}
          onSelect={handleSelectConvo}
          onNewChat={handleNewChat}
          onDelete={handleDeleteConvo}
          onLogout={onLogout}
          userName={user.name}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <div className="flex items-center justify-between px-4 py-3 lg:hidden border-b border-stone-200/50">
          <button
            onClick={() => setSidebarOpen(true)}
            data-testid="mobile-sidebar-toggle"
            className="p-2 rounded-xl hover:bg-stone-100 transition-colors duration-300"
          >
            <Menu className="w-5 h-5 text-[#5C665A]" strokeWidth={1.5} />
          </button>
          <span className="text-lg" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2C332A" }}>
            EmoChat
          </span>
          <button
            onClick={() => setEmotionPanelOpen(!emotionPanelOpen)}
            data-testid="mobile-emotion-toggle"
            className="p-2 rounded-xl hover:bg-stone-100 transition-colors duration-300"
          >
            <BarChart3 className="w-5 h-5 text-[#5C665A]" strokeWidth={1.5} />
          </button>
        </div>

        <ChatArea
          messages={messages}
          onSend={handleSendMessage}
          sending={sending}
          activeConvoId={activeConvoId}
        />
      </div>

      {/* Emotion panel - desktop */}
      <div className="hidden lg:block" style={{ width: "300px", minWidth: "300px" }}>
        <EmotionPanel data={emotionData} />
      </div>

      {/* Emotion panel - mobile */}
      {emotionPanelOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => setEmotionPanelOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 z-40 lg:hidden" style={{ width: "300px" }}>
            <div className="relative h-full">
              <button
                onClick={() => setEmotionPanelOpen(false)}
                className="absolute top-4 right-4 z-50 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors duration-300"
                data-testid="close-emotion-panel"
              >
                <X className="w-4 h-4 text-[#5C665A]" strokeWidth={1.5} />
              </button>
              <EmotionPanel data={emotionData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}