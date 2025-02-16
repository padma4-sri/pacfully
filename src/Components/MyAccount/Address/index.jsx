import "./styles.scss";
import { BackgroundBox, LineLoader, PageTitle } from 'Components/MyAccount/Common';
import { Toggleup } from "Res/icons";
import Button from "Components/Common/Button";
import AddressForm from "./AddressForm";
import React, { memo, useContext, useEffect, useRef, useState } from "react";
import DomainContext from "Context/DomainContext";
import Img from "Components/Img";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { EditIcon, AccountMobile, AccountHome, AccountPerson, AccountJob } from "Res/icons";
import { APIQueryPost } from 'APIMethods/API';
import { SessionExpiredLogout } from 'Utilities';
import { useDispatch, useSelector } from "react-redux";
import { NavigationType, useLocation, useNavigate, useNavigationType } from "react-router-dom";
import axios from "axios";
import { SkeletonLoader } from "Components/Skeletion";

const useBackButton = () => {
  const navType = useNavigationType();
  return navType === NavigationType.Pop;
};
const Address = () => {
  const { storeId, baseURL, defaultURL } = useContext(DomainContext);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const pathName = location?.pathname?.split('/')?.[2];
  const token = useSelector((state) => state?.token);
  const adminToken = useSelector((state) => state?.adminToken);
  const customerId = useSelector((state) => state?.customerDetails?.id);
  const isSessionExpired = useSelector((state) => state?.isSessionExpired);
  const [openAddressForm, setOpenAddressForm] = useState(false);
  const [title, setTitle] = useState("");
  const DeleteIcon = "/res/img/deleteIcon.svg";
  const InfoImage = "/res/img/warning.svg";
  const [isProcessign, setIsProcessing] = useState(true);
  const [resMessage, setResMessage] = useState("");
  const [updateAddressList, setUpdateAddressList] = useState(false);
  const [getAddressList, setGetAddressList] = useState({});
  const getDefaultBillingAddress = getAddressList?.[0]?.allAddress?.filter((item) => item?.default_billing === 1);
  const getDefaultShippingAddress = getAddressList?.[0]?.allAddress?.filter((item) => item?.default_shipping === 1);
  const [editAddress, setEditAddress] = useState({});
  const [activeAddress, setActiveAddress] = useState("");
  const APIRef = useRef(false);

  const isPop = useBackButton();

  const getAddressListData = () => {
    const addressOptions = {
      isLoader: true,
      loaderAction: (bool) => setIsProcessing(bool),
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          setGetAddressList(resData?.data);
        }
      },
      axiosData: {
        url: `${baseURL}/customer/getaddress`,
        headers: { Authorization: `Bearer ${token}` },
        paramsData: {
          customerId: customerId,
          quoteId: ""
        }
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      }
    }
    APIQueryPost(addressOptions);
  }
  // deleteAddres
  const deleteAddressHandler = (id) => {
    axios.delete(`${defaultURL}/addresses/${id}`, { headers: { Authorization: `Bearer ${adminToken}` } }).then((res) => {
      setUpdateAddressList(!updateAddressList);
      window.scrollTo(0, 0);
    }).catch((err) => {
      SessionExpiredLogout(dispatch, err?.response?.status, navigate, isSessionExpired);
      setResMessage(err?.message);
    });
  }
  const addressHandler = () => {
    const options = {
      isLoader: true,
      loaderAction: (bool) => setIsProcessing(bool),
      setGetResponseData: (resData) => {
        if (resData?.status === 200 && resData?.data?.[0]?.code === 200) {
          setUpdateAddressList(!updateAddressList);
          setEditAddress({});
          navigate("/mijn-account/mijn-adressen");
        }
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
        if (res?.status !== 200) {
          setResMessage(res?.message);
        }
      },
      axiosData: {
        url: `${baseURL}/customer/saveaddress`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        paramsData: {
          customerId: customerId,
          addressId: editAddress?.address_id,
          address: {
            first_name: editAddress?.firstname,
            last_name: editAddress?.lastname,
            street1: editAddress?.street1,
            street2: editAddress?.street2,
            company: editAddress?.company ? editAddress?.company : '',
            city: editAddress?.city,
            state: '',
            mobile_number: editAddress?.mobile_number,
            reference_number: editAddress?.reference_number ? editAddress?.reference_number : '',
            vat_id: editAddress?.vat_id ? editAddress?.vat_id : '',
            additional_details: editAddress?.additional_details ? editAddress?.additional_details : '',
            postcode: editAddress?.postcode,
            country_id: editAddress?.country_id,
            make_default_billing: location?.state?.isBilling ? 1 : editAddress?.default_billing.toString(),
            make_default_shipping: !location?.state?.isBilling ? 1 : editAddress?.default_shipping.toString()
          }
        }
      }
    }
    APIQueryPost(options);
  }
  useEffect(() => {
    if (!APIRef.current) {
      getAddressListData();
      APIRef.current = true;
      setTimeout(() => APIRef.current = false, 200);
    }
  }, [location.pathname, updateAddressList]);

  useEffect(() => {
    const data = getAddressList?.[0]?.allAddress?.filter((item) => item?.default_shipping === 1);
    const billingData = getAddressList?.[0]?.allAddress?.filter((item) => item?.default_billing === 1);
    if (location?.state?.isBilling) {
      setActiveAddress(billingData?.[0]?.address_id);
    } else {
      setActiveAddress(data?.[0]?.address_id);
    }
    setEditAddress({});
  }, [getAddressList, location.pathname]);

  useEffect(() => {
    if (isPop && openAddressForm) {
      setOpenAddressForm(false);
    }
  }, [isPop]);

  const defaultLoader = <SkeletonLoader length={7} width="170px" height="25px" full={true} />;

  const defaultButtonLoader = <SkeletonLoader pclassName="flex gap-1" length={2} width="100px" height="25px" full={true} />;

  return (
    <React.Fragment>
      
      <div className='address__page'>
        <div className='flex gap-6 col'>
          <div className="flex gap-y-6 gap-x-7 wrap">
            <BackgroundBox className='addressmain pt-6 pb-7 px-5 lg-pt-5 lg-px-8 lg-pb-8 flex-1 flex col space-between'>
              <div className="flex col pb-1 address-title">
                <PageTitle>Adresboek</PageTitle>
                <div className="customer-warning">
                 <img src={InfoImage} alt="warning"/> 
                  <p> Adressen die worden gewijzigd, worden helaas nog NIET automatisch doorgevoerd in lopende orders. Geef de adreswijziging dan aub ook door aan de sales medewerker.</p>
                </div>
              </div>
              {
                pathName === "mijn-adressen" ?
                  <div className="standardaddress">
                    <div className="flex col pb-12">
                      <h3 className="fs-20 line-5 fw-700 pb-3">Standaard factuuradres</h3>
                      {
                        isProcessign ?
                          defaultLoader
                          :
                          getDefaultBillingAddress?.length ?
                            <div className="flex col gap-y-1">
                              {
                                getDefaultBillingAddress?.[0]?.company ?
                                  <div className="flex gap-x-3">
                                    <p className="icon"><AccountJob /></p>
                                    <p className="fs-15 line-6">{getDefaultBillingAddress?.[0]?.company}</p>
                                  </div>
                                  : <></>
                              }
                              <div className="flex gap-x-3">
                                <p className="icon"><AccountPerson /></p>
                                <p className="fs-15 line-6">{getDefaultBillingAddress?.[0]?.firstname} {getDefaultBillingAddress?.[0]?.lastname}</p>
                              </div>
                              <div className="flex gap-x-3">
                                <p className="homeIcon icon"><AccountHome /></p>
                                <p className="fs-15 line-6">{getDefaultBillingAddress?.[0]?.street2} {getDefaultBillingAddress?.[0]?.street1}  <br /> {getDefaultBillingAddress?.[0]?.postcode} {getDefaultBillingAddress?.[0]?.city}<br /> {getDefaultBillingAddress?.[0]?.country_code}</p>
                              </div>
                              <div className="flex gap-x-3">
                                <p className="icon"><AccountMobile /></p>
                                <p className="fs-15 line-6">Tel. {getDefaultBillingAddress?.[0]?.mobile_number}</p>
                              </div>
                              {
                                getDefaultBillingAddress?.[0]?.vat_id ?
                                  <div className="flex gap-x-3">
                                    <p className="v-hide icon"><AccountMobile /></p>
                                    <p className="fs-15 line-6">{getDefaultBillingAddress?.[0]?.vat_id}</p>
                                  </div>
                                  : <></>
                              }
                            </div>
                            : <></>
                      }
                      {
                        !isProcessign && !getDefaultBillingAddress?.length ?
                          <div className="flex gap-x-3 pt-2">
                            <p className="v-hide icon"><AccountMobile /></p>
                            <div className="action underline flex gap-5">
                              <p className="fs-15 line-6">Er is nog geen standaard factuuradres.</p>
                            </div>
                          </div>
                          : <></>
                      }
                      <div className="flex gap-x-3 pt-2">
                        <p className="v-hide icon"><AccountMobile /></p>
                        <div className="action underline flex gap-5">
                          {
                            isProcessign ?
                              defaultButtonLoader
                              :
                              <>
                                {
                                  getDefaultBillingAddress?.length ?
                                    <Button
                                      className='fs-15 text-underline'
                                      onClick={() => {
                                        navigate('/mijn-account/adressenlijst', { state: { isBilling: true } });
                                      }}
                                    >
                                      <span className="fw-300 text-nowrap">
                                        Wijzigen <span className="arrow">{`>`}</span>
                                      </span>
                                    </Button>
                                    : <></>
                                }
                                <Button
                                  className='fs-15 text-underline'
                                  onClick={() => {
                                    setTitle("Nieuw adres")
                                    setOpenAddressForm(true);
                                    navigate('', { state: { isBilling: true, isNewAddress: true } });
                                  }}
                                >
                                  <span className="fw-300 text-nowrap">
                                    Toevoegen <span className="arrow">{`>`}</span>
                                  </span>
                                </Button>
                              </>
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex col pb-10">
                      <h3 className="fs-20 line-5 fw-700 pb-3">Standaard afleveradres</h3>
                      {
                        !isProcessign && !getDefaultShippingAddress?.length ?
                          <div className="flex gap-x-3 pt-2">
                            <p className="v-hide icon"><AccountMobile /></p>
                            <div className="action underline flex gap-5">
                              <p className="fs-15 line-6">Er is nog geen standaard leveradres.</p>
                            </div>
                          </div>
                          : <></>
                      }
                      {isProcessign ?
                        defaultLoader
                        :
                        getDefaultShippingAddress?.length ?
                          <div className="flex col gap-y-1">
                            {
                              getDefaultShippingAddress?.[0]?.company ?
                                <div className="flex gap-x-3">
                                  <p className="icon"><AccountJob /></p>
                                  <p className="fs-15 line-6">{getDefaultShippingAddress?.[0]?.company}</p>
                                </div>
                                : <></>
                            }
                            <div className="flex gap-x-3">
                              <p className="icon"><AccountPerson /></p>
                              <p className="fs-15 line-6">{getDefaultShippingAddress?.[0]?.firstname} {getDefaultShippingAddress?.[0]?.lastname}</p>
                            </div>
                            <div className="flex gap-x-3">
                              <p className="homeIcon icon"><AccountHome /></p>
                              <p className="fs-15 line-6">{getDefaultShippingAddress?.[0]?.street2} {getDefaultShippingAddress?.[0]?.street1} <br /> {getDefaultShippingAddress?.[0]?.postcode} {getDefaultShippingAddress?.[0]?.city}<br /> {getDefaultShippingAddress?.[0]?.country_code}</p>
                            </div>
                            <div className="flex gap-x-3">
                              <p className="icon"><AccountMobile /></p>
                              <p className="fs-15 line-6">Tel. {getDefaultShippingAddress?.[0]?.mobile_number}</p>
                            </div>
                            {
                              getDefaultShippingAddress?.[0]?.vat_id ?
                                <div className="flex gap-x-3">
                                  <p className="v-hide icon"><AccountMobile /></p>
                                  <p className="fs-15 line-6">{getDefaultShippingAddress?.[0]?.vat_id}</p>
                                </div>
                                : <></>
                            }
                          </div>
                          : <></>
                      }
                      <div className="flex gap-x-3 pt-2">
                        <p className="v-hide icon"><AccountMobile /></p>
                        <div className="action underline flex gap-5">
                          {
                            isProcessign ?
                              defaultButtonLoader
                              :
                              <>
                                {
                                  getDefaultShippingAddress?.length ?
                                    <Button
                                      className='fs-15 text-underline'
                                      onClick={() => {
                                        navigate('/mijn-account/adressenlijst', { state: { isBilling: false } });
                                      }}
                                    >
                                      <span className="fw-300 text-nowrap">
                                        Wijzigen <span className="arrow">{`>`}</span>
                                      </span>
                                    </Button>
                                    : <></>
                                }
                                <Button
                                  className='fs-15 text-underline'
                                  onClick={() => {
                                    setTitle("Nieuw adres")
                                    setOpenAddressForm(true);
                                    navigate('', { state: { isBilling: false, isNewAddress: true } });
                                  }}
                                >
                                  <span className="fw-300 text-nowrap">
                                    Toevoegen <span className="arrow">{`>`}</span>
                                  </span>
                                </Button>
                              </>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  : ""
              }
              {
                pathName === "adressenlijst" ?
                  <div className="standardaddress">
                    <div className="flex col pb-12">
                      <h3 className="fs-20 line-5 fw-700 pb-4">{location?.state?.isBilling ? 'Factuuradressen' : 'Afleveradres'}</h3>
                      <div className="flex wrap gap-8 pb-8 addres__block">
                        {
                          isProcessign ?
                            ['', '', '', '', '', '']?.map((item, key) => (
                              <div
                                className="addBox flex col gap-y-1 pointer space-between"
                                key={`myaccountAddressList${key}`}
                              >
                                <div className="flex col">
                                  <LineLoader height="208px" width="100%" />
                                </div>
                              </div>
                            ))
                            :
                            getAddressList?.[0]?.allAddress?.map((item, key) => (
                              <div
                                className={`addBox flex col gap-y-1 pointer space-between ${activeAddress === item?.address_id ? 'active' : ''}`}
                                key={`myaccountAddressList${key}`}
                                onClick={() => {
                                  setActiveAddress(item?.address_id);
                                  setEditAddress(item);
                                }}
                              >
                                <div className="flex row gap-2">
                                  <div className="flex col">
                                    {
                                      item?.company ?
                                        <div className="flex gap-x-3">
                                          <p className="icon"><AccountJob /></p>
                                          <p className="fs-15 line-6">{item?.company}</p>
                                        </div>
                                        : <></>
                                    }
                                    <div className="flex gap-x-3">
                                      <p className="homeIcon icon"><AccountPerson /></p>
                                      <p className="fs-15 line-6">{item?.firstname} {item?.lastname}</p>
                                    </div>
                                    <div className="flex gap-x-3">
                                      <p className="homeIcon icon"><AccountHome /></p>
                                      <p className="fs-15 line-6 pb-1">{item?.street2}  {item?.street1}<br /> {item?.postcode} {item?.city}<br />{item?.country_code}</p>
                                    </div>
                                    <div className="flex gap-x-3">
                                      <p className="icon"><AccountMobile /></p>
                                      <p className="fs-15 line-6">
                                        <p>Tel. {item?.mobile_number}</p>
                                        <p>{item?.vat_id}</p>
                                      </p>
                                    </div>
                                    <div className="flex gap-x-3 v-hide" style={{ height: '25px' }}>
                                      <p className="homeIcon icon"><AccountHome /></p>
                                      <p className="fs-15 line-6 pb-1">{item?.street2} {item?.street1} <br /> {item?.postcode} {item?.city}<br />{item?.country_code}</p>
                                    </div>
                                  </div>
                                  <div className="flex col flex-1 space-between">
                                    {(location?.state?.isBilling ? item?.default_billing : item?.default_shipping) === 1 ? <p className="fs-12 line-6 standard flex right">Standaard</p> : <p className="fs-12 line-6 standard flex right v-hide">Standaard</p>}
                                    <div className="action underline flex gap-5 pt-3 right">
                                      <Button
                                        className='fs-15 text-underline'
                                        onClick={() => {
                                          setTitle("Wijzig adres")
                                          setOpenAddressForm(true);
                                          setEditAddress(item);
                                          if (location.state.isBilling) {
                                            navigate('', { state: { isBilling: true, isNewAddress: false } });
                                          } else {
                                            navigate('', { state: { isBilling: false, isNewAddress: false } });
                                          }
                                        }}
                                      >
                                        <EditIcon/>
                                      </Button>
                                      {
                                        (item?.default_billing !== 1 && item?.default_shipping !== 1) ?
                                          <Button
                                            className='fs-15 text-underline relative'
                                            onClick={() => deleteAddressHandler(item?.address_id)}
                                          >
                                            <img src={DeleteIcon} />
                                          </Button>
                                          : <></>
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                        }
                      </div>
                      <div className="action underline flex gap-5 w-1/1 right pb-10">
                        {
                          isProcessign ?
                            <LineLoader width="180px" height="20px" />
                            :
                            <Button
                              className='fs-15 text-underline fw-300'
                              onClick={() => {
                                setTitle("Nieuw adres");
                                setOpenAddressForm(true);
                                if (location?.state?.isBilling) {
                                  navigate('', { state: { isBilling: true } });
                                } else {
                                  navigate('', { state: { isBilling: false } });
                                }
                              }}
                            >
                              <span className="fw-300 text-nowrap">
                                + Voeg nieuw adres toe
                              </span>
                            </Button>
                        }

                      </div>
                      <div className="action page__actions flex gap-4 sm-gap-7 right">
                        {
                          isProcessign ?
                            ['', ''].map((item, ind) => (
                              <React.Fragment key={`addressListBtnLoader${ind + 1}`}>
                                <LineLoader width="120px" height="50px" borderRadius="35px" />
                              </React.Fragment>
                            ))
                            :
                            <>
                              <Button
                                variant="outlined"
                                className="flex-1 r-6 px-2 py-2 fs-14 pointer fw-300"
                                onClick={() => {
                                  navigate("/mijn-account/mijn-adressen");
                                }}
                              >Annuleren</Button>
                              <Button
                                className={`flex-1 r-6 px-2 py-2 fs-14 pointer fw-700 ${isProcessign ? 'rotateUpdate' : ''}`}
                                onClick={() => addressHandler()}
                                disabled={editAddress?.address_id && activeAddress ? false : true}
                              >{isProcessign ? <AutorenewIcon /> : "Opslaan"} {!isProcessign ? <Toggleup /> : <></>}</Button>
                            </>
                        }
                        {resMessage && <div className="res__message pt-5 error">{resMessage}</div>}
                      </div>
                    </div>
                  </div>
                  : ''
              }
            </BackgroundBox>
          </div>
        </div>
      </div>
      <AddressForm
        openModel={openAddressForm}
        setOpenModel={setOpenAddressForm}
        title={title}
        updateAddressList={updateAddressList}
        setUpdateAddressList={setUpdateAddressList}
        editAddress={editAddress}
        getAddressList={getAddressList}
      />
    </React.Fragment>
  )
};

export default memo(Address);