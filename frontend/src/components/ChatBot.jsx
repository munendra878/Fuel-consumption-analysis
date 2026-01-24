import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatBot.css";

export default function ChatBot() {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const containerRef = useRef(null);

  /* ===============================
     USER INFO
  =============================== */
  const userName =
    localStorage.getItem("username") ||
    localStorage.getItem("name") ||
    "User";

  /* ===============================
     UI STATES
  =============================== */
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [dark, setDark] = useState(
    localStorage.getItem("chat-theme") === "dark"
  );

  const [size, setSize] = useState(
    JSON.parse(localStorage.getItem("chat-size")) || { width: 340, height: 440 }
  );

  const resizing = useRef(false);

  /* ===============================
     CHAT STATES
  =============================== */
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("chat-messages")) || [
      {
        sender: "bot",
        text: `
👋 <b>Welcome to the Fuel Consumption Analysis Chatbot!</b><br/><br/>
Type <b>help</b> to see what I can do.
        `,
      },
    ]
  );
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  /* ===============================
     DARK MODE
  =============================== */
  useEffect(() => {
    document.body.classList.toggle("chat-dark", dark);
    localStorage.setItem("chat-theme", dark ? "dark" : "light");
  }, [dark]);

  /* ===============================
     RESIZE LOGIC
  =============================== */
  const startResize = () => (resizing.current = true);
  const stopResize = () => {
    resizing.current = false;
    localStorage.setItem("chat-size", JSON.stringify(size));
  };
  const resize = (e) => {
    if (!resizing.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setSize({
      width: Math.max(300, e.clientX - rect.left),
      height: Math.max(360, e.clientY - rect.top),
    });
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResize);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResize);
    };
  });

  /* ===============================
     PERSIST MESSAGES
  =============================== */
  useEffect(() => {
    localStorage.setItem("chat-messages", JSON.stringify(messages));
  }, [messages]);

  /* ===============================
     AUTO SCROLL
  =============================== */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  /* ===============================
     BOT BRAIN
  =============================== */
  const getBotReply = (question) => {
    const q = question.toLowerCase();

    if (["hi", "hello", "hey", "hii"].some((w) => q.includes(w))) {
      return `
👋 <b>Hi ${userName}!</b><br/>
Welcome to the <b>Fuel Consumption Analysis Chatbot</b> 🚗⛽
      `;
    }

    if (q.includes("help")) {
      return `
<b>📌 Help Menu</b><br/>
• dashboard<br/>
• prediction<br/>
• upload dataset<br/>
• reports<br/>
• recommendations<br/>
• co2<br/>
• fuel<br/>
• health
      `;
    }

    if (q.includes("predict")) {
      navigate("/prediction");
      return "📈 Opening fuel prediction...";
    }

    if (q.includes("upload")) {
      navigate("/uploaddataset");
      return "⬆ Redirecting to dataset upload...";
    }

    if (q.includes("report")) {
      navigate("/reports");
      return "🧾 Showing reports...";
    }

    if (q.includes("recommend")) {
      navigate("/recommendations");
      return "⭐ Fetching recommendations...";
    }

    if (q.includes("co2")) return "🌍 CO₂ emission ≈ Fuel × 2392 g/km";
    if (q.includes("fuel")) return "⛽ Fuel consumption is measured in L/100km.";
    if (q.includes("health")) return "🟢 System Status: Backend ✔ API ✔ Database ✔";

    return "🤖 I didn’t understand. Type <b>help</b>.";
  };

  /* ===============================
     SEND MESSAGE
  =============================== */
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: getBotReply(userMsg) }]);
      setTyping(false);
      if (!open) setUnread((u) => u + 1);
    }, 600);
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        aria-label="Open Chat"
        className="chatbot-fab"
        onClick={() => {
          setOpen(true);
          setUnread(0);
        }}
      >
        💬
        {unread > 0 && <span className="chat-badge">{unread}</span>}
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div
          ref={containerRef}
          className={`chatbot-container ${dark ? "dark" : ""}`}
          style={{ width: size.width, height: size.height }}
        >
          {/* HEADER */}
          <div className="chat-header">
            <h4>Fuel AI</h4>
            <div className="chat-header-buttons">
              <button aria-label="Toggle Dark Mode" onClick={() => setDark(!dark)}>
                {dark ? "☀" : "🌙"}
              </button>
              <button aria-label="Close Chat" onClick={() => setOpen(false)}>
                ✖
              </button>
            </div>
          </div>

          {/* CHAT WINDOW */}
          <div className="chat-window">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.sender}`}>
                <div dangerouslySetInnerHTML={{ __html: m.text }} />
              </div>
            ))}
            {typing && <div className="chat-message bot">Typing...</div>}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT */}
          <div className="chat-input">
            <input
              aria-label="Type your message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>

          {/* RESIZER */}
          <div className="chat-resizer" onMouseDown={startResize} />
        </div>
      )}
    </>
  );
}
