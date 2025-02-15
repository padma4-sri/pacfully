import React from 'react';
import "./styles.scss";
import { Rating } from '@mui/material';
import { Star } from '@mui/icons-material';
import { SkeletonLine } from 'Components/Skeletion';
import { useWindowSize } from 'Utilities';

const ProductTitle = ({ loading, minPrice, data, setOpenReview, setOpenAllReviews, setAccrodionView }) => {
  const [width] = useWindowSize();
  const piecePrice = data?.additional_info?.total_price;
  const pieceQty = data?.additional_info?.qty ? data.additional_info.qty : "";
  const headerHeight = 82;
  const reviewElem = document.querySelector('.reviews__block');
  const reviewElemMobile = document.querySelector('.mobile__pdp_accordion__Reviews');
  const reviewHandle = () => {
    if(width >= 768){
      window.scroll({ top: (reviewElem.offsetTop - headerHeight), left: 0, behavior: 'smooth' });
    }else{
      window.scroll({ top: (reviewElemMobile.offsetTop - headerHeight), left: 0, behavior: 'smooth' });
      setAccrodionView("Reviews");
    }
  };
  return loading && !data?.product_name ? (
    <div className='productTitle flex col gap-1'>
      <SkeletonLine height='36px' style={{width: "100%"}} />
      <SkeletonLine height='24px' style={{width: "60%"}} />
      <SkeletonLine height='24px' style={{width: "50%"}} />
      <SkeletonLine height='24px' style={{width: "40%"}} />
    </div>
  ) : (
    <div className='productTitle flex col gap-1'>
      <h1>{data?.product_name}</h1>
      {piecePrice ? (<p>Total price at {pieceQty} {pieceQty?"pieces":""}   {data?.stock_status && piecePrice}</p>) : <></>}
      <div className="flex row left gap-2 md-flex md-row md-middle wrap info">
  <span className='flex row gap-2 middle'>
    <i className={`stockStatus ${data?.temporary_out_of_stock == "0" ? 'in-stock' : 'out-of-stock'}`} />
    <span className='flex nowrap gap-2'>
      <span>{data?.temporary_out_of_stock == "0" ? "In stock" : "Out of stock"}</span>
      <span className='block'>|</span>
    </span>
  </span>
  {data?.product_sku ? (
    <span className='flex gap-2 middle'>
      <span className='md-hide sku__pdp'>Article: {data?.product_sku}</span>
      <span className='hide md-block sku__pdp'>Item number: {data?.product_sku}</span>
    </span>
  ) : null}
</div>

      {data?.review_count ? (
        <div className="flex gap-2 middle info">
          <Rating
            name="product-rating"
            value={Number(data?.review_details?.averageRating ?? 0)}
            precision={0.1}
            readOnly
            emptyIcon={<Star fontSize="inherit" />}
          />
          <button className='fw-300' onClick={() => reviewHandle()} aria-label="button">{data?.review_count} review(s)</button>
        </div>
      ) : (
        <div className="flex gap-2 middle info">
          <button className='fw-300' onClick={() => setOpenReview(true)} aria-label="button">Schrijf als eerste een review</button>
        </div>
      )}
    </div>
  )
}

export default ProductTitle