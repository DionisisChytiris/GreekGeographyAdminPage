import React, { useEffect, useState } from "react";
import { FaEnvelope, FaUsers, FaTasks } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import "./WorldTriviaScreen.css";

function WorldTriviaScreen() {
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState<number>(0);
  type Message = {
    id: string | number;
    userId: string | number;
    content: string;
    sentAt: string;
  };
  const [messages, setMessages] = useState<Message[]>([]);
  const [userIds, setUserIds] = useState<any>([]);
  const [messagesByUser, setMessagesByUser] = useState<
    Record<string | number, Message[]>
  >({});
  // const { userId } = useParams<{ userId: string }>(); // Retrieve dynamic 'id' from URL

  // useEffect(() => {
  //   if (!userId) return;

  //   const fetchUserMessages = async () => {
  //     try {
  //       const response = await fetch("http://192.168.1.234:3000/messages", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ content: "Hi there!", userId }),
  //       });

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       setMessages(data), setActiveUsers(data.length);
  //       console.log("Response from server:", data);
  //     } catch (error) {
  //       console.error("Error posting message:", error);
  //     }
  //   };

  //   fetchUserMessages();
  // }, [userId]);

  useEffect(() => {
    // fetch("http://192.168.1.234:3000/messages")
    fetch("https://worldwisetriviaquizbackend.onrender.com/messages")
      .then((res) => res.json())
      .then((data) => {
        const groupedByUser: Record<string, Message[]> = {};

        data.forEach((msg: Message) => {
          if (!groupedByUser[msg.userId]) {
            groupedByUser[msg.userId] = [];
          }
          groupedByUser[msg.userId].push(msg);
        });

        setMessagesByUser(groupedByUser);
        setUserIds(Object.keys(groupedByUser));
        setActiveUsers(Object.keys(groupedByUser).length);
      })
      .catch((err) => console.error(err));
  }, []);

  // useEffect(() => {
  //   fetch("http://192.168.1.234:3000/messages") // use your actual IP
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setMessages(data), setActiveUsers(data.length);
  //     })
  //     .catch((err) => console.error(err));
  // }, []);

  return (
    <div>
      <header className="worldTrivia-quiz-header">
        <div
          onClick={() => navigate("/homeAdmin")}
          style={{ color: "grey", marginRight: "20px" }}
        >
          Home
        </div>
        <img
          src="./logo2.png"
          alt="Greek Map"
          className="image-worldTriviaQuiz"
        />
        <div>World Trivia Quiz</div>
      </header>
      {/* <div>No content yet.</div> */}
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
        {/* {userIds.map((userId) => (
          <div key={userId}>
            <h3>User: {userId}</h3>
            {(messagesByUser[userId] || []).map((msg) => (
              <div key={msg.id} style={{ marginBottom: "10px" }}>
                <p>
                  <strong>Message:</strong> {msg.content}
                </p>
                {msg.reply && (
                  <p>
                    <strong>Reply:</strong> {msg.reply}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))} */}

        {userIds.map((userId) => {
          const userMessages = messagesByUser[userId];
          const latestMessage = userMessages?.[userMessages.length - 1];

          return (
            <div key={userId} className="user-section">
              <div className="user-header">
                <div className="user-info">
                  <h3 className="user-name">Client ID: {userId}</h3>
                  <span className="status-dot active"></span>
                </div>
                <button
                  onClick={() => navigate(`/UserTriviaMessage/${userId}`)}
                  className="view-all-button"
                >
                  View All
                </button>
              </div>

              <div className="messages-list">
                <p className="message-text">
                  Latest message: {latestMessage?.content}
                </p>
              </div>
            </div>
          );
        })}

        {/* {messages.map((msg) => {
          console.log("sentAt:", msg.id); // 👈 Check format
          return (
            <div key={msg.id} className="user-section">
              <div className="user-header">
                <div className="user-info">
                  <h3 className="user-name">Client ID: {msg.userId}</h3>
                  <span className="status-dot active"></span>
                </div>
                <button
                  onClick={() => navigate(`/UserTriviaMessage/${msg.userId}`)}
                  className="view-all-button"
                >
                  View All
                </button>
              </div>
              <div className="messages-list">
                <p className="message-text">Messages for {msg.id}...</p>
              </div>
            </div>
          );
        })} */}
      </div>
    </div>
  );
}

export default WorldTriviaScreen;
