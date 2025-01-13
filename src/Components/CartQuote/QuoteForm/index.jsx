import React, { useState, useEffect, useContext } from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import Input from "Components/Common/Form/Input";
import Button from "Components/Common/Button";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import useForm from "Components/Hooks/useForm";
import { mergeCart, handleForgotQuote, SessionExpiredLogout } from "Utilities";
import { useNavigate, Link } from "react-router-dom";
import { APIQueryPost, APIQueryGet } from "APIMethods/API";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  ACTION_CUSTOMER__DETAILS,
  ACTION_CUSTOMER__QUOTE__ID,
  ACTION_CUSTOMER__TOKEN,
  ACTION_ISLOGGEDUSER,

} from "Store/action";
import { ValidSuccesArrow, ValidErrorArrow } from "Res/icons/index";
import { ISLOGGEDUSER } from "Store/action-type";
import CircularProgress from '@mui/material/CircularProgress';

function QuoteForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    cartCount,
    updateCartItems,
    guestKey,
    guestQuoteId,
    customerQuoteId,
    customerDetails,
    isSessionExpired,
    isLoggedUser,
    customerId,
    cartDetails
  } = useSelector((state) => {
    return {
      cartCount: state?.cartItems?.[0]?.totals_detail?.items?.length,
      updateCartItems: state?.updateCartItems,
      guestKey: state?.guestKey,
      guestQuoteId: state?.guestQuoteDetails?.id,
      customerQuoteId: state?.customerQuoteId,
      customerDetails: state?.customerDetails,
      isSessionExpired: state?.isSessionExpired,
      isLoggedUser: state?.isLoggedUser,
      cartDetails: state?.cartItems?.[0],
      customerId: state?.customerDetails?.id,
    };
  });
  const [resMessage, setResMessage] = useState("");
  const [getBusinessType, setGetBusinessType] = useState("1");
  const [customData, setCustomData] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState("");
  const { baseURL, defaultURL, storeId } = useContext(DomainContext);
  const company = customerDetails?.custom_attributes?.filter((item) => item?.attribute_code === "customer_company");
  const phoneNumber = customerDetails?.custom_attributes?.filter((item) => item?.attribute_code === "phone_number");

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
      lastName: {
        required: {
          value: true,
          message: "dit veld is verplicht.",
        },
      },
      firstName: {
        required: {
          value: true,
          message: "dit veld is verplicht.",
        },
      },
      companyName: {
        required: {
          value: getBusinessType === "1" ? true : false,
          message: "dit veld is verplicht.",
        },
      },
      password: {
        required: {
          value: customData?.code == 200 ? true : false,
          message: "dit veld is verplicht.",
        }
       
      },
      email: {
        required: {
          value: true,
          message: "dit veld is verplicht.",
        },
        emailPattern: {
          value: "dummy value",
          message: "Vul alstublieft een geldig e-mailadres in.",
        },
      },
    },
    initialValues: {
      business: "1",
    },
    onSubmit: () => submitQuote(),
  });

  useEffect(() => {
    if (data?.business === "0") {
      setData({
        ...data,
        companyName: "",
      });
      setErrors({
        ...errors,
        companyName: "",
      });
      setSuccess({
        ...errors,
        companyName: "",
      });
    }
    setGetBusinessType(data?.business);
  }, [data?.business]);
  useEffect(() => {
    if (isLoggedUser) {
      setData({
        ...data,
        firstName: customerDetails?.firstname,
        lastName: customerDetails?.lastname,
        email: customerDetails?.email,
        business: company?.length ? '1' : '0',
        companyName: company?.length ? company?.[0]?.value : '',
        mobileNumber: phoneNumber?.length ? phoneNumber?.[0]?.value : '',
      });
    }
  }, [isLoggedUser,customerDetails]);
  useEffect(() => {
    if (resMessage) {
      setTimeout(() => {
        setResMessage("");
      }, 10000);
    }
  }, [resMessage]);
  const handleChange = (e) => {
    if (data?.email) {
      const payload = {
        storeId: storeId,
        email: data?.email,
      };
      axios
        .post(baseURL + "/customer/verification", payload)
        .then((response) => {
          setCustomData(response.data[0]);
        });
    }
  };
  const submitQuote = async () => {
    const quoteSubmit = {
      isLoader: true,
      loaderAction: (bool) => setLoading(bool),
      setGetResponseData: (resData) => {
        if (resData?.data[0]?.code !== 400) {
          setLoading(false);
          const quoteData1 = resData?.data
          setErrorMessage("")
          navigate("/offerteaanvraag/succes", { state: quoteData1 });
        }
        else if (resData?.data[0]?.code == 400) {
          setErrorMessage(resData?.data[0]?.message)
        }
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);

      },
      axiosData: {
        url: `${defaultURL}/quote/request`,
        method: "post",
        paramsData: {
          data: {
            storeId: storeId,
            quoteId: customerQuoteId ? customerQuoteId : guestQuoteId,
            firstname: customerDetails?.firstName
              ? customerDetails?.firstname
              : data?.firstName,
            lastname: customerDetails?.lastName
              ? customerDetails?.lastName
              : data?.lastName,
            email: customerDetails?.email
              ? customerDetails?.email
              : data?.email,
            customer_id: customerId ? customerId : "",
            phone_no: data?.mobileNumber,
            company_name:data?.companyName?data?.companyName:company?.length ? company?.[0]?.value:"",
            quote_shipping_cost:cartDetails?.totals_detail?.postageCosts?.replace(',', '.')
          },
        },
      },
    };
    await APIQueryPost(quoteSubmit);
  };
  const getCustomerQuoteId = (token, id) => {
    const quoteIdOptions = {
      isLoader: true,
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          setCustomData(0);
          dispatch(ACTION_CUSTOMER__QUOTE__ID(resData?.data));
          if (cartCount) {
            mergeCart(dispatch, updateCartItems, token, id, guestKey, storeId, storeId, guestQuoteId, defaultURL, () => { }, navigate, isSessionExpired);
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
          getCustomerQuoteId(token, resData?.data?.id);
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
  const loginSubmitHandler = () => {
    const loginOptions = {
      isLoader: true,
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          if (customerDetails?.email) {
            if (customerDetails?.custom_attributes[1]?.value || customerDetails?.custom_attributes[0]?.value == "0") {

            }
          }
          getUserDetails(resData?.data);
          dispatch(ACTION_CUSTOMER__TOKEN(resData?.data));
          dispatch(ACTION_ISLOGGEDUSER(true));
          setErrors({})
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
          flag: 0,
        },
      },
    };
    APIQueryPost(loginOptions);
  };
  return (
    <>
      <div className="form pt-4 xl-pt-0">
        <h3 className="fw-700 fs-18 pb-4">Mijn gegevens</h3>
        <form onSubmit={submitHandler} noValidate className="quote__form">
          <React.Fragment>
            <Input
              name="email"
              placeHolder="E-mailadres"
              lable="E-mailadres"
              value={
                data?.email
              }
              onChange={(e) => {
                changeHandler(e);
              }}
              errorMessage={errors?.email === data?.email ? "" : errors?.email}
              icon={
                success?.email === "true" ? (
                  <ValidSuccesArrow />
                ) : success?.email === "false" ? (
                  <ValidErrorArrow />
                ) : null
              }
              onBlur={() => {
                onBlur("email");
                handleChange();
              }}
              showIcon={true}
              labelClassName="fs-15"
            />
            {customData?.code == 200 && !isLoggedUser? (
              <>
                <Input
                  name="password"
                  type={data?.showPassword === "true" ? "text" : "password"}
                  placeHolder="Wachtwoord"
                  lable="Wachtwoord"
                  value={data?.password}
                  onChange={changeHandler}
                  labelClassName="fs-15"
                  onBlur={() => onBlur("password")}
                  errorMessage={
                    errors?.password === data?.password ? "" : errors?.password
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
                {resMessage && (
                  <div className="res__message py-4 error">{resMessage}</div>
                )}
                <div className="flex space-between middle pt-5">
                  <div>
                    <Button
                      className="fs-15 line-8 fw-700 r-8  px-5 login__button "
                      type="submit"
                      onClick={() => {
                        if (!errors?.email && !errors?.password) {
                          loginSubmitHandler()
                        }
                      }}
                    >
                      Login
                    </Button>
                  </div>
                  <div>
                    <Link
                      to=""
                      aria-label={"Wachtwoord vergeten"}
                      className="forgot__password fs-15 text-underline"
                      onClick={() => handleForgotQuote(dispatch)}
                    >
                      Wachtwoord vergeten?
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>

                <div className="choose__business flex row gap-x-10 pt-2">

                  <Input
                    type="radio"
                    name="business"
                    lable="Zakelijk"
                    value="1"
                    fieldClassName="radio flex gap-3 row pb-5 row-i right middle"
                    labelClassName="fs-14 line-1"
                    onChange={changeHandler}
                    checked={data?.business === "1" ? true : false}
                  />
                  <Input
                    type="radio"
                    name="business"
                    lable="Particulier"
                    value="0"
                    fieldClassName="radio flex gap-3 row pb-5 row-i right middle"
                    labelClassName="fs-14 line-1"
                    onChange={changeHandler}
                    checked={data?.business === "0" ? true : false}
                  />
                </div>
                {data?.business === "1" ? (
                  <Input
                    name="companyName"
                    placeHolder="Bedrijfsnaam"
                    lable="Bedrijfsnaam"
                    labelClassName="fs-15"
                    value={data?.companyName}
                    onBlur={() => onBlur("companyName")}
                    onChange={changeHandler}
                    errorMessage={
                      errors?.companyName === data?.companyName
                        ? ""
                        : errors?.companyName
                    }
                    icon={
                      success?.companyName === "true" ? (
                        <ValidSuccesArrow />
                      ) : success?.companyName === "false" ? (
                        <ValidErrorArrow />
                      ) : null
                    }
                    showIcon={true}
                  />
                ) : (
                  <></>
                )}
                <Input
                  name="firstName"
                  placeHolder="Voornaam"
                  lable="Voornaam"
                  labelClassName="fs-15"
                  value={
                    data?.firstName
                     
                  }
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
                <Input
                  name="lastName"
                  labelClassName="fs-15"
                  placeHolder="Achternaam"
                  lable="Achternaam"
                  value={
                    data?.lastName
                      
                  }
                  onChange={changeHandler}
                  onKeyDown={keyDownHandler}
                  onBlur={() => onBlur("lastName")}
                  errorMessage={
                    errors?.lastName === data?.lastName ? "" : errors?.lastName
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
                <Input
                  name="mobileNumber"
                  placeHolder="Telefoonnummer"
                  labelClassName="fs-15 "
                  lable="Telefoonnummer"
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
                <p className="error fs-15"> {errorMessage}</p>

                <div className="button__info pt-4">
                  <Button
                    className="fs-15 line-8 fw-700 r-8  px-5 cart__button"
                    fullWidth
                    type="submit"
                  >

                    {loading ?
                      <CircularProgress size={24} thickness={4} color="error" />
                      : <>
                        Offerte aanvragen
                        <span className="flex middle">
                          <KeyboardArrowRightIcon />
                        </span>
                      </>
                    }

                  </Button>
                </div>
              </>
            )}
          </React.Fragment>
        </form>
      </div>
    </>
  );
}

export default QuoteForm;
