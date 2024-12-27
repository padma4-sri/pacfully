import React, { createContext, useState } from "react";

export const CombinedContext = createContext();

export const CombinedProvider = ({ children }) => {
  const [plponesharedState, setPlponeSharedState] = useState([]);
  const [plptwosharedState, setPlptwoSharedState] = useState([]);
  const [pdpsharedState, setPdpSharedState] = useState([]);
  const [isBackdropLoading, setisBackdropLoading] = useState(false);

  return (
    <CombinedContext.Provider
      value={{
        plponesharedState,
        setPlponeSharedState,
        plptwosharedState,
        setPlptwoSharedState,
        isBackdropLoading,
        setisBackdropLoading,
        pdpsharedState,
        setPdpSharedState,
      }}
    >
      {children}
    </CombinedContext.Provider>
  );
};
