import React, { memo, useContext, useEffect } from "react";
import "./styles.scss";
import Button from "Components/Common/Button";
import Img from "Components/Img";
import { SkeletonImg, SkeletonLine } from "Components/Skeletion";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AdvancedLink from "Components/AdvancedLink";
import RenderContext from "Context/RenderContext";

const BannerItem = ({ loading, ...props }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    title,
    description,
    buttonText,
    backgroundColor,
    img,
    button_url,
    link_url,
  } = props;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleNavigate = (url) => {
    navigate(url);
  };
  return (
    <div
      className="banner w1/1 md-py-0"
    >
      <div
        className="container lg-px-4 r-4"
        onClick={() => handleNavigate(link_url)}
      >
        <div className="w-1/1 flex col-i gap-2 lg-flex lg-row lg-gap-2 lg-fillY">
          <div className="flex-1">
            <div className="pt-8 pb-16 lg-py-8 px-4 lg-px-0">
              <div className="content-banner flex-1 flex gap-6 col p-8 r-4 m-8 ">
                <div className="banner-info flex-1 flex gap-3 col">
                  {loading ? (
                    <>
                      <SkeletonLine height="96px" animation="pulse" />
                      <SkeletonLine height="96px" animation="pulse" />
                    </>
                  ) : (
                    <>
                      <h1 className="ellips line3">{title}</h1>
                      <p className="ellips line3">{description}</p>
                    </>
                  )}
                </div>
                {loading ? (
                  <SkeletonLine
                    height="45px"
                    width="50%"
                    animation="pulse"
                  />
                ) : buttonText ? (
                  <div>
                   <AdvancedLink className="fw-700" to={button_url}>
                    <Button
                      size=""
                      className=" px-5 py-3 r-2"
                      onClick={(event) => event.stopPropagation()}
                    >
                       Shop Now
                    </Button>
                    </AdvancedLink>

                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div
            className={`flex-1 imgContainer ${
              loading ? "block" : "flex"
            } center middle relative`}
            style={{
              background: `${backgroundColor}3d`,
              display: "grid",
              width: "100%",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}
          >
            <div
              className='maxWidth:"100%", maxHeight:"100%'
              style={{
                aspectRatio: "3/2",
                width: "100%",
                height: "100%",
              }}
            >
              {loading ? (
                <SkeletonImg
                  className="r-full"
                  animation="pulse"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              ) : img ? (
                <img
                  src={img}
                  alt={title}
                  type="img"
                  animation={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BannerContent = () => {
  const { loadPreRender } = useContext(RenderContext);
  const homePageLoading = useSelector((state) => state?.homePageLoading);
  const getBannerData = useSelector(
    (state) => state?.getHomePageData?.data?.bannerData?.mainBanner
  );

  const settings = {
    infinite: true,
    dots: false,
    autoplay: true,
    arrows: false,
    initialSlide: 1,
    slidesToShow: 1,
    speed: 400,
    swipeToSlide: true,
  };
  return homePageLoading || !getBannerData?.length ? (
    <div className="slick-nogap" >
      <Slider {...settings}>
        {[""].map((__, index) => (
          <BannerItem
            key={`BannerEmptyList_${index}`}
            loading={homePageLoading}
            backgroundColor={"#cccccc"}
          />
        ))}
      </Slider>
    </div>
  ) : getBannerData && getBannerData.length ? (
    <div className="slick-nogap" >
      <Slider {...settings}>
        {(!loadPreRender ? getBannerData : getBannerData?.slice(0, 1)).map(
          (bannerData, index) => (
            <BannerItem
              key={`BannerItem_${index}`}
              img={bannerData?.image_url}
              title={bannerData?.header_title}
              buttonText={bannerData?.button_title}
              description={bannerData?.header_content}
              button_url={bannerData?.button_url}
              link_url={bannerData?.link_url}
              backgroundColor={bannerData?.backgroundColor || "#cccccc"}
            />
          )
        )}
      </Slider>
    </div>
  ) : (
    <></>
  );
};

export default memo(BannerContent);
