import React, { useState, useEffect, useContext } from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import { useSelector, useDispatch } from "react-redux";
import Button from "Components/Common/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { APIQueryPost } from "APIMethods/API";
import Input from "Components/Common/Form/Input";
import useForm from "Components/Hooks/useForm";
import { ValidSuccesArrow, ValidErrorArrow } from "Res/icons/index";
import { getCartItems, SessionExpiredLogout } from "Utilities";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';

function ApplyCouponSection() {
  const {
    cartDetails,
    guestQuoteId,
    customerQuoteId,
    customerId,
    isLoggedUser,
    isSessionExpired,
    token
  } = useSelector((state) => {
    return {
      cartDetails: state?.cartItems?.[0],
      guestQuoteId: state?.guestQuoteDetails?.id,
      customerQuoteId: state?.customerQuoteId,
      isLoggedUser: state?.isLoggedUser,
      customerId: state?.customerDetails?.id,
      token: state?.token,
      isSessionExpired: state?.isSessionExpired,
    };
  });
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
      couponInput: {
        required: {
          value: cartDetails?.totals_detail?.couponCode === null,
          message: "This field is required.",
        },
      },
    },

    onSubmit: () => couponHandler(),
  });
  const { baseURL, storeId, defaultURL } = useContext(DomainContext);
  const [coupon, setCoupon] = useState(null);
  const [toggleCoupon, setToggleCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [validCouponCode, setValidCouponCode] = useState(0);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const applyCouponCode = () => {
    const applyCoupon = {
      isLoader: true,
      loaderAction: (bool) => setLoading(bool),
      setGetResponseData: (resData) => {
        setCouponMessage(resData?.data[0]?.message);
        setLoading(false)
        if (resData?.data[0]?.code === 200) {
          setValidCouponCode(1);
        } else {
          setValidCouponCode(2);
        }
         },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);

        if (res?.status == 200) {
          if (isLoggedUser) {
            getCartItems(
              dispatch,
              () => { },
              customerQuoteId,
              customerId,
              () => { }, defaultURL,
              storeId,
              token,navigate, isSessionExpired

            );
          }
          else {
            getCartItems(
              dispatch,
              () => { },
              guestQuoteId,
              "",
              () => { }, defaultURL,
              storeId,
              token,navigate, isSessionExpired

            );
          }
        }
      },
      axiosData: {
        url: `${baseURL}/coupon/apply`,
        paramsData: {
          data: {
            customerId: customerId ? customerId : "",
            quoteId: customerQuoteId ? customerQuoteId : guestQuoteId,
            couponCode: coupon,
            storeId: storeId,
          },
        },
      },
    };

    // API
    APIQueryPost(applyCoupon);
  };

  const deleteCouponCode = () => {
    setCoupon("");
    const deleteCoupon = {
      isLoader: true,
      loaderAction: (bool) => setLoading(bool),
      setGetResponseData: (resData) => {
        setCouponMessage(resData?.data[0]?.message);
        setLoading(false)
        if (resData?.data[0]?.code === 200) {
          setValidCouponCode(1);
        } else if (resData?.data[0]?.code === 400) {
          setValidCouponCode(2);
        } else {
          setValidCouponCode(3);
        }
        if (resData?.status == 200) {
          if (isLoggedUser) {
            getCartItems(
              dispatch,
              () => { },
              customerQuoteId,
              customerId,
              () => { },
              defaultURL,
              storeId,
              token,navigate, isSessionExpired

            );
          }
          else {
            getCartItems(
              dispatch,
              () => { },
              guestQuoteId,
              "",
              () => { }, defaultURL,
              storeId,
              token,navigate, isSessionExpired
    

            );
          }
        }
       },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      },
      axiosData: {
        url: `${baseURL}/coupon/remove`,
        paramsData: {
          data: {
            customerId: customerId ? customerId : "",
            quoteId: customerQuoteId ? customerQuoteId : guestQuoteId,
            couponCode: "",
            storeId: storeId,
          },
        },
      },
    };

    // API
    APIQueryPost(deleteCoupon);
  };
  useEffect(() => {
    setData({
      ...data,
    });
    setErrors({
      ...errors,
    });
    setSuccess({
      ...errors,
    });
  }, []);
  const couponHandler = () => {
    if (cartDetails?.totals_detail?.couponCode === null) {
      applyCouponCode();
    } else {
      deleteCouponCode();
    }
  };
 
  return (
    <div className="flex w-1/1 coupon__section">
      <div className="flex-1 py-6 xl-pt-0">
        <button
          onClick={() => {
            setToggleCoupon(!toggleCoupon);
            setErrors({})
          }}
          className="fs-15 fw-700"
          aria-label="button"
        >
          Kortingscode
          <span className="flex middle">
            {toggleCoupon ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </span>
        </button>
        {toggleCoupon ? (
          <div
            className={`w-1/1 pt-4 ${couponMessage ?
                validCouponCode == 1 &&  cartDetails?.totals_detail?.couponCode
                  ? "success"
                  : validCouponCode == 2
                    ? "fail"
                    : validCouponCode == 3
                      ? "input"
                      : ""
                : ''
              }`}
          >
            <Input
              name="couponInput"
              placeHolder="Vul uw kortingscode in"
              value={
                cartDetails?.totals_detail?.couponCode
                  ? cartDetails?.totals_detail?.couponCode
                  : coupon
              }
              onChange={(e) => {
                setCoupon(e.target.value);
                setCouponMessage("");
                changeHandler(e);
              }}
          disabled={ cartDetails?.totals_detail?.couponCode}

              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  couponHandler();
                 
                }
              }}

              onBlur={() =>{ onBlur("couponInput");
            }
            
            }
              errorMessage={
                errors?.couponInput === data?.couponInput
                  ? ""
                  : errors?.couponInput
              }
              icon={
                couponMessage ?
                  validCouponCode == 1 && cartDetails?.totals_detail?.couponCode ? <ValidSuccesArrow />
                    : validCouponCode == 2
                      ? <ValidErrorArrow />

                      : ""
                  : ''

              }
              showIcon={true}
              className="pb-5"
            />
           
            <p 
            className={`py-2 fs-15 ${validCouponCode==1?"success":""}`}> {couponMessage}</p>

            <Button
              className={`fs-15 line-8 fw-700 r-7  px-5 coupon__button mt-4}`}
              fullWidth
              type="submit"
              onClick={couponHandler}
            >
              {loading ? <CircularProgress size={24} thickness={4} color="error" /> : cartDetails?.totals_detail?.couponCode === null
                ? "toevoegen"
                : "Verwijderen"}

            </Button>

          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default ApplyCouponSection;
