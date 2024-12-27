import React, { useEffect, useState, useContext, memo, useRef } from "react";
import MainCategories from "Components/Product/ProductListing/MainCategories";
import SubCategories from "Components/Product/ProductListing/SubCategories";
import ProductDetails from "Components/Product/ProductDetails";
import "./styles.scss";

import DomainContext from "Context/DomainContext";
import { useLocation, useNavigate } from "react-router-dom";
import { APIQueryGet } from "APIMethods/API";

const ProductPage = () => {
  const navigate = useNavigate();
  const { storeId, defaultURL } = useContext(DomainContext);
  const location = useLocation();
  const [checkUrlType, setCheckUrlType] = useState({});
  const APIReference = useRef(false);
  const prevPathNameRef = useRef(location.pathname);
  const uniqueId = useRef()

  useEffect(() => {
    if (location?.state?.urlType) {
      setCheckUrlType(location?.state?.urlType);
    }
  }, [location?.state?.urlType]);

  useEffect(() => {
    const fetchData = async () => {
      const trimTrailingSlash = (url) => url.trim().replace(/\/$/, '');

      uniqueId.current = `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      if (location?.state?.urlType) return;
      if (
        !APIReference.current &&
        !(
          location?.state?.isSearchResult ||
          location?.pathname?.includes("/zoeken/")
        )
      ) {
        const options = {
          isLoader: false,
          loaderAction: (bool) => bool,
          setGetResponseData: (res) => {
            setCheckUrlType(res?.data?.[0]);
            
            if ( res?.data?.[0]?.redirect_path){
              navigate(res?.data?.[0]?.redirect_path);
              return;
            }
            if (res?.data?.[0]?.message === "Given url doesn't exist") {
              const formattedPath = location?.pathname?.slice(1).replace(/-/g, " ");
              navigate(`/zoeken/zoekterm=${formattedPath}`, {
                state: {
                  isSearchResult: true,
                  value: location?.pathname?.slice(1),
                },
              });
            }
          },
          axiosData: {
            url: `${defaultURL}/page/typecheck?storeId=${storeId}&targetPath=${trimTrailingSlash(location.pathname?.slice(1))}`,
          },
        };
        APIReference.current = true;
        await APIQueryGet(options);
        setTimeout(() => (APIReference.current = false), 300);
      }
    };

    fetchData();
  }, [
    location?.pathname,
    location?.state?.urlType,
    defaultURL,
    storeId,
    navigate,
  ]);

  const renderContent = () => {
    const entityType =
      location?.state?.urlType?.entityType || checkUrlType?.entityType;
    const level = location?.state?.urlType?.level || checkUrlType?.level;
    const isChildExistVal =
      location?.state?.urlType?.isChildExist || checkUrlType?.isChildExist;
    const isSearchResult = location?.state?.isSearchResult;
    const pathname = location?.pathname;

    if (isSearchResult || pathname?.includes("/zoeken/")) {
      return <SubCategories />;
    } else {
      if (entityType === "category" && level >= "3") {
        return <SubCategories />;
      }
      if (
        entityType === "category" &&
        (level === "2" || isChildExistVal === 1)
      ) {
        return (
          <MainCategories
            locationChange={location.pathname}
            forceRerender={uniqueId.current}
          />
        );
      }
      if (entityType === "product") {
        return <ProductDetails />;
      }
    }
    if (
      prevPathNameRef.current === location.pathname ||
      pathname?.includes("/zoeken/")
    ) {
      if (
        (checkUrlType?.entityType === "category" &&
          checkUrlType?.level >= "3") ||
        isSearchResult ||
        pathname?.includes("/zoeken/") ||
        checkUrlType?.isChildExist === 0
      ) {
        return <SubCategories />;
      }

      if (
        checkUrlType?.entityType === "category" &&
        (checkUrlType?.level === "2" || checkUrlType?.isChildExist === 1)
      ) {
        return (
          <MainCategories
            locationChange={location.pathname}
            forceRerender={uniqueId.current}
          />
        );
      }

      if (checkUrlType?.entityType === "product") {
        return <ProductDetails />;
      }
    }
    return null;
  };

  return (
    <div className="plp_products__container py-4 relative" key={location.pathname}>
      {renderContent()}
    </div>
  );
};

export default memo(ProductPage);
