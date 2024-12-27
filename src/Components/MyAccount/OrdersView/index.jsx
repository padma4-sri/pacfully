import React, { useEffect } from "react";
import "./styles.scss";
import { BackgroundBox, PageTitle, Para, ParaBold, LineLoader } from '../Common';
import { Toggleup, Toggledown } from 'Res/icons';
import { Link, useNavigate } from 'react-router-dom';
import Img from 'Components/Img';
import Button from 'Components/Common/Button';
import { InvoiceIcon } from 'Res/icons';
import { memo, useContext, useState } from "react";
import { SkeletonLoader } from "Components/Skeletion";
import { APIQueryPost } from "APIMethods/API";
import { SessionExpiredLogout, getCartItems, useWindowSize,handleImage } from "Utilities";
import { useDispatch, useSelector } from "react-redux";
import DomainContext from "Context/DomainContext";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { ACTION_OPENCART,ACTION__MINICART__ITEMS } from "Store/action";
import Seo from "Components/Seo/Seo";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const OrdersView = ({ orderTitle = "", data, loading = true, customerData }) => {
    const { storeId, defaultURL } = useContext(DomainContext);
    const navigate = useNavigate();
    const [width] = useWindowSize()
    const dispatch = useDispatch();
    const [isProcessing, setIsProcessing] = useState(false);
    const [resPonse, serResponse] = useState("");
    const token = useSelector((state) => state?.token);
    const customerQuoteId = useSelector((state) => state?.customerQuoteId);
    const customerId = useSelector((state) => state?.customerDetails?.id);
    const isSessionExpired = useSelector((state) => state?.isSessionExpired);
    const commonLoader = <SkeletonLoader length={4} width="170px" height="22px" full={true} />;
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const createdAt = data?.createdAt;
    const [isLoading, setIsLoading] = useState(true);
 

    useEffect(() => {
        const calculateDateBefore = (createdAt, daysBefore) => {
            if (!createdAt) {
                return null;
            }
            const [day, month, year] = createdAt.split('-').map(Number);
            if (!day || !month || !year) {
                return null;
            }
            const createdDate = new Date(year, month - 1, day);
            createdDate.setDate(createdDate.getDate() - daysBefore);
            return createdDate;
        };

        const daysBefore = 15;
        const dateBefore = calculateDateBefore(createdAt, daysBefore);
        if (!dateBefore) {
            return;
        }
        const currentDate = new Date();

        if (currentDate >= dateBefore) {
            setIsButtonDisabled(true);
        }

    }, [data?.createdAt]);
   
    const reOrder = () => {
        const loginOptions = {
            isLoader: true,
            loaderAction: bool => {
                if (bool) {
                    setIsProcessing(bool);
                }
            },
            setGetResponseData: (resData) => {
                if (resData?.data?.[0]?.code === 200) {
                    if (width >= 768) {
                        dispatch(ACTION__MINICART__ITEMS("cart"))
                      }
                      else {
                        navigate("/winkelwagen")
                      }
                  
                 getCartItems(dispatch, setIsProcessing, customerQuoteId, customerId, () => dispatch(ACTION_OPENCART(true)), defaultURL, storeId, token, navigate, isSessionExpired, width);
                } else {
                    serResponse(resData?.data?.[0]?.message);
                    setIsProcessing(false);
                }
            },
            axiosData: {
                url: `${defaultURL}/customer/reorder`,
                headers: { Authorization: `Bearer ${token}` },
                paramsData: {
                    data: {
                        cart_id: customerQuoteId,
                        order_id: data?.orderId
                    }
                }
            },
            getStatus: (res) => {
                SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
            }
        }
        APIQueryPost(loginOptions);
    }




    return (
        <>
            {/* {
                orderTitle === "Ordernummer" ?
                    <Seo
                         //commented for purpose
                        // metaTitle={storeId === 1 ? "Bestelweergave | Promofit.nl" : "Bestelweergave Expofit.nl"}
                        metaTitle={`${orderTitle} #${data?.incrementId ? data?.incrementId : ""} | ${storeId === 1 ? "Promofit.nl" : "Expofit.nl"}`}
                        metaDescription="Bestelweergave"
                        metaKeywords="Bestelweergave"
                    />
                    : <></>
            }
            {
                orderTitle === "Offertenummer" ?
                    <Seo
                        //commented for purpose
                        // metaTitle={storeId === 1 ? "Citaatweergave | Promofit.nl" : "Citaatweergave Expofit.nl"}
                        metaTitle={`${storeId === 1 ? `Offertenummer #${data?.quoteId ? data?.quoteId :""} | Promofit.nl` : "Citaatweergave Expofit.nl"}`}
                        metaDescription="Citaatweergave"
                        metaKeywords="Citaatweergave"
                    />
                    : <></>
            } */}

{(!loading && orderTitle === "Ordernummer") ? (
  <Seo
    metaTitle={`${orderTitle} #${data?.incrementId} | ${
      storeId === 1 ? "Promofit.nl" : "Expofit.nl"
    }`}
    metaDescription="Bestelweergave"
    metaKeywords="Bestelweergave"
  />
) : (
  <Seo
    metaTitle={`${
      storeId === 1 ? "Ordernummer | Promofit.nl" : "Ordernummer | Expofit.nl"
    }`}
    metaDescription="Bestelweergave"
    metaKeywords="Bestelweergave"
  />
)}

{(!loading && orderTitle === "Offertenummer" && data) ? (
  <Seo
    metaTitle={`${
      storeId === 1
        ? `Offertenummer #${data?.quoteId} | Promofit.nl`
        : "Citaatweergave Expofit.nl"
    }`}
    metaDescription="Citaatweergave"
    metaKeywords="Citaatweergave"
  />
) : (
  <Seo
    metaTitle={`${
      storeId === 1
        ? `Offertenummer | Promofit.nl`
        : "Citaatweergave Expofit.nl"
    }`}
    metaDescription="Citaatweergave"
    metaKeywords="Citaatweergave"
  />
)}



            <div className='orders__view__page'>
                <div className='flex gap-6 col'>
                    {
                        loading ?
                            <BackgroundBox className='pt-6 pb-7 px-5 lg-pt-5 lg-px-8 lg-pb-8'>
                                <div className="flex col gap-y-5 space-between xxl-flex order__action center xxl-middle xxl-row pb-7 xxl-pb-4">
                                    <PageTitle className='fs-22 lg-fs-30 line-12 fw-700'>
                                        <LineLoader width="180px" height="48px" />
                                    </PageTitle>
                                    <Button className='fs-13 fw-700 r-5'>
                                        <LineLoader width="170px" height="40px" />
                                    </Button>
                                </div>
                                <div className="topdetails pb-7 lg-pb-9">{commonLoader}</div>

                                {orderTitle === "Ordernummer" ?
                                    <div className="address flex col gap-y-8 gap-x-4 sm-flex sm-row pb-7 xxl-pb-9">
                                        {
                                            ['', ''].map((item, ind) => (
                                                <div className="flex col gap-1" key={`orderDetailsAddressLoader${ind + 1}`}>
                                                    <LineLoader width="170px" height="28px" />
                                                    {commonLoader}
                                                </div>
                                            ))
                                        }
                                    </div>
                                    : <></>}
                                <div className='fs-15 line-6 fw-700 pb-5 lg-pb-4 pt-2'>
                                    <LineLoader width="170px" height="22px" />
                                </div>
                                <div className="productdetails">
                                    <SkeletonLoader length={3} width="100%" height="350px" full={true} />
                                </div>
                                <div className="summary__block py-7 lg-py-10 flex right">
                                    <SkeletonLoader length={7} width="170px" height="27px" full={true} />
                                </div>
                                <SkeletonLoader pclassName="flex col gap-y-5 sm-flex sm-row sm-space-between order__action sm-center sm-middle" length={2} width="170px" height="27px" full={true} />
                            </BackgroundBox> :
                            <BackgroundBox className='pt-6 pb-7 px-5 lg-pt-5 lg-px-8 lg-pb-8'>
                                <div className="flex col gap-y-5 space-between xxl-flex order__action center xxl-middle xxl-row pb-7 xxl-pb-4">
                                    <PageTitle className='fs-22 lg-fs-30 line-12 fw-700'><Button onClick={() => navigate(`/mijn-account/${orderTitle === "Ordernummer" ? 'mijn-bestellingen' : 'mijn-offertes'}`)} className="fs-22 lg-fs-30">{`<`}</Button> {orderTitle} #{orderTitle === "Ordernummer" ? data?.incrementId : data?.quoteId}</PageTitle>
                                    {

                                        orderTitle === "Ordernummer" && data?.displayReorder == 1 && data?.isSample !== '1' ?
                                            <Button
                                                className={`fs-13 fw-700 r-5 ${isProcessing ? 'rotateUpdate' : ''}`}
                                                onClick={() => reOrder()}
                                            >{isProcessing ? <AutorenewIcon /> : <>
                                                Opnieuw bestellen <Toggleup />
                                            </>}</Button>
                                            : <></>
                                    }
                                </div>
                                {resPonse && <div className="fs-15 res__message pb-3 error">{resPonse}</div>}
                                <div className="topdetails pb-7 lg-pb-9">
                                    <ParaBold>{data?.createdAt}&nbsp;&nbsp;&nbsp;{data?.createdTime}</ParaBold>
                                    <Para className='fs-15 line-6 pt-1 title'>
                                        {orderTitle === "Ordernummer" && data?.order_detail_exists ?
                                            data?.isSample === '1' ?
                                                <span className="label">Sample bestelling</span>
                                                :
                                                <><span className="label">Online bestelling:</span><span style={{ color: data?.status === 'In afwachting' || data?.status === 'In behandeling' ? '#EF8700' : '#52B80E' }}>{data?.status}</span></>
                                            :
                                            <>
                                            </>
                                        }
                                    </Para>

                                    <Para className='fs-15 line-6 pt-1 title'>
                                        {orderTitle === "Offertenummer" ?
                                            customerData ?
                                                <>
                                                    <span className="label">Offerteaanvraag:</span>
                                                    <span className="label">{data?.quote_mode}</span>
                                                </>
                                                :
                                                <></>
                                            :
                                            <></>
                                        }
                                    </Para>
                                    {orderTitle === "Ordernummer" && data?.paymentMethod !== null && data?.order_detail_exists?
                                        <Para className='fs-15 line-6 pt-1 title'><span className="label">Betaalmethode:</span><span className=''>{data?.paymentMethod}</span></Para>
                                        : <></>}
                                    {orderTitle === "Ordernummer" && data?.InvoiceData?.length && data?.order_detail_exists ? (
                                        <Para className='fs-15 line-6 flex title'>
                                            <span className="label">Factuur:</span>
                                            <div className="flex col">
                                                {data.InvoiceData.map((invoice, index) => (
                                                    <span
                                                        key={index}
                                                        className="pointer"
                                                        onClick={() => window.open(invoice.link, "_blank", "noreferrer")}
                                                    >
                                                        <span className='pr-2 text-underline'>bekijken</span>
                                                        <span className="payment relative line-1"><InvoiceIcon /></span>
                                                    </span>
                                                ))}
                                            </div>

                                        </Para>
                                    ) : null}

                                </div>

                                {orderTitle === "Offertenummer" ?
                                    <div className="topdetails pb-7 lg-pb-9">
                                        <ParaBold>Uw gegevens</ParaBold>
                                        <Para className='fs-15 line-6 pt-1 title'>
                                            {data?.quote_companyname}
                                        </Para>
                                        <Para className='fs-15 line-6 pt-1 title'>
                                            {data?.quote_customername}
                                        </Para>

                                        <Para className='fs-15 line-6 pt-1 title'>
                                            {data?.quote_telephone}
                                        </Para>
                                    </div>

                                    :
                                    <></>
                                }
                                {orderTitle === "Ordernummer" && data?.order_detail_exists ?
                                    <div className="address flex col gap-y-8 gap-x-4 sm-flex sm-row pb-7 xxl-pb-9">
                                        <div className="flex col">
                                            <ParaBold className='fs-15 line-6 fw-700 pb-1'>Factuuradres</ParaBold>
                                            <Para>{data?.billingAddress?.company} </Para>
                                            <Para>{data?.billingAddress?.firstname} {data?.billingAddress?.lasttname}</Para>
                                            <Para>{data?.billingAddress?.street} {data?.billingAddress?.doorNo}</Para>
                                            <Para>{data?.billingAddress?.postcode} {data?.billingAddress?.city}</Para>
                                            <Para>{data?.billingAddress?.countryName}</Para>
                                            <Para>Tel. {data?.billingAddress?.telephone}</Para>
                                        </div>
                                        <div className="flex col">
                                            <ParaBold className='fs-15 line-6 fw-700 pb-1'>{data?.instorePickup?"Afhaaladres":"Afleveradres"}</ParaBold>
                                            <Para>{data?.shippingAddress?.company} </Para>

                                            <Para>{data?.shippingAddress?.firstname} {data?.shippingAddress?.lasttname}</Para>
                                            <Para>{data?.shippingAddress?.street} {data?.shippingAddress?.doorNo}</Para>
                                            <Para>{data?.shippingAddress?.postcode} {data?.shippingAddress?.city}</Para>
                                            <Para>{data?.shippingAddress?.countryName}</Para>
                                            <Para>Tel. {data?.shippingAddress?.telephone}</Para>
                                        </div>
                                    </div>
                                    : <></>}
                                    {data?.order_detail_exists ?
                                <Para className='fs-15 line-6 fw-700 pb-5 lg-pb-4 pt-2'>Totaal {data?.items?.length} artikel(en)</Para>
:<></>
                                    }
                                <div className="productdetails">
                                    {
                                        data?.items?.length ?
                                            data?.items?.map((item, key, arg) => (
                                                <div className="items" key={`${orderTitle}${key}`}>
                                                    <div className='flex col w-1/1'>
                                                        <div className="py-7 lg-py-10">
                                                            <div className='flex col xl-flex xl-row gap-8 start w-1/1'>
                                                                <div className=" flex-0 flex">
                                                                    <div className="product__img flex relative center">
                                                                        <Link to={`/${item?.urlKey}`}aria-label={item?.productName} className='relative'>
                                                                            <Img src={handleImage(item?.productImage)} />
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                                <div className="flex col flex-1">
                                                                    <div className="flex">
                                                                        <div className="flex-1 flex col social__detail top">
                                                                            <Link to={`/${item?.urlKey}`} aria-label={item?.productName}>
                                                                                <h3 className="fw-700 line-7">{item?.productName}</h3>
                                                                            </Link>
                                                                            <div className="details__block flex col left w-1/1">
                                                                                <div className="flex w-1/1">
                                                                                    <div className="flex-1 pt-3 w-1/1">
                                                                                        <ListItems orderTitle={orderTitle} item={item} arg={arg} articleNumber={item?.productSku} number={item?.productQty} sku={item?.price} />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex-0">
                                                                            <h3 className="fw-700 fs-20 tr text-nowrap">{orderTitle === "Ordernummer" && data?.order_detail_exists ? item?.subTotal : item?.sub_total}</h3>
                                                                        </div>
                                                                    </div>
                                                                    <div className='deliveryTime r-5 mt-5 w-1/1 flex-1'>
                                                                        <div className="content py-5 pr-5 xxl-pr-20 pl-4">
                                                                            <div className="flex w-1/1 gap-3">
                                                                                <div className="flex-0">
                                                                                    <div className="icon">
                                                                                        <AccessTimeIcon />
                                                                                    </div>
                                                                                </div>

                                                                                {item?.odoo_delivery_details?.odoo_actual_delivery_date || item?.odoo_delivery_details?.odoo_expected_delivery_date ?
                                                                                    <React.Fragment>
                                                                                        {
                                                                                            item?.odoo_delivery_details?.odoo_actual_delivery_date ?
                                                                                                <div className="flex-1 flex col gap-1">
                                                                                                    <h3 className="fs-16 fw-700 line-6">Verwachte verzenddatum: {item?.odoo_delivery_details?.odoo_actual_delivery_date}</h3>

                                                                                                    {item?.odoo_delivery_details?.odoo_tracking_number ?
                                                                                                        <div className="odoo_deliverydays">
                                                                                                            <a href={item?.odoo_delivery_details?.odoo_tracking_url} className="fs-15 line-6">{item?.odoo_delivery_details?.odoo_tracking_number}</a>
                                                                                                        </div>
                                                                                                        : ""}
                                                                                                </div>
                                                                                                : item?.odoo_delivery_details?.odoo_expected_delivery_date ?
                                                                                                    <div className="flex-1 flex col gap-1">
                                                                                                        <h3 className="fs-16 fw-700 line-6">Verwachte verzenddatum: {item?.odoo_delivery_details?.odoo_expected_delivery_date}</h3>
                                                                                                        {item?.odoo_delivery_details?.odoo_expected_delivery_date ?
                                                                                                            <p className="fs-15 line-6">{item?.odoo_delivery_details?.odoo_delivery_comments}</p> : null

                                                                                                        }


                                                                                                    </div>
                                                                                                    : null}
                                                                                    </React.Fragment>

                                                                                    :

                                                                                    <div className="flex-1 flex col gap-1">
                                                                                        <h3 className="fs-16 fw-700 line-6">Verwachte verzenddatum: {item?.deliveryDays?.send_to_day} {item?.deliveryDays?.send_to_month} {item?.deliveryDays?.send_to_year}</h3>
                                                                                        <p className="fs-15 line-6" dangerouslySetInnerHTML={{ __html: `Bezorgopmerkingen: ${item?.deliveryDays?.text}` }}></p>
                                                                                    </div>
                                                                                }

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                            : !data?.order_detail_exists ?
                                           <div className="items" >
                                                    <div className='flex col w-1/1'>
                                                        <div className="py-7 lg-py-10">
                                                            <div className='flex col xl-flex xl-row gap-8 start w-1/1'>
                                                                <div className=" flex-0 flex">
                                                                    <div className="product__img flex relative center">
                                                                        <Link to="" aria-label={data?.product_name} className='relative'>
                                                                            <Img src="" />
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                                <div className="flex col flex-1">
                                                                    <div className="flex">
                                                                        <div className="flex-1 flex col social__detail top">
                                                                            <Link to={`/${data?.product_url_key}`} aria-label={data?.product_name}>
                                                                                <h3 className="fw-700 line-7">{data?.product_name}</h3>
                                                                            </Link>
                                                                           
                                                                        </div>
                                                                       
                                                                    </div>
                                                                   
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            : <></>
                                    }
                                </div>
                               
                                <div className="summary__block py-7 lg-py-10 flex right">
                                {  orderTitle === "Ordernummer" && data?.order_detail_exists ?
                                <table className="w-1/1">
                                    <tbody>
                                        <tr>
                                            <td>Digitale drukproef</td>
                                            <td>
                                                <b className="normal green">{data?.digitalProof === null ? 'Gratis' : data?.digitalProof}</b>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Instelkosten</td>
                                            {
                                                data?.setupCost === "" || data?.setupCost === "0,00" || data?.setupCost === "0" || data?.setupCost === 0 ? <td><b className="normal green">Gratis</b></td> : <td>{data?.setupCost}</td>
                                            }
                                        </tr>
                                        <tr>
                                            <td>Verzendkosten</td>
                                            {
                                                data?.postageCosts === "" || data?.postageCosts === "0,00" || data?.postageCosts === "0" || data?.postageCosts === 0 ? <td><b className="normal green">Gratis</b></td> : <td>{data?.postageCosts}</td>
                                            }
                                        </tr>

                                        {data?.productCostValue && Object.values(data?.productCostValue)?.map(item => (
                                            <tr>
                                                <td>{item?.label}</td>
                                                <td>{item?.productCost}</td>
                                            </tr>
                                        ))}
                                        {
                                            data?.couponCode ?
                                                <tr>
                                                    <td>Kortingscode ({data?.couponCode})</td>
                                                    <td>-{data?.coupon_amount}</td>
                                                </tr>
                                                : <></>
                                        }
                                        <tr className="fw-700 total">
                                            <td>Totaal (excl. BTW)	</td>
                                            <td>{data?.subTotals}</td>
                                        </tr>
                                        <tr>
                                            <td>BTW</td>
                                            <td>{data?.TaxAmount}</td>
                                        </tr>
                                        <tr>
                                            <td>Totaalbedrag</td>
                                            <td>{data?.totalWithVat}</td>
                                        </tr>
                                    </tbody>
                                </table>:
                              orderTitle === "Offertenummer"   ?
                                 <table className="w-1/1">
                                 <tbody>
                                     <tr>
                                         <td>Digitale drukproef</td>
                                         <td>
                                             <b className="normal green">{data?.digitalProof === null ? 'Gratis' : data?.digitalProof}</b>
                                         </td>
                                     </tr>
                                     <tr>
                                         <td>Instelkosten</td>
                                         {
                                             data?.setupCost === "" || data?.setupCost === "0,00" || data?.setupCost === "0" || data?.setupCost === 0 ? <td><b className="normal green">Gratis</b></td> : <td>{data?.setupCost}</td>
                                         }
                                     </tr>
                                     <tr>
                                         <td>Verzendkosten</td>
                                         {
                                             data?.postageCosts === "" || data?.postageCosts === "0,00" || data?.postageCosts === "0" || data?.postageCosts === 0 ? <td><b className="normal green">Gratis</b></td> : <td>{data?.postageCosts}</td>
                                         }
                                     </tr>

                                     {data?.productCostValue && Object.values(data?.productCostValue)?.map(item => (
                                         <tr>
                                             <td>{item?.label}</td>
                                             <td>{item?.productCost}</td>
                                         </tr>
                                     ))}
                                     {
                                         data?.couponCode ?
                                             <tr>
                                                 <td>Kortingscode ({data?.couponCode})</td>
                                                 <td>-{data?.coupon_amount}</td>
                                             </tr>
                                             : <></>
                                     }
                                     <tr className="fw-700 total">
                                         <td>Totaal (excl. BTW)	</td>
                                         <td>{data?.subTotals}</td>
                                     </tr>
                                     <tr>
                                         <td>BTW</td>
                                         <td>{data?.TaxAmount}</td>
                                     </tr>
                                     <tr>
                                         <td>Totaalbedrag</td>
                                         <td>{data?.totalWithVat}</td>
                                     </tr>
                                 </tbody>
                             </table>
                             :
                                 <></>
                                     }
                            </div>
                           
                                
                                <div className="flex col gap-y-5 sm-flex sm-row sm-space-between order__action sm-center sm-middle">
                                    <Button
                                        className='fs-14 back'
                                        onClick={() => navigate(-1)}
                                    ><span className="arrow">{`<`}</span>&nbsp;terug naar {orderTitle === "Ordernummer" ? 'bestellingen' : 'offerteaanvragen'}</Button>
                                    {
                                        orderTitle === "Ordernummer" && data?.displayReorder == 1 && data?.isSample !== '1' ?
                                            <Button
                                                className={`fs-13 fw-700 r-5 ${isProcessing ? 'rotateUpdate' : ''}`}
                                                onClick={() => reOrder()}
                                            >{isProcessing ? <AutorenewIcon /> : <>
                                                Opnieuw bestellen <Toggleup />
                                            </>}</Button>
                                            : <></>
                                    }
                                </div>
                            </BackgroundBox>
                    }
                </div>
            </div>
        </>
    )
}

export default memo(OrdersView);

const ListItems = ({ orderTitle, item, arg, articleNumber, number, sku }) => {
    const [showDetails, setShowDetails] = useState(false);
    const handleItemClick = () => {
        setShowDetails(!showDetails);
    }

    return (
        <>
            <div className="cart__details__options w-1/1">
                <table className='w-1/1'>
                    <tbody>
                        {
                            articleNumber ?
                                <tr>
                                    <td>
                                        <div className="fs-15">Artikelnummer</div>
                                    </td>
                                    <td>
                                        <div className="fs-15">{articleNumber}</div>
                                    </td>
                                </tr>
                                : <></>
                        }
                        {
                            number ?
                                <tr>
                                    <td>
                                        <div className="fs-15">Aantal</div>
                                    </td>
                                    <td>
                                        <div className="fs-15">{number}</div>
                                    </td>
                                </tr>
                                : <></>
                        }
                        {
                            sku ?
                                <tr>
                                    <td>
                                        <div className="fs-15">Prijs per stuk</div>
                                    </td>
                                    <td>
                                        <div className="fs-15">{sku}</div>
                                    </td>
                                </tr>
                                : <></>
                        }
                        {
                            showDetails && item?.options?.length ?
                                item?.options?.slice(0, item?.options?.length)?.map((option, ind) => (
                                    <tr key={`${orderTitle}itemOptions${ind}`}>
                                        <td>
                                            <div className="fs-15">{option?.label}</div>
                                        </td>
                                        <td>
                                            {
                                                option?.label === "Bestand(en)" ?
                                                    <div className="fs-15" dangerouslySetInnerHTML={{ __html: option?.value }}></div>
                                                    :
                                                    <div className="fs-15">{option?.value}</div>
                                            }
                                        </td>
                                    </tr>
                                )) : <></>
                        }
                        {
                            showDetails && item?.dropbox?.length ? (
                                <tr>
                                    <td>
                                        <div className="fs-15">Bestand(en)</div>
                                    </td>
                                    <td>
                                        {
                                            item?.dropbox?.[0] === 1 || item?.dropbox?.[0] === '1' ?
                                                <div className="fs-15">Ik lever het ontwerp later aan</div>
                                                :
                                                <div className="fs-15" dangerouslySetInnerHTML={{ __html: item?.dropbox?.[0].replace(/,/g, '') }}></div>
                                        }
                                    </td>
                                </tr>
                            ) : <></>
                        }

                    </tbody>
                </table>
            </div>
            {
                item?.options?.length ?
                    !showDetails ?
                        <button
                            className="mt-1 fs-14 text-underline fw-300"
                            onClick={() => handleItemClick()}
                            aria-label="button"
                        >
                            Bekijk details
                            <span className="flex middle">
                                <Toggledown />
                            </span>
                        </button>
                        :
                        <button
                            className="mt-1 fs-14 text-underline down fw-300"
                            onClick={() => handleItemClick()}
                            aria-label="button"
                        >
                            Verberg details
                            <span className="flex middle">
                                <Toggleup />
                            </span>
                        </button>
                    : <></>
            }
        </>
    )
}