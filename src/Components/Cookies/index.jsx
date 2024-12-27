import React, {  useCallback } from "react";
import "./styles.scss";
import Button from 'Components/Common/Button';
import { ACTION__COOKIE_VALUE } from 'Store/action';
import { useDispatch } from "react-redux";
import Institutions from "./Institutions";
const CookiesSetter = () => {
  const dispatch = useDispatch();
  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }
  const sendConsent = useCallback((consent) => {
    gtag('consent', 'update', consent);
  }, []);

  const handleDecision = (outcome) => {
    const consent = {
      'ad_storage': outcome,
      'analytics_storage': outcome,
      'ad_user_data': outcome,
      'ad_personalization': outcome,
    };

    const cookieName = "COOKIE_NAME";
    const cookieValues = JSON.stringify(consent);
    const expirationDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

    document.cookie = `${cookieName}=${encodeURIComponent(cookieValues)}; expires=${expirationDate.toUTCString()}; path=/; domain=${window.location.hostname};`;
    sendConsent(consent);
    dispatch(ACTION__COOKIE_VALUE(outcome));

  };


  return (
    <div className='sticky bottom-0 cookie_modal'>
      <div className="cookies_popup flex col w-1/1 h-1/1 overflow-hidden ">
        <div className='cookie_contianer py-8 px-12'>
          <div>
            <p className="cookie_policy fs-15 line-6 fw-400" >Wij gebruiken cookies om uw gebruikservaring te optimaliseren, het webverkeer te analyseren en gerichte advertenties te kunnen tonen via derde partijen. Lees meer over hoe wij cookies gebruiken en hoe u ze kunt beheren door op "Instellingen" te klikken. Als u akkoord gaat met ons gebruik van cookies, klikt u op "Cookies toestaan".</p>
            <div className="button_block">
              <Button
                className="fs-15  py-1 line-8 fw-700 r-8 mr-md-8 decline_button "
                type="submit"
                onClick={() => {
                  handleDecision("granted")
                }}
              >
                Cookies toestaan
              </Button>
              <Button
                className="fs-15 py-1 line-8 fw-700 r-8 Instellingen_button  "
                onClick={() => handleDecision("denied")}
              > Weigeren</Button>
               <Institutions/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesSetter;
