import React, { useState, useEffect, useContext, useRef, memo } from "react";
import DomainContext from "Context/DomainContext";
import { BackgroundBox } from "Components/MyAccount/Common";
import "./styles.scss";
import Breadcrumb from "Components/Breadcrumb";
import IconButton from "@mui/material/IconButton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Slider from "react-slick";
import { handleLogin, useWindowSize } from "Utilities";
import {
  SearchIcon,
  XIcon,
} from "Res/icons";
import axios from "axios";
import useScrollToTop from "Components/Hooks/useScrollToTop";
import { APIQueryGet } from "APIMethods/API";
import Seo from "Components/Seo/Seo";
import { SkeletonLine, SkeletonLoader } from "Components/Skeletion";
import { useDispatch, useSelector } from "react-redux";

function FaqDetail() {
  useScrollToTop();
  const APIRef = useRef(false);
  const { defaultURL, storeId } = useContext(DomainContext);
  const isLoggedUser = useSelector((state) => state?.isLoggedUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [data, setData] = useState(null);
  const [width] = useWindowSize();
  const location = useLocation();
  const pathName = location?.pathname?.split("/")?.[2];
  const [selectedCategory, setSelectedCategory] = useState();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [iconListData, setIconListData] = useState({});
  const [initialSlideRef, setInitialSlideRef] = useState(null);
  const sliderRef = useRef(null);
  const seoData = data?.seo;
  const [loading, setLoading] = useState(true);
  const faqElement = document.querySelector(".faq__details");

  const queryParams = new URLSearchParams(location.search);

  const faq_id = queryParams.get('faq_id');

  let dragging = false;
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    initialSlide: initialSlideRef,
    swipeToSlide: true,
    arrows: false,
    variableWidth: true
  };

  const faqHandle = (id) => {
    var element = document.getElementById(`activeFaq${id}`);
    setTimeout(() => {
      element?.focus();
    }, 100)
  };

  const toggleAction = (index) => {
    faqHandle(index);
    if (selectedCategory === index) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(index);
    }
    setTimeout(() => {
      let elem = document.getElementById("faqMyaccount");
      const handleAccount = () => {
        if (isLoggedUser) {
          navigate('/mijn-account/mijn-overzicht');
        } else {
          handleLogin(dispatch);
        }
      }
      if (elem) {
        elem?.addEventListener("click", handleAccount);
      }
    }, 300);
  };

  useEffect(() => {
    if (data?.fagCategories?.length) {
      let dataNew = [];
      data?.fagCategories?.forEach((item, ind) => {
        dataNew.push({ id: ind, ...item })
      })
      const activePage = dataNew?.filter((item) => item?.faq_type_category_url === pathName);
      setInitialSlideRef(activePage?.[0]?.id);
      if (sliderRef.current === null) return
      sliderRef.current.slickGoTo(activePage?.[0]?.id);
    }
  }, [data, sliderRef.current]);

  useEffect(() => {
    const foundIndex = data?.fagCategoryDetails?.find(
      (item) => item.faq_id === faq_id
    );
    if (foundIndex !== -1) {
      setSelectedCategory(foundIndex?.faq_id);
      if (data?.fagCategoryDetails?.length && faqElement) {
        faqHandle(foundIndex?.faq_id);
      }
    }
  }, [data?.fagCategoryDetails, faq_id, faqElement]);

  useEffect(() => {
    if (showSuggestion === false) {
      setTimeout(() => {
        setSearchKeyword("");
      }, 300);
    }
  }, [showSuggestion, location]);

  const options = {
    isLoader: true,
    loaderAction: (bool) => setLoading(bool),
    setGetResponseData: (resData) => {
      setData(resData?.data[0]);
    },
    axiosData: {
      url: `${defaultURL}/getFaqDetails?storeId=${storeId}&typeUrl=faq&faqUrl=&searchString=&categoryUrl=${pathName}`,
     
    }
  };

  const onNavigate = (items) => {
    const queryParam = new URLSearchParams({
      faq_id: items.faq_id
    }).toString();
    const dynamicURL = `/meest-gestelde-vragen/${items?.faq_type_category_url}?${queryParam}`;
    nav(dynamicURL, { state: items });
    setShowSuggestion(false);
  };
  useEffect(() => {
    if (!APIRef.current) {
      APIQueryGet(options);
      APIRef.current = true;
      setTimeout(() => APIRef.current = false, 200);
    }
  }, [location]);
  useEffect(() => {
    if (data?.fagCategories?.length) {
      const tempObj = {};
      data?.fagCategories?.map((dataItem) => {
        tempObj[dataItem?.faq_type_category_url] = dataItem?.faq_type_category_icon;
      })
      setIconListData(tempObj)
    } else {
      setIconListData({})
    }
  }, [data?.fagCategories]);

  const dataBlock = (
    loading && !data?.fagCategories?.length ?
      <SkeletonLoader length={8} full={true} pclassName="flex col gap-3" />
      :
      <ul className="flex col">
        {data?.fagCategories?.map((item, ind, arr) => (
          <li key={`userPage${ind}`}>
            <Link
              className={`fs-15 line-5 fw-700 ${pathName == item?.faq_type_category_url ? "active" : ""
                }`}
              to={`/meest-gestelde-vragen/${item?.faq_type_category_url}?${queryParams}`}
              aria-label={item?.faq_type_category_name}
              state={{ initialSlide: ind }}
              onClick={(e) => {
                setShowSuggestion(false);
                setSearchData(null);
                if (arr?.length > 1) {
                  dragging && e.preventDefault();
                }
                setInitialSlideRef(ind);
              }}
            >
              {item?.faq_type_category_name}
            </Link>
          </li>
        ))}
      </ul>
  );
  const dataBlockMobile = (
    initialSlideRef !== null ?
      loading && !data?.fagCategories?.length ?
        <ul className="w-1/1 py-3 sidebar_mobRes">
          <Slider {...settings}>
            {['', '', '', '', ''].map((item, ind, arr) => (
              <li key={`userPage${ind}`} >
                <SkeletonLine
                  animation="pulse"
                  width="100px"
                  height="20px"
                  style={{ borderRadius: "5px" }}
                />
              </li>
            ))}
          </Slider>
        </ul> :
        <ul className="w-1/1 py-3 sidebar_mobRes">
          {
            data?.fagCategories?.length ?
              <Slider {...settings} ref={sliderRef}>
                {data?.fagCategories?.map((item, ind, arr) => (
                  <li key={`userPage${ind}`} >
                    <Link
                      className={`fs-15 fw-bold line-6 text-nowrap ${pathName == item?.faq_type_category_url ? "active" : ""
                        }`}
                      to={`/meest-gestelde-vragen/${item?.faq_type_category_url}?${queryParams}`}
                      aria-label={item?.faq_type_category_name}
                      state={{ initialSlide: ind }}
                      onClick={(e) => {
                        setShowSuggestion(false);
                        setSearchData(null);
                        if (arr?.length > 1) {
                          dragging && e.preventDefault();
                        }
                        setInitialSlideRef(ind);
                      }}
                    >
                      {item?.faq_type_category_name}
                    </Link>
                  </li>
                ))}
              </Slider> : <></>
          }
        </ul>
      : <></>
  );
  const dataBlocks =
    loading ?
      ['', '', '', '', '', '', '']?.map((item, index) => (
        <div className="sidebar__accordion__section py-1" key={`faq__details${index}`}>
          <div className="faq__details flex parent pb-3 gap-4">
            <div className="toggle__arrow flex  pointer">
              <SkeletonLine
                animation="pulse"
                width="25px"
                height="25px"
                style={{ borderRadius: "5px" }}
              />
            </div>
            <SkeletonLine
              animation="pulse"
              width="100%"
              height="27px"
              style={{ borderRadius: "5px" }}
            />
          </div>
        </div>
      )) :
      data?.fagCategoryDetails?.map((item, index) => (
        <div
          className={`sidebar__accordion__section py-1 ${selectedCategory === item?.faq_id ? "active" : ""
            }`}
          key={`faq__details${index}`}
        >
          <div className="faq__details flex parent pb-3 gap-4">
            <div
              className="toggle__arrow flex  pointer "
              onClick={() => toggleAction(item?.faq_id)}
            >
              {selectedCategory === item?.faq_id ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
              <input id={`activeFaq${item?.faq_id}`} aria-label="faq" />
            </div>
            <p
              className={`flex-1  fw-700 pointer fs-20 ${selectedCategory === item?.faq_id ? "activeq" : ''}`}
              onClick={() => toggleAction(item?.faq_id)}
            >
              {item?.faq_title}
            </p>
          </div>
          <div className="flex pb-1 pl-8"></div>
          {selectedCategory === item?.faq_id ? (
            <div className="answers flex col pb-1  pl-10">
              <p
                className="fs-15 pb-4 line-6"
                dangerouslySetInnerHTML={{
                  __html: item?.faq_detail_description,
                }}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      ));
  const breadCrumbData = [
    {
      categoryName: "Meest gestelde vragen",
      urlKey: "meest-gestelde-vragen",
      catId: "",
    },
    {
      categoryName: data?.fagCategoryDetails ? data?.fagCategoryDetails[0]?.faq_type_category_name : "",
      urlKey: "",
      catId: "",
    },
  ];
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
  return (
    <React.Fragment>
      <Seo
        metaTitle={seoData?.metaTitle}
        metaDescription={seoData?.metaDescription}
        metaKeywords={seoData?.metaKeywords}
      />
      <div className="pt-4">
        <Breadcrumb data={breadCrumbData} />
        <div className="container px-4">
          <div className="faq ">
            <div className="py-8  ">
              <h3 className="fs-28 lg-fs-32 fw-700 tc">
                Hallo, waarmee kunnen we je helpen?
              </h3>
            </div>
            <div
              className={`details_search__bar search container pb-3 relative ${isFocused ? "focused" : ""
                }`}
            >
              <input
                type="text"
                className="searchbox pr-14 pl-6"
                placeholder={storeId === 1 ? "Kan ik een sample ontvangen?" : "Wat is de levertijd?"}
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
              <div className="search__res px-4 flex center relative">
                <div className="detail__search search__suggestion__container__faq  mx-auto absolute container">
                  {searchData?.fagCategoryDetails?.length ? (
                    searchData?.fagCategoryDetails?.map(
                      (searchItem, searchIndex) => (
                        <p
                          className="fs-15  py-4 px-8 pointer"
                          onClick={() => onNavigate(searchItem)}
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
          </div>
          <div className="md-px-4 pt-5 lg-pt-11 pb-11 flex col lg-flex lg-row gap-5 lg-gap-7 user__sidebar_parent">
            <div className="user__sidebar">
              <BackgroundBox className="pt-6 pb-4 px-0 lg-pt-6 lg-px-8 lg-pb-8">
                {width >= 768 && dataBlock}
                <div className="lg-hide">{dataBlockMobile}</div>
              </BackgroundBox>
            </div>
            <div className="w-1/1">
              {
                loading ?
                  <div className="flex gap-4 middle ">
                    <div className="faq__icon">
                      <SkeletonLine
                        animation="pulse"
                        width="35px"
                        height="35px"
                        style={{ borderRadius: "5px" }}
                      />
                    </div>
                    <SkeletonLine
                      animation="pulse"
                      width="200px"
                      height="42px"
                      style={{ borderRadius: "5px" }}
                    />
                  </div> :
                  <div className="flex gap-4 middle ">
                    <div className="faq__icon">
                      <span
                        className={`${iconListData[data?.fagCategoryDetails[0]?.faq_type_category_url]}`}
                      ></span>
                    </div>
                    <h2 className="fs-24 lg-fs-32 fw-700">
                      {data?.fagCategoryDetails[0]?.faq_type_category_name}
                    </h2>
                  </div>
              }
              <div className="py-8">{dataBlocks}</div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default memo(FaqDetail);
