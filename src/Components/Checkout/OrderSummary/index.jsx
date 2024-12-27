import React, { useState } from "react";
import "./styles.scss";
import Img from "Components/Img";
import { useSelector } from "react-redux";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useWindowSize } from "Utilities";

function OrderSummary({ summaryData }) {
  const {
    cartDetails
  } = useSelector((state) => {
    return {
      cartDetails: state?.cartItems?.[0],
      token: state?.token,
      isLoggedUser: state?.isLoggedUser,
      updateCartItems: state?.updateCartItems,
      guestKey: state?.guestKey,
      guestQuoteId: state?.guestQuoteDetails?.id,
      customerQuoteId: state?.customerQuoteId,
      customerId: state?.customerDetails?.id,
      updateWishList: state?.updateWishList,
    };
  });
  const [width] = useWindowSize();
  const cartImg = "res/img/carticon.svg";
  const [details, setDetails] = useState(null);
  const [summaryDetails, setSummaryDetails] = useState(null);

  function handleItemClick(index) {
    setDetails((prevIndex) => (prevIndex === index ? null : index));
  }


  return (
    <div className="summary__section px-4 ">
      <div className="flex gap-4 py-6 heading">
        <div className="cartImg relative">
          <Img src={cartImg} />
        </div>
        <div className="flex middle">
          <p
            className="fw-700 fs-20 "
            onClick={() => setSummaryDetails(!summaryDetails)}
          >
            Besteloverzicht
          </p>

          <div
            className="down__icon pointer"
            onClick={() => setSummaryDetails(!summaryDetails)}
          >
            {summaryDetails ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </div>
        </div>
      </div>
      {width > 1024 || summaryDetails ? (
        <>
          <div className="product__section">
            {summaryData?.totals_detail?.items?.length
              ? summaryData?.totals_detail?.items?.map((item, ind) => (
                <div className="product__detail flex space-between w-1/1 py-4">
                  <div className="product__title">
                    <h3 className="fw-700 fs-15 line-6">
                      {item?.productName}
                    </h3>
                    <div className="details__block flex col left">
                      {item?.additionalOptions?.length || item?.options?.length ?
                        <div className="flex w-1/1">
                          {cartDetails?.totals_detail?.isSample == 1 ?
                            <div className="flex-1 ">
                              <div className="cart__details__options">
                                {item?.options?.map((option, ind) => (
                                  option.label === "Kleur" && (
                                    <div className="py-1 fs-14 flex line-6">
                                    <span>-</span> &nbsp;
                                    <div>
                                      <span>{option?.label}</span>:
                                      <span> {option?.value}</span>
                                    </div>
                                  </div>
                                   
                                  )
                                ))}
                                {item?.dropbox?.length && item.dropbox[0] !== "1"? (
                                  <div className="py-1 fs-14">
                                    -&nbsp;<span>Bestand(en):</span>
                                    {item?.dropbox?.map((element, index) => (
                                      <>
                                        {/* <span className="text-ellipse"
                                        dangerouslySetInnerHTML={{
                                          __html: element,
                                        }}
                                      ></span> */}
                                      </>
                                    ))}
                                  </div>
                                ) : (
                                  ""
                                )}
                              </div>


                            </div> :
                            <div className="flex-1 ">
                              {details == ind ? (
                                <div className="cart__details__options">
                                     <div className="py-1 fs-14 flex line-6">
                                    <span>-</span> &nbsp;
                                    <div>
                                      <span>Artikelnummer</span>:
                                      <span> {item?.sku}</span>
                                    </div>
                                  </div>
                                 
                                  {item?.options?.map((option, ind) => (
                                   
                                    <div className="py-1 fs-14 flex line-6">
                                    <span>-</span> &nbsp;
                                    <div>
                                      <span>{option?.label}</span>:
                                      <span> {option?.value}</span>
                                    </div>
                                  </div>
                                  ))}
                                  
                                  {item?.additionalOptions.length
                                    ? item?.additionalOptions?.map(
                                      (option, ind) => (
                                      
                                        <div className="py-1 fs-14 flex line-6">
                                        <span>-</span> &nbsp;
                                        <div>
                                          <span>{option?.label}</span>:
                                          <span> {option?.value}</span>
                                        </div>
                                      </div>
                                      )
                                    )
                                    : ""}
                                     <div className="py-1 fs-14 flex line-6">
                                    <span>-</span> &nbsp;
                                    <div>
                                      <span>Aantal</span>:
                                      <span> {item?.qty}</span>
                                    </div>
                                  </div>
                                  {/* {item?.dropbox.length && item.dropbox[0] !== "1"? (
                                    <div className="py-1 fs-14">
                                      - <span className="mb-4"> Bestand(en):</span>
                                      {(() => {
                                        const aTagsArray = item?.dropbox?.[0]?.split(',').map(tag => tag.trim());
                                        return (
                                          aTagsArray?.map((aTag, index) => (
                                            <>
                                              <span className="text-ellipse"
                                                dangerouslySetInnerHTML={{
                                                  __html: aTag,
                                                }}
                                              ></span>
                                            </>
                                          ))
                                        );
                                      })()}
                                    </div>
                                  ) : item?.dropbox.length && item.dropbox[0] == "1"
                                  ?
                                  <div className="py-1 fs-14 flex">
                                  -&nbsp;<span className="mb-4"> Bestand(en):</span>
                                  <span className="text-ellipse">
                                             &nbsp;Ik lever het ontwerp later aan
                                          </span>

                                </div>:""
                                  } */}
                                   {item?.dropbox.length ? (
                        <div className="best py-1 flex top fs-14">
                          {(() => {
                            const aTagsArray = item?.dropbox?.[0]?.split(',').map(tag => tag.trim());
                            return (
                              <>
                                -&nbsp;<p className=" ">
                                  <div>
                                    <span className="text-nowrap">Bestand(en):&nbsp;</span>
                                  </div>
                                  <div>
                                    {aTagsArray?.map((element, index) => (
                                      <>
                                        {element == 1 ?
                                          <span className="span__text"
                                          >
                                           
                                            <p>
                                           Ik lever het ontwerp later aan
                                            </p>
                                          </span> 
                                          :
                                         <span className="span__text"
                                            dangerouslySetInnerHTML={{
                                              __html: element,
                                            }}
                                          ></span>
                                        }

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
                                className="fs-14 text-underline pt-2"
                                aria-label="button"
                              >
                                {details == ind
                                  ? "Verberg details"
                                  : "Bekijk details"}
                                <span className="flex middle up_icon">
                                  {details == ind ? (
                                    <KeyboardArrowUpIcon />
                                  ) : (
                                    <KeyboardArrowDownIcon />
                                  )}
                                </span>
                              </button>
                            </div>}

                        </div> : ""
                      }

                    </div>
                  </div>
                  <div className="product__price">
                    <h3 className="fw-700 fs-15">{item?.totalPrice}</h3>
                  </div>
                </div>
              ))
              : ""}
          </div>

          <div className="priceDetails pt-6 pb-4  ">
            <table className="w-1/1">
              <tr>
                <td>Digitale drukproef</td>
                <td>
                  <b className="normal green">Gratis</b>
                </td>
              </tr>
              <tr>
                <td>Instelkosten</td>
                <td>
                  {summaryData?.totals_detail?.setupCost ==
                    "0,00"
                    ? <b className="normal green">Gratis</b>
                    : summaryData?.totals_detail?.setupCost}</td>
              </tr>
             
              <tr>
                <td>Verzendkosten</td>
                <td>
                  {summaryData?.totals_detail?.postageCosts == null
                    ? "" : summaryData?.totals_detail?.postageCosts ==
                      "0,00"
                      ? <b className="normal green">Gratis</b>
                      : summaryData?.totals_detail?.postageCosts}
                </td>
              </tr>
               {cartDetails?.totals_detail?.productCost && Object.values(cartDetails?.totals_detail?.productCost).map(item => (
                 <tr>
                        <td>{item?.label}</td>
                        <td>{item?.productCost}</td>
                    </tr>
            ))}
             {summaryData?.totals_detail?.couponCode ? (
                <tr>
                  <td>Kortingscode ({summaryData?.totals_detail?.couponCode})</td>
                  <td>-{summaryData?.totals_detail?.discount_amount}</td>
                </tr>
              ) : (
                ""
              )}
              <tr className="fw-700 ">
                <td className="fs-20">Totaal (excl. BTW)	</td>
                <td className="fs-26">
                  {summaryData?.tax_details?.subtotal_original}
                </td>
              </tr>
              <tr>
                <td>BTW </td>
                <td>{summaryData?.tax_details?.tax_amount}</td>
              </tr>
              <tr>
                <td>Totaalbedrag</td>
                <td>{summaryData?.tax_details?.grandTotal}</td>
              </tr>
            </table>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default OrderSummary;
