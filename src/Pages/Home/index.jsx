import React, { memo, useContext, useEffect,useRef } from 'react';
import Categories from "../../Components/Categories";
import ProductSlider from "Components/ProductSlider";
import BannerContent from "../../Components/BannerContent";
import Storebanner from "../../Components/Home/Storebanner";
import Infoblock from "../../Components/Home/Infoblock";
import Blog from "../../Components/Home/Blog";
import MundoRating from "../../Components/Home/MundoRating";
import { useSelector ,useDispatch} from 'react-redux';
import useScrollToTop from 'Components/Hooks/useScrollToTop';
import DomainContext from 'Context/DomainContext';
import Ecobanner from 'Components/Ecobanner/Ecobanner';
import RenderContext from 'Context/RenderContext';
import VisibleWarp from "Context/VisibleWrapper"
import { Helmet } from 'react-helmet-async';
import { APIQueryGet } from 'APIMethods/API';
import {useLocation} from "react-router-dom";
import { ACTION_HOMEPAGE__LOADING ,ACTION_FETCH__HOMEPAGE} from 'Store/action';
import { useEffectOnce } from 'Components/Hooks/useEffectOnce';

const Home = () => {
  const { storeId,defaultURL } = useContext(DomainContext);
  const { loadIfUser, loadPreRender } = useContext(RenderContext);
  useScrollToTop();
  const location = useLocation()
  const dispatch = useDispatch()
  const homePageLoading = useSelector(state => state?.homePageLoading);
  const featuredProducts = useSelector(state => state?.getHomePageData?.data?.featuredProducts);
  // const featuredProducts = useSelector((state) => state?.getFeatureProduct);
  const getStaticBannerData = useSelector(state => state?.getHomePageData?.data?.bannerData?.promotionMainBanner?.[0]);
  const popularCategory = useSelector(state => state?.getHomePageData?.data?.popularCategory);
  const getStoreBanner = useSelector(state => state?.getHomePageData?.data?.promotion);
  const getInfo = useSelector(state => state?.getHomePageData?.data?.fourColumn);
  const recentProducts = useSelector(state => state?.recentProducts);
  const customerId = useSelector(state => state?.customerDetails?.id);
  const getFooterData = useSelector(state => state?.getHeaderFooterData?.data?.footer?.[0]);
  
  
  
 useEffectOnce(()=>{
  const homeOptions = {
    isLoader: true,
    loaderAction: (bool) => {
      dispatch(ACTION_HOMEPAGE__LOADING(bool))
    },
    setGetResponseData: (resData) => {
      dispatch(ACTION_FETCH__HOMEPAGE({
        checkHomePageData: true,
        data: resData?.data?.[0]?.home
      }))
    },
    axiosData: {
      url: `${defaultURL}/home/getHomePage`,
  
    }
  }
  APIQueryGet(homeOptions)

 })
 



 
 
  return (
    <React.Fragment>
     
    
      <div className="home__container">
        <div className="home__wrapper">
          <BannerContent />
          <div className="container py-2 xl-py-2"></div>
          <Categories
            data={
              !loadPreRender ? popularCategory : popularCategory?.slice(0, 6)
            }
            loading={homePageLoading}
            isPageValid="homepage"
          />
         
          {!homePageLoading && getStaticBannerData && (
            <VisibleWarp>
              <Ecobanner
                loading={homePageLoading}
                img={getStaticBannerData?.image}
                title={getStaticBannerData?.headerTitle}
                buttonText={getStaticBannerData?.buttonTitle}
                description={getStaticBannerData?.headerContent}
                button_url={getStaticBannerData?.buttonUrl}
                backgroundColor={getStaticBannerData?.backgroundColor}
              />
            </VisibleWarp>
          )}
           <VisibleWarp>
            {loadIfUser && recentProducts?.length && !homePageLoading ? (
              <ProductSlider
                title="Recent bekeken"
                loading={homePageLoading}
                data={
                  !loadPreRender ? recentProducts : recentProducts?.slice(0, 4)
                }
                pageName="home"
              />
            ) : (
              <></>
            )}
          </VisibleWarp>
          <VisibleWarp>
            {homePageLoading ? (
              <ProductSlider
                title="Our Most Popular Products"
                loading={true}
                data={[]}
              />
            ) : featuredProducts?.length ? (
              <ProductSlider
                title="Our Most Popular Products"
                loading={homePageLoading}
                data={
                  !loadPreRender
                    ? featuredProducts
                    : featuredProducts?.slice(0, 4)
                }
              />
            ) : (
              <></>
            )}
          </VisibleWarp>
          <VisibleWarp>
            <Storebanner
              getStoreBanner={getStoreBanner}
              loading={homePageLoading}
            />
          </VisibleWarp>

         
        </div>
      </div>
     
    </React.Fragment>
  );
}

export default memo(Home);