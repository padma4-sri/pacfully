import React, { useEffect, useRef, useState, useContext, memo } from 'react';
import DomainContext from "Context/DomainContext";
import './styles.scss';
import Input from 'Components/Common/Form/Input';
import Img from 'Components/Img';
import BreadcrumbImageBackground from 'Res/images/breadcrumbsb.png';
import Button from 'Components/Common/Button';
import useForm from 'Components/Hooks/useForm';
import { ValidSuccesArrow, ValidErrorArrow } from "Res/icons/index";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Share from '../Share';
import { formOptions, telephoneValidate, useWindowSize } from 'Utilities';
import { APIQueryGet, APIQueryPost } from 'APIMethods/API';
import { useLocation, useNavigate } from 'react-router-dom';
import useScrollToTop from 'Components/Hooks/useScrollToTop';
import { LineLoader, SkeletonImg, SkeletonLoader } from "Components/Skeletion";
import { useEffectOnce } from 'Components/Hooks/useEffectOnce';
import Seo from 'Components/Seo/Seo';

const ViewJobDetails = () => {
    useScrollToTop();
    const { baseURL, defaultURL, storeId } = useContext(DomainContext);
    const [width] = useWindowSize();
    const navigate = useNavigate();
    const location = useLocation();
    const [resMessage, setResMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [isProcessign, setIsProcessing] = useState(false);
    const [openCopyURLModel, setOpenCopyURLModel] = useState(false);
    const [vanciesData, setVanciesData] = useState({});
    const [file, setFile] = useState('');
    const [files, setFiles] = useState('');
    const [addMinHeight, setAddMinHeight] = useState(false);
    let extention = files?.type?.split('/')?.[1];
    let fileName = files?.name?.split(`.${extention}`)?.[0];
    const seoData = vanciesData?.seo;
    const focusError = useRef();
    const DeleteIcon = "/res/img/deleteIcon.svg";
    const focusForm = useRef();
    const fileInputRef = useRef(null);
    const { data, setData, errors, setErrors, changeHandler, submitHandler, onBlur, success, setSuccess } = useForm({
        validations: {
            number: formOptions.number,
            email: formOptions.email,
            firstName: formOptions.requiredField
        },
        initialValues: {
            firstName: '',
            email: '',
            number: ''
        },
        onSubmit: () => saveHandler()
    });
    const [scrollPosition, setScrollPosition] = useState(0);
    const [loaded1, setLoaded1] = useState(false);
    const [status, setStatus] = useState("");
    const fileHandler = (e) => {
        const fileName = e.target.files[0].name;
        const fileExtension = fileName.split('.').pop().toLowerCase();
        if (['doc', 'docx', 'pdf'].indexOf(fileExtension) !== -1) {
            setResMessage("");
            setFiles(e.target.files[0]);
            const fileData = e.target.files[0];
            if (fileData) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setFile(e.target.result);
                };
                reader.readAsDataURL(fileData);
            }
        } else {
            setResMessage("Niet ondersteund bestandstype. Upload een bestand met de extensie .doc, .docx of .pdf.");
            setFile("");
            setFiles("");
            if (fileInputRef.current) {
                fileInputRef.current.value = null;
            };
        }
    }
    const options = {
        isLoader: true,
        loaderAction: (bool) => {
            if (bool) {
                setResMessage("");
            }
            setLoading(bool)
        },
        setGetResponseData: (resData) => {
            setVanciesData(resData?.data?.[0]);
        },
        axiosData: {
            url: `${defaultURL}/getvacanciesdetails?storeId=${storeId}&searchString=&categoryUrl=&vacancyUrl=${location?.pathname?.split('/').pop()}`,
          
        }
    };
    const isImageLoaded = () => {
        setTimeout(() => {
            setLoaded1(true);
        }, 1000);
    }
    // form focus
    var headerHeight = 85;
    var headerHeightUps = 183;
    var headerHeightSearch = 138;
    var detailsElem = document.querySelector('.vacancy__form');
    const formFocusHandle = () => {
        if (scrollPosition <= 40) {
            window.scroll({ top: (detailsElem.offsetTop - headerHeightUps), left: 0, behavior: 'smooth' });
        } else if (scrollPosition > 40 && scrollPosition < 150) {
            window.scroll({ top: (detailsElem.offsetTop - headerHeightSearch), left: 0, behavior: 'smooth' });
        } else if (width >= 768 || scrollPosition > 150) {
            window.scroll({ top: (detailsElem.offsetTop - headerHeight), left: 0, behavior: 'smooth' });
        }
    };
    // save api
    const clearValues = () => {
        setData({
            email: "",
            firstName: "",
            name: "",
            number: "",
            message: ""
        });
        setFile("");
        setFiles("")
        setSuccess({});
        setErrors({});
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    }
    let fileExtention = typeof (file) === 'string' && file?.split(',')?.[0]?.split('/')?.[1]?.split(';');
    let fileString = typeof (file) === 'string' && file?.split(',')?.[1];
    const saveHandler = () => {
        const loginOptions = {
            isLoader: true,
            loaderAction: (bool) => setIsProcessing(bool),
            setGetResponseData: (resData) => {
                setStatus(resData?.data?.[0]?.code);
                if (resData?.data?.[0]?.status === true) {
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
                url: `${baseURL}/nits/saveVacancy`,
                paramsData: {
                    data: {
                        job_id: vanciesData?.vacancies_data?.[0]?.vacancy_id,
                        name: data?.firstName,
                        email: data?.email,
                        telephone: data?.number,
                        linkedin_profile: data?.linkedin,
                        message: data?.message,
                        cover_letter: `${fileExtention === undefined ? '' : `${fileExtention};`}${fileString === undefined ? '' : fileString}`,
                        resume: `${fileExtention === undefined ? '' : `${fileExtention};`}${fileString === undefined ? '' : fileString}`,
                        store_id: storeId,
                        file_name:fileName
                    }
                }
            }
        }
        APIQueryPost(loginOptions);
    }
    // scroll position
    const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };

    const loadingBlock = (
        <div className="flex col gap-1">
            <LineLoader width="50%" height="26px" className="mb-6" />
            <SkeletonLoader length={13} />
            <LineLoader width="50%" className="my-3" />
            <SkeletonLoader length={5} />
        </div>
    );

    // render once
    useEffectOnce(() => {
        APIQueryGet(options);
        clearValues();
        setResMessage("")
    });

    // scroll position
    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (loaded1) {
            setAddMinHeight(true);
        } else {
            setAddMinHeight(false);
        }
    }, [loaded1]);

    useEffect(() => {
        if (resMessage) {
            focusError.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center'
            });
        }
    }, [resMessage]);

    return (
        <React.Fragment>
            <Seo
                metaTitle={seoData?.metaTitle}
                metaDescription={seoData?.metaDescription}
                metaKeywords={seoData?.metaKeywords}
            />
            <div className='vacancies__view pb-10 md-pb-12'>
                <div
                    className="breadcrumbimage__block relative"
                    style={{
                        minHeight: !addMinHeight ? '457px' : 'auto'
                    }}
                >
                    {
                        loading ?
                            <div className="flex relative">
                                <SkeletonImg
                                    className="flex absolute top-0 left-0 zindex-1"
                                    height="457px"
                                    style={{ borderRadius: "0px" }}
                                />
                            </div>
                            :
                            <>
                                <div className="flex relative banner_image_height">
                                    {/* <img
                                        onLoad={isImageLoaded}
                                        draggable="false" src={vanciesData?.vacancies_data?.[0]?.banner_image} className="lg-hide xxl-hide" width="100%" height="100%" alt={vanciesData?.vacancies_data?.[0]?.vacancy_description} />
                                    <img
                                        onLoad={isImageLoaded}
                                        draggable="false" src={vanciesData?.vacancies_data?.[0]?.banner_image} className="hide lg-block xxl-hide" width="100%" height="100%" alt={vanciesData?.vacancies_data?.[0]?.vacancy_description} /> */}
                                    <img
                                        onLoad={isImageLoaded}
                                        draggable="false" src={vanciesData?.vacancies_data?.[0]?.banner_image} className="" width="100%" height="100%" alt={vanciesData?.vacancies_data?.[0]?.vacancy_description} />
                                </div>
                                <div className="flex absolute top-0 w-1/1 h-1/1 middle">
                                    <div className="container px-4">
                                        <h1 className='fs-32 fw-700 line-10 pb-1'>{vanciesData?.vacancies_data?.[0]?.vacancy_name}</h1>
                                        <p className='fs-20 fw-500' dangerouslySetInnerHTML={{ __html: vanciesData?.vacancies_data?.[0]?.vacancy_description }}></p>
                                        <div className="action flex col sm-flex sm-row sm-gap-8 pt-9 gap-2">
                                            <Button onClick={() => formFocusHandle()}>Solliciteer direct</Button>
                                            <Button onClick={() => setOpenCopyURLModel(true)}>Deel deze vacature</Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                    }
                </div>
                <div className='page__container container px-4'>
                    <div className="back__action pt-4 pb-10">
                        {
                            loading ?
                                <LineLoader width="173px" />
                                :
                                <Button
                                    className='fs-14 back'
                                    onClick={() => navigate("/vacatures")}
                                ><span className="arrow">{`<`}</span>&nbsp;&nbsp;terug naar vacatures</Button>
                        }
                    </div>
                    {
                        loading ?
                            <div className="flex col xxl-flex xxl-row gap-4">
                                <div className="details left flex-1 p-5 xxl-p-10">
                                    {loadingBlock}
                                </div>
                                <div className="details right flex-1 p-5 xxl-p-10">
                                    {loadingBlock}
                                    <SkeletonLoader length={2} full={true} pclassName="py-5 flex gap-5" height='50px' />
                                    <LineLoader width="80%" />
                                </div>
                            </div>
                            :
                            <div className="flex col xxl-flex xxl-row gap-4">
                                <div className="details left flex-1 p-5 xxl-p-10">
                                    <div className="flex col">
                                        <h2 className='fs-22 line-7 fw-600 pb-6'>{vanciesData?.vacancies_data?.[0]?.left_content_title}</h2>
                                        <div className='fs-15 line-7' dangerouslySetInnerHTML={{ __html: vanciesData?.vacancies_data?.[0]?.left_content }}></div>
                                    </div>
                                </div>
                                <div className="details right flex-1 p-5 xxl-p-10">
                                    <div className="flex col">
                                        <h2 className='fs-22 line-7 fw-600 pb-6'>{vanciesData?.vacancies_data?.[0]?.right_content_title}</h2>
                                        <div className='fs-15 line-7 pb-7' dangerouslySetInnerHTML={{ __html: vanciesData?.vacancies_data?.[0]?.right_content }}></div>
                                        <div className="action flex col sm-flex sm-row pb-7 gap-2 md-flex md-gap-8">
                                            <Button onClick={() => formFocusHandle()}>Solliciteer direct</Button>
                                            <Button onClick={() => setOpenCopyURLModel(true)}>Deel deze vacature</Button>
                                        </div>
                                        <p className='fs-15 line-7'>{vanciesData?.vacancies_data?.[0]?.recruitment_note}</p>
                                    </div>
                                </div>
                            </div>
                    }
                    {
                        loading ?
                            <div className="breadcrumbimage__block general relative py-11">
                                <SkeletonImg
                                    height="270px"
                                    style={{ borderRadius: "10px" }}
                                />
                            </div>
                            :
                            <div className="breadcrumbimage__block general relative py-11">
                                <div className="flex relative">
                                    {/* <Img src={BreadcrumbImageMobileBackground} className='sm-hide' alt={vanciesData?.vacancies_data?.[0]?.general_information_title} />
                                    <Img src={BreadcrumbImageMobilesmBackground} className='hide sm-block lg-hide' alt={vanciesData?.vacancies_data?.[0]?.general_information_title} />
                                    <Img src={BreadcrumbImageTabBackground} className='hide lg-block xxl-hide' alt={vanciesData?.vacancies_data?.[0]?.general_information_title} /> */}
                                    <Img src={BreadcrumbImageBackground} className='' alt={vanciesData?.vacancies_data?.[0]?.general_information_title} />
                                </div>
                                <div className="flex absolute top-0 w-1/1 h-1/1 middle">
                                    <div className="image__background px-5">
                                        <h1 className='fs-22 pb-2'>{vanciesData?.vacancies_data?.[0]?.general_information_title}</h1>
                                        <div className='fs-15 line-7' dangerouslySetInnerHTML={{ __html: vanciesData?.vacancies_data?.[0]?.general_information }}></div>
                                    </div>
                                </div>
                            </div>
                    }
                    <form className='flex col gap-2 py-7 px-5 xxl-px-10 vacancy__form' onSubmit={submitHandler} noValidate ref={focusForm}>
                        <h2 className='fs-20 line-7 fw-700 pb-6'>Solliciteer direct</h2>
                        <div className="flex col lg-flex lg-gap-8 lg-row">
                            <div className="flex col flex-1">
                                <Input
                                    name="firstName"
                                    placeHolder='Naam *'
                                    lable="Naam *"
                                    labelClassName="fs-15 fw-700 line-6"
                                    iconClass="top-11"
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
                                    name="email"
                                    placeHolder='E-mailadres *'
                                    labelClassName="fs-15 fw-700 line-6"
                                    lable="E-mailadres *"
                                    iconClass="top-11"
                                    value={data?.email}
                                    onChange={changeHandler}
                                    onBlur={() => onBlur("email")}
                                    errorMessage={
                                        errors?.email === data?.email ? "" : errors?.email
                                    }
                                    icon={
                                        success?.email === "true" ? (
                                            <ValidSuccesArrow />
                                        ) : success?.email === "false" ? (
                                            <ValidErrorArrow />
                                        ) : null
                                    }
                                    showIcon={true}
                                />

                                <Input
                                    name="number"
                                    placeHolder='Telefoonnummer *'
                                    labelClassName="fs-15 fw-700 line-6"
                                    lable="Telefoonnummer *"
                                    iconClass="top-11"
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
                            </div>
                            <div className="flex col flex-1">
                                <Input
                                    name="linkedin"
                                    placeHolder='LinkedIn profiel'
                                    labelClassName="fs-15 fw-700 line-6"
                                    lable="LinkedIn profiel"
                                    value={data?.linkedin}
                                    onChange={changeHandler}
                                    onBlur={() => onBlur("linkedin")}
                                />
                                {/* upload */}
                                <div className="flex gap-1 col input__control relative file__upload file__upload__container pb-6 lg-pb-5">
                                    <p class="hide lg-block lg-v-hide label fs-15 fw-700 line-6" for="form-type">Tele</p>
                                    <div className="file__block line-6 px-4 py-1 xs-py-4 xs-flex xs-row col field__block relative flex gap-2 xs-gap-1 middle">
                                        <lable className="label fs-14 pr-6 text-nowrap">Upload CV</lable>
                                        <label for="fileInput" class="custom-label fs-12 text-nowrap">Bestand kiezen</label>
                                        <input
                                            type="file"
                                            aria-label="file upload" 
                                            className="form__types w-1/1 fs-14 flex-1"
                                            onChange={fileHandler}
                                            ref={fileInputRef}
                                            id="fileInput"
                                            accept=".doc, .docx, .pdf"
                                        />
                                        {
                                            fileName ?
                                                null
                                                : <span className='fs-12 pl-2 flex-1 text__ellipse tc xs-tl'>Geen bestand gekozen</span>
                                        }
                                    </div>
                                </div>
                                <div className={`flex col gap-1 file__upload__container ${files?.name ? 'block' : 'v-hide'} pb-5 lg-pb-5`}>
                                    <p class="hide lg-block lg-v-hide label fs-15 fw-700 line-6 text-nowrap" for="form-type">Tele</p>
                                    <div className='file__block px-4 py-1 xs-py-4 file flex col md-flex md-row gap-2 middle'>
                                        <p className='fs-15 line-6 text-nowrap'>Bestand:</p>
                                        <p className='fs-15 line-6 flex gap-2 middle relative'>
                                            <span className="flex-1 text__ellipse file_name">{files?.name}</span>
                                            <span
                                                onClick={() => {
                                                    setFile("");
                                                    setFiles("");
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.value = null;
                                                    }
                                                }}
                                                className='pointer pt-2'>
                                                <Img src={DeleteIcon} />
                                            </span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Input
                        placeHolder='Uw bericht'
                            element="textarea"
                            name="message"
                            value={data?.message}
                            lable="Uw bericht"
                            labelClassName="fs-15 fw-700 line-6"
                            onChange={changeHandler}
                            onBlur={() => onBlur("message")}
                        />
                        <div className="action flex  gap-8 pt-7">
                            <Button
                                className={`fs-15 line-8 fw-700 r-8  px-5 save__button ${isProcessign ? 'rotateUpdate' : ''}`}
                                fullWidth
                                type="submit"
                            >
                                {isProcessign ? <AutorenewIcon /> : "Verzenden"}
                            </Button>
                        </div>
                        {resMessage && <div className={`res__message pt-5 ${status === 200 ? "success" : "error"}`} ref={focusError}>{resMessage}</div>}
                        <div className="fs-15 line-7 required pt-4">* verplicht veld</div>
                    </form>
                </div>
            </div >
            <Share
                openCopyURLModel={openCopyURLModel}
                setOpenCopyURLModel={setOpenCopyURLModel}
            />
        </React.Fragment >
    )
}

export default memo(ViewJobDetails);