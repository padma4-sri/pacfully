import React, { memo } from 'react';
import Quote from "Components/CartQuote/Quote";

function QuotePage() {
  return (
    <div className=''>
      <Quote/>
    </div>
  )
}

export default memo(QuotePage);