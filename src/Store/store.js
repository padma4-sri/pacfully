import { createStore, applyMiddleware } from "redux";
import reducer from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from "redux-thunk";
import { createStateSyncMiddleware, initStateWithPrevTab } from "redux-state-sync";
import { PERSIST, PURGE } from 'redux-persist/es/constants';
import { HEADERFOOTER__LOADING, HOMEPAGE__LOADING, UPDATE__CARTITEMS, FETCH__HEADERFOOTER, OPENCART, OPEN__LOGIN } from "./action-type";
import { initailState } from "./reducer";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
   "succesToken","recentProducts","addressShipping", "addressDefault", "isLoggedUser", "customerQuoteId", "token", "customerDetails", "wilistProductId", "guestKey", "guestQuoteDetails", "adminToken",
    "recentProductSku","cookieValue","translateData","productDetailsStaticData","selectedshipping","selectedbilling"
  ]
}

const config = {
  blacklist: [PERSIST, PURGE, HOMEPAGE__LOADING, HEADERFOOTER__LOADING, UPDATE__CARTITEMS, FETCH__HEADERFOOTER, OPENCART, OPEN__LOGIN]
};
const middlewares = [
  createStateSyncMiddleware(config),
  thunk
]
const persistedReducer = persistReducer(persistConfig, reducer);

export const store = createStore(persistedReducer, initailState, composeWithDevTools(applyMiddleware(...middlewares)));

initStateWithPrevTab(store);

export const persister = persistStore(store);