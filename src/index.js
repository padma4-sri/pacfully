import React from 'react';
import ReactDOM from 'react-dom/client';
import { DomainProvider } from "Context/DomainContext";
import './index.scss';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './Store/store';
import { HelmetProvider } from "react-helmet-async";
import { RenderProvider } from 'Context/RenderContext';
import { CombinedProvider } from 'Context/CombinedContext';
// import "@fontsource/poppins";
// import "@fontsource/poppins/300.css";
// import "@fontsource/poppins/300-italic.css";
// import "@fontsource/poppins/600.css";
// import "@fontsource/poppins/600-italic.css";
// import "@fontsource/poppins/700.css";
// import "@fontsource/poppins/900.css";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <DomainProvider>
          <RenderProvider>
            <CombinedProvider>
              <App />
            </CombinedProvider>
          </RenderProvider>
        </DomainProvider>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
