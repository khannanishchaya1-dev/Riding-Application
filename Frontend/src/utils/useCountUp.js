import { useEffect, useState } from "react";

export const useCountUp = (target, duration = 800) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTime = null;
    const startValue = 0;
    const endValue = Number(target);

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;
      const progressRatio = Math.min(progress / duration, 1);

      const currentValue = Math.floor(
        progressRatio * (endValue - startValue) + startValue
      );

      setValue(currentValue);

      if (progressRatio < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return value.toLocaleString();
};
