import React, { useContext, useEffect } from 'react';
import "./App.scss";
import { useSelector } from "react-redux";
import DomainContext, { liveExpoUrl, liveUrl, ProductionExpoUrl, ProductionUrl } from "Context/DomainContext";
import ToastMessage from "Components/ToastMessage/ToastMessage";
import TagManager from 'react-gtm-module';
import RenderContext from 'Context/RenderContext';

const CookiesSetter = React.lazy(() => import("Components/Cookies"));
const TawkMessengerScript = React.lazy(() => import("Components/Tawk/Messenger"));
const WhatsappMessenger = React.lazy(() => import("Components/Tawk/WhatsappMessenger"));

const AppScripts = () => {
  const cookieValue = useSelector((state) => state?.cookieValue);
  const { storeId } = useContext(DomainContext);
  const { loadPreRender } = useContext(RenderContext)



  useEffect(() => {
    if (!loadPreRender) {
      if (cookieValue === undefined) {
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        gtag('consent', 'default', {
          'ad_user_data': 'denied',
          'ad_personalization': 'denied',
          'ad_storage': 'denied',
          'analytics_storage': 'denied',
        });
      } else {
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        gtag('consent', 'update', {
          'ad_storage': cookieValue === "granted" ? 'granted' : cookieValue === "marketing" ? "granted" : cookieValue === "analytics" ? "denied" : 'denied',
          'analytics_storage': cookieValue === "granted" ? 'granted' : cookieValue === "analytics" ? "granted" : cookieValue === "marketing" ? "denied" : 'denied',
          'ad_user_data': cookieValue === "granted" ? 'granted' : cookieValue === "marketing" ? "granted" : cookieValue === "analytics" ? "denied" : 'denied',
          'ad_personalization': cookieValue === "granted" ? 'granted' : cookieValue === "marketing" ? "granted" : cookieValue === "analytics" ? "denied" : 'denied',
        });
      }
      let gtmId;
      if (storeId === 1) {
        gtmId = process.env.REACT_APP_GTM_ID__PROMOFIT;
      } else if (storeId === 2) {
        gtmId = process.env.REACT_APP_GTM_ID__EXPOFIT;
      }
      if (gtmId) {
        TagManager.initialize({
          gtmId,
          dataLayerName: 'dataLayer',
        });
      }
      // Initialize Google Analytics
      let googleTag;
      if (storeId == 1) {
        googleTag = process.env.REACT_APP_GOOGLE__ANALYTICS__PROMOFIT;
      }
      else if (storeId == 2) {
        googleTag = process.env.REACT_APP_GOOGLE__ANALYTICS__EXPOFIT;
      }
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', googleTag);
      if (!document.querySelector(`script[src="https://www.googletagmanager.com/gtag/js?id=AW-1063770781"]`)) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GOOGLE_ADS_PROMOFIT}`;
        document.head.appendChild(script);
  
        script.onload = () => {
          window.dataLayer = window.dataLayer || [];
          function gtag() {
            window.dataLayer.push(arguments);
          }
          gtag('js', new Date());
          gtag('config', process.env.REACT_APP_GOOGLE_ADS_PROMOFIT);
        };
      }
    }
  }, [cookieValue, storeId]);

  useEffect(() => {
    if (!loadPreRender) {
      const hotjarId = storeId === 1 ? process.env.REACT_APP_HOTJAR__PROMOFIT : process.env.REACT_APP_HOTJAR__EXPOFIT;
      if (!document.querySelector(`script[src^="https://static.hotjar.com/c/hotjar-${hotjarId}"]`)) {
        (function (h, o, t, j, a, r) {
          h.hj =
            h.hj ||
            function () {
              (h.hj.q = h.hj.q || []).push(arguments);
            };
          h._hjSettings = { hjid: hotjarId, hjsv: 6 };
          a = o.getElementsByTagName('head')[0];
          r = o.createElement('script');
          r.async = 1;
          r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
          a.appendChild(r);
        })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
      }

      return () => {
        const script = document.querySelector(`script[src^="https://static.hotjar.com/c/hotjar-${hotjarId}"]`);
        if (script) {
          script.remove();
        }
      };
    }
  }, [storeId, loadPreRender]);
  useEffect(() => {
    const origin = window.location.origin;
    const isPromofit = origin.includes('https://www.promofit.nl');
    const isExpofit = origin.includes('https://www.expofit.nl');
  
    if ((storeId === 1 && isPromofit) || (storeId === 2 && isExpofit)) {
      const rumId = storeId === 1 ? process.env. REACT_APP_RUMVISION__PROMOFIT : process.env. REACT_APP_RUMVISION__EXPOFIT;
  
      window.rumv = window.rumv || function () {
        (window.rumv.q = window.rumv.q || []).push(arguments);
      };
  
      (function (rum, vi, si) {
        const storedData = JSON.parse(sessionStorage.getItem('rumv') || '{"pageviews":0}');
        storedData.pageviews++;
  
        if (storedData.urls && storedData.regex && 
            (storedData.page = eval(`(${storedData.regex})`)(storedData.urls, vi.location.pathname)) && 
            !storedData.page.type) {
          return sessionStorage.setItem('rumv', JSON.stringify(storedData));
        }
  
        vi.rumv = vi.rumv || {};
        vi.rumv.storage = storedData;
  
        const head = si.querySelector('head');
        const js = si.createElement('script');
        js.src = `https://d5yoctgpv4cpx.cloudfront.net/${rum}/v4-${vi.location.hostname}.js`;
        head.appendChild(js);
      })(rumId, window, document);
    }
  }, [storeId]);
  return (
    <React.Fragment>
      {
        !loadPreRender &&
        <>
          {cookieValue == "" && <CookiesSetter />}
          <TawkMessengerScript />
          {window.innerWidth < 1024 && <WhatsappMessenger />}
          <ToastMessage />
        </>

      }

    </React.Fragment>
  );
};

export default AppScripts;