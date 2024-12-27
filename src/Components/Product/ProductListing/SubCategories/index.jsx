import React, { useState, useEffect, useContext, useRef ,useMemo} from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import Breadcrumb from "Components/Breadcrumb";
import FilterSidebar from "Components/Product/ProductListing/SubCategories/FilterSidebar";
import GridList from "Components/Product/ProductListing/SubCategories/GridList";
import AdditionalData from "Components/Product/ProductListing/SubCategories/AdditionalData";
import { useLocation, useSearchParams } from "react-router-dom";
import { APIQueryGet, APIQueryPost } from "APIMethods/API";
import Seo from "Components/Seo/Seo";
import NoRoute from "Components/NoRoute/NoRoute";
import TagManager from "react-gtm-module";
import { useSelector } from "react-redux";
import { CombinedContext } from "Context/CombinedContext";

const SubCategories = () => {
  const { storeId, defaultURL } = useContext(DomainContext);
  const {plptwosharedState, setPlptwoSharedState,setisBackdropLoading} =useContext(CombinedContext)
  const [openModel, setOpenModel] = useState(false);
  const APIRef = useRef(false);
  const [searchParams] = useSearchParams();
  const [loading, setProductpageLoading] = useState(false);
  const [thirdLevelData, setThirdLevelData] = useState([]);
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(0);
  const previousPageRef = useRef(currentPage);
  const [isLoaded, setIsLoaded] = useState(false);
  const urlFiter = location?.search
    ?.slice(1)
    ?.split("&")
    ?.filter(
      (item) =>
        item?.split("=")?.[0] !== "page_size" &&
        item?.split("=")?.[0] !== "product_list_order"
    );
  let filredData = [];
  const trimTrailingSlash = (url) => url.trim().replace(/\/$/, '');

  const getFooterData = useSelector(
    (state) => state?.getHeaderFooterData?.data?.footer?.[0]
  );

  urlFiter?.forEach((item) => {
    let data = item?.split("=");
    let keyName = data?.[0];
    let value = data?.[1]?.split("%");
    if (urlFiter?.[0] !== "") {
      filredData?.push({ [keyName]: value });
    }
  });
  const sortingData = searchParams?.get("product_list_order");
  function createUrlWithParams({
    storeId,
    filredData,
    sortingData,
    currentPage,
    customerId,
  }) {
    const baseUrl = `${defaultURL}/plp/getDetails`;
    let queryParams = `storeId=${storeId}&rootCatId=2&categoryUrl=${trimTrailingSlash(location?.pathname?.slice(1))}&searchString=&sortingData[value]=${
      sortingData?.value || ""
    }&sortingData[sortBy]=${sortingData?.sortBy || ""}&pageSize=${
      currentPage + 1 > 1 ? 14 : 14
    }&pageOffset=${currentPage + 1}&customerId=0`;

    filredData.forEach((filter, index) => {
      Object.keys(filter).forEach((key) => {
        filter[key].forEach((value, i) => {
          queryParams += `&filterData[${index}][${key}][${i}]=${value}`;
        });
      });
    });

    return `${baseUrl}?${queryParams}`;
  }

  const urlParams = createUrlWithParams({
    storeId: storeId,
    filredData: filredData?.length ? filredData : [],
    currentPage: currentPage,
    sortingData: {
      value: sortingData ? sortingData : "",
      sortBy: "",
    },
    pageSize: currentPage + 1 > 1 ? 14 : 14,
    pageOffset: currentPage + 1,
    customerId:  0,
  });
 

  const options = {
    isLoader: true,
    loaderAction: (bool) => setProductpageLoading(bool),
    axiosData: {
      url: urlParams,
    },
    setGetResponseData: (res) => {
      const data = res?.data[0];
      if (plptwosharedState?.products?.length && currentPage + 1 > 1) {
        setPlptwoSharedState({...plptwosharedState, products:[...plptwosharedState?.products, ...data?.products],total_products:data?.total_products})
        } else {
        setPlptwoSharedState(data)
        if (data?.categoryFilter && data?.categoryFilter?.length)
          setThirdLevelData([...data?.categoryFilter]);
      }
    },
    getStatus: (res) => {
      setTimeout(()=>{
        if(currentPage === 0){
          window.scrollTo(0, 0);
        }
        setisBackdropLoading(false);
      },[100])
    },
  };
   // paramsData= {
  //   storeId: storeId,
  //   rootCatId: 2,
  //   categoryUrl: location?.pathname?.slice(1),
  //   searchString: "",
  //   filterData: filredData?.length ? filredData : [],
  //   sortingData: {
  //     value: sortingData ? sortingData : '',
  //     sortBy: ''
  //   },
  //   pageSize: (currentPage + 1) > 1 ? 14 : 14,
  //   pageOffset: currentPage + 1,
  //   customerId: customerId ? customerId : 0,
  // }
  const searchResultOptions = {
    isLoader: true,
    loaderAction: (bool) => {
      setProductpageLoading(bool);
      if (
        location?.pathname?.slice(17)?.split("/")?.[0]?.replace(/%20/g, " ") !==
        plptwosharedState?.searchTerms
      ) {
        setCurrentPage(0);
      }
    },
    axiosData: {
      url: `${defaultURL}/searchresult/getproducts`,
      paramsData: {
        storeId: storeId,
        keyword: location?.pathname?.slice(17)?.split("/")?.[0]
          ? location?.pathname?.slice(17)?.split("/")?.[0]?.replace(/%20/g, " ")
          : "",
        filterData: filredData?.length ? filredData : [],
        sortingData: {
          value: sortingData ? sortingData : "",
        },
        productType: "",
        pageSize: currentPage + 1 > 1 ? 15 : 14,
        pageOffset:
          location?.pathname
            ?.slice(17)
            ?.split("/")?.[0]
            ?.replace(/%20/g, " ") === plptwosharedState?.searchTerms
            ? currentPage + 1
            : 1,
      },
    },
    setGetResponseData: (res) => {
      const data = res?.data[0];
      if (plptwosharedState?.products?.length && currentPage + 1 > 1) {
        setPlptwoSharedState({...plptwosharedState, products:[...plptwosharedState?.products, ...data?.products],total_products:data?.total_products})
      } else {
        setPlptwoSharedState(data)
        if (data?.categoryFilter && data?.categoryFilter?.length)
          setThirdLevelData([...data?.categoryFilter]);
      }
    },
    getStatus: (res) => {
      setTimeout(()=>{
        if(currentPage === 0){
          window.scrollTo(0, 0);
        }
        setisBackdropLoading(false);
      },[100])
    },
  };

  // Decode the URL
  const encodedUrl = location?.pathname?.slice(17)?.split("/")?.[0];
  const decodedUrl = decodeURIComponent(encodedUrl);
  const searchBreadCrumb = [
    {
      categoryName: `We hebben voor u gezocht op '${decodedUrl}':`,
      urlKey: "",
    },
  ];

  const emptyBreadCrumb = [
    {
      categoryName: "",
      urlKey: "",
    },
  ];
  
  useEffect(() => {
    if (!APIRef.current) {
      if (
        location?.state?.isSearchResult ||
        location?.pathname?.includes("/zoeken/")
      ) {
        setisBackdropLoading(true);
        APIQueryPost(searchResultOptions);
      } else {
        const urlKey = plptwosharedState?.breadCrums?.at(-1)?.urlKey;
        if(getFooterData !== undefined && (isLoaded || urlKey !== location?.pathname || searchParams?.size >= 0 || currentPage !== previousPageRef.current)){
          setisBackdropLoading(true);
          APIQueryGet(options);
        }
       
      }
      APIRef.current = true;
      setTimeout(() => (APIRef.current = false), 100);
    }
    previousPageRef.current = currentPage;
  }, [location, currentPage,isLoaded]);

  useMemo(() => {
    setCurrentPage(0);
  }, [location]);
  
  const productListingPage2Gtm = () => {
    let productListingPage2GtmData = {
      dataLayer: {
        event: "Product_Listing_Page2",
      },
    };
    TagManager.dataLayer(productListingPage2GtmData);
  };
  const StructuredData = () => {
    useEffect(() => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify({
        "@context": "http://schema.org",
        "@type": "WebSite",
        url: "https://www.promofit.nl/",
        name: "Promofit.nl",
        potentialAction: {
          "@type": "SearchAction",
          target:
            "https://www.promofit.nl/catalogsearch/result/?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
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
        organizationSchemaRef.current = document.createElement("script");
        organizationSchemaRef.current.type = "application/ld+json";
        document.head.appendChild(organizationSchemaRef.current);
      }

      const scriptContent = {
        "@context": "http://schema.org",
        "@type": "Organization",
        url: "https://www.promofit.nl/",
        name: "Promofit",
        logo: "https://www.promofit.nl/media/logo/stores/1/logo-promofit-M2.png",
        description:
          "Promofit is sinds 2006 de toonaangevende leverancier voor relatiegeschenken, promotionele artikelen, give-aways en beursmaterialen. Wij bedrukken bijna alles!...",
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+3176 50 182 25",
            contactType: "sales",
          },
          {
            "@type": "ContactPoint",
            telephone: "+3176 50 182 25",
            contactType: "customer service",
          },
        ],
        address: {
          addressCountry: "Nederland",
          addressRegion: "Noord Brabant",
          addressLocality: "Etten Leur",
        },
        sameAs: [
          "https://nl-nl.facebook.com/promofit",
          "https://twitter.com/Promofit_NL",
          "https://www.instagram.com/promofit.nl/",
          "https://www.youtube.com/channel/UCH_Nu6o9B_h0pEvz9Xodp9Q",
          "https://www.linkedin.com/company/promofit/",
          "https://www.pinterest.com/promofit/",
        ],
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
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "shopReview";

      const scriptContent = {
        "@context": "http://schema.org",
        "@type": "Product",
        url: "",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: getFooterData?.reviews?.kiyohReviews[0]?.avg_rating,
          reviewCount: getFooterData?.reviews?.kiyohReviews[0]?.total_reviews,
        },
        name: storeId == 1 ? "Promofit" : storeId == 2 ? "Expofit" : "",
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

  // scroll top
  useEffect(() => {
    // window.scrollTo(0, 0);
    productListingPage2Gtm();
  }, [location]);

  const BreadcrumbSchema = () => {
    const breadcrumbRef = useRef(null);

    useEffect(() => {
      if (!breadcrumbRef.current) {
        breadcrumbRef.current = document.createElement("script");
        breadcrumbRef.current.type = "application/ld+json";
        document.head.appendChild(breadcrumbRef.current);
      }

      const scriptContent = {
        "@context": "http://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: plptwosharedState?.breadCrums?.map((item, index) => ({
          "@type": "ListItem",
          position: (index + 1).toString(),
          item: {
            id: item?.catId,
            url: item?.urlKey,
            name: item?.categoryName,
          },
        })),
      };

      breadcrumbRef.current.innerHTML = JSON.stringify(scriptContent);

      return () => {
        // Cleanup function to remove the script element when the component is unmounted
        if (breadcrumbRef.current) {
          document.head.removeChild(breadcrumbRef.current);
          breadcrumbRef.current = null;
        }
      };
    }, []);

    return null;
  };
  
  const handleBreadcrum = (response) => {
    return response?.map((item, index) => {
      if (index < response?.length - 1) {
        return {
          ...item,
          urlType:{
            entityType: "category",
            level: `${index + 2}`,
          }
        };
      }else{
        return item
      }
    });
  };
  return (
    <>
      {/* {!loading && plptwosharedState?.products?.code === 400 ? (
        <NoRoute />
      ) : ( */}
        <>
          <Seo
            metaTitle={plptwosharedState?.seo?.metaTitle}
            metaDescription={plptwosharedState?.seo?.metaDescription}
            metaKeywords={plptwosharedState?.seo?.metaKeywords}
            ogWebSite="Product listing"
          />
          <BreadcrumbSchema />
          <OrganizationSchema />
          <ShopReviewSchema />
          <StructuredData />
          {!loading && plptwosharedState?.products?.code === 400 ? (
            <Breadcrumb
              type="plpParentCategories"
              data={emptyBreadCrumb}
              loading={loading}
            />
          ) : location?.state?.isSearchResult ||
            location?.pathname?.includes("/zoeken/") ? (
            <Breadcrumb
              type="plpParentCategories"
              data={searchBreadCrumb}
              loading={plptwosharedState?.products?.length ? false : loading}
            />
          ) : (
            <Breadcrumb
              type="plpParentCategories"
              data={handleBreadcrum(plptwosharedState?.breadCrums)}
              loading={plptwosharedState?.products?.length ? false : loading}
            />
          )}
          {location?.pathname?.includes("/zoeken/") &&
          plptwosharedState?.searchTerms &&
          !loading &&
          plptwosharedState?.products?.code === 400 ? (
            <>
            <Seo
                      metaTitle={
                        storeId === 1
                          ? "Zoekresultaat | Promofit.nl"
                          : "Zoekresultaat | Expofit.nl"
                      }
                      metaDescription="Zoekresultaat"
                      metaKeywords="Zoekresultaat"
                      ogWebSite="search listing"
                      robots="NOINDEX,NOFOLLOW"
                    />
            <div className="search__nodata msg__block flex center middle py-8 px-4 mt-10">
              <h4 className="fw-500 px-6 py-4 r-2 overflow">
                {plptwosharedState?.products?.message}
              </h4>
            </div>
            </>
          ) : (
            <>
              <div className="plp2 container pt-2 xl-pb-13 px-4">
                {location?.pathname?.includes("/zoeken/") ? (
                  <>
                    <Seo
                      metaTitle={
                        storeId === 1
                          ? "Zoekresultaat | Promofit.nl"
                          : "Zoekresultaat | Expofit.nl"
                      }
                      metaDescription="Zoekresultaat"
                      metaKeywords="Zoekresultaat"
                      ogWebSite="search listing"
                      robots="NOINDEX,NOFOLLOW"
                    />
                    <h2 className="fs-20 fw-700 line-7 pb-6">
                      We hebben voor u gezocht op '{decodedUrl}':
                    </h2>
                  </>
                ) : (
                  <></>
                )}
                <div className="productlisting__container flex gap-x-18">
                  <div className="productlisting__sidebar flex-0">
                    <FilterSidebar
                      openModel={openModel}
                      setOpenModel={setOpenModel}
                      plpDatas={plptwosharedState}
                      loading={loading}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      setThirdLevelData={setThirdLevelData}
                      setIsLoaded={setIsLoaded}
                    />
                  </div>
                  <div className="flex-1">
                    <GridList
                      setOpenModel={setOpenModel}
                      plpData={plptwosharedState}
                      loading={loading}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      sortingData={sortingData}
                      thirdLevelData={thirdLevelData}
                    />
                  </div>
                </div>
              </div>
              {!loading && plptwosharedState?.products?.code === 400 ? (
                <></>
              ) : (
                <div className="addtional__data__container">
                  <AdditionalData
                    plpData={plptwosharedState}
                    loading={plptwosharedState?.products?.length ? false : loading}
                  />
                </div>
              )}
            </>
          )}
        </>
      {/* )} */}
    </>
  );
};
export default SubCategories;
