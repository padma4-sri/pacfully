import React ,{useContext} from "react";
import "./styles.scss";
import { useSelector } from "react-redux";
import { ValidSuccesArrow } from "Res/icons";
import DomainContext from "Context/DomainContext";
import { SkeletonLine } from "Components/Skeletion";
function UpsContent() {
    const {
        cartDetails,
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
    ;
    const {  storeId } = useContext(DomainContext);
  return (
    <div  className={`static__content ${cartDetails?.totals_detail?.items?.length||!cartDetails?.ups_feature_content?.length?"pt-8":""}`}>
     <>
      <h3 className="fw-700 fs-18">Daarom!</h3>
     <div className="ups__content flex col gap-3 pt-4">
     {cartDetails?.ups_feature_content?cartDetails?.ups_feature_content[0]?.map(
       (item, index) => (
         <div className="flex middle space-between " key={index}>
           <div className="flex middle gap-3 lg-gap-2">
             <ValidSuccesArrow />
             <span className="fs-15 line-6">
               {item?.menu?.title}
             </span>
           </div>
         </div>
       )
     ):
     ["", "", "", ""]?.map((item, index) => (
      <div className="mb-2">
        <SkeletonLine width="100%" height="30px" />
      </div>
    ))}
   </div>
    </>
   
  </div>
  )
}

export default UpsContent