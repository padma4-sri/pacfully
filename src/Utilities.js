import { APIQueryGet, APIQueryPost } from "APIMethods/API";
import {
  ACTION_CARTITEMS,
  ACTION_CUSTOMER__DETAILS,
  ACTION_CUSTOMER__QUOTE__ID,
  ACTION_CUSTOMER__TOKEN,
  ACTION__SUCCESS_TOKEN,
  ACTION_GUESTKEY,
  ACTION_GUESTQUOTE__DETAILS,
  ACTION_ISLOGGEDUSER,
  ACTION_WISHLISTPRODUCTID,
  ACTION_WISHLIST__DATA,
  ACTION_SAVE_ADDRESS,
  ACTION_SAVE_ADDRESS_SHIPPING,
  ACTION_SESSION_EXPIRY,
  ACTION_ADMINTOKEN,
  ACTION_OPEN__FORGOTPASSWORD,
  ACTION_OPEN__LOGIN,
  ACTION_WISHLISTADDED__DATA,
  ACTION_WISHLIST_COUNT,
  ACTION_RECENT_VIEW_LOAD,
  ACTION_RECENT_VIEW,
  ACTION_TOAST,
  ACTION_UPDATE__WISHLIST,
  ACTION_GET__URLTYPE,
  ACTION_COUNTRYLIST
} from "Store/action";
import { useState, useLayoutEffect } from "react";

export const isValidNumber = (number) => number.match(/^[0-9\b]+$/);
export const telephoneValidate = (number) => /^[+ -]*\d[+ -\d]*$/.test(number);
export const isValidCharacter = (character) => character.match(/^[a-zA-Z ]*$/);
export const isValidEmail = (email) =>
  email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
export const isEmptyValue = (value) => value.replace(/\s/g, "")?.length;
export const pressEnterCallFunction = (e, action) => {
  if (e.key === "Enter") {
    return action();
  }
};
export const pdpUrlTypeState = {
  urlType: {
    entityType: "product",
  },
};
// get window width & height
export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
};

export const logOutHandler = (dispatch, navigate) => {
  dispatch(ACTION_SAVE_ADDRESS_SHIPPING({}));
  dispatch(ACTION_SAVE_ADDRESS({}));
  dispatch(ACTION_CUSTOMER__TOKEN(""));
  dispatch(ACTION__SUCCESS_TOKEN(""));
  dispatch(ACTION_ISLOGGEDUSER(false));
  dispatch(ACTION_CUSTOMER__QUOTE__ID(""));
  dispatch(ACTION_CUSTOMER__DETAILS({}));
  dispatch(ACTION_WISHLIST__DATA({}));
  dispatch(ACTION_WISHLISTPRODUCTID({
    id: "",
    sku: ""
  }));
  dispatch(ACTION_GUESTKEY(""));
  dispatch(ACTION_GUESTQUOTE__DETAILS({}));
  dispatch(ACTION_CARTITEMS({}));
  dispatch(ACTION_ADMINTOKEN(""));
  dispatch(ACTION_WISHLIST_COUNT(0));
  dispatch(ACTION_WISHLISTADDED__DATA([]));
  dispatch(ACTION_SESSION_EXPIRY(false));
  navigate("/");
};


// SessionExpiredLogout
export const SessionExpiredLogout = (dispatch = () => { }, status, navigate = () => { }, isSessionExpired) => {
  if (!isSessionExpired && status === 401) {
    dispatch(ACTION_SESSION_EXPIRY(true));
    logOutHandler(dispatch, navigate);
    dispatch(ACTION_TOAST({
      open: true,
      //commented for purpose
      // message: "Due to Session expiry Logging out."
      message: "U bent automatisch uitgelogd vanwege inactiviteit."
    }));
  };
};

export const saveAddress = (data, selectedCountry, address) => {
  return {
    type: 'SAVE_ADDRESS',
    address: {
      first_name: data?.firstName,
      last_name: data?.lastName,
      street1: data?.houseNumber,
      street2: data?.address,
      company: data?.companyName,
      city: data?.city,
      state: data?.country,
      mobile_number: data?.mobileNumber,
      postcode: data?.postalCode,
      country_id: selectedCountry,
      make_default_billing: address === 'billing' ? 1 : 0,
      make_default_shipping: address === 'shipping' ? 1 : 0,
      reference_number: data?.referenceNumber ? data?.referenceNumber : '',
      vat_id: data?.vat ? data?.vat : '',
      additional_details: '',
    },
  };
};

