import React, { useContext, useState } from "react";
import "./styles.scss";
import { Toggleup, Toggledown } from "Res/icons";
import Img from "Components/Img";
import CloseButton from "../../CloseButton/index";
import Monduimage from "Res/images/home/mondu.png";
import ModelNew from "Components/Model/ModelNew";
import DomainContext from "Context/DomainContext";

const MonduDetails = ({ openModel, setOpenModel,getMounduData }) => {
  const { storeId } = useContext(DomainContext);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const toggleAction = (index) => {
    if (selectedCategory === index) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(index);
    }
  };
  const dataBlock = getMounduData?.faq?.map((item, index) => {
    return (
      <div
        className={`sidebar__accordion__section py-1 ${selectedCategory === index ? "active" : ""
          }`}
        key={`mundo__details${index}`}
      >
        <div className="flex parent md-pb-3 gap-4">
          <div
            className="toggle__arrow flex middle pointer"
            onClick={() => toggleAction(index)}
          >
            {selectedCategory === index ? <Toggleup /> : <Toggledown />}
          </div>
          <p className="flex-1 pr-3 fw-700 pointer" onClick={() => toggleAction(index)} dangerouslySetInnerHTML={{ __html: item?.faq_title}}></p>
        </div>
        {selectedCategory === index ? (
          <div className="answers flex pb-1  pl-8">
            <p  dangerouslySetInnerHTML={{ __html: item?.faq_description}}></p>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  });
  const data = (
    <div className="sidebar__mondu w-1/1 h-1/1 p-5 xl-p-7 overflow-hidden overflow-y-auto">
      <div className="flex right">
        <CloseButton onClickFunction={() => setOpenModel(false)} />
      </div>
      <div className="sidebar__contents mb-5 md-mb-8">
        <div className="sidebar__heading pb-3 mb-3 flex col start gap-4 sm-flex sm-row sm-middle">
          <h1 className="fw-700 ">{getMounduData?.categoryDetails?.category_name}</h1>
          <div className="mondu__img">
            <Img className="image-contain" src={Monduimage} alt={storeId === 1? 'Promofit review': 'Expofit review'} />
          </div>
        </div>
        <div className="sidebar__content">
          <p className="mb-4">{getMounduData?.categoryDetails?.category_description}</p>
        </div>
      </div>
      <div className="sidebar__accordion">
        <div className="pt-4 pb-5">
          <h1 className="fw-700">Veelgestelde vragen</h1>
        </div>
        <div>{dataBlock}</div>
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

export default MonduDetails;