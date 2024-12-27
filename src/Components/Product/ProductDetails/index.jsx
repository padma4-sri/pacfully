import React, { useEffect, useRef, useState, useContext } from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import { APIQueryGet, APIQueryPost } from "APIMethods/API";
import { useLocation, useNavigate } from "react-router-dom";
import { useWindowSize ,handleAddToRecent} from "Utilities";
import Breadcrumb from "Components/Breadcrumb";
import GalleryVariant from "./Gallery";
import CopyUrlSidebar from "Components/Product/ProductDetails/CopyUrlSidebar";
import AdditionalData from "./AdditionalData";
import ColorPicker from "./ColorPicker";
import ReviewForm from "./ReviewForm";
import AllReviews from "./AllReviews";
import VariantLoader from "./Variant/loader";
import TitleLoader from "./Title/loader";
import GalleryLoader from "./Gallery/loader";
import UrlGeneratorPdp from 'Components/Hooks/UrlGeneratorPdp';
import ProductSlider from "Components/ProductSlider";
import Seo from "Components/Seo/Seo";
import { useDispatch, useSelector } from "react-redux";
import {
  ACTION__PDP__STATIC__DATA,
  ACTION_GET__URLTYPE,
  ACTION__CMS__COLOR,
} from "Store/action";
import TagManager from 'react-gtm-module';

import Img from "Components/Img";
import { handleAddUser } from "db";
import VisibleWarp from "Context/VisibleWrapper";
import ProductTitle from "./Title";
import ProductVariant from "./Variant";
import { CombinedContext } from "Context/CombinedContext";
import RenderContext from "Context/RenderContext";
// const ProductVariant = React.lazy(() => import("./Variant"));
// const ProductTitle = React.lazy(() => import("./Title"));

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { defaultURL, storeId,baseURL } = useContext(DomainContext);
  const { setisBackdropLoading ,setPdpSharedState,pdpsharedState} =
    useContext(CombinedContext);
  const { loadPreRender }=useContext(RenderContext);
  const getHeaderData = useSelector(state => state?.getHeaderFooterData?.data?.header?.contactSection?.contactDetails);
  const getFooterData = useSelector(state => state?.getHeaderFooterData?.data?.footer?.[0]?.footerBottomData);
  const getReview = useSelector(state => state?.getHeaderFooterData?.data);
  const email = getHeaderData?.filter(item => item?.contactInfo?.mailId);
  const mobileNumber = getHeaderData?.filter(item => item?.contactInfo?.whatsappNumber);
  const location = useLocation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const recentProductSku = useSelector((state) => state?.recentProductSku);
  const translateData = useSelector((state) => state?.translateData);
  const productDetailsStaticData = useSelector((state) => state?.productDetailsStaticData);
  const recentProducts = useSelector(state => state?.recentProducts);
  const [stateToken, setStateToken] = useState(0);
  const [tokenGetData, setTokenGetData] = useState("");
  const [stateUploadedPath, setStateUploadedPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alternateProductsData, setAlternateProductsData] = useState([]);
  const APIReference = useRef(false);
  const [openCopyURLModel, setOpenCopyURLModel] = useState(false);
  const [galleryData, setGalleryData] = useState({});
  const [gallerySelected, setGallerySelected] = useState([]);
  const [openColorModel, setOpenColorModel] = useState(false);
  const [width] = useWindowSize();
  const [openReview, setOpenReview] = useState(false);
  const [openAllReviews, setOpenAllReviews] = useState(false);
  const [minPrice, setMinPrice] = useState({ qty: 1, price: 0 });
  const { urlGenData, generateNewUrl } = UrlGeneratorPdp();
  // open accordion
  const [accordionView, setAccrodionView] = useState("Productdetails");
  const [isFixed, setIsFixed] = useState(0);
  const head = document.querySelector(`.header`);
  const top = head?.clientHeight;
  const [showPopup, setShowPopup] = useState(false);
