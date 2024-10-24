import { useEffect, useRef } from "react";

const useStopwatchInterval = () => {
  const stopwatchTimerRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      stopwatchTimerRef.current?.play(); // Call the `play` method on the ref
    }, 1000); // Run this every second

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  return stopwatchTimerRef;
};

export default useStopwatchInterval;
