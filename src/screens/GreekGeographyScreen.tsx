import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaUsers, FaTasks } from "react-icons/fa"; // Icons for stat cards
import axios from "axios";
import "./GreekGeographyScreen.css";

function GreekGeographyScreen() {
  const navigate = useNavigate();
  const [clientIds, setClientIds] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState<number>(0);

  useEffect(() => {
    const fetchClientIds = async () => {
      try {
        const response = await axios.get(
          "https://greek-geography-quiz-app-backend.vercel.app/client_ids"
        );
        setClientIds(response.data.client_ids);
        setActiveUsers(response.data.client_ids.length);
      } catch (error) {
        console.error("Error fetching client IDs:", error);
      }
    };

    fetchClientIds();
  }, []);
  return (
    <div>
      <header className="greek-quiz-header">
        <div
          onClick={() => navigate("/homeAdmin")}
          style={{ color: "grey", marginRight: "20px" }}
        >
          Home
        </div>
        <img src="/logo.png" alt="Greek Map" className="image-greekQuiz" />
        <div>Greek Geography Quiz</div>
      </header>
      <div className="stats-container">
        <div className="stat-card">
          <FaEnvelope size={24} color="#4A90E2" />
          <p className="stat-number">...</p>
          <p className="stat-label">Total Messages</p>
        </div>
        <div className="stat-card">
          <FaUsers size={24} color="#50C878" />
          <p className="stat-number">{activeUsers}</p>
          <p className="stat-label">Active Users</p>
        </div>
        <div className="stat-card">
          <FaTasks size={24} color="#FFB347" />
          <p className="stat-number">...</p>
          <p className="stat-label">Pending</p>
        </div>
      </div>

      <div className="user-messages">
        <h2 className="section-title">User Messages</h2>
        {clientIds.map((id) => (
          <div key={id} className="user-section">
            <div className="user-header">
              <div className="user-info">
                <h3 className="user-name">Client ID: {id}</h3>
                <span className="status-dot active"></span>
              </div>
              <button
                onClick={() => navigate(`/UserGreekQuizMessage/${id}`)}
                className="view-all-button"
              >
                View All
              </button>
            </div>
            {/* You can later replace this with actual messages per client if needed */}
            <div className="messages-list">
              <p className="message-text">Messages for {id}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GreekGeographyScreen;
