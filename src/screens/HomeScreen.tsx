import React, { useEffect, useState } from "react";
import { MessageBubble } from "../components/MessageBubble";
import { ReplyInput } from "../components/ReplyInput";
import { toast } from "sonner";
import "./HomeScreen.css";
import { useNavigate } from "react-router-dom";
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

export default function HomeScreen() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const client_id = "w6r1e5bsmf";

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `https://greek-geography-quiz-app-backend.vercel.app/messages?client_id=${client_id}`
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
            client_id: client_id,
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

  // const handleReply = async (messageId: string, reply: string) => {
  //   const token = localStorage.getItem("admin_token");

  //   if (!token) {
  //     toast.error("No authorization token found. Please log in.");
  //     return;
  //   }

  //   try {
  //     // Post the reply
  //     const response = await fetch(
  //       "https://greek-geography-quiz-app-backend.vercel.app/reply",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           client_id: "w6r1e5bsmf",
  //           message_id: messageId,
  //           reply,
  //         }),
  //       }
  //     );

  //     if (!response.ok) throw new Error("Failed to send reply");

  //     toast.success("Reply sent successfully");

  //     // Fetch updated replies from the backend
  //     const repliesResponse = await fetch(
  //       `https://greek-geography-quiz-app-backend.vercel.app/messages/${messageId}/replies`
  //     );

  //     if (!repliesResponse.ok) {
  //       throw new Error("Failed to fetch updated replies");
  //     }

  //     const updatedReplies = await repliesResponse.json();

  //     // Update the specific message's replies
  //     setMessages((prevMessages) =>
  //       prevMessages.map((message) =>
  //         message._id === messageId
  //           ? { ...message, replies: updatedReplies }
  //           : message
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Failed to send reply", error);
  //     toast.error("Failed to send reply");
  //   }
  // };

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
  }, []);

  if (loading) {
    return (
      <div className="centered">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div >
      <div className="buttons-container">
        <div onClick={() => navigate("/homeAdmin")} className="home-button">
          home
        </div>
        <div onClick={handleLogout} className="logout-button">
          Logout
        </div>
      </div>
      <div className="messageBox">
        {/* {messages.map((item) => (
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
            <ReplyInput
              onSend={async (reply) => await handleReply(item._id, reply)}
              disabled={false}
            />
          </div>
        ))} */}

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

// import React, { useEffect, useState, useCallback } from "react";
// import { MessageBubble } from "../components/MessageBubble";
// import { ReplyInput } from "../components/ReplyInput";
// import { toast } from "sonner";
// import "./HomeScreen.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// interface Message {
//   _id: string;
//   client_id: string;
//   message: string;
//   createdAt: string;
//   replies?: Array<{
//     reply: string;
//     createdAt: string;
//   }>;
// }

// export default function HomeScreen() {
//   const navigate = useNavigate();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(true);
//   const client_id = "w6r1e5bsmf";

//   const fetchMessages = async () => {
//     try {
//       const response = await fetch(
//         `https://greek-geography-quiz-app-backend.vercel.app/messages?client_id=${client_id}`
//       );
//       if (!response.ok) throw new Error("Failed to fetch messages");
//       const data = await response.json();
//       setMessages(data);
//     } catch (error) {
//       toast.error("Failed to load messages");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleReply = async (messageId: string, reply: string) => {
//     const token = localStorage.getItem("admin_token");

//     if (!token) {
//       toast.error("No authorization token found. Please log in.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://greek-geography-quiz-app-backend.vercel.app/reply",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             client_id: "EXAMPLE_CLIENT_ID",
//             message_id: messageId,
//             reply,
//           }),
//         }
//       );

//       if (!response.ok) throw new Error("Failed to send reply");
//       toast.success("Reply sent successfully");

//       // Update the specific message's replies instead of refetching all messages
//       setMessages((prevMessages) => {
//         return prevMessages.map((message) =>
//           message._id === messageId
//             ? {
//                 ...message,
//                 replies: [
//                   ...(message.replies || []),
//                   { reply, createdAt: new Date().toISOString() },
//                 ], // Add the new reply to the message
//               }
//             : message
//         );
//       });
//     } catch (error) {
//       toast.error("Failed to send reply");
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await axios.post(
//         "https://greek-geography-quiz-app-backend.vercel.app/logout"
//       );
//       navigate("/"); // Redirect to login page after logging out
//     } catch (error) {
//       console.error("Error during logout:", error);
//       alert("Logout failed. Please try again.");
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   if (loading) {
//     return (
//       <div className="centered">
//         <div className="loader"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container">
//       <div className="buttons-container">
//         <div onClick={() => navigate("/homeAdmin")} className="home-button">
//           home
//         </div>
//         <div onClick={handleLogout} className="logout-button">
//           Logout
//         </div>
//       </div>
//       <div className="messageBox">
//         {messages.length === 0 ? (
//           <div className="centered">
//             <p className="empty-text">No messages yet</p>
//           </div>
//         ) : (
//           <div className="messages-container">
//             {messages.map((item) => (
//               <div key={item._id}>
//                 <MessageBubble
//                   message={item.message}
//                   timestamp={new Date(item.createdAt)}
//                   isAdmin={false}
//                 />
//                 {item.replies?.map((reply, index) => (
//                   <MessageBubble
//                     key={index}
//                     message={reply.reply}
//                     timestamp={new Date(reply.createdAt)}
//                     isAdmin={true}
//                   />
//                 ))}
//               </div>
//             ))}
//           </div>
//         )}
//         <ReplyInput
//           onSend={async (reply) => {
//             if (messages.length > 0) {
//               await handleReply(messages[0]._id, reply);
//             }
//           }}
//           disabled={messages.length === 0}
//         />
//       </div>
//     </div>
//   );
// }
