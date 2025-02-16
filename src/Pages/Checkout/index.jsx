import React, { useEffect, useState, useContext,useRef , memo} from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import OrderSummary from "Components/Checkout/OrderSummary";
import GuestBillingAddress from "Components/Checkout/GuestBillingAddress";
import CustomerBillingAddress from "Components/Checkout/CustomerBillingAddress";
import CustomerShippingAddress from "Components/Checkout/CustomerShippingAddress";
import Input from "Components/Common/Form/Input";
import Button from "Components/Common/Button";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ideal from "../../Res/images/ideal.svg";
import ban from "../../Res/images/ban.svg";
import gp from "../../Res/images/gp.svg";
import mastero from "../../Res/images/mastero.svg";
import mondu from "../../Res/images/home/mondu.svg";
import sofort from "../../Res/images/sofort.svg";
import mastercard from "../../Res/images/mastercard.svg";
import visa from "../../Res/images/visa.svg";
import Img from "Components/Img";
import { ACTION_CUSTOMER__DETAILS,ACTION__SUCCESS_TOKEN } from 'Store/action';
import { useSelector, useDispatch } from "react-redux";
import { SessionExpiredLogout, getCartItems,triggerHotjarEvent,adminTokenHandler } from "Utilities";
import { APIQueryGet, APIQueryPost } from "APIMethods/API";
import { useNavigate } from "react-router-dom";
import { ValidSuccesArrow } from "Res/icons";
import axios from "axios";
import GuestShippingAddress from "Components/Checkout/GuestShippingAddress";
import CartPage from "Pages/CartPage";
import { SkeletonLine } from "Components/Skeletion";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useEffectOnce } from 'Components/Hooks/useEffectOnce';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";



function Checkout() {
  const {
    token,
    isLoggedUser,
    guestKey,
    guestQuoteId,
    customerQuoteId,
    customerId,
    customerDetails,
    isSessionExpired,
    adminToken
  } = useSelector((state) => {
    return {
      cartDetails: state?.cartItems?.[0],
      cartCount: state?.cartItems?.[0]?.totals_detail?.items?.length,
      token: state?.token,
      isLoggedUser: state?.isLoggedUser,
      updateCartItems: state?.updateCartItems,
      guestKey: state?.guestKey,
      guestQuoteId: state?.guestQuoteDetails?.id,
      customerQuoteId: state?.customerQuoteId,
      customerId: state?.customerDetails?.id,
      updateWishList: state?.updateWishList,
      customerDetails: state?.customerDetails,
      adminToken: state?.adminToken,
  isSessionExpired: state?.isSessionExpired,

    };
  });
  const { baseURL, defaultURL, storeId } = useContext(DomainContext);
  let domainUrl = window.location.origin;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedBank, setSelectedBank] = useState("")
  const [shippingAddress, setShippingAddress] = useState(true);
  const [guestBillingAddress, setGuestBillingAddress] = useState({});
  const [guestShippingAddress, setGuestShippingAddress] = useState(null);
  const [customerBillingAddress, setCustomerBillingAddress] = useState({});
  const [customerShippingAddress, setCustomerShippingAddress] = useState({});
  const [countryList, setCountryList] = useState(null);
  const [errorsShipping, setErrorsShipping] = useState("");
  const [errorsPayment, setErrorsPayment] = useState("");
  const [btnLogin, setBtnLogin] = useState(false);
  const [summaryData, setSummaryData] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
  const [newsLetterSubscription, setNewsLetterSubscription] = useState(false);
  const [customerAddress, setCustomerAddress] = useState([]);
  const [openTab, setOpenTab] = useState("billing");
  const [getIdealBankList, setGetIdealBankList] = useState([]);
  const sanitizedString = summaryData?.tax_details?.grandTotal?.replace(".", "")?.replace(",", ".");
  const [submitAddress, setSubmitAddress] = useState(null);
  const [checkoutLoading, setChekcoutLoading] = useState(null);
  const numberValue = parseFloat(sanitizedString);
  const [disabledError, setDisableError] = useState("")
  const [paymentLoader, setPaymentLoader] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [monduTooltipOpen, setMonduTooltipOpen] = useState(false);
  const [banktransferTooltipOpen, setBanktransferTooltipOpen] = useState(false);
  const [ data,setData] = useState("");
  const iconMonduRef = useRef(null);
   const iconBankTransferRef = useRef(null);
   const monduTooltipRef = useRef(null); 
  const bankTransferTooltipRef = useRef(null); 
  const info = "/res/img/info.svg";





  const handleShippingAddressChange = (newState) => {
    setShippingAddress(newState);
  };
  const grossAmountCents = parseFloat(summaryData?.tax_details?.grandTotal?.replace(/\./g, '').replace(',', '.'));
  const totalDiscountCents = parseFloat(summaryData?.totals_detail?.discount_amount?.replace(/\./g, '').replace(',', '.'));
  const shippingPriceCents = parseFloat(summaryData?.totals_detail?.postageCosts?.replace(/\./g, '').replace(',', '.'));
  const [loadingApi, setLoadingApi] = useState({
    shipping: false,
    payment: false,
  });
