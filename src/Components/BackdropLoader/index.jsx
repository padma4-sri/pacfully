import React from "react";
import "./styles.scss";

import { Backdrop } from "@mui/material";
const Loader = () => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: 1310 }}
      className="loading-spinner"
      open={true}
    ></Backdrop>
  );
};

export default Loader;
