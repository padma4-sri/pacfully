import React, { useContext, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
  ACTION_LOADER,
  ACTION_CUSTOMER__QUOTE__ID,
  ACTION_GUESTKEY,
  ACTION_GUESTQUOTE__DETAILS,
  ACTION_ADMINTOKEN,
  ACTION_WISHLISTADDED__DATA,
  ACTION_WISHLIST_COUNT,
  ACTION_HEADERFOOTER__LOADING,
  ACTION_FETCH__HEADERFOOTER,
  ACTION_HOMEPAGE__LOADING,
  ACTION_FETCH__HOMEPAGE,
  ACTION_FETCH__HOMEPAGE_FEATURE_PRODUCT
} from "Store/action";
import axios from "axios";
import { SessionExpiredLogout, addWishList, getCartItems } from "Utilities";
import { APIQueryPost, APIQueryGet } from "APIMethods/API";
import { useLocation, useNavigate } from 'react-router-dom';
import RenderContext from 'Context/RenderContext';

const InitialFunctions = (baseURL, storeId, defaultURL) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedUser = useSelector((state) => state?.isLoggedUser);
  const customerDetails = useSelector((state) => state?.customerDetails);
  const token = useSelector((state) => state?.token);
  const guestQuoteId = useSelector((state) => state?.guestQuoteDetails?.id);
  const isHomePageCalled = useSelector(state => state?.getHomePageData?.checkHeaderFooterData);
  const checkHeaderFooterData = useSelector(state => state?.getHeaderFooterData?.checkHeaderFooterData);
  const checkHomePageData = useSelector(state => state?.getHomePageData?.checkHomePageData);
  const customerQuoteId = useSelector((state) => state?.customerQuoteId);
  const countriesList = useSelector(state => state?.countriesList);
  const wishlistAddedData = useSelector((state) => state?.wishlistAddedData);
  const wilistProductId = useSelector((state) => state?.wilistProductId);
  const adminToken = useSelector((state) => state?.adminToken);
  const isSessionExpired = useSelector((state) => state?.isSessionExpired);
  const updateWishList = useSelector((state) => state?.updateWishList);
  const { loadPreRender, loadIfUser } = useContext(RenderContext)

  const APIReferenceWishlist = useRef(false);
  const APIReferenceCartItems = useRef(false);
  const APIReferenceHeader = useRef(false);
  const APIReference = useRef(false);
  const APIReferenceCountry = useRef(false);
  const APIReferenceQuoteStatus = useRef(false);

  // validate quote
  const getQuoteStatus = async (id) => {
    try {
      const payload = {
        data: {
          cartId: id,
          storeId: storeId,
        },
      };
      const responseData = await axios.post(defaultURL + "/cart/verify", payload);
      if (responseData?.data[0]?.code === 400) {
        if (isLoggedUser) {
          dispatch(ACTION_CUSTOMER__QUOTE__ID(""));
          getCustomerQuoteId();
        }
        else {
          dispatch(ACTION_GUESTKEY(""));
          dispatch(ACTION_GUESTQUOTE__DETAILS({}));
        }
      }

    } catch (err) {
      console.log(err, "Validate Quote id err");
    }
  };
  const getCustomerQuoteId = () => {
    const quoteIdOptions = {
      isLoader: true,
      loaderAction: (bool) => {
        dispatch(ACTION_LOADER(bool))
      },
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          dispatch(ACTION_CUSTOMER__QUOTE__ID(resData?.data));
        }
      },
      getStatus: (res) => {
        if (res?.status !== 200) {
        }
      },
      axiosData: {
        url: `${defaultURL}/carts/mine`,
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    }
    APIQueryPost(quoteIdOptions);
  }

  const setListItems = (data) => {
    let x = data && Object.keys(data);
    let allDetails = [];
    const list = new Promise((resolve, reject) => {
      x?.forEach((value, index, array) => {
        allDetails.push({
          sku: value,
          itemId: data[value]
        })
        if (index === array.length - 1) resolve();
      });
    });
    list.then(() => {
      dispatch(ACTION_WISHLISTADDED__DATA(allDetails));
      dispatch(ACTION_WISHLIST_COUNT(allDetails?.length));
    });
  }
  const wishListOptions = {
    setGetResponseData: (resData) => {

      if (resData?.data?.length) {
        setListItems(resData?.data?.[0]);
      } else {
        dispatch(ACTION_WISHLISTADDED__DATA([]));
        dispatch(ACTION_WISHLIST_COUNT(0));
      }
    },
    axiosData: {
      url: `${baseURL}/wishlist/userListSku`,
      headers: { Authorization: `Bearer ${token}` },
      paramsData: {
        customerId: customerDetails?.id ? customerDetails?.id : null,
        storeId: storeId
      }
    },
    getStatus: (res) => {
      SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
    }
  };

  // headerFooterParams
  const headerFooterOptions = {
    isLoader: true,
    loaderAction: (bool) => dispatch(ACTION_HEADERFOOTER__LOADING(bool)),
    setGetResponseData: (resData) => {
      dispatch(ACTION_FETCH__HEADERFOOTER({
        checkHeaderFooterData: true,
        data: resData?.data?.[0]
        // data: headerData,
        
      }))
    },
    axiosData: {
      url: `${baseURL}/home/headerfooter`,
      

    }
  }

  // homepageParams
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
      url: `${baseURL}/home/getHomePage`,

    }
  }
  const featureProduct = {
    isLoader: false,
    loaderAction: (bool) => {
      dispatch(ACTION_HOMEPAGE__LOADING(bool))
    },
    setGetResponseData: (resData) => {
      dispatch(ACTION_FETCH__HOMEPAGE_FEATURE_PRODUCT(
        resData?.data
      ))
    },
    axiosData: {
      url: `${defaultURL}/getFeaturedProducts`,

    }
  }
  const fetchHomePageData = async () => {
    // First API call
    await APIQueryGet(homeOptions);
    
  };
  useEffect(() => {
   
    if ((loadIfUser || loadPreRender) && location?.pathname === "/react-app") {
      // Feature product
      fetchHomePageData();


    }
  }, [loadIfUser, loadPreRender, location?.pathname]);
  // footer API call
  useEffect(() => {
    if (!checkHeaderFooterData && !APIReferenceHeader.current) {
      APIReferenceHeader.current = true;
      APIQueryGet(headerFooterOptions);
      setTimeout(() => APIReferenceHeader.current = false, 300);
    }
  }, [location?.pathname, checkHeaderFooterData]);

  // homePage API call
  // useEffect(() => {
  //   if (location?.pathname === "/" && !isHomePageCalled && !APIReference.current && !checkHomePageData) {
  //     APIReference.current = true
  //     APIQueryGet(homeOptions)
  //     setTimeout(() => APIReference.current = false, 300)
  //   }
  // }, [location?.pathname]);

  // country list
  useEffect(() => {
    if (!APIReferenceCountry.current && location?.pathname !== "/" && !countriesList?.length) {
      APIReferenceCountry.current = true
      setTimeout(() => APIReferenceCountry.current = false, 300);
    }
  }, [location]);
  // add wishlist
  useEffect(() => {
    if (customerDetails?.id && wilistProductId?.id !== "" && token) {
      addWishList(
        defaultURL,
        dispatch,
        token,
        customerDetails?.id,
        { id: wilistProductId?.id, sku: wilistProductId?.sku },
        wishlistAddedData,
        storeId,
        navigate,
        isSessionExpired
      );
    }
  }, [customerDetails?.id, token]);
  // validate quote
  useEffect(() => {

    if (!APIReferenceQuoteStatus.current) {
      APIReferenceQuoteStatus.current = true;
      if (isLoggedUser && customerQuoteId) {
        // getQuoteStatus(customerQuoteId);
      }
      if (!isLoggedUser && guestQuoteId) {
        // getQuoteStatus(guestQuoteId);
      }
      setTimeout(() => (APIReferenceQuoteStatus.current = false), 300);
    }
  }, []);


 
  // adminToken
 
  // useEffect(() => {
  //   if (customerDetails?.id && !APIReferenceCartItems.current && customerQuoteId) {
  //     APIReferenceCartItems.current = true;
  //     if (isLoggedUser && customerQuoteId) {
  //       getCartItems(dispatch, () => { }, customerQuoteId, customerDetails?.id, () => { }, defaultURL, storeId, token);
  //     }
  //     setTimeout(() => (APIReferenceCartItems.current = false), 300);
  //   }
  // }, [customerDetails?.id, customerQuoteId]);

  // useEffect(() => {
  //   if (guestQuoteId && !APIReferenceCartItems.current) {
  //     APIReferenceCartItems.current = true;
  //     if (!isLoggedUser) {
  //       getCartItems(dispatch, () => { }, guestQuoteId, "", () => { }, defaultURL, storeId, token);
  //     }
  //     setTimeout(() => (APIReferenceCartItems.current = false), 300);
  //   }
  // }, []);
  // get SKU Wishlist
  useEffect(() => {
    if (customerDetails?.id && token && !APIReferenceWishlist.current && !wilistProductId?.id && location?.pathname !== "/mijn-account/mijn-favorieten") {
      APIReferenceWishlist.current = true;
      // APIQueryPost(wishListOptions);
      setTimeout(() => (APIReferenceWishlist.current = false), 300);
    }
  }, [customerDetails?.id, token, wilistProductId?.id, updateWishList]);
}

export default InitialFunctions;