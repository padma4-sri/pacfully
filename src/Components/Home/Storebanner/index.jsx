import React, { useContext } from "react";
import "./styles.scss";
import Img from "Components/Img";
import { SkeletonLine } from 'Components/Skeletion';
import { useNavigate } from "react-router-dom";
import DomainContext from "Context/DomainContext";

const StoreBanner = ({ loading = false, getStoreBanner }) => {
  const { storeId } = useContext(DomainContext);
  const navigate = useNavigate();

  return (
    <div className="storebanner">
      <div className="container px-4 xxl-px-4 py-9 xl-py-12">
        {
          loading ? (
            <div className="wrapper w-1/1 col gap-y-5 md-flex md-gap-y-10 flex center xl-flex xl-row-i">
              <SkeletonLine height='500px' />
            </div>
          ) : (
            <div className="wrapper w-1/1 col gap-y-5 md-flex md-gap-y-10 flex center xl-flex xl-row-i">
              <div className="tc image__block relative">
                <Img src={getStoreBanner?.promotionImage} alt= "image"/>
              </div>
              <div className="info__block flex col middle xl-flex center store_content">
                <h3 className=" w-1/1 tc pt-2 pb-7 line-14 fw-700" dangerouslySetInnerHTML={{ __html: getStoreBanner?.promotionContent }}></h3>
                <div>
                  <button
                    className="primary__btn fw-700"
                    onClick={() => navigate("/over-ons")}
                    aria-label="button"
                  >Shop now</button>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default StoreBanner;
