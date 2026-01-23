import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatBot.css";

export default function ChatBot() {
  const navigate = useNavigate();

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
    JSON.parse(localStorage.getItem("chat-size")) || {
      width: 340,
      height: 440,
    }
  );

  /* ===============================
     CHAT STATES
  =============================== */
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `
👋 <b>Welcome to the Fuel Consumption Analysis Chatbot!</b><br/><br/>
Type <b>help</b> to see what I can do.
      `,
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const resizing = useRef(false);

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
    if (!resizing.current) return;

    setSize({
      width: Math.max(300, window.innerWidth - e.clientX),
      height: Math.max(360, window.innerHeight - e.clientY),
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
     BOT BRAIN
  =============================== */
  const getBotReply = (question) => {
    const q = question.toLowerCase();

    /* 👋 Greeting */
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

    if (q.includes("dashboard")) {
      navigate("/dashboard");
      return "📊 Opening dashboard...";
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

    if (q.includes("co2")) {
      return "🌍 CO₂ emission ≈ Fuel × 2392 g/km";
    }

    if (q.includes("fuel")) {
      return "⛽ Fuel consumption is measured in L/100km.";
    }

    if (q.includes("health")) {
      return "🟢 System Status: Backend ✔ API ✔ Database ✔";
    }

    return "🤖 I didn’t understand. Type <b>help</b>.";
  };

  /* ===============================
     SEND MESSAGE
  =============================== */
  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((p) => [...p, { sender: "user", text: userMsg }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setMessages((p) => [
        ...p,
        { sender: "bot", text: getBotReply(userMsg) },
      ]);
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
        className="chatbot-fab"
        onClick={() => {
          setOpen(true);
          setUnread(0);
        }}
      >
        💬
        {unread > 0 && <span className="chat-badge">{unread}</span>}
      </button>

      {open && (
        <div
          className={`chatbot-container ${dark ? "dark" : ""}`}
          style={{ width: size.width, height: size.height }}
        >
          {/* HEADER */}
          <div className="chat-header">
            <h4>Fuel AI</h4>
            <div>
              <button onClick={() => setDark(!dark)}>
                {dark ? "☀" : "🌙"}
              </button>
              <button onClick={() => setOpen(false)}>✖</button>
            </div>
          </div>

          {/* CHAT */}
          <div className="chat-window">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.sender}`}>
                <div dangerouslySetInnerHTML={{ __html: m.text }} />
              </div>
            ))}
            {typing && <div className="chat-message bot">Typing...</div>}
          </div>

          {/* INPUT */}
          <div className="chat-input">
            <input
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
