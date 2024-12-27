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
  const [selectedCountry, setSelectedCountry] = useState("NL");
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
      Stad: {
        required: {
          value: true,
          message: "dit veld is verplicht.",
        },
      },
      Straatnaam: {
        required: {
          value: true,
          message: "dit veld is verplicht.",
        },
      },
      houseNumbers: {
        required: {
          value: true,
          message: "dit veld is verplicht.",
        },
      },
      postcode: {
        required: {
          value: true,
          message: "dit veld is verplicht.",
        },
      },
      lastname: {
        required: {
          value: true,
          message: "dit veld is verplicht.",
        },
      },
      firstname: {
        required: {
          value: true,
          message: "dit veld is verplicht.",
        },
      },
      companyname: {
        required: {
          value: getBusinessType === "1" ? true : false,
          message: "dit veld is verplicht.",
        },
      },
      vat: {
        required: {
          value:  false,
          message: "dit veld is verplicht.",
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
    setPostalCodeParams({
      postcode: data?.postcode,
      countryId: selectedCountry
    })
  }, [data?.postcode, selectedCountry]);
  const postCodeValidation = () => {
    const options = {
      isLoader: true,
      loaderAction: (bool) => bool,
      setGetResponseData: (resData) => {
        setPostalCodeData(resData?.data?.[0]);
        if(resData?.data?.[0]?.code==400){
          dispatch(ACTION_POSTAL_DATA_VALUE(true))
        }
        else if(resData?.data?.[0]?.code==200){
           dispatch(ACTION_POSTAL_DATA_VALUE(false))

        }
      },
      axiosData: {
        url: `${defaultURL}/postcode/verify`,
        paramsData: {
          countryId: postalCodeParams?.countryId ? postalCodeParams?.countryId : '',
          postcode: postalCodeParams?.postcode ? postalCodeParams?.postcode.trim() : ''
        }
      }
    }
    if( postalCodeParams?.postcode ?.length >=1){
      APIQueryPost(options);
    }
  }
  useEffect(() => {
    if ((postalCodeParams?.countryId && postalCodeParams?.postcode)) {
      postCodeValidation();
    }
    if(postalCodeParams?.countryId === "NL" && guestShippingAddress?.addressList?.country === "NL"){
      setData({
        ...data,
        vat: "",
      });
      setErrors({
        ...errors,
        vat: "",
      });
      setSuccess({
        ...errors,
        vat: "",
      });
      AddGuestBillingShippingAddress(summaryData?.shipping_methods?.length && summaryData?.shipping_methods[0])
    }
    else if(postalCodeParams?.countryId && data?.vat && errors?.vat ===""){
      AddGuestBillingShippingAddress(summaryData?.shipping_methods?.length && summaryData?.shipping_methods[0])
    }
  }, [postalCodeParams?.countryId]);
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
        <h3 className="fw-700 fs-20 pb-6">Afleveradres</h3>
        <div className="choose__business flex row gap-x-10">
          <Input
            type="radio"
            name="business"
            lable="Zakelijk"
            value="1"
            fieldClassName="radio flex gap-3 row pb-5 row-i right middle"
            labelClassName="fs-14 line-1"
            onChange={changeHandler}
            checked={
              data?.business === "1"
                ? true
                : false
            }
          />
          <Input
            type="radio"
            name="business"
            lable="Particulier"
            value="0"
            fieldClassName="radio flex gap-3 row pb-5 row-i right middle"
            labelClassName="fs-14 line-1"
            onChange={(e) => {
              if (summaryData?.totals_detail?.isSample === "1") {
                setDisableError('Sample product request is not allowed for Individual users');
              } else {
                setDisableError('');
                changeHandler(e)
              }
            }}
            checked={
              data?.business === "0"
                ? true
                : false
            }
            disabled={summaryData?.totals_detail?.isSample == "1"}

          />
        </div>
        {disabledError &&
          <p className="fs-15 error pb-4">{disabledError}</p>
        }
        {data?.business === "1" ? (
          <Input
            name="companyname"
            placeHolder=""
            lable="Bedrijfsnaam *"
            labelClassName="fs-15"
            value={data?.companyname}
            onBlur={() => onBlur("companyname")}
            onChange={changeHandler}
            errorMessage={
              errors?.companyname ===
                data?.companyname
                ? ""
                : errors?.companyname
            }
            icon={
              success?.companyname === "true" ? (
                <ValidSuccesArrow />
              ) : success?.companyname === "false" ? (
                <ValidErrorArrow />
              ) : null
            }
            showIcon={true}
          />
        ) : (
          <></>
        )}

      </div>
      <div className="lg-flex-1"></div>
    </div>
    <div className="lg-flex lg-gap-6">
      <div className="lg-flex-1">
        <Input
          name="firstname"
          placeHolder=""
          lable="Voornaam *"
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
          lable="Achternaam *"
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
      <div className="lg-flex-1">
        <div className="input__control relative country__select">
          <div className="field__block relative flex gap-1 col pb-5">
            <label htmlFor="country" className="fs-15 fw-700">
              Land *
            </label>
            <select
              className="form__types w-1/1 px-4 py-2 fs-14 "
              id="country"
              name="country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {countryList?.length
                ? countryList?.map((country, index) => (
                  index === defaultCountryLength?.length ?
                    <>
                      <option className="defaultcountyline" key={`line${index}`} disabled>──────────</option>
                      <option key={index} value={country?.value}>
                        {country?.label}
                      </option>
                    </> :
                    <option key={index} value={country?.value}>
                      {country?.label}
                    </option>
                ))
                : ""}
            </select>
          </div>
        </div>
      </div>
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
            postCodeValidation();

          }
           
          }
          onKeyDown={keyDownHandler}
          onBlur={() => {
            onBlur("postalCode");
            postCodeValidation();
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
            lable="Huisnummer *"
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
          <Input
            name="addition"
            placeHolder=""
            lable="Toevoeging"
            labelClassName="fs-15"
            value={data?.addition}
            onChange={changeHandler}
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
          lable="Straatnaam *"
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
          lable="Stad *"
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
          lable="Telefoonnummer *"
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

      <div className="lg-flex-1">
        {data?.business !== "0" &&
          data?.business === "1" &&
          selectedCountry !== "NL" ? (
          <Input
            placeHolder=""
            name="vat"
            inputClassName="vat"
            labelClassName="fs-15"
            lable="BTW Nummer"
            value={data?.vat}
            onChange={changeHandler}
            onKeyDown={(e) => {                   
              if (
                !(
                  /^[a-zA-Z]*$/.test(e.key) ||
                  (e.key >= "0" && e.key <= "9") || 
                  e.key === "Backspace" || 
                  e.key === "Delete" || 
                  e.key === "ArrowLeft" || 
                  e.key === "ArrowRight" 
                )
              ) {
                e.preventDefault(); 
              }
            }}
            onBlur={() => {
              if(data?.vat?.length>=8){
                AddGuestBillingShippingAddress(summaryData?.shipping_methods?.length && summaryData?.shipping_methods[0])
                }
              onBlur("vat")
            }}
            errorMessage={
              errors?.vat === data?.vat ? "" : errors?.vat
            }
            icon={
              success?.vat === "true" ? (
                <ValidSuccesArrow />
              ) : success?.vat === "false" ? (
                <ValidErrorArrow />
              ) : null
            }
            showIcon={true}

          />
        ) : (
          <></>
        )}
      </div>
      <div className="lg-flex-1"></div>
    </div>

  </form>

}