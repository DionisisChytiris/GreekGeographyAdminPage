import React, { useState } from "react";
import { LogIn } from 'lucide-react';
import "./Login.css";
import SignInForm from "../components/SignInForm"; // Adjust the path as needed

const AdminLogin: React.FC = () => {
  return (
    <div className="sign-in-container">
    <div className="background-animation" />
    
    <div className="form-container">
      <div className="sign-in-header">
        <div className="logo">
          <div className="logo-circle">
            <LogIn className="logo-icon" />
          </div>
        </div>
        <h1>Welcome back</h1>
        <p>
          Or{' '}
          <a href="#" className="create-account-link">
            create a new account
          </a>
        </p>
      </div>

      <SignInForm />
      </div>
    </div>

  );
};

export default AdminLogin;



