import React, { useEffect, useState, useContext, memo } from 'react';
import DomainContext from "Context/DomainContext";
import Input from 'Components/Common/Form/Input';
import Button from 'Components/Common/Button';
import useForm from 'Components/Hooks/useForm';
import { handleLogin } from 'Utilities';
import { APIQueryPost } from 'APIMethods/API';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { ValidSuccesArrow, ValidErrorArrow } from "Res/icons/index";
import { useDispatch, useSelector } from 'react-redux';
import {closeLoginForgot } from "Utilities";
import { formOptions } from 'Utilities';

const ForgotPassword = ({ setResMessages }) => {
    const { storeId, defaultURL } = useContext(DomainContext);
    const dispatch = useDispatch();
    const [resMessage, setResMessage] = useState("");
    const [isProcessign, setIsProcessing] = useState(false);
    const openForgotPassword = useSelector((state) => state?.openForgotPassword);
    const { data, setData, errors, setErrors, changeHandler, submitHandler, onBlur, success, setSuccess } = useForm({
        validations: { email: formOptions.email },
        initialValues: { email: "" },
        onSubmit: () => forgotHandler()
    });
    const clearValues = () => {
        setData({
            email: "",
            password: ""
        });
        setErrors({});
        setSuccess({});
    }
    const forgotHandler = () => {
        const forgotOptions = {
            isLoader: true,
            loaderAction: (bool) => setIsProcessing(bool),
            setGetResponseData: (resData) => {
                if (resData?.data?.[0]?.code === 200) {
                    setResMessages(resData?.data?.[0]?.message);
                    clearValues();
                    handleLogin(dispatch);
                }
                if (resData?.data?.[0]?.code === 400) {
                    setResMessage(resData?.data?.[0]?.message);
                }
            },
            getStatus: (res) => {
                if (res?.status !== 200) {
                    setResMessage(res?.message);
                }
            },
            axiosData: {
                url: `${defaultURL}/customer/forgotpassword`,
                method: "post",
                paramsData: {
                    websiteId: "1",
                    email: data?.email,
                    storeId: storeId
                }
            }
        }
        APIQueryPost(forgotOptions);
    }
    useEffect(() => {
        setErrors({});
    }, [openForgotPassword])
    
    return (
        <div className="forgot__wrapper__containe">
            <div className="sidebar__heading pb-5">
                <h1 className="fw-700 mb-2 fs-20">Forgot your password?</h1>
                <p className="line-6 fs-14 fw-700">
                Enter your email address below. We will then send you a link so that you can set a new password. This may take a while, also check the spam folder.
                </p>
            </div>
            <div className="forgot__wrapper login__wrapper">
                <div className="form__wrapper">
                    <form className='flex col gap-4 pb-9' onSubmit={submitHandler} noValidate>
                        <Input
                            name="email"
                            value={data?.email}
                            placeHolder="Enter your email address"
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
                        <div className="action__block  flex col gap-3">
                            <Button
                                fullWidth={true}
                                className={`r-6 px-2 py-3 pointer fw-700 ${isProcessign ? 'rotateUpdate' : ''}`}
                            >{isProcessign ? <AutorenewIcon /> : "Reset my password"}</Button>
                            <Button
                                fullWidth={true}
                                className="r-6 px-2 py-3 pointer fw-700"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (openForgotPassword == "quote") {
                                        closeLoginForgot(dispatch)
                                    }
                                    else {
                                        handleLogin(dispatch)
                                    }
                                }
                                }
                            >Back</Button>
                        </div>
                        {resMessage && <div className="res__message pt-3 error">{resMessage}</div>}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default memo(ForgotPassword);