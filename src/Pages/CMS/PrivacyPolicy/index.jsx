import React, { useState, useContext, memo } from 'react';
import DomainContext from "Context/DomainContext";
import Breadcrumb from 'Components/Breadcrumb';
import './styles.scss';
import { APIQueryGet } from 'APIMethods/API';
import useScrollToTop from 'Components/Hooks/useScrollToTop';
import { useEffectOnce } from 'Components/Hooks/useEffectOnce';
import Seo from 'Components/Seo/Seo';
import { LineLoader, SkeletonLoader } from 'Components/Skeletion';

const PrivacyPolicy = () => {
    const { defaultURL, storeId } = useContext(DomainContext);
    useScrollToTop();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    const breadCrumbData = [{
        categoryName: "Privacy",
        urlKey: "",
        catId: ""
    }];

    const options = {
        isLoader: true,
        loaderAction: (bool) => setLoading(bool),
        setGetResponseData: (resData) => {
            setData(resData?.data?.[0]);
        },
        axiosData: {
            url: `${defaultURL}/getstaticpage?storeId=${storeId}&urlKey=privacy`,
          
        },
    };
    // render once
    useEffectOnce(() => APIQueryGet(options));

    const titleBlock = <LineLoader width="50%" height="28px" />;
    return (
        <React.Fragment>
            <Seo
                metaTitle={data?.metaTitle}
                metaDescription={data?.metaDescription}
                metaKeywords={data?.metaKeywords}
            />
            <div className='privacy__policy pt-4 pb-10 md-pb-20'>
                <Breadcrumb data={breadCrumbData} />
                <div className='page__container container px-4 pt-6'>
                    {
                        loading ?
                            <div className="flex col gap-4">
                                {titleBlock}
                                {
                                    ["", "", "", "", ""].map((elem, ind) => (
                                        <div className="flex col gap-3" key={`privacyKyes${ind}`}>
                                            <div className="pb-4">{titleBlock}</div>
                                            <SkeletonLoader length={8} pclassName="flex col gap-2" />
                                        </div>
                                    ))
                                }
                            </div>
                            : <div className='fs-15 line-6' dangerouslySetInnerHTML={{ __html: data?.content }}></div>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

export default memo(PrivacyPolicy);