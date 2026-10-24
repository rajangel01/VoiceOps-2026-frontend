
import { useEffect, useRef, useState } from "react";
import "./App.css";

const API_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

const suggestions = [
  { icon: "↻", text: "Return policy" },
  { icon: "📦", text: "Track my order" },
  { icon: "🏷️", text: "Current discounts" },
  { icon: "💳", text: "Payment methods" },
];

function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi there! 👋 Welcome to ZentroMart Support. I'm your AI assistant. How can I help you today?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text = input) {
    const question = text.trim();
    if (!question || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: question, time: new Date() },
    ]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      if (!API_URL) {
        throw new Error(
          "API URL missing. Please configure VITE_API_BASE_URL in .env.local."
        );
      }

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || `Support service returned error ${response.status}.`
        );
      }

      const answer =
        data.answer ||
        data.response ||
        data.message ||
        "Sorry, I couldn't find a response. Please try again.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: answer, time: new Date() },
      ]);
    } catch (err) {
      setError(err.message || "Unable to connect to the support service.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  function formatTime(date) {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  return (
    <div className="zm-app">
      <header className="zm-navbar">
        <a className="zm-brand" href="#home" aria-label="ZentroMart home">
          <span className="zm-brand-icon">Z</span>
          <span>ZentroMart</span>
        </a>

        <div className="zm-nav-divider" />

        <div className="zm-nav-status">
          <span className="zm-online-dot" />
          AI Support
        </div>

        <nav className="zm-nav-links">
          <a href="#home">Home</a>
          <a href="#shop">Shop</a>
          <a className="zm-active-link" href="#support">
            Support
          </a>
        </nav>

        <div className="zm-avatar">Z</div>
      </header>

      <main className="zm-main" id="support">
        <section className="zm-intro">
          <div className="zm-intro-copy">
            <span className="zm-eyebrow">
              <span className="zm-sparkle">✦</span> YOUR PERSONAL SHOPPING
              ASSISTANT
            </span>
            <h1>
              How can we <span>help you</span> today?
            </h1>
            <p>
              Questions about orders, products or returns? Let's get things
              sorted out together.
            </p>
          </div>

          <div className="zm-intro-decoration" aria-hidden="true">
            <div className="zm-orbit zm-orbit-one" />
            <div className="zm-orbit zm-orbit-two" />
            <div className="zm-hero-icon">✦</div>
            <div className="zm-hero-bubble">Hey! Need a hand? 👋</div>
          </div>
        </section>

        <section className="zm-chat-card" aria-label="AI support chat">
          <div className="zm-chat-header">
            <div className="zm-assistant-avatar">
              <span>Z</span>
              <i />
            </div>

            <div className="zm-assistant-info">
              <h2>ZentroMart Assistant</h2>
              <p>
                <span className="zm-online-dot" />
                Here to help you
              </p>
            </div>

            <div className="zm-header-right">
              <span className="zm-secure-icon">✓</span>
              <span>AI-powered support</span>
              <button
                className="zm-reset-button"
                type="button"
                title="Start a new conversation"
                aria-label="Start a new conversation"
                onClick={() => {
                  setMessages([
                    {
                      role: "assistant",
                      text: "Hi there! 👋 Welcome to ZentroMart Support. How can I help you today?",
                      time: new Date(),
                    },
                  ]);
                  setError("");
                }}
              >
                ↻
              </button>
            </div>
          </div>

          <div className="zm-chat-body">
            <div className="zm-date-divider">
              <span>YOUR CONVERSATION</span>
            </div>

            <div className="zm-messages">
              {messages.map((message, index) => (
                <div
                  className={`zm-message-row ${
                    message.role === "user" ? "zm-user-row" : "zm-bot-row"
                  }`}
                  key={`${index}-${message.role}`}
                >
                  {message.role === "assistant" && (
                    <div className="zm-message-avatar">Z</div>
                  )}

                  <div className="zm-message-content">
                    <div className="zm-message-name">
                      {message.role === "assistant" ? "ZentroMart AI" : "You"}
                    </div>
                    <div className="zm-message-bubble">{message.text}</div>
                    <span className="zm-message-time">
                      {formatTime(message.time)}
                      {message.role === "user" && (
                        <span className="zm-read-check"> ✓</span>
                      )}
                    </span>
                  </div>

                  {message.role === "user" && (
                    <div className="zm-user-avatar">You</div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="zm-message-row zm-bot-row">
                  <div className="zm-message-avatar">Z</div>
                  <div className="zm-message-content">
                    <div className="zm-message-name">ZentroMart AI</div>
                    <div
                      className="zm-typing-bubble"
                      aria-label="Assistant is typing"
                    >
                      <span />
                      <span />
                      <span />
                    </div>
                    <span className="zm-message-time">Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {error && (
              <div className="zm-error" role="alert">
                <span>!</span>
                <div>
                  <strong>Couldn't send your message</strong>
                  <p>{error}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      inputRef.current?.focus();
                    }}
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="zm-chat-footer">
            <div className="zm-suggestions-heading">
              <span>✧</span>
              <p>Quick questions</p>
              <span className="zm-suggestions-hint">Choose a topic to get started</span>
            </div>

            <div className="zm-suggestions">
              {suggestions.map((item) => (
                <button
                  className="zm-suggestion"
                  type="button"
                  key={item.text}
                  disabled={loading}
                  onClick={() => sendMessage(item.text)}
                >
                  <span>{item.icon}</span>
                  {item.text}
                  <span className="zm-suggestion-arrow">↗</span>
                </button>
              ))}
            </div>

            <form className="zm-composer" onSubmit={handleSubmit}>
              <span className="zm-composer-icon" aria-hidden="true">✧</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Message ZentroMart Support..."
                aria-label="Type your message"
                autoComplete="off"
                disabled={loading}
              />
              <span className="zm-enter-hint">↵</span>
              <button
                className="zm-send-button"
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
              >
                <span>➤</span>
              </button>
            </form>

            <div className="zm-footer-note">
              <span>✦</span>
              Powered by ZentroMart AI
              <i />
              Please avoid sharing passwords or sensitive information.
            </div>
          </div>
        </section>

        <footer className="zm-page-footer">
          <span>© {new Date().getFullYear()} ZentroMart</span>
          <span>Making shopping simpler, one conversation at a time.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
