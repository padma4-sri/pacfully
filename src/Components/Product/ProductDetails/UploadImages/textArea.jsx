import { SkeletonImg } from 'Components/Skeletion';
import React, { useEffect, useState } from 'react';
import Input from 'Components/Common/Form/Input';
import { formOptions } from 'Utilities';
import useForm from 'Components/Hooks/useForm';
import { ValidErrorArrow, ValidSuccesArrow } from 'Res/icons';
import "./styles.scss";
const TextAreaFileUpload = ({textAreaData, setTextData}) => {
    const { data, setData, errors, setErrors, changeHandler, submitHandler, onBlur, success, setSuccess } = useForm({
        validations: {
            message: formOptions,
        },
        initialValues: {

            message: ""
        },
    });
    return (
        <Input
            style={{ height: "10rem" }}
            element="textarea"
            name="message"
            iconClass="top-11"
            placeHolder='Typ hier uw toelichting'
            value={data?.message}
            lable="Toelichting ontwerp"
            labelClassName="fs-15 fw-700 line-6 "
            inputClassName="pl-4 pr-8 input_text"
            onChange={(e)=>{
                changeHandler(e);
                setTextData(e.target.value)
            }}
            onBlur={() => onBlur("message")}
            icon={
                success?.message === "true" ? (
                    <ValidSuccesArrow />
                ) : success?.message === "false" ? (
                    <ValidErrorArrow />
                ) : null
            }
            showIcon={true}
            errorMessage={errors?.message === data?.message ? "" : errors?.message}
        />
    )

};

export default TextAreaFileUpload;
