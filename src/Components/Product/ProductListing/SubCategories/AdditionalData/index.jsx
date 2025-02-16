import React, { useContext, useEffect, useState } from 'react';
import MundoRating from "Components/Home/MundoRating";
import ProductSlider from "Components/ProductSlider";
import Infoblock from "../../PlpCommon/InfoBlock/index";
import { useSelector } from 'react-redux';
import EmptyImage from '../../../../../Res/images/noImage.webp';
import VisibleWarp from 'Context/VisibleWrapper';
import RenderContext from 'Context/RenderContext';

const AdditionalData = ({ loading = true, plpData = {} }) => {
  const { loadPreRender } = useContext(RenderContext);
  const recentProducts = useSelector(state => state?.recentProducts);
  const parent = document.querySelector('.plp__addtional__data');
  const table = parent?.querySelector('table');
  const images = table?.querySelectorAll('img');
  const [isUpdated, setIsUpdated] = useState(false);
  useEffect(() => {
    (
      () => {
        setTimeout(() => {
          const parent = document.querySelector('.plp__addtional__data');
          const table = parent?.querySelector('table');
          const images = table?.querySelectorAll('img');
          if (table && images && !isUpdated) {
            setIsUpdated(true);
            images.forEach(image => {
              const src = image.src;
              if (src) {
                const arr = src.split('.');
                const length = arr?.length - 1;
                const extention = arr?.[length]?.toLowerCase();
                const isImage = ['jpg', 'png', 'webp', 'jpeg'].includes(extention);
                if (extention === undefined || !isImage) {
                  image.src = EmptyImage;
                }
              }
            });
          }
        }, 1000);
      }
    )();

  }, [table, images, plpData?.staticContents]);
  return (
    <div className="plp__addtional__data">
      <div className="plp__addtional__wrapper">
      
        <VisibleWarp>
        {
          !loading && recentProducts?.length ?
            <div className="plpsub__recent__products">
              <ProductSlider
                title='Recently viewed'
                data={!loadPreRender ? recentProducts : recentProducts?.slice(0, 4)}
                showToGo={false}
                loading={loading}
                pageName="plp2"
              />
            </div>
            : <></>
        }
        </VisibleWarp>
       

      </div>
    </div>
  )
}

export default AdditionalData;