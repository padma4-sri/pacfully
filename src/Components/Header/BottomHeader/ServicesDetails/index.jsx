import React, { memo, useEffect, useState } from "react";
import "./styles.scss";
import { Toggleup, Toggledown } from "Res/icons";
import CloseButton from "Components/CloseButton";
import ModelNew from "Components/Model/ModelNew";
import Button from "Components/Common/Button";
import SaveAltIcon from '@mui/icons-material/SaveAlt';

const ServicesDetails = ({ translate,openModel, setOpenModel, servicesDetailsData }) => {
  // const [details, setDetails] = useState(null);
  const details = servicesDetailsData?.content?.categoryDetails;
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const toggleAction = (index) => {
    if (selectedCategory === index) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(index);
    }
  };
  const maxi = details?.option?.maxi ? `${details.option.maxi}`.replace(/\(/g, "").replace(/\)/g, "").split(":") : false;
  const dataBlock = servicesDetailsData?.content?.faq?.length && servicesDetailsData?.content?.faq?.map((item, index) => {
    return (
      <div
        className={`sidebar__accordion__section py-1 ${selectedCategory === index ? "active" : ""
          }`}
        key={`mundo__details${index}`}
      >
        <div className="flex parent md-pb-3 gap-4">
          <div
            className="toggle__arrow flex middle  "
            onClick={() => toggleAction(index)}
          >
            {selectedCategory === index ? <Toggleup /> : <Toggledown />}
          </div>

          <p className="flex-1 pr-3 fw-700 pointer" onClick={() => toggleAction(index)} >{item?.faq_title}</p>
        </div>
        <div className="flex pb-1 pl-8"></div>
        {selectedCategory === index ? (
          <div className="answers flex pb-1  pl-8">
            <p
              dangerouslySetInnerHTML={{
                __html: item?.faq_detail_description,
              }}></p>

          </div>
        ) : (
          ""
        )}
      </div>
    );
  });
  // useEffect(() => {
  //   if (servicesDetailsData?.content) {
  //     setDetails(servicesDetailsData?.content?.categoryDetails)
  //   } else {
  //     setDetails(null);
  //   }
  // }, [servicesDetailsData?.content])
  const data = (
    <div style={{ fontSize: 15, lineHeight: "30px" }} className="sidebar__details w-1/1 h-1/1 p-5 xl-px-7 xl-pt-10 xl-pb-7 overflow-hidden overflow-y-auto">
      <div className="relative">
        <div className="closeButton absolute top-0 right-0">
          <CloseButton onClickFunction={() => {
            setOpenModel(false)
          }} />
        </div>
      </div>
      <div className="flex col h-1/1">
      {details?.category_description || details?.category_name ?
         <div className=" flex col sidebar__contents mb-5 md-mb-8 pt-8">
         <div className="sidebar__heading pb-3 mb-3 flex col start gap-4 sm-flex sm-row sm-middle">
           <h1 className="fw-700 ">{ details?.category_name && translate?.[`${details?.category_name}`.toLowerCase()] ? translate[`${details?.category_name}`.toLowerCase()] : details?.category_name}</h1>
         </div>
         
         
       </div>:""
        }
       
        {details?.option?.img ? (
             <div className="py-4">
            <div className="relative" style={{  height: 400 }}>
              <img style={{ position: "absolute",width:"100%",height:"100%" }} type="img" src={details?.option?.img} alt={details?.option?.position ?? "img"} title={details?.option?.position ?? "img"} className="image-contain" />
            </div>
          </div>
        ) : 
        <></>}
   {/* key && translate?.[`${key}`.toLowerCase()] ? translate[`${key}`.toLowerCase()] : key */}

   {details?.option?.position ? (
          <div className="py-4">
            <h3 className="fw-700">Positie</h3>
            <p className="">{ details?.option?.position && translate?.[`${details?.option?.position}`.toLowerCase()] ? translate[`${details?.option?.position}`.toLowerCase()] : details?.option?.position
 }</p>
          </div>
        ) : null}
        {details?.option?.positionVal ? (
          <div className="py-4">
            <h3 className="fw-700">Drukpositie</h3>
            <p className="">{ details?.option?.positionVal && translate?.[`${details?.option?.positionVal}`.toLowerCase()] ? translate[`${details?.option?.positionVal}`.toLowerCase()] : details?.option?.positionVal
 }</p>
          </div>
        ) : null}
        {maxi?.length ? (
          <div className="py-4">
            <h3 className="fw-700 capital ">{maxi[0]}</h3>
            {maxi?.[1] ? <p>{maxi?.[1]}</p> : null}
          </div>
        ) : null}
        {details?.option?.downloadUrl ? (
          <div className="py-4">
            <h3 className="fw-700">Template</h3>
            <div className="pt-2">
              <Button variant="outlined" style={{ lineHeight: "24px" }} className='sm py-2 px-7 r-9 primary flex gap-2'><SaveAltIcon /> Downloaden</Button>
            </div>
          </div>
        ) : null}
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
      className="mondu__payment__sidebar"
    >
      {data}
    </ModelNew>
  );
};

export default memo(ServicesDetails);
