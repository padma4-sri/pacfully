import React, { memo, useEffect, useState } from "react";
import "./styles.scss";
import { Toggleup, Toggledown } from "Res/icons";
import CloseButton from "Components/CloseButton";
import ModelNew from "Components/Model/ModelNew";
import Button from "Components/Common/Button";
import SaveAltIcon from '@mui/icons-material/SaveAlt';

const InfoDetails = ({ translate,openModel, setOpenModel, servicesDetailsData }) => {
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
         {details?.category_description?
         <div className="flex-1">
         <div className="w-1/1 h-1/1 sidebar__content ">
           <p className="mb-4"  dangerouslySetInnerHTML={{
                __html: details?.category_description,
              }}/>
         </div>
       </div>:""
         }
         
       </div>:""
        }
       
        {!details?.hideVragen ? (
          <div className="sidebar__accordion">

            {servicesDetailsData?.content?.faq?.length ?
              <>
                <div className="pt-4 pb-5">
                  {openModel ? <h1 className="fw-700 texthidecontent">Veelgestelde vragen</h1> : null}
                </div>
                <div>{dataBlock}</div>
              </>


              : ''}
          </div>
        ) : <></>}
        
   {/* key && translate?.[`${key}`.toLowerCase()] ? translate[`${key}`.toLowerCase()] : key */}

       
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

export default memo(InfoDetails);
