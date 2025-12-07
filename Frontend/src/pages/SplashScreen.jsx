import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Wheel from "../assets/wheel.svg";
import "./SplashScreen.css";

export default function SplashScreen() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timers = [];

    timers.push(setTimeout(() => setStage(1), 400));
    timers.push(setTimeout(() => setStage(2), 1200));
    timers.push(setTimeout(() => setStage(3), 2000));
    timers.push(setTimeout(() => setFadeOut(true), 3500));

    timers.push(
      setTimeout(() => {
        const token = localStorage.getItem("token");
        navigate(token ? "/home" : "/start");
      }, 4300)
    );

    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  return (
    <div className={`splash-screen ${fadeOut ? "fade-out" : ""}`}>
      <div className="light-glow"></div>

      <img
        src={Wheel}
        alt="Wheel"
        className={`wheel ${stage >= 1 ? "show" : ""}`}
      />

      <h1 className={`brand-text ${stage >= 2 ? "show" : ""}`}>GadiGo</h1>

      <p className={`subtitle ${stage >= 3 ? "show" : ""}`}>
        Trust the Journey
      </p>
    </div>
  );
}
