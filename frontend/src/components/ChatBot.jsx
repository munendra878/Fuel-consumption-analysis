import { useState } from "react";
import "./ChatBot.css";

export default function ChatBot() {
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

    if (q.includes("help") || q.includes("menu")) {
      return `
<b>📌 System Help Menu</b><br/><br/>

📊 <b>Dashboard</b> – Overview of vehicles & CO₂  
<a href="/dashboard">Go to Dashboard</a><br/><br/>

📈 <b>Prediction</b> – Predict fuel & emissions  
<a href="/prediction">Go to Prediction</a><br/><br/>

⬆ <b>Upload</b> – Upload CSV dataset  
<a href="/upload">Upload Dataset</a><br/><br/>

🧾 <b>Reports</b> – Download fuel & CO₂ reports  
<a href="/reports">View Reports</a><br/><br/>

⭐ <b>Recommendations</b> – Best fuel-efficient vehicles  
<a href="/recommendations">View Recommendations</a><br/><br/>

🚪 <b>Logout</b> – Securely exit account  
<a href="/logout">Logout</a>
      `;
    }

    if (q.includes("dashboard")) {
      return `
📊 <b>Dashboard Overview</b><br/><br/>
• Total vehicles analyzed<br/>
• Average fuel consumption<br/>
• Average CO₂ emissions<br/>
• Vehicle comparison table<br/><br/>
<a href="/dashboard">Open Dashboard</a>
      `;
    }

    if (q.includes("predict")) {
      return `
📈 <b>Fuel & CO₂ Prediction</b><br/><br/>
Predictions are based on:
• Engine size  
• Horsepower  
• Cylinders<br/><br/>
<a href="/prediction">Start Prediction</a>
      `;
    }

    if (q.includes("upload")) {
      return `
⬆ <b>Dataset Upload</b><br/><br/>
Upload CSV files to:
• Parse vehicle data  
• Calculate fuel usage  
• Estimate CO₂ emissions<br/><br/>
<a href="/upload">Upload Dataset</a>
      `;
    }

    if (q.includes("report")) {
      return `
🧾 <b>Reports & Analysis</b><br/><br/>
Reports include:
• Total CO₂ emissions  
• Fuel consumption summary  
• Downloadable PDF/CSV<br/><br/>
<a href="/reports">View Reports</a>
      `;
    }

    if (q.includes("recommend")) {
      return `
⭐ <b>Vehicle Recommendations</b><br/><br/>
Based on:
• Lowest fuel usage  
• Lower CO₂ emissions  
• Best efficiency<br/><br/>
<a href="/recommendations">View Recommendations</a>
      `;
    }

    if (q.includes("co2")) {
      return `
🌍 <b>CO₂ Calculation</b><br/><br/>
Formula used:<br/>
<b>Fuel Consumption × 2392 g/km</b><br/><br/>
Lower fuel = lower emissions 🌱
      `;
    }

    if (q.includes("fuel")) {
      return `
⛽ <b>Fuel Consumption</b><br/><br/>
Measured in <b>L/100km</b><br/>
Lower values mean:
• Better mileage  
• Lower cost  
• Less pollution
      `;
    }

    if (q.includes("logout")) {
      return `
🚪 <b>Logout</b><br/><br/>
Use the logout option to safely end your session.<br/><br/>
<a href="/logout">Logout</a>
      `;
    }

    if (q.includes("hi") || q.includes("hello")) {
      return "Hello 😊 How can I help you today?";
    }

    return `
🤖 I didn’t understand that.<br/><br/>
Try asking about:
• dashboard  
• prediction  
• upload  
• reports  
• recommendations<br/><br/>
Or type <b>help</b>.
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
    }, 700);
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.sender}`}>
            <div
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
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
