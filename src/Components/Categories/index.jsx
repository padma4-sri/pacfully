import React, { useRef, useState } from 'react';
import "./styles.scss";
import { Link } from 'react-router-dom';
import { SkeletonLine, SkeletonImg } from 'Components/Skeletion';
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import leftArrow from 'Res/images/footer/rightArrow.webp';
import rightArrow from 'Res/images/footer/leftArrow.webp';
import Img from 'Components/Img';
import { useWindowSize } from "Utilities";
import AdvancedLink from 'Components/AdvancedLink';

const Categories = ({ className = '', keyValue, loading = false, data = [], title = "", isPageValid }) => {
  const [width] = useWindowSize();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [hover, setHover] = useState(false);
  const [sliderRef11, instanceRef] = useKeenSlider({
    loop: false,
    mode: "free-snap",
    rtl: false,
    slides: { perView: "auto" },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true);
    },
  });
  const [sliderRef22] = useKeenSlider({
    initial: 0,
    loop: false,
    mode: "free-snap",
    rtl: false,
    slides: { perView: "auto" },
  });
  const linkRef = useRef();
  const linkWidth = linkRef?.current?.offsetWidth;
  const dataBlockEmpty = ['','','','','','','']?.map((_, index, arr) => (
    <div className={`keen-slider__slide categoryItem number-slide${index + 1}`} key={`categoryItem_${index}`}>
      <div className='categoryBlock'>
        <div className="ImageBlock relative">
          <Link
            to={`/`}
            aria-label={"home"}
            onClick={(e) => e.preventDefault()}
            className='block w-1/1 h-1/1 center middle'
          >
             <SkeletonImg className="flex absolute top-0 left-0 zindex-1" style={{ borderRadius: "50%" }} />
          </Link>
        </div>
        <h2 className='tc pt-3 flex center'><SkeletonLine animation="pulse" width='150px' height='25px' /></h2>
      </div>
    </div>
  ));
  const dataBlock = data?.map((item, index) => (
    <div className={`keen-slider__slide categoryItem number-slide${index + 1}`} key={`home__popular__categories${index}`}>
      <div className='categoryBlock flex col gap-2'>
        <div className="ImageBlock relative">
          <AdvancedLink
            to={`/${item?.urlKey}`}
            
            className='absolute top-0 left-0 w-1/1 h-1/1'
          >
            <Img src={item?.imageUrl} alt={item?.name} />
          </AdvancedLink>
        </div>
        <h2 className='tc pt-3' ref={linkRef} lang="en">
          <AdvancedLink
            to={`/${item?.urlKey}`}
            className='block w-1/1 h-1/1 center middle fw-700 '
            style={{ width: `${linkWidth}px` }}
            state={{
              urlType: {
                "entityType": "category",
                "level": isPageValid === "homepage" ? "2" :"3",
                "isChildExist": 1
            }
            }}
          >
            {item?.name}
          </AdvancedLink>
        </h2>
      </div>
    </div>
  ));

  return (
    <div className={`home__topcategories ${className} w-1/1 overflow-hidden`} style={{minWidth: "100%",}} key={keyValue}>
      <div className={`container pt-3 xl-pt-6 pb-6 xl-pb-9 xxl-px-4`} >
      {title && 
        <div className="title__section  pb-6 px-4 xxl-px-0">
          <h1 className="fw-700 line-9">{title}</h1>
        </div>}
        <div className="sliders__block relative zindex-0">
          <div className="slider__wrapper">
            {!loading && data && data?.length ? (
              <div><div className='leftTransparentSlider' onMouseLeave={() => setHover(false)}></div>
                <div className={`navigation-wrapper ${hover ? "hover" : ""}`}>
                  <div ref={sliderRef11} className={`keen-slider sliderLeftRightVisible keenSliderOverflow ${hover? "sliderFadeShow" : "sliderFadeHide"}`} onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ maxWidth: "100%" }}>
                    {dataBlock}
                  </div>
                  {loaded && data.length > 6 && instanceRef.current && (
                    <>
                      <Arrow
                        left
                        setHover={setHover}
                        onClick={(e) => {
                          const prevCount = instanceRef?.current?.track?.details?.abs - 6;
                          e.stopPropagation() || width > 1250 ?
                            (prevCount > -1 ?
                              instanceRef.current?.moveToIdx(prevCount)
                              : instanceRef.current?.moveToIdx(0))
                            : instanceRef.current?.prev();
                        }}
                        disabled={currentSlide === 0}
                      />

                      <Arrow
                        setHover={setHover}
                        onClick={(e) => {
                          const nextCount = instanceRef?.current?.track?.details?.abs + 6;
                          e.stopPropagation() || width > 1250 ?
                            (nextCount < (instanceRef?.current?.track?.details?.slides?.length - 6) ?
                              instanceRef.current?.moveToIdx(nextCount)
                              : instanceRef.current?.moveToIdx(instanceRef?.current?.track?.details?.slides?.length - 6))
                            : instanceRef.current?.next();
                        }}
                        disabled={
                          currentSlide ===
                          instanceRef?.current?.track?.details?.slides?.length - 6
                        }
                      />
                    </>
                  )}
                </div>
                <div className='rightTransparentSlider' onMouseLeave={() => setHover(false)}></div>
              </div>
            ) : <>{
              loading &&
              <div ref={sliderRef22} className="keen-slider" style={{ maxWidth: "100%" }}>
                {dataBlockEmpty}
              </div>
            }</>}
          </div>
        </div>
      </div>
    </div>
  )
}

function Arrow(props) {
  const disabeld = props.disabled ? " arrow--disabled" : ""
  const setHover = props?.setHover;
  return (
    <button
      aria-label="button"
      className={`slick__arrow arrow ${props.left ? "left__arrow arrow--left" : "right__arrow arrow--right"
        } ${disabeld}`}
      onClick={props.onClick}
      onMouseEnter={() => {
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
    >
      {props.left && (
        <Img src={leftArrow} />
      )}
      {!props.left && (
        <Img src={rightArrow} />
      )}
    </button>
  )
}
export default Categories;