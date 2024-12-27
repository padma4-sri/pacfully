import { useEffect } from "react";
import { NavigationType, useLocation, useNavigationType } from "react-router-dom";

const useBackButton = () => {
  const navType = useNavigationType();
  return navType === NavigationType.Pop;
};

const useScrollToTop = () => {
  const { pathname } = useLocation();
  const isPop = useBackButton();
  const scrollToTop = () => window.scrollTo(0, 0);

  useEffect(() => {
    setTimeout(() => {
      scrollToTop();
    }, 200);
  }, [pathname, isPop]);

  useEffect(() => {
    window.addEventListener("beforeunload", scrollToTop);
    return () => {
      window.removeEventListener("beforeunload", scrollToTop);
    };
  }, []);
};

export default useScrollToTop;