import React, { memo } from 'react';
import './styles.scss';
import Team from './Team';
import Brands from './Brands';
import TopCategories from './TopCategories';
import Newsletter from './Newsletter';
import WorkingHours from './WorkingHours';
import MainFooter from './MainFooter';
import BottomFooter from './BottomFooter';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const pathName = location?.pathname?.split('/')?.[1];

  return (
    <div className='footer w-1/1'>
      {
        pathName === "checkout" ?
          <BottomFooter isCheckout={true} />
          :
          <>
            {
              pathName !== "mijn-account" ?
                <>
                  {pathName === "orderconfirmation" || pathName === "quoteconfirmation" ?
                    <></> :
                    <Team />}

                  <Brands />
                  <TopCategories />
                </>
                : <></>
            }
            <Newsletter />
            <WorkingHours />
            <MainFooter />
            <BottomFooter />
          </>
      }
    </div >
  )
}

export default memo(Footer);