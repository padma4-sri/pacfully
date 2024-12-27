// Store data
import {
    LOADER, FETCH__HOMEPAGE, HOMEPAGE__LOADING, FETCH__HEADERFOOTER, HEADERFOOTER__LOADING,
    ISLOGGEDUSER, CUSTOMER__QUOTE__ID, CUSTOMER__TOKEN, CUSTOMER__DETAILS, WISHLIST__DATA, UPDATE__WISHLIST,
    OPEN__LOGIN, WISHLISTPRODUCTID, GUESTKEY, GUESTQUOTE__DETAILS, CARTITEMS, UPDATE__CARTITEMS, OPEN__FORGOTPASSWORD,
    OPENCART, COUNTRYLIST, WISHLISTPAGINTIONCOUNT, WISHLISTLOADER, WISHLISTDEFAULTCOUNT, ADMINTOKEN, SAVE_ADDRESS, SAVE_ADDRESS_SHIPPING,
    SESSION_EXPIRY, MINICART__ITEMS, WISHLISTADDED__DATA, WISHLIST_COUNT, RECENT_VIEW, RECENT_VIEW_SKU, RECENT_VIEW_LOAD,POSTAL_DATA_VALUE,
    TOAST, COOKIE_VALUE, GET__URLTYPE, CMS__COLOR, PDP__STATIC__DATA, SELECTEDADDRESS_BILLING, SELECTEDADDRESS_SHIPPING, FETCH__HOMEPAGE_FEATURE_PRODUCT,SUCCESS_TOKEN
} from "./action-type";
// API LINKS

export const ACTION__SELECTEDADDRESS_BILLING = (data) => {
    return {
        type: SELECTEDADDRESS_BILLING,
        payload: data
    }
}
export const ACTION__SUCCESS_TOKEN = (data) => {
    return {
        type: SUCCESS_TOKEN,
        payload: data
    }
}

export const ACTION_POSTAL_DATA_VALUE = (data) => {
    return {
        type: POSTAL_DATA_VALUE,
        payload: data
    }
}
export const ACTION__SELECTEDADDRESS_SHIPPING = (data) => {
    return {
        type: SELECTEDADDRESS_SHIPPING,
        payload: data
    }
}
export const ACTION__PDP__STATIC__DATA = (data) => {
    return {
        type: PDP__STATIC__DATA,
        payload: data
    }
}
export const ACTION__CMS__COLOR = (data) => {
    return {
        type: CMS__COLOR,
        payload: data
    }
}
export const ACTION__COOKIE_VALUE = (data) => {
    return {
        type: COOKIE_VALUE,
        payload: data
    }
}
export const ACTION__MINICART__ITEMS = (data) => {
    return {
        type: MINICART__ITEMS,
        payload: data
    }
}
export const ACTION_SAVE_ADDRESS = (data) => {
    return {
        type: SAVE_ADDRESS,
        payload: data
    }
}
export const ACTION_SAVE_ADDRESS_SHIPPING = (data) => {
    return {
        type: SAVE_ADDRESS_SHIPPING,
        payload: data
    }
}


export const ACTION_LOADER = (data) => {
    return {
        type: LOADER,
        payload: data
    }
}

export const ACTION_FETCH__HOMEPAGE = (data) => {
    return {
        type: FETCH__HOMEPAGE,
        payload: data
    }
}
export const ACTION_FETCH__HOMEPAGE_FEATURE_PRODUCT = (data) => {
    return {
        type: FETCH__HOMEPAGE_FEATURE_PRODUCT,
        payload: data
    }
}
export const ACTION_HOMEPAGE__LOADING = (data) => {
    return {
        type: HOMEPAGE__LOADING,
        payload: data
    }
}

export const ACTION_FETCH__HEADERFOOTER = (data) => {
    return {
        type: FETCH__HEADERFOOTER,
        payload: data
    }
}

export const ACTION_HEADERFOOTER__LOADING = (data) => {
    return {
        type: HEADERFOOTER__LOADING,
        payload: data
    }
}

