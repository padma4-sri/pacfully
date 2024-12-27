import React, { useEffect, useState } from "react";
import ProductCard from "Components/Productcard";
import "./styles.scss";
import { Link } from "react-router-dom";
import "keen-slider/keen-slider.min.css";
import { useWindowSize } from "Utilities";
import SliderWrapper from "./sliderWrapper";

const ProductSlider = ({
  title = "",
  showToGo = false,
  viewText = "bekijk alles",
  toGo,
  subTitle = "",
  loading = false,
  data = [],
  pageName = "",
  index
}) => {
  const [width, height] = useWindowSize();
  const [loaded, setLoaded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(null);
  const [disableSlider, setDisableSlider] = useState(false);
  const [onSilde, setOnSilde] = useState(false);
  const [disableAPIcall,setDisableAPIcall]=useState(false)

  useEffect(()=> {
    const tempIs = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    setIsTouchDevice(tempIs);
  },[width, height]);
  const dataBlockEmpty = ["", "", "", "", "", "", ""]?.map(
    (item, index, arr) => (
      <div
        key={`home__loading${title}${index}`}
        className={`keen-slider__slide number-slide${index + 1}`}
      >
        <ProductCard setDisableSlider={setDisableSlider} data={item} loading={true} pageName={pageName} />
      </div>
    )
  );
  const dataBlock = data && data.length ? (
    <>
      {data.map((item, index, arr) => (
        <div
          className={`keen-slider__slide number-slide${index + 1}`}
          key={`home__${title}${index}`}
        >
          {(width < 768 && isTouchDevice) || loaded ? <ProductCard setDisableSlider={setDisableSlider} data={item} loading={loading} pageName={pageName}/> : <></>}
        </div>
      ))}
      {
        toGo ?
          <div className={`keen-slider__slide number-slide${data?.length + 1}`} key={`home__${title}_last`} >
            <ProductCard setDisableSlider={setDisableSlider} onSilde={onSilde} goto={{ url: `/${toGo}`, name: `${viewText}`, subTitle: `${subTitle}` }} pageName={pageName}/>
          </div>
          : <></>
      }

    </>
  ) : <></>;
  return (
    <div className="product__slider__container overflow-hidden">
      <div className="container pt-6 xl-pt-9 px-4 xxl-px-4">
        <div className="title__section flex space-between pb-6">
          {title &&
          <h1 className="fw-700 line-9">{title}</h1>}
          {showToGo ? (
            <Link to={`/${toGo}`}aria-label={viewText}  state={{
              urlType:{
                "entityType": "category",
                "level": "3",
                "isChildExist": 1
            }}}
             className="fw-700 line-9">
              {viewText}
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="container pb-6 xl-pb-9">
        <div className="slider__block relative zindex-0">
          {width < 768 && isTouchDevice ? 
            <div className="slider__wrapper">
              <div className={`navigation-wrapper`}>
                <div className={`${!toGo ? "pr-4" : ""} keen-slider-not flex no-scrollbar sliderLeftRightVisible touchDevice overflow-hidden overflow-x-auto`}>
                  {dataBlock}
                </div>
              </div>
            </div>
            : 
            <SliderWrapper title={title} showToGo={showToGo} toGo={toGo} viewText={viewText} dataBlockEmpty={dataBlockEmpty} dataBlock={dataBlock}
              subTitle={subTitle} loading={loading} data={data} width={width} ProductCard={ProductCard} loaded={loaded} setLoaded={setLoaded} setOnSilde={setOnSilde}
              disableSlider={disableSlider}
              index={index}
              pageName={pageName}
              disableAPIcall={disableAPIcall}
              setDisableAPIcall={setDisableAPIcall}
              />
          }
        </div>
      </div>
    </div>
  );
};

export default ProductSlider;
