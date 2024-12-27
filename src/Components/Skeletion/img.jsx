import image from "Res/images/placeholder-image.webp";
import { useDispatch, useSelector } from 'react-redux';

const SkeletonImg = ({
  width = "100%",
  animation,
  height = "100%",
  color = "#e5e7eb",
  className = "",
  style = {},
}) => {
  const placeholderImage = useSelector(state => state?.getHomePageData?.data?.place_holder_image);
 
  return (
    <div
      className={`relative r-4 flex center middle ${className} ${
        animation === false
          ? ""
          : animation === "pulse"
          ? "animate-pulse"
          : "animate-wave"
      }`}
      style={{ width, height, background: color, ...style }}
    >
      {/* commented for purpose */}
      {/* <div
      className={`relative r-4 flex center middle ${className} ${
        animation === false
          ? ""
          : animation === "pulse"
          ? "animate-pulse"
          : "animate-wave"
      }`}
      style={{ width, height, background: color, ...style }}
    > */}
      {/* <ImagePlaceholderIcon
        style={{ width: "20%", height: "20%", opacity: 0.5 }}
      /> */}
      <img
        src={placeholderImage}
        alt=""
        loading="lazy"
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
    </div>
  );
};
export default SkeletonImg;
