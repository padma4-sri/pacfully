import React, { useState, useEffect, useRef, useContext } from "react";
import RenderContext from "./RenderContext";

const VisibleWarp = ({ children }) => {
  const userAgent = navigator.userAgent;
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const { loadPreRender } = useContext(RenderContext);
  const callbackFunction = (entries) => {
    const [entry] = entries;
    if (!isVisible && entry.isIntersecting) {
      setIsVisible(entry.isIntersecting);
    }
  };
  const options = {
    root: null,
    rootMargin: "200px",
    threshold: 0,
  };
  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, options);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [containerRef, options]);
  useEffect(() => {
    if (userAgent.match(`renderly`)?.[0]) {
      setIsVisible(true);
    }
  }, []);

  return (
    <>
      {(isVisible || loadPreRender) && children ? (
        children
      ) : (
        <div style={{ margin: "5em 0" }} ref={containerRef}>
          <p style={{ visibility: "hidden" }}>Loading.....</p>
        </div>
      )}
    </>
  );
};
export default VisibleWarp;
