import React, { useContext, useRef, useState } from "react";
import MundoRating from "Components/Home/MundoRating";
import "./styles.scss";
import Button from "Components/Common/Button";
import Img from "Components/Img";
import Rating from "@mui/material/Rating";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { SkeletonLine } from "Components/Skeletion";
import { Toggleup, Toggledown } from "Res/icons";
import VisibleWarp from "Context/VisibleWrapper";
import RenderContext from "Context/RenderContext";
import { handleImage } from "Utilities";

const AdditionalData = ({
  loading = true, settingsData,
  mondu, reviews, setOpenReview, setOpenAllReviews,
  accordionView, setAccrodionView
}) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const {loadPreRender}=useContext(RenderContext);
  const [itemsToShow, setItemsToShow] = useState(10);

  const showAllItems = () => {
    setItemsToShow(settingsData?.stock_details?.data?.length);
  };
  const productDetailsRef = useRef(null);
  const kenmerkenRefs = useRef(null);
  const voorraadRef = useRef(null);
  const deliveryRefs = useRef(null);
  const faqRefs = useRef(null);
  const reviewsRef = useRef(null);

 
  
  const detailsReg = useRef();
  const charRef = useRef();
  const stockRef = useRef();
  const reviewRef = useRef();
  const faqRef = useRef();
  const deliveryRef = useRef();
  var headerHeight = 82;
  var detailsElem = document.querySelector('.details__block');
  var characteristicsElem = document.querySelector('.characteristics__block');
  var stockElem = document.querySelector('.stock__block');
  var faqElem = document.querySelector('.faq__block');
  var reviewElem = document.querySelector('.reviews__block');
  var deliveryElem = document.querySelector('.delivery__block');
  
  const detailsHandle = () => {
    window.scroll({ top: (detailsElem.offsetTop - headerHeight), left: 0, behavior: 'smooth' });
  };
  const charHandle = () => {
    window.scroll({ top: (characteristicsElem.offsetTop - headerHeight), left: 0, behavior: 'smooth' });
  };
  const stockHandle = () => {
    window.scroll({ top: (stockElem.offsetTop - headerHeight), left: 0, behavior: 'smooth' });
  };
  const deliveryHandle = () => {
    window.scroll({ top: (deliveryElem.offsetTop - headerHeight), left: 0, behavior: 'smooth' });
  };

  const FaqHandle = () => {
    window.scroll({ top: (faqElem.offsetTop - headerHeight), left: 0, behavior: 'smooth' });
  };
  const reviewHandle = () => {
    window.scroll({ top: (reviewElem.offsetTop - headerHeight), left: 0, behavior: 'smooth' });
  };

  const getPercentage = (count) => {
    let value = (count / (settingsData?.review_details?.five + settingsData?.review_details?.forth + settingsData?.review_details?.third + settingsData?.review_details?.second + settingsData?.review_details?.first) * 100)
    return value;
  }
  const noReviews = settingsData?.review_details?.count ? settingsData?.review_details?.count : 0;
 
  const scrollToRef = (ref, offset = 80) => {
    if (!ref?.current) return;
    const header = document.querySelector('.header') || { offsetHeight: offset };
    const headerHeight = header.offsetHeight;
    setTimeout(() => {
      const elementPosition = ref.current.getBoundingClientRect().top;
      const scrollPosition = window.pageYOffset;
      const absolutePosition = scrollPosition + elementPosition;
      window.scrollTo({
        top: absolutePosition - headerHeight,
        behavior: 'smooth'
      });
    }, 150); 
  };
  
    const removeIframes = (html) => {
    return html.replace(/<iframe[^>]*>.*?<\/iframe>/gi, ''); // Remove iframes
  };


  
  // const changeHandlerRef = (item, ref) => {
  //   setAccrodionView("");
  
  //   setTimeout(() => {
  //     setAccrodionView(item);
  
  //     if (ref && ref.current) {
  //       const element = ref.current;
  //       const headerHeight = 295; 
  //       const elementRect = element.getBoundingClientRect();
  //       const absoluteElementTop = elementRect.top + window.pageYOffset;
  //       const middleOfViewport = window.innerHeight / 2;
  //       window.scrollTo({
  //         top: absoluteElementTop - headerHeight - 10,
  //         behavior: 'smooth'
  //       });
  //     }
  //   }, 300);
  // };


  const changeHandlerRef = (newView, ref) => {
    if (newView === "") {
      setAccrodionView("");
      return;
    }
  
    if (accordionView && accordionView !== newView) {
      setAccrodionView(newView);
  
      setTimeout(() => {
        scrollToRef(ref);
      }, 300);
    } else {
      setAccrodionView(newView);
  
      if (newView) {
        
        setTimeout(() => {
          scrollToRef(ref);
        }, 300); 
      }
    }
  };
  

    /* Details */
  const detailsBlock =
    loading ?
      <div className="details__block lg-pt-6 flex col lg-flex lg-row gap-x-11 lg-pb-5">
        <div className='w-1/1 lg-w-1/2'>
          {["", "", "", "", "", "", "", "", "", "", "", ""]?.map((item, i) => (
            <div
              className="content pb-3"
              key={`pdpAddtionalDetails_Loading_skeleton${i}`}
            >
              <SkeletonLine
                animation="pulse"
                height="25px"
                style={{ borderRadius: "20px" }}
              />
            </div>
          ))}
        </div>
      </div>
      :
      <div className="details__block lg-pt-6 flex col lg-flex lg-row gap-x-11 lg-pb-5 fs-15 line-8">
        <div className='w-1/1 lg-w-1/2' dangerouslySetInnerHTML={{
          __html: loadPreRender ? removeIframes(settingsData?.staticContents?.[0]?.block): settingsData?.staticContents?.[0]?.block,
        }}>
        </div>
        {
          settingsData?.Pluspunten ?
            <div className='w-1/1 lg-w-1/2 Pluspunten'>
              <h2>Pluspunten</h2>
              <div dangerouslySetInnerHTML={{ __html: settingsData?.Pluspunten }}></div>
            </div>
            : <></>
        }
      </div>;

    /* Characteristics */
  const characteristicsBlock = (
    <div className="characteristics__block lg-pt-7 lg-pb-5 overflow-hidden overflow-x-auto">
      <h2 className="fs-24 line-9 fw-700 pb-6 hide lg-block">
        Kenmerken
      </h2>
      {
        loading ?
          ["", "", "", ""]?.map((item, i) => (
            <div
              className={`flex ${i === 3 ? '' : 'pb-3'}`}
              key={`pdpCharacteristics_Loading_skeleton${i}`}
            >
              <SkeletonLine
                animation="pulse"
                height="25px"
                style={{ borderRadius: "20px" }}
              />
            </div>
          ))
          :
          <div className="static__table">
            <table className="w-1/1 static__table">
              <tbody>
                {
                  settingsData?.characteristics?.map((item, index) => (
                    <tr key={`pdpCharacteristics${index + 1}`}>
                      <td className="px-5 py-3">{item?.label}</td>
                      <td className="px-5 py-3 fs-15">{item?.value}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
      }
    </div>
  );
  
    /* Stock */
  const stockBlock = (
    <div className="stock__block lg-pt-7 lg-pb-5 overflow-hidden overflow-x-auto">
      <h2 className="fs-24 line-9 fw-700 pb-5 hide lg-block">Voorraad </h2>
      {
        loading ?
          ["", "", "", ""]?.map((item, i) => (
            <div
              className={`block flex ${i === 3 ? '' : 'pb-3'}`}
              key={`pdpStock_Loading_skeleton${i}`}
            >
              <SkeletonLine
                animation="pulse"
                height="25px"
                style={{ borderRadius: "20px" }}
              />
            </div>
          ))
          :
          <>
          <table className="w-1/1">
            <thead>
              <tr>
                {settingsData?.stock_details?.label?.map((item, index) => (
                  <th className="fs-18 fw-700 line-9 px-5 pb-2 text-nowrap" key={`stock_details_label${index}`}>
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {settingsData?.stock_details?.data?.slice(0,itemsToShow)?.map((data, index) => (

                <tr key={`stock_details_data${index}`}>
                  <td className="px-5 py-3">
                    <div className="flex middle gap-5">
                      <div className="image tc relative">
                        <Img src={handleImage(data[0])} className="image-contain" alt={`${data[1]} - row${index + 1}`} />
                      </div>
                      <p className="fs-15 line-6">{data[1]}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 fs-15">{data[2]}</td>
                  <td className="px-5 py-3 fs-15">{data[3]}</td>
                  {data[4] &&
                    <td className="px-5 py-3 fs-15">{data[4]}</td>
                  }
                  {data[5] &&
                    <td className="px-5 py-3 fs-15">{data[5]}</td>
                  }
                </tr>
              ))}
            </tbody>
           
          </table>
          {itemsToShow < settingsData?.stock_details?.data?.length && (
          <div className="actions  pt-4">
                <Button className="py-2 px-4 r-9 fw-700" onClick={() => showAllItems()}>Laat meer zien</Button>

          </div>
          )}

         
          </>
          
           
      }
    </div>
  );
  const DeliveryBlock = 
  loading ? (
    <div className="delivery__block lg-pt-6 flex col lg-flex lg-row gap-x-11 lg-pb-5">
      <div className='w-1/1 lg-w-1/2'>
        {["", "", "", "", "", "", "", "", "", "", "", ""]?.map((item, i) => (
          <div
            className="content pb-3"
            key={`pdpAddtionalDetails_Loading_skeleton${i}`}
          >
            <SkeletonLine
              animation="pulse"
              height="25px"
              style={{ borderRadius: "20px" }}
            />
          </div>
        ))}
      </div>
    </div>
  ) : settingsData?.aanleverspecificaties ? (
    <div className="delivery__block lg-pt-6 flex col lg-flex lg-row gap-x-11 lg-pb-5 fs-15 line-8">
      <div className='w-1/1 lg-w-1/2'>
        <h2 className="w-1/1 fs-24 line-9 fw-700 reviews__block py-4 hide lg-block">
          Aanleverspecificaties
        </h2>
        <div
          dangerouslySetInnerHTML={{
            __html: settingsData?.aanleverspecificaties,
          }}
        />
      </div>
    </div>
  ) : null;

  
  const FaqBlock =
    loading ?
      <div className="faq__block lg-pt-6 flex col lg-flex lg-row gap-x-11 lg-pb-5">
        <div className='w-1/1 lg-w-1/2'>
          {["", "", "", "", "", "", "", "", "", "", "", ""]?.map((item, i) => (
            <div
              className="content pb-3"
              key={`pdpAddtionalDetails_Loading_skeleton${i}`}
            >
              <SkeletonLine
                animation="pulse"
                height="25px"
                style={{ borderRadius: "20px" }}
              />
            </div>
          ))}
        </div>
      </div>
      :
      <div className="faq__block lg-pt-6 flex col lg-flex lg-row gap-x-11 lg-pb-5 fs-15 line-8">
        <div className='w-1/1 lg-w-1/2'>
          <h2 className="w-1/1 fs-24 line-9 fw-700 reviews__block py-4 hide lg-block">Veelgestelde vragen</h2>
          <div 
          dangerouslySetInnerHTML={{
            __html: settingsData?.frequently_asked_questions,
          }}/>
        </div>

      </div>;

    /* Reviews */

  const reviewBlock = (
    <div className="reviews__block lg-pt-7 lg-pb-7">
      <h2 className="fs-24 line-9 fw-700 pb-8 hide lg-block">Reviews</h2>
      {
        loading ?
          <>
            <div className="flex gap-y-8 left col gap-x-8 xl-flex xl-row xl-gap-x-20 pb-5 xl-middle">
              {/* Rating */}
              <div className="flex col xl-tc xl-pl-10">
                <h2 className="fs-24 line-15 fw-700 average__rating">
                  <SkeletonLine
                    animation="pulse"
                    height="25px"
                    style={{ borderRadius: "20px" }}
                  />
                </h2>
                <Rating name="half-rating-read" value={5} readOnly />
                <div className="fs-15 fw-400 text-underline pt-1 line-7">
                  <SkeletonLine
                    animation="pulse"
                    height="25px"
                    style={{ borderRadius: "20px" }}
                  />
                </div>
              </div>
              {/* Progress */}
              <div className="flex progress__container col gap-y-2">
                {
                  ['', '', '', '', '']?.map((item, i) => (
                    <div className="block flex gap-x-5 middle" key={`pdpRatingLoading${i}`}>
                      <p className="text-underline fs-15 line-7">0 sterren</p>
                      <div className="progress__block relative">
                        <SkeletonLine
                          animation="pulse"
                          height="10px"
                          style={{ borderRadius: "10px" }}
                        />
                      </div>
                      <p>0</p>
                    </div>
                  ))
                }
              </div>
              {/* Actions */}
              <div className="actions flex col gap-y-4">
                <Button className="py-2 r-9">
                  <SkeletonLine
                    animation="pulse"
                    height="40px"
                    style={{ borderRadius: "36px" }}
                  />
                </Button>
                <Button className="py-2 r-9" variant="outlined">
                  <SkeletonLine
                    animation="pulse"
                    height="40px"
                    style={{ borderRadius: "36px" }}
                  />
                </Button>
              </div>
            </div>

            <div className="all__reviews pt-5">
              <h4 className="fs-16 fw-700 pb-5 line-7">Meest recente reviews</h4>
              {['', '', '']?.map((item, index) => (
                <div className="reviews__block flex col md-flex md-row gap-5 md-gap-y-10 py-8 px-2" key={`review_details_data${index}`} >
                  <div className="rating flex middle gap-3">
                    <Rating
                      name="half-rating-read"
                      value={5}
                      readOnly
                    />
                    <p className="fs-20 line-7 fw-700">0</p>
                  </div>
                  <div className="info flex-1 flex gap-2 col">
                    <h3 className="fs-18 line-7 fw-700">
                      <SkeletonLine
                        animation="pulse"
                        height="30px"
                        width="150px"
                        style={{ borderRadius: "10px" }}
                      />
                    </h3>
                    <SkeletonLine
                      animation="pulse"
                      height="25px"
                      width="100%"
                      style={{ borderRadius: "10px" }}
                    />
                    <SkeletonLine
                      animation="pulse"
                      height="25px"
                      width="100%"
                      style={{ borderRadius: "10px" }}
                    />
                    <div className="fs-15 line-7">
                      <SkeletonLine
                        animation="pulse"
                        height="25px"
                        style={{ borderRadius: "20px" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="show__more pt-5">
              <p className="fs-14 line-7 text-underline pointer">
                Bekijk alle 0 reviews
              </p>
            </div>
            <div className="flex gap-y-8 left col gap-x-8 xl-flex xl-row xl-gap-x-20 pb-5 xl-middle">
              {/* Actions */}
              <div className="actions flex col gap-y-4 pt-2">
                <Button className="py-2 px-4 r-9">
                  <SkeletonLine
                    animation="pulse"
                    height="25px"
                    style={{ borderRadius: "20px" }}
                  />
                </Button>
              </div>
            </div>
          </> :
          settingsData?.review_status > 0 ?
            <>
              <div className="flex gap-y-8 left col gap-x-8 xl-flex xl-row xl-gap-x-20 pb-5 xl-middle">
                {/* Rating */}
                <div className="flex col xl-tc xl-pl-10">
                  <h2 className="fs-24 line-15 fw-700 average__rating">
                    {parseFloat(settingsData?.review_details?.averageRating)}
                  </h2>
                  <Rating name="half-rating-read" value={parseFloat(settingsData?.review_details?.averageRating)} precision={0.5} readOnly />
                  <p className="fs-15 fw-400 text-underline pt-1 line-7">
                    {settingsData?.review_details?.count} reviews
                  </p>
                </div>
                {/* Progress */}
                <div className="flex progress__container col gap-y-2">
                  <div className="block flex col sm-flex sm-row gap-y-2 sm-gap-y-0 gap-x-5 sm-middle">
                    <p className="text-underline fs-15 line-7">5 sterren</p>
                    <div className="progress__block relative">
                      <p></p>
                      <p
                        className="absolute left-0 top-0 zindex-2"
                        style={{
                          width: `${getPercentage(settingsData?.review_details?.five)}%`,
                        }}
                      ></p>
                    </div>
                    <p>{settingsData?.review_details?.five}</p>
                  </div>
                  <div className="block flex col sm-flex sm-row gap-y-2 sm-gap-y-0 gap-x-5 sm-middle">
                    <p className="text-underline fs-15 line-7">4 sterren</p>
                    <div className="progress__block relative">
                      <p></p>
                      <p
                        className="absolute left-0 top-0 zindex-2"
                        style={{
                          width: `${getPercentage(settingsData?.review_details?.forth)}%`,
                        }}
                      ></p>
                    </div>
                    <p>{settingsData?.review_details?.forth}</p>
                  </div>
                  <div className="block flex col sm-flex sm-row gap-y-2 sm-gap-y-0 gap-x-5 sm-middle">
                    <p className="text-underline fs-15 line-7">3 sterren</p>
                    <div className="progress__block relative">
                      <p></p>
                      <p
                        className="absolute left-0 top-0 zindex-2"
                        style={{
                          width: `${getPercentage(settingsData?.review_details?.third)}%`,
                        }}
                      ></p>
                    </div>
                    <p>{settingsData?.review_details?.third}</p>
                  </div>
                  <div className="block flex col sm-flex sm-row gap-y-2 sm-gap-y-0 gap-x-5 sm-middle">
                    <p className="text-underline fs-15 line-7">2 sterren</p>
                    <div className="progress__block relative">
                      <p></p>
                      <p
                        className="absolute left-0 top-0 zindex-2"
                        style={{
                          width: `${getPercentage(settingsData?.review_details?.second)}%`,
                        }}
                      ></p>
                    </div>
                    <p>{settingsData?.review_details?.second}</p>
                  </div>
                  <div className="block flex col sm-flex sm-row gap-y-2 sm-gap-y-0 gap-x-5 sm-middle">
                    <p className="text-underline fs-15 line-7">1 ster<span className="v-hide">rren</span></p>
                    <div className="progress__block relative">
                      <p></p>
                      <p
                        className="absolute left-0 top-0 zindex-2"
                        style={{
                          width: `${getPercentage(settingsData?.review_details?.first)}%`,
                        }}
                      ></p>
                    </div>
                    <p>{settingsData?.review_details?.first}</p>
                  </div>
                </div>
                {/* Actions */}
                <div className="actions flex col gap-y-4">
                  <Button className="py-2 px-4 r-9" onClick={() => setOpenReview(true)}>Schrijf een review</Button>
                  <Button className="py-2 px-4 r-9" onClick={() => setOpenAllReviews(true)} variant="outlined">
                    Bekijk alle reviews
                  </Button>
                </div>
              </div>

              <div className="all__reviews pt-5">
                <h4 className="fs-16 fw-700 pb-5 line-7">Meest recente reviews</h4>
                {showAllReviews ? (
                  <>
                    {settingsData?.review_details?.details?.length &&
                      settingsData?.review_details?.details?.map((item, index) => (
                        <div className="reviews__block flex col md-flex md-row gap-5 md-gap-y-10 py-8 px-2" key={`review_details_data${index}`} >
                          <div className="rating flex middle gap-3">
                            <Rating
                              name="half-rating-read"
                              value={(item?.ratingValue / 2)}
                              precision={0.5}
                              readOnly
                            />
                            <p className="fs-20 line-7 fw-700">{item?.ratingValue}</p>
                          </div>
                          <div className="info">
                            <h3 className="fs-18 line-6 fw-700">{item?.title}</h3>
                            <p className="pb-5 md-pb-10 fs-15 line-7">{item?.detail}</p>
                            <p className="fs-15 line-7">
                              {item?.created_at} | {item?.nickname}
                            </p>
                          </div>
                        </div>
                      ))}
                  </>
                ) : (
                  <>
                    {settingsData?.review_details?.details?.length &&
                      settingsData?.review_details?.details?.slice(0, 5)?.map((item, index) => (
                        <div className="reviews__block flex col md-flex md-row gap-5 md-gap-y-10 py-8 px-2" key={`review_details_details${index}`}>
                          <div className="rating flex middle gap-3">
                            <Rating
                              name="half-rating-read"
                              value={(item?.ratingValue / 2)}
                              precision={0.5}
                              readOnly
                            />
                            <p className="fs-20 line-7 fw-700">{item?.ratingValue}</p>
                          </div>
                          <div className="info">
                            <h3 className="fs-18 line-6 fw-700">{item?.title}</h3>
                            <p className="pb-5 md-pb-10 fs-15 line-7">{item?.detail}</p>
                            <p className="fs-15 line-7">
                              {item?.created_at} | {item?.nickname}
                            </p>
                          </div>
                        </div>
                      ))}
                  </>
                )}
              </div>
              {settingsData?.review_details?.count > 5 && (
                <div className="show__more pt-5">
                  <p className="fs-14 line-7 text-underline pointer" onClick={() => setOpenAllReviews(true)}>
                    Bekijk alle {settingsData?.review_details?.count} reviews
                  </p>
                </div>
              )}
            </>
            :
            <div className="flex col gap-y-8 left col gap-x-8 xl-flex  xl-gap-x-20 pb-5 ">
              {/* Actions */}
              <p className="fs-15">Er zijn nog geen reviews. Schrijf de eerste! Laat uw review achter en help anderen.</p>
              <div className="actions flex col gap-y-4">
                <Button className="py-2 px-4 r-9 fw-700" onClick={() => setOpenReview(true)}>Schrijf een review</Button>
              </div>
            </div>
      }
    </div>
  );

  return (
    <React.Fragment>
      <div className="pdp__addtional__data pt-16 lg-pt-24">
        <div className="pdp__addtional__wrapper">
          {/* Desktop */}
          <div className="product__addtional hide lg-block">
            <div className="details__heading flex row gap-x-6 xl-flex xl-gap-x-8 pb-6">
              {/* Productdetails */}
              <Button className=" line-7 fw-700" onClick={() => detailsHandle()}>Productdetails</Button>
              {/* Kenmerken */}
              {!loading && settingsData?.characteristics?.length || loading ? <Button className=" line-7 fw-700" onClick={() => charHandle()}>Kenmerken</Button> : <></>}
              {/* Voorraad */}
              {!loading && settingsData?.stock_details?.label?.length || loading ? <Button className="  line-7 fw-700" onClick={() => stockHandle()}>Voorraad</Button> : <></>}
              {/* Voorraad */}
              {!loading && settingsData?.aanleverspecificaties ? (
  <Button className="line-7 fw-700" onClick={() => deliveryHandle()}>
    Aanleverspecificaties
  </Button>
) : loading ? (
  <Button className="line-7 fw-700" onClick={() => deliveryHandle()}>
    Aanleverspecificaties
  </Button>
) : null}

              {!loading && settingsData?.frequently_asked_questions !== null || loading ? <Button className=" line-7 fw-700" onClick={() => FaqHandle()}>Veelgestelde vragen </Button> : <></>}

              {/* Reviews */}
              <Button className="  line-7 fw-700" onClick={() => reviewHandle()}>Reviews <span className="pl-1">({noReviews})</span></Button>
            </div>
            
            <div ref={detailsReg}>
              {detailsBlock}
            </div>
            {
              loading ?
                <div ref={charRef}>
                  {characteristicsBlock}
                </div>
                :
                settingsData?.characteristics?.length ?
                  <div ref={charRef}>
                    {characteristicsBlock}
                  </div>
                  : <></>
            }
            {
              loading ?
                <div ref={stockRef}>
                  {stockBlock}
                </div>
                :
                settingsData?.stock_details?.label?.length ?
                  <div ref={stockRef}>
                    {stockBlock}
                  </div>
                  : <></>
            }
            {  settingsData?.aanleverspecificaties !== null ?
              <div ref={deliveryRef}>
              {DeliveryBlock}
            </div>
            :<></>
            }
           
          {settingsData?.frequently_asked_questions !== null?
            <div ref={faqRef}>
            {FaqBlock}
          </div>
          :
          <></>
          }
          
              <div ref={reviewRef}>
                 {reviewBlock}
               </div>
          </div>
          {/* Mobile */}
          <div className="product__addtional px-2 py-5 block lg-hide">
      {/* Productdetails */}
      
<VisibleWarp>
  <Accordion
    className="mobile__pdp_accordion__Productdetails"
    expanded={accordionView === "Productdetails"}
    onChange={() => changeHandlerRef( accordionView === "Productdetails" ? "" :  "Productdetails", productDetailsRef, accordionView)}
  >
    <AccordionSummary
      aria-controls="panel1a-content"
      id="pdp__additional__Productdetails"
      ref={productDetailsRef}
    >
      <input id="aProductdetails" aria-label="accordion" />
      <h2 className="fs-24 line-9 fw-700 details__block">Productdetails</h2>
      <div className="relative toggle_icon">
        {accordionView === "Productdetails" ? <Toggleup /> : <Toggledown />}
      </div>
    </AccordionSummary>
    <AccordionDetails>{detailsBlock}</AccordionDetails>
  </Accordion>
</VisibleWarp>

<VisibleWarp>
  {settingsData?.characteristics?.length ? (
    <Accordion
      className="mobile__pdp_accordion__Kenmerken"
      expanded={accordionView === "Kenmerken"}
      onChange={() => changeHandlerRef( accordionView === "Kenmerken" ? "" : "Kenmerken", kenmerkenRefs, accordionView)}
    >
      <AccordionSummary
        aria-controls="panel1a-content"
        id="pdp__additional__Kenmerken"
        ref={kenmerkenRefs}
      >
        <input id="aKenmerken" aria-label="accordion" />
        <h2 className="w-1/1 fs-24 line-9 fw-700 characteristics__block">Kenmerken</h2>
        <div className="relative toggle_icon">
          {accordionView === "Kenmerken" ? <Toggleup /> : <Toggledown />}
        </div>
      </AccordionSummary>
      <AccordionDetails>{characteristicsBlock}</AccordionDetails>
    </Accordion>
  ) : (
    <></>
  )}
</VisibleWarp>
      {/* Voorraad */}
      <VisibleWarp>
        {settingsData?.stock_details?.label?.length ? (
          <Accordion
            className="mobile__pdp_accordion__voorraad"
            expanded={accordionView === "Voorraad"}
            onChange={() => changeHandlerRef( accordionView == "Voorraad" ? "" : "Voorraad", voorraadRef, accordionView)}
          >
            <AccordionSummary
              aria-controls="panel1a-content"
              id="pdp__additional__Voorraad"
              ref={voorraadRef}
            >
              <input id="aVoorraad" aria-label="accordion" />
              <h2 className="w-1/1 fs-24 line-9 fw-700 stock__block">Voorraad</h2>
              <div className="relative toggle_icon">
                {accordionView === "Voorraad" ? <Toggleup /> : <Toggledown />}
              </div>
            </AccordionSummary>
            <AccordionDetails>{stockBlock}</AccordionDetails>
          </Accordion>
        ) : (
          <></>
        )}
      </VisibleWarp>
      {/* Aanleverspecificaties */}
      <VisibleWarp>
      {settingsData?.aanleverspecificaties ? (
    <Accordion
      className="mobile__pdp_accordion__delivery"
      expanded={accordionView === "delivery"}
      onChange={() => changeHandlerRef(accordionView === "delivery" ? "" : "delivery", deliveryRefs, accordionView)}
    >
      <AccordionSummary
        aria-controls="panel1a-content"
        id="pdp__additional__delivery"
        ref={deliveryRefs}
      >
        <input id="adelivery" aria-label="accordion" />
        <h2 className="w-1/1 fs-24 line-9 fw-700 stock__block">Aanleverspecificaties</h2>
        <div className="relative toggle_icon">
          {accordionView === "delivery" ? <Toggleup /> : <Toggledown />}
        </div>
      </AccordionSummary>
      <AccordionDetails>{DeliveryBlock}</AccordionDetails>
    </Accordion>
  ) : (
    <div style={{ display: 'none' }}></div>
  )}

</VisibleWarp>

      {/* Frequently Asked Questions */}
      <VisibleWarp>
        {settingsData?.frequently_asked_questions !== null ? (
          <Accordion
            className="mobile__pdp_accordion__faq"
            expanded={accordionView === "faq"}
            onChange={() => changeHandlerRef( accordionView == "faq" ? "" : "faq", faqRefs,accordionView)}
          >
            <AccordionSummary
              aria-controls="panel1a-content"
              id="pdp__additional__faq"
              ref={faqRefs}
            >
              <input id="afaq" aria-label="accordion"/>
              <h2 className="w-1/1 fs-24 line-9 fw-700 stock__block">Veelgestelde vragen</h2>
              <div className="relative toggle_icon">
                {accordionView === "faq" ? <Toggleup /> : <Toggledown />}
              </div>
            </AccordionSummary>
            <AccordionDetails>{FaqBlock}</AccordionDetails>
          </Accordion>
        ) : (
          <></>
        )}
      </VisibleWarp>
      {/* Reviews */}
      <VisibleWarp>
        <Accordion
          className="mobile__pdp_accordion__Reviews"
          expanded={accordionView === "Reviews"}
          onChange={() => changeHandlerRef( accordionView == "Reviews" ? "" : "Reviews", reviewsRef,accordionView)}
        >
          <AccordionSummary
            aria-controls="panel1a-content"
            id="pdp__additional__Reviews"
            ref={reviewsRef}
          >
            <input id="aReviews" aria-label="accordion"/>
            <h2 className="w-1/1 fs-24 line-9 fw-700 reviews__block">Reviews</h2>
            <div className="relative toggle_icon">
              {accordionView === "Reviews" ? <Toggleup /> : <Toggledown />}
            </div>
          </AccordionSummary>
          <AccordionDetails>{reviewBlock}</AccordionDetails>
        </Accordion>
      </VisibleWarp>
    </div>
          <VisibleWarp>
          <div className="sub__mundo__rating">
            <MundoRating loading={loading} getReviews={reviews} getMondu={mondu} plp2={true} />
          </div>
          </VisibleWarp>
          {/* <div className="sub__information">
          <Infoblock getInfo={getInfo} plp2={true} />
        </div> */}
        </div>
      </div>
      {/* review form */}
    </React.Fragment>
  );
};

export default AdditionalData;
