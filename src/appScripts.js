import React, { useContext, useEffect } from 'react';
import "./App.scss";
import ToastMessage from "Components/ToastMessage/ToastMessage";
import RenderContext from 'Context/RenderContext';


const AppScripts = () => {
  const { loadPreRender } = useContext(RenderContext)



  return (
    <React.Fragment>
      {
        !loadPreRender &&
        <>
          <ToastMessage />
        </>

      }

    </React.Fragment>
  );
};

export default AppScripts;