import React from "react";
import "./MessageBubble.css";

interface MessageBubbleProps {
  message: string;
  timestamp: Date;
  isAdmin: boolean;
}

export const MessageBubble = ({
  message,
  timestamp,
  isAdmin,
}: MessageBubbleProps) => {
  return (
    <div className={`bubble-container ${isAdmin ? "admin" : "user"}`}>
      <div className={`bubble ${isAdmin ? "admin-bubble" : "user-bubble"}`}>
        <p className={`message ${isAdmin ? "admin-message" : "user-message"}`}>
          {message}
        </p>
        <span
          className={`timestamp ${
            isAdmin ? "admin-timestamp" : "user-timestamp"
          }`}
        >
          {timestamp.toLocaleString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
};
