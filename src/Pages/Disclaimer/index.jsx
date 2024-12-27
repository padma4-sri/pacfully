import React, { useState, useContext, memo } from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import Breadcrumb from "Components/Breadcrumb";
import { useEffectOnce } from "Components/Hooks/useEffectOnce";
import useScrollToTop from "Components/Hooks/useScrollToTop";
import { APIQueryGet } from "APIMethods/API";
import Seo from "Components/Seo/Seo";
import { LineLoader, SkeletonLoader } from "Components/Skeletion";

function Disclaimer() {
  useScrollToTop();
  const { defaultURL, storeId } = useContext(DomainContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const options = {
    isLoader: true,
    loaderAction: (bool) => setLoading(bool),
    setGetResponseData: (resData) => {
      setData(resData?.data[0]);
    },
    axiosData: {
      url: `${defaultURL}/getstaticpage?storeId=${storeId}&urlKey=disclaimer`,
     
    },
  };

  const breadCrumbData = [
    {
      categoryName: "Disclaimer",
      urlKey: "",
      catId: "",
    },
  ];

  const loadingBlock = (
    ['', '', ''].map((elem, key) => (
      <div className="flex col gap-1 py-6" key={`disclaimerLoader${key}`}>
        <LineLoader width="50%" height="27px" className="my-2" />
        <SkeletonLoader length={5} />
      </div>
    ))
  );

  // render once
  useEffectOnce(() => {
    APIQueryGet(options);
  });
  return (
    <>
      <Seo
        metaTitle={data?.metaTitle}
        metaDescription={data?.metaDescription}
        metaKeywords={data?.metaKeywords}
      />
      <div className="py-4">
        <Breadcrumb data={breadCrumbData} />
      </div>
      <div className="container px-4 ">
        {
          loading ?
            <React.Fragment>
              <h3 className="fs-32 fw-700 mb-8">
                <LineLoader width="50%" height="42px" />
              </h3>
              <SkeletonLoader length={2} />
              {loadingBlock}
            </React.Fragment>
            :
            <div dangerouslySetInnerHTML={{ __html: data?.content }} />
        }
      </div>
    </>
  );
}

export default memo(Disclaimer);
