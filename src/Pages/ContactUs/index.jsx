import React, { useState, useContext, memo } from 'react';
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import Breadcrumb from 'Components/Breadcrumb';
import useForm from 'Components/Hooks/useForm';
import { ValidErrorArrow, ValidSuccesArrow } from 'Res/icons';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Input from 'Components/Common/Form/Input';
import Button from 'Components/Common/Button';
import { formOptions, telephoneValidate } from 'Utilities';
import { APIQueryGet, APIQueryPost } from 'APIMethods/API';
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Telephone, Whatsaap, Email } from "Res/icons";
import useScrollToTop from 'Components/Hooks/useScrollToTop';
import { useEffectOnce } from 'Components/Hooks/useEffectOnce';
import Seo from 'Components/Seo/Seo';
import { flag1, flag2 } from 'Res/images';
import Img from 'Components/Img';
import { SkeletonLine, SkeletonLoader } from "Components/Skeletion";

const ContactUs = () => {
  useScrollToTop();
  const { baseURL, storeId, defaultURL } = useContext(DomainContext);
  const [resMessage, setResMessage] = useState("");
  const [isProcessign, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { data, setData, errors, setErrors, changeHandler, submitHandler, onBlur, success, setSuccess } = useForm({
    validations: {
      message: formOptions.requiredField,
      email: formOptions.email,
      number: formOptions.number,
      name: formOptions.requiredField
    },
    initialValues: {
      email: "",
      companyName: "",
      name: "",
      number: "",
      message: ""
    },
    onSubmit: () => contactHandler()
  });
  const [contactInfo, setContactInfo] = useState({});
  const [status, setStatus] = useState("");
  const [mapLoad, setMapLoad] = useState(true);

  const seoData = contactInfo?.seo;
  const options = {
    isLoader: true,
    loaderAction: (bool) => setLoading(bool),
    setGetResponseData: (resData) => {
      setContactInfo(resData?.data?.[0]);
    },
    axiosData: {
      url: `${defaultURL}/contact/getpagedetails?storeId=${storeId}`,
    
    },
  };

  const clearValues = () => {
    setData({
      email: "",
      companyName: "",
      name: "",
      number: "",
      message: ""
    });
    setSuccess({});
    setErrors({});
  }
  const contactHandler = () => {
    const loginOptions = {
      isLoader: true,
      loaderAction: (bool) => setIsProcessing(bool),
      setGetResponseData: (resData) => {
        setStatus(resData?.data?.[0]?.code);
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
        url: `${baseURL}/contact/create`,
        paramsData: {
          data: {
            company_name: data?.companyName,
            name: data?.name,
            phone: data?.number,
            mail: data?.email,
            message: data?.message,
            store_id: storeId
          }
        }
      }
    }
    APIQueryPost(loginOptions);
  }
  const breadCrumbData = [{
    categoryName: "Contact",
    urlKey: "",
    catId: "",
  }];
  const loaderData = <SkeletonLoader length={7} full={true} height="24px" />;
  const addressLoader = <div className="flex col" style={{ width: "50%" }}>
    <SkeletonLoader height="28px" className="mb-4" />
    {loaderData}
  </div>
  // render once
  useEffectOnce(() => {
    APIQueryGet(options);
    setResMessage("");
  });
  return (
    <React.Fragment>
      <Seo
        metaTitle={seoData?.metaTitle}
        metaDescription={seoData?.metaDescription}
        metaKeywords={seoData?.metaKeywords}
      />
      <div className='contact__page pt-4 pb-8 md-pb-14'>
        <Breadcrumb data={breadCrumbData} />
        <div className='page__container container px-4 pt-5'>
          <h1 className='fs-32 line-10 pb-3 fw-700'>Neem contact op</h1>
          <div className='flex col xl-flex xl-row gap-13'>
            <div className="flex col form__block">
              <p className="pb-9 fs-15 line-7">
                Heeft u vragen, opmerkingen of suggesties? Laat het ons weten via onderstaand contactformulier. Of neem vrijblijvend contact op via telefoon, e-mail of Whatsapp.
              </p>
              <form className='flex col gap-2' onSubmit={submitHandler} noValidate>
                <Input
                  name="companyName"
                  value={data?.companyName}
                  lable="Bedrijfsnaam"
                  labelClassName="fs-15 fw-700 line-6"
                  onChange={changeHandler}
                  onBlur={() => onBlur("companyName")}
                  iconClass="top-11"
                  icon={
                    success?.companyName === "true" ? (
                      <ValidSuccesArrow />
                    ) : success?.companyName === "false" ? (
                      <ValidErrorArrow />
                    ) : null
                  }
                  showIcon={true}
                  errorMessage={errors?.companyName === data?.companyName ? "" : errors?.companyName}
                />
                <Input
                  name="name"
                  value={data?.name}
                  lable="Naam *"
                  onChange={changeHandler}
                  onBlur={() => onBlur("name")}
                  labelClassName="fs-15 fw-700 line-6"
                  iconClass="top-11"
                  icon={
                    success?.name === "true" ? (
                      <ValidSuccesArrow />
                    ) : success?.name === "false" ? (
                      <ValidErrorArrow />
                    ) : null
                  }
                  showIcon={true}
                  errorMessage={errors?.name === data?.name ? "" : errors?.name}
                />
                <Input
                  name="number"
                  value={data?.number}
                  lable="Telefoonnummer *"
                  labelClassName="fs-15 fw-700 line-6"
                  onChange={changeHandler}
                  onKeyDown={(e) => {
                    if (!((e.key >= '0' && e.key <= '9') || e.key === '+' || e.key === '-' || e.key === ' ' || e.key === 'Backspace' || e.key === 'Delete' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Tab' || e.ctrlKey)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(event) => {
                    const clipboardData = event.clipboardData || window.clipboardData;
                    const pastedText = clipboardData.getData('text');
                    let isValid = telephoneValidate(pastedText)
                    if (isValid) {
                      setTimeout(() => {
                        setData({
                          ...data,
                          "number": pastedText?.trim(),
                        });
                      }, 50);
                    }
                  }}
                  onBlur={() => onBlur("number")}
                  iconClass="top-11"
                  icon={
                    success?.number === "true" ? (
                      <ValidSuccesArrow />
                    ) : success?.number === "false" ? (
                      <ValidErrorArrow />
                    ) : null
                  }
                  showIcon={true}
                  errorMessage={errors?.number === data?.number ? "" : errors?.number}
                />
                <Input
                  name="email"
                  value={data?.email}
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
                  element="textarea"
                  name="message"
                  iconClass="top-11"
                  value={data?.message}
                  lable="Uw bericht *"
                  labelClassName="fs-15 fw-700 line-6"
                  onChange={changeHandler}
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
                <div className="action__block">
                  <Button
                    className={`r-6 px-15 py-3 pointer fw-700 ${isProcessign ? 'rotateUpdate' : ''}`}
                  >
                    {isProcessign ? <AutorenewIcon /> : "Versturen"}
                    {!isProcessign ? <span className="flex middle fw-700">
                      <KeyboardArrowRightIcon />
                    </span> : ""}
                  </Button>
                </div>
                {resMessage && <div className={`res__message pt-5 ${status === 200 ? "success" : "error"}`}>{resMessage}</div>}
                <div className="fs-15 line-7 required pt-4">* verplicht veld</div>
              </form>
            </div>
            <div className="flex col map__block xxl-pl-14 flex-1">
              <div className="pb-12 relative">
                {
                  mapLoad ?
                    <SkeletonLine
                      animation="pulse"
                      width="100%"
                      height="283px"
                      style={{ borderRadius: "0px" }}
                    />
                    : <></>}
                <iframe onLoad={() => setMapLoad(false)} className={`${mapLoad ? 'absolute top-0' : ''}`} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2480.478392944409!2d4.620584000000001!3d51.55946300000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c418d2408fd6cd%3A0xbdec0e347009bf94!2sPauvreweg%2022%2C%204879%20NA%20Etten-Leur%2C%20Netherlands!5e0!3m2!1sen!2sin!4v1698908299787!5m2!1sen!2sin" width="100%" height="283" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title='Contact location' />
              </div>
              <div className="flex col lg-flex lg-row gap-13 lg-gap-15 xl-flex xl-gap-13 xl-col xxl-gap-15 xxl-flex xxl-row">

                {
                  loading ?
                    addressLoader
                    :
                    <div className="flex col">
                      <h2 className='fs-20 line-7 fw-700 pb-4'>Bezoekadres</h2>
                      <p className='fs-15 line-7'>{contactInfo?.officeAddress?.company}</p>
                      <p className='fs-15 line-7'>{contactInfo?.officeAddress?.street}</p>
                      <p className='fs-15 line-7'>{contactInfo?.officeAddress?.postalCode} {contactInfo?.officeAddress?.city}</p>
                      <p className='fs-15 line-7'>{contactInfo?.officeAddress?.country}</p>
                      <div className="flex col gap-2">
                        <div className="flex icon telephone middle fs-15 line-7">
                          <Telephone />
                          <div className="flex col sm-flex sm-row gap-1">
                            <div className="flex middle relative">
                              <Img type="img" src={flag1} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contained" }} className="mr-2" />
                              <a className='fs-15 line-7 hover__underline' href={`tel: ${contactInfo?.details?.primaryNumber}`}>{contactInfo?.details?.primaryNumber}</a>&nbsp;/
                            </div>
                            <div className="flex middle relative">
                              <Img type="img" src={flag2} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contained" }} className="mr-2" />
                              <a className='fs-15 line-7 hover__underline' href={`tel: ${contactInfo?.details?.additionalNumber}`}>{contactInfo?.details?.additionalNumber}</a>
                            </div>
                          </div>
                        </div>
                        <div className="flex icon whatsaap middle">
                          <Whatsaap />
                          <a className='fs-15 line-7 hover__underline' href={`https://wa.me/${contactInfo?.details?.whatsappLinkNumber?.replace(/\s|-/g, "")}`} target='__blank'>{contactInfo?.details?.whatsupNumber}</a>
                        </div>
                        <div className="flex icon email middle">
                          <Email />
                          <a className='fs-15 line-7 text-underline' href={`mailto: ${contactInfo?.details?.salesEmailId}`} target='__blank'>{contactInfo?.details?.salesEmailId}</a>
                        </div>
                      </div>
                    </div>
                }
                {
                  loading ?
                    addressLoader
                    :
                    <div className="flex col timings">
                      <h2 className='fs-20 line-7 fw-700 pb-4'>Openingstijden</h2>
                      {contactInfo?.opemingHours &&
                        Object.keys(contactInfo?.opemingHours).map((key, ind) => (
                          <div className="flex gap-7">
                            <p className='fs-15 line-7'>{Object.keys(contactInfo?.opemingHours)?.[ind]}</p>
                            <p className='fs-15 line-7'>{contactInfo?.opemingHours[key]}</p>
                          </div>
                        ))}
                    </div>
                }
              </div>
              {/* national holidays */}
              <div className="flex col pt-12 holidays">
                <h2 className='fs-20 line-7 fw-700 pb-4'>Gesloten i.v.m. feestdagen</h2>
                {
                  loading ?
                    loaderData
                    :
                    contactInfo?.publicHolidays?.map((item, ind) => (
                      <div className="flex col sm-flex sm-row sm-gap-7 pb-2 sm-pb-0" key={`nationalHolidays${ind}`}>
                        <p className='fs-15 fw-700 sm-fw-300 line-7 text-nowrap'>{item?.label}</p>
                        <p className='fs-15 line-7'>{item?.value}</p>
                      </div>
                    ))
                }
              </div>
              <div className="flex col pt-12">
                <h2 className='fs-20 line-7 fw-700 pb-4'>Bedrijfsgegevens</h2>
                {
                  loading ?
                    <SkeletonLoader length={2} full={true} height="24px" />
                    :
                    <div className="flex col">
                      <p className='fs-15 line-7'>KvK nummer: {contactInfo?.companyInfo?.kvkNUmber}</p>
                      <p className='fs-15 line-7'>BTW nummer: {contactInfo?.companyInfo?.btwNUmber}</p>
                    </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default memo(ContactUs);