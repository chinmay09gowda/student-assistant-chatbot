import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import Preloader from "./components/Preloader";

export default function App() {
  const [subject, setSubject] = useState("");
  const [board, setBoard] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000); // reduced wait time
    return () => clearTimeout(timer);
  }, []);

  const handleStartChat = () => {
    if (subject && board && studentClass) {
      setChatStarted(true);
    } else {
      alert("Please select a Board, Class, and Subject to continue.");
    }
  };

  if (!isLoaded) {
    return <Preloader isLoaded={isLoaded} />;
  }

  return (
    <div className={`app ${chatStarted ? "chat-mode" : ""}`}>
      <Preloader isLoaded={isLoaded} />

      {!chatStarted ? (
        <div className="setup-container">
          <div className="setup-hero">
            <div className="hero-content">
              <div className="label">AI ASSISTANT</div>
              <h2>Your Personal Tutor For Board Excellence</h2>
            </div>
          </div>

          <div className="setup-page">
            <div className="setup-section">
              <span className="section-label">Curriculum</span>
              <h3>Select Your Board</h3>
              <div className="subject-buttons">
                {["CBSE", "ICSE", "State Board"].map((b) => (
                  <button
                    key={b}
                    className={board === b ? "active" : ""}
                    onClick={() => setBoard(b)}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="setup-section">
              <span className="section-label">Academic Year</span>
              <h3>Select Your Class</h3>
              <div className="subject-buttons">
                {["6th", "7th", "8th", "9th", "10th"].map((c) => (
                  <button
                    key={c}
                    className={studentClass === c ? "active" : ""}
                    onClick={() => setStudentClass(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="setup-section">
              <span className="section-label">Specialization</span>
              <h3>Select Your Subject</h3>
              <div className="subject-buttons">
                {["Maths", "Science", "Social", "Computers", "English", "General"].map((subj) => (
                  <button
                    key={subj}
                    className={subject === subj.toLowerCase() ? "active" : ""}
                    onClick={() => setSubject(subj.toLowerCase())}
                  >
                    {subj.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <button className="start-chat-btn" onClick={handleStartChat}>
              Launch Assistant
            </button>
          </div>
        </div>
      ) : (
        <div className="dashboard-layout">
          <div className="dashboard-sidebar">
            <h2>AI Assistant</h2>

            <div className="context-card">
              <h3>Current Context</h3>
              <div className="context-detail">
                <span>Board:</span> <b>{board}</b>
              </div>
              <div className="context-detail">
                <span>Class:</span> <b>{studentClass}</b>
              </div>
              <div className="context-detail">
                <span>Subject:</span> <b>{subject.toUpperCase()}</b>
              </div>
              <button
                className="change-btn full-width"
                onClick={() => setChatStarted(false)}
              >
                ⟵ Change Context
              </button>
            </div>

            <div className="sidebar-tips">
              <h3>💡 Quick Tips</h3>
              <ul>
                <li>Ask clear and concise questions.</li>
                <li>
                  Type <b>"diagram"</b> to get related images.
                </li>
                <li>
                  The AI acts strictly according to your selected subject and grade.
                </li>
              </ul>
            </div>
          </div>

          <div className="dashboard-main">
            <ChatWindow subject={`${board} - ${studentClass} Grade - ${subject}`} />
          </div>
        </div>
      )}
    </div>
  );
}
