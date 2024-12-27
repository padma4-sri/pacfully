import React, { useEffect, useState, useContext, memo } from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import CloseButton from "Components/CloseButton/index";
import ModelNew from "Components/Model/ModelNew";
import Input from "Components/Common/Form/Input";
import Button from "Components/Common/Button";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import useForm from "Components/Hooks/useForm";
import { ValidSuccesArrow, ValidErrorArrow } from "Res/icons/index";
import { SessionExpiredLogout, formOptions } from "Utilities";
import { useDispatch, useSelector } from "react-redux";
import { APIQueryPost } from 'APIMethods/API';
import { useLocation, useNavigate } from "react-router-dom";

const AddressForm = ({ openModel, setOpenModel, title, updateAddressList, setUpdateAddressList, editAddress, getAddressList }) => {

  return (
    <ModelNew
      from="right"
      hideScroll={false}
      zindex={11}
      open={openModel}
      shadow={true}
      setOpen={setOpenModel}
      className="account__address__sidebar"
    >
      <div className="add__address w-1/1 h-1/1 flex col w-1/1 h-1/1 overflow-hidden">
        <div className="close__block tr flex right w-1/1 absolute pt-4 pr-8">
          <CloseButton onClickFunction={() => setOpenModel(false)} />
        </div>
        <div className="heading pt-12 px-4 sm-px-6 pb-4">
          <h1 className="fw-700 fs-30">{title}</h1>
        </div>
        <div className="flex-1 overflow-y-auto add__address__form px-4 sm-px-6 py-4">
          <Form openModel={openModel} setOpenModel={setOpenModel} title={title} updateAddressList={updateAddressList} setUpdateAddressList={setUpdateAddressList} editAddress={editAddress} getAddressList={getAddressList} />
        </div>
      </div>
    </ModelNew>
  );
};

export default memo(AddressForm);


