import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import HomeScreen from "./screens/HomeScreen";
import './App.css';
import AdminLogin from './screens/Login';
import HomeAdmin from './screens/HomeAdmin';
import UserMessage from './screens/UserMessage';

export default function App() {
  return (
    <div className="app">
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route path="/" element={<AdminLogin />} />
          <Route path="/homeAdmin" element={<HomeAdmin/>} />
          <Route path="/homeScreen" element={<HomeScreen />} />
          <Route path="/UserMessage/:id" element={<UserMessage/>} />
        </Routes>
      </Router>
    </div>
  );
}