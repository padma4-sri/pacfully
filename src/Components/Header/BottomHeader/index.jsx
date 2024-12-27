import React, { memo, useRef, useState } from "react";
import "./styles.scss";
import { SkeletonLine } from "Components/Skeletion";
import { ValidSuccesArrow } from "Res/icons";
import Img from "Components/Img";
import { useSelector } from "react-redux";
import { useKeenSlider } from "keen-slider/react";
import AccordionSidebar from "Components/AccordionSidebar/AccordionSidebar";
import { Link } from "react-router-dom";

const animation = { duration: 20000, easing: (t) => t };
const BottomHeader = ({ data, isCheckout = false }) => {
  const { thuiswinkel } = data;
  const emptyList = [...Array(4).keys()];
  const HeaderFooterDataLoading = useSelector((state) => state?.HeaderFooterDataLoading);
  const getHeaderData = useSelector((state) => state?.getHeaderFooterData?.data?.header);
  const teamSliderRef = useRef();
  const [isSampleCalled, setIsSampleCalled] = useState(false);
  const [tagUrl, setTagUrl] = useState("");
  const [openModel, setOpenModel] = useState(false);
  const [sliderRef1] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    slides: {
      origin: "center",
      perView: "auto",
      spacing: 25
    },
    drag: false,
    created(s) {
      s.moveToIdx(5, true, animation)
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation)
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation)
    }
  });
  const uspHandler = (url) => {
    setTagUrl(url);
    setIsSampleCalled(false);
    setOpenModel(true);
  }
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };
  const ScrollData = () => {
    return getHeaderData?.headerMenuList &&
      getHeaderData?.headerMenuList?.length ? (
      getHeaderData?.headerMenuList.map((item, index) => (
        <button
          key={`BottomHeader-subMenuList${index}`}
          className="checklist flex gap-2 bottom"
          onClick={() => uspHandler(item?.menu?.tag_url)}
          aria-label="button"
        >
          <ValidSuccesArrow color="var(--themeColor)" />
          <p className="text-nowrap">{item?.menu?.title}</p>
        </button>
      ))
    ) : (
      <></>
    );
  }

  return (
    <React.Fragment>
      <div className={`subHeader w-1/1 subHeaderNew ${isCheckout ? 'subHeaderCheckout pt-6 pb-3 md-py-8' : ''}`}>
        <div className={`container ${!isCheckout ? 'pb-2' : ''} pl-4 pr-4 xxl-pl-4 xxl-pr-4`}>
          {HeaderFooterDataLoading ? (
            <div className="flex gap-4 middle w-1/1">
              <div className="flex-1 overflow-hidden">
                <div className="w-1/1 flex gap-8 nowrap overflow-hidden overflow-x-auto no-scrollbar">
                  {
                    isCheckout ?
                      [''].map((item, index) => (
                        <div
                          key={`BottomHeader-emptyList${index}`}
                          className="checklist flex gap-2 middle"
                        >
                          <SkeletonLine
                            width="165px"
                            height="41px"
                            style={{ borderRadius: "2px" }}
                          />
                        </div>
                      ))
                      :
                      emptyList.map((item, index) => (
                        <div
                          key={`BottomHeader-emptyList${index}`}
                          className="checklist flex gap-2 middle"
                        >
                          <SkeletonLine
                            width="106px"
                            height="27px"
                            style={{ borderRadius: "2px" }}
                          />
                        </div>
                      ))
                  }
                </div>
              </div>
              <div className="flex-0 flex gap-2">
                <SkeletonLine
                  width="96px"
                  height="39px"
                  style={{ borderRadius: "2px" }}
                />
                <SkeletonLine
                  width="96px"
                  height="39px"
                  style={{ borderRadius: "2px" }}
                />
              </div>
            </div>
          ) : (
            <div className="flex gap-4 middle w-1/1 relative">
              {
                isCheckout ?
                  <div className="item-1 flex middle gap-2 xl-flex xl-gap-x-3">
                    <Link to="/" className='logo relative' aria-label={"home"}>
                      <Img src={getHeaderData?.logo} alt='promofit logo' className='w-1/1 h-1/1' style={{ objectFit: "contain" }} />
                    </Link>
                  </div>
                  :
                  <div className="flex-1 overflow-hidden">
                    <div className="autoscroll-checklist hide xl-block w-1/1 relative">
                      <div className="w-1/1 xl-flex xl-gap-8 nowrap overflow-hidden overflow-x-auto no-scrollbar">
                        <ScrollData key="ScrollData1" />
                      </div>
                    </div>
                    <div className="xl-hide w-1/1 overflow-hidden pb-2">
                      <div className="sliders__block">
                        {getHeaderData?.headerMenuList ? (
                          <div className="navigation-wrapper"
                            ref={teamSliderRef}
                          >
                            <div
                              ref={sliderRef1}
                              className="keen-slider autoscroll-checklist"
                            >
                              {
                                getHeaderData?.headerMenuList.map((item, index) => (
                                  <div className="keen-slider__slide relative zindex-1 w-1/1 flex center gap-8 nowrap" style={{ minWidth: "max-content" }} key={`headerUps${index + 1}`}>
                                    <button
                                      key={`BottomHeader-subMenuList${index}`}
                                      className="checklist flex gap-2 bottom"
                                      onClick={() => uspHandler(item?.menu?.tag_url)}
                                      aria-label="button"
                                    >
                                      <ValidSuccesArrow color="var(--themeColor)" />
                                      <p className="text-nowrap">{item?.menu?.title}</p>
                                    </button>
                                  </div>
                                ))
                              }
                            </div>
                          </div>
                        ) : <></>
                        }
                      </div>
                    </div>
                  </div>
              }
              <div className="end flex-0 flex gap-5 middle absolute right-0 pl-4 sm-pl-12 zindex-1">
                {getHeaderData?.kiyoh ? (
                  <div
                    className="flex middle gap-1 md-flex md-gap-0 mt-1 kiyo"
                    onClick={() => openInNewTab(getHeaderData?.kiyoh?.kiyohUrl)}
                    style={{ cursor: "pointer" }}
                  >
                    {getHeaderData?.kiyoh?.rating?.[0]?.avg_rating_year ? (
                      <>
                        <div
                          style={{
                            width: "60px",
                            height: "100%",
                          }}
                          className="hide md-block relative kiyh__img"
                        >
                          <Img
                            src={getHeaderData?.kiyoh?.image}
                            className="w-1/1 h-1/1"
                            style={{ objectFit: "contain" }}
                            alt="kiyoh"
                          />
                        </div>
                        <h3 className="md-hide">
                          {getHeaderData?.kiyoh?.kiyohText}
                        </h3>
                        <p className="rating">{`${getHeaderData?.kiyoh?.rating?.[0]?.avg_rating_year}/10`}</p>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  <></>
                )}
                {thuiswinkel ? (
                  <div
                    style={{ width: "94px", height: "37px", cursor: "pointer" }}
                    className="relative thuiswinkel"
                    onClick={() =>
                      openInNewTab(getHeaderData?.thuiswinkel?.thuiswinkelUrl)
                    }
                  >
                    <Img
                      src={getHeaderData?.thuiswinkel?.image}
                      className="w-1/1 h-1/1"
                      style={{ objectFit: "contain" }}
                      alt="thuiswinkel"
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
     <AccordionSidebar
        openModel={openModel} setOpenModel={setOpenModel}
        setIsSampleCalled={setIsSampleCalled} isSampleCalled={isSampleCalled}
        tagUrl={tagUrl}
      />
    </React.Fragment>
  );
};

export default memo(BottomHeader);