export const ACTION_ISLOGGEDUSER = (data) => {
    return {
        type: ISLOGGEDUSER,
        payload: data
    }
}

export const ACTION_CUSTOMER__QUOTE__ID = (data) => {
    return {
        type: CUSTOMER__QUOTE__ID,
        payload: data
    }
}

export const ACTION_CUSTOMER__TOKEN = (data) => {
    return {
        type: CUSTOMER__TOKEN,
        payload: data
    }
}

export const ACTION_CUSTOMER__DETAILS = (data) => {
    return {
        type: CUSTOMER__DETAILS,
        payload: data
    }
}

export const ACTION_WISHLIST__DATA = (data) => {
    return {
        type: WISHLIST__DATA,
        payload: data
    }
}

export const ACTION_UPDATE__WISHLIST = (data) => {
    return {
        type: UPDATE__WISHLIST,
        payload: data
    }
}

export const ACTION_OPEN__LOGIN = (data) => {
    return {
        type: OPEN__LOGIN,
        payload: data
    }
}
export const ACTION_OPEN__FORGOTPASSWORD = (data) => {
    return {
        type: OPEN__FORGOTPASSWORD,
        payload: data
    }
}

export const ACTION_WISHLISTPRODUCTID = (data) => {
    return {
        type: WISHLISTPRODUCTID,
        payload: data
    }
}

export const ACTION_GUESTKEY = (data) => {
    return {
        type: GUESTKEY,
        payload: data
    }
}

export const ACTION_GUESTQUOTE__DETAILS = (data) => {
    return {
        type: GUESTQUOTE__DETAILS,
        payload: data
    }
}

export const ACTION_CARTITEMS = (data) => {
    return {
        type: CARTITEMS,
        payload: data
    }
}

export const ACTION_UPDATE__CARTITEMS = (data) => {
    return {
        type: UPDATE__CARTITEMS,
        payload: data
    }
}

export const ACTION_OPENCART = (data) => {
    return {
        type: OPENCART,
        payload: data
    }
}

export const ACTION_COUNTRYLIST = (data) => {
    return {
        type: COUNTRYLIST,
        payload: data
    }
}

export const ACTION_WISHLISTPAGINTIONCOUNT = (data) => {
    return {
        type: WISHLISTPAGINTIONCOUNT,
        payload: data
    }
}

export const ACTION_WISHLISTLOADER = (data) => {
    return {
        type: WISHLISTLOADER,
        payload: data
    }
}

export const ACTION_WISHLISTDEFAULTCOUNT = (data) => {
    return {
        type: WISHLISTDEFAULTCOUNT,
        payload: data
    }
}

export const ACTION_ADMINTOKEN = (data) => {
    return {
        type: ADMINTOKEN,
        payload: data
    }
}

export const ACTION_SESSION_EXPIRY = (data) => {
    return {
        type: SESSION_EXPIRY,
        payload: data
    }
}

export const ACTION_WISHLISTADDED__DATA = (data) => {
    return {
        type: WISHLISTADDED__DATA,
        payload: data
    }
}

export const ACTION_WISHLIST_COUNT = (data) => {
    return {
        type: WISHLIST_COUNT,
        payload: data
    }
}

export const ACTION_RECENT_VIEW = (data) => {
    return {
        type: RECENT_VIEW,
        payload: data
    }
}

export const ACTION_RECENT_VIEW_SKU = (data) => {
    return {
        type: RECENT_VIEW_SKU,
        payload: data
    }
}

export const ACTION_RECENT_VIEW_LOAD = (data) => {
    return {
        type: RECENT_VIEW_LOAD,
        payload: data
    }
}

export const ACTION_TOAST = (data) => {
    return {
        type: TOAST,
        payload: data
    }
}

export const ACTION_GET__URLTYPE = (data) => {
    return {
        type: GET__URLTYPE,
        payload: data
    }
}