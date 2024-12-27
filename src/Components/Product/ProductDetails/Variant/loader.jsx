import React from 'react';
import { SkeletonLine } from "Components/Skeletion";
import "./styles.scss";

const VariantLoader = () => {
  return (
    <React.Fragment>
      <div className="productTitle flex col gap-1">
        <SkeletonLine height="36px" animation="pulse" />
        <SkeletonLine height="24px" animation="pulse" />
        <SkeletonLine height="24px" animation="pulse" />
        <SkeletonLine height="24px" animation="pulse" />
      </div>
      <div className="productVariant">
        <div className="variantHeader my-3">
          <div className="flex gap-2">
            <SkeletonLine width="32px" height="32px" animation="pulse" />
            <SkeletonLine width="100%" height="32px" animation="pulse" />
          </div>
        </div>
        <div className="variantHeader my-3">
          <div className="flex gap-2">
            <SkeletonLine width="32px" height="32px" animation="pulse" />
            <SkeletonLine width="100%" height="32px" animation="pulse" />
          </div>
        </div>
        <div className="variantHeader my-3">
          <div className="flex gap-2">
            <SkeletonLine width="32px" height="32px" animation="pulse" />
            <SkeletonLine width="100%" height="32px" animation="pulse" />
          </div>
        </div>
        <div className="variantHeader my-3">
          <div className="flex gap-2">
            <SkeletonLine width="32px" height="32px" animation="pulse" />
            <SkeletonLine width="100%" height="32px" animation="pulse" />
          </div>
        </div>
        <div className="variantHeader my-3">
          <div className="flex gap-2">
            <SkeletonLine width="32px" height="32px" animation="pulse" />
            <SkeletonLine width="100%" height="32px" animation="pulse" />
          </div>
        </div>
        <div className="flex col w-1/1 gap-6 pt-6">
          {/* <div className="deliveryTime">
            <div className="content">
              <SkeletonLine height="32px" animation="pulse" />
            </div>
          </div> */}
          <div className="flex col w-1/1 gap-3">
            <SkeletonLine height="20px" animation="pulse" /> 
            <div className="flex w-1/1 gap-6">
              <SkeletonLine height="40px" animation="pulse" />
              <SkeletonLine height="40px" animation="pulse" />
            </div>
          </div>
        </div>
        <div className="action__blocks pt-2 flex col gap-y-4">
          <SkeletonLine height="72px" style={{borderRadius:36}} animation="pulse" />
          <SkeletonLine height="72px" style={{borderRadius:36}} animation="pulse" />
          <SkeletonLine height="24px" style={{borderRadius:36}} animation="pulse" />
          <div className="ups__content flex col gap-3">
            <SkeletonLine height="24px" style={{borderRadius:36}} animation="pulse" />
            <SkeletonLine height="24px" style={{borderRadius:36}} animation="pulse" />
            <SkeletonLine height="24px" style={{borderRadius:36}} animation="pulse" />
            <SkeletonLine height="24px" style={{borderRadius:36}} animation="pulse" />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default VariantLoader;