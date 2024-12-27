import "./styles.scss";
import {
  BackgroundBox,
  PageTitle,
  BoxTitle,
  Para,
  ParaBold,
  LineLoader
} from "Components/MyAccount/Common";
import Img from "Components/Img";
import { Toggleup, TickIconNew } from "Res/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SessionExpiredLogout,handleImage } from "Utilities";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState, useContext, useRef, memo } from "react";
import DomainContext from "Context/DomainContext";
import { APIQueryPost } from "APIMethods/API";
import { SkeletonLoader } from "Components/Skeletion";
import Seo from "Components/Seo/Seo";

const Overview = () => {
  const { baseURL, storeId } = useContext(DomainContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const customerId = useSelector((state) => state?.customerDetails?.id);
  const isSessionExpired = useSelector((state) => state?.isSessionExpired);
  const token = useSelector((state) => state?.token);
  const [isProcessign, setIsProcessing] = useState(true);
  const [overViewData, setOverViewData] = useState({});
  const APIRef = useRef(false);

  const getOrderViewDashBoard = () => {
    const dashBoardOptions = {
      isLoader: true,
      loaderAction: (bool) => setIsProcessing(bool),
      setGetResponseData: (resData) => {
        if (resData?.status === 200) {
          setOverViewData(resData?.data?.[0]);
        }
      },
      axiosData: {
        url: `${baseURL}/customer/dashboard`,
        headers: { Authorization: `Bearer ${token}` },
        paramsData: {
          customerId: customerId,
          storeId: storeId,
        },
      },
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      }
    };
    APIQueryPost(dashBoardOptions);
  };
  useEffect(() => {
    if (!APIRef.current && customerId) {
      getOrderViewDashBoard();
      APIRef.current = true;
      setTimeout(() => APIRef.current = false, 200);
    }
  }, [location, customerId]);
  return (
    <>
      <Seo
        metaTitle={storeId === 1 ? "Mijn accountoverzicht | Promofit.nl" : "Mijn accountoverzicht Expofit.nl"}
        metaDescription="Mijn accountoverzicht"
        metaKeywords="Mijn accountoverzicht"
      />
      <div className="overview">
        <div className="flex gap-5 lg-gap-6 col">
          <BackgroundBox className="pt-6 pb-7 px-5 lg-pt-5 lg-px-8 lg-pb-8 userBox">
            {overViewData?.customerDetails?.customer_firstname ?

              <>
                <PageTitle>
                  Hallo&nbsp;
                  <span className="capitalize">
                    {overViewData?.customerDetails?.customer_firstname},
                  </span>
                  &nbsp;leuk dat je er weer bent!
                </PageTitle>
                <Para>
                  Hier vind je de status van je bestellingen{storeId == 1 ? ", offerteaanvragen" : ""} en betalingen.
                </Para>
                <Para>
                  Je kunt ook je wachtwoord aanpassen, adressen toevoegen en nieuwsbriefinschrijving aanpassen.
                </Para>
              </>
              :
              <LineLoader width="100%" height="173px" />

            }

          </BackgroundBox>



          <div className="flex col gap-y-5 lg-gap-y-6 xxl-flex xxl-row gap-x-7 wrap product__info">
            <ProductDetails
              orderTitle="Ordernummer"
              title="Mijn laatste bestelling"
              data={overViewData?.recentOrder}
              to={`/mijn-account/besteldetails?${overViewData?.recentOrder?.[0]?.orderId}`}
              titleTo="/mijn-account/mijn-bestellingen"
              loading={isProcessign}
              buttonTitle="bestellingen"
            />
            {
              storeId === 1 ?
                <ProductDetails
                  orderTitle="Offertenummer"
                  title="Mijn laatste offerteaanvraag"
                  data={overViewData?.quotes}
                  to={`/mijn-account/offertedetails?${overViewData?.quotes?.[0]?.quote_id}`}
                  titleTo="/mijn-account/mijn-offertes"
                  loading={isProcessign}
                  buttonTitle="offerteaanvragen"
                />
                : <></>
            }
          </div>
          <div className="flex col gap-y-5 lg-gap-y-6 xxl-flex xxl-row gap-x-7 wrap news__account">
            <BackgroundBox className="pt-6 pb-7 px-5 lg-pt-5 lg-px-8 lg-pb-8 flex-1 flex col space-between">
              <div className="flex col">
                <BoxTitle to="/mijn-account/mijn-gegevens">Mijn gegevens {`>`}</BoxTitle>
                {isProcessign ? (
                  <SkeletonLoader pclassName="flex col gap-2" length={2} full={true} />
                ) : (
                  <div className="flex col">
                    <ParaBold>
                      {overViewData?.customerDetails?.customer_firstname}{" "}
                      {overViewData?.customerDetails?.customer_lastname}
                    </ParaBold>
                    <Para>
                      {overViewData?.customerDetails?.customer_email}
                    </Para>
                  </div>
                )}
              </div>
              <div className="action pt-8">
                <Link to="/mijn-account/mijn-gegevens" aria-label={"mijn-account-mijn-gegevens"} className="fs-15 text-underline">
                  {isProcessign ? (
                    <span className="fw-300 text-nowrap">
                      {<LineLoader />}
                    </span>
                  ) : (
                    <span className="fw-300 text-nowrap">
                      Wijzigen <span className="arrow">{`>`}</span>
                    </span>
                  )}
                </Link>
              </div>
            </BackgroundBox>
            {/* news */}
            <BackgroundBox className="pt-6 pb-7 px-5 lg-pt-5 lg-px-8 lg-pb-8 flex-1 flex col space-between">
              <div className="flex col">
                <BoxTitle to="/mijn-account/nieuwsbrief">Nieuwsbrief {`>`}</BoxTitle>
                <div className="flex col">
                  {isProcessign ? (
                    <div className="fs-15 line-6 flex middle gap-2">
                      {<LineLoader />}
                    </div>
                  ) : (
                    <Para className="fs-15 line-6 flex middle gap-2">
                      {overViewData?.customerDetails?.is_subscribe ? <TickIconNew /> : <></>}
                      {overViewData?.customerDetails?.is_subscribe}
                      <span>
                        {overViewData?.customerDetails?.is_subscribe
                          ? "U bent ingeschreven voor onze nieuwsbrief."
                          : "U bent niet ingeschreven voor onze nieuwsbrief."}
                      </span>
                    </Para>
                  )}
                </div>
              </div>
              <div className="action pt-8">
                <Link to="/mijn-account/nieuwsbrief" aria-label={"mijn-account-nieuwsbrief"} className="fs-15 text-underline">
                  {isProcessign ? (
                    <span className="fw-300 text-nowrap">
                      {<LineLoader />}
                    </span>
                  ) : (
                    <span className="fw-300 text-nowrap">
                      Wijzigen <span className="arrow">{`>`}</span>
                    </span>
                  )}
                </Link>
              </div>
            </BackgroundBox>
          </div>
        </div>
      </div>
    </>
  );
};

