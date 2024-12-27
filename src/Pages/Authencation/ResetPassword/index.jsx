import React, { useEffect, useState, useContext, memo } from 'react'
import DomainContext from "Context/DomainContext";
import AuthencationLayout from 'Pages/Authencation/AuthencationLayout';
import useForm from 'Components/Hooks/useForm';
import Button from 'Components/Common/Button';
import Input from 'Components/Common/Form/Input';
import { useLocation, useNavigate } from 'react-router-dom';
import { APIQueryPost } from 'APIMethods/API';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { ValidSuccesArrow, ValidErrorArrow } from "Res/icons/index";
import { formOptions } from 'Utilities';
import Seo from 'Components/Seo/Seo';

const ResetPassword = () => {
  const { storeId ,baseURL } = useContext(DomainContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [resMessage, setResMessage] = useState("");
  const [isProcessign, setIsProcessing] = useState(false);
  const { data, setData, errors, changeHandler, submitHandler, keyDownHandler, onBlur, success } = useForm({
    validations: {
      confirmPassword: {
        customChange: {
          isValid: (value) => (data?.password?.length >= 8) && (value !== data?.password),
          message: formOptions.confirmMessage,
        }
      },
      password: formOptions.password
    },
    onSubmit: () => resetHandler()
  });

  const resetHandler = () => {
    const quoteIdOptions = {
      isLoader: true,
      loaderAction: (bool) => setIsProcessing(bool),
      setGetResponseData: (resData) => {
        if (resData?.data?.[0]?.code === 200 && resData?.data?.[0]?.status === true) {
          navigate("/");
          setData({
            password: "",
            confirmPassword: ""
          })
        } else {
          setResMessage(resData?.data?.[0]?.message);
        }
      },
      getStatus: (res) => {
        if (res?.status !== 200) {
          setResMessage(res?.message);
        }
      },
      axiosData: {
        url: `${baseURL}/customer/resetpassword`,
        method: "post",
        paramsData: {
          token: location?.pathname?.split('/')?.[2],
          password: data?.password,
          confirmPassword: data?.confirmPassword,
          storeId:storeId
        }
      }
    }
    APIQueryPost(quoteIdOptions);
  }

  useEffect(() => {
    setResMessage("");
    return () => {
      if (resMessage) setResMessage("");
    }
  }, []);

  const dataBlock = <div className="auth__wrapper reset__password">
    <h1 className='tc fs-24 fw-700'>Stel je wachtwoord opnieuw in</h1>
    <div className="form__block">
      <form onSubmit={submitHandler} noValidate>
        <div className="fields__wrapper flex col gap-y-4 sm-flex sm-gap-y-8 xl-flex gap-y-3 xl-row gap-x-8">
          <div className="column__wrapper p-4 sm-p-8 r-1 mx-auto">
            <Input
              name="password"
              placeHolder="Nieuw wachtwoord"
              lable="Nieuw wachtwoord *"
              type="password"
              iconClass="top-11"
              labelClassName="fs-15 fw-700 line-6"
              errorClassName="error fs-12 pt-1 tr w-1/1"
              value={data?.password}
              onChange={changeHandler}
              onKeyDown={keyDownHandler}
              onBlur={() => onBlur("password")}
              icon={
                success?.password === "true" ? (
                  <ValidSuccesArrow />
                ) : success?.password === "false" ? (
                  <ValidErrorArrow />
                ) : null
              }
              showIcon={true}
              errorMessage={errors?.password === data?.password ? "" : errors?.password}
            />
            <Input
              name="confirmPassword"
              placeHolder="Bevestig nieuw wachtwoord"
              lable="Bevestig nieuw wachtwoord *"
              type="password"
              iconClass="top-11"
              labelClassName="fs-15 fw-700 line-6"
              errorClassName="error fs-12 pt-1 tr w-1/1"
              value={data?.confirmPassword}
              onChange={changeHandler}
              onKeyDown={keyDownHandler}
              onBlur={() => onBlur("confirmPassword")}
              icon={
                success?.confirmPassword === "true" ? (
                  <ValidSuccesArrow />
                ) : success?.confirmPassword === "false" ? (
                  <ValidErrorArrow />
                ) : null
              }
              showIcon={true}
              errorMessage={errors?.confirmPassword === data?.confirmPassword ? "" : errors?.confirmPassword}
            />
            <div className="action__block flex col xl-flex gap-y-3 xl-row col-i gap-x-8 w-1/1  pt-3 center">
              <Button
                fullWidth={true}
                className={`r-6 px-2 py-3 pointer ${isProcessign ? 'rotateUpdate' : ''}`}
              >{isProcessign ? <AutorenewIcon /> : "Opslaan"}</Button>
            </div>
            {resMessage && <div className="res__message pt-5 error">{resMessage}</div>}
          </div>
        </div>
      </form>
    </div>
  </div>
  return (
    <>
      <Seo
        metaTitle={storeId === 1? "Wachtwoord opnieuw instellen | Promofit.nl": "Wachtwoord opnieuw instellen Expofit.nl"}
        metaDescription="Wachtwoord opnieuw instellen"
        metaKeywords="Wachtwoord opnieuw instellen"
      />
      <AuthencationLayout
        title='Stel je wachtwoord opnieuw in'
        data={dataBlock}
      />
    </>
  )
}

export default memo(ResetPassword);