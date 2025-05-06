import React, { useEffect, useState } from "react";
import { MessageBubble } from "../components/MessageBubble";
import { ReplyInput } from "../components/ReplyInput";
import { toast } from "sonner";
import "./HomeScreen.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

interface Message {
  _id: string;
  client_id: string;
  message: string;
  createdAt: string;
  replies?: Array<{
    reply: string;
    createdAt: string;
  }>;
}

export default function UserMessage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Retrieve dynamic 'id' from URL
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      if (!id) {
        toast.error("ID is missing in URL.");
        return;
      }

      const response = await fetch(
        `https://greek-geography-quiz-app-backend.vercel.app/messages?client_id=${id}`
      );

      if (!response.ok) throw new Error("Failed to fetch messages");
      const data = await response.json();

      // Fetch replies for each message
      const messagesWithReplies = await Promise.all(
        data.map(async (message: Message) => {
          try {
            const repliesResponse = await fetch(
              `https://greek-geography-quiz-app-backend.vercel.app/messages/${message._id}/replies`
            );
            if (!repliesResponse.ok) {
              console.warn(
                `Failed to fetch replies for message ${message._id}`
              );
              return { ...message, replies: [] };
            }
            const replies = await repliesResponse.json();
            return { ...message, replies };
          } catch (err) {
            console.error("Error fetching replies:", err);
            return { ...message, replies: [] };
          }
        })
      );

      setMessages(messagesWithReplies);
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (messageId: string, reply: string) => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      toast.error("No authorization token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        "https://greek-geography-quiz-app-backend.vercel.app/reply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            client_id: id, // Use dynamic 'id' here
            message_id: messageId,
            reply,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to send reply");
      toast.success("Reply sent successfully");

      // Update the specific message's replies
      setMessages((prevMessages) => {
        return prevMessages.map((message) =>
          message._id === messageId
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

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://greek-geography-quiz-app-backend.vercel.app/logout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      navigate("/"); // Redirect to login page after logging out
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Logout failed. Please try again.");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [id]); // Re-fetch messages when the ID changes

  if (loading) {
    return (
      <div className="centered">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="buttons-container">
        <div onClick={() => navigate("/homeAdmin")} className="home-button">
          home
        </div>
        <div onClick={handleLogout} className="logout-button">
          Logout
        </div>
      </div>
      <div>User number: {id}</div>
      <div className="messageBox">
        {messages.length === 0 ? (
          <div className="centered">
            <p className="empty-text">No messages yet</p>
          </div>
        ) : (
          <div className="messages-container">
            {messages.map((item) => (
              <div key={item._id}>
                <MessageBubble
                  message={item.message}
                  timestamp={new Date(item.createdAt)}
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
              await handleReply(messages[0]._id, reply);
            }
          }}
          disabled={messages.length === 0}
        />
      </div>
    </div>
  );
}
