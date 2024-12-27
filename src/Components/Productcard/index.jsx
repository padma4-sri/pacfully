import React, { useEffect, useState, useContext, useRef } from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import { Link, useNavigate } from "react-router-dom";
import { Toggleup, WishOutlineIcon, WishFullIcon } from "Res/icons/index";
import { SkeletonLine, SkeletonImg } from "Components/Skeletion";
import { Tooltip } from "@mui/material";
import Img from "Components/Img";
import { IconButton } from "@mui/material";
import "keen-slider/keen-slider.min.css";
import {
  addWishList,
  useWindowSize,
  removeWishlist,
  handleAddToRecent,handleImage
} from "Utilities";
import { useDispatch, useSelector } from "react-redux";
import {
  ACTION_OPEN__LOGIN,
  ACTION_OPEN__FORGOTPASSWORD,
  ACTION_WISHLISTPRODUCTID,
  ACTION_UPDATE__WISHLIST,
  ACTION_GET__URLTYPE,
} from "Store/action";
import Slider from "react-slick";
import TagManager from "react-gtm-module";
import AdvancedLink from "Components/AdvancedLink";
import CircularProgress from "@mui/material/CircularProgress";

const ColorSlider = ({
  color,
  plp,
  onColorChange,
  urlKey,
  setDisableSlider = () => {},
}) => {
  const [width] = useWindowSize();
  const [currentPosition, setCurrentPosition] = useState(0);
  const sliderRef = useRef(null);
  const isDrag = useRef(true);

  const handleColorHover = (colorCode) => {
    onColorChange(colorCode);
  };

  const [isDragging, setDragging] = useState(false);
  const [startPositionX, setStartPositionX] = useState(0);

  const handleSwipeStart = (event) => {
    setDragging(true);
    setStartPositionX(getClientX(event));
  };

  const handleSwipeMove = (event) => {
    if (isDragging) {
      const currentPositionX = getClientX(event);
      const deltaX = currentPositionX - startPositionX;

      if (!isDrag.current) {
        if (deltaX > 0) {
          isDrag.current = true;
          sliderRef.current.slickGoTo(currentPosition - 1);
        } else {
          isDrag.current = false;
        }
      }
      const slickInstance = sliderRef.current.innerSlider;
      slickInstance.slickGoTo(slickInstance.currentSlide - deltaX);

      setStartPositionX(currentPositionX);
    }
  };

  const handleSwipeEnd = () => {
    setDragging(false);
  };

  const getClientX = (event) => {
    return event.type === "touchstart" || event.type === "touchmove"
      ? event.touches[0].clientX
      : event.clientX;
  };

  const getColorsLenght = Object.keys(color)?.length;
  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    initialSlide: 0,
    swipeToSlide: true,
    arrows: true,
    variableWidth: true,
    swipe: isDrag.current,
    beforeChange: (oldIndex, newIndex) => {
      setCurrentPosition(newIndex);
    },
  };

  useEffect(() => {
    if (currentPosition > 0)
      setTimeout(() => {
        if (
          (width >= 647 || (width < 647 && !plp)) &&
          currentPosition + 9 >= getColorsLenght
        ) {
          const scrollTo = getColorsLenght - 9;
          sliderRef.current.slickGoTo(scrollTo);
        } else if (
          width >= 320 &&
          width < 360 &&
          plp &&
          currentPosition + 8 >= getColorsLenght
        ) {
          const scrollTo = getColorsLenght - 8;
          sliderRef.current.slickGoTo(scrollTo);
        } else if (
          width >= 360 &&
          width < 500 &&
          plp &&
          currentPosition + 5 >= getColorsLenght
        ) {
          const scrollTo = getColorsLenght - 5;
          sliderRef.current.slickGoTo(scrollTo);
        } else if (
          width >= 500 &&
          width < 560 &&
          plp &&
          currentPosition + 6 >= getColorsLenght
        ) {
          const scrollTo = getColorsLenght - 6;
          sliderRef.current.slickGoTo(scrollTo);
        } else if (
          width >= 560 &&
          width < 647 &&
          plp &&
          currentPosition + 7 >= getColorsLenght
        ) {
          const scrollTo = getColorsLenght - 7;
          sliderRef.current.slickGoTo(scrollTo);
        }
        // drag
        if (
          (width >= 320 &&
            width < 360 &&
            plp &&
            currentPosition + 8 >= getColorsLenght) ||
          (width >= 360 &&
            width < 500 &&
            plp &&
            currentPosition + 5 >= getColorsLenght) ||
          (width >= 500 &&
            width < 560 &&
            plp &&
            currentPosition + 6 >= getColorsLenght) ||
          (width >= 560 &&
            width < 647 &&
            plp &&
            currentPosition + 7 >= getColorsLenght) ||
          ((width >= 647 || (width < 647 && !plp)) &&
            currentPosition + 9 >= getColorsLenght)
        ) {
          isDrag.current = false;
        } else {
          isDrag.current = true;
        }
      }, 500);
  }, [sliderRef.current, currentPosition]);

  return (
    <div
      className={`colorList absolute zindex-1 ${
        (width >= 320 && width < 360 && plp && getColorsLenght <= 8) ||
        (width >= 360 && width < 500 && plp && getColorsLenght <= 5) ||
        (width >= 500 && width < 560 && plp && getColorsLenght <= 6) ||
        (width >= 560 && width < 647 && plp && getColorsLenght <= 7) ||
        ((width >= 647 || (width < 647 && !plp)) && getColorsLenght <= 9)
          ? "fullwidth"
          : "moreColors"
      } }`}
    >
      <div
        className="list"
        onMouseEnter={() => setDisableSlider(true)}
        onMouseLeave={() => setDisableSlider(false)}
      >
        <div className="pad">
          <div
            className={`content 
          ${
            (width >= 320 &&
              width < 360 &&
              plp &&
              currentPosition + 8 >= getColorsLenght) ||
            (width >= 360 &&
              width < 500 &&
              plp &&
              currentPosition + 5 >= getColorsLenght) ||
            (width >= 500 &&
              width < 560 &&
              plp &&
              currentPosition + 6 >= getColorsLenght) ||
            (width >= 560 &&
              width < 647 &&
              plp &&
              currentPosition + 7 >= getColorsLenght) ||
            ((width >= 647 || (width < 647 && !plp)) &&
              currentPosition + 9 >= getColorsLenght)
              ? "hideRightArrow"
              : ""
          } 
          ${
            currentPosition === getColorsLenght ||
            currentPosition + 1 === getColorsLenght ||
            currentPosition + 2 === getColorsLenght ||
            currentPosition + 3 === getColorsLenght
              ? "hideLeftArrow"
              : ""
          }
          `}
          >
            <Slider {...settings} ref={sliderRef}>
              {getColorsLenght ? (
                Object.keys(color)?.map((c, index) => (
                  <div className={``} key={`${urlKey}${index + 1}`}>
                    {color[c]?.colorcode?.includes("https:") ? (
                      <div
                        key={`${urlKey}${c}_${index}`}
                        className="colorcircle flex gap-2"
                        onMouseEnter={() => handleColorHover(color[c])}
                        onTouchStart={handleSwipeStart}
                        onTouchMove={handleSwipeMove}
                        onTouchEnd={handleSwipeEnd}
                        onMouseDown={handleSwipeStart}
                        onMouseMove={handleSwipeMove}
                        onMouseUp={handleSwipeEnd}
                      >
                        <img
                          src={color[c]?.colorcode}
                          alt={`slider_${index}`}
                        />
                      </div>
                    ) : (
                      <div
                        key={`${urlKey}${c}_${index}`}
                        className="colorcircle flex gap-2"
                        style={{ background: color[c]?.colorcode }}
                        onMouseEnter={() => handleColorHover(color[c])}
                        onTouchStart={handleSwipeStart}
                        onTouchMove={handleSwipeMove}
                        onTouchEnd={handleSwipeEnd}
                        onMouseDown={handleSwipeStart}
                        onMouseMove={handleSwipeMove}
                        onMouseUp={handleSwipeEnd}
                      ></div>
                    )}
                  </div>
                ))
              ) : (
                <></>
              )}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};
