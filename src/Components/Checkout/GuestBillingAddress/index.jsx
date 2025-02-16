import React, { useEffect, useState, useContext } from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import Input from "Components/Common/Form/Input";
import Button from "Components/Common/Button";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useForm from "Components/Hooks/useForm";
import {
  ACTION_CUSTOMER__DETAILS,
  ACTION_CUSTOMER__QUOTE__ID,
  ACTION_CUSTOMER__TOKEN,
  ACTION_ISLOGGEDUSER,
  ACTION_OPEN__LOGIN,
  ACTION_OPEN__FORGOTPASSWORD,
  ACTION_GUESTQUOTE__DETAILS,
  ACTION_GUESTKEY,
  ACTION_POSTAL_DATA_VALUE
} from "Store/action";
import { mergeCart, handleForgotQuote } from "Utilities";
import { APIQueryPost, APIQueryGet } from "APIMethods/API";
import { ValidSuccesArrow, ValidErrorArrow } from "Res/icons/index";
import LoginForgotCheckout from "../ForgotPassword/ForgotPassword";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function GuestBillingAddress({
  getCustomerDetails,
  countryList,
  validateAddress,
  OrderSummaryApi,
  GetCustomerAddress,
  shippingAddress,
  onShippingAddressChange,
  setSubmitAddress,
  submitAddress,
  setGuestBillingAddress,
  guestBillingAddress,
  openTab,
  summaryData,
  AddGuestBillingShippingAddress
}) {
  const [openModelSocial, setOpenModelSocial] = useState(false);
  return (
    <>
      <Form getCustomerDetails={getCustomerDetails}
        countryList={countryList}
        validateAddress={validateAddress}
        OrderSummaryApi={OrderSummaryApi}
        GetCustomerAddress={GetCustomerAddress}
        shippingAddress={shippingAddress}
        onShippingAddressChange={onShippingAddressChange}
        setSubmitAddress={setSubmitAddress}
        submitAddress={submitAddress}
        setGuestBillingAddress={setGuestBillingAddress}
        guestBillingAddress={guestBillingAddress}
        openTab={openTab}
        summaryData={summaryData}
        setOpenModelSocial={setOpenModelSocial}
        AddGuestBillingShippingAddress={AddGuestBillingShippingAddress}
      />
      <LoginForgotCheckout />
    </>
  );
}

export default GuestBillingAddress;


