import React, { useContext, useEffect, useCallback, Suspense } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { persister } from "./Store/store";
import { PersistGate } from "redux-persist/integration/react";
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import Header from "Components/Header";
import DomainContext from "Context/DomainContext";
import AppRoutes from "./AppRoutes";
import { getStoreData, initDB } from './db';
import "./App.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RenderContext from 'Context/RenderContext';
import VisibleWarp from 'Context/VisibleWrapper';
import axios from 'axios';
import BackdropLoader from "Components/BackdropLoader"
import { TypeCheckProvider } from 'Context/TypeCheckAndDataContext';
import { CombinedContext } from 'Context/CombinedContext';
const AppScripts = React.lazy(() => import('./appScripts'));
const Footer = React.lazy(() => import('./Components/Footer'));

const App = () => {
  const loader = useSelector((state) => state?.loader);
  const { isBackdropLoading } = useContext(CombinedContext);
  const { baseURL, defaultURL } = useContext(DomainContext);
  const { loadIfUser, loadPreRender } = useContext(RenderContext);
  const LoaderProgress = () => {
    return (
      <div style={{ zIndex: 99, background: "rgba(0,0,0,0.08)" }} className="fixed top-0 left-0 w-1/1 h-1/1 flex center middle">
        <CircularProgress />
      </div>
    )
  };
  const handleInitDB = useCallback(async () => {
    await initDB();
  }, []);

  useEffect(() => {
    handleInitDB();
    getStoreData("recentUser");
  }, [handleInitDB]);

  //commented purposesly
  // useEffect(() => {
  //   const clearCaches = async () => {
  //     const cacheNames = await caches.keys();
  //     await Promise.all(cacheNames.map(name => caches.delete(name)));
  //   };
  //   clearCaches();
  // }, []);


  return (
    <div className="App">
      <PersistGate loading={null} persistor={persister}>
        {baseURL ? (
          <Router>
            <TypeCheckProvider>
              <Header />
              <AppRoutes />
              <VisibleWarp>
                <Footer />
              </VisibleWarp>
            </TypeCheckProvider>
          </Router>
        ) : <></>}
      </PersistGate>
      {(loader || !baseURL) ? <LoaderProgress /> : (loadIfUser || loadPreRender) ? <Suspense fallback={null} > <AppScripts /> </Suspense> : null}
      {isBackdropLoading ? <BackdropLoader /> : null}
    </div>
  );
};

export default App;