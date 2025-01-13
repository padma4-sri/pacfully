import React, { useState, useEffect, useContext, memo } from "react";
import DomainContext from "Context/DomainContext";
import AuthencationLayout from "Pages/Authencation/AuthencationLayout";
import Button from "Components/Common/Button";
import Input from "Components/Common/Form/Input";
import useForm from "Components/Hooks/useForm";
import { mergeCart, formOptions,SessionExpiredLogout } from "Utilities";
import { useNavigate,useLocation } from "react-router-dom";
import { APIQueryPost,APIQueryGet } from "APIMethods/API";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useDispatch, useSelector } from "react-redux";
import {
  ACTION_CUSTOMER__DETAILS,
  ACTION_CUSTOMER__QUOTE__ID,
  ACTION_CUSTOMER__TOKEN,
  ACTION_ISLOGGEDUSER,
  ACTION_GUESTQUOTE__DETAILS
} from "Store/action";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ValidSuccesArrow, ValidErrorArrow } from "Res/icons/index";
import useScrollToTop from "Components/Hooks/useScrollToTop";
import { useEffectOnce } from "Components/Hooks/useEffectOnce";

const ColumnWrapper = ({
  className = "p-4 sm-px-8 sm-py-4",
  title,
  data = <></>,
}) => (
  <div className={`column__wrapper r-1 mx-auto ${className}`}>
    <h2 className="fs-20 fw-700 pb-6">{title}</h2>
    {data}
  </div>
);

