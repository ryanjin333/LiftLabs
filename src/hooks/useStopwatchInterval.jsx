import { useEffect, useRef } from "react";

const useStopwatchInterval = () => {
  const stopwatchTimerRef = useRef(null);

  useEffect(() => {
    stopwatchTimerRef.current?.startTimer(); // Call the `startTimer` method on the ref
    // Run this every second

    // return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  return stopwatchTimerRef;
};

export default useStopwatchInterval;