const Form = ({ openModel, setOpenModel, title, updateAddressList, setUpdateAddressList, editAddress, getAddressList }) => {
  const { baseURL, defaultURL } = useContext(DomainContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProcessign, setIsProcessing] = useState(false);
  const customerDetails = useSelector((state) => state?.customerDetails);
  const company = customerDetails?.custom_attributes?.filter((item) => item?.attribute_code === "customer_company");
  const isSessionExpired = useSelector((state) => state?.isSessionExpired);
  const location = useLocation();
  const token = useSelector((state) => state?.token);
  const [resMessage, setResMessage] = useState("");
  const [getBusinessType, setGetBusinessType] = useState("1");
  const [selectedCountry, setSelectedCountry] = useState("NL");
  const [postalCodeData, setPostalCodeData] = useState({});
  const [postalCodeParams, setPostalCodeParams] = useState({
    postcode: "",
    houseNumber: "",
    houseNumberAddition: ""
  });
  const { data, setData, errors, setErrors, changeHandler, submitHandler, onBlur, success, setSuccess } = useForm({
    validations: {
      vatnumber: formOptions.vatNumber(selectedCountry, getBusinessType).required,
      number: formOptions.number,
      city: formOptions.requiredField,
      street: formOptions.requiredField,
      housenumber: formOptions.requiredField,
      zipcode: formOptions.requiredField,
      lastName: formOptions.requiredField,
      firstName: formOptions.requiredField,
      companyName: formOptions.companyName(getBusinessType)
    },
    initialValues: {
      business: '1'
    },
    onSubmit: () => addressHandler()
  });

  const countriesList = useSelector(state => state?.countriesList);
  const customerId = useSelector((state) => state?.customerDetails?.id);
  const defaultCountryLength = countriesList?.filter((i) => i?.is_default === true);

  const addressHandler = () => {
    const options = {
      isLoader: true,
      loaderAction: (bool) => setIsProcessing(bool),
      setGetResponseData: (resData) => {
        if (resData?.status === 200 && resData?.data?.[0]?.code === 200) {
          setOpenModel(false);
          setUpdateAddressList(!updateAddressList);
          window.scrollTo(0, 0);
        }
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
        if (res?.status !== 200) {
          setResMessage(res?.message);
        }
      },
      axiosData: {
        url: `${baseURL}/customer/saveaddress`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        paramsData: {
          customerId: customerId,
          addressId: title === "Nieuw adres" ? 0 : editAddress?.address_id,
          address: {
            first_name: data?.firstName ? data?.firstName : '',
            last_name: data?.lastName ? data?.lastName : '',
            street1: data?.housenumber ? data?.housenumber : '',
            street2: data?.street ? data?.street : '',
            company: data?.companyName ? data?.companyName : '',
            city: data?.city ? data?.city : '',
            state: '',
            mobile_number: data?.number ? data?.number : '',
            reference_number: ((data?.business !== "0") && (data?.referenceNumber !== undefined) && (data?.business === "1" || selectedCountry !== "NL")) ? data?.referenceNumber : '',
            vat_id: (data?.business !== "0" && (data?.business === "1" && selectedCountry !== "NL")) ? data?.vatnumber : '',
            additional_details: data?.addition,
            postcode: data?.zipcode ? data?.zipcode : '',
            country_id: selectedCountry,
            make_default_billing: (location.state?.isNewAddress && !getAddressList?.[0]?.allAddress?.length) ? 1 : location.state?.isBilling ? data?.defaultBilling ? data?.defaultBilling : 0 : 0,
            make_default_shipping: (location.state?.isNewAddress && !getAddressList?.[0]?.allAddress?.length) ? 1 : !location.state?.isBilling ? data?.defaultBilling ? data?.defaultBilling : 0 : 0
          }
        }
      }
    }
    if (postalCodeData?.code === 200) {
      APIQueryPost(options);
    }
  }

  const postCodeValidation = () => {
    const options = {
      isLoader: true,
      loaderAction: (bool) => setIsProcessing(bool),
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

  // remove company data
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
    if (openModel && title !== "Nieuw adres") {
      setData({
        business: editAddress?.company ? '1' : '0',
        companyName: (editAddress?.company && editAddress?.company !== undefined) ? editAddress?.company : '',
        firstName: editAddress?.firstname,
        lastName: editAddress?.lastname,
        zipcode: editAddress?.postcode,
        housenumber: editAddress?.street1,
        addition: (editAddress?.addition && editAddress?.addition !== undefined) ? editAddress?.addition : '',
        street: editAddress?.street2,
        city: editAddress?.city,
        number: editAddress?.mobile_number,
        vatnumber: (editAddress?.vat_id && editAddress?.vat_id !== undefined) ? editAddress?.vat_id : '',
        referenceNumber: (editAddress?.reference_number && editAddress?.reference_number !== undefined) ? editAddress?.reference_number : '',
        addition: (editAddress?.additional_details && editAddress?.additional_details !== undefined) ? editAddress?.additional_details : '',
        defaultBilling: location.state?.isNewAddress ? "0" : location?.state?.isBilling ? editAddress?.default_billing.toString() : editAddress?.default_shipping.toString()
      });
      setSelectedCountry(editAddress?.country_id);
    } else if (openModel) {
      setData({
        business: company?.length ? '1' : '0',
       });
      setPostalCodeData({});
    } else {
      setData({ business: '1' });
      setSelectedCountry("NL");
    }
  }, [openModel]);

  // postal code api
  useEffect(() => {
    setPostalCodeParams({
      postcode: data?.zipcode,
      countryId: selectedCountry
    })
  }, [data?.zipcode, selectedCountry]);

  useEffect(() => {
    if ((postalCodeParams?.countryId && postalCodeParams?.postcode) && openModel) {
      postCodeValidation();
    }
  }, [postalCodeParams?.countryId, openModel]);

  return <form className='flex col gap-2 pb-9' onSubmit={submitHandler} noValidate>
    <div className="choose__business flex row gap-x-10">
      <Input
        type="radio"
        name="business"
        lable="Zakelijk"
        value="1"
        fieldClassName="radio flex gap-3 row pb-5 row-i right middle"
        labelClassName="fs-15 fw-700 line-6"
        onChange={changeHandler}
        checked={data?.business === "1" ? true : false}
      />
      <Input
        type="radio"
        name="business"
        lable="Particulier"
        value="0"
        fieldClassName="radio flex gap-3 row pb-5 row-i right middle"
        labelClassName="fs-15 fw-700  line-6"
        onChange={changeHandler}
        checked={data?.business === "0" ? true : false}
      />
    </div>
    {
      data?.business === "1" ?
        <Input
          iconClass="top-11"
          name="companyName"
          lable="Bedrijfsnaam *"
          labelClassName="fs-15 fw-700 line-6"
          value={data?.companyName}
          onChange={changeHandler}
          onBlur={() => onBlur("companyName")}
          errorMessage={
            errors?.companyName === data?.companyName ? "" : errors?.companyName
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
        : <></>
    }
    <Input
      iconClass="top-11"
      name="firstName"
      lable="Voornaam *"
      labelClassName="fs-15 fw-700 line-6"
      value={data?.firstName}
      onChange={changeHandler}
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
      iconClass="top-11"
      name="lastName"
      labelClassName="fs-15 fw-700 line-6"
      lable="Achternaam *"
      value={data?.lastName}
      onChange={changeHandler}
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

    {/* country */}
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
          {countriesList?.length
            ? countriesList.map((country, index) => (
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
      iconClass="top-11"
      name="zipcode"
      lable="Postcode *"
      labelClassName="fs-15 fw-700 line-6"
      errorClassName="error fs-12 pt-1 tr w-1/1"
      value={data?.zipcode}
      onChange={(e)=>{
        changeHandler(e);

      }
       
      }
      onBlur={() => {
        onBlur("zipcode");
        postCodeValidation();
      }
    }
      errorMessage={
        data?.zipcode && postalCodeData?.code === 400 ? postalCodeData?.message : errors?.zipcode !== data?.zipcode ? errors?.zipcode : ''
      }
      icon={
        data?.zipcode && postalCodeData?.code === 200 ? (
          <ValidSuccesArrow />
        ) : success?.zipcode === "false" || postalCodeData?.code === 400 ? (
          <ValidErrorArrow />
        ) : null
      }
      showIcon={true}
    />
    <div className="flex gap-4">
      <Input
        iconClass="top-11"
        name="housenumber"
        labelClassName="fs-15 fw-700 line-6"
        errorClassName="error fs-12 pt-1 tr w-1/1"
        lable="Huisnummer *"
        value={data?.housenumber}
        onChange={changeHandler}
        onBlur={() => onBlur("housenumber")}
        errorMessage={
          errors?.housenumber === data?.housenumber ? "" : errors?.housenumber
        }
        icon={
          success?.housenumber === "true" ? (
            <ValidSuccesArrow />
          ) : success?.housenumber === "false" ? (
            <ValidErrorArrow />
          ) : null
        }

        showIcon={true}
      />
      <Input
        iconClass="top-11"
        name="addition"
        lable="Toevoeging"
        labelClassName="fs-15 fw-700 line-6"
        value={data?.addition}
        onChange={changeHandler}
        onBlur={() => onBlur("addition")}
        errorMessage={
          errors?.addition === data?.addition ? "" : errors?.addition
        }
        icon={
          success?.addition === "true" ? (
            <ValidSuccesArrow />
          ) : success?.addition === "false" ? (
            <ValidErrorArrow />
          ) : null
        }
        showIcon={true}
      />
    </div>
    <Input
      iconClass="top-11"
      name="street"
      labelClassName="fs-15 fw-700 line-6"
      lable="Straatnaam *"
      value={data?.street}
      onChange={changeHandler}
      onBlur={() => onBlur("street")}
      errorMessage={
        errors?.street === data?.street ? "" : errors?.street
      }
      icon={
        success?.street === "true" ? (
          <ValidSuccesArrow />
        ) : success?.street === "false" ? (
          <ValidErrorArrow />
        ) : null
      }
      showIcon={true}
    />
    <Input
      iconClass="top-11"
      name="city"
      lable="Stad *"
      labelClassName="fs-15 fw-700 line-6"
      value={data?.city}
      onChange={changeHandler}
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

    <Input
      iconClass="top-11"
      name="number"
      labelClassName="fs-15 fw-700 line-6"
      lable="Telefoonnummer *"
      value={data?.number}
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
            "number": filteredText?.trimLeft(),
          });
        }, 50);
      }}
      onBlur={() => onBlur("number")}
      errorMessage={
        errors?.number === data?.number ? "" : errors?.number
      }
      icon={
        success?.number === "true" ? (
          <ValidSuccesArrow />
        ) : success?.number === "false" ? (
          <ValidErrorArrow />
        ) : null
      }
      showIcon={true}
    />
    
    {
      data?.business !== "0" && (data?.business === "1" && selectedCountry !== "NL") ?
        <Input
          iconClass="top-11"
          name="vatnumber"
          labelClassName="fs-15 fw-700 line-6"
          lable="BTW Nummer"
          value={data?.vatnumber}
          onChange={changeHandler}
          onBlur={() => onBlur("vatnumber")}
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
          errorMessage={
            errors?.vatnumber === data?.vatnumber ? "" : errors?.vatnumber
          }
          icon={
            success?.vatnumber === "true" ? (
              <ValidSuccesArrow />
            ) : success?.vatnumber === "false" ? (
              <ValidErrorArrow />
            ) : null
          }
          showIcon={true}
        />
        : <></>
    }
    {
      getAddressList?.[0]?.allAddress?.length ?
            <Input
              type="checkbox"
              name="defaultBilling"
              labelClassName="fs-15 line-6"
              lable={location?.state?.isBilling ? "Gebruik als standaard factuuradres" : "Gebruik als standaard leveradres"}
              fieldClassName="checkbox flex gap-3 row pb-0 row-i middle right"
              value="1"
              checked={data?.defaultBilling === "1" ? true : false}
              onChange={changeHandler}
            />
        : <></>
    }
    <div className="flex  gap-8 pt-7">
      <Button
        className={`fs-15 line-8 fw-700 r-8  px-5 save__button ${isProcessign ? 'rotateUpdate' : ''}`}
        fullWidth
        type="submit"
      >
        {isProcessign ? <AutorenewIcon /> : "Opslaan"}
        {!isProcessign ? <span className="flex middle">
          <KeyboardArrowRightIcon />
        </span> : ""}
      </Button>
      <Button
        variant="outlined"
        className="flex-1 r-6 px-2 py-2 fs-14 pointer fw-300"
        onClick={(e) => {
          e.preventDefault();
          setOpenModel(false);
        }}
      >Annuleren</Button>
    </div>
    {resMessage && (
      <div className="res__message pt-5 error">{resMessage}</div>
    )}
  </form>
}
