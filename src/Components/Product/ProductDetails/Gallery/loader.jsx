import "./styles.scss";
import React from "react";
const GalleryLoader = () => {
  return (
    <React.Fragment>
      <div className=" imgContainer relative flex center middle mb-5 p-10">
        <button className="overlay" aria-label="button"></button>
        <div style={{paddingTop:"100%"}}></div>
      </div>
      <div className="img__thumbnailContainer container relative">
        {[...Array(5)].map((imageData, index) => (
        <div className="thumb__img" key={`GalleryLoader_thumb__img$_${index}`}>
          <div className="image__wrapper p-2 relative" key={`image__wrapper${index}`}>
            <div style={{paddingTop:"100%"}}></div>
            <button className="overlay" aria-label="button"></button>
          </div>
        </div>
        ))}
      </div>
    </React.Fragment>
  );
};
export default GalleryLoader;