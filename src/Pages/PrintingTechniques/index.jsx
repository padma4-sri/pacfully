import React, { useState, useContext, memo } from "react";
import DomainContext from "Context/DomainContext";
import Img from "Components/Img";
import "./styles.scss";
import Breadcrumb from "Components/Breadcrumb";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffectOnce } from "Components/Hooks/useEffectOnce";
import { APIQueryGet } from "APIMethods/API";
import useScrollToTop from "Components/Hooks/useScrollToTop";
import Seo from "Components/Seo/Seo";
import { SkeletonImg, SkeletonLine, SkeletonLoader } from "Components/Skeletion";

function PrintingTechniques() {
  useScrollToTop();
  const { defaultURL, storeId } = useContext(DomainContext);
  const [loading, setLoading] = useState(true);

  const [openItems, setOpenItems] = useState([]);
  const [data, setData] = useState(null);
  const seoData = data?.[0]?.seo;

  function handleItemClick(index) {
    if (openItems.includes(index)) {
      setOpenItems((prevItems) => prevItems.filter((item) => item !== index));
    } else {
      setOpenItems((prevItems) => [...prevItems, index]);
    }
  }
 
  const breadCrumbData = [
    {
      categoryName: "Druktechnieken",
      urlKey: "",
      catId: "",
    },
  ];

  function getVideoID(youtubeURL) {
    const url = new URL(youtubeURL);
    const searchParams = new URLSearchParams(url?.search);
    return searchParams.get("v");
  }

  const loadingBlock = (
    ['', '', '', '', ''].map((_, key) => (
      <div className="flex col gap-1 py-6" key={`disclaimerLoader${key}`}>
        <SkeletonLine
          animation="pulse"
          width="200px"
          height="27px"
          className="mb-4"
          style={{ borderRadius: "5px" }}
        />
        <SkeletonLoader length={5} />
      </div>
    ))
  );

  const options = {
    isLoader: true,
    loaderAction: (bool) => setLoading(bool),
    setGetResponseData: (resData) => {
      setData(resData?.data);
    },
    axiosData: {
      url: `${defaultURL}/getPrintingTechniques?data[storeId]=${storeId}&data[typeUrl]=printing-techniques`,
     
    },
  };

  useEffectOnce(() => {
    APIQueryGet(options);
  });

  return (
    <React.Fragment>
      <Seo
        metaTitle={seoData?.metaTitle}
        metaDescription={seoData?.metaDescription}
        metaKeywords={seoData?.metaKeywords}
      />
      <div className="pt-4">
        <Breadcrumb data={breadCrumbData} />
        <div className="container px-4">
          <div className="printing__techniques">
            {loading ? (
              <>
                <div className="main__section py-4">
                  <h3 className="fs-32 fw-700 mb-4">
                    <SkeletonLine
                      animation="pulse"
                      width="250px"
                      height="42px"
                      style={{ borderRadius: "5px" }}
                    />
                  </h3>
                  <div className="flex col lg-flex lg-row lg-gap-8  center  middle">
                    <div className="line-6 section main__description flex-1 flex col gap-1 w-1/1 pb-5 lg-pb-0">
                      <SkeletonLoader length={5} />
                    </div>
                    <div className="flex about__img relative">
                      <SkeletonImg
                        animation="pulse"
                        width="100%"
                        height="215px"
                        style={{ borderRadius: "10px" }}
                      />
                    </div>
                  </div>
                </div>
                {loadingBlock}
              </>
            ) : (
              data?.length ?
                <>
                  <div className="main__section py-4">
                    <h4 className="fs-32 fw-700 pb-4">{data[1]?.faq_type_name}</h4>
                    <div className="flex col lg-flex lg-row lg-gap-8  center  middle">
                      <div className="line-6 section main__description flex-1">
                        <p className="fs-15 pb-6" dangerouslySetInnerHTML={{ __html: data[1]?.faq_type_description }} />
                      </div>
                      <div className="flex about__img relative">
                        <Img
                          type="img"
                          src={data[1]?.faq_type_cover_image}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contained",
                          }}
                          alt={data[1]?.faq_type_name}
                        />
                        <div className="hide lg-block lg-flex absolute w-1/1 h-1/1" style={{ paddingTop: "59.83%" }}>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    {data[1]?.categories?.map((item, ind) => (
                      <div className="pb-8 pt-4" key={ind}>
                        <h3 className="fs-20 fw-700 pb-4">
                          {item?.faq_type_category_name}
                        </h3>
                        {item?.details?.map((items, index) => (
                          <>
                            <div
                              className={`toggle pointer flex ${item?.details?.length === (index + 1) ? '' : 'pb-5'} middle gap-2`}
                              key={index}
                              onClick={() => handleItemClick(items?.faq_id)}
                            >
                              <span
                                className="flex middle up__arrow pointer"
                              >
                                {openItems?.includes(items?.faq_id) ? (
                                  <KeyboardArrowUpIcon />
                                ) : (
                                  <KeyboardArrowDownIcon />
                                )}
                              </span>
                              <h3
                                className="fs-15 fw-700 pointer"
                              >
                                {items?.faq_title}
                              </h3>
                            </div>
                            {openItems?.includes(items?.faq_id) && (
                              <div className="pb-4">
                                {
                                  items?.faq_video_url || items?.faq_detail_description ?
                                    <div className="flex col lg-row lg-flex lg-gap-16 xl-flex xl-flex  center middle pt-0 pb-4 lg-pt-4 lg-pb-4 xl-w-1/1">
                                      <div className={`line-6 section__one w-1/1 ${items?.faq_video_url ? 'lg-w-1/2' : 'lg-w-1/1'} pl-7`}>
                                        <p className="fs-15 pb-6" dangerouslySetInnerHTML={{
                                          __html: items?.faq_detail_description,
                                        }}>
                                        </p>
                                      </div>
                                      {
                                        items?.faq_video_url ?
                                          <div className="w-1/1 lg-w-1/2 flex right relative pl-7 lg-pl-0">
                                            <div
                                              className="about__img__one relative w-1/1"
                                              style={{
                                                background: "#f2f2f2",
                                                overflow: "hidden",
                                              }}
                                            >
                                              {items?.faq_video_url ? (
                                                <iframe
                                                  className="w-1/1 h-1/1"
                                                  style={{
                                                    width: "100%",
                                                    height: "277px",
                                                  }}
                                                  src={`https://www.youtube.com/embed/${getVideoID(
                                                    items?.faq_video_url
                                                  )}?controls=0`}
                                                  title="YouTube video player"
                                                  frameBorder="0"
                                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                  allowFullScreen
                                                ></iframe>
                                              ) : <></>
                                              }
                                            </div>
                                          </div>
                                          : <></>
                                      }
                                    </div>
                                    : <></>
                                }
                                <div className="flex col gap-2 lg-row lg-flex lg-gap-16 xl-flex xl-flex center middle py-4 xl-w-1/1">
                                  {
                                    items?.faq_image ?
                                      <div className="w-1/1 xl-w-1/2">
                                        <div className="pb-4 ml-7 lg-ml-13">
                                          <div className="about__img__one relative w-1/1">
                                            <Img
                                              type="img"
                                              src={items?.faq_image}
                                              className="absolute top-0 w-1/1 h-1/1"
                                              alt={items?.faq_title}
                                            />
                                            <div className="flex w-1/1 h-1/1" style={{ paddingTop: "60.07%" }}></div>
                                          </div>
                                        </div>
                                      </div>
                                      : <></>
                                  }
                                  <div
                                    className={`w-1/1 line-6 section__one ${!items?.faq_image ? 'xl-w-1/1 noimage' : 'xl-w-1/2'} printing__list pl-7 lg-pl-0`}
                                    dangerouslySetInnerHTML={{
                                      __html: items?.faq_detail_list,
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        ))}
                      </div>
                    ))}
                  </div>
                </> : <></>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default memo(PrintingTechniques);
