import React, { memo, useContext } from "react";
import "./styles.scss";
import CloseButton from "Components/CloseButton/index";
import { useSelector } from "react-redux";
import Img from "Components/Img";
import { flag1, flag2 } from "Res/images";
import ModelNew from "Components/Model/ModelNew";
import DomainContext from "Context/DomainContext";

const Social = ({ openModel, setOpenModel }) => {
  const { storeId } = useContext(DomainContext);
  const getHeaderData = useSelector(state => state?.getHeaderFooterData?.data?.header?.contactSection);

  const data = (
    <div className="sidebar__social w-1/1 h-1/1 px-4 sm-px-6 py-4">
      <div className="close__block tr flex right w-1/1">
        <CloseButton onClickFunction={() => setOpenModel(false)} />
      </div>
      <div className="sidebar__heading pb-3">
        <h1 className="fw-700 mb-2">{getHeaderData?.topContent?.headerText}</h1>
        <p className="line-7">{getHeaderData?.topContent?.subText} {getHeaderData?.topContent?.workingHours}</p>
      </div>
      <div className="flex col w-1/1 social__details">
        {
          getHeaderData?.contactDetails?.map((item, ind) => (
            <div
              className={`flex gap-7 middle w-1/1 pt-4 pb-3 ${item?.contactInfo?.headerText === "Chat live " ? 'pointer chat__live' : ''}`}
              key={`social__sidebar${ind}`}
              onClick={() => {
                if (item?.contactInfo?.headerText === "Chat live ") {
                  window?.Tawk_API?.toggle();
                }
              }}
            >
              <div className="icon__block__social flex-0 flex center">
                <div className="socialicon__img flex relative">
                  <Img src={item?.contactInfo?.image} alt="image" />
                  {
                    getHeaderData?.contactDetails?.[0]?.contactInfo?.image && <div
                      className="status absolute  r-full overflow-hidden"
                      style={{ backgroundColor: `${item?.contactInfo?.activeWorkingStatus ? "#67CF14" : "#D80000"}` }}
                    ></div>
                  }
                </div>
              </div>
              <div className="flex-1 flex col gap-1 social__detail top">
                <h3 className="fw-700">{item?.contactInfo?.headerText}</h3>
                <div className="contact__block flex col left">
                  {
                    (item?.contactInfo?.phoneNumber && item?.contactInfo?.additionalPhoneNumber) && (
                      <>
                        <p>
                          <Img type="img" src={flag1} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contained" }} className="mr-2" />

                          <a className='line-6' href={`tel:${getHeaderData?.contactDetails?.[0]?.contactInfo?.phoneNumber}`}>{getHeaderData?.contactDetails?.[0]?.contactInfo?.phoneNumber}</a></p>
                        <p>
                          <Img type="img" src={flag2} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contained" }} className="mr-2" />

                          <a className='line-6' href={`tel:${getHeaderData?.contactDetails?.[0]?.contactInfo?.additionalPhoneNumber}`}>{getHeaderData?.contactDetails?.[0]?.contactInfo?.additionalPhoneNumber}</a>
                        </p>
                      </>
                    )
                  }
                  {
                    item?.contactInfo?.mailId && <p className="mail__text"><a className='line-6 text-underline' href={`mailto:${item?.contactInfo?.mailId}`} target="__blank">{item?.contactInfo?.mailId}</a></p>
                  }
                  {
                    item?.contactInfo?.description && <p>{item?.contactInfo?.description}</p>
                  }
                  {
                    item?.contactInfo?.whatsappNumber &&
                    <a className='flex w-1/1 left line-6'
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://wa.me/${item?.contactInfo?.whatsappLinkNumber?.replace(/\s|-/g, "")}`}>
                      {item?.contactInfo?.whatsappNumber}
                    </a>
                  }
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
  return (
    <ModelNew
      from="right"
      hideScroll={false}
      zindex={11}
      open={openModel}
      shadow={true}
      setOpen={setOpenModel}
      className="header__contact__sidebar"
    >
      {data}
    </ModelNew>
  );
};

export default memo(Social);
