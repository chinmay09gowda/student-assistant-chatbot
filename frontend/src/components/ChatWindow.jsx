import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { sendMessage } from "../services/api";
import ReactMarkdown from "react-markdown";

const MarkdownImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className={`image-wrapper ${loaded ? 'loaded' : 'loading'}`}>
      {!loaded && <div className="image-skeleton"></div>}
      <img
        src={src}
        alt={alt || "Diagram"}
        onLoad={() => setLoaded(true)}
        className="chat-diagram"
      />
    </div>
  );
};

MarkdownImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string
};

export default function ChatWindow({ subject }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;
    
    const userMessageContent = input || "Analyzed attached file";
    const userMessage = { role: "user", content: `[${subject}] ${userMessageContent}` };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInput("");
    const fileToSend = selectedFile;
    setSelectedFile(null);
    setLoading(true);

    try {
      const reply = await sendMessage(newMessages, fileToSend);
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: "assistant", content: "Error connecting to backend" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.length === 0 && (
          <div className="welcome-chat">
            <h3>Welcome!</h3>
            <p>How can I help you today with your {subject.split(' - ')[0]} studies? You can also upload images or PDFs for me to analyze.</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role}>
            <b>{msg.role}:</b> 
            <div className="markdown-container">
              <ReactMarkdown components={{ img: MarkdownImage }}>
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="assistant loading-pulse">Typing...</div>}
      </div>

      <div className="chat-input-area">
        {selectedFile && (
          <div className="file-preview-badge">
            📎 {selectedFile.name}
            <button onClick={() => setSelectedFile(null)}>✕</button>
          </div>
        )}
        <div className="chat-input-container">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf"
            style={{ display: 'none' }}
          />
          <button 
            className="attach-btn" 
            onClick={() => fileInputRef.current.click()}
            title="Attach Image or PDF"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"></path></svg>
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
          />
          <button className="send-btn" onClick={handleSend} disabled={loading}>{loading ? '...' : 'Send'}</button>
        </div>
      </div>
    </div>
  );
}

ChatWindow.propTypes = {
  subject: PropTypes.string.isRequired
};
