import React, { useEffect, useContext, useState, useRef, memo } from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import Img from "Components/Img";
import IconButton from "@mui/material/IconButton";
import {
  SearchIcon,
  TelephoneIcon,
  UserIcon,
  WishIcon,
  CartIcon,
  MenuIcon,
  XIcon,
  LoggedIcon
} from "Res/icons";
import logoImg from "Res/images/logo.svg";
import SearchSuggestion from "Components/Header/SearchSuggestion";
import ModelNew from "Components/Model/ModelNew";
import AllCategories from "../AllCategories";
import { useDispatch, useSelector } from "react-redux";
import Social from "../Social";
import {  APIQueryGet } from "APIMethods/API";
import { handleLogin } from "Utilities";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoginForgot from "../LoginForgot/LoginForgot";
import { ACTION_OPENCART } from "Store/action";
import MiniCart from "../MiniCart";
import Search from "../Search/Search";
import RenderContext from "Context/RenderContext";

const TopHeader = ({
  isFocused, setIsFocused, handlesetsearchkeyword,
  searchResultHandler, inputRef, searchKeyword, setSearchKeyword,
  showSuggestion, setShowSuggestion, setOpenSearch, openSearch,
  searchData, loadingSearch
}) => {
  const {storeId, defaultURL } = useContext(DomainContext);
  const { loadPreRender } = useContext(RenderContext);
  const dispatch = useDispatch();
  const location = useLocation();
  const getHeaderData = useSelector((state) => state?.getHeaderFooterData?.data?.header);
  const isLoggedUser = useSelector((state) => state?.isLoggedUser);
  const wishlistCount = useSelector((state) => state?.wishlistCount);
  const cartCount = useSelector((state) => state?.cartItems?.[0]?.totals_detail?.items?.length);
  const [minicartPopUp, setMinicartPopUp] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [openModelSocial, setOpenModelSocial] = useState(false);
  const [getCategoriesListData, setGetCategoriesListData] = useState({});
  const [getCategoriesListStatus, setGetCategoriesListStatus] = useState(true);
  const navigate = useNavigate();
  const inputRef1 = useRef();
  const [scrollPosition, setScrollPosition] = useState(0);
  const options = {
    isLoader: true,
    loaderAction: (bool) => setGetCategoriesListStatus(bool),
    setGetResponseData: (res) => {
      setGetCategoriesListData(res?.data?.[0]);
    },
    axiosData: {
      url: `${defaultURL}/megamenu/categories`,
      method: "get",

    },
  };
  const categoriesHandler = () => {
    setOpenModel(true);
    if (!getCategoriesListData?.main?.length) {
      APIQueryGet(options);
    }
  };

  // scroll position
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };
  useEffect(() => {
    if (showSuggestion === false && !location?.pathname?.includes("/zoeken/")) {
      setTimeout(() => {
        setSearchKeyword("");
      }, 300);
    }
  }, [showSuggestion, location]);
  
  useEffect(() => {
    if (location?.pathname?.includes("/zoeken/")) {
      const encodedUrl = location?.pathname?.slice(17)?.split('/')?.[0];
      const decodedUrl = decodeURIComponent(encodedUrl);
      setSearchKeyword(decodedUrl);
    }
  }, [location]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      setMinicartPopUp(vw);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [minicartPopUp]);
  return (
    <React.Fragment>
      <header
        className={`header sticky top-0 left-0 w-1/1 zindex-10 ${(scrollPosition > 130 && !showSuggestion) ? "headerShadow" : ""} ${(scrollPosition > 1 && !showSuggestion) ? "headerBorder" : ""} ${scrollPosition > 130 ? "stickyHeader" : ""
          }`}
      >
        <div
          className="container pt-4 pb-6 lg-pb-4 pl-4 pr-4 xxl-pl-4 xxl-pr-4"
          id="top_header"
        > 
          <div className="flex gap-y-2 xl-flex xl-gap-x-8 wrap middle">
            {openSearch ? (
              ""
            ) : (
              <div className="item-1 py-3 flex middle gap-2 xl-flex xl-gap-x-3">
                <IconButton
                  className="menu_icon_button"
                  aria-label="toggle"
                  // onClick={() => categoriesHandler()}
                >
                  <MenuIcon />
                </IconButton>
                <Link
                  to="/"
                  aria-label={"home"}
                  className="logo relative"
                  onClick={() => {
                    setShowSuggestion(false);
                  }}
                >
                  <Img
                    src={logoImg}
                    className="w-1/1 h-1/1"
                    style={{ objectFit: "contain" }}
                  />
                </Link>
              </div>
            )}
            {openSearch ? (
              <div className="item-2 flex relative zindex-20 lg-px-8 ">
                <div className={`header__search ${isFocused ? "focused" : ""}`}>
                  <input
                    type="text"
                    aria-label="Search"
                    className="searchbox pr-14 pl-6"
                    placeholder="Search your box"
                    onFocus={() => {
                      setIsFocused(true);
                    }}
                    onChange={(e) => handlesetsearchkeyword(e)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        searchResultHandler();
                      }
                    }}
                    value={searchKeyword}
                    ref={inputRef1}
                  />
                  <IconButton
                    className="mr-2"
                    aria-label="search toggle"
                    onClick={() => {
                      setShowSuggestion(false);
                      setOpenSearch(false);
                    }}
                  >
                    {showSuggestion ? (
                      <XIcon style={{ width: 14, height: 14 }} />
                    ) : (
                      <SearchIcon />
                    )}
                  </IconButton>
                </div>
              </div>
            ) : null}
            {!openSearch ? (
              <Search
                className="item-2 hide lg-flex relative zindex-20 lg-px-8" id="defaultSearchInput"
                isFocused={isFocused} setIsFocused={setIsFocused} handlesetsearchkeyword={handlesetsearchkeyword}
                searchResultHandler={searchResultHandler} inputRef={inputRef} searchKeyword={searchKeyword}
                showSuggestion={showSuggestion} setShowSuggestion={setShowSuggestion} setOpenSearch={setOpenSearch}
              />
            ) : null}

            {openSearch ? (
              ""
            ) : (
              <div className="item-3 right flex gap-1 md-gap-2">
                {scrollPosition >= 1 && !showSuggestion ? (
                  <div className="search__icon hide lg-block">
                    <IconButton
                      aria-label="telephone"
                      className="hide xs-flex"
                      onClick={() => {
                        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
                        document.getElementById('searchInput').focus();
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </div>
                ) : <></>}
                {/* <IconButton
                  aria-label="telephone"
                  className="hide xs-flex"
                  onClick={() => {
                    setShowSuggestion(false);
                    setOpenModelSocial(true);
                  }}
                >
                  <TelephoneIcon />
                </IconButton> */}
                <IconButton
                  aria-label="user"
                  onClick={() => {
                    if (isLoggedUser) {
                      navigate("/mijn-account/mijn-overzicht");
                    } else {

                      handleLogin(dispatch);
                      setShowSuggestion(false);

                    }
                  }}
                >
                  <UserIcon />
                  {
                    isLoggedUser ?
                      <div className="badge nowrap fw-400 line-4 absolute top-0 right-0 r-full flex center middle">
                        <LoggedIcon />
                      </div>
                      : <></>
                  }
                </IconButton>
                <IconButton
                  // onClick={() => {
                  //   setShowSuggestion(false);
                  //   if (isLoggedUser) {
                  //     navigate("/mijn-account/mijn-favorieten");
                  //   } else {
                  //     setShowSuggestion(false);
                  //     handleLogin(dispatch);
                  //   }
                  // }}
                  aria-label="wishlist"
                  className="hide wishlist__icon"
                >
                  <WishIcon />
                  {wishlistCount ? (
                    <div className="badge nowrap fw-400 line-4 absolute top-0 right-0 r-full flex center middle">
                      {wishlistCount}
                    </div>
                  ) : (
                    <></>
                  )}
                </IconButton>

                <IconButton
                  className="relative"
                  aria-label="cart"
                  onClick={() => {
                    if (minicartPopUp <= 768) {
                      navigate('/winkelwagen')
                    }
                    else {
                      setShowSuggestion(false);
                      dispatch(ACTION_OPENCART(true));
                    }

                  }}
                >
                  <CartIcon />
                  <div className="badge nowrap fw-400 line-4 absolute top-0 right-0 r-full flex center middle">
                    {cartCount ? cartCount : "0"}
                  </div>
                </IconButton>
              </div>
            )}
          </div>
        </div>
      </header>
      {!loadPreRender &&
      <div className="hide lg-block header__suggestion relative">
        <SearchSuggestion
          openModel={showSuggestion}
          setOpenModel={setShowSuggestion}
          loading={loadingSearch}
          searchKeyword={searchKeyword}
          searchData={searchData}
          setShowSuggestion={setShowSuggestion}
          showSuggestion={showSuggestion}
          openSearch={openSearch}
          setOpenSearch={setOpenSearch}
        />
      </div>}
      <ModelNew
        className="megaAllMenu"
        open={openModel}
        shadow={false}
        setOpen={setOpenModel}
      >
        <AllCategories
          open={openModel}
          setOpen={setOpenModel}
          loading={getCategoriesListStatus}
          menuData={getCategoriesListData}
        />
      </ModelNew>
      <Social openModel={openModelSocial} setOpenModel={setOpenModelSocial} />
      <LoginForgot />
      <MiniCart />
    </React.Fragment>
  );
};

export default memo(TopHeader);
