import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Input from './Input';
import './SignInForm.css';
import axios from 'axios';

const SignInForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  const navigate = useNavigate(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    setIsSubmitting(true); // Disable the button while submitting

    try {
      const response = await axios.post('https://greek-geography-quiz-app-backend.vercel.app/login', {
        email,
        password,
      });

      const { token } = response.data;
      setToken(token);

      // Store token (e.g., in localStorage or AsyncStorage)
      localStorage.setItem('admin_token', token);
      alert('Login successful!');
      
      navigate('/homeAdmin'); // Redirect to home screen after login

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsSubmitting(false); // Re-enable the button after submission
    }
  };

  // const handleLogin = async () => {
  //   try {
  //     const response = await fetch("https://greek-geography-quiz-app-backend.vercel.app/login", {
  //       method: "POST",
  //       credentials: "include", // Sends the cookie along with the request
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email,
  //         password,
  //       }),
  //     });
  
  //     if (!response.ok) {
  //       throw new Error("Login failed");
  //     }
  
  //     const data = await response.json();
  //     const { token } = data;
  //     // Token is now stored in the browser cookies automatically
  //     alert("Login successful!");
  //       //     alert('Login successful!');
      
  // //     navigate('/homeScreen'); // Redirect to home screen after login
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     alert("Login failed!");
  //   }
  // };
  

  return (
    <form className="sign-in-form" onSubmit={handleLogin}>
      <Input
        type="email"
        label="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) setEmailError('');
        }}
        error={emailError}
        placeholder="Enter your email"
      />
      
      <div className="password-container">
        <Input
          type={showPassword ? 'text' : 'password'}
          label="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (passwordError) setPasswordError('');
          }}
          error={passwordError}
          placeholder="Enter your password"
        />
      </div>
      
      <div className="form-options">
        <label className="remember-me">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          <span className="checkmark"></span>
          <span>Remember me</span>
        </label>
        <a href="#" className="forgot-password">Forgot password?</a>
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
      
      <p className="sign-up-link">
        Don't have an account? <a href="#">Create Account</a>
      </p>
    </form>
  );
};

export default SignInForm;
