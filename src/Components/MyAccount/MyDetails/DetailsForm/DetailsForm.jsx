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
import useForm from 'Components/Hooks/useForm';
import { ValidSuccesArrow, ValidErrorArrow } from "Res/icons/index";
import { SessionExpiredLogout, telephoneValidate } from "Utilities";
import { APIQueryPost } from 'APIMethods/API';
import { useNavigate } from 'react-router-dom';
import { formOptions } from "Utilities";

const DetailsForm = ({ openModel, setOpenModel, customerDetails, updateCustomer, setUpdateCustomer }) => {

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
                    <PageTitle className='fs-30 line-13 fw-700 pb-3'>Mijn gegevens <br /> wijzigen</PageTitle>
                    <div className="edit__wrapper">
                        <Form customerDetails={customerDetails} updateCustomer={updateCustomer} setUpdateCustomer={setUpdateCustomer} openModel={openModel} setOpenModel={setOpenModel} />
                    </div>
                </div>
            </div>
        </ModelNew>
    )
}

export default memo(DetailsForm);

const Form = ({ customerDetails, updateCustomer, setUpdateCustomer, openModel, setOpenModel }) => {
    const { baseURL } = useContext(DomainContext);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = useSelector((state) => state?.token);
    const isSessionExpired = useSelector((state) => state?.isSessionExpired);
    const [resMessage, setResMessage] = useState("");
    const [isProcessign, setIsProcessing] = useState(false);
    const [getBusinessType, setGetBusinessType] = useState("0");
    const { data, setData, errors, setErrors, changeHandler, submitHandler, onBlur, success, setSuccess } = useForm({
        validations: {
            telephone: formOptions.number,
            lastname: formOptions.requiredField,
            firstname: formOptions.requiredField,
            companyname: formOptions.companyName(getBusinessType),
            email: formOptions.email
        },
        onSubmit: () => updateHandler()
    });

    const updateHandler = () => {
        const options = {
            isLoader: true,
            loaderAction: (bool) => setIsProcessing(bool),
            setGetResponseData: (resData) => {
                if (resData?.data?.[0]?.code === 200) {
                    setOpenModel(false);
                    setUpdateCustomer(!updateCustomer);
                }
            },
            getStatus: (res) => {
                SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
                if (res?.status !== 200) {
                    setResMessage(res?.message);
                }
            },
            axiosData: {
                url: `${baseURL}/customer/updatedetails`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                paramsData: {
                    data: {
                        customerId: customerDetails?.id,
                        firstname: data?.firstname,
                        lastname: data?.lastname,
                        current_password: data?.currentpassword,
                        new_password: data?.newpassword,
                        confirm_password: data?.confirmpassword,
                        is_company: data?.business,
                        company_name: getBusinessType === "1" ? data?.companyname : "",
                        mobile_number: data?.telephone
                    }

                },
            },
        };
        APIQueryPost(options);
    };
    useEffect(() => {
        const company = customerDetails?.custom_attributes?.filter((item) => item?.attribute_code === "customer_company");
        const mobile = customerDetails?.custom_attributes?.filter((item) => item?.attribute_code === "phone_number");
        if (openModel) {
            setData({
                email: customerDetails?.email,
                business: customerDetails?.custom_attributes?.[0]?.value === "1" ? '1' : '0',
                firstname: customerDetails?.firstname,
                lastname: customerDetails?.lastname,
                companyname: company?.length ? company?.[0]?.value : '',
                telephone: mobile?.length ? mobile?.[0]?.value : '',
            })
            setGetBusinessType(customerDetails?.custom_attributes?.[0]?.value === 1 ? '1' : '0');
        } else {
            setData({
                email: '',
                business: '0',
                firstname: '',
                lastname: '',
                companyname: '',
                telephone: ''
            })
            setErrors({});
            setSuccess({});
            setGetBusinessType('0');
        }
    }, [customerDetails, openModel]);

    useEffect(() => {
        setGetBusinessType(data?.business);
    }, [data?.business]);
    return <form className='flex col gap-2 pb-9' onSubmit={submitHandler} noValidate>
        <Input
            iconClass="top-11"
            name="email"
            lable="E-mailadres *"
            errorMessage="Het is niet mogelijk om het emailadres aan te passen"
            disabled={true}
            readOnly={true}
            value={data?.email}
            controlClassName="relative email__field"
            labelClassName="fs-14 fw-700 line-7"
            fieldClassName="flex col pb-6"
        />
        <div className="choose__business flex row gap-x-10 pt-2">
            <Input
                type="radio"
                name="business"
                lable="Zakelijk"
                value="1"
                fieldClassName="radio flex gap-3 row pb-4 row-i right middle"
                labelClassName="fs-14 line-6"
                onChange={changeHandler}
                checked={data?.business === "1" ? true : false}
            />
            <Input
                type="radio"
                name="business"
                lable="Particulier"
                value="0"
                fieldClassName="radio flex gap-3 row pb-4 row-i right middle"
                labelClassName="fs-14 line-6"
                onChange={changeHandler}
                checked={data?.business === "0" ? true : false}
            />
        </div>
        {
            data?.business === "1" ?
                <Input
                    iconClass="top-11"
                    name="companyname"
                    lable="Bedrijfsnaam *"
                    labelClassName="fs-14 fw-700 line-6"
                    fieldClassName="flex gap-1 col pb-5"
                    value={data?.companyname}
                    onChange={changeHandler}
                    onBlur={() => onBlur("companyname")}
                    errorMessage={
                        errors?.companyname === data?.companyname ? "" : errors?.companyname
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
                : <></>
        }
        <Input
            iconClass="top-11"
            name="firstname"
            lable="Voornaam *"
            labelClassName="fs-14 fw-700 line-6"
            fieldClassName="flex gap-1 col pb-5"
            value={data?.firstname}
            onChange={changeHandler}
            onBlur={() => onBlur("firstname")}
            errorMessage={
                errors?.firstname === data?.firstname ? "" : errors?.firstname
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
        <Input
            iconClass="top-11"
            name="lastname"
            lable="Achternaam *"
            labelClassName="fs-14 fw-700 line-6"
            fieldClassName="flex gap-1 col pb-5"
            value={data?.lastname}
            onChange={changeHandler}
            onBlur={() => onBlur("lastname")}
            errorMessage={
                errors?.lastname === data?.lastname ? "" : errors?.lastname
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
        <Input
            iconClass="top-11"
            name="telephone"
            lable="Telefoonnummer *"
            labelClassName="fs-14 fw-700 line-6"
            fieldClassName="flex gap-1 col pb-5"
            value={data?.telephone}
            onChange={changeHandler}
            onBlur={() => onBlur("telephone")}
            onKeyDown={(e) => {
                if (!((e.key >= '0' && e.key <= '9') || e.key === '+' || e.key === '-' || e.key === ' ' || e.key === 'Backspace' || e.key === 'Delete' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Tab' || e.ctrlKey)) {
                    e.preventDefault();
                }
            }}
            onPaste={(event) => {
                event.preventDefault();
                const pastedText = event.clipboardData.getData('text/plain');
                let isValid = telephoneValidate(pastedText)
                if (isValid) {
                    setTimeout(() => {
                        setData({
                            ...data,
                            "telephone": pastedText?.trim(),
                        });
                    }, 50);
                }
            }}
            errorMessage={
                errors?.telephone === data?.telephone ? "" : errors?.telephone
            }
            icon={
                success?.telephone === "true" ? (
                    <ValidSuccesArrow />
                ) : success?.telephone === "false" ? (
                    <ValidErrorArrow />
                ) : null
            }
            showIcon={true}
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