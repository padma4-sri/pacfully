import DomainContext from 'Context/DomainContext';
import React, { memo, useContext } from 'react';
import { Helmet } from 'react-helmet-async';

const Seo = ({
    metaTitle = "",
    metaDescription = "",
    metaKeywords = "",
    ogImage = "",
    ogImageWidth = "265", ogImageHeight = "265",
    ogWebSite = "Website",
    productPrice = "",
    currency = "€",
    isValid = false,
    robots = "INDEX,FOLLOW", 
    }) => {
    const { storeId } = useContext(DomainContext);
    const locExpTit = process.env.REACT_APP_EXPOFIT_TITLE;
    const locExpDes = process.env.REACT_APP_EXPOFIT_DESCRIPTION;
    const locProTit = process.env.REACT_APP_PROMOFIT_TITLE;
    const locProDes = process.env.REACT_APP_PROMOFIT_DESCRIPTION;
    const url = window.location.origin;
    const pathname = window.location.pathname;
    const dec = document.getElementById('meta-description');
    const title = document.getElementById('meta-title');
    const hostName = window?.location?.host;
    const decode = (t) => atob(t);

    if (metaDescription) {
        dec.setAttribute("content", metaDescription);
    } else {
        storeId === 1 ? dec.setAttribute("content", locProDes) : dec.setAttribute("content", locExpDes);
    }

    if (metaTitle) {
        title.innerHTML = metaTitle;
    } else {
        storeId === 1 ? title.innerHTML = locProTit : title.innerHTML = locExpTit;
    }
    return (
        <Helmet>
            {/* SEO tags */}
            <meta name="title" content={metaTitle} data-react-helmet="true" />
            <meta name="keywords" content={metaKeywords} data-react-helmet="true" />
            {isValid && <meta name="renderly-status-code" content="404"></meta>}
            {/* Open Graph tags */}
            <meta name="robots" content={hostName.includes(decode('cHJvbW9maXQubmw='||'ZXhwb2ZpdC5ubA=='))?robots:"NOINDEX,NOFOLLOW"} data-react-helmet="true" />
            <meta property="og:url" content={url+pathname} data-react-helmet="true" />
            <meta property="og:type" content={ogWebSite} data-react-helmet="true" />
            <meta property="og:title" content={metaTitle} data-react-helmet="true" />
            <meta property="og:description" content={metaDescription} data-react-helmet="true" />
            <meta property="og:image" content={ogImage} data-react-helmet="true" />
            <meta property="og:image:width" content={ogImageWidth} data-react-helmet="true" />
            <meta property="og:image:height" content={ogImageHeight} data-react-helmet="true" />
            <meta property="og:site_name" content={storeId === 1 ? "Promofit.nl" : "Expofit.nl"} data-react-helmet="true" />
            <meta property="og:locale" content="nl_GB" data-react-helmet="true" />
            <link rel="canonical" href={url+pathname} data-react-helmet="true" />

            {/* Product details */}
            <meta property="product:price:currency" content={currency} data-react-helmet="true" />
            <meta property="product:price:amount" content={productPrice} data-react-helmet="true" />
        </Helmet>
    )
}

export default memo(Seo);