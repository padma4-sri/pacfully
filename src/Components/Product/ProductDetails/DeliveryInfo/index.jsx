import React from "react";
import CloseButton from "../../../CloseButton/index";
import ModelNew from "Components/Model/ModelNew";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import "./styles.scss";

const DeliveryInfo = ({ openModel, setOpenModel,data,deliveryData,isSample }) => {
  const dataBlock = (
    <div className="upload__info w-1/1 h-1/1 p-5 xl-p-7 overflow-hidden overflow-y-auto">
      <div className="flex right">
        <CloseButton onClickFunction={() => setOpenModel(false)} />
      </div>
      
      {/* <div 
      dangerouslySetInnerHTML={{ __html: data?.fil_upload_content }} className="sidebar__contents mb-5 md-mb-8">
      </div> */}
        {deliveryData && deliveryData ? (
            <div className='deliveryTime delivery-custom-message'>
              <div className="content" style={{padding:"0"}}>
                <div className="flex w-1/1 gap-3">
                  <div className="flex-0">
                    {/* <div className="icon">
                      <AccessTimeIcon />
                    </div> */}
                  </div>
                  {/* commented for purpose */}
                  {/* {isSample ? (
                    <div className="flex-1 flex col gap-2">
                      <h3> Levertijd: ongeveer 1-3 werkdag(en)</h3>
                    </div>
                  ) : (
                    <div className="flex-1 flex col gap-2">
                      <h3>Levertijd: ongeveer {deliveryData?.working_days == 0 ? "zelfde" : deliveryData?.working_days} werkdag(en)</h3>
                      <p dangerouslySetInnerHTML={{ __html: deliveryData?.text }}></p>
                    </div>
                  )} */}
                      <div dangerouslySetInnerHTML={{ __html: deliveryData?.delivery_days_custom_message }}></div>
                  
                </div>
              </div>
            </div>
          ) : null}
    </div>
  );
  return (
    <ModelNew
      from="right"
      hideScroll={false}
      zindex={11}
      open={openModel}
      shadow={true}
      setOpen={setOpenModel}
      className="mondu__payment__sidebar"
  >
      {dataBlock}
    </ModelNew>
  );
};

export default DeliveryInfo;
