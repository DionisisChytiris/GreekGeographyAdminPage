// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./styles/HomeAdmin.css"; // Importing the CSS file
// import { FaBell } from "react-icons/fa";
// import axios from "axios";

// const HomeAdmin = () => {
//   const navigate = useNavigate();
//   const [messageStats, setMessageStats] = useState({
//     total: 0,
//     read: 0,
//     unread: 0,
//   });
//   const app_id = "greek-geography";

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [clientsRes, datesRes, statsRes] = await Promise.all([
//           axios.get(
//             `https://greek-geography-quiz-app-backend.vercel.app/client_ids?app_id=${app_id}`
//           ),
//           axios.get(
//             `https://greek-geography-quiz-app-backend.vercel.app/last_message_dates?app_id=${app_id}`
//           ),
//           axios.get(
//             `https://greek-geography-quiz-app-backend.vercel.app/message_stats?app_id=${app_id}`
//           ),
//         ]);
//         setMessageStats(statsRes.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div className="stats-container1">
//       <div className="stat-card1" onClick={() => navigate("/greekGeography")}>
//         <div>Greek Geography Quiz App</div>

//         <img src="./logo.png" alt="greek Map" className="quiz-image1" />

//       {messageStats.unread !== 0 && (
//         <>
//         <div className="notification-badge">
//           <FaBell />
//         </div>
//         <p className="notification-badge">{messageStats.unread}</p>
//         </>
//       )}

//       </div>

//       <div className="stat-card1" onClick={() => navigate("/worldTrivia")}>
//         <div>World Wise Trivia Quiz App</div>

//         <img src="./logo2.png" alt="greek Map" className="quiz-image2" />
//       </div>

//       <div className="stat-card1" onClick={() => navigate("/greekWebsite")}>
//         <div>Greek Geography Website</div>

//         <img src="./greekApp.png" alt="greek Map" className="quiz-image3" />
//       </div>

//       <div className="stat-card1" onClick={() => navigate("/triviaWebsite")}>
//         <div>World Wise Trivia Website</div>

//         <img src="./worldTrivia.png" alt="greek Map" className="quiz-image3" />
//       </div>

//       <div
//         className="stat-card1"
//         onClick={() => navigate("/portofolioWebsite")}
//       >
//         <div>Portofolio Website</div>

//         <img src="./adminPanel.png" alt="greek Map" className="quiz-image3" />
//       </div>
//     </div>
//   );
// };

// export default HomeAdmin;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/HomeAdmin.css"; // Importing the CSS file
import { FaBell } from "react-icons/fa";
import axios from "axios";

const apps = [
  {
    id: "greek-geography",
    name: "Greek Geography Quiz App",
    logo: "./logo.png",
    route: "/greekGeography",
  },
  {
    id: "greek-website",
    name: "Greek Geography Website",
    logo: "./greekApp.png",
    route: "/greekWebsite",
  },
  {
    id: "trivia-website",
    name: "World Wise Trivia Website",
    logo: "./worldTrivia.png",
    route: "/triviaWebsite",
  },
  {
    id: "portofolio-website",
    name: "Portfolio Website",
    logo: "./adminPanel.png",
    route: "/portofolioWebsite",
  },
];

const HomeAdmin = () => {
  const navigate = useNavigate();
  const [statsByApp, setStatsByApp] = useState<
    Record<string, { total: number; read: number; unread: number }>
  >({});

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        const statsPromises = apps.map((app) =>
          axios
            .get(
              `https://greek-geography-quiz-app-backend.vercel.app/message_stats?app_id=${app.id}`
            )
            .then((res) => ({ appId: app.id, stats: res.data }))
            .catch(() => ({
              appId: app.id,
              stats: { total: 0, read: 0, unread: 0 },
            }))
        );

        const results = await Promise.all(statsPromises);
        const statsMap: Record<
          string,
          { total: number; read: number; unread: number }
        > = {};
        results.forEach(({ appId, stats }) => {
          statsMap[appId] = stats;
        });

        setStatsByApp(statsMap);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchAllStats();
  }, []);

  return (
    <div className="stats-container1">
      <div className="stat-card1" onClick={() => navigate("/worldTrivia")}>
        <div>World Wise Trivia Quiz App</div>

        <img src="./logo2.png" alt="greek Map" className="quiz-image2" />
      </div>
      {apps.map(({ id, name, logo, route }) => {
        const stats = statsByApp[id] || { total: 0, read: 0, unread: 0 };
        return (
          <div key={id} className="stat-card1" onClick={() => navigate(route)}>
            <div>{name}</div>
            <img src={logo} alt={`${name} logo`} className={id === "greek-geography" ? "quiz-image1" : "quiz-image3"}/>
            {stats.unread > 0 && (
              <>
                <div className="notification-badge1">
                  <FaBell />
                </div>
                <p className="notification-badge2">{stats.unread}</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HomeAdmin;
