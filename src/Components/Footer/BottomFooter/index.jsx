import React, { memo } from 'react';
import './styles.scss';
import { Link } from 'react-router-dom';
import Img from 'Components/Img';
import { SkeletonLine, SkeletonLoader } from 'Components/Skeletion';
import { useSelector } from 'react-redux';

const BottomFooter = ({ isCheckout = false }) => {
  const homePageLoading = useSelector(state => state?.homePageLoading);
  const HeaderFooterDataLoading = useSelector(state => state?.HeaderFooterDataLoading);
  const getFooterData = useSelector(state => state?.getHeaderFooterData?.data?.footer?.[0]?.footerBottomData);
  const getHeaderData = useSelector((state) => state?.getHeaderFooterData?.data?.header);
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noreferrer");
  };
  const brandsBlock = (
    homePageLoading && HeaderFooterDataLoading ? (
      <ul className='right-content flex gap-2 middle'>
        <SkeletonLoader pclassName='flex middle gap-1' length={4} width='50px' height='30px' full={true} />
      </ul>
    ) : (
      <ul className='right-content flex gap-2 middle'>
        <li className='flex middle relative'>
          <Img src={getFooterData?.kiyohImage} alt="kiyoh" onClick={() => openInNewTab(getHeaderData?.kiyoh?.kiyohUrl)} className='pointer' />
        </li>
        <li className='flex middle relative'>
          <Img src={getFooterData?.thuiswinkel} alt="thuiswinkel" onClick={() => openInNewTab(getHeaderData?.thuiswinkel?.thuiswinkelUrl)} className='pointer' />
        </li>
        <li className='flex middle relative psi__image'>
          <Img src={getFooterData?.psi_image} alt="psi" className='image-container'/>
        </li>
        <li className='flex middle relative ppp__image'>
          <Img src={getFooterData?.ppp_image} alt="promotional products professionals" className='image-container'/>
        </li>
      </ul>
    )
  )
  const linksBlock = (
    homePageLoading && HeaderFooterDataLoading ?
      <div className='flex gap-x-8 gap-y-3 center middle wrap xxl-flex xxl-row xxl-gap-6 center xxl-left'>
        <SkeletonLoader pclassName='flex col sm-flex sm-row gap-1' length={3} width='100px' height='30px' full={true} />
      </div>
      :
      <ul className='flex gap-x-8 gap-y-3 center middle wrap xxl-flex xxl-row xxl-gap-4 center xxl-left'>
        <li><p>{getFooterData?.copyright}</p></li>
        {(
          getFooterData?.menuList?.map((item, index) => (
            <li key={`footer__copyrights${index}`}>
              <Link to={item?.url} aria-label={item?.title}>{item?.title}</Link>
            </li>
          ))
        )}
      </ul>
  )
  const paymentMethod = (
    homePageLoading && HeaderFooterDataLoading ?
      <div className='payments__logos pt-0 pb-3 xxl-pb-0 relative'>
        <SkeletonLine animation="pulse" className="tc" width='200px' height='30px' style={{ borderRadius: "0px" }} />
      </div>
      :
      <div className='payments__logos pt-2 relative'>
        <Img src={getFooterData?.payment_image} alt='payment methods' />
      </div>
  )

  return (
    <div className={`bottomfooter w-1/1 `}>
      <div className='container px-4 py-6'>
        <div className='w-1/1 flex col gap-x-4 gap-y-4 xxl-flex xxl-row xxl-gap-3 middle space-between'>
          {linksBlock}
          <div className={`right-content flex col gap-x-4 gap-y-1 xxl-flex xxl-row xxl-gap-4  middle ${isCheckout ? 'checkoutImages' : ''}`}>
            {paymentMethod}
            {brandsBlock}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(BottomFooter);