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
    timers.push(setTimeout(() => setFadeOut(true), 3800));
    timers.push(
      setTimeout(() => {
        const token = localStorage.getItem("token");
        navigate(token ? "/home" : "/start");
      }, 4600)
    );

    return () => timers.forEach(clearTimeout);
  }, [navigate]);

  return (
    <div className={`zomato-splash ${fadeOut ? "fade-out" : ""}`}>
      <img
        src={Wheel}
        alt="Wheel"
        className={`wheel-icon ${stage >= 1 ? "show" : ""}`}
      />

      <h1 className={`brand ${stage >= 2 ? "show" : ""}`}>WHEELZY</h1>

      <p className={`tagline ${stage >= 3 ? "show" : ""}`}>
        Everyday rides, simplified.
      </p>
    </div>
  );
}