const Registration = () => {
  useScrollToTop();
  const { baseURL, storeId, defaultURL } = useContext(DomainContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let domainUrl = window.location.origin;

  const isLoggedUser = useSelector(state => state?.isLoggedUser);
  const cartCount = useSelector(state => state?.cartItems?.[0]?.totals_detail?.items?.length);
  const updateCartItems = useSelector(state => state?.updateCartItems);
  const guestKey = useSelector(state => state?.guestKey);
  const guestQuoteId = useSelector(state => state?.guestQuoteDetails?.id);
  const isSessionExpired = useSelector((state) => state?.isSessionExpired);
  const [resMessage, setResMessage] = useState("");
  const [getBusinessType, setGetBusinessType] = useState("0");
  const [isProcessign, setIsProcessing] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const customerToken = queryParams.get("token");

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
  } = useForm({
    validations: {
      confirmPassword: {
        customChange: {
          isValid: (value) => (data?.password?.length >= 8) && (value !== data?.password),
          message: formOptions.confirmMessage,
        }
      },
      password: formOptions.password,
      email: formOptions.email,
      companyName: formOptions.companyName(getBusinessType),
      lastName: formOptions.requiredField,
      firstName: formOptions.requiredField
    },
    initialValues: {
      business: "0",
    },
    onSubmit: () => registerHandler(),
  });
  const clearValues = () => {
    setData({
      firstName: "",
      lastName: "",
      newsLetter: "",
      business: "0",
      companyName: "",
      email: "",
      password: "",
      confirmPassword: "",
      showPassword: "",
    });
    navigate("/mijn-account/mijn-overzicht");
  };
  const getCustomerQuoteId = (token, id) => {
    const quoteIdOptions = {
      isLoader: true,
      loaderAction: (bool) => setIsProcessing(bool),
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          dispatch(ACTION_CUSTOMER__QUOTE__ID(resData?.data));
          clearValues();
          if (cartCount) {
            mergeCart(dispatch, updateCartItems, token, id, guestKey, baseURL, storeId, guestQuoteId, defaultURL, () => { }, navigate, isSessionExpired);
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
        },
      },
    };
    APIQueryPost(quoteIdOptions);
  };
  useEffectOnce(()=>{
    if(customerToken){
      getUserDetails(customerToken);
      dispatch(ACTION_CUSTOMER__TOKEN(customerToken));
      dispatch(ACTION_ISLOGGEDUSER(true));
    }
  })
  const loginHandler = (id) => {
    const loginOptions = {
      isLoader: true,
      loaderAction: (bool) => setIsProcessing(bool),
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          getCustomerQuoteId(resData?.data, id);
          dispatch(ACTION_CUSTOMER__TOKEN(resData?.data));
          dispatch(ACTION_ISLOGGEDUSER(true));
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
  const registerHandler = () => {
    const registerOptions = {
      isLoader: true,
      loaderAction: (bool) => setIsProcessing(bool),
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          dispatch(ACTION_CUSTOMER__DETAILS(resData?.data));
          loginHandler(resData?.data?.id);
        }
      },
      getStatus: (res) => {
        if (res?.status === 200) {
        } else {
          setResMessage(res?.message);
        }
      },
      axiosData: {
        url: `${defaultURL}/customers`,
        method: "post",
        paramsData: {
          customer: {
            email: data?.email,
            firstname: data?.firstName,
            lastname: data?.lastName,
            taxvat: 1,
            store_id: storeId,
            extension_attributes: {
              is_subscribed: data?.newsLetter === "newsLetter" ? true : null,
            },
            custom_attributes: [
              {
                attribute_code: "is_company",
                value: data?.business,
              },
              {
                attribute_code: "customer_company",
                value: data?.companyName,
              },
            ],
          },
          password: data?.password,
          flag: 0,
          redirectUrl: domainUrl ,
        },
      },
    };
    APIQueryPost(registerOptions);
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
    if (isLoggedUser) {
    navigate("/mijn-account/mijn-overzicht");
    }
  }, [isLoggedUser])
  const getUserDetails = (token) => {
    const userDetailsOptions = {
      isLoader: true,
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          getCustomerQuoteId(token, resData?.data);
          dispatch(ACTION_CUSTOMER__DETAILS(resData?.data));
          dispatch(ACTION_GUESTQUOTE__DETAILS({}));
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
  const personalInformation = (
    <React.Fragment>
      <Input
        name="firstName"
        placeHolder="Voornaam"
        lable="Voornaam *"
        iconClass="top-11"
        labelClassName="fs-15 fw-700 line-6"
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
        iconClass="top-11"
        labelClassName="fs-15 fw-700 line-6"
        placeHolder="Achternaam"
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
      <Input
        type="checkbox"
        name="newsLetter"
        lable="Aanmelden voor nieuwsbrief"
        fieldClassName="checkbox flex gap-3 row pb-5 row-i right middle"
        value="newsLetter"
        onChange={changeHandler}
        checked={data?.newsLetter === "newsLetter" ? true : false}
      />
      <div className="choose__business flex row gap-x-10">
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
      </div>
      {data?.business === "1" ? (
        <Input
          name="companyName"
          placeHolder="Bedrijfsnaam"
          lable="Bedrijfsnaam *"
          iconClass="top-11"
          labelClassName="fs-15 fw-700 line-6"
          value={data?.companyName}
          onBlur={() => onBlur("companyName")}
          onChange={changeHandler}
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
      ) : (
        <></>
      )}
    </React.Fragment>
  );
  const loginInformation = (
    <React.Fragment>
      <Input
        name="email"
        placeHolder="E-mail adres"
        lable="E-mail adres *"
        value={data?.email}
        onChange={changeHandler}
        errorMessage={errors?.email === data?.email ? "" : errors?.email}
        icon={
          success?.email === "true" ? (
            <ValidSuccesArrow />
          ) : success?.email === "false" ? (
            <ValidErrorArrow />
          ) : null
        }
        onBlur={() => onBlur("email")}
        showIcon={true}
        iconClass="top-11"
        labelClassName="fs-15 fw-700 line-6"
      />
      <div className="password">
        <Input
          name="password"
          type={data?.showPassword === "true" ? "text" : "password"}
          placeHolder="Wachtwoord"
          lable="Wachtwoord *"
          value={data?.password}
          onChange={changeHandler}
          iconClass="top-11"
          labelClassName="fs-15 fw-700 line-6"
          onBlur={() => onBlur("password")}
          errorClassName="error fs-12 pt-1 tr w-1/1"
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
      </div>
      <Input
        type={data?.showPassword === "true" ? "text" : "password"}
        name="confirmPassword"
        lable="Bevestig wachtwoord *"
        placeHolder="Bevestig wachtwoord"
        value={data?.confirmPassword}
        iconClass="top-11"
        labelClassName="fs-15 fw-700 line-6"
        onChange={changeHandler}
        errorClassName="error fs-12 pt-1 tr w-1/1"
        onBlur={() => onBlur("confirmPassword")}
        errorMessage={
          errors?.confirmPassword === data?.confirmPassword
            ? ""
            : errors?.confirmPassword
        }
        icon={
          success?.confirmPassword === "true" ? (
            <ValidSuccesArrow />
          ) : success?.confirmPassword === "false" ? (
            <ValidErrorArrow />
          ) : null
        }
        showIcon={true}
      />
      <Input
        type="checkbox"
        name="showPassword"
        lable="Laat wachtwoord zien"
        fieldClassName="checkbox flex gap-3 row pb-0 row-i right middle"
        value={true}
        checked={data?.showPassword === "true" ? true : false}
        onChange={changeHandler}
      />
      <div className="action__block flex col xl-flex gap-y-3 xl-row col-i gap-x-8 w-1/1  pt-8 xl-pt-6 space-between relative">
          <Button
            fullWidth={true}
            disabled={isProcessign}
            className={`r-6 px-2 py-3 pointer fw-700 ${isProcessign ? 'rotateUpdate' : ''}`}
          >
            {isProcessign ? <AutorenewIcon /> : "Account aanmaken"}
            {!isProcessign && <span className='btn__icon'><ArrowForwardIosIcon /></span>}
          </Button>
      </div>
    </React.Fragment>
  );
  const dataBlock = (
    <div className="auth__wrapper registration__password">
      <div className="form__block xl-pb-10">
        <form onSubmit={submitHandler} noValidate>
          <div className="column__wrapper px-0 md-px-4 md-px-8 r-1">
            <h2 className="fs-26 md-fs-32 fw-700 md-line-12 pb-2">Maak account aan</h2>
          </div>
          <div className="fields__wrapper mx-auto flex col gap-y-4 sm-flex sm-gap-y-0 xl-flex gap-y-3 xl-row gap-x-8">
            <ColumnWrapper
              title="Persoonlijke informatie"
              data={personalInformation}
              heading="creëer een nieuw account"
              className="px-0 md-px-8 pt-0 sm-pt-0"
            />
            <ColumnWrapper
              title="Login informatie"
              data={loginInformation}
              className="px-0 md-px-8 pt-0 sm-pt-0"
            />
          </div>
          {resMessage && (
            <div className="res__message pt-5 error mx-0 md-mx-8">{resMessage}</div>
          )}
        </form>
      </div>
    </div>
  );

  return (
    <React.Fragment>
    
      <AuthencationLayout
        title="Maak een nieuw klantaccount aan"
        data={dataBlock}
        className="register"
      />
    </React.Fragment>
  );
};

export default memo(Registration);
