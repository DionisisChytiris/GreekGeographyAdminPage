import React, { useEffect, useState } from "react";
import { FaEnvelope, FaUsers, FaTasks } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
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
  const [userIds, setUserIds] = useState([]);
  const [messagesByUser, setMessagesByUser] = useState<
    Record<string | number, Message[]>
  >({});

  useEffect(() => {
  fetch("http://192.168.1.234:3000/messages/users")
    .then((res) => res.json())
    .then((data) => console.log("User IDs:", data))
    .catch((err) => console.error(err));
}, []);


  useEffect(() => {
    // Fetch all userIds
    const fetchUserIds = async () => {
      try {
        const res = await fetch("http://192.168.1.234:3000/messages/users");
        const userIds = await res.json();
        setUserIds(userIds);

        // Fetch messages for each user
        const allMessages = {};
        for (const userId of userIds) {
          const res = await fetch(
            `http://192.168.1.234:3000/messages/user-messages/${userId}`
          );
          const userMessages = await res.json();
          allMessages[userId] = userMessages;
        }
        setMessagesByUser(allMessages);
      } catch (err) {
        console.error("Error fetching user messages", err);
      }
    };

    fetchUserIds();
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
        {userIds.map((userId) => (
          <div key={userId}>
            <h3>User: {userId}</h3>
            {(messagesByUser[userId] || []).map((msg) => (
              <div key={msg.id} style={{ marginBottom: "10px" }}>
                <p>
                  <strong>Message:</strong> {msg.content}
                </p>
                {/* {msg.reply && (
                  <p>
                    <strong>Reply:</strong> {msg.reply}
                  </p>
                )} */}
              </div>
            ))}
          </div>
        ))}

        {messages.map((msg) => {
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

              {/* You can later replace this with actual messages per client if needed */}
              <div className="messages-list">
                <p className="message-text">Messages for {msg.id}...</p>
              </div>
            </div>
            // <div
            //   key={msg.id}
            //   style={{
            //     marginBottom: 20,
            //     display: "flex",
            //     flexDirection: "row",
            //     gap: 12,
            //     alignItems: "center",
            //   }}
            // >
            //   <div>{msg.id}</div>
            //   <div className="bubble-user">
            //     <div style={{ color: "#f5f5f5" }}>{msg.content}</div>
            //     <div style={{ color: "#dbd9d9", fontSize: 10, paddingTop: 5 }}>
            //       {new Date(msg.sentAt).toLocaleString()}
            //     </div>
            //   </div>
            // </div>
          );
        })}
      </div>
    </div>
  );
}

export default WorldTriviaScreen;
