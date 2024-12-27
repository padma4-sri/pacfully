import React, { memo } from "react";
import "./styles.scss";
import { CloseIconX } from "Res/icons";

const CloseButton = ({onClickFunction}) => {
  return (
     <button className="close__icon" onClick={onClickFunction} sx={{padding:0}} aria-label="button">
     <CloseIconX />
   </button>
  );
};

export default memo(CloseButton);