useEffect(() => {
  const handleScroll = () => {
    const relative = document.getElementById('relative_content');
    const gallery = document.getElementById('left_content');
    const rightContent = document.getElementById('right_content');

    const galleryHeight = gallery.scrollHeight;
    const rightHeight = rightContent.offsetHeight;
    const relativeHeight = relative.offsetHeight;

   
    if (window.scrollY < relativeHeight - galleryHeight) {
      setIsFixed(window.scrollY); 
    } else {
      setIsFixed(relativeHeight - galleryHeight); 
    }
  };

  window.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, [window.scroll]);
  useEffect(() => {
    let tempGalleryData = [];
    const prod = pdpsharedState?.settings;
    if (prod?.product_gallery_images && prod.product_gallery_images.length)
      tempGalleryData = [...prod.product_gallery_images];
    if (gallerySelected?.length) tempGalleryData = [...gallerySelected, ...tempGalleryData];
    setGalleryData({
      image: [...tempGalleryData],
      product_name: prod?.product_name,
      bg: prod?.labelBackgroundColor,
      color: prod?.labelColor,
      label: prod?.labelText,
    });
  }, [pdpsharedState, gallerySelected]);
  useEffect(() => {
    if (!APIReference.current) {
      setLoading(true)
      const options = {
        isLoader: true,
        loaderAction: (bool) => setLoading(bool),
        axiosData: {
          url: `${defaultURL}/pdp${location?.pathname}/0`,
        },
        setGetResponseData: (res) => {
          dispatch(ACTION_GET__URLTYPE("pdp"));
          const data = res?.data[0];
          const sku = data?.settings?.product_sku;
          handleAddUser(dispatch, sku, recentProductSku);
          setPdpSharedState(data);
          setTokenGetData("")
        },
        getStatus: (res) => {
          setTimeout(()=>{
            setisBackdropLoading(false);
          },[100])
        },
      };
      const staticDatas = {
        isLoader: true,
        axiosData: {
          url: `${defaultURL}/static/pdpStaticDatas`,
        },
        setGetResponseData: (res) => {
          dispatch(ACTION__PDP__STATIC__DATA(res?.data))
        },
      };
      
       const urlKey = pdpsharedState?.settings?.breadcrumbs?.at(-1)?.urlKey;
  
      setTokenGetData("");
      if (urlKey !== location?.pathname) {
        setisBackdropLoading(true);
        APIQueryGet(options);
      } else {
        setLoading(false);
        setPdpSharedState({...pdpsharedState})
      }
     
      if (!productDetailsStaticData?.length) {
        APIQueryGet(staticDatas);
      }
      APIReference.current = true;
      setTimeout(() => (APIReference.current = false), 300);
    }
  }, [location?.pathname]);
  
  const getalternateProducts = {
    isLoader: true,
    axiosData: {
      url: `${defaultURL}/getalternateproducts`,
      paramsData: {
        categoryUrl:  pdpsharedState?.settings?.breadcrumbs[2]?.level 
        ? pdpsharedState?.settings?.breadcrumbs[2]?.urlKey 
        : pdpsharedState?.settings?.breadcrumbs[1]?.urlKey || pdpsharedState?.settings?.breadcrumbs[0]?.urlKey
     }
    },
    setGetResponseData: (res) => {
      setAlternateProductsData(res?.data)
    },
  };
  useEffect(() => {
    if (pdpsharedState?.settings?.stock_status == false) {
      APIQueryPost(getalternateProducts)
    }
    handleAddToRecent(recentProducts,{},dispatch,pdpsharedState?.settings?.product_sku,baseURL,storeId)
  }, [pdpsharedState])

  useEffect(() => {
    if (loading) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto"
      });
      setGallerySelected([])
    }
  }, [loading]);
  useEffect(() => {
    if (stateToken === 0 && state?.uploadData?.length) {
      setStateUploadedPath([...state.uploadData]);
      navigate(location.pathname + location.search, { replace: true });
    }
  }, [stateToken, state?.uploadData]);
  const ProductDetailPageGtm = () => {
    let ProductDetailPageGtmData = {
      dataLayer: {
        event: 'Product_Detail_Page',
      }
    }
    TagManager.dataLayer(ProductDetailPageGtmData);
    console.log('GTM_EVENT Product_Detail_Page', ProductDetailPageGtmData);
  };

  useEffect(() => {
    console.log("PDP_data",pdpsharedState) // For UAT see the PDP page
  }, [pdpsharedState]);


  useEffect(() => {
    setStateToken((v) => v + 1);
    ProductDetailPageGtm();
  }, []);

  const handleBreadcrum = (response) => {
    return response?.map((item, index) => {
      if (index < response?.length - 1) {
        return {
          ...item,
          urlType:{
            entityType: "category",
            level: item?.level,
          }
        };
      }else{
        return item
      }
    });
  };
  const ProductSchema = () => {
    const ProductSchemaRef = useRef(null);

    useEffect(() => {
      if (ProductSchemaRef.current) {
        ProductSchemaRef.current.remove();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify( {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": pdpsharedState?.settings?.product_name,
        "description": pdpsharedState?.settings?.metaDescription,
        "review": {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": Number(getReview?.header?.kiyoh?.rating[0]?.avg_rating)/2,
            "bestRating":Number(getReview?.header?.kiyoh?.rating[0]?.avg_rating_year)/2
          },
          "author": {
            "@type": "Organization",
            "name": storeId === 1 ? "Promofit" : "Expofit"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue":Number(getReview?.header?.kiyoh?.rating[0]?.avg_rating)/2,
          "reviewCount":Number(getReview?.header?.kiyoh?.rating[0]?.total_reviews)
        }
      },
    );
      document.head.appendChild(script);

      ProductSchemaRef.current = script;

      return () => {
        if (ProductSchemaRef.current) {
          ProductSchemaRef.current.remove();
        }
      };
    }, [pdpsharedState]);

    return null;
  };

  const BreadcrumbSchema = ({ breadcrumbData }) => {
    const scriptRef = useRef(null);

    useEffect(() => {
      if (scriptRef.current) {
        scriptRef.current.remove();
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbData?.map((item, index) => ({
          "@type": "ListItem",
          position: (index + 1).toString(),
          item: {
            id: item?.catId,
            url: item?.urlKey,
            name: item?.categoryName
          }
        })),
      });

      document.head.appendChild(script);

      scriptRef.current = script;

      return () => {
        if (scriptRef.current) {
          scriptRef.current.remove();
        }
      };
    }, [breadcrumbData]);

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
  return (
    <React.Fragment>
      <Seo
        metaTitle={`${pdpsharedState?.settings?.stock_status===false?"[Uitverkocht]":""}  ${pdpsharedState?.seo?.metaTitle === undefined ? "": pdpsharedState?.seo?.metaTitle}`}
        metaDescription={pdpsharedState?.seo?.metaDescription}
        metaKeywords={pdpsharedState?.seo?.metaKeywords}
        ogImage={pdpsharedState?.settings?.product_gallery_images?.[0]?.image}
        ogWebSite="Product"
        productPrice={pdpsharedState?.settings?.additional_info?.total_price?.substring(2)}
        currency={pdpsharedState?.settings?.additional_info?.total_price?.slice(0, 1)}
      />
      {/* <ShopReviewSchema/> */}
      <ProductSchema productsData={pdpsharedState} />
      <BreadcrumbSchema breadcrumbData={pdpsharedState?.settings?.breadcrumbs} />
   
      {
        pdpsharedState?.settings?.stock_status === false && !loading ?
          <div className="outof__stock">
            <div className="flex col gap-5 lg-flex lg-gap-12">
              <div className="flex col container">
                <Breadcrumb
                  type="productDetails"
                  loading={loading}
                  data={pdpsharedState?.settings?.breadcrumbs}
                />
                <div className="flex col lg-flex lg-row gap-10 px-4 pt-5 lg-pt-7">
                  <div className="flex image r-5 relative p-5">
                    <div className="flex center middle">
                      <Img src={pdpsharedState?.settings?.product_gallery_images?.[0]?.image} alt={pdpsharedState?.settings?.product_name} className="image-contain" />
                    </div>
                    {
                      pdpsharedState?.settings?.tag?.name ?
                        <div className="tag absolute left-3 r-4 flex middle center">
                          <p
                            className="fs-14 fw-700"
                            style={{
                              background: `${pdpsharedState?.settings?.tag?.backgroundColor}`,
                              color: `${pdpsharedState?.settings?.tag?.color}`,
                            }}
                          >{pdpsharedState?.settings?.tag?.name}</p>
                        </div>
                        : <></>
                    }
                  </div>
                  <div className="info flex-1 flex col gap-10 lg-flex lg-gap-12">
                    {width < 1250 ?
                      <ProductTitle
                        loading={loading}
                        data={pdpsharedState?.settings}
                        setOpenReview={setOpenReview}
                        setOpenAllReviews={setOpenAllReviews}
                        setAccrodionView={setAccrodionView}
                      />
                      : <ProductTitle
                        loading={loading}
                        data={pdpsharedState?.settings}
                        setOpenReview={setOpenReview}
                        setOpenAllReviews={setOpenAllReviews}
                        minPrice={minPrice}
                        setAccrodionView={setAccrodionView}
                      />
                    }
                    <div className="static flex col">
                      <h3 className="fs-22 line-6 fw-700 pb-1">Het artikel is niet meer leverbaar.</h3>
                      {
                        pdpsharedState?.settings?.alternative?.length ?
                          <p className="fs-15 line-6">Bekijk hieronder onze aanbevolen alternatieven.</p>
                          :
                          <>
                            <p className="fs-15 line-6">Neem contact met ons op, wij helpen u graag met het zoeken naar een passend alternatief!</p>
                            <p className="fs-15 line-6">E-mail naar <a href={`mailto: ${email?.[0]?.contactInfo?.mailId}`} aria-label={email?.[0]?.contactInfo?.mailId}>{email?.[0]?.contactInfo?.mailId}</a> of bel <a href={`tel:${mobileNumber?.[0]?.contactInfo?.whatsappLinkNumber}`}aria-label={mobileNumber?.[0]?.contactInfo?.whatsappNumber}>{mobileNumber?.[0]?.contactInfo?.whatsappNumber}</a>.</p>
                          </>
                      }
                    </div>
                  </div>
                </div>
              </div>
              <VisibleWarp>
              {
                alternateProductsData?.length ?
                  <div className="sub__recent__products">
                    <ProductSlider
                      title="Alternatieven"
                      data={!loadPreRender ? alternateProductsData : alternateProductsData?.slice(0, 4)}
                      showToGo={false}
                      loading={false}
                      pageName="pdp"
                    />
                  </div>
                  : <></>
              }
              </VisibleWarp>
            </div>
            {/* Additional data */}
            <div className="flex col container">
              <div className="addtional__data__container container px-4">
                <AdditionalData
                  loading={loading}
                  settingsData={pdpsharedState?.settings}
                  mondu={productDetailsStaticData[0]?.mondu?.[0]}
                  reviews={productDetailsStaticData[0]?.kiyoh_reviews}
                  getInfo={pdpsharedState?.settings?.staticContents}
                  setOpenReview={setOpenReview}
                  setOpenAllReviews={setOpenAllReviews}
                  accordionView={accordionView}
                  setAccrodionView={setAccrodionView}
                  productDetailsStaticData={productDetailsStaticData[0]}
                  translateData={translateData[0]}
                />
              </div>
            </div>

          </div>
          :
          <div className="container">
            <Breadcrumb
              type="productDetails"
              loading={loading}
              data={handleBreadcrum(pdpsharedState?.settings?.breadcrumbs)}
            />
            <div className="px-4 pt-1 lg-pt-7">
              <div className="productDetails flex gap-9 col xxl-flex xxl-row xxl-gap-12 w-1/1">
                <div className="flex-1 flex col gap-6 xxl-w-1/2">
                  {width < 1250 ? loading  && pdpsharedState?.settings?.product_name === undefined ? <TitleLoader /> : (
                    <ProductTitle
                      loading={loading}
                      data={pdpsharedState?.settings}
                      setOpenReview={setOpenReview}
                      setOpenAllReviews={setOpenAllReviews}
                      setAccrodionView={setAccrodionView}
                    />
                  ) : (
                    <></>
                  )}
                   <div className={`relative w-1/1 h-1/1`} id="relative_content" >
                <div className={`galleryVariant `} id="left_content" style={{
         position: showPopup ? 'static' : 'sticky',
        top: `${top + 15}px`, 
         }}>
                  {loading && pdpsharedState?.settings?.product_name === undefined ? <GalleryLoader /> : <GalleryVariant showPopup={showPopup} setShowPopup={setShowPopup} loading={loading} imgData={galleryData} alt={pdpsharedState?.settings?.product_name} />}
               </div>
               </div>
                </div>
                <div className="flex-1 flex col gap-6 xxl-w-1/2" id="right_content">
                  {width > 1250 ? loading && pdpsharedState?.settings?.product_name === undefined ? <TitleLoader /> : (
                    <ProductTitle
                      loading={loading}
                      data={pdpsharedState?.settings}
                      setOpenReview={setOpenReview}
                      setOpenAllReviews={setOpenAllReviews}
                      minPrice={minPrice}
                      setAccrodionView={setAccrodionView}
                    />
                  ) : (
                    <></>
                  )}
                    {loading && pdpsharedState?.settings?.product_name === undefined ?
                      <VariantLoader /> :
                      <ProductVariant
                        key={pdpsharedState?.settings?.product_sku} 
                        data={pdpsharedState}
                        setGallerySelected={setGallerySelected}
                        setOpenCopyURLModel={setOpenCopyURLModel}
                        urlGenData={urlGenData}
                        generateNewUrl={generateNewUrl}
                        setMinPrice={setMinPrice}
                        stateUploadedPath={stateUploadedPath}
                        setStateUploadedPath={setStateUploadedPath}
                        productDetailsStaticData={productDetailsStaticData[0]}
                        translateData={translateData[0]}
                        tokenGetData={tokenGetData}
                        setTokenGetData={setTokenGetData}
                      />
                    }
                </div>
              </div>

              {/* Additional data */}
              <div className="addtional__data__container">
                <AdditionalData
                  loading={loading}
                  settingsData={pdpsharedState?.settings}
                  mondu={productDetailsStaticData[0]?.mondu?.[0]}
                  reviews={productDetailsStaticData[0]?.kiyoh_reviews}
                  getInfo={pdpsharedState?.settings?.staticContents}
                  setOpenReview={setOpenReview}
                  setOpenAllReviews={setOpenAllReviews}
                  accordionView={accordionView}
                  setAccrodionView={setAccrodionView}
                  productDetailsStaticData={productDetailsStaticData[0]}
                  translateData={translateData[0]}
                />
              </div>
              {/* copy URL sidebar */}
              <CopyUrlSidebar
                openCopyURLModel={openCopyURLModel}
                setOpenCopyURLModel={setOpenCopyURLModel}
                productName={pdpsharedState?.settings?.product_name}
              />
              <ColorPicker
                openColorModel={openColorModel}
                setOpenColorModel={setOpenColorModel}
              />
            </div>
          </div>
      }
      <VisibleWarp>
      {
        recentProducts?.length ?
          <div className="sub__recent__products">
            <ProductSlider
              title="Recent bekeken"
              data={!loadPreRender ? recentProducts : recentProducts?.slice(0, 4)}
              showToGo={false}
              loading={false}
              pageName="pdp"
            />
          </div>
          : <></>
      }
      </VisibleWarp>
      <VisibleWarp>
      {
        loading && !recentProducts?.length ?
          <div className="sub__recent__products">
            <ProductSlider
              title="Recent bekeken"
              data={[]}
              showToGo={false}
              loading={loading}
              pageName="pdp"
            />
          </div>
          : <></>
      }
      </VisibleWarp>

      <ReviewForm openModel={openReview} setOpenModel={setOpenReview} product_id={pdpsharedState?.settings?.product_id} productTitle={pdpsharedState?.settings?.product_name} />
      <AllReviews openModel={openAllReviews} setOpenModel={setOpenAllReviews} data={pdpsharedState?.settings?.review_details?.details} />
      </React.Fragment>
  );
};
export default ProductDetails;
