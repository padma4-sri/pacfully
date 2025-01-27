import React, { useState, useEffect, useContext } from "react";
import DomainContext from "Context/DomainContext";
import Button from "Components/Common/Button";
import { Link } from "react-router-dom";
import "./styles.scss";
import { useLocation, useNavigate ,useParams} from "react-router-dom";
import { mergeCart } from "Utilities";
import { APIQueryPost, APIQueryGet } from "APIMethods/API";
import ProductSlider from "Components/ProductSlider";
import { SessionExpiredLogout } from "Utilities";
import {
  ACTION_CUSTOMER__DETAILS,
  ACTION_CUSTOMER__QUOTE__ID,
  ACTION_CUSTOMER__TOKEN,
  ACTION_ISLOGGEDUSER,
  ACTION_SAVE_ADDRESS_SHIPPING,
  ACTION__SELECTEDADDRESS_BILLING,
  ACTION__SELECTEDADDRESS_SHIPPING,
  ACTION_SAVE_ADDRESS,
  ACTION_GUESTQUOTE__DETAILS,
  ACTION_GUESTKEY,
  ACTION_RECENT_VIEW_LOAD,
} from "Store/action";
import { useDispatch, useSelector } from "react-redux";
import Img from "Components/Img";
import { SkeletonLine } from "Components/Skeletion";
import useScrollToTop from 'Components/Hooks/useScrollToTop';


