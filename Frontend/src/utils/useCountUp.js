import { useEffect, useState } from "react";

export const useCountUp = (target, duration = 800) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(target);
    if (start === end) return;

    const incrementTime = duration / end;
    const timer = setInterval(() => {
      start += 1;
      setValue(start);
      if (start === end) clearInterval(timer);
    }, incrementTime < 10 ? 10 : incrementTime);

    return () => clearInterval(timer);
  }, [target]);

  return value;
};
