import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import HomeScreen from "./screens/HomeScreen";
import "./App.css";
import AdminLogin from "./screens/Login";
import HomeAdmin from "./screens/HomeAdmin";
import UserGreekQuizMessage from "./screens/UserGreekQuizMessage";
import UserTriviaMessage from "./screens/UserTriviaMessage";
import NavBar from "./screens/NavBar";
import GreekGeographyScreen from "./screens/GreekGeographyScreen";
import WorldTriviaScreen from "./screens/WorldTriviaScreen";

function AppContent() {
  const location = useLocation();
  const hideNav = location.pathname === '/';

  return (
    <>
      {!hideNav && <NavBar />}
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/homeAdmin" element={<HomeAdmin />} />
        <Route path="/homeScreen" element={<HomeScreen />} />
        <Route path="/UserGreekQuizMessage/:id" element={<UserGreekQuizMessage />} />
        <Route path="/UserTriviaMessage/:userId" element={<UserTriviaMessage />} />
        <Route path="/greekGeography" element={<GreekGeographyScreen/>}/>
        <Route path="/worldTrivia" element={<WorldTriviaScreen/>}/>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <div className="app">
      <Toaster position="top-center" />
      <Router>
        <AppContent />
      </Router>
    </div>
  );
}