import React, { useContext } from "react";
import "./styles.scss";
import { useSelector } from "react-redux";
import CartItems from "../CartItems";
import ApplyCouponSection from "../Coupon";
import PriceDetailSection from "../PriceDetails";
import UpsContent from "../UpsContent";
import QuoteForm from "../QuoteForm";
import ProductSlider from "Components/ProductSlider";
import Seo from "Components/Seo/Seo";
import DomainContext from "Context/DomainContext";
import useScrollToTop from "Components/Hooks/useScrollToTop";

function Quote() {
  useScrollToTop();

  const { storeId } = useContext(DomainContext);
  const recentProducts = useSelector(state => state?.recentProducts);
  const { cartDetails } = useSelector((state) => {
    return {
      cartDetails: state?.cartItems?.[0],
    };
  });


  return (
    <>
      <Seo
        metaTitle={storeId === 1 ? "Vrijblijvende offerte aanvraag | Promofit.nl" : "Vrijblijvende offerte aanvraag | Expofit.nl"}
        metaDescription="Citaat"
        metaKeywords="Citaat"
        //commended for purpose
        // metaDescription="Vrijblijvende offerte aanvraag"
        // metaKeywords="Vrijblijvende offerte aanvraag"
      />
      <div className="cartpage">
        <div className="container px-4 py-8 xl-py-14">

        <h1 className="fw-700 fs-32">Vrijblijvende offerte aanvraag</h1>
        <div className="cartpage__container responsive-cart xl-flex xl-gap-x-24">
          <div className="cart__details xl-flex-1 xl-pt-4 py-4">
            <CartItems />
            {cartDetails?.totals_detail?.items?.length ? (
              <div className="flex right coupon__quotepage pt-4">
                <div className="coupon__section__parent">
                  {cartDetails?.totals_detail?.isSample == 1 ? "" :
                    <ApplyCouponSection />

                  }
                  <PriceDetailSection />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="sidebar__cartpage xl-flex-0 sidebar__quotepage">
          <div className="sticky-kort">

            {
              cartDetails?.totals_detail?.message?"":
              <QuoteForm />

            }
            <UpsContent />
            </div>
          </div>
        </div>
        </div>

        {cartDetails?.totals_detail?.message && recentProducts?.length ?
          <div className="cart__product__slider ">
            <ProductSlider
              title='Recent bekeken'
              data={recentProducts}
              pageName="quote"
            />
          </div> : ""
        }

      </div>
    </>
  );
}

export default Quote;
