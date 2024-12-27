import React, { useEffect, useState, useContext, memo, useRef } from 'react';
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import Overview from 'Components/MyAccount/Overview';
import MyDetails from 'Components/MyAccount/MyDetails';
import NewsLetter from 'Components/MyAccount/NewsLetter';
import Favorites from 'Components/MyAccount/Favorites';
import OrdersList from 'Components/MyAccount/OrdersList';
import OrdersView from 'Components/MyAccount/OrdersView';
import Address from 'Components/MyAccount/Address';
import Sidebar from 'Components/MyAccount/Sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { APIQueryPost } from 'APIMethods/API';
import { SessionExpiredLogout, GetCountryList } from 'Utilities';
import useScrollToTop from 'Components/Hooks/useScrollToTop';
import { useEffectOnce } from 'Components/Hooks/useEffectOnce';

const MyAccount = () => {
  useScrollToTop();
  const { baseURL, storeId, defaultURL } = useContext(DomainContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.token);
  const customerId = useSelector((state) => state?.customerDetails?.id);
  const isSessionExpired = useSelector((state) => state?.isSessionExpired);
  const isLoggedUser = useSelector((state) => state?.isLoggedUser);
  const countriesList = useSelector(state => state?.countriesList);
  const location = useLocation();
  const pathName = location?.pathname?.split('/')?.[2];
  const [isProcessign, setIsProcessing] = useState(false);
  const [quoteRequestData, setQuoteRequestData] = useState({});
  const [orderViewOrderData, setViewOrderData] = useState({});
  const APIRef = useRef(false);

  const getViewOrderData = () => {
    const loginOptions = {
      isLoader: true,
      loaderAction: (bool) => setIsProcessing(bool),
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          setViewOrderData(resData?.data?.[0]);
        }
        
      },
      axiosData: {
        url: `${baseURL}/customer/orderdetails`,
        headers: { Authorization: `Bearer ${token}` },
        paramsData: {
          customerId: customerId,
          orderId: location?.search?.slice(1),
          storeId: storeId
        }
      },
      getStatus: (res) => {
         if(res?.status === 404){
          navigate("/")
        }
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      }
    }
    APIQueryPost(loginOptions);
  }
  const getViewQuoteOrderData = () => {
    const loginOptions = {
      isLoader: true,
      loaderAction: (bool) => setIsProcessing(bool),
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          setQuoteRequestData(resData?.data?.[0]);
        }
          if(resData && resData?.data[0]?.code === 401){
          navigate("/")
        }
      },
      axiosData: {
        url: `${defaultURL}/quote/getpendingquotes`,
        headers: { Authorization: `Bearer ${token}` },
        paramsData: {
          customerId: customerId,
          quoteId: location?.search?.slice(1),
          storeId: storeId
        }
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      }
    }
    APIQueryPost(loginOptions);
  }
  const dynamicPages = () => {
    switch (pathName) {
      case 'mijn-overzicht':
        return <Overview />
      case 'nieuwsbrief':
        return <NewsLetter />
      case 'mijn-favorieten':
        return <Favorites />
      case 'mijn-bestellingen':
        return <OrdersList title="Mijn bestellingen" placeholder="Zoeken in orders" orderTitle="Ordernummer" url="/mijn-account/besteldetails" />
      case 'mijn-offertes':
        return storeId === 1 ? <OrdersList title="Mijn offerteaanvragen" placeholder="Zoeken in offertes" orderTitle="Offertenummer" url="/mijn-account/offertedetails" /> : <></>
      case 'besteldetails':
        return <OrdersView orderTitle="Ordernummer" data={orderViewOrderData} loading={isProcessign} />
      case 'offertedetails':
        return <OrdersView orderTitle="Offertenummer" data={quoteRequestData?.quotes?.[0]} loading={isProcessign} customerData={quoteRequestData?.customer_info} />
      case 'mijn-adressen':
      case 'adressenlijst':
        return <Address />
      case 'mijn-gegevens':
        return <MyDetails />
    }
  }

  useEffect(() => {
    if (!APIRef.current) {
      if (pathName === "besteldetails") getViewOrderData();
      if (pathName === "offertedetails") getViewQuoteOrderData();
      APIRef.current = true;
      setTimeout(() => APIRef.current = false, 200);
    }
  }, [location]);

  useEffect(() => {
    if (!isLoggedUser) {
      navigate("/", { replace: true });
    }
  }, [isLoggedUser, location]);
  // render once
  useEffectOnce(()=>{
    if(!countriesList?.length){
      GetCountryList(dispatch,baseURL,storeId);
    }
  });
  return (
    <div className="myaccount__page pt-4">
      <div className='myaccount__wrapper'>
        <div className="container md-px-4 pt-5 lg-pt-9 pb-11 flex col lg-flex lg-row gap-5 lg-gap-7">
          <Sidebar />
          <div className="myaccount__main" style={{ maxWidth: "982px", width: '100%' }}>
            {dynamicPages()}
          </div>
        </div>
      </div>
    </div>
  )
};

export default memo(MyAccount);