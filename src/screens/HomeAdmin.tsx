
import { useNavigate } from "react-router-dom";
import "./HomeAdmin.css"; // Importing the CSS file


const HomeAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="stats-container1">
      <div className="stat-card1" onClick={() => navigate("/greekGeography")}>
        <div>Greek Geography Quiz</div>
       
         <img src='./logo.png' alt="Greek Map" className="quiz-image1" />
        <image />
      </div>
      <div className="stat-card1" onClick={() => navigate("/worldTrivia")}>
        <div>World Wise Trivia Quiz</div>
      
         <img src='./logo2.png' alt="Greek Map" className="quiz-image2" />
      </div>
    </div>
  );
};

export default HomeAdmin;
