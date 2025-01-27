import React, { useState, useEffect, useContext } from "react";
import "./styles.scss";
import CloseButton from "Components/CloseButton/index";
import Input from "Components/Common/Form/Input";
import Button from "Components/Common/Button";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useDispatch, useSelector } from "react-redux";
import useForm from "Components/Hooks/useForm";
import {
  ACTION_SAVE_ADDRESS,
  ACTION_SAVE_ADDRESS_SHIPPING,
  ACTION__SELECTEDADDRESS_BILLING,
  ACTION__SELECTEDADDRESS_SHIPPING
} from "Store/action";
import { ValidSuccesArrow, ValidErrorArrow } from "Res/icons/index";
import { APIQueryPost } from "APIMethods/API";
import DomainContext from "Context/DomainContext";
const AddAddress = ({
  openModel,
  setOpenModel,
  countryList,
  address,
  editBillingAddress,
  setEditBillingAddress,
  editShippingAddress,
  summaryData,
}) => {
  const {
    customerDetails,
    isLoggedUser,
  } = useSelector((state) => {
    return {
      customerDetails: state?.customerDetails,
      isLoggedUser: state?.isLoggedUser,
    };
  });
  const { defaultURL } = useContext(DomainContext);
  const [selectedCountry, setSelectedCountry] = useState(
    {
      "value": "NL",
      "label": "Nederland",
      "is_region_visible": false,
      "is_default": true
    }
  );
  const [getBusinessType, setGetBusinessType] = useState("1");
  const [postalCodeData, setPostalCodeData] = useState({});
  const [disabledError, setDisableError] = useState("")
  const [postalCodeParams, setPostalCodeParams] = useState({
    postcode: "1078 GA sf",
    houseNumber: "266",
    houseNumberAddition: ""
  });
  const addressShipping = useSelector((state) => state?.addressShipping);
  const addressDefault = useSelector((state) => state?.addressDefault);
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
      companyName: {
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
        vatPattern: {
          value: "dummy value",
          message: "Vul een geldig BTW-nummer in.",
        },
      }
    },
    initialValues: {
      business: "1",
    },
    onSubmit: () => saveAddress(),
  });
  useEffect(() => {
    setPostalCodeParams({
      postcode: data?.postalCode,
      countryId: selectedCountry?.value
    })
  }, [data?.postalCode, selectedCountry]);
  useEffect(() => {
    if ((postalCodeParams?.countryId && postalCodeParams?.postcode)) {
      postCodeValidation();
    }
    if(postalCodeParams?.countryId ==="NL"){
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
    }
   
  }, [postalCodeParams?.countryId]);
  const postCodeValidation = () => {
    const options = {
      isLoader: true,
      loaderAction: (bool) => bool,
      setGetResponseData: (resData) => {
        setPostalCodeData(resData?.data?.[0]);
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



  const saveAddress = () => {
    try {
      if (postalCodeData?.code === 400) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          postalCode: postalCodeData?.message,
        }));
      }
      else{
        const defaultAddress = {
          address_id:"0",
          firstname: data?.firstName,
          lastname: data?.lastName,
          company: data?.business=="1"?data?.companyName:"",
          street1: data?.houseNumber,
          street2: data?.address,
          city: data?.city,
          state: data?.country,
          country_id: selectedCountry?.value,
          mobile_number: data?.mobileNumber,
          postcode: data?.postalCode,
          state_id: 0,
          country_code: selectedCountry?.label,
          address_type: null,
          default_billing: address === "billing" ? 1 : 0,
          default_shipping: address === "shipping" ? 1 : 0,
          vat_id: data?.vat ? data?.vat : "",
          additional_details: data?.addition,
          addedAddress: 0,
        };
        if (address === "billing") {
          dispatch(ACTION_SAVE_ADDRESS(defaultAddress));
          dispatch(ACTION__SELECTEDADDRESS_BILLING(defaultAddress));

        } 
        else if (address === "shipping") {
          dispatch(ACTION_SAVE_ADDRESS_SHIPPING(defaultAddress));
          dispatch(ACTION__SELECTEDADDRESS_SHIPPING(defaultAddress));
        }
      setOpenModel(false);

      }
     
     
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
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
    setErrors({});
    setSuccess({});
    if (editBillingAddress && openModel) {
      setData({
        business: addressDefault?.company ? '1' : '0',
        companyName: (addressDefault?.company && addressDefault?.company !== "") ? addressDefault?.company : '',
        firstName: addressDefault?.firstname,
        lastName: addressDefault?.lastname,
        postalCode: addressDefault?.postcode,
        houseNumber: addressDefault?.street1,
        addition: (addressDefault?.addition && addressDefault?.addition !== undefined) ? addressDefault?.addition : '',
        address: addressDefault?.street2,
        city: addressDefault?.city,
        mobileNumber: addressDefault?.mobile_number,
        vat: (addressDefault?.vat_id && addressDefault?.vat_id !== undefined) ? addressDefault?.vat_id : '',
        addition: (addressDefault?.additional_details && addressDefault?.additional_details !== undefined) ? addressDefault?.additional_details : '',
      });
      setSelectedCountry({
        "value": addressDefault?.country_id,
        "label": addressDefault?.country_code,
        "is_region_visible": false,
        "is_default": true
      })
    }
    else if (editShippingAddress && openModel) {
      setData({
        ...data,
        business: addressShipping?.company ? '1' : '0',
        companyName: (addressShipping?.company && addressShipping?.company !== "") ? addressShipping?.company : '',
        firstName: addressShipping?.firstname,
        lastName: addressShipping?.lastname,
        postalCode: addressShipping?.postcode,
        houseNumber: addressShipping?.street1,
        addition: (addressShipping?.addition && addressShipping?.addition !== undefined) ? addressShipping?.addition : '',
        address: addressShipping?.street2,
        city: addressShipping?.city,
        mobileNumber: addressShipping?.mobile_number,
        vat: (addressShipping?.vat_id && addressShipping?.vat_id !== undefined) ? addressShipping?.vat_id : '',
        addition: (addressShipping?.additional_details && addressShipping?.additional_details !== undefined) ? addressShipping?.additional_details : '',
      });
      setSelectedCountry({
        "value": addressShipping?.country_id,
        "label": addressShipping?.country_code,
        "is_region_visible": false,
        "is_default": true
      })
    }
    else if (isLoggedUser && openModel) {
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
  }, [openModel, isLoggedUser, customerDetails]);

  const addressData = (
    <div className="add__address w-1/1 h-1/1 flex col w-1/1 h-1/1 overflow-hidden">
      <div className="close__block tr flex right w-1/1 absolute pt-4 pr-8">
        <CloseButton onClickFunction={() => setOpenModel(false)} />
      </div>
      <div className="heading pt-12 px-4 sm-px-6 pb-4">
        <h1 className="fw-700 fs-30">
          {address === "billing"
            ? "Nieuw factuuradres"
            : address === "shipping"
              ? "Nieuw Afleveradres"
              : ""}
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto add__address__form px-4 sm-px-6 py-4">
        <form onSubmit={submitHandler} noValidate>
          <div className="choose__business flex row gap-x-10">
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
              // onChange={changeHandler}
              onChange={(e) => {
                if (summaryData?.totals_detail?.isSample === "1") {
                  setDisableError('Alleen bedrijven kunnen samples bestellen.');
                } else {
                  setDisableError('');
                  changeHandler(e)
                }
              }}
              checked={data?.business === "0" ? true : false}
              disabled={summaryData?.totals_detail?.isSample == "1"}

            />
          </div>
          {disabledError &&
                <p className="fs-15 error pb-4">{disabledError}</p>
              }
          {data?.business === "1" ? (
            <Input
              name="companyName"
              placeHolder=""
              lable="Bedrijfsnaam *"
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
            placeHolder=""
            lable="Voornaam *"
            labelClassName="fs-15"
            value={data?.firstName}
            onChange={changeHandler}
            onKeyDown={keyDownHandler}
            onBlur={() => onBlur("firstName")}
            errorMessage={
              errors?.firstName === data?.firstName ? "" : errors?.firstName
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
            placeHolder=""
            labelClassName="fs-15"
            lable="Achternaam *"
            value={data?.lastName}
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
          <div className="input__control relative country__select">
            <div className="field__block relative flex gap-1 col pb-5">
              <label htmlFor="country" className="fs-15 fw-700">
                Land *
              </label>
              <select
                className="form__types w-1/1 px-4 py-2 fs-14 "
                id="country"
                name="country"
                value={selectedCountry ? selectedCountry?.value : "NL"}
                onChange={(e) => {
                  const selectedCountryObject = countryList.find(
                    (country) => country.value === e.target.value
                  );

                  setSelectedCountry(selectedCountryObject);
                }}
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

          <Input
            name="postalCode"
            lable="Postcode *"
            labelClassName="fs-15"
            placeHolder=""
            value={data?.postalCode}
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
          <div className="flex gap-4">
          <Input
                  name="houseNumber"
                  labelClassName="fs-15"
                  placeHolder=""
                  lable="Huisnummer *"
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
            <Input
              name="addition"
              placeHolder=""
              lable="Toevoeging"
              labelClassName="fs-15"
              value={data?.addition}
              onChange={changeHandler}
            />
          </div>
          <Input
            placeHolder=""
            name="address"
            labelClassName="fs-15"
            lable="Straatnaam *"
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
          <Input
            name="city"
            lable="Stad *"
            placeHolder=""
            labelClassName="fs-15"
            value={data?.city}
            onChange={changeHandler}
            onKeyDown={keyDownHandler}
            onBlur={() => onBlur("city")}
            errorMessage={errors?.city === data?.city ? "" : errors?.city}
            icon={
              success?.city === "true" ? (
                <ValidSuccesArrow />
              ) : success?.city === "false" ? (
                <ValidErrorArrow />
              ) : null
            }
            showIcon={true}
          />
          <Input
            name="mobileNumber"
            placeHolder=""
            labelClassName="fs-15"
            lable="Telefoonnummer *"
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
          
          {
          data?.business !== "0" && (data?.business === "1" && selectedCountry?.value !== "NL") ? (
            <Input
              placeHolder=""
              name="vat"
              labelClassName="fs-15"
              lable="BTW Nummer"
              value={data?.vat}
              inputClassName="vat"
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
          <div className="flex  gap-8 pt-4">
            <Button
              className="fs-15 line-8 fw-700 r-8  px-5 save__button"
              fullWidth
              type="submit"
            >
              Opslaan
              <span className="flex middle">
                <KeyboardArrowRightIcon />
              </span>
            </Button>
            <Button
              className="fs-15 line-8  r-8  px-5 cancel__button"
              onClick={(e) => {
                e.preventDefault();
                setOpenModel(false);
              }}
              type="button"
            >
              Annuleren
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
  return addressData;
};

export default AddAddress;
