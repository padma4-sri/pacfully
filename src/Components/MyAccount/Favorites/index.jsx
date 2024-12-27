import "./styles.scss";
import { BackgroundBox, LineLoader, PageTitle } from 'Components/MyAccount/Common';
import ProductCard from 'Components/Productcard';
import { useEffect, useMemo, useState, useContext, useRef, memo } from "react";
import DomainContext from "Context/DomainContext";
import { useDispatch, useSelector } from "react-redux";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useLocation, useNavigate } from "react-router-dom";
import { SessionExpiredLogout } from "Utilities";
import { APIQueryPost } from "APIMethods/API";
import { ACTION_UPDATE__WISHLIST, ACTION_WISHLISTADDED__DATA, ACTION_WISHLIST_COUNT } from "Store/action";
import Seo from "Components/Seo/Seo";

const Favorites = () => {
  const { baseURL, storeId,expofitUrl } = useContext(DomainContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const APIRef = useRef(false);
  const [numCount, setNumCount] = useState(15);
  const [productsData, setProductsData] = useState([]);
  const [productsDataAll, setProductsDataAll] = useState([]);
  const [wishCount, setWishCount] = useState(0);
  const customerDetails = useSelector(state => state?.customerDetails);
  const isSessionExpired = useSelector((state) => state?.isSessionExpired);
  const token = useSelector(state => state?.token);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const updateWishList = useSelector((state) => state?.updateWishList);
  const [emptyData, setEmptyData] = useState(null);
  const wishlistCount = useSelector((state) => state?.wishlistCount);
  const customerId = useSelector((state) => state?.customerDetails?.id);

  // paginationHandler
  const paginationHandler = () => {
    setCurrentPage(currentPage + 1);
  };

  useMemo(() => {
    // pagination count
     let data = 15 * (currentPage);
    if (
      (currentPage === 1 ? 1 : currentPage + 1) &&
      wishCount >= data
    ) {
      setNumCount(data);
    } else if (
      wishCount >= 15 &&
      (currentPage === 1 ? 1 : currentPage + 1) > 0
    ) {
      setNumCount(wishCount);
    } else if (wishCount < 15) {
      setNumCount(wishCount);
    } else {
      setNumCount(15);
    }
  }, [productsData]);

  useMemo(() => {
    if (productsData?.length && !loading) {
      if (!productsDataAll?.length) {
        setProductsDataAll([...productsDataAll, ...productsData]);
      } else if (productsData?.[0]?.entityId && (productsDataAll?.[0]?.entityId !== productsData?.[0]?.entityId)) {
        setProductsDataAll([...productsDataAll, ...productsData]);
      }
    }
  }, [productsData]);


  const setListItems = (data) => {
    let x = data && Object.keys(data);
    let allDetails = [];
    const list = new Promise((resolve, reject) => {
      x?.forEach((value, index, array) => {
        allDetails.push({
          sku: value,
          itemId: data[value]
        })
        if (index === array.length - 1) resolve();
      });
    });
    list.then(() => {
      dispatch(ACTION_WISHLISTADDED__DATA(allDetails));
      dispatch(ACTION_WISHLIST_COUNT(allDetails?.length));
    });
  }

  const skuWishListOptions = {
    setGetResponseData: (resData) => {
      if (resData?.data?.length) {
        setListItems(resData?.data?.[0]);
      } else {
        dispatch(ACTION_WISHLISTADDED__DATA([]));
        dispatch(ACTION_WISHLIST_COUNT(0));
      }
    },
    axiosData: {
      url: `${baseURL}/wishlist/userListSku`,
      headers: { Authorization: `Bearer ${token}` },
      paramsData: {
        customerId: customerDetails?.id ? customerDetails?.id : null,
        storeId: storeId
      }
    },
    getStatus: (res) => {
      SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
    }
  };
  // get Wishlist
  const wishListOptions = {
    isLoader: true,
    loaderAction: (bool) => setLoading(bool),
    setGetResponseData: (resData) => {
      setEmptyData(resData?.data);
      setProductsData(resData?.data?.[0]?.products);
      setWishCount(resData?.data?.[0]?.count);
    },
    axiosData: {
      url: `${expofitUrl}/getwishlist`,
      headers: { Authorization: `Bearer ${token}` },
      paramsData: {
        customerId: customerDetails?.id ? customerDetails?.id : null,
        storeId: storeId,
        pageSize: 15,
        pageOffset: currentPage
      }
    },
    getStatus: (res) => {
      SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
    }
  }

  useEffect(() => {
    if (!APIRef.current) {
      APIQueryPost(skuWishListOptions);
      APIQueryPost(wishListOptions);
      APIRef.current = true;
      setTimeout(() => APIRef.current = false, 200);
    }
  }, [location, currentPage, updateWishList]);

  useMemo(() => {
    setProductsDataAll([]);
    setCurrentPage(1);
    setNumCount(15);
  }, [updateWishList])
  return (
    <>
      <Seo
        metaTitle={storeId === 1 ? "Favorieten | Promofit.nl" : "Favorieten Expofit.nl"}
        metaDescription="Favorieten"
        metaKeywords="Favorieten"
      />
      <div className='wishlist__page'>
        <div className='flex gap-6 col'>
          <div className="flex gap-y-6 gap-x-7 wrap">
            <BackgroundBox className='wishmain pt-6 pb-7 px-5 lg-pt-5 lg-px-8 lg-pb-8 flex-1 flex col space-between'>
              <div className="flex col pb-3">
                <PageTitle>Favorieten ({wishlistCount})</PageTitle>
                {productsData?.length === 0 ? (
                  <div className="wishlist__grid flex row wrap pt-1">
                    {["", "", "", "", "", "", "", ""].map((item, ind) => (
                      <div className="wishitem" key={`wishlistItemsLoad${ind + 1}`}>
                        <ProductCard
                          loading={loading}
                          key={`wishlist_product_loading_reults_${ind}`}
                        />
                      </div>
                    ))}
                  </div>
                ) : productsData?.length >0 ? (
                  <div className="wishlist__grid flex row wrap pt-1">
                    {productsData?.map((item, index) => (
                      <div className="wishitem" key={`wishlistItems${index + 1}`}>
                        <ProductCard
                          data={item}
                          key={`wishlist__data${index}`}
                          isWishList={true}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <></>
                )}
               
                {
                  emptyData?.[0]?.message ? <p className="tc fs-15">{emptyData?.[0]?.message}</p> : <></>
                }
              </div>
            </BackgroundBox>
          </div>
        </div>
      </div>
    </>
  )
};

export default memo(Favorites);