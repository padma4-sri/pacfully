import React, { useEffect, useState, useContext, memo } from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import { SkeletonLine } from "Components/Skeletion";
import { useSelector ,useDispatch} from "react-redux";
import { isValidEmail, isEmptyValue ,SessionExpiredLogout} from "Utilities";
import { APIQueryPost ,APIQueryGet} from "APIMethods/API";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useLocation, useNavigate } from "react-router-dom";
import {ACTION_CUSTOMER__DETAILS} from "Store/action";

const Newsletter = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { storeId, defaultURL } = useContext(DomainContext);
  const homePageLoading = useSelector((state) => state?.homePageLoading);
  const HeaderFooterDataLoading = useSelector(state => state?.HeaderFooterDataLoading);
  const getFooterData = useSelector(state =>state?.getHeaderFooterData?.data?.footer?.[0]?.Newsletter);
  const token = useSelector(state => state?.token);
  const isSessionExpired = useSelector(state => state?.isSessionExpired);
  const isLoggedUser = useSelector(state => state?.isLoggedUser);
  const [fieldValue, setfFeldValue] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [getResponseData, setGetResponseData] = useState({});
  const [loading, setLoading] = useState(false);
  
  const getUserDetails = (token) => {
    const userDetailsOptions = {
      isLoader: true,
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
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    };
    APIQueryGet(userDetailsOptions);
  };
  // newsLetterParams
  const options = {
    isLoader: true,
    loaderAction: (bool) => setLoading(bool),
    getStatus: (status) => {
      if (status?.status === 200) {
        if(isLoggedUser){
          getUserDetails(token)
        }
      }
    },
    setGetResponseData: (res) => {
      setGetResponseData(res?.data?.[0]);
    },
    axiosData: {
      url: `${defaultURL}/newsletter/subscribe`,
      method: "post",
      paramsData: {
        email: fieldValue,
        storeId: storeId
      },
    },
  };
  const clickHandler = (e) => {
    e.preventDefault();
    var isError = false;
    if (!fieldValue) {
      setFieldError("Verplicht veld.");
      document.getElementById("news__letter")?.focus();
      isError = true;
    } else if (!isEmptyValue(fieldValue)) {
      setFieldError("Verplicht veld.");
      document.getElementById("news__letter")?.focus();
      isError = true;
    } else if (!isValidEmail(fieldValue)) {
      setFieldError("Vul een geldig emailadres in");
      document.getElementById("news__letter")?.focus();
      isError = true;
    }
    // callAPI
    if (!isError) {
      APIQueryPost(options);
    }
  };

  const changeHandler = (e) => {
    setfFeldValue(e.target.value);
    setFieldError("");
    setGetResponseData({});
  };

  useEffect(() => {
    if (getResponseData?.message) {
      setGetResponseData({});
      setfFeldValue("");
    }
  }, [location.pathname]);
  return (
    <div className="footer__newsletter container-fluid">
      <div className="wrapper container py-9 md-py-10 px-4">
        <div className="block flex col gap-x-20 gap-y-5 middle xl-flex xl-gap-x-10 xl-row xxl-flex xxl-gap-x-20">
          {homePageLoading && HeaderFooterDataLoading ? (
            <>
              <h1 className="title fw-700 tc">
                <SkeletonLine animation="pulse" width="250px" height="50px" />
              </h1>
            </>
          ) : (
            <h1 className="title fw-700 tc xl-tl">
              {getFooterData?.header_text}
            </h1>
          )}
          <div className="email__block w-1/1">
            {homePageLoading && HeaderFooterDataLoading ? (
              <form>
                <div className="input__block col md-relative">
                  <SkeletonLine animation="pulse" height="50px" />
                </div>
              </form>
            ) : (
              <form onSubmit={clickHandler} noValidate>
                <div className="input__block col md-relative">
                  <div>
                    <input
                      id="news__letter"
                      value={fieldValue}
                      onChange={changeHandler}
                      type="email"
                      placeholder={getFooterData?.placeholder_text}
                      className="r-9 w-1/1 px-4 sm-px-8 py-4 mb-4 xl-mb-0 fw-400"
                      aria-label="email"
                    />
                  </div>
                  {fieldError && (
                    <p className="error md-absolute pb-4 pl-8 xl-pb-0 xl-pt-2">
                      {fieldError}
                    </p>
                  )}
                  {getResponseData?.message && !fieldError && (
                    <p
                      className={`md-absolute pb-4 pl-8 xl-pb-0 xl-pt-2 ${getResponseData?.code === 400 ? "error" : getResponseData?.code === 200 ? "success" : ""}`}>
                      {getResponseData?.message}
                    </p>
                  )}
                  <button
                    type="submit"
                    aria-label="button"
                    className={`fw-500 r-9 py-0 md-absolute md-top-0 md-right-0 ${loading ? "rotateUpdate" : ""
                      }`}
                  >
                    {loading ? <AutorenewIcon /> : getFooterData?.button_text}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Newsletter);