function OrderConfirmation() {
  const { succesToken,cartCount, updateCartItems, guestKey, isSessionExpired,token, guestQuoteId } = useSelector(
    (state) => {
      return {
        cartCount: state?.cartItems?.[0]?.totals_detail?.items?.length,
        updateCartItems: state?.updateCartItems,
        guestKey: state?.guestKey,
        isSessionExpired: state?.isSessionExpired,
        token: state?.token,
        guestQuoteId: state?.guestQuoteDetails?.id,
        succesToken: state?.succesToken,
      };
    }
  );
  const isLoggedUser = useSelector((state) => state?.isLoggedUser);
  const customerQuoteId = useSelector((state) => state?.customerQuoteId);
  const { baseURL, defaultURL, storeId } = useContext(DomainContext);
  const symbol = ">";
  const tickIcon = "/res/img/tick.gif";
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState();
  const [productdata, setProductData] = useState();
  const dispatch = useDispatch();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const orderIdParam = urlParams.get('order_id');
  const transactionId = urlParams.get('transactionid');
  const monduIdParam = urlParams.get('order_uuid');
  const [isVisible, setIsVisible] = useState(false);
  const params = useParams;
  const { transactionid } = useParams();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const orderIds = transactionId ? transactionId:
  (location?.state ? location.state :
    location?.search?.split("=")?.[1]);
  useScrollToTop();

  const getCustomerQuoteId = (tokens, data) => {
    const quoteIdOptions = {
      isLoader: true,
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          dispatch(ACTION_CUSTOMER__QUOTE__ID(resData?.data));
          dispatch(ACTION_CUSTOMER__TOKEN(token?token:tokens));
          dispatch(ACTION_ISLOGGEDUSER(true));
          if (cartCount && tokens ) {
            mergeCart(dispatch, updateCartItems, token?token:tokens, data?.id, guestKey, baseURL, storeId, guestQuoteId, defaultURL, () => { }, navigate, isSessionExpired);
          }
        }
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      },
      axiosData: {
        url: `${defaultURL}/carts/mine`,
        method: "post",
        headers: {
          Authorization: `Bearer ${token?token:tokens}`,
        },
      },
    };
    APIQueryPost(quoteIdOptions);
  };
  const getQuoteStatus = (id) => {
    const options = {
      isLoader: true,
      loaderAction: (bool) => dispatch(ACTION_RECENT_VIEW_LOAD(bool)),
      setGetResponseData: (resData) => {
        if (resData?.data[0]?.code === 400) {
          if (isLoggedUser) {
            dispatch(ACTION_CUSTOMER__QUOTE__ID(""));
            getCustomerQuoteId();
          }
          else {
            dispatch(ACTION_GUESTKEY(""));
            dispatch(ACTION_GUESTQUOTE__DETAILS({}));
          }
        }
      },
      axiosData: {
        url: `${baseURL}/cart/verify`,
        paramsData: {
          data: {
            cartId: id,
            storeId: storeId,
          }
        }
      }
    };
    APIQueryPost(options);
  };

  const getUserDetails = (token) => {
    const userDetailsOptions = {
      isLoader: true,
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          getCustomerQuoteId(token, resData?.data);
          dispatch(ACTION_CUSTOMER__DETAILS(resData?.data));
          dispatch(ACTION_GUESTQUOTE__DETAILS({}));
        }
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      },
      axiosData: {
        url: `${defaultURL}/customers/me`,
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    };
    APIQueryGet(userDetailsOptions);
  };
  const submitQuote = () => {
   
    const quoteSubmit = {
      isLoader: true,
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          OthersBought();
          setData(resData?.data[0]);
          if (!isLoggedUser && (resData?.data[0]?.token || succesToken)) {
            dispatch(ACTION_ISLOGGEDUSER(true));
            dispatch(ACTION_CUSTOMER__TOKEN(resData?.data[0]?.token ?resData?.data[0]?.token :succesToken ));
            getUserDetails(resData?.data[0]?.token?resData?.data[0]?.token:succesToken);
          }
          if (isLoggedUser) {
            dispatch(ACTION_SAVE_ADDRESS_SHIPPING({}));
            dispatch(ACTION_SAVE_ADDRESS({}));
            dispatch(ACTION__SELECTEDADDRESS_BILLING({}));
            dispatch(ACTION__SELECTEDADDRESS_SHIPPING({}));
          }
          if ( customerQuoteId) {
            getQuoteStatus(customerQuoteId);
          }
          if ( guestQuoteId) {
            getQuoteStatus(guestQuoteId);
          }
        }
      },
      getStatus: (res) => { },
      axiosData: {
        url: `${baseURL}/order/success`,
        method: "post",
        paramsData: {
          storeId: storeId,
          orderId: orderIds, 
          referenceNumber: "",
          monduUid: monduIdParam ? monduIdParam : ""
        },
      },
    };
    APIQueryPost(quoteSubmit);
  };

  const OthersBought = () => {
    const othersBought = {
      isLoader: true,
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          setProductData(resData?.data[0]);
        }
      },
      axiosData: {
        url: `${baseURL}/order/othersAlsoBought`,
        method: "post",
        paramsData: {
          storeId: storeId,
         
        },
      },
    };
    APIQueryPost(othersBought);
  };
 
  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (orderIds == undefined) {
      if (isSafari) {
        window.location.reload();
      } 
    } else {
      submitQuote();
    }
  }, [location, navigate, orderIds]);

  useEffect(()=>{

  },[data])
  // commented for purpose
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://bat.bing.com/bat.js";
  //   script.async = true;

  //   script.onload = () => {
  //     if (window.UET) {
  //       const uetq = window.uetq || [];
  //       const uet = new window.UET({ ti: "187018392" });
  //       uetq.push("pageLoad");
  //       window.uetq = uetq;
        
  //       window.uetq.push('event', 'PRODUCT_PURCHASE', {
  //         ecomm_prodid: "REPLACE_WITH_PRODUCT_ID",
  //         ecomm_pagetype: "PURCHASE",
  //         revenue_value: data?.grandTotal,
  //         currency: "EUR"
  //       });
  //     }
  //   };

  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);
  return (
    <>
     
      <div >
        <div className="container px-4 py-6">
          {data?
          <div className="quote__confirmation">
          <div className="tick__img relative">
            <Img
              type="img"
              src={tickIcon}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contained",
              }}
            />
          </div>
          <h1 className=" line_height fw-700 fs-32 tc pb-2">
            Bedankt voor je bestelling,
          </h1>
          <h1 className="line_height fw-700 fs-32 tc pb-4">{data?.name}!</h1>
          <p className="fw-700 fs-16 tc pb-4">
            Ordernummer #{data?.incrementId}
          </p>
          <p className="fs-15 tc  px-8 line-6">
            De orderbevestiging wordt verstuurd naar uw e-mailadres.
          </p>
                    <p className="fs-15 tc pb-6 px-8 line-6">
            Controleer ook de spam folder! Niks ontvangen? Neem contact op via&nbsp;
              <>
                <a
                  className="line-6 text-underline pb-1"
                  target="__blank"
                >
                  sales@pacfully.nl
                </a>
                &nbsp;
                <a className="line-6" href={`tel:+91(0) 8877665544`}>
                  of bel +91 8877665544
                </a>
              </>
          </p>

        <Link to={`/mijn-account/besteldetails?${data?.orderId}`} aria-label={`mijn-account-besteldetails ${data?.orderId}`} className="block">
          <Button
            className="fs-15 line-8 fw-700 r-8 px-5 block mx-auto mb-4 order_confirmationBtn"
            fullWidth
            type="submit"
            disabled={!isVisible}
          >
            Bekijk bestelling in mijn account
          </Button>
        </Link>

          <Link to="/" aria-label={`home`} className="tc block text-underline fs-14">
            verder winkelen {symbol}
          </Link>
        </div>
        :
        <div className="quote__confirmation">
            <div className="tick__img relative ">
              <Img
                type="img"
                src=""
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contained",
                }}
              />
            </div>
            <h1 className="fw-700 fs-32 tc line-15 pb-2 pt-4">
            <SkeletonLine width="100%" height="30px" />

            </h1>

            <h1 className="fw-700 fs-32 tc line-15 pb-4">
            <SkeletonLine width="100%" height="30px" />

            </h1>
            <p className="fw-700 fs-16 tc pb-4">
            <SkeletonLine width="100%" height="30px" />

            </p>
            <p className="fs-15 tc  px-8 line-6">
            <SkeletonLine width="100%" height="30px" />

            </p>
          
          </div>
          }
          
        </div>

        <div className="cart__product__slider ">
          <ProductSlider
            title='Anderen kochten ook..'
            loading={false}
            data={productdata?.others_bought_items}
          />
        </div>
      </div>
    </>
  );
}

export default OrderConfirmation;
