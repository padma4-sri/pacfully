import React, { useEffect, useState } from "react";
import { SkeletonLine, SkeletonImg } from "Components/Skeletion";

const Img = ({
  src = "",
  type = "",
  ref = null,
  animation = "",
  width = "100%",
  height = "100%",
  alt = "image",
  title = "",
  className = "",
  style = {},
  webp = true,
  onError = () => {},
  onClick = () => {},
}) => {
  const [loaded, setLoaded] = useState(false);
  const [srcUrl, setSrcUrl] = useState("");

  useEffect(() => {
   
    setSrcUrl(src);

  }, [src, webp]);

  const handleLoad = () => setLoaded(true);
  const handleError = (e) => {
    setLoaded(false);
    onError(e);
  };

  return (
    <>
      {!loaded &&
        (type === "img" ? (
          <SkeletonImg
            animation={animation}
            className="flex absolute top-0 left-0 zindex-1"
            style={{ borderRadius: "8px" }}
          />
        ) : (
          <SkeletonLine
            className="flex absolute top-0 left-0 zindex-1"
            style={{ borderRadius: "2px" }}
          />
        ))}
      <img
        // fetchpriority="high"
        onError={handleError}
        loading="lazy"
        onLoad={handleLoad}
        onClick={onClick}
        ref={ref}
        draggable="false"
        src={srcUrl}
        className={className}
        style={{ opacity: loaded ? 1 : 0, ...style }}
        width={width}
        height={height}
        alt={alt}
        title={title}
      />
    </>
  );
};

export default Img;
