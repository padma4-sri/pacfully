import React, { useContext,useState,useEffect,useRef } from "react";
import "./styles.scss";
import { useSelector, useDispatch } from "react-redux";
import Img from "Components/Img";
import { styled } from "@mui/material/styles";
import Button from "Components/Common/Button";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Monduimage from "Res/images/home/mondu.svg";
import CartItems from "../CartItems";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import ApplyCouponSection from "../Coupon";
import PriceDetailSection from "../PriceDetails";
import UpsContent from "../UpsContent";
import { useNavigate } from "react-router-dom";
import ProductSlider from "Components/ProductSlider";
import { SkeletonLine } from "Components/Skeletion";
import Seo from "Components/Seo/Seo";
import DomainContext from "Context/DomainContext";

function Cart() {
  const { storeId } = useContext(DomainContext);
  const recentProducts = useSelector(state => state?.recentProducts);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 632);
  const [carttooltipinfo,setcarttooltipinfo]=useState(false);
  const tooltipRef = useRef();

  
  const handlecarttooltipinfo = () => {
    setcarttooltipinfo(!carttooltipinfo);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setcarttooltipinfo(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [carttooltipinfo]);

  const { cartDetails } = useSelector((state) => {
    return {
      cartDetails: state?.cartItems?.[0],
    };
  });
  const payment = "/res/img/payment.svg";
  const info = "/res/img/info.svg";
  const navigate = useNavigate();

 
 
  const BlackTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} 
    // open={props.open} 
    />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
      color: "#8B4AFE",
    },
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#8B4AFE",
      font: "normal normal 300 14px Poppins",
      padding: 16,
      borderRadius: "10px 5px 10px 10px",
      width: "400px !important",
      height: " 100px !important",
      maxWidth:"400px !important",
    },
  }));
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  
  // 
  const handleResize = () => {
    setIsMobile(window.innerWidth < 632);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <>
      <Seo
        metaTitle={storeId === 1? "Winkelwagen | Promofit.nl": "Winkelwagen Expofit.nl"}
        metaDescription="Winkelwagen"
        metaKeywords="Winkelwagen"
      />
      <div className="cartpage ">
        <div className="container responsive-cart px-4 py-8 xl-py-14">
          <h1 className="fw-700 fs-32">{cartDetails?.totals_detail?.isSample == 1 ? "Sample bestellen" :"Winkelwagen"}</h1>
          <div className="cartpage__container xl-flex xl-gap-x-24">
            <div className="cart__details xl-flex-1 xl-pt-4 pb-12">
              <CartItems />
            </div>
            <div className="sidebar__cartpage xl-flex-0">
            <div className="sticky-kort">
              {cartDetails?.totals_detail?.message ? (
                <></>
              ) : (
                <>
                  {cartDetails?.totals_detail?.isSample == 1 ? "" :
                    <ApplyCouponSection />
                  }
                  <PriceDetailSection />
                  <div className="button__info pt-4 ">
                    {cartDetails?.totals_detail?.items?.length ?
                      <>
                        <Button
                          className="fs-20 line-8 fw-700 r-8  px-5 cart__button"
                          fullWidth
                          onClick={() => {
                            navigate("/checkout", {
                              state: cartDetails?.shipping_details,
                            });
                            scrollToTop()
                          }}
                        >
                          Bestellen
                          <span className="flex middle">
                            <KeyboardArrowRightIcon />
                          </span>
                        </Button>

                        <div className="payment__img mx-auto py-3 relative">
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
                        {/* commented for purpose */}
                        {/* {cartDetails?.mondu_info ? (
                          <div class="flex center middle gap-2">
                            <p class="fs-14   inline-block fw-600">
                              {cartDetails?.mondu_info[0]?.info_text}
                            </p>
                            <span className="mondu__img">
                              <img
                                type="img"
                                src={Monduimage}
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "100%",
                                  objectFit: "contained",
                                }}
                                alt=""
                              />
                            </span>
                            <BlackTooltip
                              placement="bottom-end"
                              title={cartDetails?.mondu_info[0]?.tooltip_content}
                              open={isMobile ? carttooltipinfo : undefined}  
                              disableHoverListener={isMobile} 
                            >
                              <span className="relative pointer tooltip__img" 
                              onClick={handlecarttooltipinfo} ref={tooltipRef} 
                              >
                                <Img
                                  src={info}
                                  style={{
          
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "contained",
                                  }}
                                />
                              </span>
                            </BlackTooltip>
                          </div>
                        ) : (
                          ""
                        )} */}
                      </>
                      :
                      <>
                        <SkeletonLine width="100%" height="100px" />
                      </>
                    }

                  </div>
                </>
              )}
              <UpsContent />
            </div>
            </div>
          </div>
        </div>
        {cartDetails?.totals_detail?.message && recentProducts?.length ? (
          <div className="cart__product__slider">
            <ProductSlider
              title="Recent bekeken"
              data={recentProducts}
              pageName="cart"
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default Cart;
