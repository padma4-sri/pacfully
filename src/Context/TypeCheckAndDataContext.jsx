import { StaticUrls } from "AppRoutes";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DomainContext from "./DomainContext";
import { CombinedContext } from "./CombinedContext";
const TypeCheckContext = createContext({});

export const TypeCheckProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const trimTrailingSlash = (url) => url.trim().replace(/\/$/, '');

  const { baseURL, storeId, defaultURL } = useContext(DomainContext);
  const {
    plptwosharedState,
    setPlptwoSharedState,
    plponesharedState,
    setPlponeSharedState,
    setisBackdropLoading,
    setPdpSharedState,
  } = useContext(CombinedContext);

  const defaultPageType = {
    entityType: "",
    isChildExist: null,
    level: "",
    url: "",
  };
  const [pageType, setPageType] = useState(defaultPageType);
  const [pathURL, setPathURL] = useState({
    url: location?.pathname || "",
    from: "internal",
    query_search: location?.search || "",
  });

  const pathURLOnly = useMemo(() => ({ ...pathURL }), [pathURL?.uniqueId]);

  useEffect(() => {
    if (location.pathname === "/") {
      setisBackdropLoading(false);
    }
  }, [location.pathname]);

  const fetchPDPData = async (value) => {
    try {
      const { data } = await axios.get(`${defaultURL}/pdp${value?.path}/0`);
      if (data?.length) {
        setPdpSharedState(data[0]);
        setisBackdropLoading(false);
        navigate(
          `${value?.path}${pathURL?.query_search ? pathURL?.query_search : ""}`,
          {
            state: {
              urlType: { ...value?.pageType },
              ...(pathURL?.state || {}),
              ...(pathURL?.url.includes("/zoeken/") && {
                isSearchResult: true,
              }),
            },
          }
        );
      }
    } catch (error) {
      setisBackdropLoading(false);
      console.error("Error fetching PDP data:", error);
    }
  };

  const getDetails = async (value) => {
    try {
      const queryParams = new URLSearchParams({
        limit: 14,
        page: 1,
      });

      const { data } = await axios.get(
        `${defaultURL} /customapi/categoryproducts/2?${queryParams.toString()}`
      );

      if (!data?.length) return;

      setPlptwoSharedState(data[0]);
      setisBackdropLoading(false);

      const navigationState = {
        state: {
          urlType: value.pageType,
          ...(pathURL?.state || {}),
          ...(pathURL?.url.includes("/zoeken/") && { isSearchResult: true }),
        },
      };
      navigate(
        `${pathURL?.url}${pathURL?.query_search ? pathURL?.query_search : ""}`,
        navigationState
      );
    } catch (error) {
      console.error("Error fetching details:", error);
      setisBackdropLoading(false);
    }
  };
  const getPLPOneDetails = async (value) => {
    try {
      const queryParams = `${defaultURL}/plp/categoryview?data[catUrl]=${pathURL?.url}&data[customerId]=0&data[categoryId]=&data[storeId]=${storeId}&data[page]=0`;

      const { data } = await axios.get(queryParams);

      if (data?.length) {
        setPlponeSharedState({
          ...data[0],
          location: `/${pathURL?.url?.slice(1)}`,
        });
        navigate(
          `${pathURL?.url}${
            pathURL?.query_search ? pathURL?.query_search : ""
          }`,
          {
            state: {
              urlType: value.pageType,
              ...pathURL?.state,
              ...(pathURL?.url.includes("/zoeken/") && {
                isSearchResult: true,
              }),
            },
          }
        );
      }
    } catch (error) {
      console.error("Error fetching PLP details:", error);
    } finally {
      setisBackdropLoading(false);
    }
  };

  useEffect(() => {
    //page type API call
    const fetchPageType = async (url) => {

      try {
        const { data } = await axios.get(`${baseURL}/page/typecheck`, {
          params: {
            targetPath:trimTrailingSlash(url),
            storeId: storeId,
          },
        });
        // if (data?.[0]?.message === "Given url doesn't exist") {
        //   return {
        //     pageType: "zoeken",
        //     url: `/zoeken/zoekterm=${url.slice(1)}`,
        //   };
        // }

        return { ...data?.[0], url };
      } catch (error) {
        return defaultPageType;
      }
    };

    const handleNavigation = (path, pageType, state) => {
      if (path && path !== "/" && path.from !== "internal") {
        if (
          (pageType?.entityType === "category" && pageType?.level >= "3") ||
          pageType?.entityType === "zoeken" ||
          pageType?.isChildExist === 0
        ) {
          setisBackdropLoading(true);
          getDetails({ path, pageType });
        } else {
          navigate(
            `${path}${pathURL?.query_search ? pathURL?.query_search : ""}`,
            {
              state: {
                urlType: { ...pageType },
                ...(state && state),
                ...(path.includes("/zoeken/") && { isSearchResult: true }),
              },
            }
          );
        }
      }
    };

    // Destructure values from pathURLOnly
    const { state, pageTypeCheck, url } = pathURLOnly || {};
    const { urlType, categoryData } = state || {};
    const isPDPView = pageTypeCheck === "pdpView";
    const isCategoryLevel2 =
      urlType?.entityType === "category" && urlType?.level === "2";
    const isCategoryLevel3 =
      urlType?.entityType === "category" && urlType?.level >= "3";
    const isSearchResult = url?.includes("/zoeken/");
    const name = pathURLOnly?.url?.split("/")?.[1];
    const isStaticUrl = StaticUrls.some((path) => path.split("/")[1] === name);

    // Avoid unnecessary API calls and state updates
    if (!urlType?.level && !categoryData?.catUrl) {
      if (
        pathURLOnly?.url &&
        pathURLOnly?.url !== "/" &&
        pathURLOnly?.url !== "/zoeken/" &&
        !isStaticUrl
      ) {
        if (isPDPView) {
          setisBackdropLoading(true);
          fetchPDPData({ path: pathURLOnly.url, pageType });
        } else {
          fetchPageType(pathURLOnly.url).then((pageType) => {
            setPageType(pageType);

            if (pageType?.redirect_path) {
              navigate(`/${pageType.redirect_path}`, { replace: true });
              return;
            }
            
            if (pageType?.message === "Given url doesn't exist") {
              const formattedPath = location?.pathname?.slice(1).replace(/-/g, " ");
              navigate(
                `${
                  location?.pathname?.includes("/zoeken/zoekterm=")
                    ? location?.pathname?.slice(1)
                    : `/zoeken/zoekterm=${formattedPath}`
                }`,
                {
                  state: {
                    isSearchResult: true,
                    value: location?.pathname?.slice(1),
                  },
                }
              );
            } else {
              handleNavigation(pathURLOnly.url, pageType, state);
            }
          });
        }
      }
    } else {
      setPageType(pathURLOnly);
      if (!plponesharedState?.breadCrums?.length && isCategoryLevel2) {
        setisBackdropLoading(true);
        getPLPOneDetails({ path: pathURLOnly.url, pageType });
      } else if (!plptwosharedState?.breadCrums?.length && isCategoryLevel3) {
        setisBackdropLoading(true);
        getDetails({ path: pathURLOnly.url, pageType });
      } else {
        navigate(
          `${url}${pathURL?.query_search ? pathURL?.query_search : ""}`,
          {
            state: {
              urlType: { ...pageType },
              ...state,
              ...(isSearchResult && { isSearchResult: true }),
            },
          }
        );
      }
    }
  }, [pathURLOnly]);

  return (
    <TypeCheckContext.Provider value={{ pageType, pathURL, setPathURL }}>
      {children}
    </TypeCheckContext.Provider>
  );
};

export default TypeCheckContext;
