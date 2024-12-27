import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import "./styles.scss";
import Img from "Components/Img";
import { Zoom } from '@mui/material';
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useWindowSize ,handleImage} from "Utilities";
import RenderContext from "Context/RenderContext";
import { useSelector } from "react-redux";

const extractYouTubeVideoId = (imageData) => {
  const regex = /[?&]?(?:v=|watch\/|embed\/|youtu.be\/)([a-zA-Z0-9_-]{11})/;
  const match = imageData?.match(regex);
  return match && match[1];
};

const RenderVideo = ({ videoData }) => {
  const videoId = extractYouTubeVideoId(videoData);
  return (
    <div className="iframe-container">
      <div className="youtube-video-container">
        <iframe
          title="YouTube Video"
          src={`https://www.youtube.com/embed/${videoId}`}
          allowFullScreen
          allow="encrypted-media"
          className="youtube-iframe"
          style={{
            position: "absolute",
            width: "100%",
            height: "83%",
            top: "60px",
            left: 0,
            zIndex: 1,
          }}
        ></iframe>
      </div>
    </div>
  );
};

const GallerySliderImg = ({ imageData, index }) => {
  const { loadPreRender } = useContext(RenderContext);
  const isYouTubeUrlMemo = useMemo(() => {
    return imageData?.image?.match(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/);
  }, [imageData?.image]);

  return (
    <div className={`keen-slider__slide number-slide${index + 1}`}>
      <div className={`h-1/1 w-1/1 relative`}>
        {!loadPreRender && isYouTubeUrlMemo ? (
          <RenderVideo videoData={imageData?.image} />
        ) : (
          <>
            <span className="overlay"></span>
            <Img webp={false} alt="img" type="img" src={handleImage(imageData?.image)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
          </>
        )}
        <div style={{ paddingTop: "100%" }}></div>
      </div>
    </div>
  );
};
const GallerySlider = ({ data, active, open }) => {
  const [currentSlide, setCurrentSlide] = useState(active);
  const [loaded, setLoaded] = useState(false);
  const [iframeVisible, setIframeVisible] = useState(false); 
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    initial: active,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
      const currentSlideData = data[slider.track.details.rel];
      const isYouTubeVideo = currentSlideData?.image?.match(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/);
      setIframeVisible(!!isYouTubeVideo); 
    },
    created() {
      setLoaded(true);
      const isYouTubeVideo = data[0]?.image?.match(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/);
      setIframeVisible(!!isYouTubeVideo);
    },
  });

  const prevSlide = () => {
    if (instanceRef.current) {
      instanceRef.current.prev();
    }
  };


  const nextSlide = () => {
    if (instanceRef.current) {
      instanceRef.current.next();
    }
  };

  // useEffect(() => {
  //   if (instanceRef.current && active !== currentSlide) {
  //     instanceRef.current.moveToIdx(active);
  //   }
  // }, [active, instanceRef, currentSlide]);




  return data?.length ? (
    <div className="GallerySliderPDP fixed w-1/1 h-1/1 top-0 left-0 zindex-11" style={{ background: "white" }}>
      <div className="navigation-wrapper relative">
        <div ref={sliderRef} className="content keen-slider" style={{ height: "100%" }}>
          {data?.map((imageData, index) => (
            <GallerySliderImg
              key={`keen-slider__slide_number-slide${index + 1}`}
              imageData={imageData}
              index={index}
            />
          ))}
        </div>
        {iframeVisible && ( 
          <>
            <button
              className="prev-button"
              onClick={prevSlide}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 20,
                background: "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
                padding: "10px",
                cursor: "pointer",
                borderRadius: "50%",
              }}
            >
              &#10094;
            </button>
            <button
              className="next-button"
              onClick={nextSlide}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 20,
                background: "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
                padding: "10px",
                cursor: "pointer",
                borderRadius: "50%",
              }}
            >
              &#10095;
            </button>
          </>
        )}
      </div>
      <span className="overlay"></span>
      {loaded && instanceRef.current && (
        <div className="absolute w-1/1 left-0" style={{ bottom: "40px", zIndex: 3 }}>
          <div className="dots dots-wrap flex w-1/1 center middle">
            {[
              ...Array(instanceRef.current.track.details.slides.length).keys(),
            ].map((idx) => {
              return (
                <button
                  aria-label="button"
                  style={{ width: 12, height: 12, borderRadius: "8px", margin: 6, background: "#c5c5c5" }}
                  key={`dots__${idx}`}
                  onClick={() => {
                    instanceRef.current?.moveToIdx(idx);
                  }}
                  className={"dot" + (currentSlide === idx ? " active" : "")}
                ></button>
              );
            })}
          </div>
        </div>
      )}
      <IconButton onClick={() => open(false)} aria-label="close">
        <CloseIcon />
      </IconButton>
    </div>
  ) : <></>;
};

