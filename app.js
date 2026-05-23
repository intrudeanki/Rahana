import { useState, useEffect, useCallback } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import AuthPage from "@/components/AuthPage";
import ChatPage from "@/components/ChatPage";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("emochat_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("emochat_user");
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("emochat_user", JSON.stringify(userData));
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("emochat_user");
  }, []);

  if (loading) return null;

  return (
    <div className="App" data-testid="app-root">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <ChatPage api={API} user={user} onLogout={handleLogout} />
              ) : (
                <AuthPage api={API} onLogin={handleLogin} />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;