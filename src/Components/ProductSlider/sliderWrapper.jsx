import React, { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import Img from "Components/Img";
import leftArrow from "Res/images/footer/rightArrow.webp";
import rightArrow from "Res/images/footer/leftArrow.webp";
import { useSelector } from "react-redux";

const SliderWrapper = ({
  data = [],
  width,
  showToGo,
  dataBlockEmpty,
  dataBlock,
  loaded,
  setLoaded,
  setOnSilde,
  disableSlider,
  title,
  setSecondTrigger,
  index,
  pageName,
  disableAPIcall,
  setDisableAPIcall
}) => {
  const recentProducts = useSelector(state => state?.recentProducts);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hover, setHover] = useState(false);
  const [initial, setInitial] = useState(0);
  const [sliderKey, setSliderKey] = useState(0);
    const AdaptiveHeight = (slider) => {
      function updateStarted() {
        setOnSilde(true)
      }
      function updateEnded() {
        setOnSilde(false)
      }
      slider.on("animationStarted", updateStarted)
      slider.on("animationEnded", updateEnded)
    }
    const [sliderRef1, sliderInstance1] = useKeenSlider({
      initial: initial,
      loop: false,
      rtl: false,
      slides: { perView: "auto" },
      mode: "free-snap",
      drag: !disableSlider,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      }
    }, [AdaptiveHeight]);
  
    const [sliderRef2] = useKeenSlider({
      initial: 0,
      loop: false,
      rtl: false,
      slides: { perView: "auto" },
    });

    useEffect(() => {
      if (title === 'Recently viewed') {
        setInitial(1);
        setTimeout(() => {
          setInitial(0);
        }, 300);
      }
    }, [recentProducts]);
  
    useEffect(() => {
      // This will force a re-render of the slider component
      setSliderKey(prevKey => prevKey + 1);
    }, [data]);
    
    const handleArrowFunction=(e)=>{
        const nextCount = sliderInstance1?.current?.track?.details?.abs + 4;
        e.stopPropagation() || width > 1250 ?
          (nextCount < (sliderInstance1?.current?.track?.details?.slides?.length - 4) ?
            sliderInstance1.current?.moveToIdx(nextCount)
            : sliderInstance1.current?.moveToIdx(sliderInstance1?.current?.track?.details?.slides?.length - 4))
          : sliderInstance1.current?.next();
             if(pageName === "plp1" && setSecondTrigger !==undefined && !disableAPIcall){
              setSecondTrigger(index + 1)
              setDisableAPIcall(true)
     }
    }
    return (
      <div className="slider__wrapper" key={sliderKey}>
        {data.length ? (
          <div> <div className='leftTransparentSlider' onMouseLeave={() => setHover(false)}></div>
            <div className={`navigation-wrapper ${hover ? "hover" : ""}`}>
              <div
                ref={sliderRef1}
                className={`keen-slider sliderLeftRightVisible ${hover? "sliderFadeShow" : "sliderFadeHide"} ${disableSlider?'flex':'flex'}`} 
                style={{ maxWidth: "100%" }}
                onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)} 
              >
                {dataBlock}
              </div>
              {(showToGo ? loaded && data.length > 3 && sliderInstance1.current : loaded && data.length > 4 && sliderInstance1.current) && (
                <>
                  <Arrow
                    left
                    setHover={setHover}
                    onClick={(e) => {
                      const prevCount = sliderInstance1?.current?.track?.details?.abs - 4;
                      e.stopPropagation() || width > 1250 ?
                        (prevCount > -1 ?
                          sliderInstance1.current?.moveToIdx(prevCount)
                          : sliderInstance1.current?.moveToIdx(0))
                        : sliderInstance1.current?.prev();
                    }}
                    disabled={currentSlide === 0}
                  />
  
                  <Arrow
                    setHover={setHover}
                    onClick={(e) =>handleArrowFunction(e)}
                    disabled={
                      currentSlide ===
                      sliderInstance1?.current?.track?.details?.slides?.length - 4
                    }
                    setSecondTrigger={setSecondTrigger}
                    setDisableAPIcall={setDisableAPIcall}
                    disableAPIcall={disableAPIcall}
                    indexVal={index}
                    pageName={pageName}
                  />
                </>
              )}
            </div>
            <div className='rightTransparentSlider' onMouseLeave={() => setHover(false)}></div>
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
    )
  }

function Arrow(props) {
  const disabeld = props.disabled ? " arrow--disabled" : "";
  const setHover = props?.setHover;
  return (
    <button
      className={`slick__arrow arrow ${props.left ? "left__arrow arrow--left" : "right__arrow arrow--right"
        } ${disabeld}`}
      onClick={props.onClick}
      onMouseEnter={() => {
        if (props?.setSecondTrigger !== undefined && !props?.disableAPIcall) {
          props?.setSecondTrigger(props?.indexVal + 1);
          props?.setDisableAPIcall(true);
        }
        setHover(true)
      }}
      aria-label="button"
      onMouseLeave={() => {
        setHover(false)
      }}
    >
      {props.left && <Img src={leftArrow} />}
      {!props.left && <Img src={rightArrow} />}
    </button>
  );
}
  export default SliderWrapper;