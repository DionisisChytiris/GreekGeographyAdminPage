import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaUsers, FaTasks } from "react-icons/fa"; // Icons for stat cards
import "./HomeAdmin.css"; // Importing the CSS file
import axios from "axios";

const MOCK_USERS = [
  {
    id: 1,
    name: "John Doe",
    messages: [
      { id: 1, text: "Hello, I need help with my account", time: "10:30 AM" },
      { id: 2, text: "When will my order arrive?", time: "11:45 AM" },
    ],
    status: "active",
  },
  {
    id: 2,
    name: "Sarah Smith",
    messages: [{ id: 3, text: "Technical support needed", time: "09:15 AM" }],
    status: "away",
  },
  {
    id: 3,
    name: "Mike Johnson",
    messages: [
      { id: 4, text: "Payment issue on order #1234", time: "Yesterday" },
      { id: 5, text: "Thank you for the quick response", time: "Yesterday" },
    ],
    status: "inactive",
  },
];

const HomeAdmin = () => {
  const navigate = useNavigate();
  const [clientIds, setClientIds] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState<number>(0)

  useEffect(() => {
    const fetchClientIds = async () => {
      try {
        const response = await axios.get(
          "https://greek-geography-quiz-app-backend.vercel.app/client_ids"
        );
        setClientIds(response.data.client_ids);
        setActiveUsers(response.data.client_ids.length)
      } catch (error) {
        console.error("Error fetching client IDs:", error);
      }
    };

    fetchClientIds();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://greek-geography-quiz-app-backend.vercel.app/logout"
      );
      navigate("/"); // Redirect to login page after logging out
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Logout failed. Please try again.");
    }
  };
  return (
    <div className="container">
      <header className="header">
        <div className="header-overlay">
          <h1 className="header-title">Admin Dashboard</h1>
          <p className="header-subtitle">Message Management System</p>
          <div className="logout-btn" onClick={handleLogout}>
            LogOut
          </div>
        </div>
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
                onClick={() => navigate(`/UserMessage/${id}`)}
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

        {/* {MOCK_USERS.map((user) => (
          <div key={user.id} className="user-section">
            <div className="user-header">
              <div className="user-info">
                <h3 className="user-name">{user.name}</h3>
                <span className={`status-dot ${user.status}`}></span>
              </div>
              <button
                onClick={() => navigate("/homeScreen")}
                className="view-all-button"
              >
                View All
              </button>
            </div>
            <div className="messages-list">
              {user.messages.map((message) => (
                <div key={message.id} className="message-card">
                  <p className="message-text">{message.text}</p>
                  <p className="message-time">{message.time}</p>
                </div>
              ))}
            </div>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default HomeAdmin;
