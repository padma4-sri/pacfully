import React from "react";
import "./styles.scss";
import { BackgroundBox, LineLoader, PageTitle, Para, ParaBold } from '../Common';
import { IconButton } from '@mui/material';
import { SearchIcon, Toggleup } from 'Res/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Img from 'Components/Img';
import { useEffect, useMemo, useState, useContext, useRef, memo } from "react";
import DomainContext from "Context/DomainContext";
import { SessionExpiredLogout ,handleImage} from "Utilities";
import { APIQueryPost } from "APIMethods/API";
import { useDispatch, useSelector } from "react-redux";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Seo from "Components/Seo/Seo";
import { SkeletonLine } from "Components/Skeletion";

const OrdersList = ({ title, placeholder, orderTitle, url }) => {
    const { baseURL, storeId, defaultURL } = useContext(DomainContext);
    const getHeaderData = useSelector(state => state?.getHeaderFooterData?.data?.header?.contactSection?.contactDetails);
    const email = getHeaderData?.filter(item => item?.contactInfo?.mailId);
    const mobileNumber = getHeaderData?.filter(item => item?.contactInfo?.whatsappNumber);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const APIRef = useRef(false);
    const isSessionExpired = useSelector((state) => state?.isSessionExpired);
    const token = useSelector(state => state?.token);
    const location = useLocation();
    const [search, setSearch] = useState("");
    const pathName = location?.pathname?.split('/')?.[2];
    const customerId = useSelector((state) => state?.customerDetails?.id);
    const [numCount, setNumCount] = useState(15);
    const [productsData, setProductsData] = useState([]);
    const [productsDataAll, setProductsDataAll] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const currentPageRef = useRef(1);
    const [loading, setLoading] = useState(true);
    const [isChanged, setIsChanged] = useState(false);
    // paginationHandler
    const paginationHandler = () => {
        setCurrentPage(currentPage + 1);
        currentPageRef.current = currentPageRef.current + 1;
    };

    const getQuoteRequestList = (orderId = "", search) => {
        const loginOptions = {
            isLoader: true,
            loaderAction: (bool) => {
                if (bool && productsDataAll?.[0]?.message) {
                    setProductsDataAll([]);
                }
                if (bool && search === 'search') {
                    setProductsDataAll([]);
                }
                setLoading(bool);
            },
            setGetResponseData: (resData) => {
                if (resData?.status === 200) {
                    if (pathName === "mijn-offertes") {
                        if (search === 'search') {
                            if (!resData?.data?.[0]?.message) {
                                setProductsDataAll(resData?.data?.[0]?.orders);
                                setTotalCount(resData?.data?.[0]?.count);
                                setNumCount(resData?.data?.[0]?.count);
                            } else {
                                setProductsDataAll(resData?.data);
                                setTotalCount(0);
                                setNumCount(0);
                            }
                        } else {
                            if (!resData?.data?.[0]?.message) {
                                setProductsData(resData?.data?.[0]?.orders);
                            } else {
                                setProductsDataAll(resData?.data);
                            }
                        }
                        if (!resData?.data?.[0]?.message) {
                            setTotalCount(resData?.data?.[0]?.count);
                        }
                    }
                }
            },
            getStatus: (res) => {
                SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
            },
            axiosData: {
                url: `${defaultURL}/quote/getquoteslist`,
                headers: { Authorization: `Bearer ${token}` },
                paramsData: {
                    customerId: customerId,
                    searchData: orderId?.trim() ? orderId : '',
                    storeId: storeId,
                    pageSize: 15,
                    pageOffset: currentPageRef.current,
                }
            }
        }
        APIQueryPost(loginOptions);
    }
    const getOrderListData = (orderId = "", search) => {
        const loginOptions = {
            isLoader: true,
            loaderAction: (bool) => {
                if (bool && productsDataAll?.[0]?.message) {
                    setProductsDataAll([]);
                }
                if (bool && search === 'search') {
                    setProductsDataAll([]);
                }
                setLoading(bool);
            },
            setGetResponseData: (resData) => {
                if (resData?.status === 200) {
                    if (pathName === "mijn-bestellingen") {
                        if (search === 'search') {
                            if (!resData?.data?.[0]?.message) {
                                setProductsDataAll(resData?.data?.[0]?.orders);
                                setTotalCount(resData?.data?.[0]?.count);
                                setNumCount(resData?.data?.[0]?.count);
                            } else {
                                setProductsDataAll(resData?.data);
                                setTotalCount(0);
                                setNumCount(0);
                            }
                        } else {
                            if (!resData?.data?.[0]?.message) {
                                setProductsData(resData?.data?.[0]?.orders);
                            } else {
                                setProductsDataAll(resData?.data);
                            }
                        }
                        if (!resData?.data?.[0]?.message) {
                            setTotalCount(resData?.data?.[0]?.count);
                        }
                    }
                }
            },
            axiosData: {
                url: `${baseURL}/customer/orderlist`,
                headers: { Authorization: `Bearer ${token}` },
                paramsData: {
                    customerId: customerId,
                    storeId: storeId,
                    pageSize: 15,
                    pageOffset: currentPageRef.current,
                    searchData: orderId?.trim() ? orderId : '',
                }
            },
            getStatus: (res) => {
                SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
            }
        }
        APIQueryPost(loginOptions);
    }
    useMemo(() => {
        // pagination count
        let data = 15 * (currentPage === 1 ? 1 : currentPage );
        
        if (
            (currentPage === 1 ? 1 : currentPage ) &&
            totalCount >= data
        ) {
            setNumCount(data);
        } else if (
            totalCount >= 15 &&
            (currentPage === 1 ? 1 : currentPage ) > 0
        ) {
            setNumCount(totalCount);
        } else if (totalCount < 15) {
            setNumCount(totalCount);
        } else {
            setNumCount(15);
        }
    }, [productsData]);

    useMemo(() => {
        if (productsData?.length && !loading) {
            if (!productsDataAll?.length) {
                setProductsDataAll([...productsDataAll, ...productsData]);
            } else if (productsData?.[0]?.incrementId && (productsDataAll?.[0]?.incrementId !== productsData?.[0]?.incrementId)) {
                setProductsDataAll([...productsDataAll, ...productsData]);
            }
        }
    }, [productsData]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (pathName === "mijn-offertes" && isChanged) {
                getQuoteRequestList(search, 'search');
            }
            if (pathName === "mijn-bestellingen" && isChanged) {
                getOrderListData(search, 'search');
            }
        }, 1000);
        return () => {
            clearTimeout(timeoutId);
        }
    }, [search]);

    useEffect(() => {
        setCurrentPage(1);
        currentPageRef.current = 1;
        setIsChanged(false);
        setSearch("");
        setProductsDataAll([]);
        setProductsData([]);
        return () => {
            setCurrentPage(1);
            currentPageRef.current = 1;
            setIsChanged(false);
            setSearch("");
            setProductsDataAll([]);
            setProductsData([]);
        }
    }, [location]);

    useEffect(() => {
        if (!APIRef.current) {
            if (pathName === "mijn-offertes") {
                getQuoteRequestList();
            }
            if (pathName === "mijn-bestellingen") {
                getOrderListData();
            }
            APIRef.current = true;
            setTimeout(() => APIRef.current = false, 200);
        }
    }, [location, currentPage]);
   
    return (
        <>
            {
                pathName === "mijn-offertes" ?
                    <Seo
                        metaTitle={storeId === 1 ? "Mijn offerteaanvragen | Promofit.nl" : "Mijn offerteaanvragen Expofit.nl"}
                        metaDescription="Mijn offerteaanvragen"
                        metaKeywords="Mijn offerteaanvragen"
                    />
                    : <></>
            }
            {
                pathName === "mijn-bestellingen" ?
                    <Seo
                        metaTitle={storeId === 1 ? "Mijn bestellingen | Promofit.nl" : "Mijn bestellingen Expofit.nl"}
                        metaDescription="Mijn bestellijst"
                        metaKeywords="Mijn bestellijst"
                    />
                    : <></>
            }
            <div className='orders__list__page'>
                <div className='flex gap-6 col'>
                    <BackgroundBox className='flex col gap-y-5 gap-x-1 pt-6 pb-7 px-5 lg-pt-5 lg-px-8 lg-pb-8 xxl-flex xxl-row xxl-bottom'>
                        <div className="flex col flex-1">
                            <PageTitle>{title}</PageTitle>
                            <Para className='fs-14 line-6 header__info xxl-pr-9'>Heeft u vragen over uw bestelling? Stuur dan een e-mail naar&nbsp;
                                <a className='text-underline' href={`mailto:${email?.[0]?.contactInfo?.mailId}`} target="__blank">{email?.[0]?.contactInfo?.mailId}</a> of bel ons op <a href={`tel:${mobileNumber?.[0]?.contactInfo?.whatsappLinkNumber}`}>{mobileNumber?.[0]?.contactInfo?.whatsappNumber}</a>
                               </Para>
                        </div>
                        <div className="flex relative flex-1 w-1/1">
                            <div className='search'>
                                <input
                                    type='text'
                                    aria-label="Search"
                                    className='searchbox pr-14 pl-6'
                                    placeholder={placeholder}
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setIsChanged(true);
                                    }}
                                />
                                <IconButton
                                    className='mr-2'
                                    aria-label='search toggle'
                                >
                                    <SearchIcon />
                                </IconButton>
                            </div>
                        </div>
                    </BackgroundBox>
                    {
                        loading && !productsDataAll?.length ?
                            ['', '', '', '',]?.map((item, ind) => (
                                <React.Fragment key={`orderlistSkeleton${ind + 1}`}>
                                    <BackgroundBox className='flex col gap-y-3 pt-6 pb-7 px-0 lg-pt-5 xl-px-8 lg-pb-8'>
                                        <LineLoader width="100%" height="128px" />
                                    </BackgroundBox>
                                </React.Fragment>
                            ))
                            :
                            productsDataAll?.length && !productsDataAll?.[0]?.message ?
                                productsDataAll?.map((item, ind) => (
                                    <React.Fragment key={`${orderTitle}ListItems${ind + 1}`}>
                                        <BackgroundBox className='flex col gap-y-3 pt-6 pb-7 px-0 lg-pt-5 xl-px-8 lg-pb-8'>
                                            <ParaBold className="fs-15 line-6 fw-700 px-5 lg-px-8 xl-px-0">{item?.createdAt}</ParaBold>
                                            <div className="flex space-between col gap-y-4 xxl-flex xxl-row">
                                                <div className='flex image__block relative overflow-hidden overflow-x-auto no-scrollbar lg-px-8 xl-px-0'>
                                                    {
                                                        item?.items?.slice(0, 3)?.map((images, key) => (
                                                            <React.Fragment key={`${orderTitle}ListItems${ind + 1}${key}`}>
                                                                <Link to={`${url}?${orderTitle === "Offertenummer" ? item?.incrementId : item?.orderId}`} aria-label={title} className="image__items relative" key={`${title}${key}`}>
                                                                    <Img src={handleImage(images?.productImage)} className='image-contain' />
                                                                </Link>
                                                                {
                                                                    (item?.items?.length > 3) && (key === 2) ?
                                                                        <Link
                                                                            aria-label={orderTitle}
                                                                            className="image__items more flex center middle fw-700 pointer"
                                                                            to={`${url}?${orderTitle === "Offertenummer" ? item?.incrementId : item?.orderId}`}
                                                                        >
                                                                            +{item?.items?.length - 3}
                                                                        </Link>
                                                                        : <></>
                                                                }
                                                            </React.Fragment>
                                                        ))
                                                    }
                                                </div>
                                                <div className="flex col gap-y-1 info__block  px-5 lg-px-8 xl-px-0">
                                                    <ParaBold className='fs-15 line-6 fw-700 w-1/1'>{orderTitle} <Link className="fw-700 order_num" aria-label={orderTitle}to={`${url}?${orderTitle === "Offertenummer" ? item?.incrementId : item?.orderId}`}>
                                                        #{item?.incrementId}
                                                    </Link></ParaBold>
                                                    <div className="flex col gap-y-4 xxl-flex xxl-row xxl-bottom xxl-space-between">
                                                        <div className="flex col">
                                                            <Para>{item?.items?.length} artikel(en)</Para>
                                                            <Para>Totaalbedrag: € {item?.grandTotal}</Para>
                                                            {
                                                                orderTitle === "Offertenummer" ?
                                                                    <Para>Via de website</Para>
                                                                    :
                                                                    <Para>{item?.isSample === '1' ? 'Sample bestelling' : <>Online bestelling: <span style={{ color: item?.status === 'In afwachting' || item?.status === 'In behandeling' || item?.status === 'In afwachting van betaling'? '#EF8700' : '#52B80E' }}>{item?.status}</span></>}  </Para>
                                                            }
                                                        </div>
                                                        <Link to={`${url}?${orderTitle === "Offertenummer" ? item?.incrementId : item?.orderId}`} aria-label={orderTitle}className='view__product'>
                                                            <span className="fw-700 text-nowrap">
                                                                bekijk details <Toggleup />
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </BackgroundBox>
                                    </React.Fragment>
                                ))
                                : <></>
                    }
                    {/* pagination handler */}
                    <BackgroundBox className='flex col gap-y-3 pt-6 pb-7 px-0 lg-pt-5 xl-px-8 lg-pb-5'>
                        <div className="plp__pagination__block">
                            {

                                !productsDataAll?.[0]?.message ?
                                    <div className="action__block flex middle gap-x-10 right">
                                        <div className="fs-15">
                                            {
                                                loading ?
                                                    <SkeletonLine
                                                        animation="pulse"
                                                        className="tc"
                                                        width="100px"
                                                        height="20px"
                                                        style={{ borderRadius: "0px" }}
                                                    />
                                                    :
                                                    <p className="fs-15">
                                                        {numCount < totalCount ? numCount : totalCount} van {totalCount}
                                                    </p>
                                            }
                                        </div>
                                        {
                                            loading && !productsDataAll?.length ?
                                                <SkeletonLine
                                                    animation="pulse"
                                                    className="tc"
                                                    width="250px"
                                                    height="50px"
                                                    style={{ borderRadius: "25px" }}
                                                /> :
                                                numCount === totalCount ?
                                                    <></> :
                                                    <button
                                                        className={`primary__btn px-3 fw-700 fs-14 ${loading ? 'rotateUpdate' : ''}`}
                                                        aria-label="button"
                                                        disabled={
                                                            numCount === totalCount
                                                                ? true
                                                                : false
                                                        }
                                                        onClick={() => paginationHandler()}
                                                    >
                                                        {loading ? <AutorenewIcon /> : "toon meer"}
                                                    </button>
                                        }
                                    </div>
                                    :
                                    productsDataAll?.[0]?.message ? <p className="tc fs-15">{productsDataAll?.[0]?.message}</p> : <></>
                            }
                        </div>
                    </BackgroundBox>
                </div>
            </div>
        </>
    )
}

export default memo(OrdersList);