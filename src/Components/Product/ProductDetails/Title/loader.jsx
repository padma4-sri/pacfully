import React from 'react';
import { SkeletonLine } from "Components/Skeletion";
import "./styles.scss";

const TitleLoader = () => {
  return (
    <div className="productTitle flex col gap-2">
      <SkeletonLine height="36px" animation="pulse" />
      <SkeletonLine height="20px" animation="pulse" />
      <SkeletonLine height="20px" animation="pulse" />
      <SkeletonLine height="20px" animation="pulse" />
    </div>
  );
};
export default TitleLoader;