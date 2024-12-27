import React from "react";
import "./styles.scss";
import { useSelector } from "react-redux";
import { SkeletonLine } from "Components/Skeletion";

function PriceDetailSection() {
  const { cartDetails } = useSelector((state) => {
    return {
      cartDetails: state?.cartItems?.[0],
    };
  });

  return (
    <div className="priceDetails pt-6 pb-4  ">
      {cartDetails?.totals_detail?.items?.length ?
        <table className="w-1/1">
          <tr>
            <td>Digitale drukproef</td>
            <td>
              <b className="normal green">Gratis</b>
            </td>
          </tr>
          <tr>
            <td>Instelkosten</td>
            <td>{cartDetails?.totals_detail?.setupCost== 
                "0,00"
              ? <b className="normal green">Gratis</b>
                : cartDetails?.totals_detail?.setupCost}</td>
          </tr>
         
          <tr>
            <td>
              {cartDetails?.totals_detail?.postageCosts == null
                ? ""
                : "Verzendkosten"}
            </td>
            <td>
              {cartDetails?.totals_detail?.postageCosts == null
                ? "":cartDetails?.totals_detail?.postageCosts == 
                "0,00"
              ? <b className="normal green">Gratis</b>
                : cartDetails?.totals_detail?.postageCosts}
            </td>
          </tr>
                    {cartDetails?.totals_detail?.productCost && Object.values(cartDetails?.totals_detail?.productCost).map(item => (
                <tr>
                      <td>{item?.label}</td>
                      <td>{item?.productCost}</td>
                  </tr>
            ))}
             {cartDetails?.totals_detail?.couponCode ?
            <tr>
              <td>Kortingscode ({cartDetails?.totals_detail?.couponCode})</td>
              <td>
                -{cartDetails?.totals_detail?.discount_amount}
              </td>
            </tr>
            : ""}
          <tr className="fw-700 ">
            <td className="fs-20">
              Totaal (excl. BTW)
            </td>
            <td className="fs-26">
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
        :

        <table className="w-1/1 ">
          {["", "", "", ""]?.map((item) => (
            <tr >

              <td className="pb-2">
                <SkeletonLine width="100%" height="30px" />

              </td>
            </tr>
          ))}


        </table>
      }
    </div>
  );
}

export default PriceDetailSection;
