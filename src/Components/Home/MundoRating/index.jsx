import React, { useState,useContext } from "react";
import "./styles.scss";
import DomainContext from "Context/DomainContext";

import Img from "Components/Img";
import Rating from "@mui/material/Rating";
import { SkeletonLine } from "Components/Skeletion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AccordionSidebar from "Components/AccordionSidebar/AccordionSidebar";
import Monduimage from "Res/images/home/mondu.png";

const MonduRating = () => {
  const loading = useSelector((state) => state?.HeaderFooterDataLoading);
  const { storeId } = useContext(DomainContext);
  const reviewMundu = useSelector((state) => state?.getHeaderFooterData?.data?.footer?.[0]);
  const navigate = useNavigate();
  const [isSampleCalled, setIsSampleCalled] = useState(false);
  const ratingPoints = typeof reviewMundu?.reviews?.kiyohReviews?.[0]?.avg_rating_year;
  const numerRating =
    ratingPoints === "string"
      ? parseFloat(reviewMundu?.reviews?.kiyohReviews?.[0]?.avg_rating_year)
      : reviewMundu?.reviews?.kiyohReviews?.[0]?.avg_rating_year;
  const [openModel, setOpenModel] = useState(false);
  const reviewImg = "/res/img/review.svg";
  const reviwText = reviewMundu?.reviews?.kiyohReviewsContent?.split('_');
  const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.includes('Firefox');

  const MonduImage = ({ src }) => (
    <div className="image__mondu__cover">
      <img
        className="monduBanner"
        loading={isFirefox ? undefined : 'lazy'} 
        draggable="false"
        src={src}
        alt="mondubaner"
        style={{ width: '100%', height: 'auto', opacity: 1 }}
      />
    </div>
  );

  const openInNewTab = () => {
    navigate('/kiyoh')
  };
  return (
    <React.Fragment>
      <div className="mondu__container">
        <div className={`container  pt-6 md-pt-6 xl-pt-8 pb-8 md-pb-10 xl-pb-12  px-4 `}>
          {
            loading ? (
              <div className="mondu__container_section flex col gap-10 xl-flex xl-row xl-gap-6">
                <div className="mondu relative flex-1 flex col gap-0 r-5 lg-flex lg-row gap-1 overflow-hidden">
                  <SkeletonLine height="243px" style={{ borderRadius: "5px" }} />
                </div>

                <div className="kiyoh relative flex-1 flex col gap-0 r-5 lg-flex lg-row gap-1 overflow-hidden">
                  <SkeletonLine height="243px" style={{ borderRadius: "5px" }} />
                </div>
              </div>
            ) : (
              <div className="mondu__container_section flex col gap-10 xl-flex xl-row xl-gap-6" >
                <div
                  className="mondu relative flex-1 flex col gap-0 r-5 lg-flex lg-row gap-1 overflow-hidden"
                  onClick={() => {
                    // navigate(`${reviewMundu?.mondu?.[0]?.paymentText}`)
                    window.location.href = `${window.location.origin}${reviewMundu?.mondu?.[0]?.paymentText}`;

                  }}
                >
                  <div className="relative content__mondu zindex-1 flex col gap-4 py-7 px-4  xl-px-8" >
                    <h3 className="fw-700">
                      {reviewMundu?.mondu?.[0]?.title}
                      <br />
                      {reviewMundu?.mondu?.[0]?.subContent}
                    </h3>
                    <button className="primary__btn fw-700" aria-label="button" onClick={() =>{
                    // navigate(`${reviewMundu?.mondu?.[0]?.paymentText}`) 
                    window.location.href = `${window.location.origin}${reviewMundu?.mondu?.[0]?.paymentText}`;
                    }}>{storeId==="1"?"Meer info":"Bekijk producten"}</button>
                  </div>
                  <div className="image__mondu giveaway_banner_mondu zindex-0">
                    <div className="image__mondu__cover">
                    <MonduImage src={reviewMundu?.mondu?.[0]?.image} />
                    </div>
                  </div>
                </div>
                {/* rating */}
                <div className="kiyoh relative flex-1 flex col gap-0 r-5 lg-flex lg-row gap-1 overflow-hidden" onClick={() => openInNewTab()} >
                  <div className="relative content__block space-between zindex-1 flex-1 flex col gap-4 py-7 xl-pl-8 pl-4 pr-3">
                    <div className="flex col">
                      <h3 className="fw-700">{reviwText?.[0]}</h3>
                      <h3 className="fw-700">{reviwText?.[1]}</h3>
                      <h3 className="fw-700">{reviwText?.[2]}</h3>
                    </div>
                    <button
                      className="primary__btn_review"
                      onClick={() => openInNewTab()}
                      aria-label="button"
                    >
                      Lees alle beoordelingen
                    </button>
                  </div>
                  <div className="image__block zindex-0 flex-1">
                    <div className="flex col center middle py-6 gap-4">
                      <div className="relative flex center middle">
                        <Img
                          src={reviewImg}
                          alt="reviewImg"
                          className="review__img"
                        />
                        <span className="rating_value">
                          {reviewMundu?.reviews?.kiyohReviews?.[0]?.avg_rating_year}
                        </span>
                      </div>
                      <Rating
                        name="half-rating-read"
                        value={numerRating / 2}
                        precision={0.5}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
     <AccordionSidebar
        openModel={openModel} setOpenModel={setOpenModel}
        setIsSampleCalled={setIsSampleCalled} isSampleCalled={isSampleCalled}
        tagUrl={reviewMundu?.mondu?.[0]?.tag_url} titleImage={Monduimage}
      />
    </React.Fragment>
  );
};

export default MonduRating;
