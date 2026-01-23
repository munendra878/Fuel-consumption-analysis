import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatBot.css";

export default function ChatBot() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `
👋 <b>Hello! I'm your Fuel Analysis Assistant.</b><br/><br/>

I can help you with:
<ul>
<li>📊 Dashboard insights</li>
<li>📈 Fuel & CO₂ prediction</li>
<li>⬆ Dataset uploads</li>
<li>🧾 Reports & analysis</li>
<li>⭐ Vehicle recommendations</li>
</ul>

Type <b>help</b> to see all options.
      `,
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  /* ===== BOT BRAIN ===== */
  const getBotReply = (question) => {
    const q = question.toLowerCase();

    if (q.includes("help")) {
      return `
<b>📌 Help Menu</b><br/><br/>
• dashboard<br/>
• prediction<br/>
• upload<br/>
• reports<br/>
• recommendations<br/>
• co2<br/>
• fuel<br/>
• health
      `;
    }

    if (q.includes("dashboard")) {
      navigate("/dashboard");
      return "📊 Opening dashboard for you...";
    }

    if (q.includes("predict")) {
      navigate("/prediction");
      return "📈 Let’s predict fuel & CO₂ emissions.";
    }

    if (q.includes("upload")) {
      navigate("/upload");
      return "⬆ Ready to upload your dataset.";
    }

    if (q.includes("report")) {
      navigate("/reports");
      return "🧾 Showing reports & analysis.";
    }

    if (q.includes("recommend")) {
      navigate("/recommendations");
      return "⭐ Finding best fuel-efficient vehicles.";
    }

    if (q.includes("co2")) {
      return `
🌍 <b>CO₂ Formula</b><br/><br/>
Fuel Consumption × <b>2392 g/km</b><br/>
Lower fuel = cleaner environment 🌱
      `;
    }

    if (q.includes("fuel")) {
      return `
⛽ <b>Fuel Consumption</b><br/><br/>
Measured in <b>L/100km</b><br/>
Lower is better ✔
      `;
    }

    if (q.includes("health") || q.includes("backend")) {
      return `
🟢 <b>System Health</b><br/><br/>
Backend: Online<br/>
API: Connected<br/>
Database: Active
      `;
    }

    if (q.includes("clear")) {
      setMessages([]);
      return "🧹 Chat cleared.";
    }

    if (q.includes("hi") || q.includes("hello")) {
      return "Hello 😊 How can I help you today?";
    }

    return `
🤖 I didn’t understand that.<br/><br/>
Try:
<b>dashboard, prediction, upload, reports, recommendations</b><br/>
or type <b>help</b>.
    `;
  };

  /* ===== SEND MESSAGE ===== */
  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: getBotReply(input) },
      ]);
      setTyping(false);
    }, 600);
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.sender}`}>
            <div dangerouslySetInnerHTML={{ __html: msg.text }} />
          </div>
        ))}
        {typing && <div className="chat-message bot">Typing...</div>}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Ask about dashboard, prediction, reports..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
