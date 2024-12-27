import React, { useEffect, useState, useContext, useRef, memo } from 'react';
import DomainContext from "Context/DomainContext";
import './styles.scss';
import { BackgroundBox, LineLoader, PageTitle, Para, ParaBold } from '../Common';
import Button from 'Components/Common/Button';
import DetailsForm from './DetailsForm/DetailsForm';
import ChangePasswordForm from './DetailsForm/ChangePasswordForm';
import { useDispatch, useSelector } from 'react-redux';
import { APIQueryGet } from 'APIMethods/API';
import { SessionExpiredLogout } from 'Utilities';
import { useLocation, useNavigate } from 'react-router-dom';
import { ACTION_CUSTOMER__DETAILS } from 'Store/action';
import { SkeletonLoader } from 'Components/Skeletion';
import Seo from 'Components/Seo/Seo';

const MyDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const APIRef = useRef(false);
  const { storeId, defaultURL } = useContext(DomainContext);
  const isSessionExpired = useSelector((state) => state?.isSessionExpired);
  const location = useLocation();
  const token = useSelector((state) => state?.token);
  const [openModelDetails, setOpenModelDetails] = useState(false);
  const [openModelPassword, setOpenModelPassword] = useState(false);
  const [isProcessign, setIsProcessing] = useState(true);
  const [customerDetails, setCustomerDetails] = useState({});
  const [updateCustomer, setUpdateCustomer] = useState(false);
  const company = customerDetails?.custom_attributes?.filter((item) => item?.attribute_code === "customer_company");
  const mobile = customerDetails?.custom_attributes?.filter((item) => item?.attribute_code === "phone_number");

  const getOrderViewDashBoard = () => {
    const myDetailsOptions = {
      isLoader: true,
      loaderAction: (bool) => setIsProcessing(bool),
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          setCustomerDetails(resData?.data);
          dispatch(ACTION_CUSTOMER__DETAILS(resData?.data));
        }
      },
      axiosData: {
        url: `${defaultURL}/customers/me`,
        headers: {
          Authorization: `Bearer ${token}`,
        }
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      }
    }
    APIQueryGet(myDetailsOptions);
  }
  useEffect(() => {
    if (!APIRef.current) {
      getOrderViewDashBoard();
      APIRef.current = true;
      setTimeout(() => APIRef.current = false, 200);
    }
  }, [location, updateCustomer]);

  return (
    <React.Fragment>
      <Seo
        metaTitle={storeId === 1 ? "Mijn gegevens | Promofit.nl" : "Mijn gegevens Expofit.nl"}
        metaDescription="Mijn gegevens"
        metaKeywords="Mijn gegevens"
      />
      <div className='mydetails__page'>
        <div className='flex gap-6 col'>
          <BackgroundBox>
            <PageTitle>Mijn gegevens</PageTitle>
            <div className="w-1/1 flex col gap-y-6">
              <div className="w-1/1 overflow-hidden overflow-x-auto no-scrollbar">
                <table className='w-1/1 text-nowrap'>
                  {
                    isProcessign ?
                      <SkeletonLoader length={6} full={true} height="20px" />
                      :
                      <tbody>
                        {
                          company?.length ?
                            <tr>
                              <td>Bedrijfsnaam</td>
                              <td>{company?.[0]?.value}</td>
                            </tr>
                            : <></>
                        }
                        <tr>
                          <td>Voornaam</td>
                          <td>{customerDetails?.firstname}</td>
                        </tr>
                        <tr>
                          <td>Achternaam</td>
                          <td>{customerDetails?.lastname}</td>
                        </tr>
                        <tr>
                          <td>E-mailadres</td>
                          <td>{customerDetails?.email}</td>
                        </tr>
                        {mobile?.length ?
                          <tr>
                            <td>Telefoonnummer</td>
                            <td>{mobile?.[0]?.value}</td>
                          </tr>
                          : ''}
                        <tr>
                          <td>Type klant</td>
                          <td>{company?.length ? 'Zakelijk' : 'Particulier'}</td>
                        </tr>
                      </tbody>
                  }
                </table>
              </div>
              <div className="action underline">
                {
                  isProcessign ?
                    <Button
                      className='fs-15 text-underline'
                    >
                      <span className="fw-300 text-nowrap">
                        <LineLoader width="130px" height="20px" />
                      </span>
                    </Button>
                    :
                    <Button
                      className='fs-15 text-underline'
                      onClick={() => setOpenModelDetails(true)}
                    >
                      <span className="fw-300 text-nowrap">
                        Wijzigen <span className="arrow">{`>`}</span>
                      </span>
                    </Button>
                }
              </div>
            </div>
          </BackgroundBox>
          <BackgroundBox>
            <ParaBold>Wachtwoord</ParaBold>
            <Para>*********</Para>
            <div className="action pt-5 underline">
              <Button
                className='fs-15 text-underline'
                onClick={() => setOpenModelPassword(true)}
              >
                <span className="fw-300 text-nowrap">
                  Wijzigen <span className="arrow">{`>`}</span>
                </span>
              </Button>
            </div>
          </BackgroundBox>
        </div>
      </div>
      <DetailsForm
        openModel={openModelDetails}
        setOpenModel={setOpenModelDetails}
        customerDetails={customerDetails}
        updateCustomer={updateCustomer}
        setUpdateCustomer={setUpdateCustomer}
      />
      <ChangePasswordForm
        openModel={openModelPassword}
        setOpenModel={setOpenModelPassword}
        customerDetails={customerDetails}
      />
    </React.Fragment>
  )
};

export default memo(MyDetails);