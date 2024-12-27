import React from "react";
import { Routes, Route } from "react-router-dom";
import ContactUs from "./Pages/ContactUs";
import Home from "./Pages/Home";
import ProductPage from "Pages/ProductPage";
import Registration from "Pages/Authencation/Registration";
import ResetPassword from "Pages/Authencation/ResetPassword";
import MyAccount from "Components/MyAccount";
import CartPage from "Pages/CartPage";
import QuotePage from "Pages/QuotePage";
import QuoteConfirmation from "Pages/QuoteConfirmation";
import Checkout from "Pages/Checkout";
import OrderConfirmation from "Components/Checkout/OrderConfirmation";
import Disclaimer from "Pages/Disclaimer";
import AboutUs from "./Pages/Aboutus";
import PrintingTechniques from "./Pages/PrintingTechniques";
import CustomerService from "./Pages/CMS/CustomerService";
import PrivacyPolicy from "Pages/CMS/PrivacyPolicy";
import TermsConditions from "Pages/CMS/TermsConditions";
import VacanciesDashboard from "Pages/CMS/Vacancies/Dashboard";
import ViewJobDetails from "Pages/CMS/Vacancies/ViewJobDetails";
import Shoroom from "Pages/CMS/Shoroom";
import Faq from "Pages/Faq";
import FaqDetail from "Pages/FaqDetail";
import KortingsCodes from "Pages/KortingsCodes";
import BlogListing from "Pages/CMS/Blog/BlogListing";
import BlogDetails from "Pages/CMS/Blog/BlogDetails";
import ReviewListing from "Pages/ReviewListing";
import NoRoute from "Components/NoRoute/NoRoute";
import SiteMap from "Pages/SiteMap";
export const StaticUrls = ["/maak-account-aan", "/wachtwoord-opnieuw-instellen/:token", "/winkelwagen", "/offerteaanvraag", "/meest-gestelde-vragen", "/meest-gestelde-vragen/*", "/offerteaanvraag/succes", "/order/succes", "/pagina-niet-gevonden", "/kiyoh", "/checkout", "/privacy", "/algemene-voorwaarden", "/showroom", "/vacatures", "/vacatures/:key", "/blog", "/blog/:key", "/contact", "/disclaimer", "/over-ons", "/druktechnieken", "/klantenservice", "/klantenservice/*", "/mijn-account/:key", "/mijn-account/:key/:key", "/kortingscodes" , "/sitemap"]
const AppRoutes = () => {
  const routesData = {
    "/maak-account-aan":<Registration />,
    "/wachtwoord-opnieuw-instellen/:token":<ResetPassword />,
    "/winkelwagen":<CartPage />,
    "/offerteaanvraag":<QuotePage />,
    "/meest-gestelde-vragen":<Faq />,
    "/meest-gestelde-vragen/*":<FaqDetail />,
    "/offerteaanvraag/succes":<QuoteConfirmation />,
    "/order/succes":<OrderConfirmation />,
    "/pagina-niet-gevonden":<NoRoute />,
    "/kiyoh":<ReviewListing />,
    "/checkout":<Checkout />,
    "/privacy":<PrivacyPolicy />,
    "/algemene-voorwaarden":<TermsConditions />,
    "/showroom":<Shoroom />,
    "/vacatures":<VacanciesDashboard />,
    "/vacatures/:key":<ViewJobDetails />,
    "/blog":<BlogListing />,
    "/blog/:key":<BlogDetails />,
    "/contact":<ContactUs />,
    "/disclaimer":<Disclaimer />,
    "/over-ons":<AboutUs />,
    "/druktechnieken":<PrintingTechniques />,
    "/klantenservice":<CustomerService />,
    "/klantenservice/*":<CustomerService />,
    "/mijn-account/:key":<MyAccount />,
    "/mijn-account/:key/:key":<MyAccount />,
    "/kortingscodes" :<KortingsCodes />,
    "/sitemap" :<SiteMap />
  }
return (
  <React.Fragment>
    <Routes>
      <Route path="/" element={<Home />} exact />
      {StaticUrls.map((url)=> (
        <Route key={`route_${url}`} path={url} element={routesData[url]} exact />
      ))}
      <Route path="/*" element={<ProductPage />} exact />
    </Routes>
  </React.Fragment>
  );
};

export default AppRoutes;