export const addWishList = (
  url,
  dispatch,
  token,
  customerId,
  productId,
  wishlistAddedData,
  storeId,
  navigate,
  isSessionExpired,
  onComplete
) => {
  const wishListOptions = {
    getStatus: (res) => {
      SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      if (res.status === 200) {
        dispatch(ACTION_UPDATE__WISHLIST());
        dispatch(ACTION_WISHLISTPRODUCTID({
          id: "",
          sku: ""
        }));
        }
        onComplete();
      if(res.status === 400){
        dispatch(ACTION_TOAST({
          open: true,
          message: res.message
        }));
        dispatch(ACTION_WISHLISTPRODUCTID({
          id: "",
          sku: ""
        }));
        onComplete();
      }
    },
    axiosData: {
      url: `${url}/addwishlist`,
      headers: { Authorization: `Bearer ${token}` },
      paramsData: {
        customer_id: customerId ? customerId : null,
        product_id: productId?.id,
        storeId: storeId,
      },
    },
  };
  // API
  APIQueryPost(wishListOptions);
};

const getCustomerQuoteId = (token, dispatch, updateCartItems, customerId, baseURL, storeId, defaultURL, cb,navigate, isSessionExpired) => {
  const quoteIdOptions = {
    isLoader: true,
    setGetResponseData: (resData) => {
      if (resData?.status === 200) {
        cb && cb(customerId, resData?.data);
        dispatch(ACTION_CUSTOMER__QUOTE__ID(resData?.data));
        getCartItems(
          dispatch,
          () => { },
          resData?.data,
          customerId,
          () => { },
          defaultURL,
          storeId,token, navigate, isSessionExpired,""
          
        );

      }
    },
    getStatus: (res) => { },
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
export const mergeCart = (
  dispatch,
  updateCartItems,
  token,
  customerId,
  key,
  baseURL,
  storeId,
  guestQuoteId,
  defaultURL,
  cb,navigate, isSessionExpired
) => {
  // homepageParams
  const mergeCartOptions = {
    setGetResponseData: (res) => {
      if (res?.data?.[0]?.code === 200) {
        dispatch(ACTION_TOAST({
          open: true,
          message: res?.data?.[0]?.message
        }));
      }
      dispatch(ACTION_GUESTKEY(""));
      dispatch(ACTION_GUESTQUOTE__DETAILS({}));
    },
    getStatus: (res) => {
      if (res.status === 200) {
        getCustomerQuoteId(token, dispatch, updateCartItems, customerId, baseURL, storeId, defaultURL, cb,navigate, isSessionExpired)
      }
    },
    axiosData: {
      url: `${defaultURL}/cart/merge`,
      headers: { Authorization: `Bearer ${token}` },
      paramsData: {
        data: {
          customerId: customerId,
          guestCartIdKey: key,
          guestCartId: guestQuoteId,
          storeId: storeId,
        },
      },
    },
  };
  // API
  APIQueryPost(mergeCartOptions);
};

export const handleLogin = (dispatch) => {
  dispatch(ACTION_OPEN__FORGOTPASSWORD(false));
  dispatch(ACTION_OPEN__LOGIN(true));
}

export const handleForgotCheckout = (dispatch) => {
  dispatch(ACTION_OPEN__FORGOTPASSWORD("quote"));
  dispatch(ACTION_OPEN__LOGIN(false));
}

export const handleForgotQuote = (dispatch) => {
  dispatch(ACTION_OPEN__FORGOTPASSWORD("quote"));
  dispatch(ACTION_OPEN__LOGIN(false));
}
export const handleForgot = (dispatch) => {
  dispatch(ACTION_OPEN__FORGOTPASSWORD(true));
  dispatch(ACTION_OPEN__LOGIN(false));
}

export const closeLoginForgot = (dispatch) => {
  dispatch(ACTION_OPEN__FORGOTPASSWORD(false));
  dispatch(ACTION_OPEN__LOGIN(false));
  dispatch(ACTION_GET__URLTYPE(""));
}

// get cart items
export const getCartItems = (dispatch, setLoading, quoteId, customerId, openCart, defaultURL, storeId,token, navigate, isSessionExpired,width) => {
  const cartItemsOptions = {
    isLoader: true,
    loaderAction: (bool) => setLoading(bool), // Set loading state for cart
    setGetResponseData: (resData) => {
      if (resData?.status === 200) {
        dispatch(ACTION_CARTITEMS(resData?.data));
        if(width && width>=768){
          openCart();
        }
      }
    },
    axiosData: {
      url: `${defaultURL}/cart/getdetails`,
      paramsData: {
        customerId: customerId ? customerId : "",
        quoteId: quoteId ? quoteId : "",
        storeId: storeId,
      },
    },
  };
  const cartItemsOptionsLogin = {
    isLoader: true,
    loaderAction: (bool) => setLoading(bool),
    setGetResponseData: (resData) => {      
      if (resData?.status === 200) {
        dispatch(ACTION_CARTITEMS(resData?.data));
        if(width && width>=768){
          openCart();
        }
      }
    },
    getStatus: (res) => {
      SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
    },
    axiosData: {
      url: `${defaultURL}/cart/getdetailsLogin`,
      paramsData: {
        customerId: customerId ? customerId : "",
        quoteId: quoteId ? quoteId : "",
        storeId: storeId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      
    },
  };
  APIQueryPost(customerId ? cartItemsOptionsLogin : cartItemsOptions);
};
export const adminTokenHandler = (axios,baseURL,dispatch) => {
  const values = {
    username: 'Venkadesh',
    password: 'Odoodedadminuser123',
  };
  axios.post(baseURL + '/integration/admin/token', values).then((res) => {
    dispatch(ACTION_ADMINTOKEN(res.data));
  });
};

//commended for purpose
// export const handleImage = (image_url) => {
//   if (!image_url) return null;
//   let image_url_split;
//   try {
//     image_url_split = new URL(image_url);
//   } catch (e) {
//     return image_url;
//   }
//   if (image_url_split?.pathname) {
//     const combine = process.env.REACT_APP_PRODUCT_CDN_URL
//       ? image_url_split && image_url_split?.pathname ? `${process.env.REACT_APP_PRODUCT_CDN_URL}${image_url_split.pathname}`
//         : image_url : image_url;

//     const validExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'jp2'];
//     const urlExtension = combine.split('.').pop().toLowerCase();

//     return validExtensions.includes(urlExtension)
//       ? combine.replace(/\.(jpg|jpeg|png)$/i, '.webp')
//       : combine;
//   } else {
//     return image_url
//   }
// };

export const handleImage = (image_url, placeholderImage) => {
  if (!image_url) return placeholderImage; // Return placeholder if image_url is not provided

  let image_url_split;
  try {
    image_url_split = new URL(image_url);
  } catch (e) {
    return image_url || placeholderImage; // Return placeholder if image_url is invalid
  }

  if (image_url_split?.pathname) {
    const combine = process.env.REACT_APP_PRODUCT_CDN_URL
      ? image_url_split?.pathname 
        ? `${process.env.REACT_APP_PRODUCT_CDN_URL}${image_url_split.pathname}`
        : image_url
      : image_url;

    const validExtensions = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'jp2'];
    const urlExtension = combine.split('.').pop().toLowerCase();

    return validExtensions.includes(urlExtension)
      ? combine.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      : combine;
  } else {
    return placeholderImage; // Return placeholder if pathname doesn't exist
  }
};

// export const handleAddToRecent = (recentProducts, product, dispatch, sku, baseURL, storeId) => {
//   let recentProduct = recentProducts || [];
//   const existsIndex = recentProduct.findIndex((p) => p.sku === product?.sku);
//   const onPdp = recentProduct.some((p) => p.sku === sku);
//   console.log(product,"product")
//   if (existsIndex !== -1) {
//     const [existingProduct] = recentProduct.splice(existsIndex, 1); 
//     recentProduct = [existingProduct, ...recentProduct];
//   } else if (product && Object.keys(product).length > 0) {
//     recentProduct = [product, ...recentProduct];
//   }

//   if (recentProduct.length > 10) {
//     recentProduct = recentProduct.slice(0, 10);
//   }

//   dispatch(ACTION_RECENT_VIEW(recentProduct));

//   if (!onPdp && sku) {
//     getRecentProducts(dispatch, sku, baseURL, storeId, recentProduct);
//   }
// };
export const handleAddToRecent = (recentProducts, product, dispatch, sku, baseURL, storeId) => {
  let recentProduct = recentProducts || [];
  if (product?.temporary_out_of_stock == "1") {
    return;
  }
  const existsIndex = recentProduct.findIndex((p) => p.sku === product?.sku);
  const onPdp = recentProduct.some((p) => p.sku === sku);

  if (existsIndex !== -1) {
    const [existingProduct] = recentProduct.splice(existsIndex, 1);
    recentProduct = [existingProduct, ...recentProduct];
  } else if (product && Object.keys(product).length > 0) {
    recentProduct = [product, ...recentProduct];
  }

  if (recentProduct.length > 10) {
    recentProduct = recentProduct.slice(0, 10);
  }

  dispatch(ACTION_RECENT_VIEW(recentProduct));

  if (!onPdp && sku) {
    getRecentProducts(dispatch, sku, baseURL, storeId, recentProduct);
  }
};


export const triggerHotjarEvent = (eventName) => {
  if (window.hj) {
    window.hj('event', eventName);
  }
};

export const getRecentProducts = (dispatch, skus, baseURL, storeId,recentProducts) => {
  const options = {
    isLoader: true,
    loaderAction: (bool) => dispatch(ACTION_RECENT_VIEW_LOAD(bool)),
    setGetResponseData: (resData) => {
      const { status, data } = resData;
      if (status === 200) {
        handleAddToRecent(recentProducts,data[0],dispatch)
      }
    },
    axiosData: {
      url: `${baseURL}/home/recentViewed?storeId=${storeId}&skus=${skus}`,
    }
  };
  APIQueryGet(options);
};

// Forvalidation keys && conditions reusable
export const formOptions = {
  email: {
    required: {
      value: true,
      message: 'dit veld is verplicht.'
    },
    emailPattern: {
      value: 'dummy value',
      message: "Vul alstublieft een geldig e-mailadres in."
    },
  },
  password: {
    required: {
      value: true,
      message: 'dit veld is verplicht.'
    },
    min: {
      value: 8,
      message: "Het wachtwoord moet bestaan uit minimaal 8 tekens."
    },
    passwordPattern: {
      value: 'Dummy value',
      message: "Gebruik minstens een hoofdletter, een klein teken, een cijfer en speciaal teken (! @ # etc.)."
    }
  },
  requiredField: {
    required: {
      value: true,
      message: "dit veld is verplicht.",
    }
  },
  number: {
    required: {
      value: true,
      message: "dit veld is verplicht.",
    },
    min: {
      value: 10,
      message: "Het nummer moet bestaan uit minimaal 10 tekens.",
    },
    max: {
      value: 15,
      message: "Het nummer moet maximaal 15 cijfers bevatten",
    }
    
  },
  companyName: (type) => {
    return {
      required: {
        value: type === "1" ? true : false,
        message: "dit veld is verplicht.",
      }
    }
  },
  vatNumber: (country, type) => {
    return {
      required: {
        required: {
          value:  false,
          message: "dit veld is verplicht.",
        },
        min: {
          value: 8,
          message: "Vul een geldig BTW-nummer in.",

        },
      },
    }
  },
  telePhone: {
    required: {
      value: true,
      message: "dit veld is verplicht.",
    },
    custom: {
      isValid: (key) => isValidNumber(key),
    }
  },
  confirmMessage: 'Wachtwoord en bevestigingswachtwoord moeten hetzelfde zijn.'
}

// remove wishlist
export const removeWishlist = (
  baseURL,
  token,
  dispatch,
  id,
  wSku,
  wishlistAddedData,
  customerId,
  storeId,
  onComplete, 
  action = () => {},
  navigate,
  isSessionExpired
) => {
  const options = {
    isLoader: true,
    setGetResponseData: (resData) => {
      if (resData?.data?.[0]?.code === 200) {
        dispatch(ACTION_UPDATE__WISHLIST());
      }
      onComplete(); 
    },
    getStatus: (res) => {
      SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      onComplete(); 
    },
    axiosData: {
      url: `${baseURL}/wishlist/remove`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      paramsData: {
        customerId: customerId,
        itemId: id,
        storeId: storeId,
      }
    }
  };
  APIQueryPost(options).catch(() => {
    onComplete(); 
  });
};
 // country list
 export const GetCountryList = (dispatch,baseURL,storeId) => {
  const countryList = {
    setGetResponseData: (resData) => {
      if (resData?.status === 200) {
        dispatch(ACTION_COUNTRYLIST(resData?.data));
      }
    },
    axiosData: {
      url: `${baseURL}/getcountrylist`,
      paramsData: {
        storeId: storeId
      }
    }
  };
  APIQueryPost(countryList);
};