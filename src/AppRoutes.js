import React from "react";
import { Routes, Route } from "react-router-dom";
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
import NoRoute from "Components/NoRoute/NoRoute";
import CommingSoon from "Pages/CommingSoon";
export const StaticUrls = ["/maak-account-aan", "/wachtwoord-opnieuw-instellen/:token", "/winkelwagen", "/offerteaanvraag", "/meest-gestelde-vragen", "/meest-gestelde-vragen/*", "/offerteaanvraag/succes", "/order/succes", "/pagina-niet-gevonden", "/kiyoh", "/checkout", "/privacy", "/algemene-voorwaarden", "/showroom", "/vacatures", "/vacatures/:key", "/blog", "/blog/:key", "/contact", "/disclaimer", "/over-ons", "/druktechnieken", "/klantenservice", "/klantenservice/*", "/mijn-account/:key", "/mijn-account/:key/:key", "/kortingscodes" , "/sitemap"]
const AppRoutes = () => {
  const routesData = {
    "/maak-account-aan":<Registration />,
    "/wachtwoord-opnieuw-instellen/:token":<ResetPassword />,
    "/winkelwagen":<CartPage />,
    "/offerteaanvraag":<QuotePage />,
    "/offerteaanvraag/succes":<QuoteConfirmation />,
    "/order/succes":<OrderConfirmation />,
    "/pagina-niet-gevonden":<NoRoute />,
    "/checkout":<Checkout />,
    "/mijn-account/:key":<MyAccount />,
    "/mijn-account/:key/:key":<MyAccount />,
  }
return (
  <React.Fragment>
    <Routes>
      <Route path="/" element={<CommingSoon />} exact />
      {/* {StaticUrls.map((url)=> (
        <Route key={`route_${url}`} path={url} element={routesData[url]} exact />
      ))} */}
      {/* <Route path="/*" element={<ProductPage />} exact /> */}
    </Routes>
  </React.Fragment>
  );
};

export default AppRoutes;