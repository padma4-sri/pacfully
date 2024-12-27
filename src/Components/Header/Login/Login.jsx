import React, { useEffect, useState, useContext, memo } from 'react';
import DomainContext from "Context/DomainContext";
import Input from 'Components/Common/Form/Input';
import Button from 'Components/Common/Button';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useForm from 'Components/Hooks/useForm';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_CUSTOMER__DETAILS, ACTION_CUSTOMER__QUOTE__ID, ACTION_CUSTOMER__TOKEN, ACTION_GUESTKEY, ACTION_GUESTQUOTE__DETAILS, ACTION_ISLOGGEDUSER } from 'Store/action';
import { mergeCart, handleForgot, closeLoginForgot, formOptions } from 'Utilities';
import { APIQueryPost, APIQueryGet } from 'APIMethods/API';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { ValidSuccesArrow, ValidErrorArrow } from "Res/icons/index";

const Login = ({ resMessage, setResMessage, getUrlType, wilistProductId }) => {
    const { baseURL, defaultURL, storeId } = useContext(DomainContext);
    const cartCount = useSelector((state) => state?.cartItems?.[0]?.totals_detail?.items?.length);
    const updateCartItems = useSelector((state) => state?.updateCartItems);
    const guestKey = useSelector((state) => state?.guestKey);
    const guestQuoteId = useSelector((state) => state?.guestQuoteDetails?.id);
    const isSessionExpired = useSelector((state) => state?.isSessionExpired);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isProcessign,setIsProcessign] = useState(false);

    const { data, setData, errors, setErrors, changeHandler, submitHandler, onBlur, success, setSuccess } = useForm({
        validations: {
            password: formOptions.requiredField,
            email: formOptions.email
        },
        initialValues: {
            email: "",
            password: ""
        },
        onSubmit: () => loginSubmitHandler()
    });

    const clearValues = () => {
        setData({
            email: "",
            password: ""
        });
        if((!getUrlType)){
            navigate("/mijn-account/mijn-overzicht");
        }
        
        closeLoginForgot(dispatch);
    }

    const getCustomerQuoteId = (token, data) => {
        const quoteIdOptions = {
            isLoader: true,
            loaderAction: (bool) => {
                if(bool) setIsProcessign(bool);
            },
            setGetResponseData: (resData) => {
                if (resData?.status === 200) {
                    if (!cartCount || cartCount === undefined) {
                        dispatch(ACTION_GUESTKEY(""));
                        dispatch(ACTION_GUESTQUOTE__DETAILS({}));
                    }
                    dispatch(ACTION_CUSTOMER__DETAILS(data));
                    dispatch(ACTION_CUSTOMER__QUOTE__ID(resData?.data));
                    dispatch(ACTION_CUSTOMER__TOKEN(token));
                    dispatch(ACTION_ISLOGGEDUSER(true));
                    clearValues();
                    if (cartCount) {
                        mergeCart(dispatch, updateCartItems, token, data?.id, guestKey, baseURL, storeId,guestQuoteId, defaultURL,  () => { },navigate, isSessionExpired);
                    }
                }
            },
            getStatus: (res) => {
                if (res?.status !== 200) {
                    setResMessage(res?.message);
                    setIsProcessign(false); 
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
            isLoader: true,
            loaderAction: (bool) => {
                if(bool) setIsProcessign(bool);
            },
            setGetResponseData: (resData) => {
                if (resData?.status === 200) {
                    getCustomerQuoteId(token, resData?.data);
                }
            },
            getStatus: (res) => {
                if (res?.status !== 200) {
                    setResMessage(res?.message);
                    setIsProcessign(false); 
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
            isLoader: true,
            loaderAction: (bool) => {
                if(bool) setIsProcessign(bool);
            },
            setGetResponseData: (resData) => {
                if (resData?.status === 200) {
                    getUserDetails(resData?.data);
                }
            },
            getStatus: (res) => {
                if (res?.status !== 200) {
                    setResMessage(res?.message);
                    setIsProcessign(false); 
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
        return () => {
            setErrors({});
            setSuccess({});
        }
    }, []);

    return (
        <div className="login__wrapper__container">
            <div className="sidebar__heading pb-5">
                <h1 className="fw-700 mb-2 fs-20">Inloggen</h1>
                <p className="line-6 fs-14">Heeft u al een account bij {storeId === 1 ? "Promofit" : "Expofit"}? Log dan hier in:</p>
            </div>
            <div className="login__wrapper">
                <div className="form__wrapper">
                    <form className='flex col gap-2 pb-9' onSubmit={submitHandler} noValidate>
                        <Input
                            name="email"
                            value={data?.email}
                            placeHolder="Vul uw e-mailadres in"
                            lable="E-mail *"
                            iconClass="top-11"
                            labelClassName="fs-15 fw-700 line-6"
                            onChange={changeHandler}
                            onBlur={() => onBlur("email")}
                            icon={
                                success?.email === "true" ? (
                                    <ValidSuccesArrow />
                                ) : success?.email === "false" ? (
                                    <ValidErrorArrow />
                                ) : null
                            }
                            showIcon={true}
                            errorMessage={errors?.email === data?.email ? "" : errors?.email}
                        />
                        <Input
                            name="password"
                            value={data?.password}
                            placeHolder="Wachtwoord"
                            lable="Wachtwoord *"
                            type="password"
                            iconClass="top-11"
                            labelClassName="fs-15 fw-700 line-6"
                            onChange={changeHandler}
                            errorClassName = "error fs-12 pt-1 tr w-1/1"
                            errorMessage={errors?.password === data?.password ? "" : errors?.password}
                            onBlur={() => onBlur("password")}
                            icon={
                                success?.password === "true" ? (
                                    <ValidSuccesArrow />
                                ) : success?.password === "false" ? (
                                    <ValidErrorArrow />
                                ) : null
                            }
                            showIcon={true}
                        />
                        <div className="forgotpassword fs-14 pb-5">
                            <p className='text-underline pointer' onClick={() => handleForgot(dispatch)}>Wachtwoord vergeten?</p>
                        </div>
                        <div className="action__block">
                            <Button
                                fullWidth={true}
                                className={`r-6 px-2 py-3 pointer fw-700 ${isProcessign ? 'rotateUpdate' : ''}`}
                            >{isProcessign ? <AutorenewIcon /> : "Inloggen"}</Button>
                        </div>
                        {resMessage && <div className="res__message pt-5 error">{resMessage}</div>}
                    </form>
                </div>
                <div className="account__block  pt-6 flex col gap-3">
                    <h1 className="title line-9 fs-20 fw-700">Nieuw bij {storeId === 1 ? "Promofit" : "Expofit"}?</h1>
                    <p className="line-6 fs-14">Een account aanmaken is niet nodig om te kunnen bestellen, maar is wel handig</p>
                    <p className="action">
                        <Link to="/maak-account-aan" aria-label={"maak-account-aan"}onClick={() => closeLoginForgot(dispatch)} className='line-5 fs-14 fw-700 left flex middle pointer'>Maak account aan <ChevronRightIcon /></Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default memo(Login);