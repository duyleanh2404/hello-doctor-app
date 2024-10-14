import { useState, useEffect } from "react";

const useTimer = (initialTime: number) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsDisabled(false);
    }

    return () => clearInterval(interval);
  }, [timeLeft]);

  const resetTimer = (newTime: number) => {
    setTimeLeft(newTime);
    setIsDisabled(true);
  };

  return { timeLeft, isDisabled, resetTimer };
};

export default useTimer;