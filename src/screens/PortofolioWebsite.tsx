// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaEnvelope, FaUsers, FaTasks } from "react-icons/fa"; // Icons for stat cards
// import axios from "axios";
// import "./styles/GreekGeographyScreen.css";

// function PortofolioWebsite() {
//    const navigate = useNavigate();
//   const [clientIds, setClientIds] = useState<string[]>([]);
//     const [activeUsers, setActiveUsers] = useState<number>(0);
//     const [lastMessageDates, setLastMessageDates] = useState<{
//       [key: string]: string;
//     }>({});

//     const app_id = "portofolio-website";

//   useEffect(() => {
//     const fetchClientIds = async () => {
//       try {
//         const [clientsRes, datesRes] = await Promise.all([
//           axios.get(
//             `https://greek-geography-quiz-app-backend.vercel.app/client_ids?app_id=${app_id}`
//           ),
//           axios.get(
//             `https://greek-geography-quiz-app-backend.vercel.app/last_message_dates?app_id=${app_id}`
//           ),
//         ]);

//         const clientIdsArray = clientsRes.data?.[app_id] ?? [];
//         setClientIds(clientIdsArray);
//         setActiveUsers(clientIdsArray.length);
//         setLastMessageDates(datesRes.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchClientIds();
//   }, []);

//   return (
//     <div>
//          <header className="greek-quiz-header">
//            <div
//              onClick={() => navigate("/homeAdmin")}
//              style={{ color: "grey", marginRight: "20px" }}
//            >
//              Home
//            </div>
//            <img src="/adminPanel.png" alt="Greek Map" className="image-website" />
//            <div>Portofolio Website</div>
//          </header>
//          <div className="stats-container">
//            <div className="stat-card">
//              <FaEnvelope size={24} color="#4A90E2" />
//              <p className="stat-number">{activeUsers}</p>
//              <p className="stat-label">Total Messages</p>
//            </div>
//            <div className="stat-card">
//              <FaUsers size={24} color="#50C878" />
//              <p className="stat-number">{activeUsers}</p>
//              <p className="stat-label">Active Users</p>
//            </div>
//            <div className="stat-card">
//              <FaTasks size={24} color="#FFB347" />
//              <p className="stat-number">...</p>
//              <p className="stat-label">Pending</p>
//            </div>
//          </div>

//          <div className="user-messages">
//            <h2 className="section-title">User Messages</h2>
//            {[...clientIds]
//           .sort((a, b) => {
//             const dateA = new Date(lastMessageDates[`${app_id}__${a}`] || 0);
//             const dateB = new Date(lastMessageDates[`${app_id}__${b}`] || 0);
//             return dateB.getTime() - dateA.getTime(); // Descending (newest first)
//           }).map((id) => (
//              <div key={id} className="user-section">
//                <div className="user-header">
//                  <div className="user-info">
//                    <h3 className="user-name">Client ID: {id}</h3>
//                    <span className="status-dot active"></span>
//                    <div>
//                      Date:{" "}
//                      {lastMessageDates[`${app_id}__${id}`]
//                        ? new Date(
//                            lastMessageDates[`${app_id}__${id}`]
//                          ).toLocaleDateString("en-GB", {
//                            day: "2-digit",
//                            month: "short",
//                            year: "numeric",
//                            hour: "2-digit",
//                            minute: "2-digit",
//                          })
//                        : "No messages"}
//                    </div>
//                  </div>
//                  <button
//                    onClick={() =>
//                      navigate(`/UserGreekQuizMessage/${id}?app_id=${app_id}`)
//                    }
//                    className="view-all-button"
//                  >
//                    View Message
//                  </button>
//                </div>
//                {/* You can later replace this with actual messages per client if needed */}
//                <div className="messages-list">
//                  <p className="message-text">Messages for {id}...</p>
//                </div>
//              </div>
//            ))}
//          </div>
//        </div>
//      );
// }

// export default PortofolioWebsite

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaUsers, FaTasks } from "react-icons/fa"; // Icons for stat cards
import axios from "axios";
import "./styles/GreekGeographyScreen.css";

