import React, { memo, useContext } from "react";
import "./styles.scss";
import { Workingaction } from "Res/icons";
import { SkeletonLine, SkeletonLoader } from "Components/Skeletion";
import { useSelector } from "react-redux";
import Img from "Components/Img";
import DomainContext from "Context/DomainContext";
import { useNavigate } from "react-router-dom";

const WorkingHours = () => {
  const navigate = useNavigate();
  const { storeId } = useContext(DomainContext);
  const homePageLoading = useSelector((state) => state?.homePageLoading);
  const HeaderFooterDataLoading = useSelector((state) => state?.HeaderFooterDataLoading);
  const getFooterData = useSelector((state) => state?.getHeaderFooterData?.data?.footer?.[0]?.contactSection);
  const fbLink = useSelector((state) => state?.getHeaderFooterData?.data?.footer?.[0]?.socialLink?.socailLink?.[0]?.socailInfo);

  const InnerData = ({ item }) => {
    return (
      <>
        <div className="icon relative">
          {item?.contactInfo?.image && <Img src={item?.contactInfo?.image} alt={storeId === 1 ? `Promofit ${item?.contactInfo?.headerText}` : `Expofit ${item?.contactInfo?.headerText}`} />}
          {item?.contactInfo?.mail && <Img src={item?.contactInfo?.mail} alt={storeId === 1 ? 'Promofit email' : 'Expofit email'} />}
        </div>
        <div className="details flex-1">
          <h2 className="pb-1">{item?.contactInfo?.headerText}</h2>
          <div className="info fw-300">
            {item?.contactInfo?.primaryNumber && (
              <p><a className="line-6 m-0" href={`tel:${item?.contactInfo?.primaryNumber}`}>NL: {item?.contactInfo?.primaryNumber}</a></p>
            )}
            {item?.contactInfo?.additionalNumber && (
              <p><a className="line-6 m-0" href={`tel:${item?.contactInfo?.additionalNumber}`}>BE: {item?.contactInfo?.additionalNumber}</a></p>
            )}
            {item?.contactInfo?.description && (
              <p><span className="line-6">{item?.contactInfo?.description}</span></p>
            )}
            {item?.contactInfo?.number && (
              item?.contactInfo?.headerText === "Via Whatsapp" ?
                <p><span className="line-6">Tel: {item?.contactInfo?.number}</span></p>
                :
                <p><span className="line-6">{item?.contactInfo?.number}</span></p>
            )}
            {item?.contactInfo?.mailId && (
              <p><span className="line-6">{item?.contactInfo?.mailId}</span></p>
            )}
          </div>
        </div>
        <div className="action">
          <Workingaction />
        </div>
      </>
    );
  };
  const circleIcon = <SkeletonLine
    animation="pulse"
    width="35px"
    height="35px"
    style={{ borderRadius: "30px" }}
  />
  const DataBlock = () => {
    return homePageLoading && HeaderFooterDataLoading
      ? ["", "", "", "", "", ""]?.map((item, index) => (
        <div
          key={`WorkingHours_${index}`}
          className="cards__block r-5 p-2 sm-p-6 xs-p-4 xs-p-8 flex gap-x-8 sm-flex sm-gap-x-7 lg-gap-x-4 middle w-1/3"
        >
          <div className="icon">{circleIcon}</div>
          <div className="details flex-1">
            <h2 className="pb-3">
              <SkeletonLoader height="28px" />
            </h2>
            <SkeletonLoader length={2} height="17px" />
          </div>
          <div className="action">{circleIcon}</div>
        </div>
      ))
      : getFooterData?.contactDetails?.map((item, index) =>
        item?.contactInfo?.headerText === "Via chat" ? (
          <a
            className="cards__block r-5 p-2 sm-p-6 xs-p-4 xs-p-8 flex gap-x-8 sm-flex sm-gap-x-7 lg-gap-x-4 middle w-1/3"
            id="via__chat"
            key={`footer__contactInfo${index}`}
            onClick={(e) => {
              e.preventDefault();
              window?.Tawk_API?.toggle();
            }}
            href="/"
          >
            <InnerData item={item} />
          </a>
        ) : item?.contactInfo?.mailId ? (
          <a
            className="cards__block r-5 p-2 sm-p-6 xs-p-4 xs-p-8 flex gap-x-8 sm-flex sm-gap-x-7 lg-gap-x-4 middle w-1/3"
            key={`footer__contactInfo${index}`}
            href={`mailto:${item?.contactInfo?.mailId}`}
            target="__blank"
          >
            <InnerData item={item} />
          </a>
        ) : item?.contactInfo?.headerText === "Via Whatsapp" ? (
          <a
            className="cards__block r-5 p-2 sm-p-6 xs-p-4 xs-p-8 flex gap-x-8 sm-flex sm-gap-x-7 lg-gap-x-4 middle w-1/3"
            key={`footer__contactInfo${index}`}
            href={`https://wa.me/${item?.contactInfo?.whatsappLinkNumber.replace(/\s|-/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <InnerData item={item} />
          </a>
        ) : (
          <button
            className="cards__block r-5 p-2 sm-p-6 xs-p-4 xs-p-8 flex gap-x-8 sm-flex sm-gap-x-7 lg-gap-x-4 middle w-1/3"
            key={`footer__contactInfo${index}`}
            aria-label="button"
            onClick={() => {
              if (item?.contactInfo?.headerText === "Bezoek ons") {
                navigate("/showroom");
              
              }
              if (item?.contactInfo?.headerText === "Social media") {
                window.open(fbLink?.url);
              }
            }}
          >
            <InnerData item={item} />
          </button>
        )
      );
  }
  return (
    <div className="workinghours__container py-10 md-py-13 container px-4">
      <div className="wrapper">
        <div className="title__block mx-auto tc pb-5 xl-pb-9">
          {homePageLoading && HeaderFooterDataLoading ? (
            <SkeletonLoader height="30px" length={2} pclassName="flex middle col gap-2" />
          ) : (
            <h1 className="line-12">
              {getFooterData?.workingText} <br />
              {getFooterData?.workingHours}
            </h1>
          )}
        </div>
        <div className="cards__container gap-y-3 lg-flex lg-gap-y-6 lg-gap-x-6 flex wrap center xxl-flex xxl-left xxl-space-between xxl-gap-x-2">
          <DataBlock />
        </div>
      </div>
    </div>
  );
};

export default memo(WorkingHours);
