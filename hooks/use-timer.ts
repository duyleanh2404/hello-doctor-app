import { useState, useEffect } from "react";

const useTimer = (initialTime: number) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    else if (timeLeft === 0) {
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