import React, { useState, useEffect, useContext, memo } from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import CloseButton from "Components/CloseButton/index";
import { useSelector, useDispatch } from "react-redux";
import Img from "Components/Img";
import ModelNew from "Components/Model/ModelNew";
import Button from "Components/Common/Button";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { getCartItems,handleImage } from "Utilities";
import { ACTION_OPENCART } from "Store/action";
import { APIQueryPost } from "APIMethods/API";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import TagManager from 'react-gtm-module';
import CircularProgress from '@mui/material/CircularProgress';
import AutorenewIcon from '@mui/icons-material/Autorenew';


const ProductListing = ({ item, ind, cartDetails, dispatch, defaultURL, storeId, closeCartHandler, scrollToTop }) => {
  const navigate = useNavigate();
  const token = useSelector((state) => state?.token);
  const isLoggedUser = useSelector((state) => state?.isLoggedUser);
  const updateCartItems = useSelector((state) => state?.updateCartItems);
  const guestKey = useSelector((state) => state?.guestKey);
  const guestQuoteId = useSelector((state) => state?.guestQuoteDetails?.id);
  const customerQuoteId = useSelector((state) => state?.customerQuoteId);
  const customerId = useSelector((state) => state?.customerDetails?.id)
  const isSessionExpired = useSelector((state) => state?.isSessionExpired)
  const [details, setDetails] = useState(null);
  const DeleteIcon = "/res/img/deleteIcon.svg";
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingupdate, setLoadingUpdate] = useState(false);
  const [resMessage, setResMessage] = useState("");

  useEffect(() => {
    setTimeout(() => setResMessage(""), 5000);

  }, [resMessage])

  function handleItemClick(index) {
    setDetails((prevIndex) => (prevIndex === index ? null : index));
  }
  const removeFromCart__gtm = (item) => {
    const data = {
      event: 'removeFromCart',
      eventLabel: item?.productName,
      ecommerce: {
        remove: {
          products: [
            {
              name: item?.productName,
              id: item?.productId,
              price: item?.unitPrice,
              quantity: item?.qty
            }
          ]
        }
      },
    };

    TagManager.dataLayer({ dataLayer: data });
    console.log('GTM_EVENT removeFromCart', data);
  };
  const deleteItem = async (item) => {
    setLoadingDelete(true)
    removeFromCart__gtm(item)
    if (isLoggedUser) {
      axios
        .delete(defaultURL + `/carts/mine/items/${item?.itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 200) {
            if(res?.data[0]?.code ==400){
              setResMessage(res?.data[0]?.message)
            }
            setLoadingDelete(false)
            getCartItems(
              dispatch,
              setLoadingDelete,
              customerQuoteId,
              customerId,
              () => { },
              defaultURL,
              storeId,
              token, navigate, isSessionExpired

            );
          }
        });
    } else {
      axios
        .delete(
          defaultURL + `/guest-carts/${guestKey}/items/${item?.itemId}`,
          {
            headers: {
              Authorization: `Bearer ${guestKey}`,
            },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            if(res?.data[0]?.code ==400){
              setResMessage(res?.data[0]?.message)
            }
            setLoadingDelete(false)
            getCartItems(
              dispatch,
              setLoadingDelete,
              guestQuoteId,
              "",
              () => { },
              defaultURL,
              storeId,
              token, navigate, isSessionExpired
            );
          }
        });
    }
  };
  const InputField = ({ item, ind, setLoadingUpdate ,setResMessage}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [quantity, setQuantity] = useState({
      item: "",
      quantity: "",
      delay: false,
    });

    const [editquantity, setEditquantity] = useState({
      id: "",
      status: false,
    });
    
    const handleEditquantity = (id) => {
      setEditquantity({
        id,
        status: true,
      });
    };

    const updateQtyValue = async (index, item, qty, delay) => {
      setIsLoading(true);
      setQuantity({ item, quantity: qty, delay });

      if ((qty === "" || qty > -1) && item?.minSaleQty < qty) {
        const tempItems = [...cartDetails?.totals_detail?.items];
        tempItems[index] = { ...tempItems[index], qty };
        setQuantity({ item, quantity: qty, delay });

      }
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
    };
    const updateCartCount = () => {
     
      const updateCart = {
        isLoader: true,
        loaderAction: (bool) => setLoadingUpdate(bool),
        setGetResponseData: (resData) => {
          if (resData?.status == 200) {
            if(  quantity?.item?.minSaleQty > quantity?.quantity){
              setResMessage(`Het ingevoerde aantal is onder het minimum bestelaantal.`) 
            }else if(resData?.data[0]?.code ==400){
              setResMessage(resData?.data[0]?.message)
            }
            if (isLoggedUser) {
              getCartItems(
                dispatch,
                setLoadingCart,
                customerQuoteId,
                customerId,
                () => { },
                defaultURL,
                storeId,
                token, navigate, isSessionExpired
              );

            } else {
              getCartItems(
                dispatch,
                setLoadingCart,
                guestQuoteId,
                "",
                () => { },
                defaultURL,
                storeId,
                token, navigate, isSessionExpired

              );
            }
          }
          if (resData?.data[0]?.code == 400) {
            setResMessage(resData?.data[0]?.message)
          }
        },

        axiosData: {
          url: `${defaultURL}/cart/updateitem`,
          paramsData: {
            data: {
              storeId: storeId,
              quote_id: customerQuoteId ? customerQuoteId : guestQuoteId,
              item_id: quantity?.item?.itemId,
              qty:
                quantity?.item?.minSaleQty > quantity?.quantity
                  ? quantity.item?.minSaleQty
                  : quantity?.quantity,
              maxSaleQty: quantity?.item?.maxSaleQty,
              qty_increments:item?.qty_increments
            },
          },
        },
      };
      // API
      if (quantity?.item?.itemId) {
        APIQueryPost(updateCart);
      }
    };
    useEffect(() => {
      if (quantity?.quantity && quantity.quantity !== "") {
        const temp = setTimeout(
          () => updateCartCount(updateCartItems),
          quantity.delay ? 1000 : 0
        );
        return () => clearTimeout(temp);
      }
    }, [quantity]);
    return (
      <div className="input__container flex center">
        {item?.productId == "311373" ? "" :
          <button
            onClick={() =>
              updateQtyValue(ind, item, item?.status_qty_increments ? item?.qty - item?.qty_increments : item?.qty - 1, false)

            }
            aria-label="button"
            disabled={isLoading || item?.minSaleQty > item?.qty - 1}
          >
            -
          </button>
        }

        <input
          type="number"
          aria-label="number"
          value={
            editquantity.status &&
              editquantity.id == item?.itemId
              ?
              quantity?.quantity
              : item?.qty
          }
          onFocus={() =>
            setQuantity((prevState) => ({
              ...prevState,
              quantity: "",
            }))
          }
          onClick={() => {
            handleEditquantity(item?.itemId)
          }}
      
          onChange={(e) =>{
            let value = e.target.value;                               
            if (!isNaN(value)) {
              value = value.slice(0, 6); 
            updateQtyValue(ind, item,value, true)
            }
          } 
        }
          onBlur={() =>
            setQuantity((prevState) => ({
              ...prevState,
              quantity:
                item?.minSaleQty > quantity?.quantity && quantity?.quantity
                  ? item?.minSaleQty :
                  item?.minSaleQty < quantity?.quantity && quantity?.quantity
                    ? quantity?.quantity :
                    item?.qty,
            }))
          }
          disabled={item?.productId == "311373"}
          className="fs-16"
        />

        {item?.productId == '311373' ? "" :
          <button
            disabled={isLoading}
            onClick={() =>
    updateQtyValue(ind, item, item?.status_qty_increments ? item?.qty + item?.qty_increments : item?.qty + 1, false)

            }
            aria-label="button"
          >
            +
          </button>
        }
      </div>
    )
  }



  return (
    <div
      className="flex gap-4 start w-1/1 pt-4 pb-3"
      key={`social__sidebar${ind}`}
    >
      <div className=" flex center">
        <div className="product__img flex relative center">
          <a
            className={`${item?.productId == "311373" ? "Cauto" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              closeCartHandler();

              if (item?.productId !== "311373") {
                if (item?.pdpUrl) {
                  if (
                    item.pdpUrl.includes("http") ||
                    item.pdpUrl.includes("www")
                  ) {
                    const { pathname, search } = new URL(item?.pdpUrl);
                    let pathWithQuery = pathname + search;
                    const parsedUrl = new URL(item?.pdpUrl);
                    const queryParams = parsedUrl.searchParams;

                    queryParams.set("qty", item?.qty);

                    pathWithQuery =
                      parsedUrl.pathname + "?" + queryParams.toString();

                    const uploadedArry = item?.dropbox?.[0]
                      ?.split(",")
                      .map((tag) => tag.trim());
                    const pathList = [];
                    uploadedArry?.length &&
                      uploadedArry.map((txt) => {
                        const element = new DOMParser()
                          ?.parseFromString(txt, "text/html")
                          ?.getElementsByTagName("a")[0]?.attributes;
                        if (element?.path?.value)
                          pathList.push(element.path.value);
                        return null;
                      });
                    const url1 = pathWithQuery.replace(/\+/g, "%20");
                    const url2 = url1.replaceAll("%3A", ":");
                    const url = url2.replaceAll("%2C", ",");
                    if (pathList.length)
                      navigate(`${url}`, { state: { uploadData: pathList } });
                    else navigate(`${url}`);
                    scrollToTop();
                  } else {
                    const newUrl = `/${item.pdpUrl}`;
                    navigate(newUrl);
                    scrollToTop();
                  }
                }
              }
            }}
          >
            <Img src={handleImage(item?.image)} />
          </a>
        </div>
      </div>
      <div className=" w-1/1 flex col gap-1 social__detail top">
        <a
          className={`${item?.productId == "311373" ? "Cauto" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            closeCartHandler();
            if (item?.productId !== "311373") {
              if (item?.pdpUrl) {
                if (
                  item.pdpUrl.includes("http") ||
                  item.pdpUrl.includes("www")
                ) {
                  const { pathname, search } = new URL(item?.pdpUrl);
                  let pathWithQuery = pathname + search;
                  const parsedUrl = new URL(item?.pdpUrl);
                  const queryParams = parsedUrl.searchParams;
                  queryParams.set("qty", item?.qty);
                  pathWithQuery =
                    parsedUrl.pathname + "?" + queryParams.toString();
                  const uploadedArry = item?.dropbox?.[0]
                    ?.split(",")
                    .map((tag) => tag.trim());
                  const pathList = [];
                  uploadedArry?.length &&
                    uploadedArry.map((txt) => {
                      const element = new DOMParser()
                        ?.parseFromString(txt, "text/html")
                        ?.getElementsByTagName("a")[0]?.attributes;
                      if (element?.path?.value)
                        pathList.push(element.path.value);
                      return null;
                    });
                  const url1 = pathWithQuery.replace(/\+/g, "%20");
                  const url2 = url1.replaceAll("%3A", ":");
                  const url = url2.replaceAll("%2C", ",");
                  if (pathList.length)
                    navigate(`${url}`, { state: { uploadData: pathList } });
                  else navigate(`${url}`);
                  scrollToTop();
                } else {
                  const newUrl = `/${item.pdpUrl}`;
                  navigate(newUrl);
                  scrollToTop();
                }
              }
            }
          }}
        >
          <h3 className="fw-700">{item?.productName}</h3>
        </a>
        <div className="details__block flex col left">
          {item?.options?.length || item?.additionalOptions?.length ? (
            <div className="flex w-1/1">
              {cartDetails?.totals_detail?.isSample == 1 ? (
                <>
                  <div className="flex-1 py-3">
                    {details == ind ? (
                      <div className="cart__details__options">
                        {item?.options?.map(
                          (option, ind) =>
                            option.label === "Kleur" && (
                              <div className="py-1 fs-14 flex line-6">
                                <span>-</span> &nbsp;
                                <div>
                                  <span>{option?.label}</span>:
                                  <span> {option?.value}</span>
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    ) : (
                      ""
                    )}
                    <button
                      onClick={() => handleItemClick(ind)}
                      className="fs-14 text-underline"
                      aria-label="button"
                    >
                      {details == ind ? "Verberg details" : "Bekijk details"}
                      <span className="flex middle up__arrow">
                        {details == ind ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 py-3">
                  {details == ind ? (
                    <div className="cart__details__options">
                      {item?.options?.map((option, ind) => (
                        <div className="py-1 fs-14 flex line-6">
                          <span>-</span> &nbsp;
                          <div>
                            <span>{option?.label}</span>:
                            <span> {option?.value}</span>
                          </div>
                        </div>
                      ))}
                      {item?.additionalOptions?.length
                        ? item?.additionalOptions?.map((option, ind) => (
                            <div className="py-1 fs-14">
                              - <span>{option?.label}</span>:
                              <span> {option?.value}</span>
                            </div>
                          ))
                        : ""}

                      {item?.dropbox.length ? (
                        <div className="best py-1 flex top fs-14">
                          {(() => {
                            const aTagsArray = item?.dropbox?.[0]
                              ?.split(",")
                              .map((tag) => tag.trim());
                            return (
                              <>
                                -&nbsp;
                                <p className=" ">
                                  <div>
                                    <span className="text-nowrap">
                                      Bestand(en):&nbsp;
                                    </span>
                                  </div>
                                  <div>
                                    {aTagsArray?.map((element, index) => (
                                      <>
                                        {element == 1 ? (
                                          <span className="span__text">
                                            <p>
                                              Ik lever het ontwerp later aan
                                            </p>
                                          </span>
                                        ) : (
                                          <span
                                            className="span__text"
                                            dangerouslySetInnerHTML={{
                                              __html: element,
                                            }}
                                          ></span>
                                        )}
                                      </>
                                    ))}
                                  </div>
                                </p>
                              </>
                            );
                          })()}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                  <button
                    onClick={() => handleItemClick(ind)}
                    className="fs-14 text-underline"
                    aria-label="button"
                  >
                    {details == ind ? "Verberg details" : "Bekijk details"}
                    <span className="flex middle up__arrow">
                      {details == ind ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            ""
          )}
          <div className="flex middle md-flex md-gap-4 gap-2 relative">
            {cartDetails?.totals_detail?.isSample == 1 ? (
              ""
            ) : loadingCart ? (
              <div className="input__container_loader flex center middle">
                <CircularProgress
                  size={18}
                  thickness={4}
                  style={{ color: "black" }}
                />
              </div>
            ) : loadingupdate ? (
              <div className="input__container_loader flex center middle">
                <CircularProgress
                  size={18}
                  thickness={4}
                  style={{ color: "black" }}
                />
              </div>
            ) : (
              <InputField
                item={item}
                ind={ind}
                setLoadingUpdate={setLoadingUpdate}
                setResMessage={setResMessage}
              />
            )}
            <div>
              <span className="stockprice">{item?.unitPrice} per stuk</span>
            </div>
            {item?.productId == "311373" ? (
              ""
            ) : loadingDelete ? (
              <div
                className={`${loadingDelete ? "rotateUpdate" : ""} relative`}
              >
                <AutorenewIcon />
              </div>
            ) : (
              <div
                className="delete__img relative"
                onClick={() => {
                  deleteItem(item);
                }}
              >
                <Img
                  type="img"
                  src={DeleteIcon}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contained",
                  }}
                />
              </div>
            )}
          </div>
        </div>
        {resMessage ? <p className="error pt-2">{resMessage}</p> : ""}
      </div>
      <div className="">
        <h3 className="fw-700 fs-16 text-nowrap">{item?.totalPrice}</h3>
      </div>
    </div>
  );
}
const MiniCart = () => {
  const { defaultURL, storeId } = useContext(DomainContext);

  const payment = "/res/img/payment.svg";
  const dispatch = useDispatch();
  const [expandPrice, setExpandPrice] = useState(false);
  const openCart = useSelector((state) => state?.openCart);
  const minicartItems = useSelector((state) => state?.minicartItems);
  const cartDetails = useSelector((state) => state?.cartItems?.[0]);

  const closeCartHandler = () => {
    dispatch(ACTION_OPENCART(false));
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional, for smooth scrolling
    });
  };
  const data = (
    <div className=" sidebar__minicart  flex col w-1/1 h-1/1  pb-4 overflow-hidden ">
      <div className="close__block tr flex right w-1/1 sm-px-6 px-4 pt-4 pb-2">
        <CloseButton onClickFunction={() => closeCartHandler()} />
      </div>
      <div className="sidebar__heading pb-3 px-2">
        <h1 className="fw-700">Winkelwagen</h1>
      </div>
      <div className="flex-1 h-1/1 relative ">
        <div className="absolute w-1/1 h-1/1 overflow-hidden overflow-y-auto">
          <div
            className={`flex col w-1/1  px-2  default_cart__details ${cartDetails?.totals_detail?.items?.length > 2 ? "cart__details " : ""
              }`}
           >
            {cartDetails?.totals_detail?.items?.length ? (
              cartDetails?.totals_detail?.items?.map((item, ind) => (
                <ProductListing closeCartHandler={closeCartHandler} scrollToTop={scrollToTop} item={item} ind={ind} cartDetails={cartDetails} dispatch={dispatch} storeId={storeId} defaultURL={defaultURL} />
              ))
            ) : (
              <>
                <p className="fs-14 pb-4">Uw winkelwagen is leeg.</p>
                <p className="fs-14 pt-4 flex">
                  <Link
                    to="/"
                    className="text-underline"
                    aria-label={"home"}
                    onClick={() => {
                      closeCartHandler();
                      scrollToTop();
                    }}
                  >
                    Klik hier
                  </Link>
                  &nbsp;<span className="fs-15  line-6 middle">
                    om naar de homepage te gaan
                  </span>
                </p>

              </>
            )}
          </div>
        </div>
      </div>

      {cartDetails?.totals_detail?.items?.length ? (
        <div className="minicart__footer pb-4  relative zindex-1">
          {expandPrice ? (
            <div className="flex right w-1/1 priceDetails__block sm-px-6 px-4">
              <div className="priceDetails py-3  ">
                <table>
                  <tr>
                    <td>Digitale drukproef</td>
                    <td>
                      <b className="normal green">Gratis</b>
                    </td>
                  </tr>
                  <tr>
                    <td>Instelkosten</td>
                    <td>{cartDetails?.totals_detail?.setupCost ==
                      "0,00"
                      ? <b className="normal green">Gratis</b>
                      : cartDetails?.totals_detail?.setupCost}</td>
                  </tr>
                 
                  <tr>
                    <td>Verzendkosten</td>
                    <td>
                      {cartDetails?.totals_detail?.postageCosts == null
                        ? "" : cartDetails?.totals_detail?.postageCosts ==
                          "0,00"
                          ? <b className="normal green">Gratis</b>
                          : cartDetails?.totals_detail?.postageCosts}
                    </td>
                  </tr>
                     {cartDetails?.totals_detail?.productCost && Object.values(cartDetails?.totals_detail?.productCost)?.map(item => (
                       <tr>
                            <td>{item?.label}</td>
                            <td>{item?.productCost}</td>
                        </tr>
                ))}
                 {cartDetails?.totals_detail?.couponCode ? (
                    <tr>
                      <td>
                        Kortingscode ({cartDetails?.totals_detail?.couponCode})
                      </td>
                      <td>-{cartDetails?.totals_detail?.discount_amount}</td>
                    </tr>
                  ) : (
                    ""
                  )}
                  <tr>
                    <td className="vat_font">Totaal (excl. BTW) </td>
                    <td className="vat_font">
                      {cartDetails?.tax_details?.subtotal_original}
                    </td>
                  </tr>
                  <tr>
                    <td>BTW </td>
                    <td>{cartDetails?.tax_details?.tax_amount}</td>
                  </tr>
                  <tr>
                    <td>Totaalbedrag</td>
                    <td>{cartDetails?.tax_details?.grandTotal}</td>
                  </tr>
                </table>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="flex w-1/1 top-1 action sm-px-6 px-4">
            <div className="flex-1"></div>
            <div className="flex-1 tr">
              <button
                onClick={() => setExpandPrice(!expandPrice)}
                className="fs-14 text-underline pt-3"
                aria-label="button"
              >
                {expandPrice ? "Verberg prijsdetails" : "Bekijk prijsdetails"}
              </button>
            </div>
          </div>
          <div className="flex w-1/1 top-1 priceFinal py-4  px-4">
            <div className="flex-1 fw-700 fs-20">Totaal (excl. BTW)</div>
            <div className="flex-1 tr fw-700 fs-24">
              € {cartDetails?.tax_details?.subtotal_original}
            </div>
          </div>
          <div className="action__blocks pt-2 flex col gap-y-4">
            {minicartItems == "cart" ? (
              <Link to="/winkelwagen" aria-label={"winkelwagen"}>
                <Button
                  className="fs-15 line-8 fw-700 r-8  px-5 cart__button"
                  fullWidth
                  onClick={() => {
                    closeCartHandler();
                    scrollToTop();
                  }}
                >
                  Bestellen
                  <span className="flex middle">
                    <KeyboardArrowRightIcon />
                  </span>
                </Button>
              </Link>
            ) : minicartItems == "quote" && storeId == 1 && cartDetails?.totals_detail?.isSample == "0" ? (
              <Link to="/offerteaanvraag" aria-label={"offerteaanvraag"}>
                <Button
                  className="fs-15 line-8 fw-700 r-8  px-5 quote__button"
                  fullWidth
                  onClick={() => {
                    closeCartHandler();
                    scrollToTop();
                  }}
                >
                  Vrijblijvende offerte
                </Button>
              </Link>
            ) : (
              ""
            )}

            {minicartItems == "cart" && storeId == 1 && cartDetails?.totals_detail?.isSample == "0" ? (
              <Link to="/offerteaanvraag" aria-label={"offerteaanvraag"}>
                <Button
                  className="fs-15 line-8 fw-700 r-8  px-5 quote__button"
                  fullWidth
                  onClick={() => {
                    closeCartHandler();
                    scrollToTop();
                  }}
                >
                  Vrijblijvende offerte
                </Button>
              </Link>
            ) : minicartItems == "quote" ? (
              <Link to="/winkelwagen" aria-label={"winkelwagen"}>
                <Button
                  className="fs-15 line-8 fw-700 r-8  px-5 cart__button"
                  fullWidth
                  onClick={() => {
                    closeCartHandler();
                    scrollToTop();
                  }}
                >
                  Bestellen
                  <span className="flex middle">
                    <KeyboardArrowRightIcon />
                  </span>
                </Button>
              </Link>
            ) : (
              ""
            )}

            <div className="payment__img mx-auto relative">
              <Img
                type="img"
                src={payment}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contained",
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
  return (
    <ModelNew
      from="right"
      hideScroll={false}
      zindex={11}
      openGlobal={openCart}
      setGlobalAction={() => closeCartHandler()}
      shadow={true}
      className="header__contact__sidebar"
    >
      {data}
    </ModelNew>
  );
};

export default memo(MiniCart);
