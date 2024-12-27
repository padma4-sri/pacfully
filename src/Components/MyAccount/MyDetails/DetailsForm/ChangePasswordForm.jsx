import React, { useEffect, useState, useContext, memo } from 'react';
import DomainContext from "Context/DomainContext";
import ModelNew from 'Components/Model/ModelNew';
import "./styles.scss";
import CloseButton from 'Components/CloseButton';
import Input from 'Components/Common/Form/Input';
import Button from 'Components/Common/Button';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { PageTitle } from 'Components/MyAccount/Common';
import { useDispatch, useSelector } from 'react-redux';
import useForm from "Components/Hooks/useForm";
import { ValidSuccesArrow, ValidErrorArrow } from "Res/icons/index";
import { SessionExpiredLogout } from "Utilities";
import { APIQueryPost } from 'APIMethods/API';
import { useNavigate } from 'react-router-dom';
import { formOptions } from "Utilities";

const ChangePasswordForm = ({ openModel, setOpenModel, customerDetails }) => {

    return (
        <ModelNew
            from="right"
            hideScroll={false}
            zindex={11}
            open={openModel}
            shadow={true}
            setOpen={setOpenModel}
            className="mydetails__sidebar"
        >
            <div className="details__edit__form w-1/1 h-1/1 px-4 sm-px-9 py-4 overflow-hidden overflow-y-auto">
                <div className="close__block tr flex right w-1/1">
                    <CloseButton onClickFunction={() => setOpenModel(false)} />
                </div>
                <div className="wrapper__container">
                    <PageTitle className='fs-30 line-13 fw-700 pb-3'>Wachtwoord <br /> wijzigen</PageTitle>
                    <div className="edit__wrapper pt-1">
                        <Form customerDetails={customerDetails} openModel={openModel} setOpenModel={setOpenModel} />
                    </div>
                </div>
            </div>
        </ModelNew>
    )
}

export default memo(ChangePasswordForm);

const Form = ({ customerDetails, openModel, setOpenModel }) => {
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
        onBlur
    } = useForm({
        validations: {
            confirmpassword: {
                customChange: {
                    isValid: (value) => (data?.newpassword?.length >= 8) && (value !== data?.newpassword),
                    message: formOptions.confirmMessage,
                }
            },
            newpassword: formOptions.password,
            currentpassword: formOptions.password.required,
        },
        initialValues: {
            currentpassword: '',
            newpassword: '',
            confirmpassword: ''
        },
        onSubmit: () => updateHandler()
    });

    const updateHandler = () => {
        setResMessage("");
        const mobile = customerDetails?.custom_attributes?.filter((item) => item?.attribute_code === "phone_number");
        const options = {
            isLoader: true,
            loaderAction: (bool) => setIsProcessing(bool),
            setGetResponseData: (resData) => {
                if (resData?.data?.[0]?.code === 200) {
                    setOpenModel(false);
                   
                } else {
                    setResMessage(resData?.data?.[0]?.message);
                }
            },
            getStatus: (res) => {
                SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
            },
            axiosData: {
                url: `${baseURL}/customer/updatedetails`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                paramsData: {
                    data: {
                        customerId: customerDetails?.id,
                        firstname: customerDetails?.firstname,
                        lastname: customerDetails?.lastname,
                        current_password: data?.currentpassword,
                        new_password: data?.newpassword,
                        confirm_password: data?.confirmpassword,
                        is_company: customerDetails?.custom_attributes?.[0]?.value,
                        company_name: customerDetails?.addresses?.[0]?.company ? customerDetails?.addresses?.[0]?.company : '',
                        mobile_number: mobile?.length ? mobile?.[0]?.value : ''
                    }

                },
            },
        };
        APIQueryPost(options);
    };
    const { baseURL } = useContext(DomainContext);
    const navigate = useNavigate();
    const token = useSelector((state) => state?.token);
    const isSessionExpired = useSelector((state) => state?.isSessionExpired);
    const [resMessage, setResMessage] = useState("");
    const [isProcessign, setIsProcessing] = useState(false);
    useEffect(() => {
        setData({
            currentpassword: '',
            newpassword: '',
            confirmpassword: ''
        });
        setErrors({});
        setSuccess({});
    }, [openModel]);
    // remove error message
    // useEffect(() => {
    //     setResMessage("");
    // }, [resMessage]);
    return <form className='flex col gap-2 pb-9' onSubmit={submitHandler} noValidate>
        <Input
            inputId="changePasswordCurrent"
            iconClass="top-11"
            type={data?.showPassword === "true" ? "text" : "password"}
            name="currentpassword"
            lable="Huidig wachtwoord *"
            labelClassName="fs-14 fw-700 line-6"
            fieldClassName="flex gap-1 col pb-5"
            value={data?.currentpassword}
            onChange={changeHandler}
            onKeyDown={keyDownHandler}
            onBlur={() => onBlur("currentpassword")}
            errorMessage={
                errors?.currentpassword === data?.currentpassword ? "" : errors?.currentpassword
            }
            icon={
                success?.currentpassword === "true" ? (
                    <ValidSuccesArrow />
                ) : success?.currentpassword === "false" ? (
                    <ValidErrorArrow />
                ) : null
            }
            showIcon={true}
        />
        <Input
            inputId="changePasswordNew"
            iconClass="top-11"
            type={data?.showPassword === "true" ? "text" : "password"}
            name="newpassword"
            lable="Nieuw wachtwoord *"
            labelClassName="fs-14 fw-700 line-6"
            fieldClassName="flex gap-1 col pb-5"
            value={data?.newpassword}
            onChange={changeHandler}
            onKeyDown={keyDownHandler}
            onBlur={() => onBlur("newpassword")}
            errorMessage={
                errors?.newpassword === data?.newpassword ? "" : errors?.newpassword
            }
            icon={
                success?.newpassword === "true" ? (
                    <ValidSuccesArrow />
                ) : success?.newpassword === "false" ? (
                    <ValidErrorArrow />
                ) : null
            }
            showIcon={true}
        />
        <Input
            inputId="changePasswordConfirm"
            iconClass="top-11"
            type={data?.showPassword === "true" ? "text" : "password"}
            name="confirmpassword"
            lable="Herhaal wachtwoord *"
            labelClassName="fs-14 fw-700 line-6"
            fieldClassName="flex gap-1 col pb-5"
            value={data?.confirmpassword}
            onChange={changeHandler}
            onKeyDown={keyDownHandler}
            onBlur={() => onBlur("confirmpassword")}
            errorMessage={
                errors?.confirmpassword === data?.confirmpassword ? "" : errors?.confirmpassword
            }
            icon={
                success?.confirmpassword === "true" ? (
                    <ValidSuccesArrow />
                ) : success?.confirmpassword === "false" ? (
                    <ValidErrorArrow />
                ) : null
            }
            showIcon={true}
        />
        <Input
            type="checkbox"
            name="showPassword"
            lable="Laat wachtwoord zien"
            fieldClassName="checkbox flex gap-3 row pb-5 row-i right middle"
            value={true}
            checked={data?.showPassword === "true" ? true : false}
            onChange={changeHandler}
        />
        <div className="action__block flex gap-7">
            <Button
                className={`flex-1 r-6 px-2 py-2 fs-14 pointer fw-700 ${isProcessign ? 'rotateUpdate' : ''}`}
            >{isProcessign ? <AutorenewIcon /> : "Opslaan"}</Button>
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