const GalleryPopupItem = ({ id, setId, data, isShow }) => {
  const { loadPreRender }=useContext(RenderContext);
  const imgRef = useRef(null);
  const isYouTubeUrl = (url) => {
    return url.match(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/);
  };

  const RenderMediaImage = ({ imageData }) => {
    const videoId = extractYouTubeVideoId(imageData);
    return (
      <div className="pdp-video-container">
        <span className="overlay"></span>
        <Img alt="img" type="img" ref={imgRef}
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
           />

      </div>
    );

  };
  return isShow && (
    <div className="content keen-scroller flex col">
      {/* <div ref={sliderRef} className="content keen-slider" style={{ height: "100%", paddingTop:80 }}> */}
      {isShow && data?.map((imageData, index) => (
        <div key={`keen-slider__slide number-slide${index + 1}`} className={`keen-slider__slide number-slide${index + 1}`}>
          <button className={`h-1/1 w-1/1 relative ${id === index}`} onClick={() => setId(index)} aria-label="button">
            {!loadPreRender && isYouTubeUrl(imageData?.image) ? (
              <>
                <div className="play-button"
                ></div>
                <RenderMediaImage imageData={imageData?.image} />
              </>
            ) : (
              <>
                <span className="overlay"></span>
                <Img alt="img" type="img" ref={imgRef} src={handleImage(imageData?.image)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />

              </>
            )}
            <div style={{ paddingTop: "100%" }}></div>
          </button>
        </div>
      ))}
    </div>
  )
}
const GalleryPopup = ({ show, data, active, open }) => {
  const [isZoomIn, setIsZoomIn] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [id, setId] = useState(active ?? 0);
  const { loadPreRender }=useContext(RenderContext);
  const gallerypop = useRef(null);
  useEffect(() => {
    let temp = null
    if (show && data?.length) show = setTimeout(() => setIsShow(show), 500)
    else setIsShow(false)
    return () => {
      temp && clearTimeout(temp)
    }
  }, [show, data?.length])

  const isYouTubeUrlMemo =useMemo(() => {
    return data[id]?.image?.match(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/);
},[data[id]?.image]);


useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      open(false);  
    }
    if (e.key === 'ArrowRight') {
      setId((prevId) => (prevId + 1) % data.length);  
    }
    if (e.key === 'ArrowLeft') {
      setId((prevId) => (prevId - 1 + data.length) % data.length);  
    }
  };

  if (show) {
    window.addEventListener('keydown', handleKeyDown);
  }

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [show, data.length]);

  return show && (
    <Zoom in={data?.length}>
      <div className="popupGallery fixed w-1/1 h-1/1 top-0 left-0 zindex-11" style={{ background: "white" }}>
        <div className="flex w-1/1 h-1/1 overflow-hidden absolute">
          <div ref={gallerypop} className={`sidebar px-6 h-1/1 ${isZoomIn}`}>
            <div className={`sidebarContainer`}>
              <div className={`sidebarContent`}>
                <GalleryPopupItem id={id} setId={setId} data={data} isShow={isShow} />
              </div>
            </div>
          </div>
          <div className="flex-1 h-1/1 flex relative">
            <button className={`fullImage absolute w-1/1 h-1/1 top-0 left-0 ${isZoomIn}`} onClick={() => setIsZoomIn(!isZoomIn)} aria-label="button">

              {!loadPreRender && isYouTubeUrlMemo ? (
                <RenderVideo videoData={data[id]?.image} />

              ) : (
                <>
                  <button className="overlay" aria-label="button"></button>
                  <div className="images w-1/1 h-1/1">
                    <Img
                      type="img"
                      animation={false}
                      src={handleImage(data[id]?.image)}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        objectFit: "contain",
                      }}
                      webp={false}
                    />
                  </div>
                </>

              )}

            </button>
          </div>
        </div>
        <IconButton onClick={() => open(false)} aria-label="close">
          <CloseIcon />
        </IconButton>
      </div>
    </Zoom>
  )
}
const GalleryVariant = ({ imgData, alt ,showPopup ,setShowPopup}) => {
  const [initRender, setInitRender] = useState(false);
  const [width] = useWindowSize();
  const random = Math.round(Math.random() * 1000);
  const [selectedImage, setSelectedImage] = useState(null);
  const [id, setId] = useState(0);
  const [data, setData] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const imgRef1 = useRef(null);
  const { loadPreRender }=useContext(RenderContext);
  const placeholderImage = useSelector(state => state?.getHomePageData?.data?.place_holder_image);

  const isYouTubeUrlMemo =useMemo(() => {
      return selectedImage?.match(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/);
  },[selectedImage])

  const handleThumbnailClick = (image) => {
    setSelectedImage(image);
  };
  const isYouTubeUrl = (url) => {
    return url?.match(/^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/);
  };
  const RenderMediaImage = ({ imageData }) => {
    const videoId = extractYouTubeVideoId(imageData);
    return (
      <div className="pdp-video-container" style={{ height: "100%" }}>
        <span className="overlay"></span>
        <Img alt="img" type="img" ref={imgRef1}
          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
          style={{ padding: "17px 0px " }} />

      </div>
    );
  };
  useEffect(() => {
    if (data && data.length > 0) {
      setId(0);
      setSelectedImage(data[0]?.image);
    }
  }, [data]);
  useEffect(() => {
    if (imgData?.image?.length) {
      setData([...imgData?.image])
    }
  }, [imgData]);
  useEffect(() => {
    const htmlTag = document.getElementsByTagName("html").item(0);
    if (initRender) {
      if (showPopup) htmlTag.classList.add(`ModelPopup-${random}`);
      else htmlTag.classList.remove(`ModelPopup-${random}`);
    }
    return () => htmlTag.classList.remove(`ModelPopup-${random}`);
  }, [showPopup]);
  useEffect(() => {
    if (!initRender) setInitRender(true)
  }, [initRender]);
  
  return (
     <React.Fragment>
          <div onClick={() => setShowPopup(true)} className=" zindex-1 imgContainer relative flex center middle mb-5 p-10">
            <button className="overlay" aria-label="button"></button>
            {imgData?.label ? (
              <div className="tag__name absolute flex gap-y-2 top-2 col left-3 zindex-2">
                <p
                  className="r-4 "
                  style={{
                    maxHeight: 32,
                    background: imgData?.bg ?? "#FFFFFF",
                    color: imgData?.color ?? "var(--themeColor)",
                  }}
                >
                  {imgData?.label}
                </p>
              </div>
            ) : <></>}

            {!loadPreRender && isYouTubeUrlMemo ? (
                <RenderVideo videoData={selectedImage}  />
            ):(
              <button className="absolute w-1/1 h-1/1 top-0 left-0 pointer" aria-label="button" onClick={() => setShowPopup(true)}>
                <Img
                  type="img"
                  animation={false}
                  src={handleImage(selectedImage)}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                  webp={false}
                  alt={alt}
                />
              </button>
            )}

            <div style={{ paddingTop: "100%" }}></div>
          </div>
          <div className="img__thumbnailContainer container relative">
            {showAll ? (
              <>
                {data?.length &&
                  data?.map((imageData, index) => (
                    <div className="thumb__img" key={`data_img__thumbnailContainer_${index}`}>
                      <div className="image__wrapper relative"
                        key={`image__wrapper${index}`}
                        onClick={() => {
                          handleThumbnailClick(imageData?.image);
                          setId(index)
                        }}
                      >
                        <div className="absolute w-1/1 h-1/1 top-0 left-0">
                          <Img src={handleImage(imageData?.image)} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                        </div>
                        <div style={{ paddingTop: "100%" }}></div>
                      </div>
                    </div>
                  ))}
              </>
            ) : (
              <>
                {data?.length &&
                  data?.slice(0, 5)?.map((imageData, index) => (
                    <div className="thumb__img" key={`thumb__img__${index}`}>
                      {index === 4 && data?.length > 5 && !showAll ? (
                        <div
                          className="image__wrapper relative p-2 relative w-1/1 h-1/1"
                          key={index}
                          onClick={() => {
                            setShowPopup(true);
                          }}
                        >
                          <div className="image__inner absolute w-1/1 h-1/1 top-0 left-0 flex center middle">
                            <p className="w-1/1 h-1/1 fs-20 sm-fs-32">{`+${data?.length - 4}`}</p>
                           </div>
                        </div>
                      ) : (
                        <div
                          className={`image__wrapper  relative ${index == id ? "hover" : ""}`}
                          key={index}
                          onClick={() => { handleThumbnailClick(imageData?.image); setId(index) }}
                        >

                          {!loadPreRender && isYouTubeUrl(imageData?.image) ? (
                            <>
                              <div className="play-button"
                              ></div>
                              <RenderMediaImage imageData={imageData?.image} />
                            </>
                          ) : (
                            <>
                              <div className="image__inner absolute w-1/1 h-1/1 top-0 left-0 flex center middle">
                                <Img
                                  src={handleImage(imageData?.image)}
                                  alt={`Thumbnail ${index + 1}`}
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "contain",
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = placeholderImage;
                                  }}
                                />
                              </div>
                              <div style={{ paddingTop: "100%" }}></div>
                            </>
                          )}

                        </div>
                      )}
                    </div>
                  ))}

              </>
            )}
          </div>
          {showPopup ? (width > 768 ?
            <GalleryPopup show={showPopup} data={data} active={id} open={setShowPopup} />
            :
            <GallerySlider show={showPopup} data={data} active={id} open={setShowPopup} />
          ) : <></>}
        </React.Fragment>
     
  );
};

export default GalleryVariant;