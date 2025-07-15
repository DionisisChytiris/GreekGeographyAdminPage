import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import AdminLogin from "./screens/Login";
import HomeAdmin from "./screens/HomeAdmin";
import UserGreekQuizMessage from "./screens/UserGreekQuizMessage";
import UserTriviaMessage from "./screens/UserTriviaMessage";
import NavBar from "./NavBar";
import GreekGeographyScreen from "./screens/GreekGeographyScreen";
import WorldTriviaScreen from "./screens/WorldTriviaScreen";
import GreekWebsite from "./screens/GreekWebsite";
import TriviaWebsite from "./screens/TriviaWebsite";
import PortofolioWebsite from './screens/PortofolioWebsite'

function AppContent() {
  const location = useLocation();
  const hideNav = location.pathname === '/';

  return (
    <>
      {!hideNav && <NavBar />}
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/homeAdmin" element={<HomeAdmin />} />
        <Route path="/UserGreekQuizMessage/:id" element={<UserGreekQuizMessage />} />
        <Route path="/UserTriviaMessage/:userId" element={<UserTriviaMessage />} />
        <Route path="/greekGeography" element={<GreekGeographyScreen/>}/>
        <Route path="/worldTrivia" element={<WorldTriviaScreen/>}/>
        <Route path="/greekWebsite" element={<GreekWebsite/>}/>
        <Route path="/triviaWebsite" element={<TriviaWebsite/>}/>
        <Route path="/portofolioWebsite" element={<PortofolioWebsite/>}/>
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