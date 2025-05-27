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
export const StaticUrls = ["/order/success","/register","/reset-password/:token","/cart","/checkout","/"]
const AppRoutes = () => {
  const routesData = {
    "/register":<Registration />,
    "/":<Home />,
    "/reset-password/:token":<ResetPassword />,
    "/cart":<CartPage />,
    "/order/success":<OrderConfirmation />,
    // "/offerteaanvraag":<QuotePage />,
    // "/offerteaanvraag/succes":<QuoteConfirmation />,
    // "/pagina-niet-gevonden":<NoRoute />,
    "/checkout":<Checkout />,
    // "/mijn-account/:key":<MyAccount />,
    // "/mijn-account/:key/:key":<MyAccount />,
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