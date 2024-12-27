import React, { useEffect, useState, useRef, useContext } from "react";
import "./styles.scss";
import { LineLoader, SkeletonLoader } from "Components/Skeletion";
import { useWindowSize } from "Utilities";
import RenderContext from "Context/RenderContext";

const InfoBlock = ({ getInfo, loading = false, plp2 = false }) => {
  const [width] = useWindowSize();
  const {loadPreRender}=useContext(RenderContext);

  const [expanded, setExpanded] = useState(null);
  const contentRef = useRef(null);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  const detailsHandle = () => {
    contentRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start'
    });
  };
  const handleResize = () => {
    if (contentRef?.current) {
      const maxHeight = 500;
      const fullHeight = contentRef.current.scrollHeight;
      if (fullHeight >= 500) {
        setExpanded((fullHeight >= maxHeight) ? true : false);
      } else {
        setExpanded(null);
      }
    }
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width, contentRef.current]);

  const removeIframes = (html) => {
    return html.replace(/<iframe[^>]*>.*?<\/iframe>/gi, ''); // Remove iframes
  };

  const dataBlock = loading
    ? ["", "", "", ""]?.map((itemData, index) => (
      <div key={`InfoBlock_Loading_${index}`} className="pb-5">
        <h4 className="mb-2 fw-700 line-8 pb-3 w-1/2">
          <LineLoader height="35px" />
        </h4>
        <SkeletonLoader length={10} height="24px" pclassName="flex col gap-1 content pb-3" />
      </div>
    ))
    : getInfo?.map((item, ind) => (
      <div
        className={`info__wrapper ${plp2 ? '' : 'mainCategory'} ${plp2 ? '' : 'xl-row'} flex col gap-y-2 xl-flex  wrap xl-gap-x-14  relative zindex-0 ${plp2 ? "" : "infoblock__plp"
          }`}
        key={`plp__static__content${ind}`}
        dangerouslySetInnerHTML={{ __html: loadPreRender ? removeIframes(item?.block) :item?.block }}
      ></div>
    ));

  return (
    <div className="infoBlock">
      <div
        className={`container py-6 xl-py-9  px-4 xxl-px-4 ${((contentRef?.current?.scrollHeight >= 500) && expanded) ? 'expanded' : ''}`}
        ref={contentRef}
        style={{ height: `${(width <= 768 && (contentRef?.current?.scrollHeight >= 500) && expanded) ? '500px' : 'auto'}` }}
      >
        {dataBlock}
      </div>

      {(width <= 768 && (contentRef?.current?.scrollHeight >= 500) && expanded) ?
        <div
          className="infoBlock_button px-4 xxl-px-4 pb-6 pointer"
        >
          <p
            className="pointer text-underline"
            onClick={() => {
              toggleExpanded();
            }}
          >Lees meer</p>
        </div>
        : <></>}
      {(width <= 768 && (contentRef?.current?.scrollHeight >= 500) && expanded === false) ?
        <div
          className="infoBlock_button px-4 xxl-px-4 pb-6"
        >
          <p
            className="pointer text-underline"
            onClick={() => {
              toggleExpanded();
              detailsHandle();
            }}>Lees minder</p>
        </div>
        : <></>}
    </div>
  );
};

export default InfoBlock;
