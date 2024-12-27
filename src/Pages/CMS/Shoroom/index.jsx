import React, { useState, useContext, memo } from 'react';
import DomainContext from "Context/DomainContext";
import Breadcrumb from 'Components/Breadcrumb';
import './styles.scss';
import { APIQueryGet } from 'APIMethods/API';
import Img from 'Components/Img';
import useScrollToTop from 'Components/Hooks/useScrollToTop';
import { useEffectOnce } from 'Components/Hooks/useEffectOnce';
import Seo from 'Components/Seo/Seo';
import { flag1, flag2 } from 'Res/images';
import { LineLoader, SkeletonImg, SkeletonLoader } from "Components/Skeletion";

const Shoroom = () => {
    const { defaultURL, storeId } = useContext(DomainContext);
    useScrollToTop();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const seoData = data?.[0]?.seo;

    const breadCrumbData = [{
        categoryName: "Showroom",
        urlKey: "",
        catId: "",
    }];

    const options = {
        isLoader: true,
        loaderAction: (bool) => setLoading(bool),
        setGetResponseData: (resData) => {
            setData(resData?.data);
        },
        axiosData: {
            url: `${defaultURL}/showroom?storeId=${storeId}&urlKey="showroom"`,
           
        },
    };
    // render once
    useEffectOnce(() => APIQueryGet(options));

    const timingLoader = <div className="flex col flex-1">
        <LineLoader height="28px" width="70%" className="mb-4" />
        <SkeletonLoader height="24px" length={7} full={true} />
    </div>;
    return (
        <React.Fragment>
            <Seo
                metaTitle={seoData?.metaTitle}
                metaDescription={seoData?.metaDescription}
                metaKeywords={seoData?.metaKeywords}
            />
            <div className='shorooms pt-4 pb-10 md-pb-20'>
                <Breadcrumb data={breadCrumbData} />
                <div className='page__container container px-4 pt-5'>
                    <div className="showroom__image flex relative flex-1 pb-12">
                        {
                            loading ?
                                <SkeletonImg
                                    animation="pulse"
                                    width="100%"
                                    height="364px"
                                    style={{ borderRadius: "10px" }}
                                />
                                :
                                <Img src={data?.[1]?.banner?.showroom_banner_image} alt={data?.[1]?.banner?.sub_header_text} />
                        }
                    </div>
                    {
                        loading ?
                            <div className="showroom__info__wrapper">
                                <LineLoader width="70%" height="40px" className='mb-3' />
                                <LineLoader height="230px" />
                                <div className="flex col lg-flex lg-row gap-11 lg-flex pt-11">
                                    {timingLoader}
                                    {timingLoader}
                                </div>
                            </div> :
                            <div className="showroom__info__wrapper">
                                <h1 className='fs-32 line-10 pb-3 fw-700'>{data?.[1]?.banner?.sub_header_text}</h1>
                                <div className="flex col xxl-flex xxl-row gap-11 xxl-gap-12">
                                    <div className="flex col info">
                                        <p className='fs-15 line-7 pb-7'>{data?.[1]?.banner?.sub_header_content}</p>
                                        <p className='fs-15 line-7 pb-3'>{data?.[1]?.banner?.sub_header_contact}</p>
                                        <p className='fs-15 line-7 pb-3'>{data?.[1]?.banner?.sub_header_button}</p>
                                    </div>
                                </div>
                                <div className="flex col lg-flex lg-row gap-11 lg-flex pt-11">
                                    <div className="flex col flex-1">
                                        <h2 className='fs-20 line-7 fw-700 pb-4'>{data?.[2]?.location?.contact_header_text}</h2>
                                        <p className='fs-15 line-7'>{data?.[2]?.location?.location_header_text}</p>
                                        <p className='fs-15 line-7'>{data?.[2]?.location?.street} {data?.[2]?.location?.door_no}</p>
                                        <p className='fs-15 line-7'>{data?.[2]?.location?.postal_code} {data?.[2]?.location?.city}</p>
                                        <p className='fs-15 line-7'>{data?.[2]?.location?.country}</p>
                                        <div className="contact flex col">
                                            <div className="flex icon telephone middle fs-15 line-7">
                                                <p className='lable flex space-between pr-1'>Telefoon:&nbsp;</p>
                                                <div className="flex center middle relative">
                                                    <Img type="img" src={flag1} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contained" }} className="mr-2" />
                                                    <a className='fs-15 line-7 hover__underline' href={`tel: ${data?.[3]?.phone?.promary_number}`}>{data?.[3]?.phone?.promary_number}</a>
                                                </div>
                                            </div>
                                            <div className="flex icon telephone middle fs-15 line-7">
                                                <p className='lable flex space-between pr-1'>Telefoon België:&nbsp;</p>
                                                <div className="flex center middle relative">
                                                    <Img type="img" src={flag2} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contained" }} className="mr-2" />
                                                    <a className='fs-15 line-7 hover__underline' href={`tel: ${data?.[3]?.phone?.additional_number}`}>{data?.[3]?.phone?.additional_number}</a>
                                                </div>
                                            </div>
                                            <div className="flex icon whatsaap middle fs-15 line-7">
                                                <p className='lable flex space-between pr-1'>E-mail:</p>
                                                <a className="fs-15 line-7 text-underline" href={`mailto: ${data?.[4]?.email?.email_id}`} target="__blank">{data?.[4]?.email?.email_id}</a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex col timings flex-1">
                                        <h2 className='fs-20 line-7 fw-700 pb-4'>Openingstijden</h2>
                                        {
                                            data?.[7]?.working_hours &&
                                            Object.keys(data?.[7]?.working_hours).map((key, ind) => (
                                                <div className="flex gap-9" key={`showRoomHoursKey${ind}`}>
                                                    <p className='fs-15 line-7 capitalize'>{Object.keys(data?.[7]?.working_hours)?.[ind]}</p>
                                                    <p className='fs-15 line-7'>{data?.[7]?.working_hours[key]}</p>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

export default memo(Shoroom);