const ProductDetails = ({
  to = "/",
  title = "",
  data = [],
  orderTitle = "",
  titleTo = "/",
  loading = true,
  buttonTitle = ""
}) => {
 
  return (
    <BackgroundBox className="pt-6 pb-7 px-5 lg-pt-5 lg-px-8 lg-pb-8 flex-1">
      <div className="flex col">
        <BoxTitle to={titleTo}>
          {title} {`>`}
        </BoxTitle>
        {loading ? (
          <LineLoader width="100%" height="173px" />
        ) : (
          <>
            {data?.length ? (
              <>
                <div className="recent__info flex col gap-y-3">
                  <ParaBold>{data?.[0]?.createdAt}</ParaBold>
                  <div className="flex gap-4">
                    <div className="relative image">
                      <Link to={to} aria-label={"image Order"}>
                        <Img
                          src={
                            handleImage(orderTitle === "Ordernummer"
                              ? data?.[0]?.items?.[0]?.thumbnailImage
                              : data?.[0]?.items?.[0]?.product_image)

                          }
                          className="image-contain"
                        />
                      </Link>
                    </div>
                    <div className="flex col flex-1 gap-y-1">
                      <ParaBold>
                        {orderTitle} &nbsp;
                        <Link to={to} aria-label={"Ordernummer"} className="fs-15 fw-700">
                          #{orderTitle === "Ordernummer"
                            ? data?.[0]?.incrementId
                            : data?.[0]?.quote_id}
                        </Link>
                      </ParaBold>
                      <div className="flex col sm-flex sm-row sm-bottom sm-space-between">
                        <div className="flex col gap-y-1">
                          <Para>{data?.[0]?.items?.length} artikel(en)</Para>
                          <Para>Totaalbedrag: € {data?.[0]?.grandTotal}</Para>
                        </div>
                        <Link to={to} aria-label={"bekijk"} className="view__product mt-2 sm-mt-0">
                          <span className="fw-700 text-nowrap">
                            bekijk <Toggleup />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="action pt-8">
                  <Link to={titleTo} aria-label={titleTo} className="fs-15 text-underline">
                    <span className="fw-300 text-nowrap">
                      Bekijk alle {buttonTitle}{" "}
                      <span className="arrow">{`>`}</span>
                    </span>
                  </Link>
                </div>
              </>
            ) : (
              <Para>U heeft nog geen {orderTitle === "Ordernummer" ? 'bestelling' : 'offerteaanvraag'} geplaatst.</Para>
            )}
          </>
        )}
      </div>
    </BackgroundBox>
  );
};

export default memo(Overview);
