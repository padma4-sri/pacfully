
import React, { useContext, useRef } from "react";
import TypeCheckContext from "Context/TypeCheckAndDataContext";
import { useNavigate } from "react-router-dom";

const AdvancedLink = (props) => {
  const { to, className, style, children, state, pageTypeCheck, ...rest } = props;
  const { pathURL, setPathURL } = useContext(TypeCheckContext);
  const navigate = useNavigate()

  const uniqueIdRef = useRef(`link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);


  const callContext = (e) => {
    e.preventDefault();
  
    if (e.ctrlKey || e.metaKey) {
      window.open(to, "_blank");
      return;
    }
  
    if (to && pathURL !== to) {
      setPathURL({
        url: to,
        from: "",
        state,
        pageTypeCheck,
        uniqueId: uniqueIdRef.current,
      });
  
      if (pageTypeCheck === "plp_filter") {
        // Prevent scroll reset only for 'plp_filter'
        return;
      }
  
      window.scrollTo(0, 0);
  
      if (to === "/") {
        navigate(to );
      }

      if ( to === "/blog" ){
        navigate(to, { state });
      }


    }
  };
  
  const { onClick, ...filteredRest } = rest;

  // Combine the passed `onClick` with the `callContext` function
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
    callContext(e);
  };


  return (
    <a href={to} onClick={handleClick} aria-label={uniqueIdRef.current} className={className} style={style} {...filteredRest} >
      {children}
    </a >
  );
};

export default AdvancedLink;