function PortofolioWebsite() {
  const navigate = useNavigate();
  const [clientIds, setClientIds] = useState<string[]>([]);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [lastMessageDates, setLastMessageDates] = useState<{
    [key: string]: string;
  }>({});
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");
  const [messages, setMessages] = useState<any[]>([]);
  const [messageStats, setMessageStats] = useState({
    total: 0,
    read: 0,
    unread: 0,
  });

  const app_id = "portofolio-website";

  // Fetch client IDs and message dates
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, datesRes, statsRes] = await Promise.all([
          axios.get(
            `https://greek-geography-quiz-app-backend.vercel.app/client_ids?app_id=${app_id}`
          ),
          axios.get(
            `https://greek-geography-quiz-app-backend.vercel.app/last_message_dates?app_id=${app_id}`
          ),
          axios.get(
            `https://greek-geography-quiz-app-backend.vercel.app/message_stats?app_id=${app_id}`
          ),
        ]);

        const clientIdsArray = clientsRes.data?.[app_id] ?? [];
        setClientIds(clientIdsArray);
        setActiveUsers(clientIdsArray.length);
        setLastMessageDates(datesRes.data);
        setMessageStats(statsRes.data);

        // 👉 Fetch messages for each client
        const messagesArray = await Promise.all(
          clientIdsArray.map(async (client_id) => {
            const res = await axios.get(
              `https://greek-geography-quiz-app-backend.vercel.app/messages?app_id=${app_id}&client_id=${client_id}`
            );
            return res.data;
          })
        );

        const flattenedMessages = messagesArray.flat(); // merge arrays
        setMessages(flattenedMessages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Mark message as read
  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(
        `https://greek-geography-quiz-app-backend.vercel.app/messages/${messageId}/read`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) throw new Error("Failed to mark message as read");

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
      console.log(messages);
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

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
        <div>Greek Geography Quiz App</div>
      </header>

      {/* Stats Buttons */}
      <div className="stats-container">
        <div className="stat-card" onClick={() => setFilter("all")}>
          <FaEnvelope size={24} color="#4A90E2" />
          <p className="stat-number">{messageStats.total}</p>
          <p className="stat-label">All Messages</p>
        </div>
        <div className="stat-card" onClick={() => setFilter("read")}>
          <FaUsers size={24} color="#50C878" />
          <p className="stat-number">{messageStats.read}</p>
          <p className="stat-label">Read</p>
        </div>
        <div className="stat-card" onClick={() => setFilter("unread")}>
          <FaTasks size={24} color="#FFB347" />
          <p className="stat-number">{messageStats.unread}</p>
          <p className="stat-label">Unread</p>
        </div>
      </div>

      {/* Message List */}
      <div className="user-messages">
        <h2 className="section-title">
          {" "}
          {filter === "all" && "All Messages"}
          {filter === "read" && "Read Messages"}
          {filter === "unread" && "Unread Messages"}
        </h2>

        {messages
          .filter((msg) => {
            if (filter === "read") return msg.read === true;
            if (filter === "unread") return msg.read === false;
            return true;
          })
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .map((msg) => (
            <div key={msg._id} className="user-section">
              <div className="user-header">
                <div className="user-info">
                  <h3 className="user-name">Client ID: {msg.client_id}</h3>
                  <span className="status-dot active"></span>
                  <div>
                    Date:{" "}
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "No date"}
                  </div>
                </div>
                <div>
                  {msg.read ? (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      Read
                    </span>
                  ) : (
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      Unread
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (!msg.read) markAsRead(msg._id);
                    navigate(
                      `/UserGreekQuizMessage/${msg.client_id}?app_id=${app_id}`
                    );
                  }}
                  className="view-all-button"
                >
                  View Message
                </button>
              </div>
              <div className="messages-list">
                <p className="message-text">
                  {msg.message || "No message content"}
                </p>
              </div>
            </div>
          ))}

      
      </div>
    </div>
  );
}

export default PortofolioWebsite;
