import React, { memo, useContext, useEffect,useRef } from 'react';
import Categories from "../../Components/Categories";
import ProductSlider from "Components/ProductSlider";
import BannerContent from "../../Components/BannerContent";
import Storebanner from "../../Components/Home/Storebanner";
import Infoblock from "../../Components/Home/Infoblock";
import Blog from "../../Components/Home/Blog";
import MundoRating from "../../Components/Home/MundoRating";
import { useSelector ,useDispatch} from 'react-redux';
import Seo from 'Components/Seo/Seo';
import useScrollToTop from 'Components/Hooks/useScrollToTop';
import TagManager from 'react-gtm-module';
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
  const featuredProducts = useSelector((state) => state?.getFeatureProduct);
  const getStaticBannerData = useSelector(state => state?.getHomePageData?.data?.bannerData?.promotionMainBanner?.[0]);
  const popularCategory = useSelector(state => state?.getHomePageData?.data?.popularCategory);
  const getStoreBanner = useSelector(state => state?.getHomePageData?.data?.promotion);
  const getInfo = useSelector(state => state?.getHomePageData?.data?.fourColumn);
  const seoContent = useSelector(state => state?.getHomePageData?.data?.seoContent);
  const recentProducts = useSelector(state => state?.recentProducts);
  const customerId = useSelector(state => state?.customerDetails?.id);
  const getFooterData = useSelector(state => state?.getHeaderFooterData?.data?.footer?.[0]);
  useEffect(() => {
    HomePageGTM()
  }, []);
  
  
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
      url: `${defaultURL}/getHomePage`,
  
    }
  }
  // APIQueryGet(homeOptions)

 })
  const StructuredData = () => {
    useEffect(() => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        "@context": "http://schema.org",
        "@type": "WebSite",
        "url": "https://www.promofit.nl/",
        "name": "Promofit.nl",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.promofit.nl/catalogsearch/result/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      });
  
      document.head.appendChild(script);
  
      // Cleanup function to remove the script when the component is unmounted
      return () => {
        document.head.removeChild(script);
      };
    }, []);
  
    return null; // This component doesn't render anything visible
  };
const OrganizationSchema = () => {
  const organizationSchemaRef = useRef(null);

  useEffect(() => {
    if (!organizationSchemaRef.current) {
      organizationSchemaRef.current = document.createElement('script');
      organizationSchemaRef.current.type = 'application/ld+json';
      document.head.appendChild(organizationSchemaRef.current);
    }

    const scriptContent = {
      "@context": "http://schema.org",
      "@type": "Organization",
      "url": "https://www.promofit.nl/",
      "name": "Promofit",
      "logo": "https://www.promofit.nl/media/logo/stores/1/logo-promofit-M2.png",
      "description": "Promofit is sinds 2006 de toonaangevende leverancier voor relatiegeschenken, promotionele artikelen, give-aways en beursmaterialen. Wij bedrukken bijna alles!...",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+3176 50 182 25",
          "contactType": "sales"
        },
        {
          "@type": "ContactPoint",
          "telephone": "+3176 50 182 25",
          "contactType": "customer service"
        }
      ],
      "address": {
        "addressCountry": "Nederland",
        "addressRegion": "Noord Brabant",
        "addressLocality": "Etten Leur"
      },
      "sameAs": [
        "https://nl-nl.facebook.com/promofit",
        "https://twitter.com/Promofit_NL",
        "https://www.instagram.com/promofit.nl/",
        "https://www.youtube.com/channel/UCH_Nu6o9B_h0pEvz9Xodp9Q",
        "https://www.linkedin.com/company/promofit/",
        "https://www.pinterest.com/promofit/"
      ]
    };

    organizationSchemaRef.current.innerHTML = JSON.stringify(scriptContent);

    return () => {
      // Cleanup function to remove the script element when the component is unmounted
      if (organizationSchemaRef.current) {
        document.head.removeChild(organizationSchemaRef.current);
        organizationSchemaRef.current = null;
      }
    };
  }, []);

  return null;
};


const ShopReviewSchema = () => {
  const shopReviewRef = useRef(null);

  useEffect(() => {
    // Create the script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'shopReview';

    const scriptContent = {
      "@context": "http://schema.org",
      "@type": "Product",
      "url": "",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue":getFooterData?.reviews?.kiyohReviews[0]?.avg_rating,       
        "reviewCount":getFooterData?.reviews?.kiyohReviews[0]?.total_reviews
      },
      "name": storeId==1?"Promofit":storeId==2?"Expofit":""
    };

    script.textContent = JSON.stringify(scriptContent);

    document.head.appendChild(script);

    shopReviewRef.current = script;

    return () => {
      if (shopReviewRef.current) {
        document.head.removeChild(shopReviewRef.current);
      }
    };
  }, []);

  return null;
};

 
  const HomePageGTM = () => {
    let HomePageGTMData = {
      dataLayer: {
        event: 'HomePageData',
        userId: customerId ? customerId : "",
      }
    }
    TagManager.dataLayer(HomePageGTMData);
    console.log('GTM_EVENT HomePageGTMData', HomePageGTMData);

  };
  return (
    <React.Fragment>
      <Helmet>
        <meta
          name="google-site-verification"
          content={process.env.REACT_APP_GOOGLE_ADS_PROMOFIT_HOME}
        />
      </Helmet>
      <Seo
        metaTitle={seoContent?.metaTitle}
        metaDescription={seoContent?.metaDescription}
        metaKeywords={seoContent?.metaKeywords}
      />
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
            {homePageLoading ? (
              <ProductSlider
                title="Uitgelichte producten"
                loading={true}
                data={[]}
              />
            ) : featuredProducts?.length ? (
              <ProductSlider
                title="Uitgelichte producten"
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
          <VisibleWarp>
            <Infoblock getInfo={getInfo} loading={homePageLoading} />
          </VisibleWarp>
          <VisibleWarp>
            <MundoRating />
          </VisibleWarp>
          <VisibleWarp>
            <Blog />
          </VisibleWarp>
        </div>
      </div>
      <OrganizationSchema />
      <ShopReviewSchema />
      <StructuredData />
    </React.Fragment>
  );
}

export default memo(Home);