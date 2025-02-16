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
        
        
                    {cartDetails?.totals_detail?.productCost && Object.values(cartDetails?.totals_detail?.productCost).map(item => (
                <tr>
                      <td>{item?.label}</td>
                      <td>{item?.productCost}</td>
                  </tr>
            ))}
            
          <tr className="fw-700 ">
            <td className="fs-20">
              Total (excl. Vat)
            </td>
            <td className="fs-26">
              {cartDetails?.tax_details?.subtotal_original}
            </td>
          </tr>
          <tr>
            <td>VAT </td>
            <td>{cartDetails?.tax_details?.tax_amount}</td>
          </tr>
          <tr>
            <td>Total amount</td>
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
