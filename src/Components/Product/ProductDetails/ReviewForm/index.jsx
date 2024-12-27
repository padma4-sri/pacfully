import React, { useEffect, useState, useContext } from 'react';
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import ModelNew from 'Components/Model/ModelNew';
import CloseButton from 'Components/CloseButton';
import Input from 'Components/Common/Form/Input';
import Button from 'Components/Common/Button';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { ValidSuccesArrow, ValidErrorArrow } from "Res/icons/index";
import Rating from "@mui/material/Rating";
import useForm from "Components/Hooks/useForm";
import { APIQueryPost } from "APIMethods/API";
import { useSelector } from 'react-redux';

const ReviewForm = ({ openModel, setOpenModel, product_id, productTitle }) => {

    const [resMessage, setResMessage] = useState("");

    return (
        <ModelNew
            from="right"
            hideScroll={false}
            zindex={11}
            open={openModel}
            shadow={true}
            setOpen={setOpenModel}
            className="header__review__sidebar"
        >
            <div className="sidebar__review w-1/1 h-1/1 py-4">
                <div className="close__block tr flex right w-1/1 px-4 sm-px-6 ">
                    <CloseButton onClickFunction={() => setOpenModel(false)} />
                </div>
                <div className="review__wrapper__container px-4 sm-px-6 w-1/1 h-1/1 overflow-hidden overflow-y-auto">
                    <div className="sidebar__heading pb-10">
                        <h1 className="fw-700 pb-1 fs-20">Schrijf een review voor</h1>
                        <h1 className="fw-700 pb-4 fs-20">{productTitle}</h1>
                        <p className="line-6 fs-15">Wij controleren elk ingezonden product review. Na goedkeuring verschijnt uw review op de productpagina.</p>
                    </div>
                    <div className="review__form">
                        <Form
                            product_id={product_id}
                            resMessage={resMessage}
                            setResMessage={setResMessage}
                            openModel={openModel}
                        />
                    </div>
                </div>
            </div>
        </ModelNew>
    )
}

export default ReviewForm;

const Form = ({ product_id, setResMessage, resMessage, openModel }) => {
    const customerDetails = useSelector((state) => state?.customerDetails);
    const { baseURL, storeId } = useContext(DomainContext);
    const [value, setValue] = useState(0);
    const [isProcessign, setIsProcessing] = useState(false);

    const {
        data,
        setData,
        errors,
        setErrors,
        changeHandler,
        submitHandler,
        onBlur,
        success,
        setSuccess,
    } = useForm({
        validations: {
            review: {
                required: {
                    value: true,
                    message: "dit veld is verplicht.",
                }
            },
            summary: {
                required: {
                    value: true,
                    message: "dit veld is verplicht.",
                }
            },
            nickname: {
                required: {
                    value: true,
                    message: "dit veld is verplicht.",
                }
            },
            rating: {
                required: {
                    value: true,
                    message: "dit veld is verplicht.",
                }
            }
        },
        initialValues: {
            rating: "",
            nickname: "",
            summary: "",
            review: ""
        },
        onSubmit: () => reviewSubmitHandler(),
    });
    const reviewSubmitHandler = () => {
        const loginOptions = {
            isLoader: true,
            loaderAction: (bool) => setIsProcessing(bool),
            setGetResponseData: (resData) => {
                if (resData?.data?.[0]?.code === 200) {
                    setResMessage(resData?.data?.[0]?.message);
                    clearValues();
                }
            },
            getStatus: (res) => {
                if (res?.status !== 200) {
                    setResMessage(res?.message);
                }
            },
            axiosData: {
                url: `${baseURL}/review/create`,
                paramsData: {
                    data: {
                        productId: product_id,
                        customerId: customerDetails?.id ? customerDetails?.id : null,
                        customerName: data?.nickname,
                        reviewTitle: data?.summary,
                        reviewDetail: data?.review,
                        ratingValue: value || 0,
                        storeId: storeId
                    }
                }
            },
        };
        APIQueryPost(loginOptions);
    };
    const clearValues = () => {
        setData({
            rating: "",
            nickname: "",
            summary: "",
            review: ""
        });
        setSuccess({});
        setErrors({});
        setValue(0);
    };
    useEffect(() => {
        if (openModel) {
            clearValues()
        }
    }, [openModel])
    return <form
        className="flex col gap-2 pb-9"
        onSubmit={submitHandler}
        noValidate
    >
        <div className="rating relative pb-3">
            <p className="label fs-16 fw-700 pb-1">Totaalscore artikel *</p>
            <Rating
                name="simple-controlled"
                value={value}
                onChange={(event, newValue) => {
                    if (newValue !== null) {
                        let rateValue = newValue.toString();
                        setValue(rateValue);
                        setData({ ...data, rating: rateValue });
                        setErrors({});
                    }

                }}
            />
            <Input
                name="rating"
                value={data?.rating}
                lable="Bijnaam"
                controlClassName="hide"
            />
            <span className={`field__error error absolute bottom-0 left-0 fs-12 w-1/1 ${errors?.rating ? 'v-show' : 'v-hide'}`}>{errors?.rating ? errors?.rating : 'Hello'}</span>
        </div>

        <Input
            iconClass="top-11"
            name="nickname"
            value={data?.nickname}
            lable="Uw naam *"
            labelClassName="fs-15 fw-700 line-6"
            type="text"
            onChange={changeHandler}
            onBlur={() => onBlur("nickname")}
            icon={
                success?.nickname === "true" ? (
                    <ValidSuccesArrow />
                ) : success?.nickname === "false" ? (
                    <ValidErrorArrow />
                ) : null
            }
            showIcon={true}
            errorMessage={errors?.nickname === data?.nickname ? "" : errors?.nickname}
        />
        <Input
            iconClass="top-11"
            name="summary"
            value={data?.summary}
            lable="Productervaring in één zin *"
            labelClassName="fs-15 fw-700 line-6"
            type="text"
            onChange={changeHandler}
            errorMessage={
                errors?.summary === data?.summary ? "" : errors?.summary
            }
            onBlur={() => onBlur("summary")}
            icon={
                success?.summary === "true" ? (
                    <ValidSuccesArrow />
                ) : success?.summary === "false" ? (
                    <ValidErrorArrow />
                ) : null
            }
            showIcon={true}
        />
        <Input
            iconClass="top-20"
            element="textarea"
            name="review"
            value={data?.review}
            lable="Wat vindt u van het product? *"
            labelClassName="fs-15 fw-700 line-6"
            type="text"
            onChange={changeHandler}
            errorMessage={
                errors?.review === data?.review ? "" : errors?.review
            }
            onBlur={() => onBlur("review")}
            icon={
                success?.review === "true" ? (
                    <ValidSuccesArrow />
                ) : success?.review === "false" ? (
                    <ValidErrorArrow />
                ) : null
            }
            showIcon={true}
        />
        {resMessage && (
            <div className={`res__message pt-5 ${resMessage.includes("succesvol") ? "success" : "error"}`}>{resMessage}</div>
        )}
        <div className="action__block">
            <Button className={`r-6 px-2 py-3 pointer fw-700 ${isProcessign ? "rotateUpdate" : ""}`}>
                {isProcessign ? <AutorenewIcon /> : "Versturen"}
            </Button>
        </div>

    </form>
}