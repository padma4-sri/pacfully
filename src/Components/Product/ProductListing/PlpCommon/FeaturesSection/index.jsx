import "./styles.scss";
import Img from "Components/Img";
import { SkeletonLine } from "Components/Skeletion";
import { useKeenSlider } from "keen-slider/react";
import { useWindowSize } from "Utilities";

const FeatureItems = ({ data = [], isPlp1 }) => {
  const [width] = useWindowSize();

  const [sliderRef1] = useKeenSlider({
    loop: isPlp1 && width >= 1250 ? false : true,
    mode: "snap",
    rtl: false,
    slides: { perView: "auto" }
  },
    [
      (slider) => {
        let timeout
        let mouseOver = false
        function clearNextTimeout() {
          clearTimeout(timeout)
        }
        function nextTimeout() {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 2000)
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on("dragStarted", clearNextTimeout)
        slider.on("animationEnded", nextTimeout)
        slider.on("updated", nextTimeout)
      },
    ]
  );

  return <div className="flex row w-1/1">
    <div
      ref={sliderRef1}
      className="keen-slider sliderLeftRightVisible"
      style={{ maxWidth: "100%" }}
    >
      {
        data?.map((item, index) => (
          <div
            className={`keen-slider__slide number-slide${index + 1}`}
            key={`FeaturesSection${item?.name}${index}`}
          >
            <div className="flex gap-3 middle center">
              <div className="flex-0 flex center middle ">
                <div className="socialicon__img relative">
                  <Img
                    src={item?.image}
                    className="w-1/1 h-1/1"
                    style={{ objectFit: "contain" }}
                    alt={item?.name}
                  />
                </div>
              </div>
              <div className=" flex col gap-1 ">
                <h3 className="fw-700 line-5 fs-16">{item?.name}</h3>
                <p className="line-5 fs-12">{item?.info}</p>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  </div>
}

const FeatureDetails = ({ data = {}, className = "" }) => {
  const windowSize = useWindowSize();
  const [sliderRef2] = useKeenSlider({
    loop: false,
    mode: "snap",
    rtl: false,
    slides: { perView: "auto" }
  });
  return <div
    ref={sliderRef2}
    className={`keen-slider sliderLeftRightVisible ${className}`}
    style={{ maxWidth: "100%" }}
  >
    <div className={`features__section feature__details flex middle w-1/1 px-4 lg-px-6 w-1/1`}>
      <div className="flex row w-1/1 left w-1/1">
        <div className="details flex left w-1/1 lg-overflow-hidden lg-overflow-x-auto no-scrollbar">
          <div className="flex gap-1 center title__image space-between">
            <div className="social__details__name flex w-1/1 col">
              <h3 className="fw-700 line-5 fs-16 lg-hide">{data?.headerText}</h3>
              <div className="flex col left social__details view lg-hide">
                <p className="fs-14 line-5">{data?.subContentText}&nbsp;</p>
                <div className="social">
                  <a className="fs-14 line-5 text-underline" href={`mailto:${data?.mailId}`}>{data?.mailId}</a>
                  {windowSize[0] < 768 ? <> | <a className="fs-14 line-5 text-underline" target="_blank" href="https://wa.me/076-50 182 25">Whatsapp</a> </> : null}
                  <a className="fs-14 line-5" href={`tel: ${data?.phoneNo}`}>{data?.phoneNo}</a>
                </div>
              </div>
            </div>
            <div className="flex image__block">
              <div className="socialicon__img relative">
                <Img
                  src={data?.image}
                  className="w-1/1 h-1/1"
                  style={{ objectFit: "contain" }}
                  alt={data?.headerText}
                />
              </div>
            </div>
            <div className="flex col left social__details hide lg-block">
              <h3 className="fw-700 line-5 fs-16">{data?.headerText}</h3>
              <div className="social flex middle">
                <p className="fs-14 line-5">{data?.subContentText}&nbsp;</p>
                <a className="fs-14 line-5 text-underline" href={`mailto:${data?.mailId}`}>{data?.mailId}</a>
                <span className="fs-14 line-5 flex row">&nbsp;&nbsp;|&nbsp;&nbsp;<a className="hoverLink" href="/" onClick={(e) => {
                  e.preventDefault();
                  window?.Tawk_API?.toggle();
                }}>{data?.liveChatText}</a></span>
                {windowSize[0] < 768 ? <>  &nbsp;|&nbsp; <a className="fs-14 line-5 text-underline" target="_blank" href="https://wa.me/076-50 182 25">Whatsapp</a> </> : null}
                <span className="fs-14 line-5 flex row">&nbsp;&nbsp;|&nbsp;&nbsp;<a className="hoverLink" href={`tel: ${data?.phoneNo}`}>{data?.phoneNo}</a></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
}

const FeaturesSection = ({ className = "", data, loading = false, noPadding = false, isFeatures = false, isPlp1 = false }) => {

  return (
    <>
      {loading ? (
        <div className={`container ${!noPadding ? "px-4" : ""}`}>
          <div className={`features__section flex middle w-1/1 ${className}`}>
            <div className={`container ${!noPadding ? "px-4" : ""}`}>
              <div className="w-1/1 overflow-hidden overflow-x-auto no-scrollbar">
                <div className="flex row w-1/1 feature__details ">
                  <SkeletonLine height="86px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className={`container ${!noPadding ? "px-4" : ""}`}>
            {
              (data?.length && isFeatures) && <div className={`features__section flex middle w-1/1${className}`}>
                <FeatureItems data={data} isPlp1={isPlp1} />
              </div>
            }
            {/* details */}
            {
              !isFeatures && <FeatureDetails data={data} className={className} />
            }
          </div>
        </>
      )}
    </>
  );
};

export default FeaturesSection;
