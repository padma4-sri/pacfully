import React, { useRef, useState, useContext, memo, useEffect } from 'react';
import DomainContext from "Context/DomainContext";
import TopHeader from './TopHeader';
import BottomHeader from './BottomHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import InitialFunctions from 'InitialFunctions';
import Search from "./Search/Search";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { ACTION_GET__URLTYPE,ACTION_RECENT_VIEW,ACTION__CMS__COLOR } from 'Store/action';
import {getRecentProducts} from "Utilities";
import { useEffectOnce } from 'Components/Hooks/useEffectOnce';
import { APIQueryGet } from "APIMethods/API";

const Header = () => {
  const dispatch = useDispatch();
  const { baseURL, storeId, defaultURL } = useContext(DomainContext);
  InitialFunctions(baseURL, storeId, defaultURL);
  const getUrlType = useSelector((state) => state?.getUrlType);
  const location = useLocation();
  const pathName = location?.pathname?.split('/')?.[1];
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const recentProducts = useSelector(state => state?.recentProducts);
  const recentProductSku = useSelector((state) => state?.recentProductSku);
  
  const handlesetsearchkeyword = async (e) => {
    setIsChanged(true);
    setSearchKeyword(e.target.value);
    if (e.target.value.length > 2) {
      setLoadingSearch(true);
      searchHandle(e.target.value);
    }
  };
  const searchHandle = async (value) => {
    try {
      const payload = {
        keyword: searchKeyword,
        storeId: storeId,
      };
      if (searchKeyword.length > 2 && isChanged) {
        setShowSuggestion(true);
        const resp = await axios.post(defaultURL + "/searchresult", payload);
        setSearchData(resp?.data?.[0] ? resp.data[0] : null);
        setLoadingSearch(false);
      }
    } catch (err) {
      setLoadingSearch(false);
    }

  }
  const searchResultHandler = () => {
    setShowSuggestion(false);
    if (searchKeyword.trim() !== "") {
      let val = searchKeyword.trim();

      const encodedKeyword = encodeURIComponent(val);
      navigate(`/zoeken/zoekterm=${encodedKeyword}`, {
        state: {
          isSearchResult: true,
          value: encodedKeyword
        },
      });
    }
  };

  const subMenuList = ["Snelle service", "Laagste prijsgarantie", "Gratis ontwerp", "Veilig betalen"];
  const kiyoh = { name: "Kiyoh", rating: "9.4", logo: "/res/img/kiyoh-logo.png" }
  const thuiswinkel = { logo: "/res/img/thuiswinkel.png" }

  useEffect(() => {
    const timeoutId = setTimeout(() => searchHandle(), 1000);
    return () => {
      clearTimeout(timeoutId);
      setIsChanged(false);
    }
  }, [searchKeyword]);

  useEffect(() => {
    if (getUrlType) {
      dispatch(ACTION_GET__URLTYPE(""));
    }
  }, [location]);
  
  useEffectOnce(()=>{
    const checkInterval = 24 * 60 * 60 * 1000; 
    const lastExecutionKey = 'lastEffectExecutionTime';

    const now = Date.now();
    const lastExecutionTime = localStorage.getItem(lastExecutionKey);

    const fetchProducts = () => {
      let index = 0;
      const fetchNextProduct = () => {
        if (index < recentProductSku.length) {
          getRecentProducts(dispatch, recentProductSku[index], baseURL, storeId, recentProducts);
          index++;
          setTimeout(fetchNextProduct, 2 * 60 * 1000); 
        }
      };
      fetchNextProduct();
    };

    if (!lastExecutionTime || now - parseInt(lastExecutionTime, 10) >= checkInterval) {
      fetchProducts();
      localStorage.setItem(lastExecutionKey, now);
      const intervalId = setInterval(() => {
    dispatch(ACTION_RECENT_VIEW([]));
        fetchProducts();
        localStorage.setItem(lastExecutionKey, Date.now());
      }, checkInterval);
      return () => clearInterval(intervalId);
    } 
  });

 

 
  return (
    <React.Fragment>
      {
        pathName !== "checkout" ?
          <>
            <TopHeader
              isFocused={isFocused} setIsFocused={setIsFocused}
              handlesetsearchkeyword={handlesetsearchkeyword} searchResultHandler={searchResultHandler}
              inputRef={inputRef} searchKeyword={searchKeyword} setSearchKeyword={setSearchKeyword}
              showSuggestion={showSuggestion} setShowSuggestion={setShowSuggestion}
              setOpenSearch={setOpenSearch} openSearch={openSearch} searchData={searchData}
              loadingSearch={loadingSearch}
            />
            {
              !openSearch ?
                <Search
                  className="item-2 flex lg-hide relative pb-4"
                  isFocused={isFocused} setIsFocused={setIsFocused} handlesetsearchkeyword={handlesetsearchkeyword}
                  searchResultHandler={searchResultHandler} inputRef={inputRef} searchKeyword={searchKeyword}
                  showSuggestion={showSuggestion} setShowSuggestion={setShowSuggestion} setOpenSearch={setOpenSearch}
                  loadingSearch={loadingSearch} searchData={searchData} openSearch={openSearch}
                />
                : null
            }
            <BottomHeader data={{ subMenuList: subMenuList, kiyoh: kiyoh, thuiswinkel: thuiswinkel }} isCheckout={false} />
          </>
          :
          <BottomHeader data={{ subMenuList: subMenuList, kiyoh: kiyoh, thuiswinkel: thuiswinkel }} isCheckout={true} />
      }
    </React.Fragment>
  )
}

export default memo(Header);