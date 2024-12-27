import { createContext, useState, useEffect } from "react";
const RenderContext = createContext({});

export const RenderProvider = ({ children }) => {
  const [loadIfUser, setLoadIfUser] = useState(false);
  const [loadPreRender, setLoadPreRender] = useState(false);
  const userAgent = navigator.userAgent;

  useEffect(() => {
    const events = [
      "mousemove",
      "touchstart",
      "touchend",
      "touchmove",
      "onScroll",
    ];
    const afterEvent = (e) => setLoadIfUser(true);
    if (userAgent.match(`renderly`)?.[0]) setLoadPreRender(true);
    for (let i = 0, l = events.length; i < l; i++)
      document.addEventListener(events[i], afterEvent, false);
    return () =>
      events.forEach((e) => document.removeEventListener(e, afterEvent), false);
  }, []);

  return (
    <RenderContext.Provider
      value={{
        loadIfUser,
        loadPreRender,
      }}
    >
      {children}
    </RenderContext.Provider>
  );
};

export default RenderContext;
