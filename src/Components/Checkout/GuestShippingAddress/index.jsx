import React, { useEffect, useState, useContext } from "react";
import Input from "Components/Common/Form/Input";
import { useSelector } from "react-redux";
import useForm from "Components/Hooks/useForm";
import { ValidSuccesArrow, ValidErrorArrow } from "Res/icons/index";
import { APIQueryPost } from "APIMethods/API";
import DomainContext from "Context/DomainContext";
import {ACTION_POSTAL_DATA_VALUE} from "Store/action";
import { useDispatch } from "react-redux";

function GuestShippingAddress({
  guestShippingAddress,
  countryList,
  submitAddress,
  setSubmitAddress,
  openTab,
  setGuestShippingAddress,
  summaryData,
  AddGuestBillingShippingAddress
}) {
  return (
    <>
      <Form setGuestShippingAddress={setGuestShippingAddress}
        guestShippingAddress={guestShippingAddress}
        countryList={countryList}
        submitAddress={submitAddress}
        setSubmitAddress={setSubmitAddress}
        openTab={openTab}
        summaryData={summaryData}
        AddGuestBillingShippingAddress={AddGuestBillingShippingAddress}
      />
    </>

  );
}

export default GuestShippingAddress;

const Form = ({
  guestShippingAddress,
  countryList,
  submitAddress,
  setSubmitAddress,
  openTab,
  setGuestShippingAddress,
  AddGuestBillingShippingAddress,
  summaryData }) => {
  const { customerDetails, isLoggedUser, cartDetails } = useSelector((state) => {
    return {
      cartDetails: state?.cartItems?.[0],
      isLoggedUser: state?.isLoggedUser,
      customerDetails: state?.customerDetails,
    };
  });
  const { defaultURL } = useContext(DomainContext);
  const [getBusinessType, setGetBusinessType] = useState("1");
  const [selectedCountry, setSelectedCountry] = useState("IN");
  const [disabledError, setDisableError] = useState("");
  const [postalCodeData, setPostalCodeData] = useState({});
  const [postalCodeParams, setPostalCodeParams] = useState({
    postcode: "1078 GA sf",
    houseNumbers: "266",
    houseNumberAddition: ""
  });
  const dispatch = useDispatch();
  const company = customerDetails?.custom_attributes?.filter((item) => item?.attribute_code === "customer_company");
  const phoneNumbers = customerDetails?.custom_attributes?.filter((item) => item?.attribute_code === "phone_number");
  const defaultCountryLength = countryList?.filter((i) => i?.is_default === true);

  useEffect(() => {
  const hasNonEmptyErrors = Object.values(errors).filter((error) => error !== "");

    if (submitAddress?.action == "double") {
      submitHandler(submitAddress.e)
    }
    if (submitAddress  && submitAddress.action?.includes("nextForm")) {
      submitHandler(submitAddress.e);
      setSubmitAddress({ ...submitAddress, action: "nextFormSubmitHandler" });
      if (submitAddress.action?.includes("nextFormSubmitHandler")) {
        if (hasNonEmptyErrors?.length) {
          setSubmitAddress(null);
        } else {
          setSubmitAddress({ ...submitAddress, action: "next" });
        }
      }
    }
  }, [submitAddress]);
  useEffect(() => {
    if (disabledError) {
      setTimeout(() => {
        setDisableError("")
      }, 5000);
    }
  }, [disabledError]);
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

      phoneNumber: {
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
      Stad: {
        required: {
          value: true,
          message: "This field is required.",
        },
      },
      Straatnaam: {
        required: {
          value: true,
          message: "This field is required.",
        },
      },
      houseNumbers: {
        required: {
          value: true,
          message: "This field is required.",
        },
      },
      postcode: {
        required: {
          value: true,
          message: "This field is required.",
        },
      },
      lastname: {
        required: {
          value: true,
          message: "This field is required.",
        },
      },
      firstname: {
        required: {
          value: true,
          message: "This field is required.",
        },
      },
      companyname: {
        required: {
          value: getBusinessType === "1" ? true : false,
          message: "This field is required.",
        },
      },
      vat: {
        required: {
          value:  false,
          message: "This field is required.",
        },
        min: {
          value: 8,
          message: "Vul een geldig BTW-nummer in.",

        },
      }
    },
    initialValues: {
      business: "1",
    },
  });

  
   useEffect(() => {
    if (data?.business === "0") {
      setData({
        ...data,
        companyname: "",
      });
      setErrors({
        ...errors,
        companyname: "",
      });
      setSuccess({
        ...errors,
        companyname: "",
      });
    }
    setGetBusinessType(data?.business);
  }, [data?.business, customerDetails]);

  useEffect(() => {
    if (isLoggedUser) {
      setData({
        ...data,
        firstname: customerDetails?.firstname,
        lastname: customerDetails?.lastname,
        email: customerDetails?.email,
        business: company?.length ? '1' : '0',
        companyname: company?.length ? company?.[0]?.value : '',
        phoneNumber: phoneNumbers?.length ? phoneNumbers?.[0]?.value : '',
      });
    }
  }, [isLoggedUser, customerDetails]);
  useEffect(() => {
    const datas = {
      addressList: data,
      country: selectedCountry,
    };
    setGuestShippingAddress(datas);
  }, [data, selectedCountry, setGuestShippingAddress]);
  useEffect(() => {
    if (openTab == "billing" && guestShippingAddress?.addressList && guestShippingAddress?.country) {
      setData(guestShippingAddress?.addressList)
      setSelectedCountry(guestShippingAddress?.country)
    }
  }, [openTab])
  return <form className="pt-4" onSubmit={submitHandler}>
    <div className="lg-flex ">
      <div className="lg-flex-1">
        <h3 className="fw-700 fs-20 pb-6">Delivery address</h3>
       
       
      </div>
      <div className="lg-flex-1"></div>
    </div>
    <div className="lg-flex lg-gap-6">
      <div className="lg-flex-1">
        <Input
          name="firstname"
          placeHolder=""
          lable="First name *"
          labelClassName="fs-15"
          value={data?.firstname}
          onChange={changeHandler}
          onKeyDown={keyDownHandler}
          onBlur={() => onBlur("firstname")}
          errorMessage={
            errors?.firstname === data?.firstname
              ? ""
              : errors?.firstname
          }
          icon={
            success?.firstname === "true" ? (
              <ValidSuccesArrow />
            ) : success?.firstname === "false" ? (
              <ValidErrorArrow />
            ) : null
          }
          showIcon={true}
        />
      </div>
      <div className="lg-flex-1">
        <Input
          name="lastname"
          placeHolder=""
          labelClassName="fs-15"
          lable="Surname*"
          value={data?.lastname}
          onChange={changeHandler}
          onKeyDown={keyDownHandler}
          onBlur={() => onBlur("lastname")}
          errorMessage={
            errors?.lastname === data?.lastname
              ? ""
              : errors?.lastname
          }
          icon={
            success?.lastname === "true" ? (
              <ValidSuccesArrow />
            ) : success?.lastname === "false" ? (
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
          name="postcode"
          lable="Postcode *"
          labelClassName="fs-15"
          placeHolder=""
          value={data?.postcode}
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
            data?.postcode && postalCodeData?.code === 400 ? postalCodeData?.message : errors?.postcode !== data?.postcode ? errors?.postcode : ''
          }
          icon={
            data?.postcode && postalCodeData?.code === 200 ? (
              <ValidSuccesArrow />
            ) : success?.postcode === "false" || postalCodeData?.code === 400 ? (
              <ValidErrorArrow />
            ) : null
          }
          showIcon={true}
        />
      </div>

      <div className="lg-flex-1">
        <div className="flex gap-4">
          <Input
            name="houseNumbers"
            labelClassName="fs-15"
            placeHolder=""
            lable="House number *"
            value={data?.houseNumbers}
            onChange={changeHandler}
            onKeyDown={keyDownHandler}
            onBlur={() => onBlur("houseNumbers")}
            errorMessage={
              errors?.houseNumbers === data?.houseNumbers
                ? ""
                : errors?.houseNumbers
            }
            icon={
              success?.houseNumbers === "true" ? (
                <ValidSuccesArrow />
              ) : success?.houseNumbers === "false" ? (
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
          name="Straatnaam"
          labelClassName="fs-15"
          lable="Street name*"
          value={data?.Straatnaam}
          onChange={changeHandler}
          onKeyDown={keyDownHandler}
          onBlur={() => onBlur("Straatnaam")}
          errorMessage={
            errors?.lastname === data?.Straatnaam ? "" : errors?.Straatnaam
          }
          icon={
            success?.Straatnaam === "true" ? (
              <ValidSuccesArrow />
            ) : success?.Straatnaam === "false" ? (
              <ValidErrorArrow />
            ) : null
          }
          showIcon={true}
        />
      </div>
      <div className="lg-flex-1">
        <Input
          name="Stad"
          lable="City*"
          placeHolder=""
          labelClassName="fs-15"
          value={data?.Stad}
          onChange={changeHandler}
          onKeyDown={keyDownHandler}
          onBlur={() => onBlur("Stad")}
          errorMessage={
            errors?.Stad === data?.Stad ? "" : errors?.Stad
          }
          icon={
            success?.Stad === "true" ? (
              <ValidSuccesArrow />
            ) : success?.Stad === "false" ? (
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
          name="phoneNumber"
          placeHolder=""
          labelClassName="fs-15 "
          lable="Phone number*"
          value={data?.phoneNumber}
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
                "phoneNumber": filteredText?.trimLeft(),
              });
            }, 50);
          }}
          onBlur={() => onBlur("phoneNumber")}
          errorMessage={
            errors?.phoneNumber === data?.phoneNumber ? "" : errors?.phoneNumber
          }
          icon={
            success?.phoneNumber === "true" ? (
              <ValidSuccesArrow />
            ) : success?.phoneNumber === "false" ? (
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

  </form>

}