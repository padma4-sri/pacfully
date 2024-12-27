import React, { useState, useContext, memo } from 'react';
import DomainContext from "Context/DomainContext";
import Breadcrumb from 'Components/Breadcrumb';
import './styles.scss';
import { APIQueryGet } from 'APIMethods/API';
import Button from 'Components/Common/Button';
import useScrollToTop from 'Components/Hooks/useScrollToTop';
import { useEffectOnce } from 'Components/Hooks/useEffectOnce';
import Seo from 'Components/Seo/Seo';
import { LineLoader, SkeletonLoader } from 'Components/Skeletion';
import Img from 'Components/Img';

const TermsConditions = () => {
    const { defaultURL, storeId } = useContext(DomainContext);
    useScrollToTop();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
    const seoData = data?.seo;

    const breadCrumbData = [{
        categoryName: "Algemene voorwaarden",
        urlKey: "",
        catId: "",
    }];

    const options = {
        isLoader: true,
        loaderAction: (bool) => setLoading(bool),
        setGetResponseData: (resData) => {
            setData(resData?.data?.[0]);
        },
        axiosData: {
            url: `${defaultURL}/termsconditions?storeId=${storeId}`,
            
        },
    };
    // render once
    useEffectOnce(() => APIQueryGet(options));
    return (
        <React.Fragment>
            <Seo
                metaTitle={seoData?.metaTitle}
                metaDescription={seoData?.metaDescription}
                metaKeywords={seoData?.metaKeywords}
            />
            <div className='terms__conditions pt-4 pb-10 md-pb-20'>
                <Breadcrumb data={breadCrumbData} />
                <div className='page__container container px-4 pt-6'>
                    {
                        loading ?
                            <React.Fragment>
                                <h2 className='fs-24 line-7 mb-6 fw-700'>
                                    <LineLoader width="50%" height="30px" />
                                </h2>
                                <SkeletonLoader pclassName='flex col gap-2 fs-15 mb-5' height="24px" length={2} />
                                <LineLoader width="250px" height="50px" className="mb-5" borderRadius="32px" />
                                <SkeletonLoader pclassName='flex col gap-2 pt-8 bottom__text' height="24px" length={2} />
                            </React.Fragment> :
                            <React.Fragment>
                                <h2 className='fs-24 line-7 pb-6 fw-700'>{data?.header_text}</h2>
                                <p className='fs-15 line-6 pb-5'>{data?.para_text1}</p>
                                <Button
                                    className="r-8 px-3 sm-px-10 py-3 pointer fs-14 xs-fs-16 fw-700 relative"
                                    onClick={() => window.open(data?.pdf_file)}
                                >

                                    <Img src={data?.image} className='container'/>&nbsp;&nbsp;{data?.download_pdf_text}
                                </Button>
                                <div className='pt-8 bottom__text'>
                                    <p className='fs-15 line-6' dangerouslySetInnerHTML={{ __html: data?.para_text2 }}></p>
                                </div>
                            </React.Fragment>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

export default memo(TermsConditions);