const subtotal = parseFloat(summaryData?.totals_detail?.subtotal?.replace(/\./g, '').replace(',', '.'));
const subtotalWithDiscount = parseFloat(summaryData?.totals_detail?.subtotal_with_discount?.replace(/\./g, '').replace(',', '.'));
const totalDiscounts = parseFloat(summaryData?.tax_details?.discount_amount?.replace(/\./g, '').replace(',', '.'));
const discountPercentage = ((subtotal - subtotalWithDiscount) / subtotal) * 100;
const roundedDiscountPercentage = Math.round(discountPercentage);
const roundedshippingPriceCents = Math.round(shippingPriceCents);
 
  const GuestMonduIntegration = (orderId) => {
    const mapItemsToLineItems = (items) => {
      return items.map((item) => {
        return {
          quantity: item.qty || 1,
          external_reference_id: item?.itemId,
          title: item.productName || "",
          net_price_per_item_cents: parseInt(item?.unitPrice),
          net_price_cents: parseInt(item?.totalPrice) * 50000,
          product_id: item.productId || "",
          product_sku: item.sku || "",
          variation_id: "1",
          item_type: item.item_type || "type",
        };
      });
    };
    const values = {
      data:{
        currency: "EUR",
        billing_address: {
          country_code: guestBillingAddress?.country,
          state: "state",
          city: guestBillingAddress?.addressList?.city,
          zip_code: guestBillingAddress?.addressList?.postalCode,
          address_line1: guestBillingAddress?.addressList?.houseNumber,
          address_line2: guestBillingAddress?.addressList?.address,
        },
        shipping_address: {
         
          country_code: selectedShippingMethod?.label === "Afhalen in Etten-Leur"?"NL": guestBillingAddress?.shippingAddress ? guestBillingAddress?.country : guestShippingAddress?.country,
          state: "state",
          city:selectedShippingMethod?.label === "Afhalen in Etten-Leur"?"Etten-Leur": guestBillingAddress?.shippingAddress ? guestBillingAddress?.addressList?.city : guestShippingAddress?.addressList?.Stad,
          zip_code: guestBillingAddress?.shippingAddress ? guestBillingAddress?.addressList?.postalCode : guestShippingAddress?.addressList?.postcode,
          address_line1: guestBillingAddress?.shippingAddress ? guestBillingAddress?.addressList?.houseNumber : guestShippingAddress?.addressList?.houseNumbers,
          address_line2: guestBillingAddress?.shippingAddress ? guestBillingAddress?.addressList?.address : guestShippingAddress?.addressList?.Straatnaam,
        },
        language: "en",
        additional_discount: {
          discount_percentage: roundedDiscountPercentage,
          discount_term_days: 1
        },
        buyer: {
          is_registered: false,
          email:guestBillingAddress?.addressList?.email,
          first_name: guestBillingAddress?.addressList?.firstName,
          last_name: guestBillingAddress?.addressList?.lastName,
          legal_form: "string",
          ...(guestBillingAddress?.addressList?.companyName && { company_name: guestBillingAddress?.addressList?.companyName }),
          phone: guestBillingAddress?.addressList?.mobileNumber,
          external_reference_id: orderId,
          salutation: "salutation",
          industry: "industry",
          registration_id: "id",
          vat_number: guestBillingAddress?.addressList?.vat,
          account_created_at: "10/24",
          account_updated_at: "9/24"
        },
  
        payment_method: "invoice",
        external_reference_id: orderId,
        notes: "notes",
        gross_amount_cents: grossAmountCents * 100,
        // total_discount_cents: totalDiscounts ,
        lines:
          [
            {
              vendor_external_reference_id: orderId,
              discount_cents: 0,
              tax_cents: parseInt(summaryData?.tax_details?.tax_amount),
              // shipping_price_cents: roundedshippingPriceCents,
              marketplace_fee_cents: 0,
              buyer_fee_cents: 0,
              line_items: mapItemsToLineItems(summaryData?.totals_detail?.items)
            }
          ],
        source: "hosted",
        success_url: domainUrl + "/order/succes?order_id=" + orderId,
        cancel_url: domainUrl,
        declined_url: domainUrl
      }
    }
  

    axios.post( defaultURL + "/getmonduPaymentResponse", values)
      .then((res) => {
        if(res?.data[0]?.hosted_checkout_url){
          window.location.assign(`${res?.data[0]?.hosted_checkout_url}`);
        }
      })
      .catch((error) => {
        console.error('Error while making the request:', error);
      });
  };
  const CustomerMonduIntegration = (orderId) => {
    const mapItemsToLineItems = (items) => {
      return items.map((item) => {
        return {
          quantity: item.qty || 1,
          external_reference_id: item?.itemId,
          title: item.productName || "",
          net_price_per_item_cents: parseInt(item?.unitPrice),
          net_price_cents: parseInt(item?.totalPrice) * 50000,
          product_id: item.productId || "",
          product_sku: item.sku || "",
          variation_id: "1",
          item_type: item.item_type || "type",
        };
      });
    };

    const values = {
      data:
      {
        currency: "EUR",
        billing_address: {
          country_code: customerBillingAddress?.defaultBilling?.country_id
            ? customerBillingAddress?.defaultBilling?.country_id
            : customerBillingAddress?.defaultBillingAddress?.country_id,
          state: "state",
          city: customerBillingAddress?.defaultBilling?.city
            ? customerBillingAddress?.defaultBilling?.city
            : customerBillingAddress?.defaultBillingAddress?.city,
          zip_code: customerBillingAddress?.defaultBilling?.postcode
            ? customerBillingAddress?.defaultBilling?.postcode
            : customerBillingAddress?.defaultBillingAddress?.postcode,
          address_line1: customerBillingAddress?.defaultBilling?.street1
            ? customerBillingAddress?.defaultBilling?.street1
            : customerBillingAddress?.defaultBillingAddress?.street1,
          address_line2: customerBillingAddress?.defaultBilling?.street2
            ? customerBillingAddress?.defaultBilling?.street2
            : customerBillingAddress?.defaultBillingAddress?.street2,
        },
        shipping_address: {
          
          country_code:selectedShippingMethod?.label === "Afhalen in Etten-Leur"?"NL": customerBillingAddress?.defaultBilling?.country_id
            ? customerBillingAddress?.defaultBilling?.country_id
            : customerBillingAddress?.defaultBillingAddress?.country_id,
          state: "state",
          city:selectedShippingMethod?.label === "Afhalen in Etten-Leur"?"Etten-Leur": customerBillingAddress?.defaultBilling?.city
            ? customerBillingAddress?.defaultBilling?.city
            : customerBillingAddress?.defaultBillingAddress?.city,
          zip_code:selectedShippingMethod?.label === "Afhalen in Etten-Leur"?"4879 NA": customerBillingAddress?.defaultBilling?.postcode
            ? customerBillingAddress?.defaultBilling?.postcode
            : customerBillingAddress?.defaultBillingAddress?.postcode,
          address_line1:selectedShippingMethod?.label === "Afhalen in Etten-Leur"?"22": customerBillingAddress?.defaultBilling?.street1
            ? customerBillingAddress?.defaultBilling?.street1
            : customerBillingAddress?.defaultBillingAddress?.street1,
          address_line2:selectedShippingMethod?.label === "Afhalen in Etten-Leur"?"Pauvreweg": customerBillingAddress?.defaultBilling?.street2
            ? customerBillingAddress?.defaultBilling?.street2
            : customerBillingAddress?.defaultBillingAddress?.street2
        },
        language: "en",
        additional_discount: {
          discount_percentage: roundedDiscountPercentage,
          discount_term_days: 1
        },
        buyer: {
          is_registered: false,
          email: customerBillingAddress?.defaultBilling?.email
          ? customerBillingAddress?.defaultBilling?.email
          : customerBillingAddress?.defaultBillingAddress?.email,
          first_name: customerBillingAddress?.defaultBilling?.firstname
            ? customerBillingAddress?.defaultBilling?.firstname
            : customerBillingAddress?.defaultBillingAddress?.firstname,
          last_name: customerBillingAddress?.defaultBilling?.lastname
            ? customerBillingAddress?.defaultBilling?.lastname
            : customerBillingAddress?.defaultBillingAddress?.lastname,
          legal_form: "string",
          ...(customerBillingAddress?.defaultBilling?.company || customerBillingAddress?.defaultBillingAddress?.company
            ? { company_name: customerBillingAddress?.defaultBilling?.company ?? customerBillingAddress?.defaultBillingAddress?.company }
            : {}),
          phone: customerBillingAddress?.defaultBilling?.mobile_number
            ? customerBillingAddress?.defaultBilling?.mobile_number
            : customerBillingAddress?.defaultBillingAddress?.mobile_number,
          external_reference_id: orderId,
          salutation: "salutation",
          industry: "industry",
          registration_id: "id",
          vat_number: guestBillingAddress?.addressList?.vat,
          account_created_at: "10/24",
          account_updated_at: "9/24"
        },
  
        payment_method: "invoice",
        external_reference_id: orderId,
        notes: "notes",
        gross_amount_cents: grossAmountCents * 100,
        // total_discount_cents: totalDiscounts ,
        lines:
          [
            {
              vendor_external_reference_id: orderId,
              discount_cents: 0,
              tax_cents: parseInt(summaryData?.tax_details?.tax_amount),
              // shipping_price_cents: roundedshippingPriceCents,
              marketplace_fee_cents: 0,
              buyer_fee_cents: 0,
              line_items: mapItemsToLineItems(summaryData?.totals_detail?.items)
  
            }
          ],
        source: "hosted",
        success_url: domainUrl + "/order/succes?order_id=" + orderId,
        cancel_url: domainUrl,
        declined_url: domainUrl
      }
    }
   
    axios.post( defaultURL + "/getmonduPaymentResponse", values)
      .then((res) => {
        if(res?.data[0]?.hosted_checkout_url){
          window.location.assign(`${res?.data[0]?.hosted_checkout_url}`);
        }
      })
      .catch((error) => {
        console.error('Error while making the request:', error);
      });
  };
 
  const OrderSuccessGuest = (orderId) => {
    
    const quoteSubmit = {
      isLoader: true,
      setGetResponseData: async (resData) => {
        if (resData?.status === 200) {
         const paymentPayLoad = {
          data: {
            type: "redirect",
            order_id: orderId,
            gateway: selectedPaymentMethod?.id,
            currency: "EUR",
            amount: numberValue * 100,
            description:"Payment for order " +resData?.data[0]?.incrementId,
            payment_options: {
              // notification_url: domainUrl + '/multisafepay/connect/notification',
              notification_method: "POST",
              redirect_url: domainUrl+"/order/succes",
              cancel_url: domainUrl,
              close_window: true,
            },
            customer: {
              locale: summaryData?.ip_address?.ip_address?.locale,
              ip_address: summaryData?.ip_address?.ip_address?.ip_address,
              address1: guestBillingAddress?.addressList?.address,
              house_number: guestBillingAddress?.addressList?.houseNumber,
              email: guestBillingAddress?.addressList?.email,
              referrer: domainUrl,
              user_agent: summaryData?.ip_address?.ip_address?.user_agent,
              country: guestBillingAddress?.country,
              company_name: guestBillingAddress?.addressList?.companyName,
              phone: guestBillingAddress?.addressList?.mobileNumber,
              zip_code: guestBillingAddress?.addressList?.postalCode,
              city: guestBillingAddress?.addressList?.city,
              first_name: guestBillingAddress?.addressList?.firstName,
              last_name: guestBillingAddress?.addressList?.lastName,
            },
          },
          storeId:storeId
        };
        dispatch(ACTION__SUCCESS_TOKEN(resData?.data[0]?.token));
       
          setData(resData?.data[0]);
          if ((orderId && selectedPaymentMethod?.code == "banktransfer") || (orderId && selectedPaymentMethod?.code == "free")) {
            navigate("/order/succes", { state: orderId});
            if (isLoggedUser && customerQuoteId) {
              getCartItems(
                dispatch,
                () => { },
                customerQuoteId,
                customerId,
                () => { }, defaultURL,
                storeId,
                token, navigate, isSessionExpired
  
              );
            }
            else if (guestQuoteId) {
              getCartItems(
                dispatch,
                () => { },
                guestQuoteId,
                "",
                () => { }, defaultURL,
                storeId,
                token, navigate, isSessionExpired
  
              );
            }
          }
          else if (selectedPaymentMethod == "mondu" || selectedPaymentMethod?.code == "mondu") {
            GuestMonduIntegration(orderId?.data)
          }
          else
          if ((resData?.data[0]?.incrementId && selectedPaymentMethod?.code !== "banktransfer") || (resData?.data[0]?.incrementId && selectedPaymentMethod?.code !== "free")) {
              const resData = await axios.post(
                baseURL + `/getpaymentUrl`,
                paymentPayLoad
              );
              if (resData?.data?.[1]?.order_id) {
                window.location.assign(`${resData?.data?.[1]?.payment_url}`);
              }
            }
         
         
        }
      },
      getStatus: (res) => { },
      axiosData: {
        url: `${baseURL}/order/success`,
        headers: { Authorization: `Bearer ${adminToken}` },
        method: "post",
        paramsData: {
          storeId: storeId,
          orderId: orderId, 
           referenceNumber: "",
          monduUid:  ""
         
        },
      },
    };
    APIQueryPost(quoteSubmit);
  };
  const GuestplaceOrder = async () => {
    setPaymentLoader(true)
    try {
      const payload = {
        cartId: guestKey,
        billing_address: {
          countryId: "IN",
          street: [
            guestBillingAddress?.addressList?.houseNumber,
            guestBillingAddress?.addressList?.address,
          ],
          regionId: "599",
          regionCode: "TN",
          region: "Tamil Nadu",
        customerAddressId:"0",
          company:null,
          telephone: guestBillingAddress?.addressList?.mobileNumber,
          postcode: guestBillingAddress?.addressList?.postalCode,
          city: guestBillingAddress?.addressList?.city,
          firstname: guestBillingAddress?.addressList?.firstName,
          lastname: guestBillingAddress?.addressList?.lastName,
          same_as_billing: guestBillingAddress?.shippingAddress ? 1 : 0,
          fax: null,
          middlename: null,
        prefix: null,
          suffix: null,
        vatId: null,
          customAttributes: [],
          saveInAddressBook: null,
         
        },
        paymentMethod: {
          method:
            selectedPaymentMethod?.code,
          po_number: null,
          extension_attributes: {
            agreement_ids: ["1"],
          },
        },
        email: guestBillingAddress?.addressList?.email,
      };
      const orderId = await axios.post(
        defaultURL + `/guest-carts/${guestKey}/payment-information`,
        payload
      );
      
      if (orderId?.data) {
        // OrderSuccessGuest(orderId?.data)
        navigate("/react-app")
      }
    } catch (err) {
      // setEnableLoader(false)
      setDisableError(err?.response?.data?.message)
      console.log(err, "Place order err");
    }
  };
  const OrderSuccessCustomer = (orderId) => {
    
    const quoteSubmit = {
      isLoader: true,
      setGetResponseData: async (resData) => {
        if (resData?.status === 200) {
          const guestpayload =  {
            locale: summaryData?.ip_address?.ip_address?.locale,
            ip_address: summaryData?.ip_address?.ip_address?.ip_address,
            address1: guestBillingAddress?.addressList?.address,
            house_number: guestBillingAddress?.addressList?.houseNumber,
            email: guestBillingAddress?.addressList?.email,
            referrer: domainUrl,
            user_agent: summaryData?.ip_address?.ip_address?.user_agent,
            country: guestBillingAddress?.country,
            company_name: guestBillingAddress?.addressList?.companyName,
            phone: guestBillingAddress?.addressList?.mobileNumber,
            zip_code: guestBillingAddress?.addressList?.postalCode,
            city: guestBillingAddress?.addressList?.city,
            first_name: guestBillingAddress?.addressList?.firstName,
            last_name: guestBillingAddress?.addressList?.lastName,
          }
          const customerPayload= {
            locale: summaryData?.ip_address?.ip_address?.locale,
            ip_address: summaryData?.ip_address?.ip_address?.ip_address,
            address1: customerBillingAddress?.defaultBilling?.street2
              ? customerBillingAddress?.defaultBilling?.street2
              : customerBillingAddress?.defaultBillingAddress?.street2,
            house_number: customerBillingAddress?.defaultBilling?.street1
              ? customerBillingAddress?.defaultBilling?.street1
              : customerBillingAddress?.defaultBillingAddress?.street1,
            country: customerBillingAddress?.defaultBilling?.country_id
              ? customerBillingAddress?.defaultBilling?.country_id
              : customerBillingAddress?.defaultBillingAddress?.country_id,
              company_name: customerBillingAddress?.defaultBilling?.firstname
              &&  customerBillingAddress?.defaultBilling?.company?  customerBillingAddress?.defaultBilling?.company:customerBillingAddress?.defaultBillingAddress?.company,
         
            phone: customerBillingAddress?.defaultBilling?.mobile_number
              ? customerBillingAddress?.defaultBilling?.mobile_number
              : customerBillingAddress?.defaultBillingAddress?.mobile_number,
            zip_code: customerBillingAddress?.defaultBilling?.postcode
              ? customerBillingAddress?.defaultBilling?.postcode
              : customerBillingAddress?.defaultBillingAddress?.postcode,
            city: customerBillingAddress?.defaultBilling?.city
              ? customerBillingAddress?.defaultBilling?.city
              : customerBillingAddress?.defaultBillingAddress?.city,
            first_name: customerBillingAddress?.defaultBilling?.firstname
              ? customerBillingAddress?.defaultBilling?.firstname
              : customerBillingAddress?.defaultBillingAddress?.firstname,
            last_name: customerBillingAddress?.defaultBilling?.lastname
              ? customerBillingAddress?.defaultBilling?.lastname
              : customerBillingAddress?.defaultBillingAddress?.lastname,
            email: customerDetails?.email,
            referrer: domainUrl,
            user_agent: summaryData?.ip_address?.ip_address?.user_agent,
          }
         const paymentPayLoad = {
          data: {
            type: "redirect",
            order_id: orderId,
            gateway: selectedPaymentMethod?.id,
            currency: "EUR",
            amount: numberValue * 100,
            description:"Payment for order " +resData?.data[0]?.incrementId,
            payment_options: {
              // notification_url: domainUrl + '/multisafepay/connect/notification',
              notification_method: "POST",
              redirect_url: domainUrl + "/order/succes",
              cancel_url: domainUrl,
              close_window: true,
            },
            customer:isLoggedUser && customerAddress ?.allAddress ?.length ? customerPayload : guestpayload,
          },
          storeId:storeId
        };
       
          setData(resData?.data[0]);
         
          if ((orderId && selectedPaymentMethod?.code == "banktransfer") || (orderId && selectedPaymentMethod?.code == "free")) {

              navigate("/order/succes", { state: orderId });
              if (isLoggedUser && customerQuoteId) {
                getCartItems(
                  dispatch,
                  () => { },
                  customerQuoteId,
                  customerId,
                  () => { },
                  defaultURL,
                  storeId,
                  token, navigate, isSessionExpired
    
                );
              }
              else if (guestQuoteId) {
                getCartItems(
                  dispatch,
                  () => { },
                  guestQuoteId,
                  "",
                  () => { }, defaultURL
                  ,
                  storeId,
                  token, navigate, isSessionExpired
                );
              }
            }
            else if (selectedPaymentMethod == "mondu" || selectedPaymentMethod?.code == "mondu") {
              if(customerAddress?.allAddress?.length && isLoggedUser){
                CustomerMonduIntegration(orderId?.data)
              }
              else{
                GuestMonduIntegration(orderId?.data)
              }
            }
            else
          if ((resData?.data[0]?.incrementId && selectedPaymentMethod?.code !== "banktransfer") || (resData?.data[0]?.incrementId && selectedPaymentMethod?.code !== "free")) {

                const resData = await axios.post(
                  baseURL + `/getpaymentUrl`,
                  paymentPayLoad
                );
                if (resData?.data?.[1]?.order_id) {
                  window.location.assign(`${resData?.data?.[1]?.payment_url}`);
                }
              }
         
         
        }
      },
      getStatus: (res) => { },
      axiosData: {
        url: `${baseURL}/order/success`,
        headers: { Authorization: `Bearer ${adminToken}` },
        method: "post",
        paramsData: {
          storeId: storeId,
          orderId: orderId, 
           referenceNumber: "",
          monduUid:  ""
          
        },
      },
    };
    APIQueryPost(quoteSubmit);
  };
  const placeOrder = async () => {
    setPaymentLoader(true)
    try {
      // setSummaryLoader(true);
      const payload = {
        cartId: customerId,
        billing_address: {
          countryId: customerBillingAddress?.defaultBilling?.country_id
            ? customerBillingAddress?.defaultBilling?.country_id
            : customerBillingAddress?.defaultBillingAddress?.country_id,
          street: [
            customerBillingAddress?.defaultBilling?.street1
              ? customerBillingAddress?.defaultBilling?.street1
              : customerBillingAddress?.defaultBillingAddress?.street1,
            customerBillingAddress?.defaultBilling?.street2
              ? customerBillingAddress?.defaultBilling?.street2
              : customerBillingAddress?.defaultBillingAddress?.street2,
          ],
          company: customerBillingAddress?.defaultBilling?.firstname
          &&  customerBillingAddress?.defaultBilling?.company?  customerBillingAddress?.defaultBilling?.company:customerBillingAddress?.defaultBillingAddress?.company,
      telephone: customerBillingAddress?.defaultBilling?.mobile_number
            ? customerBillingAddress?.defaultBilling?.mobile_number
            : customerBillingAddress?.defaultBillingAddress?.mobile_number,
          postcode: customerBillingAddress?.defaultBilling?.postcode
            ? customerBillingAddress?.defaultBilling?.postcode
            : customerBillingAddress?.defaultBillingAddress?.postcode,
          city: customerBillingAddress?.defaultBilling?.city
            ? customerBillingAddress?.defaultBilling?.city
            : customerBillingAddress?.defaultBillingAddress?.city,
          firstname: customerBillingAddress?.defaultBilling?.firstname
            ? customerBillingAddress?.defaultBilling?.firstname
            : customerBillingAddress?.defaultBillingAddress?.firstname,
          lastname: customerBillingAddress?.defaultBilling?.lastname
            ? customerBillingAddress?.defaultBilling?.lastname
            : customerBillingAddress?.defaultBillingAddress?.lastname,
          customer_id: customerId,
          email: customerDetails?.email,
          // same_as_billing: customerBillingAddress?.defaultBilling?.address_id
          //   ? customerBillingAddress?.defaultBilling?.address_id
          //   : customerBillingAddress?.defaultBillingAddress?.address_id == customerShippingAddress?.defaultBilling?.address_id
          //     ? customerShippingAddress?.defaultBilling?.address_id
          //     : customerShippingAddress?.defaultBillingAddress?.address_id
          //       ? 1 : 0,
          same_as_billing: 0,
          customer_address_id: customerBillingAddress?.defaultBilling?.address_id
            ? customerBillingAddress?.defaultBilling?.address_id
            : customerBillingAddress?.defaultBillingAddress?.address_id,
          save_in_address_book:  customerBillingAddress?.defaultBilling ? 1 : customerAddress?.allAddress?.length ? 0 : 1,

          vat_id: customerBillingAddress?.defaultBilling?.vat_id
          ? customerBillingAddress?.defaultBilling?.vat_id
          : customerBillingAddress?.defaultBillingAddress?.vat_id,
         
          customAttributes: [],
          extension_attributes: {
            reference_number: customerBillingAddress?.defaultBilling?.reference_number ? customerBillingAddress?.defaultBilling?.reference_number : "",
            additional_details: "additional bill",
            additional_data: customerBillingAddress?.defaultBilling?.additional_details ? customerBillingAddress?.defaultBilling?.additional_details : "",

          },
        },
        paymentMethod: {
          method:
            selectedPaymentMethod?.code,
          po_number: null,
          additional_data: null,
          extension_attributes: {
            agreement_ids: ["1"],
          },
        },
      };
      const guestPayload = {
        cartId: customerId,
        billing_address: {
          countryId: guestBillingAddress?.country,
          street: [
            guestBillingAddress?.addressList?.houseNumber,
            guestBillingAddress?.addressList?.address,
          ],
          company: guestBillingAddress?.addressList?.companyName,
          telephone: guestBillingAddress?.addressList?.mobileNumber,
          postcode: guestBillingAddress?.addressList?.postalCode,
          city: guestBillingAddress?.addressList?.city,
          firstname: guestBillingAddress?.addressList?.firstName,
          lastname: guestBillingAddress?.addressList?.lastName,
          customer_id: customerId,
          email: customerDetails?.email,
          same_as_billing: guestBillingAddress?.shippingAddress ? 1 : 0,
          customer_address_id: 0,
          save_in_address_book: customerBillingAddress?.defaultBilling ? 1 : customerAddress?.allAddress?.length ? 0 : 1,

          vat_id: guestBillingAddress?.addressList?.Vat,
          customAttributes: [],
          extension_attributes: {
            reference_number: guestBillingAddress?.addressList?.referenceNumber,
            additional_details: "",
            additional_data: guestBillingAddress?.addressList?.addition ? guestBillingAddress?.addressList?.addition : ""
          },
        },
        paymentMethod: {
          method:
            selectedPaymentMethod?.code,
          po_number: null,
          additional_data: null,
          extension_attributes: {
            agreement_ids: ["1"],
          },
        },
      };
      const orderId = await axios.post(
        defaultURL + "/carts/mine/payment-information",
        customerAddress?.allAddress?.length ? payload : guestPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
     

      if (orderId?.data) {
        // OrderSuccessCustomer(orderId?.data)
        navigate("/react-app")

      }

    } catch (err) {
      // setSummaryLoader(false);
      setDisableError(err?.response?.data?.message)
      console.log(err, "Place order err");
    }
  };
  
  const handleTabClick = (tabIndex) => {
    if (openTab === tabIndex) {
      setOpenTab(null);
    } else {
      setOpenTab(tabIndex);
    }
  };
  const GetCustomerAddress = (id, tokenId) => {
    const customerAddress = {
      loaderAction: (bool) => setChekcoutLoading(bool),
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          setCustomerAddress(resData?.data[0]);
        }
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      },
      axiosData: {
        url: `${baseURL}/customer/getaddress`,
        headers: { Authorization: `Bearer ${tokenId ? tokenId : token}` },
        paramsData: {
          customerId: customerId ? customerId : id ? id : "",
          quoteId: "",
        },
      },
    };
    APIQueryPost(customerAddress);
  };
  useEffect(()=>{
    handlePaymentList(summaryData);
   
  },[summaryData])
  useEffectOnce(()=>{
    if (isLoggedUser) {
      GetCustomerAddress();
    }
    if (summaryData?.totals_detail?.message) {
      if (isLoggedUser && customerQuoteId) {
        getCartItems(
          dispatch,
          () => { },
          customerQuoteId,
          customerId,
          () => { }, defaultURL,
          storeId,
          token, navigate, isSessionExpired

        );
      }
      else if (guestQuoteId) {
        getCartItems(
          dispatch,
          () => { },
          guestQuoteId,
          "",
          () => { }, defaultURL,
          storeId,
          token, navigate, isSessionExpired

        );
      }
    }
    GetCountryList(dispatch, baseURL, storeId)
 
   
  });
 
 
  const GetCountryList = () => {
    const countryList = {
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          setCountryList(resData?.data);
        }
      },

      axiosData: {
        url: `${baseURL}/getcountrylist`,
        paramsData: {
          storeId: storeId,
        },
      },
    };
    APIQueryPost(countryList);
  };
  const OrderSummaryApi = (id, quote,event) => {
      OrderSummaryApiGuest(id, quote,event)
  };
  const OrderSummaryApiGuest = (id, quote,event) => {
    const orderSummary = {
      isLoader: true,
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          setSummaryData(resData?.data[0]);
        }
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);

      },
      axiosData: {
        url: `${baseURL}/getsummary`,
        paramsData: {
          customerId: customerId ? customerId : id ? id : "",
          quoteId: quote
            ? quote
            : customerQuoteId
              ? customerQuoteId
              : guestQuoteId ? guestQuoteId : "",
          storeId: 1,
        },
      },
    };
    APIQueryPost(orderSummary);
  };
  const OrderSummaryApiCustomer = (id, quote,event) => {
    const orderSummary = {
      isLoader: true,
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          setSummaryData(resData?.data[0]);
        }
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);

      },
      axiosData: {
        url: `${baseURL}/checkout/summaryLogin`,
        paramsData: {
          customerId: customerId ? customerId : id ? id : "",
          quoteId: quote
            ? quote
            : customerQuoteId
              ? customerQuoteId
              : guestQuoteId ? guestQuoteId : "",
          storeId: storeId,
          shippingCode:event?.shipping_method_code?event?.shipping_method_code:""
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    };
    APIQueryPost(orderSummary);
  };
  useEffectOnce(()=>{
    OrderSummaryApi()
    const guestBilling = () => {
      const payload =
      {
        addressInformation: {
          shipping_address: {
            countryId: "NL",
            street: [
            ],
            company: "",
            telephone: "",
            postcode: "",
            city: "",
            firstname: "",
            lastname: "",
            save_in_address_book: 0,
            extension_attributes: {
              additional_details: "",
              additional_data: ""
            }
          },
          billing_address: {
            countryId: "NL",
            street: [
            ],
            company: "",
            telephone: "",
            postcode: "",
            city: "",
            firstname: "",
            lastname: "",
            save_in_address_book: 0,
            extension_attributes: {
              additional_details: "",
              additional_data: ""
            }
          },
          shipping_method_code: summaryData?.shipping_methods?.length && summaryData?.shipping_methods[0]?.shipping_method_code,
          shipping_carrier_code: summaryData?.shipping_methods?.length && summaryData?.shipping_methods[0]?.shipping_carrier_code,
          extension_attributes: {}
        }
      }
      const addAddres = {
        setGetResponseData: (resData) => {
          if (resData?.status === 200) {
          }
        },
        getStatus: (res) => {
          SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
        },
        axiosData: {
          url: `${defaultURL}/guest-carts/${guestKey}/shipping-information`,
          paramsData: payload,
        },
      };
      APIQueryPost(addAddres);
    };
    const CustomerBilling = () => {
      const payload =
      {
        addressInformation: {
          shipping_address: {
            countryId: "NL",
            street: [
            ],
            company: "",
            telephone: "",
            postcode: "",
            city: "",
            firstname: "",
            lastname: "",
            save_in_address_book: 0,
            extension_attributes: {
              additional_details: ""
            }
          },
          billing_address: {
            countryId: "NL",
            street: [
            ],
            company: "",
            telephone: "",
            postcode: "",
            city: "",
            firstname: "",
            lastname: "",
            save_in_address_book: 0,
            extension_attributes: {
              additional_details: ""
            }
          },
          shipping_method_code: summaryData?.shipping_methods?.length && summaryData?.shipping_methods[0]?.shipping_method_code,
          shipping_carrier_code: summaryData?.shipping_methods?.length && summaryData?.shipping_methods[0]?.shipping_carrier_code,
          extension_attributes: {}
        }
      }
      const addAddres = {
        isLoader: true,
        loaderAction: (bool) => {
          setLoadingApi({
            ...loadingApi,
            shipping: bool,
          });
        },
        setGetResponseData: (resData) => {
          if (resData?.status === 200) {
            OrderSummaryApi();
          }
        },
        getStatus: (res) => {
          SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
        },
        axiosData: {
          url: `${defaultURL}/carts/mine/shipping-information`,
          headers: { Authorization: `Bearer ${token}` },
          paramsData: payload,
        },
      };
      APIQueryPost(addAddres);
    };
    if (isLoggedUser && shippingMethodData?.length) {
      CustomerBilling();
    }
    else if (!isLoggedUser && shippingMethodData?.length) {
      guestBilling();
    }
  })
  useEffect(()=>{
if(selectedShippingMethod!==null){
  setSelectedShippingMethod(null)
}
  },[guestBillingAddress,guestShippingAddress,customerBillingAddress,customerShippingAddress])
  const AddCustomerBillingShippingAddress = (event) => {
    const billingPayload = {
      addressInformation: {
        
        shipping_address: {
          countryId: event?.label === "Afhalen in Etten-Leur"?"NL": guestBillingAddress?.country,
          street: [
            event?.label === "Afhalen in Etten-Leur"?"22": guestBillingAddress?.addressList?.houseNumber,
            event?.label === "Afhalen in Etten-Leur"?"Pauvreweg": guestBillingAddress?.addressList?.address,
          ],
          postcode: event?.label === "Afhalen in Etten-Leur"?"4879 NA":guestBillingAddress?.addressList?.postalCode,
          city:event?.label === "Afhalen in Etten-Leur"?"Etten-Leur": guestBillingAddress?.addressList?.city,
          firstname: guestBillingAddress?.addressList?.firstName,
          lastname: guestBillingAddress?.addressList?.lastName,
          vat_id: guestBillingAddress?.addressList?.Vat,
          customer_id: customerId,
          customer_address_id: 0,
          save_in_address_book: event?.label === "Afhalen in Etten-Leur"?"0": customerBillingAddress?.defaultBilling ? 1 : customerAddress?.allAddress?.length ? 0 : 1,

          extension_attributes: {
            reference_number: guestBillingAddress?.addressList?.referenceNumber,
            additional_details: "",
            additional_data: guestBillingAddress?.addressList?.addition ? guestBillingAddress?.addressList?.addition : ""
          },
        },
        billing_address: {
          countryId: guestBillingAddress?.country,
          street: [
            guestBillingAddress?.addressList?.houseNumber,
            guestBillingAddress?.addressList?.address,
          ],
          company: guestBillingAddress?.addressList?.companyName,
          telephone: guestBillingAddress?.addressList?.mobileNumber,
          postcode: guestBillingAddress?.addressList?.postalCode,
          city: guestBillingAddress?.addressList?.city,
          firstname: guestBillingAddress?.addressList?.firstName,
          lastname: guestBillingAddress?.addressList?.lastName,
          vat_id: guestBillingAddress?.addressList?.Vat,
          customer_id: customerId,
          customer_address_id: 0,
          save_in_address_book:  customerBillingAddress?.defaultBilling ? 1 : customerAddress?.allAddress?.length ? 0 : 1,

          extension_attributes: {
            reference_number: guestBillingAddress?.addressList?.referenceNumber,
            additional_details: "additional shipping",
            additional_data: guestBillingAddress?.addressList?.addition ? guestBillingAddress?.addressList?.addition : ""
          },
        },
        shipping_method_code: event?.shipping_method_code,
        shipping_carrier_code: event?.shipping_carrier_code,
        extension_attributes: {},
      },
    };
    const shippingPayload = {
      addressInformation: {
        
        shipping_address: {
          countryId: event?.label === "Afhalen in Etten-Leur"?"NL":guestShippingAddress?.country,
          street: [
            event?.label === "Afhalen in Etten-Leur"?"22": guestShippingAddress?.addressList?.houseNumbers,
            event?.label === "Afhalen in Etten-Leur"?"Pauvreweg": guestShippingAddress?.addressList?.Straatnaam,
          ],
          postcode: event?.label === "Afhalen in Etten-Leur"?"4879 NA":guestShippingAddress?.addressList?.postcode,
          city:event?.label === "Afhalen in Etten-Leur"?"Etten-Leur": guestShippingAddress?.addressList?.Stad,
          firstname: guestShippingAddress?.addressList?.firstname,
          lastname: guestShippingAddress?.addressList?.lastname,
          vat_id: guestShippingAddress?.addressList?.Vat,

          save_in_address_book:event?.label === "Afhalen in Etten-Leur"?"0":  customerBillingAddress?.defaultBilling ? 1 : customerAddress?.allAddress?.length ? 0 : 1,

          extension_attributes: {
            reference_number:
              guestShippingAddress?.addressList?.referenceNumber,
            additional_details: "additional shipping",
            additional_data: guestBillingAddress?.addressList?.addition ? guestBillingAddress?.addressList?.addition : ""

          },
        },
        billing_address: {
          countryId: guestBillingAddress?.country,
          street: [
            guestBillingAddress?.addressList?.houseNumber,
            guestBillingAddress?.addressList?.address,
          ],
          company: guestBillingAddress?.addressList?.companyName,
          telephone: guestBillingAddress?.addressList?.mobileNumber,
          postcode: guestBillingAddress?.addressList?.postalCode,
          city: guestBillingAddress?.addressList?.city,
          firstname: guestBillingAddress?.addressList?.firstName,
          lastname: guestBillingAddress?.addressList?.lastName,
          vat_id: guestBillingAddress?.addressList?.Vat,

          save_in_address_book:  customerBillingAddress?.defaultBilling ? 1 : customerAddress?.allAddress?.length ? 0 : 1,


          extension_attributes: {
            reference_number: guestBillingAddress?.addressList?.referenceNumber,
            additional_details: "",
            additional_data: guestBillingAddress?.addressList?.addition ? guestBillingAddress?.addressList?.addition : ""

          },
        },
        shipping_method_code: event?.shipping_method_code,
        shipping_carrier_code: event?.shipping_carrier_code,
        extension_attributes: {},
      },
    };
    const payloadGuest = guestBillingAddress?.shippingAddress
      ? billingPayload
      : shippingPayload;
    const payload = {
      addressInformation: {
        billing_address: {
          countryId: customerBillingAddress?.defaultBilling?.country_id
            ? customerBillingAddress?.defaultBilling?.country_id
            : customerBillingAddress?.defaultBillingAddress?.country_id,
          street: [
            customerBillingAddress?.defaultBilling?.street1
              ? customerBillingAddress?.defaultBilling?.street1
              : customerBillingAddress?.defaultBillingAddress?.street1,
            customerBillingAddress?.defaultBilling?.street2
              ? customerBillingAddress?.defaultBilling?.street2
              : customerBillingAddress?.defaultBillingAddress?.street2,
          ],
          company: customerBillingAddress?.defaultBilling?.firstname
            &&  customerBillingAddress?.defaultBilling?.company?  customerBillingAddress?.defaultBilling?.company:customerBillingAddress?.defaultBillingAddress?.company,
          telephone: customerBillingAddress?.defaultBilling?.mobile_number
            ? customerBillingAddress?.defaultBilling?.mobile_number
            : customerBillingAddress?.defaultBillingAddress?.mobile_number,
          postcode: customerBillingAddress?.defaultBilling?.postcode
            ? customerBillingAddress?.defaultBilling?.postcode
            : customerBillingAddress?.defaultBillingAddress?.postcode,
          city: customerBillingAddress?.defaultBilling?.city
            ? customerBillingAddress?.defaultBilling?.city
            : customerBillingAddress?.defaultBillingAddress?.city,
          firstname: customerBillingAddress?.defaultBilling?.firstname
            ? customerBillingAddress?.defaultBilling?.firstname
            : customerBillingAddress?.defaultBillingAddress?.firstname,
          lastname: customerBillingAddress?.defaultBilling?.lastname
            ? customerBillingAddress?.defaultBilling?.lastname
            : customerBillingAddress?.defaultBillingAddress?.lastname,
          customer_id: customerId,
          customer_address_id: customerBillingAddress?.defaultBilling?.address_id
            ? customerBillingAddress?.defaultBilling?.address_id
            : customerBillingAddress?.defaultBillingAddress?.address_id,
            
            vat_id: customerBillingAddress?.defaultBilling?.vat_id
            ? customerBillingAddress?.defaultBilling?.vat_id
            : customerBillingAddress?.defaultBillingAddress?.vat_id,
           
          save_in_address_book:  customerBillingAddress?.defaultBilling ? 1 : customerAddress?.allAddress?.length ? 0 : 1,

          extension_attributes: {
            reference_number: customerBillingAddress?.defaultBilling?.reference_number ? customerBillingAddress?.defaultBilling?.reference_number : "",
            additional_details: "additional bill",
            additional_data: customerBillingAddress?.defaultBilling?.additional_details ? customerBillingAddress?.defaultBilling?.additional_details : "",

          },
        },
        shipping_address: {
          countryId:event?.label === "Afhalen in Etten-Leur"?"NL": customerShippingAddress?.defaultBilling?.country_id
            ? customerShippingAddress?.defaultBilling?.country_id
            : customerShippingAddress?.defaultBillingAddress?.country_id,
          street: [
            event?.label === "Afhalen in Etten-Leur" ? "22": customerShippingAddress?.defaultBilling?.street1
              ? customerShippingAddress?.defaultBilling?.street1
              : customerShippingAddress?.defaultBillingAddress?.street1,
              event?.label === "Afhalen in Etten-Leur" ? "Pauvreweg" :  customerShippingAddress?.defaultBilling?.street2
              ? customerShippingAddress?.defaultBilling?.street2
              : customerShippingAddress?.defaultBillingAddress?.street2,
          ],
           postcode: event?.label === "Afhalen in Etten-Leur" ? "4879 NA": customerShippingAddress?.defaultBilling?.postcode
            ? customerShippingAddress?.defaultBilling?.postcode
            : customerShippingAddress?.defaultBillingAddress?.postcode,
          city:event?.label === "Afhalen in Etten-Leur" ?"Etten-Leur" : customerShippingAddress?.defaultBilling?.city
            ? customerShippingAddress?.defaultBilling?.city
            : customerShippingAddress?.defaultBillingAddress?.city,
          firstname: customerShippingAddress?.defaultBilling?.firstname
            ? customerShippingAddress?.defaultBilling?.firstname
            : customerShippingAddress?.defaultBillingAddress?.firstname,
          lastname: customerShippingAddress?.defaultBilling?.lastname
            ? customerShippingAddress?.defaultBilling?.lastname
            : customerShippingAddress?.defaultBillingAddress?.lastname,
          customer_id: customerId,
          customer_address_id: event?.label === "Afhalen in Etten-Leur"?"0":customerShippingAddress?.defaultBilling?.address_id =="0"?
            "0":customerShippingAddress?.defaultBilling?.address_id !=="0"?
            customerShippingAddress?.defaultBilling?.address_id
            : customerShippingAddress?.defaultBillingAddress?.address_id,
             
            vat_id: customerShippingAddress?.defaultBilling?.vat_id
            ? customerShippingAddress?.defaultBilling?.vat_id
            : customerShippingAddress?.defaultBillingAddress?.vat_id,
           
          save_in_address_book:event?.label === "Afhalen in Etten-Leur"?"0":  customerShippingAddress?.defaultBilling ? 1 : customerAddress?.allAddress?.length ? 0 : 1,
          extension_attributes: {
            reference_number: customerShippingAddress?.defaultBilling?.reference_number ? customerShippingAddress?.defaultBilling?.reference_number : "",
            additional_details: "",
            additional_data: customerShippingAddress?.defaultBilling?.additional_details ? customerShippingAddress?.defaultBilling?.additional_details : ""

          },
        },
        shipping_method_code: event?.shipping_method_code,
        shipping_carrier_code: event?.shipping_carrier_code,
        extension_attributes: {},
      },
    };
    const addAddres = {
      isLoader: true,
      loaderAction: (bool) => {
        setLoadingApi({
          ...loadingApi,
          shipping: bool,
        });
      },
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          OrderSummaryApi("","",event)
        }
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      },
      axiosData: {
        url: `${defaultURL}/carts/mine/shipping-information`,
        headers: { Authorization: `Bearer ${token}` },
        paramsData: customerAddress?.allAddress?.length
          ? payload
          : payloadGuest,
      },
    };
    APIQueryPost(addAddres);
  };
  const AddGuestBillingShippingAddress = (event) => {
    const billingPayload = {
      addressInformation: {
        shipping_address: {
          customerAddressId: "0",
          countryId: "IN",
          regionId: "599",
        regionCode: "TN",
          region: "Tamil Nadu",
          customerId: customerId,
          street: [
            guestBillingAddress?.addressList?.houseNumbers,
            guestBillingAddress?.addressList?.Straatnaam,
          ],
          company: null,
          telephone: guestBillingAddress?.addressList?.mobileNumber,
          fax: null,
          postcode:  guestBillingAddress?.addressList?.postcode,
          city:  guestBillingAddress?.addressList?.Stad,
          firstname: guestBillingAddress?.addressList?.firstname,
          lastname: guestBillingAddress?.addressList?.lastname,
          middlename: null,
          prefix: null,
          suffix: null,
          vatId: null,
          customAttributes: []
        },
        billing_address: {
          customerAddressId: "0",
          regionId: "599",
          regionCode: "TN",
          region: "Tamil Nadu",
          customerId: customerId,
          street: [
            guestBillingAddress?.addressList?.houseNumber,
            guestBillingAddress?.addressList?.address,
          ],
          company: null,
          telephone: guestBillingAddress?.addressList?.mobileNumber,
          fax: null,
          postcode: guestBillingAddress?.addressList?.postalCode,
          city: guestBillingAddress?.addressList?.city,
          firstname: guestBillingAddress?.addressList?.firstName,
          lastname: guestBillingAddress?.addressList?.lastName,
           middlename: null,
          prefix: null,
          suffix: null,
          vatId: null,
          customAttributes: [],
          saveInAddressBook: null
        },
        shipping_method_code: "flatrate",
        shipping_carrier_code: "flatrate",
        extension_attributes: {}
      }
      
    };
    const shippingPayload = {
      addressInformation: {
          shipping_address: {
            customerAddressId: "0",
            countryId: "IN",
            regionId: "599",
          regionCode: "TN",
            region: "Tamil Nadu",
            customerId: customerId,
            street: [
              guestShippingAddress?.addressList?.houseNumbers,
             guestShippingAddress?.addressList?.Straatnaam,
            ],
            company: null,
            telephone: guestShippingAddress?.addressList?.mobileNumber,
            fax: null,
            postcode:  guestShippingAddress?.addressList?.postcode,
            city:  guestShippingAddress?.addressList?.Stad,
            firstname: guestShippingAddress?.addressList?.firstname,
            lastname: guestShippingAddress?.addressList?.lastname,
            middlename: null,
            prefix: null,
            suffix: null,
            vatId: null,
            customAttributes: []
          },
          billing_address: {
            customerAddressId: "0",
            regionId: "599",
            regionCode: "TN",
            region: "Tamil Nadu",
            customerId: customerId,
            street: [
              guestBillingAddress?.addressList?.houseNumber,
              guestBillingAddress?.addressList?.address,
            ],
            company: null,
            telephone: guestBillingAddress?.addressList?.mobileNumber,
            fax: null,
            postcode: guestBillingAddress?.addressList?.postalCode,
            city: guestBillingAddress?.addressList?.city,
            firstname: guestBillingAddress?.addressList?.firstName,
            lastname: guestBillingAddress?.addressList?.lastName,
             middlename: null,
            prefix: null,
            suffix: null,
            vatId: null,
            customAttributes: [],
            saveInAddressBook: null
          },
          shipping_method_code: "flatrate",
          shipping_carrier_code: "flatrate",
          extension_attributes: {}
        }
    
    };
    const payload = guestBillingAddress?.shippingAddress
      ? billingPayload
      : shippingPayload;
    const addAddres = {
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          OrderSummaryApi("","",event)
        }
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      },
      axiosData: {
        url: `${defaultURL}/guest-carts/${guestKey}/shipping-information`,
        paramsData: payload,
      },
    };
    APIQueryPost(addAddres);
  };
  const handlePaymentList = (summaryList) => {
    if (summaryList) {
      const paymentMethod = summaryList?.payment_methods?.payment_methods;
      if (paymentMethod) {
        const updatedPaymentMethods = paymentMethod.filter(
          (method) => method.id !== "Mondu: betaal achteraf, na 30 dagen"
        );
        if(!isLoggedUser){
          if(guestBillingAddress?.country !== "NL" ||(guestShippingAddress?.country && guestShippingAddress?.country!== "NL")){
        setPaymentMethods(updatedPaymentMethods);
          }
          else{
          setPaymentMethods(paymentMethod);

          }
        }
        if (isLoggedUser) {
          const isNonDutchCustomerBillingAddress = 
              (customerBillingAddress?.defaultBilling?.country_id && customerBillingAddress.defaultBilling.country_id !== "NL") ||
              (customerBillingAddress?.defaultBillingAddress?.country_id && customerBillingAddress.defaultBillingAddress.country_id !== "NL");
      
          const isNonDutchCustomerShippingAddress = 
              (customerShippingAddress?.defaultBilling?.country_id && customerShippingAddress.defaultBilling.country_id !== "NL") ||
              (customerShippingAddress?.defaultBillingAddress?.country_id && customerShippingAddress.defaultBillingAddress.country_id !== "NL");
      
          const isNonDutchGuestBillingAddress = 
              guestBillingAddress?.country && guestBillingAddress.country !== "NL";
      
          const isNonDutchGuestShippingAddress = 
              guestShippingAddress?.country && guestShippingAddress.country !== "NL";
      
          if (isNonDutchCustomerBillingAddress || isNonDutchCustomerShippingAddress) {
              setPaymentMethods(updatedPaymentMethods);
          } else if (isNonDutchGuestBillingAddress || isNonDutchGuestShippingAddress) {
              setPaymentMethods(updatedPaymentMethods);
          } else {
              setPaymentMethods(paymentMethod);
          }
      }
      
      
        
      }
    }
  }
  const handleShippingMethod = (event) => {
    setSelectedShippingMethod(event);
    setErrorsShipping("")
    if (isLoggedUser) {
      AddCustomerBillingShippingAddress(event);
    } else if (!isLoggedUser) {
      AddGuestBillingShippingAddress(event);
    }
  };
  const handlePaymentMethod = (event) => {
    setErrorsPayment("")
    setSelectedPaymentMethod(event);

    if (!isLoggedUser) {
      const selectPayment = {
        isLoader: true,
        loaderAction: (bool) => {
          setLoadingApi({
            ...loadingApi,
            payment: bool,
          });
        },
        setGetResponseData: (resData) => {
          if (resData?.status === 200) {
          }
        },
        getStatus: (res) => {
          SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
        },
        axiosData: {
          url: `${defaultURL}/guest-carts/${guestKey}/set-payment-information`,
          paramsData: {
            cartId: guestKey,
            paymentMethod: {
              method:
                event = event?.code,
            },
            email: guestBillingAddress?.addressList?.email,
          },
        },
      };
      APIQueryPost(selectPayment);
    } else if (isLoggedUser) {
      const selectPayment = {
        isLoader: true,
        loaderAction: (bool) => {
          setLoadingApi({
            ...loadingApi,
            payment: bool,
          });
        },
        setGetResponseData: (resData) => {
          if (resData?.status === 200) {
          }
        },
        getStatus: (res) => {
          SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
        },
        axiosData: {
          url: `${defaultURL}/carts/mine/set-payment-information`,
          headers: { Authorization: `Bearer ${token}` },
          paramsData: {
            cartId: customerId,
            paymentMethod: {
              method:
                event = event?.code,
            },
            email: guestBillingAddress?.addressList?.email,
          },
        },
      };
      APIQueryPost(selectPayment);
    }
  };
  const handleNewsLetter = (item) => {
    if (!isLoggedUser) {
      const selectNewsLetter = {
        setGetResponseData: (resData) => {
          if (resData?.status === 200) {
            OrderSummaryApi();
          }
        },
        getStatus: (res) => {
          SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
        },
        axiosData: {
          url: `${defaultURL}/amasty_checkout/guest-carts/${guestKey}/amcheckoutFields`,
          paramsData: {
            cartId: guestKey,
            fields: {
              subscribe: item,
            },
          },
        },
      };
      APIQueryPost(selectNewsLetter);
    } else if (isLoggedUser) {
      const selectNewsLetter = {
        setGetResponseData: (resData) => {
          if (resData?.status === 200) {
            OrderSummaryApi();
            getUserDetails();
          }
        },
        getStatus: (res) => {
          SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);

        },
        axiosData: {
          url: `${defaultURL}/amasty_checkout/carts/mine/amcheckoutFields`,
          headers: { Authorization: `Bearer ${token}` },
          paramsData: {
            cartId: customerId,
            fields: {
              subscribe: item,
            },
          },
        },
      };
      APIQueryPost(selectNewsLetter);
    }
  };
  const getUserDetails = () => {
    const userDetailsOptions = {
      isLoader: true,
      loaderAction: (bool) => (bool),
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          dispatch(ACTION_CUSTOMER__DETAILS(resData?.data));
        }
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      },
      axiosData: {
        url: `${defaultURL}/customers/me`,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    }
    APIQueryGet(userDetailsOptions);
  }
  const getCustomerDetails = (data) => {
    (data.status == true) ? setBtnLogin(true) : setBtnLogin(false)
  }
  const getCustomerBillingAddress = (data) => {
    setCustomerBillingAddress(data);
  };
  const getCustomerShippingAddress = (data) => {
    setCustomerShippingAddress(data);
  };
  function getPaymentMethodImage(paymentMethodId) {
    const imageSources = {
      multisafepay_ideal: ideal,
      multisafepay_bancontact: ban,
      mondu: mondu,
      multisafepay_mastercard: mastercard,
      multisafepay_giropay: gp,
      multisafepay_sofort: sofort,
      multisafepay_visa: visa,
      multisafepay_maestro: mastero,
    };
    return imageSources[paymentMethodId];
  }
  useEffect(() => {
    if (submitAddress && submitAddress.action === "next") {
      handleTabClick("shipping");
      // AddGuestBillingShippingAddress(summaryData?.shipping_methods?.length && summaryData?.shipping_methods[0])
      setSubmitAddress(null);
      handleExpandNext("fast");
    }
  }, [submitAddress]);
  const shippingMethodData = [
  
    {
        "label": "Flatrate ",
        "cost_base_price": "0,00",
        "cost_base_price_details": {
            "Expofit Pakketverzending": "0.00"
        },
        "shipping_method": "flatrate",
        "shipping_method_code": "flatrate",
        "cost_base": "0.00",
        "shipping_amount": "",
        "shipping_carrier_code": "flatrate"
    }
]
  const handleExpandNext = (action) => {

    setTimeout(() => {
      const head = document.querySelector(`.subHeader`);
      let ele = document.querySelector(`.accordion`);
      const top = ele?.offsetTop - (action ? -10 : -(head?.clientHeight));
      window.scrollTo({ top: 30, left: 0, behavior: "smooth" });
    }, 400)
  };
  const isChecked =
    summaryData?.totals_detail?.isSubscribe == 1 ||
    newsLetterSubscription ||
    customerDetails?.extension_attributes?.is_subscribed;

  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setNewsLetterSubscription(isChecked);
    handleNewsLetter(isChecked);
  };

  const handleSpanClick = () => {
    const newCheckedState = !isChecked;
    setNewsLetterSubscription(newCheckedState);
    handleNewsLetter(newCheckedState);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992); 
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTooltipToggle = (code) => {
    if (code === 'mondu') {
      setMonduTooltipOpen((prev) => !prev);
      setBanktransferTooltipOpen(false); 
    } else if (code === 'banktransfer') {
      setBanktransferTooltipOpen((prev) => !prev);
      setMonduTooltipOpen(false); 
    }
  };
  
  const handleClickOutside = (event) => {
    const isClickOutsideMondu =
      iconMonduRef.current && !iconMonduRef.current.contains(event.target) &&
      monduTooltipRef.current && !monduTooltipRef.current.contains(event.target);

    const isClickOutsideBankTransfer =
      iconBankTransferRef.current && !iconBankTransferRef.current.contains(event.target) &&
      bankTransferTooltipRef.current && !bankTransferTooltipRef.current.contains(event.target);

    if (isClickOutsideMondu) {
      setMonduTooltipOpen(false);
    }

    if (isClickOutsideBankTransfer) {
      setBanktransferTooltipOpen(false);
    }

    if (banktransferTooltipOpen && !isClickOutsideBankTransfer && !bankTransferTooltipRef.current.contains(event.target)) {
      return;
    }

  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const BlackTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    margin: '20px',
    [`& .${tooltipClasses.arrow}`]: {
      color: "#8B4AFE",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#8B4AFE",
      font: "normal normal 300 14px Poppins",
      padding: 16,
      borderRadius: "10px 5px 10px 10px",
      width: "100% !important",
      margin: '20px',
      minWidth: '400px', 
      [theme.breakpoints.down(450)]: {
        minWidth: '0', 
      },
    },
  }));

  const MemoizedImg = memo(({ src }) => (
    <img
    src={src}
    alt="info"
    style={{
      width: '19px',
      cursor: 'pointer',
      maxWidth: '19px',
      margin: '-7px 5px',
    }}
    />
  ));
  
  return (
    <>
     
      {summaryData?.totals_detail?.message ? (
        <CartPage />
      ) : summaryData?.totals_detail?.items?.length ? (
        <div className="container px-xl-4 pt-8  xl-py-8">
          <div className="checkout__container xl-flex xl-gap-x-12 pb-4">
            <div className="order__sumary ">
              <OrderSummary summaryData={summaryData} />
              {summaryData?.totals_detail?.postage_string ? (
                <div className="description mt-4">
                  <h4 className="fw-600 px-4 pt-4">* Let op:</h4>
                  <p className="fs-15">
                    {summaryData?.totals_detail?.postage_string}
                  </p>
                </div>
              ) : (
                ""
              )}

            
            </div>
            <div className="address__section pb-6 px-4 w-1/1">
              <h1 className="fw-700 fs-32 py-6">To settle</h1>
              <div className="billing__address">
                {openTab !== "billing" && (
                  <div className="flex space-between">
                    <h3 className="fw-700 fs-20 pb-4">Billing address</h3>
                    <button
                      className="fw-300 fs-15 text-underline "
                      onClick={() => handleTabClick("billing")}
                      aria-label="button"
                    >
                      wijzigen
                    </button>
                  </div>
                )}
                {isLoggedUser &&
                openTab == "billing" &&
                customerAddress?.allAddress?.length ? (
                  <>
                    {checkoutLoading ? (
                      <>
                        <div className="default__address pb-8">
                          {["", "", "", "", ""]?.map((item, index) => (
                            <div className="mb-2">
                              <SkeletonLine width="100%" height="30px" />
                            </div>
                          ))}
                        </div>
                        <div className="default__address">
                          {["", "", "", "", ""]?.map((item, index) => (
                            <div className="mb-2">
                              <SkeletonLine width="100%" height="30px" />
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <CustomerBillingAddress
                          customerAddress={customerAddress}
                          countryList={countryList}
                          GetCustomerAddress={GetCustomerAddress}
                          getCustomerBillingAddress={getCustomerBillingAddress}
                          summaryData={summaryData}
                          AddCustomerBillingShippingAddress={AddCustomerBillingShippingAddress}
                        />
                        <CustomerShippingAddress
                          customerAddress={customerAddress}
                          countryList={countryList}
                          GetCustomerAddress={GetCustomerAddress}
                          getCustomerShippingAddress={
                            getCustomerShippingAddress
                          }
                          onTabClick={handleTabClick}
                          handleExpandNext={handleExpandNext}
                          summaryData={summaryData}
                          customerBillingAddress={customerBillingAddress}
                          customerShippingAddress={customerShippingAddress}
                          AddCustomerBillingShippingAddress={AddCustomerBillingShippingAddress}
                        />
                      </>
                    )}
                  </>
                ) : openTab == "billing" &&
                  customerAddress?.allAddress?.length == 0 ? (
                  <>
                    <GuestBillingAddress
                      summaryData={summaryData}
                      openTab={openTab}
                      setGuestBillingAddress={setGuestBillingAddress}
                      guestBillingAddress={guestBillingAddress}
                      countryList={countryList}
                      OrderSummaryApi={OrderSummaryApi}
                      GetCustomerAddress={GetCustomerAddress}
                      onTabClick={handleTabClick}
                      shippingAddress={shippingAddress}
                      onShippingAddressChange={handleShippingAddressChange}
                      setSubmitAddress={setSubmitAddress}
                      submitAddress={submitAddress}
                      getCustomerDetails={getCustomerDetails}
                      AddGuestBillingShippingAddress={AddGuestBillingShippingAddress}
                    />
                    {!shippingAddress ? (
                      <GuestShippingAddress
                        summaryData={summaryData}
                        setGuestShippingAddress={setGuestShippingAddress}
                        guestShippingAddress={guestShippingAddress}
                        countryList={countryList}
                        setSubmitAddress={setSubmitAddress}
                        submitAddress={submitAddress}
                        openTab={openTab}
                      AddGuestBillingShippingAddress={AddGuestBillingShippingAddress}

                      />
                    ) : (
                      ""
                    )}
                    <div className="button__info pt-4 pb-6">
                      <Button
                        className="fs-16 line-8 fw-700 r-8  px-5 cart__button"
                        fullWidth
                        type="submit"
                        onClick={(e) => {
                          setSubmitAddress({
                            e,
                            action: shippingAddress ? "single" : "double",
                          });
                        }}
                      >
                        To shipping
                        <span className="flex middle fw-700">
                          <KeyboardArrowRightIcon />
                        </span>
                      </Button>
                    </div>
                  </>
                ) : (
                  openTab == "billing" &&
                  !isLoggedUser && (
                    <>
                      <GuestBillingAddress
                        summaryData={summaryData}
                        openTab={openTab}
                        setGuestBillingAddress={setGuestBillingAddress}
                        guestBillingAddress={guestBillingAddress}
                        countryList={countryList}
                        OrderSummaryApi={OrderSummaryApi}
                        GetCustomerAddress={GetCustomerAddress}
                        onTabClick={handleTabClick}
                        shippingAddress={shippingAddress}
                        onShippingAddressChange={handleShippingAddressChange}
                        setSubmitAddress={setSubmitAddress}
                        submitAddress={submitAddress}
                        getCustomerDetails={getCustomerDetails}
                        AddGuestBillingShippingAddress={AddGuestBillingShippingAddress}
                      />
                      {!shippingAddress ? (
                        <GuestShippingAddress
                          summaryData={summaryData}
                          setGuestShippingAddress={setGuestShippingAddress}
                          guestShippingAddress={guestShippingAddress}
                          countryList={countryList}
                          setSubmitAddress={setSubmitAddress}
                          submitAddress={submitAddress}
                          openTab={openTab}
                      AddGuestBillingShippingAddress={AddGuestBillingShippingAddress}

                        />
                      ) : (
                        ""
                      )}
                      {!btnLogin && (
                        <div className="button__info pt-4 pb-6">
                          <Button
                            className="fs-16 line-8 fw-700 r-8  px-5 cart__button"
                            fullWidth
                            type="submit"
                            onClick={(e) => {
                              setSubmitAddress({
                                e,
                                action: shippingAddress ? "single" : "double",
                              });
                            }}
                          >
                            To shipping
                            <span className="flex middle fw-700">
                              <KeyboardArrowRightIcon />
                            </span>
                          </Button>
                        </div>
                      )}
                    </>
                  )
                )}
              </div>
              <div className="shipping__method py-6">
                <div className="choose__business  ">
                  <div className="flex space-between">
                    <h3 className="fw-700 fs-20 ">Dispatch</h3>
                    {selectedShippingMethod && openTab !== "shipping" && (
                      <button
                        className="fw-300 fs-15 text-underline "
                        onClick={() => handleTabClick("shipping")}
                        aria-label="button"
                      >
                        wijzigen
                      </button>
                    )}
                  </div>
                  <div className="accordion">
                    {openTab == "shipping" && (
                      <div>
                        {shippingMethodData?.length ? (
                          <>
                            <div className="flex gap-2 sm-flex sm-gap-20 py-6 sm-py-6">
                              <div className="xl-w-1/2 w-1/1">
                                {shippingMethodData?.map(
                                  (detail, detailIndex) => (
                                    <div className="flex space-between w-1/1">
                                      <Input
                                        type="radio"
                                        name="business" 
                                        onclickFunction={()=>handleShippingMethod(detail)}
                                        lable={detail?.label}
                                        value="0"
                                        fieldClassName="radio flex gap-4 row pb-5 row-i right middle"
                                        labelClassName="fs-15 fw-300 pointer"
                                        onChange={() =>
                                          handleShippingMethod(detail)
                                        }
                                        checked={
                                          selectedShippingMethod?.shipping_method_code ==
                                          detail?.shipping_method_code
                                        }
                                      />
                                      <div key={detailIndex}>
                                        <p className="fs-15 pb-5">
                                          {detail?.shipping_amount ==="0,00" ? "Gratis":detail?.shipping_amount}
                                        </p>
                                      </div>
                                    </div>
                                  )
                                )}
                                {selectedShippingMethod?.label === "Afhalen in Etten-Leur" && (
                              <p className="fs-12 shipping_note">
                                Let op: bij ophalen wordt het verzendadres niet gebruikt. Uw bestelling kan worden afgehaald op: Pauvreweg 22, 4879 NA Etten-Leur.
                              </p>
                            )}
                              </div>
                            </div>
                            
                          </>
                        ) : (
                          ""
                        )}
                        <p className="xl-flex flex center xl-right errors fs-14 pb-4">
                          {errorsShipping}
                        </p>
                        <div className="button__info  pb-6">
                          <Button
                            className={`fs-16  fw-700 r-8  px-5 cart__button `}
                            fullWidth
                            type="submit"
                            onClick={() => {
                              if (selectedShippingMethod !== null) {
                                handleTabClick(
                                  summaryData?.totals_detail?.isSample == 1 &&
                                    summaryData?.totals_detail
                                      ?.subtotal_rounded == "0,00"
                                    ? "completeorder"
                                    : "payment"
                                );
                                if (
                                  summaryData?.totals_detail?.isSample == 1 &&
                                  summaryData?.totals_detail
                                    ?.subtotal_rounded == "0,00"
                                ) {
                                  handlePaymentMethod(
                                    summaryData?.payment_methods
                                      ?.payment_methods[0]
                                  );
                                }
                                handleExpandNext("fast");
                                setErrorsShipping("");
                              } else {
                                setErrorsShipping(
                                  "Kies een verzendmethode om door te gaan"
                                );
                              }
                            }}
                          >
                            {/* {loadingApi?.shipping ? (
                              <AutorenewIcon />
                            ) : (
                              <>
                              {summaryData?.totals_detail?.isSample == 1 && summaryData?.totals_detail?.subtotal_rounded == "0,00" ? "Naar afronden" : "Naar betaalmethode"}  
                                <span className="flex middle fw-700">
                                  <KeyboardArrowRightIcon />
                                </span>
                              </>
                            )} */}
                            <>
                              {summaryData?.totals_detail?.isSample == 1 && summaryData?.totals_detail?.subtotal_rounded == "0,00" ? "Naar afronden" : "Naar betaalmethode"}  
                                <span className="flex middle fw-700">
                                  <KeyboardArrowRightIcon />
                                </span>
                              </>
                            
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {summaryData?.totals_detail?.isSample == 1 && summaryData?.totals_detail?.subtotal_rounded == "0,00" ? null : (
                <div className="payment__method py-6">
                  <div className="choose__business  ">
                    <div className="flex space-between">
                      <h3 className="fw-700 fs-20 ">Payment method</h3>
                      {openTab !== "payment" && selectedPaymentMethod && (
                        <button
                          className="fw-300 fs-15 text-underline "
                          onClick={() => handleTabClick("payment")}
                          aria-label="button"
                        >
                          wijzigen
                        </button>
                      )}
                    </div>
                    {openTab == "payment" && (
                      <div className="w-1/1 relative overflow-hidden">
                        <div className="flex gap-2 col sm-flex sm-gap-4 py-6 sm-py-6">
                          {summaryData?.payment_methods?.payment_methods[0]
                            ?.code == "free" ? (
                            <>
                              {summaryData?.payment_methods?.payment_methods
                                ?.length ? (
                                <div className="flex gap-4  middle">
                                  <Input
                                    type="radio"
                                    name="business"
                                   
                                    value="0"
                                    fieldClassName="radio flex gap-4 row  row-i right middle"
                                    onChange={() =>
                                      handlePaymentMethod(
                                        summaryData?.payment_methods
                                          ?.payment_methods[0]
                                      )
                                    }
                                    checked={
                                      selectedPaymentMethod &&
                                      selectedPaymentMethod?.code ==
                                        summaryData?.payment_methods
                                          ?.payment_methods[0]?.code
                                    }
                                  />
                                  <div className="payment__img relative">
                                    <Img
                                      src={getPaymentMethodImage(
                                        summaryData?.payment_methods
                                          ?.payment_methods[0].code
                                      )}
                                    />
                                  </div>
                                  <div
                                    className={`flex  gap-1  ${
                                      summaryData?.payment_methods
                                        ?.payment_methods[0]?.id == "IDEAL"
                                        ? "middle sm-flex sm-gap-4"
                                        : "col"
                                    }`}
                                  >
                                    <span className="fs-15 fw-300 pointer"  onClick={() =>
                                      handlePaymentMethod(
                                        summaryData?.payment_methods
                                          ?.payment_methods[0]
                                      )
                                    }>
                                      {
                                        summaryData?.payment_methods
                                          ?.payment_methods[0]?.title
                                      }
                                    </span>
                                    {summaryData?.payment_methods
                                      ?.payment_methods[0]?.code ===
                                      "multisafepay_ideal" &&
                                    getIdealBankList?.length ? (
                                      <>
                                        {/* <label
                                          htmlFor="country"
                                          className="fs-15 "
                                        >
                                          Selecteer uw bank
                                        </label> */}
                                        <select
                                          id="billingCountry"
                                          className="form-select fs-15 bankSelection"
                                          aria-label="Default select example"
                                          value={selectedBank}
                                          onChange={(e) =>
                                            setSelectedBank(e.target.value)
                                          }
                                        >
                                         <option value="" disabled>Selecteer uw bank</option>
                                          {getIdealBankList?.map(
                                            (item, ind) => {
                                              return (
                                                <>
                                                  <option
                                                    key={ind}
                                                    value={item?.code}
                                                    className="fs-15"
                                                  >
                                                    {item?.description}
                                                  </option>
                                                </>
                                              );
                                            }
                                          )}
                                        </select>
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </div>
                                </div>
                              ) : (
                                ""
                              )}
                            </>
                          ) : (
                            <>
                              {paymentMethods?.length
                                ? paymentMethods?.map((item, index) => (
                                    <div
                                      className={`flex gap-4 payment__item ${
                                        item?.code === "mondu" || "banktransfer"
                                          ? ""
                                          : "middle"
                                      }`}
                                      key={index}
                                    >
                                      <Input
                                        type="radio"
                                        name="business"
                                        value="0"
                                       
                                        fieldClassName="radio flex gap-4 row  row-i right middle"
                                        onChange={() =>
                                          handlePaymentMethod(item)
                                        }
                                        checked={
                                          selectedPaymentMethod
                                            ? selectedPaymentMethod.code ===
                                              item.code
                                            : false
                                        }
                                      />
                                      <div className="payment__img relative">
                                        <Img
                                          src={getPaymentMethodImage(
                                            item?.code
                                          )}
                                        />
                                      </div>
                                      <div
                                        className={`flex gap-1 mobile-wrap  ${
                                          item?.id === "IDEAL"
                                            ? "middle sm-flex sm-gap-4"
                                            : "col"
                                        }`}
                                      >
                                      <span
  className={`fs-15 fw-300 pointer ${item?.code === "mondu" ? "pt-1" : ""}`}
>
  <span   onClick={() => handlePaymentMethod(item)}>{item.title}</span>
  <span>
  {item?.code === 'mondu' && isMobile && (
      <BlackTooltip 
        title={
          <>
            Na de levering van uw order ontvangt u de factuur per e-mail en dient u het factuurbedrag binnen 30 dagen te voldoen. Informatie over de verwerking van uw persoonsgegevens door Mondu GmbH vindt u{' '}
            <a target="__blank" href="https://www.mondu.ai/nl/gdpr-notification-for-buyers/">
              hier
            </a>
            .
          </>
        }
        open={monduTooltipOpen}
        onClose={() => setMonduTooltipOpen(false)}
        onOpen={() => setMonduTooltipOpen(true)}
        ref={monduTooltipRef}
        disableHoverListener
        arrow
      >
        <span onClick={() => handleTooltipToggle('mondu')} ref={iconMonduRef} style={{ width: "19px" }}>
          <MemoizedImg src={info} />
        </span>
      </BlackTooltip>
    )}

    {item?.code === 'banktransfer' && isMobile && (
      <BlackTooltip
        title={
          <>
            In het geval van bedrukte artikelen ontvangt u de factuur per e-mail na goedkeuring artwork. Bij onbedrukte artikelen ontvangt u de factuur per e-mail na verwerking van de bestelling. Uw bestelling wordt verstuurd nadat de volledige betaling is gedaan.
          </>
        }
        open={banktransferTooltipOpen}
        onClose={() => setBanktransferTooltipOpen(false)}
        onOpen={() => setBanktransferTooltipOpen(true)}
        ref={bankTransferTooltipRef}
        disableHoverListener
        arrow
      >
        <span onClick={() => handleTooltipToggle('banktransfer')} ref={iconBankTransferRef} style={{ width: "19px" }}>
          <MemoizedImg src={info} />
        </span>
      </BlackTooltip>
    )}

{!isMobile && (
  <span className="fs-14 fw-300 text line-6">
    {item.code === 'mondu' ? (
      <>
        Na de levering van uw order ontvangt u de factuur per e-mail en dient u het factuurbedrag binnen 30 dagen te voldoen. Informatie over de verwerking van uw persoonsgegevens door Mondu GmbH vindt u{' '}
        <a target="__blank" href="https://www.mondu.ai/nl/gdpr-notification-for-buyers/">
          hier
        </a>
      </>
    ) : item.code === 'banktransfer' ? (
      <>
In het geval van bedrukte artikelen ontvangt u de factuur per e-mail na goedkeuring artwork. Bij onbedrukte artikelen ontvangt u de factuur per e-mail na verwerking van de bestelling. Uw bestelling wordt verstuurd nadat de volledige betaling is gedaan.      
</>
    ) : null}
  </span>
)}


  </span>
</span>

                                        {item?.code === "multisafepay_ideal" &&
                                        getIdealBankList?.length ? (
                                          <>
                                            {/* <label
                                              htmlFor="country"
                                              className="fs-15 "
                                            >
                                              Selecteer uw bank
                                            </label> */}
                                            {/* <select
                                              id="billingCountry"
                                              className="form-select fs-15 bankSelection"
                                              aria-label="Default select example"
                                              value={selectedBank}
                                              onClick={() => {
                                                handlePaymentMethod(item); 
                                              }}
                                              onChange={(e) => {
                                                // setSelectedBank(e.target.value)
                                                const selectedBankCode = e.target.value;
                                                setSelectedBank(selectedBankCode); 
                                                handlePaymentMethod(item); 
                                              }
                                              }
                                            >
                                              <option value="" disabled>Selecteer uw bank</option>
                                              {getIdealBankList?.map(
                                                (item, ind) => {
                                                  return (
                                                    <option
                                                      key={ind}
                                                      value={item?.code}
                                                      className="fs-15"
                                                    >
                                                      {item?.description}
                                                    </option>
                                                  );
                                                }
                                              )}
                                            </select> */}
                                          </>
                                        ) : (
                                          ""
                                        )}
                                        
          {/* {(item?.code === 'mondu' || item?.code === 'banktransfer') && (
        isMobile ? (
          <BlackTooltip
          title={
            item.code === 'mondu' ? (
              <>
                Na de levering van uw order ontvangt u de factuur per e-mail en dient u het factuurbedrag binnen 30 dagen te voldoen. Informatie over de verwerking van uw persoonsgegevens door Mondu GmbH vindt u{' '}
                <a target="__blank" href="https://www.mondu.ai/nl/gdpr-notification-for-buyers/">
                  hier
                </a>
                .
              </>
            ) : (
              <>
                In het geval van bedrukte artikelen ontvangt u de factuur per e-mail na goedkeuring artwork. Bij onbedrukte artikelen ontvangt u de factuur per e-mail na verwerking van de bestelling. Uw bestelling wordt verstuurd nadat de volledige betaling is gedaan.
              </>
            )
          }
          open={tooltipOpen}
          onClose={() => setTooltipOpen(false)} 
          onOpen={() => setTooltipOpen(true)} 
          ref={tooltipRef}
          disableHoverListener
          arrow
        >
              <span  onClick={handleTooltipToggle} ref={iconRef} style={{ width: "19px" }}>
              <MemoizedImg src={info}  />
               </span>
                               
        </BlackTooltip>        
        ) : (
          <span className="fs-14 fw-300 text line-6">
            {item.code === 'mondu' ? (
              <>
                Na de levering van uw order ontvangt u de factuur per e-mail en dient u het factuurbedrag binnen 30 dagen te voldoen. Informatie over de verwerking van uw persoonsgegevens door Mondu GmbH vindt u{' '}
                <a target="__blank" href="https://www.mondu.ai/nl/gdpr-notification-for-buyers/">
                  hier
                </a>
              </>
            ) : (
              <>
                In het geval van bedrukte artikelen ontvangt u de factuur per e-mail na goedkeuring artwork. Bij onbedrukte artikelen ontvangt u de factuur per e-mail na verwerking van de bestelling. Uw bestelling wordt verstuurd nadat de volledige betaling is gedaan.
              </>
            )}
          </span>
        )
      )} */}
                                      </div>
                                    </div>
                                  ))
                                : ""}
                            </>
                          )}
                        </div>

                        <p className="xl-flex flex center xl-right  errors fs-14 pb-4">
                          {errorsPayment}
                        </p>
                        <div className="button__info  pb-6">
                          <Button
                            className={`fs-16  fw-700 r-8  px-5 cart__button ${
                              loadingApi?.payment ? "rotateUpdate" : ""
                            }`}
                            fullWidth
                            type="submit"
                            onClick={() => {
                              if (
                                selectedPaymentMethod !== null ||
                                (selectedPaymentMethod?.code ==
                                  "multisafepay_ideal" &&
                                  selectedBank != "")
                              ) {
                                handleTabClick("completeorder");
                                handleExpandNext("fast");

                                setErrorsPayment("");
                              } else {
                                setErrorsPayment(
                                  "Kies een betaalmethode om verder te gaan"
                                );
                              }
                            }}
                          >
                            {loadingApi?.payment ? (
                              <AutorenewIcon />
                            ) : (
                              <>
                                Naar afronden
                                <span className="flex middle fw-700">
                                  <KeyboardArrowRightIcon />
                                </span>
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="complete__order py-6">
                <div className="choose__business  ">
                  <div className="flex space-between">
                  </div>
                  {openTab == "completeorder" && (
                    <>
                     
                      {disabledError && (
                        <p className="xl-flex flex center xl-right  errors fs-14 pb-4">
                          {disabledError}
                        </p>
                      )}   <div className="w-1/1  pb-6">
                        <Button
                          className={`fs-20 line-8 fw-700   px-5 py-4 order__button ${
                            paymentLoader ? "rotateUpdate" : ""
                          }`}
                          fullWidth
                          type="submit"
                          disabled={paymentLoader}
                          onClick={() => {
                            triggerHotjarEvent('checkout_order_click');
                            if (
                              isLoggedUser &&
                              (guestBillingAddress?.addressList?.companyName!==""||(guestShippingAddress && guestShippingAddress?.addressList?.companyname !=="")) &&
                              summaryData?.totals_detail?.isSample === "1"
                            )  {
                              // setDisableError(
                              //   "Alleen bedrijven kunnen samples bestellen. Controleer of uw accountgegevens correct zijn ingesteld; momenteel staat het type als particulier geselecteerd."
                              // );
                              handleExpandNext("fast");
                              if (isLoggedUser) {
                                placeOrder();
                              } else if (!isLoggedUser) {
                                GuestplaceOrder();
                              }
                            }
                           else if (
                              isLoggedUser &&
                              customerDetails?.custom_attributes?.length > 0 && 
                              customerDetails.custom_attributes[0]?.value == 0 &&
                              summaryData?.totals_detail?.isSample === "1"
                            )  {
                              setDisableError(
                                "Alleen bedrijven kunnen samples bestellen. Controleer of uw accountgegevens correct zijn ingesteld; momenteel staat het type als particulier geselecteerd."
                              );
                            } else {
                              handleExpandNext("fast");
                              if (isLoggedUser) {
                                placeOrder();
                              } else if (!isLoggedUser) {
                                GuestplaceOrder();
                              }
                            }
                          }}
                        >
                          {paymentLoader ? (
                            <AutorenewIcon />
                          ) : (
                            <>
                              Bestellen
                              <span className="flex middle fw-700">
                                <KeyboardArrowRightIcon />
                              </span>
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {summaryData?.totals_detail?.postage_string ? (
                <div className="description-mobile mt-8">
                  <h4 className="fw-600 px-4 pt-4">* Let op:</h4>
                  <p className=" fs-15">
                    {summaryData?.totals_detail?.postage_string}
                  </p>
                </div>
              ) : (
                ""
              )}
            
            </div>
          </div>
        </div>
      ) : (
        <div className="container px-xl-4 pt-8  xl-py-14">
          <div className="checkout__container xl-flex xl-gap-x-12 pb-4">
            <div className="order__sumary w-1/3">
              {["", "", "", "", ""]?.map((item, index) => (
                <div className="mb-2">
                  <SkeletonLine width="100%" height="30px" />
                </div>
              ))}
             
            </div>
            <div className="address__section pb-6 px-4 w-1/1">
              <div className="billing__address">
                {["", "", "", "", ""]?.map((item, index) => (
                  <div className="mb-2">
                    <SkeletonLine width="100%" height="30px" />
                  </div>
                ))}
              </div>
              <div className="shipping__method py-6">
                {["", "", "", "", ""]?.map((item, index) => (
                  <div className="mb-2">
                    <SkeletonLine width="100%" height="30px" />
                  </div>
                ))}
              </div>
              <div className="payment__method py-6">
                {["", "", "", "", ""]?.map((item, index) => (
                  <div className="mb-2">
                    <SkeletonLine width="100%" height="30px" />
                  </div>
                ))}
              </div>

              <div className="complete__order py-6">
                {["", "", "", "", ""]?.map((item, index) => (
                  <div className="mb-2">
                    <SkeletonLine width="100%" height="30px" />
                  </div>
                ))}
              </div>
              <div className="static__content pt-12 px-4">
                {["", "", "", "", ""]?.map((item, index) => (
                  <div className="mb-2">
                    <SkeletonLine width="100%" height="30px" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Checkout;