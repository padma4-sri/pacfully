import React,{useContext} from 'react';
import Cart from 'Components/CartQuote/Cart';
import useScrollToTop from "Components/Hooks/useScrollToTop";
import { useEffectOnce } from 'Components/Hooks/useEffectOnce';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import DomainContext from "Context/DomainContext";

import {
  ACTION_CUSTOMER__DETAILS,
  ACTION_CUSTOMER__QUOTE__ID,
  ACTION_CUSTOMER__TOKEN,
  ACTION_ISLOGGEDUSER,
  ACTION_GUESTQUOTE__DETAILS,
  ACTION_GUESTKEY,
  ACTION_RECENT_VIEW_LOAD
} from "Store/action";
import { APIQueryPost, APIQueryGet } from "APIMethods/API";
import { SessionExpiredLogout,mergeCart } from "Utilities";

function CartPage() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const token = urlParams.get('token');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {  defaultURL,baseURL ,storeId} = useContext(DomainContext);

  const {guestKey,updateCartItems,isLoggedUser,guestQuoteId, cartCount,  isSessionExpired } = useSelector((state) => {
    return {
      guestKey: state?.guestKey,
      cartCount: state?.cartItems?.[0]?.totals_detail?.items?.length,
      isSessionExpired: state?.isSessionExpired,
      isLoggedUser: state?.isLoggedUser,
      guestQuoteId: state?.guestQuoteDetails?.id,
      updateCartItems: state?.updateCartItems,


    };
  });
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
        url: `${defaultURL}/cart/verify`,
        paramsData: {
          data: {
            cartId: guestQuoteId,
            storeId: storeId,
          }
        }
      }
    };
    APIQueryPost(options);
  };
  const getCustomerQuoteId = (token, data) => {
    const quoteIdOptions = {
      isLoader: true,
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          mergeCart(dispatch, updateCartItems, token, data?.id, guestKey, baseURL, storeId, guestQuoteId, defaultURL, () => { }, navigate, isSessionExpired);

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
          if (!isLoggedUser && guestQuoteId) {
            getQuoteStatus(guestQuoteId);

          }

          dispatch(ACTION_CUSTOMER__DETAILS(resData?.data));
          if(resData?.data){
            dispatch(ACTION_CUSTOMER__TOKEN(token));
            dispatch(ACTION_ISLOGGEDUSER(true));
  
          }
         
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
  // useEffectOnce(()=>{

  //   if (!isLoggedUser && token) {
  //   getUserDetails(token);

  //     }
  // });
  useScrollToTop()
  return (
    <div className=''>
      <Cart/>
    </div>
  )
}

export default CartPage