import React, { useState, useEffect, useRef } from "react";
import "./styles.scss";
import { LineLoader } from "Components/Skeletion";
import { useWindowSize } from "Utilities";

const CategoriesDescription = ({ data, bgColor = false, loading = false, isPlp2 = false }) => {
  const [width] = useWindowSize();
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const [update, setUpdate] = useState(false);
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleResize = () => {
    if (contentRef.current) {
      const maxHeight = 110;
      const fullHeight = contentRef.current.scrollHeight;

      setExpanded(fullHeight <= maxHeight);
    }
  };
  useEffect(() => {
    handleResize();
    setUpdate(!update);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width, contentRef.current, data?.description]);
  return (
    <>
      {loading ? (
        <div className={`plp__description ${!isPlp2 ? 'px-4 xxl-px-4' : ''}`}>
          <div className="title__block">
            <LineLoader height="42px" />
          </div>
          <div className="pt-4">
            <LineLoader height="168px" />
          </div>
        </div>
      ) : (
        data?.description && (
          <div className={`plp__description  ${bgColor ? "" : "px-4 xxl-px-4"}`}>
            <div className="title__block">
              <h1 className="fw-700">{data?.title}</h1>
            </div>
            <div className="py-4">
              <div
                className={`description__block  r-4 ${expanded ? "expanded" : ""
                  } ${bgColor ? "bgColor" : "px-4 py-6"}`}
              >
                {data?.description ? (
                  <>
                    <div
                      className="line-7"
                      ref={contentRef}
                      dangerouslySetInnerHTML={{ __html: data.description }}
                    ></div>
                  </>
                ) : (
                  <></>
                )}
                {contentRef?.current?.scrollHeight >= 115 && (
                  <button
                    className="toggle__button line-6"
                    onClick={toggleExpanded}
                    aria-label="button"
                  >
                    {expanded ? "Lees minder" : "Lees meer"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default CategoriesDescription;