const Form = ({
  getCustomerDetails,
  countryList,
  validateAddress,
  OrderSummaryApi,
  GetCustomerAddress,
  shippingAddress,
  onShippingAddressChange,
  setSubmitAddress,
  submitAddress,
  setGuestBillingAddress,
  guestBillingAddress,
  openTab,
  setOpenModelSocial,
  AddGuestBillingShippingAddress,
  summaryData }) => {

  const {
    updateCartItems,
    guestKey,
    customerDetails,
    cartCount,
    isLoggedUser,
    guestQuoteId,
    postalDataValue
  } = useSelector((state) => {
    return {
      updateCartItems: state?.updateCartItems,
      guestKey: state?.guestKey,
      customerDetails: state?.customerDetails,
      cartCount: state?.cartItems?.[0]?.totals_detail?.items?.length,
      isLoggedUser: state?.isLoggedUser,
      guestQuoteId: state?.guestQuoteDetails?.id,
      postalDataValue:state?.postalDataValue,

    };
  });
  const { baseURL, defaultURL, storeId } = useContext(DomainContext);
  const [resMessage, setResMessage] = useState("");
  const [getBusinessType, setGetBusinessType] = useState("1");
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [customData, setCustomData] = useState(0);
  const [disabledError, setDisableError] = useState("")
  const [postalCodeData, setPostalCodeData] = useState({});
  const [postalCodeParams, setPostalCodeParams] = useState({
    postcode: "1078 GA sf",
    houseNumber: "266",
    houseNumberAddition: ""
  });
  const company = customerDetails?.custom_attributes?.filter((item) => item?.attribute_code === "customer_company");
  const phoneNumber = customerDetails?.custom_attributes?.filter((item) => item?.attribute_code === "phone_number");
  const defaultCountryLength = countryList?.filter((i) => i?.is_default === true);
  const dispatch = useDispatch();
  const {
    data,
    setData,
    errors,
    setErrors,
    success,
    setSuccess,
    changeHandler,
    submitHandler,
    keyDownHandler,
    onBlur,
    hasError,
  } = useForm({
    validations: {

      mobileNumber: {
        required: {
          value: true,
          message: "This field is required.",
        },
        min: {
          value: 10,
          message: "The number must consist of at least 10 characters.",
        },
        max: {
          value: 15,
          message: "The number must contain a maximum of 15 digits",
        }
      },
      city: {
        required: {
          value: true,
          message: "This field is required.",
        },
      },
      address: {
        required: {
          value: true,
          message: "This field is required.",
        },
      },
      houseNumber: {
        required: {
          value: true,
          message: "This field is required.",
        },
      },
      postalCode: {
        required: {
          value: true,
          message: "This field is required.",
        },
      },
      lastName: {
        required: {
          value: true,
          message: "This field is required.",
        },
      },
      firstName: {
        required: {
          value: true,
          message: "This field is required.",
        },
      },
    
      password: {
        required: {
          value: customData?.code == 200 ? true : false,
          message: "This field is required.",
        }
      },
      email: {
        required: {
          value: true,
          message: "This field is required.",
        },
        emailPattern: {
          value: "dummy value",
          message: "Please enter a valid email address.",
        },
      },
      
      Vat: {
        required: {
          value: false,
          message: "This field is required.",
        },
        min: {
          value: 8,
          message: "Vul een geldig BTW-nummer in.",

        },

    },
      

    },
    initialValues: {
      business: "1",
    },
  });
  useEffect(() => {
    if (isLoggedUser) {
      setData({
        ...data,
        firstName: customerDetails?.firstname,
        lastName: customerDetails?.lastname,
        email: customerDetails?.email,
        business: null,
        companyName:null,
        mobileNumber: phoneNumber?.length ? phoneNumber?.[0]?.value : '',
      });
    }
  }, [isLoggedUser, customerDetails]);

  useEffect(() => {
  const hasNonEmptyErrors = Object.values(errors).filter((error) => error !== "");
    if (submitAddress?.action == "single") {
      submitHandler(submitAddress.e)
    }
    if (submitAddress && submitAddress.action !== "" && !postalDataValue ) {
      if (submitAddress.action?.includes("single")) {
        if (submitAddress.action === "single") {
          submitHandler(submitAddress.e);
          setSubmitAddress({ ...submitAddress, action: "singleSubmitHandler" });
        }
       else if (submitAddress.action === "singleSubmitHandler") {
          if ( Object.values(errors)?.length) {
            setSubmitAddress(null);
          } else {
            setSubmitAddress({ ...submitAddress, action: "next" });
          }
        }
      } else if (submitAddress.action?.includes("double")) {
        submitHandler(submitAddress.e);
        setSubmitAddress({ ...submitAddress, action: "doubleSubmitHandler" });
        if (submitAddress.action === "doubleSubmitHandler") {
          if ( Object.values(errors)?.length) {
            setSubmitAddress(null);
          } else {
            setSubmitAddress({ ...submitAddress, action: "nextForm" });
          }
        }
      }
    }
  }, [submitAddress]);

  const handleChange = () => {
    const addAddres = {
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          setCustomData(resData?.data[0]);
          getCustomerDetails(resData?.data[0])
        }
      },
      axiosData: {
        url: `${baseURL}/customer/verification`,
        paramsData: {
          storeId: storeId,
          email: data?.email,
        },
      },
    };
    APIQueryPost(addAddres);
  };
