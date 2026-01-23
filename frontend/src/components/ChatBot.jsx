import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatBot.css";

export default function ChatBot() {
  const navigate = useNavigate();

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
👋 <b>Hello! I'm your Fuel Analysis Assistant.</b><br/><br/>
Type <b>help</b> to see all options.
      `,
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const resizeRef = useRef(null);
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
     BOT BRAIN (UNCHANGED LOGIC)
  =============================== */
  const getBotReply = (question) => {
    const q = question.toLowerCase();

    if (q.includes("help")) {
      return `
<b>📌 Help Menu</b><br/>
dashboard | prediction | upload | reports | recommendations | co2 | fuel | health
      `;
    }

    if (q.includes("dashboard")) {
      navigate("/dashboard");
      return "📊 Opening dashboard...";
    }

    if (q.includes("predict")) {
      navigate("/predictionCard");
      return "📈 Starting prediction...";
    }

    if (q.includes("upload")) {
      navigate("/uploaddataset");
      return "⬆ Upload your dataset.";
    }

    if (q.includes("report")) {
      navigate("/reports");
      return "🧾 Showing reports.";
    }

    if (q.includes("recommend")) {
      navigate("/recommendations");
      return "⭐ Finding recommendations.";
    }

    if (q.includes("co2")) {
      return "🌍 CO₂ = Fuel × 2392 g/km";
    }

    if (q.includes("fuel")) {
      return "⛽ Fuel is measured in L/100km.";
    }

    if (q.includes("health")) {
      return "🟢 Backend Online | API Connected | DB Active";
    }

    return "🤖 I didn’t understand. Try <b>help</b>.";
  };

  /* ===============================
     SEND MESSAGE
  =============================== */
  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((p) => [...p, { sender: "user", text: input }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setMessages((p) => [...p, { sender: "bot", text: getBotReply(input) }]);
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
      <button className="chatbot-fab" onClick={() => { setOpen(true); setUnread(0); }}>
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
            <div className="chat-actions">
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
          <div
            ref={resizeRef}
            className="chat-resizer"
            onMouseDown={startResize}
          />
        </div>
      )}
    </>
  );
}

