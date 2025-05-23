import React from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const navigate = useNavigate();

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
  return (
    <div className="container1">
      <header className="header">
        <div className="header-overlay">
          <h1 className="header-title">Admin Dashboard</h1>
          <p className="header-subtitle">Message Management System</p>
          <div className="logout-btn" onClick={handleLogout}>
            LogOut
          </div>
        </div>
      </header>
    </div>
  );
}

export default NavBar;
