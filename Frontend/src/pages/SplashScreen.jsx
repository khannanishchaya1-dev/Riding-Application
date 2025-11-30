import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Wheel from "../assets/wheel.svg"; // Make sure path is correct
import "./SplashScreen.css";

export default function SplashScreen() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timers = [];

    // Text animations timing
    timers.push(setTimeout(() => setStage(1), 300));   // Show: WELCOME TO
    timers.push(setTimeout(() => setStage(2), 1000));  // Start typing WHEELZY
    timers.push(setTimeout(() => setStage(3), 1800));  // Show tagline

    // Stop cursor + bounce
    timers.push(setTimeout(() => {
      const el = document.querySelector(".wheelzy");
      if (el) el.classList.add("done");
    }, 2000));

    // Show wheel animation trigger
    timers.push(setTimeout(() => {
      setStage(4);
    }, 2200));

    // Fade out after wheel finishes moving
    timers.push(setTimeout(() => {
      setFadeOut(true);
    }, 4000));

    // Redirect when animation is complete
    timers.push(setTimeout(() => {
      const token = localStorage.getItem("token");
      navigate(token ? "/home" : "/start");
    }, 4600));

    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  return (
    <div className={`splash-container ${fadeOut ? "fade-out" : ""}`}>
      <div className="text-box">

        <h1 className={`welcome ${stage >= 1 ? "show" : ""}`}>
          WELCOME TO
        </h1>

        <h2 className={`wheelzy ${stage >= 2 ? "typing show" : ""}`}>
          <span>WHEELZY</span>
        </h2>

        <p className={`proud ${stage >= 3 ? "show" : ""}`}>
          PROUD TO BE WHEELZIAN
        </p>

      </div>

      {/* Wheel + Skid when stage is active */}
      {stage >= 4 && (
        <>
          <img
            src={Wheel}
            alt="wheel"
            className={`wheel enter`}
          />
          <div className="skid"></div>
        </>
      )}
    </div>
  );
}