console.log(errors,"errors")
  useEffect(() => {
    if (openTab == "billing" && guestBillingAddress?.addressList?.firstName && guestBillingAddress?.country) {
      setData(guestBillingAddress?.addressList)
      setSelectedCountry(guestBillingAddress?.country)
    }
  }, [openTab])
  useEffect(() => {
    const datas = {
      addressList: data,
      country: selectedCountry,
      shippingAddress: shippingAddress,
    };
    setGuestBillingAddress(datas);
  }, [
    data,
    selectedCountry,
    shippingAddress,
    setGuestBillingAddress,
    validateAddress
  ]);

  const clearValues = () => {
    setData({
      email: "",
      password: ""
    });
  }

  const getCustomerQuoteId = (token, data) => {
    const quoteIdOptions = {
      isLoader: true,
      loaderAction: (bool) => {
      },
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          dispatch(ACTION_CUSTOMER__QUOTE__ID(resData?.data));
          dispatch(ACTION_CUSTOMER__TOKEN(token));
          dispatch(ACTION_ISLOGGEDUSER(true));
          clearValues();
          if (cartCount) {
            GetCustomerAddress(data?.id, token)
            const cb = (customerid, quoteid) => {
              OrderSummaryApi(customerid, quoteid)
            }
            mergeCart(dispatch, updateCartItems, token, data?.id, guestKey, baseURL, storeId, guestQuoteId, defaultURL, cb);
          }
        }
      },
      getStatus: (res) => {
        if (res?.status !== 200) {
          setResMessage(res?.message);
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

  const getUserDetails = (token) => {
    const userDetailsOptions = {

      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          getCustomerQuoteId(token, resData?.data);
          dispatch(ACTION_CUSTOMER__DETAILS(resData?.data));
          dispatch(ACTION_GUESTKEY(""));
          dispatch(ACTION_GUESTQUOTE__DETAILS({}));
        }
      },
      getStatus: (res) => {
        if (res?.status !== 200) {
          setResMessage(res?.message);
        }
      },
      axiosData: {
        url: `${defaultURL}/customers/me`,
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    }
    APIQueryGet(userDetailsOptions);
  }

  const loginSubmitHandler = () => {
    const loginOptions = {

      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          getUserDetails(resData?.data);
        }
      },
      getStatus: (res) => {
        if (res?.status !== 200) {
          setResMessage(res?.message);
        }
      },
      axiosData: {
        url: `${baseURL}/integration/customer/token`,
        method: "post",
        paramsData: {
          username: data?.email,
          password: data?.password,
          flag: 0
        }
      }
    }
    APIQueryPost(loginOptions);
  }

  useEffect(() => {
    if (resMessage || disabledError) {
      setTimeout(() => {
        setResMessage("");
        setDisableError("")
      }, 10000);
    }
  }, [resMessage, disabledError]);
 

  return <form onSubmit={submitHandler}>
    <div className="">
      {customData?.code == 200 ? (
        <div className="xxl-flex">
          <div className="xxl-flex-1">
            <Input
              name="email"
              placeHolder=""
              lable="Email address *"
              value={data?.email}
              onChange={changeHandler}
              errorMessage={
                errors?.email === guestBillingAddress?.addressList?.email
                  ? ""
                  : errors?.email
              }
              icon={
                success?.email === "true" ? (
                  <ValidSuccesArrow />
                ) : success?.email === "false" ? (
                  <ValidErrorArrow />
                ) : null
              }
              onBlur={() => {
                onBlur("email");
                if (
                  !customerDetails ||
                  Object.keys(customerDetails).length === 0
                ) {
                  handleChange();
                }
              }}
              showIcon={true}
              labelClassName="fs-15"
            />
            <Input
              name="password"
              type={data?.showPassword === "true" ? "text" : "password"}
              placeHolder="Wachtwoord"
              lable="Wachtwoord"
              errorClassName="error fs-12 pt-1 tr w-1/1"
              value={guestBillingAddress?.addressList?.password}
              onChange={changeHandler}
              labelClassName="fs-15"
              onBlur={() => onBlur("password")}
              errorMessage={
                errors?.password ===
                  guestBillingAddress?.addressList?.password
                  ? ""
                  : errors?.password
              }
              icon={
                success?.password === "true" ? (
                  <ValidSuccesArrow />
                ) : success?.password === "false" ? (
                  <ValidErrorArrow />
                ) : null
              }
              showIcon={true}
            />
            <p className="fs-15 pb-6">
              U heeft al een account bij ons, log in met uw gegevens.
            </p>
            {resMessage && (
              <div className="res__message py-4 error">{resMessage}</div>
            )}
            <div className="flex space-between middle pb-6 w-1/1">
              <div>
                <Button
                  className="fs-15 line-8 fw-700 r-8  px-5 login "
                  type="submit"
                  onClick={() => {
                    if (errors?.email && errors?.password) {
                      console.log(errors);
                    } else {
                      loginSubmitHandler();
                    }
                  }}
                >
                  Login
                  <span className="flex middle fw-700">
                    <KeyboardArrowRightIcon />
                  </span>
                </Button>
              </div>
              <div>
                <Link
                  to=""
                  aria-label={"Wachtwoord vergeten"}
                  className="forgot__password fs-15 text-underline tr"
                  onClick={() => handleForgotQuote(dispatch)}

                >
                  Wachtwoord vergeten?
                </Link>
              </div>
            </div>
          </div>
          <div className="xxl-flex-1"></div>
        </div>
      ) : (
        <>
          <div className="lg-flex lg-gap-6">
            <div className="lg-flex-1">
              {isLoggedUser ? "" :
                <Input
                  name="email"
                  placeHolder=""
                  lable="Email address *"
                  value={data?.email}
                  onChange={changeHandler}
                  errorMessage={
                    errors?.email === guestBillingAddress?.addressList?.email
                      ? ""
                      : errors?.email
                  }
                  icon={
                    success?.email === "true" ? (
                      <ValidSuccesArrow />
                    ) : success?.email === "false" ? (
                      <ValidErrorArrow />
                    ) : null
                  }
                  onBlur={() => {
                    onBlur("email");
                    if (
                      !customerDetails ||
                      Object.keys(customerDetails).length === 0
                    ) {
                      handleChange();
                    }
                  }}
                  showIcon={true}
                  labelClassName="fs-15"
                />
              }

              <h3 className="fw-700 fs-20 pb-6">Billing address</h3>
             

            
            </div>
            <div className="lg-flex-1"></div>
          </div>
          <div className="lg-flex lg-gap-6">
            <div className="lg-flex-1">
              <Input
                name="firstName"
                placeHolder=""
                lable="First name *"
                labelClassName="fs-15"
                value={data?.firstName}
                onChange={changeHandler}
                onKeyDown={keyDownHandler}
                onBlur={() => onBlur("firstName")}
                errorMessage={
                  errors?.firstName === data?.firstName
                    ? ""
                    : errors?.firstName
                }
                icon={
                  success?.firstName === "true" ? (
                    <ValidSuccesArrow />
                  ) : success?.firstName === "false" ? (
                    <ValidErrorArrow />
                  ) : null
                }
                showIcon={true}
              />
            </div>
            <div className="lg-flex-1">
              <Input
                name="lastName"
                placeHolder=""
                labelClassName="fs-15"
                lable="Surname*"
                value={data?.lastName}
                onChange={changeHandler}
                onKeyDown={keyDownHandler}
                onBlur={() => onBlur("lastName")}
                errorMessage={
                  errors?.lastName === data?.lastName
                    ? ""
                    : errors?.lastName
                }
                icon={
                  success?.lastName === "true" ? (
                    <ValidSuccesArrow />
                  ) : success?.lastName === "false" ? (
                    <ValidErrorArrow />
                  ) : null
                }
                showIcon={true}
              />
            </div>
          </div>
          <div className="lg-flex lg-gap-6">
         
            <div className="lg-flex-1"></div>
          </div>
          <div className="lg-flex lg-gap-6">
            <div className="lg-flex-1">
              <Input
                name="postalCode"
                lable="Postcode *"
                labelClassName="fs-15"
                placeHolder=""
                value={data?.postalCode}
                onChange={(e)=>{
                  changeHandler(e);

                }
                 
                }
                onKeyDown={keyDownHandler}
                onBlur={() => {
                  onBlur("postalCode");
                }
              }
                errorClassName="error fs-12 pt-1 tr w-1/1"
                errorMessage={
                  data?.postalCode && postalCodeData?.code === 400 ? postalCodeData?.message : errors?.postalCode !== data?.postalCode ? errors?.postalCode : ''
                }
                icon={
                  data?.postalCode && postalCodeData?.code === 200 ? (
                    <ValidSuccesArrow />
                  ) : success?.postalCode === "false" || postalCodeData?.code === 400 ? (
                    <ValidErrorArrow />
                  ) : null
                }
                showIcon={true}
              />
            </div>

            <div className="lg-flex-1">
              <div className="flex gap-4">

                <Input
                  name="houseNumber"
                  labelClassName="fs-15"
                  placeHolder=""
                  lable="House number *"
                  value={data?.houseNumber}
                  onChange={changeHandler}
                  onKeyDown={keyDownHandler}
                  onBlur={() => onBlur("houseNumber")}
                  errorMessage={
                    errors?.houseNumber === data?.houseNumber
                      ? ""
                      : errors?.houseNumber
                  }
                  icon={
                    success?.houseNumber === "true" ? (
                      <ValidSuccesArrow />
                    ) : success?.houseNumber === "false" ? (
                      <ValidErrorArrow />
                    ) : null
                  }
                  showIcon={true}
                />
               
              </div>
            </div>
          </div>
          <div className="lg-flex lg-gap-6">
            <div className="lg-flex-1">
              <Input
                placeHolder=""
                name="address"
                labelClassName="fs-15"
                lable="Street name*"
                value={data?.address}
                onChange={changeHandler}
                onKeyDown={keyDownHandler}
                onBlur={() => onBlur("address")}
                errorMessage={
                  errors?.address === data?.address ? "" : errors?.address
                }
                icon={
                  success?.address === "true" ? (
                    <ValidSuccesArrow />
                  ) : success?.address === "false" ? (
                    <ValidErrorArrow />
                  ) : null
                }
                showIcon={true}
              />
            </div>
            <div className="lg-flex-1">
              <Input
                name="city"
                lable="City*"
                placeHolder=""
                labelClassName="fs-15"
                value={data?.city}
                onChange={changeHandler}
                onKeyDown={keyDownHandler}
                onBlur={() => onBlur("city")}
                errorMessage={
                  errors?.city === data?.city ? "" : errors?.city
                }
                icon={
                  success?.city === "true" ? (
                    <ValidSuccesArrow />
                  ) : success?.city === "false" ? (
                    <ValidErrorArrow />
                  ) : null
                }
                showIcon={true}
              />
            </div>
          </div>
          <div className="lg-flex lg-gap-6">
            <div className="lg-flex-1">
              <Input
                iconClass="top-11"
                name="mobileNumber"
                placeHolder=""
                labelClassName="fs-15 "
                lable="Phone number*"
                value={data?.mobileNumber}
                onChange={changeHandler}
                onKeyDown={(e) => {
                  if (!((e.key >= '0' && e.key <= '9') || e.key === '+' || e.key === '-' || e.key === ' ' || e.key === 'Backspace' || e.key === 'Delete' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Tab' || e.ctrlKey)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(event) => {
                  const clipboardData = event.clipboardData || window.clipboardData;
                  const pastedText = clipboardData.getData('text');
                  const filteredText = pastedText.replace(/\D/g, '');
                  setTimeout(() => {
                    setData({
                      ...data,
                      "mobileNumber": filteredText?.trimLeft(),
                    });
                  }, 50);
                }}
                onBlur={() => onBlur("mobileNumber")}
                errorMessage={
                  errors?.mobileNumber === data?.mobileNumber ? "" : errors?.mobileNumber
                }
                icon={
                  success?.mobileNumber === "true" ? (
                    <ValidSuccesArrow />
                  ) : success?.mobileNumber === "false" ? (
                    <ValidErrorArrow />
                  ) : null
                }
                showIcon={true}
              />
            </div>
            <div className="lg-flex-1">
              
            </div>
          </div>

          <div className="lg-flex lg-gap-6">
          
            <div className="lg-flex-1"></div>
          </div>
          <div className="shipping__checkbox pt-4">
            <Input
              type="checkbox"
              name="newsLetter"
              lable="The shipping address is the same as the billing address"
              fieldClassName="checkbox flex gap-3 row pb-5 row-i right middle"
              value="newsLetter"
              onChange={() => onShippingAddressChange(!shippingAddress)}
              checked={shippingAddress ? true : false}
            />
          </div>
        </>
      )}
      <div className="lg-flex-1"></div>
    </div>
  </form>

}