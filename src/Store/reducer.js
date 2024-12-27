import {
    LOADER, FETCH__HOMEPAGE, HOMEPAGE__LOADING, FETCH__HEADERFOOTER, HEADERFOOTER__LOADING,
    ISLOGGEDUSER, CUSTOMER__QUOTE__ID, CUSTOMER__TOKEN, CUSTOMER__DETAILS, WISHLIST__DATA, UPDATE__WISHLIST,
    OPEN__LOGIN, WISHLISTPRODUCTID, GUESTKEY, GUESTQUOTE__DETAILS, CARTITEMS, UPDATE__CARTITEMS, OPEN__FORGOTPASSWORD,
    OPENCART, COUNTRYLIST, WISHLISTPAGINTIONCOUNT, WISHLISTLOADER, WISHLISTDEFAULTCOUNT, ADMINTOKEN, SAVE_ADDRESS, SAVE_ADDRESS_SHIPPING,
    SESSION_EXPIRY, MINICART__ITEMS, WISHLISTADDED__DATA, WISHLIST_COUNT, RECENT_VIEW, RECENT_VIEW_SKU, RECENT_VIEW_LOAD,SUCCESS_TOKEN,
    TOAST, COOKIE_VALUE, GET__URLTYPE, CMS__COLOR, PDP__STATIC__DATA, SELECTEDADDRESS_BILLING, SELECTEDADDRESS_SHIPPING, FETCH__HOMEPAGE_FEATURE_PRODUCT, POSTAL_DATA_VALUE
} from "./action-type";

export const initailState = {
    count: false,
    loader: false,
    getHomePageData: {
        checkHomePageData: false,
        data: {}
    },
    succesToken:"",
    homePageLoading: true,
    getHeaderFooterData: {
        checkHeaderFooterData: false,
        data: {}
    },
    getFeatureProduct: [],
    HeaderFooterDataLoading: true,
    isLoggedUser: false,
    customerQuoteId: "",
    token: "",
    customerDetails: {},
    wishlistData: {},
    updateWishList: false,
    openLogin: false,
    wilistProductId: {
        id: "",
        sku: ""
    },
    cartItems: {},
    guestKey: "",
    guestQuoteDetails: {},
    updateCartItems: false,
    openCart: false,
    openForgotPassword: false,
    countriesList: [],
    wishListCount: 0,
    wishListLoader: false,
    wishListDefaultCount: 15,
    adminToken: "",
    addressDefault: {},
    addressShipping: {},
    isSessionExpired: false,
    minicartItems: "cart",
    wishlistAddedData: [],
    wishlistCount: 0,
    recentProductSku: [],
    recentProducts: [],
    recentLoading: true,
    toastMessageDetails: {
        open: false,
        message: ""
    },
    cookieValue: "",
    getUrlType: "",
    translateData: [],
    productDetailsStaticData: [],
    selectedshipping: {},
    selectedbilling: {},
    postalDataValue:false,
}

const reducer = (state = initailState, action) => {
    switch (action?.type) {
        
        case SUCCESS_TOKEN: return {
            ...state,
            succesToken: action?.payload
        }
        
        case SELECTEDADDRESS_BILLING: return {
            ...state,
            selectedbilling: action?.payload
        }
        case POSTAL_DATA_VALUE: return {
            ...state,
            postalDataValue: action?.payload
        }

        case SELECTEDADDRESS_SHIPPING: return {
            ...state,
            selectedshipping: action?.payload
        }

        case PDP__STATIC__DATA: return {
            ...state,
            productDetailsStaticData: action?.payload
        }
        case CMS__COLOR: return {
            ...state,
            translateData: action?.payload
        }
        case COOKIE_VALUE: return {
            ...state,
            cookieValue: action?.payload
        }
        case MINICART__ITEMS: return {
            ...state,
            minicartItems: action?.payload
        }
        case SAVE_ADDRESS: return {
            ...state,
            addressDefault: action?.payload
        }
        case SAVE_ADDRESS_SHIPPING: return {
            ...state,
            addressShipping: action?.payload
        }
        case LOADER: return {
            ...state,
            loader: action?.payload
        }
        case FETCH__HOMEPAGE: return {
            ...state,
            getHomePageData: action?.payload
        }
        case FETCH__HOMEPAGE_FEATURE_PRODUCT: return {
            ...state,
            getFeatureProduct: action?.payload
        }
        case HOMEPAGE__LOADING: return {
            ...state,
            homePageLoading: action?.payload
        }
        case FETCH__HEADERFOOTER: return {
            ...state,
            getHeaderFooterData: action?.payload
        }
        case HEADERFOOTER__LOADING: return {
            ...state,
            HeaderFooterDataLoading: action?.payload
        }
        case ISLOGGEDUSER: return {
            ...state,
            isLoggedUser: action?.payload
        }
        case CUSTOMER__QUOTE__ID: return {
            ...state,
            customerQuoteId: action?.payload
        }
        case CUSTOMER__TOKEN: return {
            ...state,
            token: action?.payload
        }
        case CUSTOMER__DETAILS: return {
            ...state,
            customerDetails: action?.payload
        }
        case WISHLIST__DATA: return {
            ...state,
            wishlistData: action?.payload
        }
        case UPDATE__WISHLIST: return {
            ...state,
            updateWishList: !state?.updateWishList
        }
        case OPEN__LOGIN: return {
            ...state,
            openLogin: action?.payload
        }
        case OPEN__FORGOTPASSWORD: return {
            ...state,
            openForgotPassword: action?.payload
        }
        case WISHLISTPRODUCTID: return {
            ...state,
            wilistProductId: action?.payload
        }
        case GUESTKEY: return {
            ...state,
            guestKey: action?.payload
        }
        case GUESTQUOTE__DETAILS: return {
            ...state,
            guestQuoteDetails: action?.payload
        }
        case CARTITEMS: return {
            ...state,
            cartItems: action?.payload
        }
        case UPDATE__CARTITEMS: return {
            ...state,
            updateCartItems: action?.payload
        }
        case OPENCART: return {
            ...state,
            openCart: action?.payload
        }
        case COUNTRYLIST: return {
            ...state,
            countriesList: action?.payload
        }
        case WISHLISTPAGINTIONCOUNT: return {
            ...state,
            wishListCount: action?.payload
        }
        case WISHLISTLOADER: return {
            ...state,
            wishListLoader: action?.payload
        }
        case WISHLISTDEFAULTCOUNT: return {
            ...state,
            wishListDefaultCount: action?.payload
        }
        case ADMINTOKEN: return {
            ...state,
            adminToken: action?.payload
        }
        case SESSION_EXPIRY: return {
            ...state,
            isSessionExpired: action?.payload
        }
        case WISHLISTADDED__DATA: return {
            ...state,
            wishlistAddedData: action?.payload
        }
        case WISHLIST_COUNT: return {
            ...state,
            wishlistCount: action?.payload
        }
        case RECENT_VIEW: return {
            ...state,
            recentProducts: action?.payload
        }
        case RECENT_VIEW_SKU: return {
            ...state,
            recentProductSku: action?.payload
        }
        case RECENT_VIEW_LOAD: return {
            ...state,
            recentLoading: action?.payload
        }
        case TOAST: return {
            ...state,
            toastMessageDetails: action?.payload
        }
        case GET__URLTYPE: return {
            ...state,
            getUrlType: action?.payload
        }
        default: return state;
    }
}

export default reducer;