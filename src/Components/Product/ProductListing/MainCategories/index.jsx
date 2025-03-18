import React, { useEffect, useState, useContext, useRef } from "react";
import { useSelector } from "react-redux";
import DomainContext from "Context/DomainContext";
import { CombinedContext } from "Context/CombinedContext";
import { useLocation } from "react-router-dom";
import Breadcrumb from "Components/Breadcrumb";
import CategoriesDescription from "../PlpCommon/CategoriesDescription";
import Categories from "Components/Categories";
import ProductSlider from "Components/ProductSlider";
import MundoRating from "Components/Home/MundoRating";
import Infoblock from "../PlpCommon/InfoBlock";
import FeaturesSection from "../PlpCommon/FeaturesSection";
import { APIQueryGet } from "APIMethods/API";
import useScrollToTop from "Components/Hooks/useScrollToTop";
import Ecobanner from "Components/Ecobanner/Ecobanner";
import "./styles.scss";
import RenderContext from "Context/RenderContext";
import VisibleWarp from "Context/VisibleWrapper";

const PlpDescription = ({ locationChange, forceRerender }) => {
  const recentProducts = useSelector((state) => state?.recentProducts);
  const { defaultURL, storeId } = useContext(DomainContext);
  const { loadPreRender } = useContext(RenderContext);
  const { plponesharedState, setPlponeSharedState, setisBackdropLoading } =
    useContext(CombinedContext);
  const [page, setPage] = useState(0);
  useScrollToTop();
  const [loading, setProductpageLoading] = useState(true);
  const location = useLocation();
  const APIRef = useRef(true);
  const [isCalled, setIsCalled] = useState(false);
  const [isApiStopped, setIsApiStopped] = useState(false); 
  const trimTrailingSlash = (url) => url.trim().replace(/\/$/, '');

  const dataBlock = React.useMemo(() => {
    if (
      !plponesharedState?.products?.length
    ) {
      return null; // or handle accordingly if data is not available
    }
    return (
        <React.Fragment key={`plpData_0`}>
          { plponesharedState.products?.length ? (
            <ProductSlider
              title={plponesharedState?.categoryDescription?.categoryName}
              // subTitle={item?.subTitle}
              showToGo={true}
              data={!loadPreRender ? plponesharedState.products : plponesharedState.products?.slice(0, 4)}
              // toGo={item?.urlKey}
              showAllLastCard
              pageName="plp1"
              // index={index}
            />
          ) : (
            ""
          )}
        </React.Fragment>
    );
  }, [plponesharedState?.products, page]);

 
  const optionsFirst = {
    isLoader: true,
    loaderAction: (bool) => setProductpageLoading(false),
    setGetResponseData: (res) => {
      setIsCalled(true);
      if (parseInt(page) === 0 && !isCalled) {
        setPlponeSharedState({
          ...res?.data?.[0],
          location: location.pathname,
        });
      } else if (
        parseInt(page) === 1 &&
        plponesharedState?.location === location.pathname
      ) {
        setPlponeSharedState({
          ...plponesharedState,
          products: [
            {
              ...res?.data[0]?.products?.[0],
            },
          ],
        });
      } else if (
        res?.data?.[0]?.products?.length &&
        plponesharedState?.location === location.pathname
      ) {
        setPlponeSharedState({
          ...plponesharedState,
          products: plponesharedState?.products?.map(
            (category) => {
              const newCategory = res?.data?.[0]?.products?.find(
                (newCat) => {
                  const key = Object.keys(newCat)[0];
                  return newCat[key]?.subTitle === category[key]?.subTitle;
                }
              );
              if (newCategory) {
                const key = Object.keys(newCategory)[0];
                return {
                  ...category,
                  [key]: {
                    ...category[key],
                    data: [
                      ...category[key]?.data,
                      ...newCategory[key]?.data,
                    ],
                  },
                };
              } else {
                return {
                  ...plponesharedState?.products,
                  ...res?.data?.[0]?.products,
                };
              }
            }
          ),
        });
      }
      if (res?.data?.[0]?.page_size > parseInt(page) + 1) {
        setPage(parseInt(page) + 1);
        APIRef.current = false;
      }
    },
    axiosData: {
      url: `${defaultURL}/plp/categoryview?data[catUrl]=boxpac&data[page]=1`,
    },
    getStatus: (res) => {
      if (parseInt(page) <= 1) {
        setTimeout(() => {
          setisBackdropLoading(false);
        }, [100]);
      }
      APIRef.current = false;
    },
  };

  


  useEffect(() => {
    setPage((prevPage) => (prevPage === 0 ? "0" : 0));
    setisBackdropLoading(true);
    setIsCalled(false);
    APIRef.current = false;
    return () => {
      setPage((prevPage) => (prevPage === 0 ? "0" : 0));
      setIsCalled(false);
      APIRef.current = false;
    };
  }, [location.pathname]);

  // useEffect(() => {
  //   if (
  //     !APIRef.current &&
  //     (plponesharedState?.location === location.pathname ||
  //       (plponesharedState?.location !== location.pathname && page == 0))
  //   ) {
  //     APIQueryGet(optionsFirst);
  //     APIRef.current = true;
  //   }
  // }, [page]);
 
  useEffect(() => {
    const handleClick = () => {
      setIsApiStopped(true); 
    };

    document.addEventListener("click", handleClick);

    if (
      !APIRef.current &&
      !isApiStopped && 
      (plponesharedState?.location === location.pathname ||
        (plponesharedState?.location !== location.pathname && page === 0))
    ) {
      APIQueryGet(optionsFirst);
      APIRef.current = true;
    }

    return () => {
      document.removeEventListener("click", handleClick); 
    };
  }, [page, isApiStopped]); 

  return (
    <React.Fragment key={`plp_page_${locationChange}-${forceRerender}`}>
    
      <div className="main__categories__container">
        <div className="main__categories__wrapper pb-4">
          <Breadcrumb
            type="plpParentCategories"
            data={plponesharedState?.breadCrums}
            loading={!plponesharedState?.breadCrums?.length ? loading : false}
          />
          <div className="container">
            <CategoriesDescription
              dsata={plponesharedState?.categoryDescription}
              loading={
                !plponesharedState?.categoryDescription?.title ? loading : false
              }
            />
          </div>
          <div className="plp__categories">
            <Categories
              data={plponesharedState?.chooseCategory?.data}
              title={plponesharedState?.chooseCategory?.title}
              keyValue={`plp${plponesharedState?.chooseCategory?.data?.[0]?.id}`}
              isPLP2
              loading={
                !plponesharedState?.chooseCategory?.title ? loading : false
              }
            />
          </div>

         

          <div>
            {plponesharedState?.products &&
            plponesharedState?.products &&
         plponesharedState?.products?.length ? (
              dataBlock
            ) : (
              <></>
            )}
            {loading ? (
              ["", ""].map((item, ind) => (
                <React.Fragment key={`plp1Productsloader${ind + 1}`}>
                  <ProductSlider
                    title="Laden"
                    data={[]}
                    showToGo={false}
                    pageName="plp1"
                  />
                </React.Fragment>
              ))
            ) : (
              <></>
            )}
           
          </div>
        
          {!loading && recentProducts?.length ? (
            <div
              className={`${
                plponesharedState?.staticContents?.[0]?.block ? "pb-16" : "pb-0"
              }`}
            >
              <ProductSlider
                title="Recently viewed"
                data={
                  !loadPreRender ? recentProducts : recentProducts?.slice(0, 4)
                }
                showToGo={false}
                loading={loading}
                pageName="plp1"
              />
            </div>
          ) : (
            <></>
          )}
         
        </div>
      </div>
    </React.Fragment>
  );
};

export default PlpDescription;
