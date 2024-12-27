import React, { useEffect, useContext } from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";

const TawkMessengerScript = ({ shouldLoad }) => {
  const { storeId } = useContext(DomainContext);

  useEffect(() => {
    const loadTawkToScript = (src) => {
      const script = document.createElement("script");
      script.async = true;
      script.src = src;
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    if (storeId === 1) {
      loadTawkToScript(
        "https://embed.tawk.to/59034e2464f23d19a89afbfc/default"
      );
    } else if (storeId === 2) {
      loadTawkToScript(
        "https://embed.tawk.to/591188ac64f23d19a89b1566/default"
      );
    }
  }, [storeId]);

  useEffect(() => {
    const handleResize = () => {
      if (window.Tawk_API) {
        if (window.innerWidth < 1024) {
          window.Tawk_API.hideWidget();
        } else {
          window.Tawk_API.showWidget();
        }
      }
    };

    // Poll for Tawk_API and handle initial resize
    const pollTawkAPI = setInterval(() => {
      if (window.Tawk_API) {
        handleResize();
        clearInterval(pollTawkAPI);
      }
    }, 100);

    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(pollTawkAPI);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return null;
};

export default TawkMessengerScript;
