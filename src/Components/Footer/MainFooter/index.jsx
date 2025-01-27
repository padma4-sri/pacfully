import React, { memo } from "react";
import "./styles.scss";
import { Link, useNavigate } from "react-router-dom";
import { SkeletonLine, SkeletonLoader } from "Components/Skeletion";
import { useDispatch, useSelector } from "react-redux";
import { ACTION_OPEN__LOGIN } from "Store/action";
import AdvancedLink from "Components/AdvancedLink";

const MainFooter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const homePageLoading = useSelector((state) => state?.homePageLoading);
  const isLoggedUser = useSelector((state) => state?.isLoggedUser);
  const HeaderFooterDataLoading = useSelector((state) => state?.HeaderFooterDataLoading);
  const getFooterData = useSelector((state) => state?.getHeaderFooterData?.data?.footer?.[0]);
  const data = ['', '', '', '', 'Volg ons'];
  const dataBlock =
    homePageLoading && HeaderFooterDataLoading ? (
      data.map((item, index) => (
        <div
          className="menu__block"
          key={`footer_menulistLoader${index}`}
        >
          <h3 className="pb-6">
            <SkeletonLine animation="pulse" width="200px" height="30px" />
          </h3>
          {
            item !== "Volg ons" ?
              <SkeletonLoader length={8} pclassName="flex gap-4 col" full={true} />
              :
              <SkeletonLoader length={5} pclassName="flex gap-3" width="40px" height="40px" borderRadius="30px" full={true} />
          }
        </div>
      ))
    ) : (
      <>
        {getFooterData?.footerMenuList?.map((item, index) => (
          <div className="menu__block" key={`footer_menulist${index}`}>
            {
              item?.title === 'Klantenservice' ?
                <h3 className="pb-6"><Link className='fw-700' to={`/klantenservice`} aria-label={item?.title}>{item?.title}</Link></h3>
                :
                <h3 className="pb-6">{item?.title}</h3>
            }
            <ul className="flex gap-y-4 col">
              {item?.categories?.map((cat, ind) => {
                return (
                  <li key={ind}>
                    <Link
                      to={
                        isLoggedUser && cat?.title === "Inloggen"
                          ? "/mijn-account/mijn-overzicht"
                          : cat?.url
                      }
                      aria-label={cat?.title}
                      target={
                        cat?.title === "Bestanden uploaden" ? "_blank" : "_self"
                      }
                      className="text__ellipse"
                      onClick={(e) => {
                        if (!isLoggedUser && (cat?.url?.includes("mijn-account")|| cat?.url?.includes("inloggen"))) {
                          e.preventDefault();
                          dispatch(ACTION_OPEN__LOGIN(true));
                        }
                        else{
                          navigate(cat?.url)
                        }
                      }}

                      // commented for purpose
                      // onContextMenu={(e) => {
                      //   if (
                      //     !isLoggedUser &&
                      //     (cat?.url?.includes("mijn-account") || cat?.url?.includes("inloggen"))
                      //   ) {
                      //     e.preventDefault();
                      //     dispatch(ACTION_OPEN__LOGIN(true));
                      //   }
                      // }}

                      onContextMenu={(e) => {
                        if (!isLoggedUser && (cat?.url?.includes("mijn-account") || cat?.url?.includes("inloggen"))) {
                          e.preventDefault();
                          window.location.href = "/";  
                        }
                      }}
                     
                    >
                      {isLoggedUser && cat?.title === "Inloggen"
                        ? "Mijn accountoverzicht"
                        : cat?.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {/* address */}
        {
          <div className="menu__block visit__us">
            <h3 className="pb-6">
              {getFooterData?.pacifyContact?.contactText}
            </h3>
            <div className="location__address flex gap-y-2 col">
              <p className="pb-1 fw-700">
                {getFooterData?.pacifyContact?.visitingHeader}
              </p>
              <p>{getFooterData?.pacifyContact?.address1}</p>
              <p>{getFooterData?.pacifyContact?.address2}</p>
              <p>{getFooterData?.pacifyContact?.country}</p>
            </div>
          </div>
        }
        {/* follow us */}
        <div className={`menu__block follow__us`}>
          <h3 className="pb-6">{getFooterData?.socialLink?.headerText}</h3>
          <ul className="flex gap-3 wrap">
            {getFooterData?.socialLink?.socailLink?.slice(0, 3)?.map((social, index) => {
              return (
                <li className="flex" key={`footer_visit__us${index}`}>
                  <a
                    href={social?.socailInfo?.url}
                    className="relative socialImg"
                    target="__blank"
                  >
                    <img
                      src={social?.socailInfo?.image}
                      className="defaultImage"
                      alt="Social share"
                    />
                    <img
                      src={social?.socailInfo?.imageHover}
                      className="hoverImage"
                      alt="Social share"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
          <ul className="flex gap-3 wrap pt-4">
            {getFooterData?.socialLink?.socailLink?.slice(-3)?.map((social, index) => {
              return (
                <li className="flex" key={`footer_visit__us${index}`}>
                  <a
                    href={social?.socailInfo?.url}
                    className="relative socialImg"
                    target="__blank"
                  >
                    <img
                      src={social?.socailInfo?.image}
                      className="defaultImage"
                      alt="Social share"
                    />
                    <img
                      src={social?.socailInfo?.imageHover}
                      className="hoverImage"
                      alt="Social share"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </>
    );
    
  return (
    <div className="menu__container py-10 md-py-14">
      <div className="container px-4">
        <div className="flex col gap-y-11 sm-flex sm-row sm-wrap sm-space-between sm-gap-x-4  xl-flex xl-gap-x-2">
          {dataBlock}
        </div>
      </div>
    </div>
  );
};

export default memo(MainFooter);