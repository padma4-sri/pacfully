import React, { useEffect, useState, useContext, memo } from 'react';
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import { BackgroundBox, PageTitle, Para } from 'Components/MyAccount/Common';
import Input from 'Components/Common/Form/Input';
import Button from 'Components/Common/Button';
import { Toggleup } from 'Res/icons';
import { SessionExpiredLogout } from 'Utilities';
import { APIQueryPost, APIQueryGet } from 'APIMethods/API';
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_CUSTOMER__DETAILS } from 'Store/action';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useLocation, useNavigate } from 'react-router-dom';
import Seo from 'Components/Seo/Seo';

const NewsLetter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { defaultURL, storeId } = useContext(DomainContext);
  const isSessionExpired = useSelector((state) => state?.isSessionExpired);
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.token);
  const customerId = useSelector((state) => state?.customerDetails?.id);
  const customerDetails = useSelector((state) => state?.customerDetails);
  const subscribed = useSelector((state) => state?.customerDetails?.extension_attributes?.is_subscribed);
  const [newsLetter, setNewsLetter] = useState(false);
  const [resMessage, setResMessage] = useState("");
  const [isProcessign, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const changeHandler = (e) => {
    setNewsLetter(e.target.checked);
    setResMessage("");
  };

  const getUserDetails = () => {
    const userDetailsOptions = {
      isLoader: true,
      loaderAction: (bool) => setIsProcessing(bool),
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          dispatch(ACTION_CUSTOMER__DETAILS(resData?.data));
        }
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      },
      axiosData: {
        url: `${defaultURL}/customers/me`,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    }
    APIQueryGet(userDetailsOptions);
  }

  const newsLetterHandler = () => {
    const loginOptions = {
      isLoader: true,
      loaderAction: (bool) => setIsProcessing(bool),
      setGetResponseData: (res) => {
        if (res?.data?.[0]?.code === 200) {
          getUserDetails();
          setResMessage(res?.data?.[0]?.message);
        } else {
          setResMessage(res?.data?.[0]?.message);
          getUserDetails();
        }
      },
      getStatus: (res) => {
        setStatus(res?.status);
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
        if (res?.status !== 200 && res?.status !== 400) {
          setResMessage(res?.message);
        }
      },
      axiosData: {
        url: `${defaultURL}/customer/newslettersubscribe`,
        headers: { Authorization: `Bearer ${token}` },
        paramsData: {
          customerId: customerId,
          storeId: storeId
        }
      }
    }

    if(subscribed !== newsLetter) APIQueryPost(loginOptions);
  }

  useEffect(() => {
    setNewsLetter(subscribed);
  }, [subscribed]);

  // remove error message
  useEffect(() => {
    if (resMessage) {
      setResMessage("")
    }
  }, [location.pathname]);
  return (
    <>
      <Seo
        metaTitle={storeId === 1 ? "Nieuwsbrief | Promofit.nl" : "Nieuwsbrief Expofit.nl"}
        metaDescription="Nieuwsbrief"
        metaKeywords="Nieuwsbrief"
      />
      <div className='newsletter__page'>
        <div className='flex gap-6 col'>
          <div className="flex gap-y-6 gap-x-7 wrap news__account">
            <BackgroundBox className='pt-6 pb-7 px-5 lg-pt-5 lg-px-8 lg-pb-8 flex-1 flex col space-between'>
              <div className="flex col">
                <PageTitle>Nieuwsbrief</PageTitle>
                <div className='flex col pb-7 lg-pb-9'>
                  <Para>Ontvang updates van nieuwe producten, aanbiedingen en kortingscodes via onze nieuwsbrief.</Para>
                  <Para>Beheer hieronder uw inschrijving. Voor het vakje dat is aangevinkt ontvangt u de nieuwsbrief.</Para>
                </div>
                <div className='flex'>
                  <Input
                    type="checkbox"
                    name="newsLetter"
                    lable={storeId === 1 ? "Promofit nieuwsbrief" : "Expofit nieuwsbrief"}
                    fieldClassName="checkbox flex gap-3 row pb-3 row-i right middle fs-15 pl-1"
                    labelClassName="fs-15"
                    value={newsLetter}
                    onChange={changeHandler}
                    checked={newsLetter}
                  />
                </div>
              </div>
              <div className="action pt-5 lg-pt-10 pb-5">
                <Button
                  className={`r-9 fw-700 fs-16 ${isProcessign ? 'rotateUpdate' : ''}`}
                  onClick={(e) => newsLetterHandler(e)}
                >{isProcessign ? <AutorenewIcon /> : "Opslaan"} {!isProcessign ? <Toggleup /> : <></>}</Button>
                {resMessage && <div className={`res__message pt-5 ${status === 200 ? "success" : "error"}`}>{resMessage}</div>}
              </div>
              <div className='flex col footer__info'>
                <Para className='fs-13 line-6'>Lees in ons privacybeleid hoe wij omgaan met uw persoonsgegevens. U kunt zich altijd uitschrijven via de afmeldlink in de nieuwsbrief.</Para>
              </div>
            </BackgroundBox>
          </div>
        </div>
      </div>
    </>
  )
};

export default memo(NewsLetter);