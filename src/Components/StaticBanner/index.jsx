import "./styles.scss";
import { SkeletonLine } from "Components/Skeletion";
import { memo } from "react";
import { Link } from "react-router-dom";

const StaticBanner = ({
  loading = false,
  staticBannerData = {},
  noPadding = false,
}) => {
  return (
    <div className={`staticBanner w-1/1`}>
      <div
        className={`container ${noPadding ? "" : "py-6 xl-py-9 px-4 xxl-px-4"}`}
      >
        {loading ? (
          <div className="relative content w1/1 flex lg-flex overflow-hidden">
            <SkeletonLine height="250px" style={{ borderRadius: "0px" }} />
          </div>
        ) : (
          <div className="relative content w1/1 pt-10 pb-12 flex lg-flex r-4 overflow-hidden r-5">
            <div className="flex-2 relative zindex-1">
              <div className="px-6 lg-pl-16 lg-pl-0 flex gap-7 md-flex md-gap-13 col middle lg-flex lg-top">
                <div className="flex-1 flex gap-4 col">
                  <h3 className="line-14">{staticBannerData?.headerTitle}</h3>
                  <p className="line-10">{staticBannerData?.headerContent}</p>
                </div>
                <div className="btn__action">
                  <Link
                   aria-label={staticBannerData?.buttonTitle}
                    to={`/${staticBannerData?.buttonUrl}`}
                    style={{
                      backgroundColor: staticBannerData?.backgroundColor,
                    }}
                    className="r-full fw-700"
                  >
                    {staticBannerData?.buttonTitle}
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex-0 lg-flex-1"></div>
            <div
              className="background absolute w-1/1 h-1/1 zindex-0 top-0 left-0"
              style={{
                backgroundImage: `url(${
                  staticBannerData?.image_url
                    ? staticBannerData?.image_url
                    : staticBannerData?.imageUrl
                })`,
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(StaticBanner);
