import React, { useContext, useEffect, useState } from 'react';
import "./Styles.scss";
import RenderContext from 'Context/RenderContext';

const ModelNew = ({from="left", zindex=11, shadow=true, hideScroll=false, open, openGlobal, setGlobalAction=()=>{}, setOpen=()=>{}, children, className="" }) => {
    const [modelAction,setModelAction] = useState("");
    const [modelChildren,setModelChildren] = useState(null);
    const [initRender,setInitRender] = useState(false);
    const { loadPreRender } =useContext(RenderContext);
    const random = Math.round(Math.random()*1000);
    useEffect(() => {
        const htmlTag  = document.getElementsByTagName("html").item(0);
        if(initRender){
            if(open || openGlobal) setModelAction("opening");
            else setModelAction("closing");
            if(hideScroll)
                if(open || openGlobal) htmlTag.classList.add(`ModelPopup-${random}`);
                else htmlTag.classList.remove(`ModelPopup-${random}`);
            setTimeout(()=>{
                if(open || openGlobal) setModelAction("open");
                else setModelAction("");
            },500)
        }
        return () => htmlTag.classList.remove(`ModelPopup-${random}`);
    }, [open, openGlobal]);
    useEffect(() => {
        if(initRender){
            if(children && (open || openGlobal)) setModelChildren(children)
            else if(!(open || openGlobal) && modelChildren !== null)setTimeout(() => {setModelChildren(null)}, 500)
        }
    }, [children, open, openGlobal]);
    useEffect(() => {
        if(!initRender) setInitRender(true)
    }, [initRender]);
    return (
      <>
      {!loadPreRender &&
      <div
        className={`modelBox fixed zindex-${zindex} top-0 left-0 w-1/1 h-1/1 overflow-hidden ${
          modelAction === "" ? "hide" : ""
        } ${from} ${
          shadow ? "shadow" : ""
        } ${modelAction} ${open} ${openGlobal} ${className}`}
      >
        <div className="body absolute h-1/1 zindex-1">
          {modelAction !== "" ? modelChildren : <></>}
        </div>
        {modelAction !== "" ? (
          <button
            className="backdrop absolute zindex-0 h-1/1 w-1/1"
            onClick={() => {
              if (modelAction === "open") {
                setOpen(false);
                setGlobalAction();
              }
            }}
            aria-label="button"
          ></button>
        ) : (
          <></>
        )}
      </div>}
      </>
    );
}

export default ModelNew;