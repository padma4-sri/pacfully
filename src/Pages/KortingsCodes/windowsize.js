import { useState, useLayoutEffect } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useLayoutEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // No dependencies to run only once on mount

  return windowSize;
};

export default useWindowSize;
