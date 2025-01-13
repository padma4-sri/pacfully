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
      !plponesharedState?.categoryProducts ||
      !plponesharedState.categoryProducts[0]
    ) {
      return null; // or handle accordingly if data is not available
    }
    return Object.values(plponesharedState.categoryProducts[0]).map(
      (item, index) => (
        <React.Fragment key={`plpData_${item?.title}_${index}`}>
          {item?.data?.length ? (
            <ProductSlider
              title={item?.title}
              subTitle={item?.subTitle}
              showToGo={true}
              data={!loadPreRender ? item?.data : item?.data?.slice(0, 4)}
              toGo={item?.urlKey}
              showAllLastCard
              pageName="plp1"
              index={index}
            />
          ) : (
            ""
          )}
        </React.Fragment>
      )
    );
  }, [plponesharedState?.categoryProducts, page]);

 
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
          categoryProducts: [
            {
              ...res?.data[0]?.categoryProducts?.[0],
            },
          ],
        });
      } else if (
        res?.data?.[0]?.categoryProducts?.length &&
        plponesharedState?.location === location.pathname
      ) {
        setPlponeSharedState({
          ...plponesharedState,
          categoryProducts: plponesharedState?.categoryProducts?.map(
            (category) => {
              const newCategory = res?.data?.[0]?.categoryProducts?.find(
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
                  ...plponesharedState?.categoryProducts?.[0],
                  ...res?.data?.[0]?.categoryProducts?.[0],
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
      url: `${defaultURL}/plp/categoryview?data[catUrl]=${location?.pathname?.slice(
        1
      )}&data[customerId]=0&data[categoryId]=&data[storeId]=${storeId}&data[page]=${parseInt(
        page
      )}`,
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
              data={plponesharedState?.categoryDescription}
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

          <div className="product__reultsddd pt-6 pb-6 lg-pt-5 lg-pb-12">
            <FeaturesSection
              data={plponesharedState?.features}
              loading={!plponesharedState?.features?.length ? loading : false}
              className=" plp2 features__sliders plp1"
              isFeatures={true}
              isPlp1={true}
            />
          </div>

          <div>
            {plponesharedState?.categoryProducts &&
            plponesharedState?.categoryProducts?.[0] &&
            Object.values(plponesharedState?.categoryProducts?.[0])?.length ? (
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
            {loading && !plponesharedState?.promotionMainBanner?.length ? (
              <Ecobanner loading={loading} />
            ) : plponesharedState?.promotionMainBanner?.length ? (
              <Ecobanner
                loading={false}
                img={plponesharedState?.promotionMainBanner?.[0]?.image}
                title={plponesharedState?.promotionMainBanner?.[0]?.headerTitle}
                buttonText={
                  plponesharedState?.promotionMainBanner?.[0]?.buttonTitle
                }
                description={
                  plponesharedState?.promotionMainBanner?.[0]?.headerContent
                }
                button_url={
                  plponesharedState?.promotionMainBanner?.[0]?.buttonUrl
                }
                backgroundColor={
                  plponesharedState?.promotionMainBanner?.[0]?.backgroundColor
                }
              />
            ) : (
              <></>
            )}
          </div>
          <div>
            <MundoRating
              loading={!plponesharedState?.breadCrums?.length ? loading : false}
              getReviews={plponesharedState?.reviews}
              getMondu={plponesharedState?.mondu && plponesharedState?.mondu[0]}
            />
          </div>
          {!loading && recentProducts?.length ? (
            <div
              className={`${
                plponesharedState?.staticContents?.[0]?.block ? "pb-16" : "pb-0"
              }`}
            >
              <ProductSlider
                title="Recent bekeken"
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
          <VisibleWarp>
            {loading && !plponesharedState?.staticContents ? (
              <div className="container-fluid plp__infoblock">
                <Infoblock
                  getInfo={plponesharedState?.staticContents}
                  loading={true}
                />
              </div>
            ) : plponesharedState?.staticContents?.[0]?.block ? (
              <div className="container-fluid plp__infoblock">
                <Infoblock
                  getInfo={plponesharedState?.staticContents}
                  loading={false}
                />
              </div>
            ) : (
              <></>
            )}
          </VisibleWarp>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PlpDescription;
