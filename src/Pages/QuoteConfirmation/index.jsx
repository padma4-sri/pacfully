import React, { useState, useContext, memo ,useEffect} from "react";
import DomainContext from "Context/DomainContext";
import Button from "Components/Common/Button";
import { Link } from "react-router-dom";
import "./styles.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { APIQueryPost, APIQueryGet } from "APIMethods/API";
import {
  ACTION_CUSTOMER__DETAILS,
  ACTION_CUSTOMER__QUOTE__ID,
  ACTION_CUSTOMER__TOKEN,
  ACTION_ISLOGGEDUSER,
  ACTION_GUESTQUOTE__DETAILS,
  ACTION_GUESTKEY,
} from "Store/action";
import { useDispatch, useSelector } from "react-redux";
import Img from "Components/Img";
import useScrollToTop from "Components/Hooks/useScrollToTop";
import { SessionExpiredLogout, getCartItems } from "Utilities";
import { useEffectOnce } from 'Components/Hooks/useEffectOnce';

function QuoteConfirmation() {
  useScrollToTop();
  const {cartDetails,customerDetails, cartCount, guestQuoteId, customerId, customerQuoteId, isSessionExpired } = useSelector((state) => {
    return {
      cartCount: state?.cartItems?.[0]?.totals_detail?.items?.length,
      updateCartItems: state?.updateCartItems,
      guestKey: state?.guestKey,
      isSessionExpired: state?.isSessionExpired,
      customerQuoteId: state?.customerQuoteId,
      guestQuoteId: state?.guestQuoteDetails?.id,
      token: state?.token,
      cartDetails: state?.cartItems?.[0],
      customerId: state?.customerDetails?.id,
      customerDetails: state?.customerDetails,

    };
  });
  const getHeaderData = useSelector(state => state?.getHeaderFooterData?.data?.header?.contactSection?.contactDetails);
  const email = getHeaderData?.filter(item => item?.contactInfo?.mailId);
  const mobileNumber = getHeaderData?.filter(item => item?.contactInfo?.whatsappNumber);
  const isLoggedUser = useSelector((state) => state?.isLoggedUser);
  const { baseURL, defaultURL, storeId } = useContext(DomainContext);
  const symbol = ">";
  const tickIcon = "/res/img/tick.png";
  const location = useLocation();
  const navigate = useNavigate()
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.token);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  const getCustomerQuoteId = (token, id) => {
    const quoteIdOptions = {
      isLoader: true,
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          if (!cartCount || cartCount === undefined) {
            dispatch(ACTION_GUESTKEY(""));
            dispatch(ACTION_GUESTQUOTE__DETAILS({}));
          }
          dispatch(ACTION_CUSTOMER__QUOTE__ID(resData?.data));
          dispatch(ACTION_CUSTOMER__TOKEN(token));
          dispatch(ACTION_ISLOGGEDUSER(true));
        }
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      },
      axiosData: {
        url: `${defaultURL}/carts/mine`,
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    };
    APIQueryPost(quoteIdOptions);
  };
  const getCustomerQuote= () => {
    const quoteIdOptions = {
      isLoader: true,
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          if (!cartCount || cartCount === undefined) {
            dispatch(ACTION_GUESTKEY(""));
            dispatch(ACTION_GUESTQUOTE__DETAILS({}));
          }
          dispatch(ACTION_CUSTOMER__QUOTE__ID(resData?.data));
          dispatch(ACTION_CUSTOMER__TOKEN(token));
          dispatch(ACTION_ISLOGGEDUSER(true));
        }
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      },
      axiosData: {
        url: `${defaultURL}/carts/mine`,
        method: "post",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    };
    APIQueryPost(quoteIdOptions);
  };
  const getUserDetails = (token) => {
    const userDetailsOptions = {
      isLoader: true,
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          getCustomerQuoteId(token, resData?.data);
          dispatch(ACTION_CUSTOMER__DETAILS(resData?.data));
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
 
  const getQuoteStatus = (id) => {
    const options = {
      isLoader: true,
      setGetResponseData: (resData) => {
        if (resData?.data[0]?.code === 400) {
          if (isLoggedUser) {
            dispatch(ACTION_CUSTOMER__QUOTE__ID(""));
            getCustomerQuote();
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
 
  useEffectOnce(()=>{
    if(location?.state ==null){
      navigate("/")
    }
    else{
     
      setData(location?.state[0]);

    if (!isLoggedUser) {
      getUserDetails(location?.state[0]?.bearer_token);
      dispatch(ACTION_CUSTOMER__TOKEN(location?.state[0]?.bearer_token));
      dispatch(ACTION_ISLOGGEDUSER(true));
    }
    if (isLoggedUser && customerQuoteId) {
      getQuoteStatus(customerQuoteId);

    }
    if (!isLoggedUser && guestQuoteId) {
      getQuoteStatus(guestQuoteId);

    }
    if (isLoggedUser && customerQuoteId) {
      getCartItems(
        dispatch,
        () => { },
        customerQuoteId,
        customerId,
        () => { },
        defaultURL,
        storeId,
        token,
        navigate, isSessionExpired
        
      );
    } else if(guestQuoteId) {
      getCartItems(
        dispatch,
        () => { },
        guestQuoteId,
        "",
        () => { },
        defaultURL,
        storeId,
        token,navigate, isSessionExpired
        
      );
    }
   
    }
   
   
  });
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

  //       window.uetq.push('event', '', {
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
    <React.Fragment>
    
      <div className="container px-4 py-6">
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
          <h1 className="fw-700 fs-32 tc line-12 pb-2">
            Bedankt voor je offerteaanvraag,
          </h1>

          <h1 className="fw-700 fs-32 tc line-15 pb-2">{data?.customer_name?.split(" ")?.[0]}!</h1>
          <p className="fs-16 fw-600 tc line-15 ">{customerDetails?.email}</p>
         
          <p className="fw-700 fs-16 tc pb-4">
            Offertenummer #{data?.quote_id}
          </p>
          <p className="fs-15 tc  px-8 line-6">
            De bevestiging wordt verstuurd naar uw e-mailadres.
          </p>

          <p className="fs-15 tc pb-6 px-8 line-6">
            Controleer ook de spam folder! Niks ontvangen? Neem contact op via &nbsp;
            <a
              className="line-6 text-underline pb-1 "
              href={`mailto:${email?.[0]?.contactInfo?.mailId}`}
              target="__blank"
            >
              {email?.[0]?.contactInfo?.mailId}
            </a>
            &nbsp;
            of
            &nbsp;
            <a className="line-6" href={`tel:${mobileNumber?.[0]?.contactInfo?.whatsappLinkNumber}`}>
              bel {mobileNumber?.[0]?.contactInfo?.whatsappNumber}.
            </a>
          </p>

          <Link to={`/mijn-account/offertedetails?${data?.quote_id}`}aria-label={"Bekijk offerte in mijn account"} className="block">
            <Button
              className="fs-15 line-8 fw-700 r-8  px-5 block mx-auto mb-4"
              fullWidth
              type="submit"
            disabled={!isVisible}

            >
              Bekijk offerte in mijn account
            </Button>
          </Link>

          <Link to="/"aria-label={"home"} className="tc block text-underline fs-14" >
            verder winkelen {symbol}
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
}

export default memo(QuoteConfirmation);
