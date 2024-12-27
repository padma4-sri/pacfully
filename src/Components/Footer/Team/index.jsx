import React, { memo, useContext, useEffect, useRef, useState } from "react";
import "./styles.scss";
import { SkeletonLine } from "Components/Skeletion";
import { useSelector } from "react-redux";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import leftArrow from "Res/images/footer/rightArrow.webp";
import rightArrow from "Res/images/footer/leftArrow.webp";
import Img from "Components/Img";
import { useWindowSize } from "Utilities";
import RenderContext from "Context/RenderContext";

const Team = () => {
  const [width] = useWindowSize();
  const { loadPreRender } =useContext(RenderContext);
  const homePageLoading = useSelector((state) => state?.homePageLoading );
  const HeaderFooterDataLoading = useSelector((state) => state?.HeaderFooterDataLoading );
  const getFooterData = useSelector((state) => state?.getHeaderFooterData?.data?.footer?.[0]?.teamMembers );
  const teamSliderRef = useRef();
  const [teamSliderWidth,setTeamSliderWidth] = useState(0);
  const [deviceWidth,setDeviceWidth] = useState(0);
  const [hideNext, setHideNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef1, instanceRef] = useKeenSlider({
    loop: false,
    mode: "snap",
    slides: { perView: "auto" },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
      if(slider.track.details.abs === slider.track.details.maxIdx) setHideNext(true);
      else setHideNext(false);
    },
    created() {
      setLoaded(true);
    },
  });
  const [sliderRef2] = useKeenSlider({
    initial: 0,
    loop: false,
    mode: "snap",
    rtl: false,
    slides: { perView: "auto" },
  });

  useEffect(()=>{
    setTimeout(() => {
      setTeamSliderWidth(teamSliderRef?.current?.offsetWidth);
    }, 1000);
  },[teamSliderRef, getFooterData]);
  useEffect(()=>{
    setDeviceWidth(width);
  },[width]);
  const dataBlockEmpty = ["","","","","",""].map((item, index) => (
    <div
      className={`slide__item keen-slider__slide number-slide${index + 1}`}
      key={`team_empty_${index}`}
    >
      <div className="product__grid">
        <div className="block relative tc">
          <SkeletonLine animation="pulse" width="300px" height="370px" />
        </div>
      </div>
    </div>
  ));
  const dataBlock =   (!loadPreRender ? getFooterData?.teamMembersList : getFooterData?.teamMembersList?.slice(0, 4))?.map((item, index) => (
    <div
      className={`slide__item keen-slider__slide number-slide${index + 1}`}
      key={`team__${index}`}
    >
      <div className="product__grid">
      <div className="relative w-1/1 h-1/1">
        <div className="block relative tc">
          <Img src={item?.member_image} alt={item?.name} />
          <button className="absolute bottom-8 r-7 fw-700 py-2 px-6" aria-label="button">
            {item?.name}
          </button>
        </div>
      </div>
      </div>
    </div>
  ));

  return (
    <div className="team__container container-fluid pt-6 xl-pt-9">
      <div className="wrapper pt-7 pb-12 xxl-pt-15 xxl-pb-20">
        {homePageLoading && HeaderFooterDataLoading ? (
          <h1 className="title tc fw-700 pb-7 container px-3 md-px-4">
            <SkeletonLine
              animation="pulse"
              width="300px"
              height="30px"
              style={{ margin: "auto" }}
            />
          </h1>
        ) : (
          <div className="title tc pb-7 container px-3 md-px-4" dangerouslySetInnerHTML={{ __html: getFooterData?.descriptions }}>
            {/* {getFooterData?.descriptions} */}
          </div>
        )}
        <div className="sliders__block">
          {!(homePageLoading && HeaderFooterDataLoading) &&
          getFooterData?.teamMembersList?.length ? (
            <div className="navigation-wrapper"
            ref={teamSliderRef}
            style={{margin:"0 auto",maxWidth: instanceRef?.current?.slides?.[0]?.clientWidth * instanceRef?.current?.slides?.length ? 
              `${instanceRef?.current?.slides?.[0]?.clientWidth * instanceRef?.current?.slides?.length}px` : "100%"}}>
              <div
                ref={sliderRef1}
                className="keen-slider"
                style={{ maxWidth: "100%" }}
              >
                {dataBlock}
              </div>
              {
              loaded &&
                getFooterData.teamMembersList.length > 5 &&
                instanceRef.current && teamSliderWidth >= (deviceWidth - 50) && (
                  <div className="container relative">
                    <Arrow
                      left
                      onClick={(e) =>{
                        e.stopPropagation() || instanceRef.current?.prev()
                      }}
                      disabled={currentSlide === 0}
                    />

                    <Arrow
                      onClick={(e) => {
                        e.stopPropagation() || instanceRef.current?.next()
                      }}
                      disabled={hideNext}
                    />
                  </div>
                )}
            </div>
          ) : (
            <div
              ref={sliderRef2}
              className="keen-slider"
              style={{ maxWidth: "100%" }}
            >
              {dataBlockEmpty}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
function Arrow(props) {
  const disabeld = props.disabled ? " arrow--disabled" : "";
  return (
    <button
      className={`slick__arrow arrow ${
        props.left ? "left__arrow arrow--left" : "right__arrow arrow--right"
      } ${disabeld}`}
      aria-label="button"
      onClick={props.onClick}
    >
      {props.left && <Img src={leftArrow} />}
      {!props.left && <Img src={rightArrow} />}
    </button>
  );
}
export default memo(Team);