const ProductCard = ({
  data,
  loading = false,
  goto = null,
  onSilde = false,
  isWishList = false,
  plp = false,
  setDisableSlider = () => {},
  pageName = "",
}) => {
  const [imageSrc, setImageSrc] = useState("");
  const navigate = useNavigate();
  const { storeId, defaultURL, baseURL } = useContext(DomainContext);
  const dispatch = useDispatch();
  const DeleteIcon = "/res/img/deleteIcon.svg";
  const isLoggedUser = useSelector((state) => state?.isLoggedUser);
  const customerId = useSelector((state) => state?.customerDetails?.id);
  const token = useSelector((state) => state?.token);
  const wishlistAddedData = useSelector((state) => state?.wishlistAddedData);
  const isSessionExpired = useSelector((state) => state?.isSessionExpired);
  const [selectedImage, setSelectedImage] = useState("");
  const [cardHover, setcardHover] = useState(false);
  const [cardHoverDelay, setcardHoverDelay] = useState(false);
  const recentProducts = useSelector((state) => state?.recentProducts);
  const [wishlistResponse, setwishlistResponse] = useState({
    res: {},
    status: null,
  });

  const [loadingState, setLoadingState] = useState({});
  const setLoadingStateForProduct = (sku, value) => {
    setLoadingState((prevState) => ({
      ...prevState,
      [sku]: value,
    }));
  };
  const wishItem = wishlistAddedData?.filter((obj) => obj?.sku === data?.sku);
  const handleColorChange = (color) => {
    setSelectedImage(color?.image);
  };
  const productId = data?.entityId;
  const productSku = data?.sku;
  const productName = data?.name;
  let timeOut = null;

  const updateWishListAction = () => {
    dispatch(ACTION_UPDATE__WISHLIST());
  };

  useEffect(() => {
    if (cardHover) setcardHoverDelay(true);
    else
      timeOut = setTimeout(
        () =>
          !cardHover && !loadingState[productSku] && setcardHoverDelay(false),
        200
      );
    return () => timeOut && clearTimeout(timeOut);
  }, [cardHover]);

  useEffect(() => {
    if (wishlistResponse?.res?.data?.[0]?.message) {
      setTimeout(() => {
        setwishlistResponse({
          res: {},
          status: null,
        });
      }, 5000);
    }
  }, [wishlistResponse?.res?.data?.[0]?.message]);

  const addToWishlist__gtm = (productName, productSku) => {
    const data = {
      event: "addToWishlist",
      eventLabel: productName,
      ecommerce: {
        addwishlist: {
          products: [
            {
              name: productName,
              id: productSku,
            },
          ],
        },
      },
    };

    TagManager.dataLayer({ dataLayer: data });
    console.log("GTM_EVENT addToWishlist", data);
  };

 
  useEffect(() => {
    if (data?.image) {
      setImageSrc(data?.image);
    }
  }, [data]);

  useEffect(() => {
    if (data?.image && selectedImage) {
      setImageSrc(selectedImage);
    }
  }, [selectedImage]);

  useEffect(() => {
    if (wishlistAddedData) {
      setLoadingStateForProduct(productSku, false);
      setcardHoverDelay(false);
    }
  }, [wishlistAddedData]);

  return goto && goto.url && goto.url !== "/undefined" && goto.name ? (
    <div
      className="product__block flex w-1/1 h-1/1 center middle col gap-7"
      style={{ padding: "0 17px" }}
    >
      <AdvancedLink
        to={goto.url}
        state={{
          urlType: {
            entityType: "category",
            level: "3",
            isChildExist: 1,
          },
        }}
        className="flex w-1/1 h-1/1 center middle r-5"
        style={{ background: "#f5f5f5" }}
      >
        <span
          className="flex w-1/1 h-1/1 col center middle gotoText fw-700 tc hover__underline"
          style={{ fontSize: 18 }}
        >
          bekijk alle
          <br />
          {goto.subTitle}
        </span>
      </AdvancedLink>
      <div className="" style={{ minHeight: 88 }}></div>
    </div>
  ) : (
    <div className="product__grid">
      <div className="product__block flex col gap-7">
        {
          <>
            {loading ? (
              <div className="image__block">
                <Link className="r-5 pt-2 pl-3 relative" aria-label={"skeleton"}>
                  <SkeletonImg className="flex absolute top-0 left-0 zindex-1" />
                </Link>
              </div>
            ) : (
              <div
                className={`image__block relative ${
                  cardHoverDelay ? "cardHover" : ""
                }`}
                onMouseEnter={() => setcardHover(true)}
                onMouseLeave={() => setcardHover(false)}
              >
                {data?.wish_status !== 0 &&
                (data?.stock_status === "1" ||
                  window.location.pathname ===
                    "/mijn-account/mijn-favorieten") ? (
                  <div
                    className="wishedItem absolute zindex-1"
                    style={{
                      top: 8,
                      right: 8,
                    }}
                  >
                    {!isWishList ? (
                      wishItem?.length ? (
                        <>
                          {loadingState[productSku] ? (
                            <CircularProgress
                              size={20}
                              thickness={4}
                              style={{
                                color: "black",
                                top: 8,
                                right: 8,
                                position: "relative",
                              }}
                            />
                          ) : (
                            <IconButton
                              sx={{ background: "#fff" }}
                              aria-label="wishlist"
                              onClick={(e) => {
                                e.preventDefault();
                                setLoadingStateForProduct(productSku, true);
                                setcardHoverDelay(true);
                                removeWishlist(
                                  baseURL,
                                  token,
                                  dispatch,
                                  wishItem?.[0]?.itemId,
                                  wishItem?.[0]?.sku,
                                  wishlistAddedData,
                                  customerId,
                                  storeId,
                                  () => {},
                                  navigate,
                                  isSessionExpired
                                );
                              }}
                            >
                              <WishFullIcon />
                            </IconButton>
                          )}
                        </>
                      ) : (
                        <>
                          {loadingState[productSku] ? (
                            <CircularProgress
                              size={20}
                              thickness={4}
                              style={{
                                color: "black",
                                top: 8,
                                right: 8,
                                position: "relative",
                              }}
                            />
                          ) : (
                            <IconButton
                              aria-label="wishlist"
                              sx={{ background: "#fff" }}
                              onClick={() => {
                                if (!isLoggedUser) {
                                  dispatch(ACTION_OPEN__LOGIN(true));
                                  dispatch(ACTION_OPEN__FORGOTPASSWORD(false));
                                  dispatch(
                                    ACTION_WISHLISTPRODUCTID({
                                      id: productId,
                                      sku: productSku,
                                    })
                                  );
                                  if (pageName) {
                                    dispatch(ACTION_GET__URLTYPE(pageName));
                                  }
                                } else if (!wishItem?.length) {
                                  setLoadingStateForProduct(productSku, true);
                                  setcardHoverDelay(true);
                                  addToWishlist__gtm(productName, productSku);
                                  addWishList(
                                    defaultURL,
                                    dispatch,
                                    token,
                                    customerId,
                                    { id: productId, sku: productSku },
                                    wishlistAddedData,
                                    storeId,
                                    navigate,
                                    isSessionExpired
                                  );
                                }
                              }}
                            >
                              <WishOutlineIcon style={{ color: "#656565" }} />
                            </IconButton>
                          )}
                        </>
                      )
                    ) : (
                      <>
                        {loadingState[productSku] ? (
                          <CircularProgress
                            size={20}
                            thickness={4}
                            style={{
                              color: "black",
                              top: 8,
                              right: 8,
                              position: "relative",
                            }}
                          />
                        ) : (
                          <IconButton
                            aria-label="wishlist"
                            sx={{ background: "#fff" }}
                            onClick={(e) => {
                              e.preventDefault();
                              setLoadingStateForProduct(productSku, true);
                              setcardHoverDelay(true);
                              removeWishlist(
                                baseURL,
                                token,
                                dispatch,
                                data?.wishlistItemId,
                                data?.sku,
                                wishlistAddedData,
                                customerId,
                                storeId,
                                updateWishListAction,
                                navigate,
                                isSessionExpired
                              );
                            }}
                          >
                            <Img
                              type="img"
                              alt="product delete"
                              src={DeleteIcon}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                objectFit: "contained",
                              }}
                            />
                          </IconButton>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <></>
                )}
                {onSilde === false &&
                data?.color &&
                Object.keys(data.color)?.length > 1 ? (
                  <ColorSlider
                    color={data?.color}
                    plp={plp}
                    onColorChange={handleColorChange}
                    urlKey={data?.urlKey}
                    setDisableSlider={setDisableSlider}
                  />
                ) : (
                  <></>
                )}
                <AdvancedLink
                  state={{
                    urlType: {
                      entityType: "product",
                      entityId: data?.entityId,
                    },
                  }}
                  pageTypeCheck="pdpView"
                  to={`/${data?.urlKey}`}
                  onClick={() =>
                    handleAddToRecent(
                      recentProducts,
                      data,
                      dispatch,
                      "",
                      "",
                      ""
                    )
                  }
                  className="r-5 relative overflow-hidden block"
                >
                  <Img
                    type="img"
                    src={handleImage(imageSrc ? imageSrc : data?.image)}
                    alt={data?.name}
                    onError={() => {
                      setImageSrc(data?.image);
                    }}
                  />
                  {data?.labelStatus == 1 ? (
                    <div className="tag__name absolute flex gap-y-2 top-2 col left-3">
                      <p
                        className="r-4 "
                        style={{
                          maxHeight: 28,
                          background: `${data?.labelBackgroundColor}`,
                          color: `${data?.labelColor}`,
                        }}
                      >
                        {data?.labelText}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </AdvancedLink>
              </div>
            )}
            {loading ? (
              <div className="flex col gap-1">
                <h2 className="product__title pb-2">
                  <SkeletonLine
                    animation="pulse"
                    height="30px"
                    style={{ borderRadius: "20px" }}
                  />
                </h2>
                <div className="price__action__block flex">
                  <div className="price__block flex-1 flex gap-x-2 bottom fw-700">
                    <SkeletonLine
                      animation="pulse"
                      width="100px"
                      height="38px"
                      style={{ borderRadius: "20px" }}
                    />
                  </div>
                  <div className="action__block flex-0">
                    <SkeletonLine
                      animation="pulse"
                      width="100px"
                      height="38px"
                      style={{ borderRadius: "20px" }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex col gap-1">
                <h2 className="product__title">
                  <AdvancedLink
                    to={`/${data?.urlKey}`}
                    state={{
                      urlType: {
                        entityType: "product",
                        entityId: data?.entityId,
                      },
                    }}
                    pageTypeCheck="pdpView"
                    onClick={() =>
                      handleAddToRecent(
                        recentProducts,
                        data,
                        dispatch,
                        "",
                        "",
                        ""
                      )
                    }
                    className="line-6 text__ellipse"
                  >
                    <span title={data?.name} className="tooltip-text ">{data?.name}</span>
                   </AdvancedLink>
                  {data?.minSaleQty ? (
                    <AdvancedLink
                      to={`/${data?.urlKey}`}
                      state={{
                        urlType: {
                          entityType: "product",
                          entityId: data?.entityId,
                        },
                      }}
                      pageTypeCheck="pdpView"
                      onClick={() =>
                        handleAddToRecent(
                          recentProducts,
                          data,
                          dispatch,
                          "",
                          "",
                          ""
                        )
                      }
                      className="line-6 text__ellipse"
                    >
                      vanaf {data?.minSaleQty} stuks
                    </AdvancedLink>
                  ) : (
                    <p className="fs-15" style={{ minHeight: "25px" }}></p>
                  )}
                </h2>
                <div className="price__action__block flex">
                  <div className="price__block flex-1 flex gap-x-2 bottom fw-700">
                    <p className={`label ${false ? "special" : ""}`}>vanaf</p>
                    <p className={`price ${false ? "special" : ""}`}>
                      {data?.displayPrice}
                    </p>
                    {false ? (
                      <p className="price__strike text-strike ">2,34</p>
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="action__block flex-0">
                    <AdvancedLink
                      to={`/${data?.urlKey}`}
                      state={{
                        urlType: {
                          entityType: "product",
                          entityId: data?.entityId,
                        },
                      }}
                      pageTypeCheck="pdpView"
                      onClick={() =>
                        handleAddToRecent(
                          recentProducts,
                          data,
                          dispatch,
                          "",
                          "",
                          ""
                        )
                      }
                    >
                      <label className="fw-700 text-nowrap">
                        bekijk <Toggleup />
                      </label>
                    </AdvancedLink>
                  </div>
                </div>
              </div>
            )}
          </>
        }
      </div>
    </div>
  );
};
export default ProductCard;
