import React, { useContext, useEffect, useState } from "react";
import "./styles.scss";
import { SkeletonLoader } from 'Components/Skeletion';
import { useWindowSize } from 'Utilities';
import RenderContext from "Context/RenderContext";

const InfoBlock = ({getInfo,loading=false}) => {
  const [width, height] = useWindowSize();
  const [count, setCount] = useState();
  const [showButton, setshowButton] = useState(0);
  const {loadPreRender}=useContext(RenderContext);

  const removeIframes = (html) => {
    return html.replace(/<iframe[^>]*>.*?<\/iframe>/gi, ''); // Remove iframes
  };
  
  const dataBlock = (
    loading ? (
      ['', '', '', '']?.map((itemData, index) => (
        <div key={`InfoBlock_Loading_${index}`} className="pb-5">
          <h4 className="mb-2 fw-700 line-8 pb-3"><SkeletonLoader height="34px" /></h4>
          <SkeletonLoader length={12} height="20px" pclassName = "flex col gap-2"/>
        </div>
      ))
    ) : (
      getInfo?.slice(0, count)?.map((item, ind) => (
        <div className="pb-5" key={`home__static__content${ind}`} dangerouslySetInnerHTML={{ __html: loadPreRender ? removeIframes(item?.block) : item?.block }}></div>
      ))
    )
  )
  // check width
  useEffect(() => {
    if (width >= 640) {
      setCount(getInfo?.length)
    } else {
      setCount(2)
    }
  }, [width, height, getInfo])

  return (
    <div className="infoBlock">
      <div className="container pt-6 pb-3 xl-pt-9 xl-pb-6 px-4">
        <div className={`${showButton !== null ? 'open' : ''}  info__wrapper flex col gap-y-2 xl-flex xl-row wrap xl-gap-x-14  relative zindex-0   infoblock__plp text_block`}>
          {dataBlock}
          {
            showButton !== null ?
              <div className="button__block w-1/1 tc md-hide zindex-1 pb-2">
                <button
                  aria-label="button"
                  className="primary__btn fw-700"
                  onClick={() => {
                    setCount(getInfo?.length);
                    setshowButton(null);
                  }}
                >Lees meer</button>
              </div>
              : ''
          }
        </div>
      </div>
    </div>
  );
};

export default InfoBlock;
