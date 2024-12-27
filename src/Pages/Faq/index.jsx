import React, { useState, useEffect, useContext, memo } from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Breadcrumb from "Components/Breadcrumb";
import {
  SearchIcon,
  XIcon,
} from "Res/icons";
import axios from "axios";
import { APIQueryGet } from "APIMethods/API";
import { useEffectOnce } from "Components/Hooks/useEffectOnce";
import useScrollToTop from "Components/Hooks/useScrollToTop";
import Seo from "Components/Seo/Seo";
import { LineLoader, SkeletonLoader } from "Components/Skeletion";

function Faq() {
  useScrollToTop();
  const { defaultURL, storeId } = useContext(DomainContext);
  const location = useLocation();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const seoData = data?.seo;
  const [loading, setLoading] = useState(true);

  const options = {
    isLoader: true,
    loaderAction: (bool) => setLoading(bool),
    setGetResponseData: (resData) => {
      setData(resData?.data[0]);
    },
    axiosData: {
      url: `${defaultURL}/getFaqDetails?storeId=${storeId}&searchString=&faqUrl=&categoryUrl=&typeUrl=faq`,
     
    },
  };

  useEffect(() => {
    if (showSuggestion === false) {
      setTimeout(() => {
        setSearchKeyword("");
      }, 300);
    }
  }, [showSuggestion, location]);
  const onNavigate = (items) => {
    const queryParams = new URLSearchParams({
      faq_id: items.faq_id
    }).toString();
    const dynamicURL = `/meest-gestelde-vragen/${items?.faq_type_category_url}?${queryParams}`;
    nav(dynamicURL, { state: items });
  };
  const breadCrumbData = [
    {
      categoryName: "Meest gestelde vragen",
      urlKey: "",
      catId: "",
    },
  ];

 
  const onNavigateSearch = (items) => {
    const queryParams = new URLSearchParams({
      faq_id: items.faq_id
    }).toString();
    const dynamicURL = `/meest-gestelde-vragen/${items?.faq_type_category_url}?${queryParams}`;
    nav(dynamicURL);
    setShowSuggestion(false);
  };
  
  const handlesetsearchkeyword = async (e) => {
    setShowSuggestion(true);
    setSearchKeyword(e.target.value);
    if (e.target.value.length > 2) {
      const payload = {
        typeUrl: "faq",
        categoryUrl: "",
        faqUrl: "",
        searchString: e.target.value,
        storeId: storeId,
      };
      const resp = await axios.post(defaultURL + "/getFaqDetails", payload);

      setSearchData(resp?.data[0]);
    }
  };
  const highlightKeyword = (text) => {
    if (!searchKeyword) {
      return text;
    }

    const words = searchKeyword.split(' ').filter(Boolean);
    const regex = new RegExp(`(${words.join('|')})`, 'gi');
    return text.split(regex).map((part, index) => (
      regex.test(part) ? <strong key={index}>{part}</strong> : part
    ));
  };

  // render once
  useEffectOnce(() => {
    APIQueryGet(options);
  });
  return (
    <React.Fragment>
      <Seo
        metaTitle={seoData?.metaTitle}
        metaDescription={seoData?.metaDescription}
        metaKeywords={seoData?.metaKeywords}
      />
      <div className="pt-4">
        <Breadcrumb data={breadCrumbData} />

        <div className="faq py-8">
          <div className="pb-7 pt-1 container px-4">
            <h3 className="fs-28 lg-fs-32 fw-700 tc">
              Hallo, waarmee kunnen we je helpen?
            </h3>
          </div>
          <div
            className={`search container px-4 pb-3 relative ${isFocused ? "focused" : ""
              }`}
          >
            <input
              type="text"
              aria-label="search" 
              className="searchbox pr-14 pl-6"
              placeholder={storeId === 1 ? "Kan ik een sample/proefmodel ontvangen?" : "Wat is de levertijd?"}
              onFocus={() => {
                setIsFocused(true);
              }}
              onChange={(e) => handlesetsearchkeyword(e)}

              value={searchKeyword}
            />
            <IconButton
              className="mr-2"
              aria-label="search toggle"
              onClick={() => {
                setShowSuggestion(false);
                setSearchData(null);
              }}
            >
              {showSuggestion ? (
                <XIcon style={{ width: 14, height: 14 }} />
              ) : (
                <SearchIcon />
              )}
            </IconButton>
          </div>
          {showSuggestion ? (
            <div className="search__res flex center px-4 relative ">
              <div className="search__suggestion__container__faq mx-auto absolute container">
                {searchData?.fagCategoryDetails?.length ? (
                  searchData?.fagCategoryDetails?.map(
                    (searchItem, searchIndex) => (
                      <p
                        className="fs-15  py-4 px-8 pointer p-4"
                        onClick={() => onNavigateSearch(searchItem)}
                      >
                        {highlightKeyword(searchItem?.faq_title)}
                      </p>
                    )
                  )
                ) : (
                  <div className="fs-15 line-6 tc p-8">
                    Uw zoekopdracht heeft geen resultaten opgeleverd.
                  </div>
                )}
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="faq__list py-2 lg-py-12 lg-mt-7">
            <div className="container px-4 flex wrap xl-flex parent__card lg-flex lg-gap-y-13">
              {
                loading ?
                  ['', '', '', '', '', '']?.map((item, index) => (
                    <div className="flex__card w-1/1 lg-px-4 xl-px-8 py-6 lg-py-8" key={`faqlistingLoadKeys${index}`}>
                      <LineLoader width="35px" height="35px" className="mb-4" />
                      <LineLoader width="100%" height="32px" className="mb-4" />
                      <SkeletonLoader pclassName="flex col gap-1 pb-3" length={5} />
                      <LineLoader width="88px" />
                    </div>
                  ))
                  :
                  data?.fagCategories?.length
                    ? data?.fagCategories?.map((item, index) => (
                      <div className="flex__card lg-px-4 xl-px-8 py-6 lg-py-8" key={`faqlistingKeys${index}`}>
                        <div
                          className="faq__icon mb-4"
                        >
                          <span className={`${item?.faq_type_category_icon}`}></span>
                        </div>
                        <h2 className="fs-24 fw-700 pb-4">
                          {item?.faq_type_category_name}
                        </h2>
                        <div className="flex col top">
                          {
                            item?.questions?.slice(0, 5)?.map((elem, ind) => <Link className="questions text__ellipse fs-15 line-6 mb-2" to={`/meest-gestelde-vragen/${item?.faq_type_category_url}?faq_id=${elem?.faq_id}`}aria-label={elem?.faq_title} state={{ faqUrl: elem?.faq_url, faq_id: elem?.faq_id }} key={`faqListings${ind}`}>{elem?.faq_title}</Link>)
                          }
                        </div>
                        <a
                          className="text-underline fs-15"
                          onClick={() => onNavigate(item)}
                          aria-label={"Bekijk-meer"}
                        >
                          Bekijk meer
                        </a>
                      </div>
                    ))
                    : ""
              }
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default memo(Faq);
