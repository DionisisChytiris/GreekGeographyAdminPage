import React, { useEffect, useState } from "react";
import { MessageBubble } from "../components/MessageBubble";
import { ReplyInput } from "../components/ReplyInput";
import { toast } from "sonner";
import "./HomeScreen.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

interface Message {
  id: string;
  content: string;
  sentAt: string;
  replies?: Array<{
    reply: string;
    createdAt: string;
  }>;
}

export default function UserTriviaMessage() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>(); // Retrieve dynamic 'id' from URL
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("User ID from params:", userId);
  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        // const res = await fetch(`http://192.168.1.234:3000/messages/${userId}`);
        const res = await fetch(`https://worldwisetriviaquizbackend.onrender.com

/messages/${userId}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  // useEffect(() => {
  //   fetch("http://192.168.1.234:3000/messages") // use your actual IP
  //     .then((res) => res.json())
  //     .then((data) => setMessages(data))
  //     .catch((err) => console.error(err));
  // }, []);

  const handleReply = async (messageId: string, reply: string) => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      toast.error("No authorization token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.1.234:3000/messages/reply/${messageId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reply,
            repliedBy: "Admin Name", // adjust depending on your DTO
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send reply");
      toast.success("Reply sent successfully");

      // Update the specific message's replies
      setMessages((prevMessages) => {
        return prevMessages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                replies: [
                  ...(message.replies || []),
                  { reply, createdAt: new Date().toISOString() },
                ],
              }
            : message
        );
      });
    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  //   if (loading) {
  //     return (
  //       <div className="centered">
  //         <div className="loader"></div>
  //       </div>
  //     );
  //   }

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
          src="/logo2.png"
          alt="Greek Map"
          className="image-worldTriviaQuiz"
        />
        <div>World Trivia Quiz</div>
      </header>
      <div style={{ textAlign: "center" }}>User number: {userId}</div>
      <div className="messageBox">
        {messages.length === 0 ? (
          <div className="centered">
            <p className="empty-text">No messages yet</p>
          </div>
        ) : (
          <div className="messages-container">
            {messages.map((item) => (
              <div key={item.id}>
                <MessageBubble
                  message={item.content}
                  timestamp={new Date(item.sentAt)}
                  isAdmin={false}
                />
                {item.replies?.map((reply, index) => (
                  <MessageBubble
                    key={index}
                    message={reply.reply}
                    timestamp={new Date(reply.createdAt)}
                    isAdmin={true}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
        <ReplyInput
          onSend={async (reply) => {
            if (messages.length > 0) {
              await handleReply(messages[0].id, reply);
            }
          }}
          disabled={messages.length === 0}
        />
      </div>
    </div>
  );
}
