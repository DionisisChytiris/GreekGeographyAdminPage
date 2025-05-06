import React, { useState } from "react";
import "./ReplyInput.css";

interface ReplyInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
}

export const ReplyInput = ({ onSend, disabled }: ReplyInputProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handling the send button click
  const handleReplySend = async () => {
    if (!message.trim()) return; // Ensure that there's a message

    setIsLoading(true);
    try {
      // Call the onSend function passed from the parent (HomeScreen)
      await onSend(message.trim());
      setMessage(""); // Clear input after sending
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally handle the error in the parent or show a toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="input-container">
      <textarea
        className="text-input"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your reply..."
        maxLength={1000}
        disabled={disabled || isLoading}
      />
      <button
        className={`send-button ${!message.trim() || disabled ? "disabled" : ""}`}
        onClick={handleReplySend}
        disabled={!message.trim() || disabled || isLoading}
      >
        {isLoading ? (
          <div className="button-loader" />
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>
    </div>
  );
};





// import React, { useState } from "react";
// import "./ReplyInput.css";
// import axios from "axios";

// interface ReplyInputProps {
//   onSend: (message: string) => Promise<void>;
//   disabled?: boolean;
// }

// export const ReplyInput = ({ onSend, disabled }: ReplyInputProps) => {
//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleReplySend = async (replyText: string) => {
//     const token = localStorage.getItem("admin_token");

//     if (!token) {
//       alert("No authorization token found. Please log in.");
//       return;
//     }

//     if (!replyText.trim()) return;

//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         "https://greek-geography-quiz-app-backend.vercel.app/reply",
//         {
//           client_id: "w6r1e5bsmf",
//           message_id: "6817bfc8696763fff7c70ef8",
//           reply: replyText.trim(),
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         alert("Reply sent!");
//         setMessage(""); // Clear input
//         onSend(replyText.trim()); // Call parent if needed
//       } else {
//         throw new Error(response.data?.error || "Unknown error");
//       }
//     } catch (err) {
//       console.error("Reply send error:", err);
//       alert(
//         "Failed to send reply: " +
//           (err instanceof Error ? err.message : "Unknown error")
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="input-container">
//       <textarea
//         className="text-input"
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         placeholder="Type your reply..."
//         maxLength={1000}
//         disabled={disabled || isLoading}
//       />
//       <button
//         className={`send-button ${
//           !message.trim() || disabled ? "disabled" : ""
//         }`}
//         onClick={() => handleReplySend(message)}
//         disabled={!message.trim() || disabled || isLoading}
//       >
//         {isLoading ? (
//           <div className="button-loader" />
//         ) : (
//           <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
//               fill="currentColor"
//             />
//           </svg>
//         )}
//       </button>
//     </div>
//   );
// };
