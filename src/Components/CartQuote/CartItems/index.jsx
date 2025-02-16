import React, {
  useState,
  useEffect,
  useRef,
  useContext,
} from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import { useSelector, useDispatch } from "react-redux";
import Img from "Components/Img";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { getCartItems, addWishList, SessionExpiredLogout, removeWishlist,handleImage } from "Utilities";
import { APIQueryPost } from "APIMethods/API";
import {
  ACTION_OPEN__LOGIN,
  ACTION_WISHLISTPRODUCTID,
  ACTION_OPEN__FORGOTPASSWORD,
  ACTION_GET__URLTYPE,
} from "Store/action";
import { useEffectOnce } from 'Components/Hooks/useEffectOnce';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Button from "Components/Common/Button";
import { SkeletonImg, SkeletonLine } from "Components/Skeletion";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import CircularProgress from '@mui/material/CircularProgress';
import { WishOutlineIcon, WishFullIcon } from "Res/icons/index";
import ProgressBar from "../../../Components/Product/ProductDetails/UploadImages/progressbar";

const InputUpload = ({uploadProgress, myRefs,deleteImageloader, handleDelete, handleSelectFile, item, loading, setLoading, onUpload }) => {
  const openFileInput = (myref) => {
    if (myref) {
      myref?.current?.click();
    }
  };
  const DeleteIcon = "/res/img/deleteIcon.svg";
  return (
    <div className="upload__imgage__section py-4">
      <input type="file"  ref={myRefs}
        accept="image/*,video/*, .pdf, application/postscript" // Added application/postscript for AI files
        className="v-hide upload__input"
        key={item?.itemId}
        onClick={(e) => e.target.value = null} // Clear the value on click
        onChange={(event) => {
          handleSelectFile(event, item);
        }}
        aria-label="file upload"
      />

      <div className="xxl-w-1/2">
        <Button className="w-1/1 sm r-9 px-2 py-4 pointer upload__btn fs-15 fw-700 uploadButton" onClick={() =>
          openFileInput(myRefs)}
        >
          {loading && onUpload == item?.itemId ? <CircularProgress size={24} thickness={4} color="error" /> : "Upload bestand(en)"}
        </Button>
      </div>
      {loading && onUpload && <div className="mui-pro-gress"> <ProgressBar value={uploadProgress}/>  </div> }
      <div>

        {item?.dropbox?.length && item.dropbox[0] !== "1" ? (
          <div className="py-4">
            <h2 className="fs-15 fw-700">Uw bestanden:</h2>
            {(() => {
              const aTagsArray = item?.dropbox?.[0]?.split(',').map(tag => tag.trim());
              return (
                aTagsArray?.map((aTag, index) => (
                  <div className="flex gap-3 w-1/1 py-2 img_title">
                    <div className="text-ellipse wrap-link"  dangerouslySetInnerHTML={{ __html: aTag, }}></div>
                    <span className="pointer relative"
                      onClick={() => handleDelete(index, item, aTagsArray)}
                    >
                      {deleteImageloader[index] ?
                        <CircularProgress size={18} thickness={4} style={{ color: 'black' }} />
                        :
                        <img src={DeleteIcon} />

                      }
                    </span>
                  </div>
                ))
              );
            })()}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  )
}
const ProductListing = ({ ind, item, navigate, dispatch,dropboxToken,dropboxAccessToken }) => {
  const {
    cartDetails,
    token,
    isLoggedUser,
    updateCartItems,
    guestKey,
    guestQuoteId,
    customerQuoteId,
    customerId,
    isSessionExpired,
    wishlistAddedData
  } = useSelector((state) => {
    return {
      cartDetails: state?.cartItems?.[0],
      token: state?.token,
      isLoggedUser: state?.isLoggedUser,
      updateCartItems: state?.updateCartItems,
      guestKey: state?.guestKey,
      guestQuoteId: state?.guestQuoteDetails?.id,
      customerQuoteId: state?.customerQuoteId,
      customerId: state?.customerDetails?.id,
      isSessionExpired: state?.isSessionExpired,
      wishlistAddedData: state?.wishlistAddedData,
    };
  });

  const { baseURL, storeId, defaultURL } = useContext(DomainContext);
  const closeIcon = "/res/img/closeIcon.svg";
  const [details, setDetails] = useState([]);

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [onUpload, setOnUpload] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingupdate, setLoadingUpdate] = useState(false);
  const [resMessage, setResMessage] = useState("");
  const [deleteImageloader, setDeleteImageLoader] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [wishisLoading , setwishIsLoading ] = useState(false)
  const myRefs = useRef(null);

  useEffect(() => {
    setTimeout(() => setResMessage(""), 5000);

  }, [resMessage])
 
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');

  const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;
//commented for purpose
  // const uploadFileToDropbox = async ({ file, path, access_token }) => {
  //   const fileNameParts = file?.name?.split('.');
  //   const extension = fileNameParts.pop(); // Get the extension
  //   const nameWithoutExtension = fileNameParts.join('.'); // Get the name without extension

  //   // Construct the new filename with the timestamp
  //   const newFileName = `${nameWithoutExtension}_${timestamp}.${extension}`;


  //   const url = `https://content.dropboxapi.com/2/files/upload`;
  //   const headers = {
  //     "Authorization": `Bearer ${access_token}`,
  //     "Content-Type": "application/octet-stream",
  //     "Dropbox-API-Arg": JSON.stringify({
  //       path: `${path}${newFileName}`,
  //       mode: "add",
  //       autorename: true,
  //       mute: false,
  //     }),
  //   }; 

  //   try {
  //     setUploadProgress(0)
  //   const response = await axios.post(url, file, {
  //     headers: headers,
  //     onUploadProgress: (progressEvent) => {
  //       const { loaded, total } = progressEvent;
  //       const progress = Math.floor((loaded * 100) / total);
  //       setUploadProgress(progress);
  //     },
  //   body: file,
  //   });
  //     const data = await response?.data;

  //     const response1 = await fetch(
  //       `https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${access_token}`,
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           path: data.path_display,
  //         }),
  //       }
  //     );
  //     let data1 = await response1.json();
  //     const errorData = data1?.error?.shared_link_already_exists?.metadata;
  //     if (errorData) data1 = errorData;
  //     return { url: data1.url, name: data1.name };
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };
  const uploadFileToDropbox = async ({ file, path, access_token }) => {
    if (!file || !path || !access_token) {
      console.error("File, path, or access_token is missing");
      return;
    }
  
    const fileNameParts = file?.name?.split('.');
    const extension = fileNameParts.pop(); // Get the extension
    const nameWithoutExtension = fileNameParts.join('.'); // Get the name without extension
  
    // Ensure timestamp is defined
    const timestamp = Date.now();
    const newFileName = `${nameWithoutExtension}_${timestamp}.${extension}`;
  
    const url = `https://content.dropboxapi.com/2/files/upload`;
    const headers = {
      "Authorization": `Bearer ${access_token}`,
      "Content-Type": "application/octet-stream",
      "Dropbox-API-Arg": JSON.stringify({
        path: `${path}${newFileName}`,
        mode: "add",
        autorename: true,
        mute: false,
      }),
    };
  
    try {
      setUploadProgress(0);
  
      const response = await axios.post(url, file, {
        headers: headers,
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const progress = Math.floor((loaded * 100) / total);
          setUploadProgress(progress);
        },
      });
  
      const data = response?.data;
      if (!data || !data.path_display) {
        throw new Error("File upload failed or path_display is undefined");
      }
  
      const response1 = await fetch(
        `https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: data.path_display,
          }),
        }
      );
  
      let data1 = await response1.json();
      const errorData = data1?.error?.shared_link_already_exists?.metadata;
      if (errorData) data1 = errorData;
  
      if (!data1 || !data1.url || !data1.name) {
        throw new Error("Failed to create or retrieve shared link");
      }
  
      return { url: data1.url, name: data1.name };
    } catch (err) {
      console.error("Error in uploadFileToDropbox:", err);
      throw err;
    }
  };
  
  

  const handleSelectFile = async (event, item) => {
    setOnUpload(item?.itemId)
    const fileName = event.target.files;
    const selectedFiles = [];

    for (let i = 0; i < fileName.length; i++) {
      const file = fileName[i];
      const newFileName = file?.name.includes(",")
        ? file?.name.replaceAll(",", "")
        : file?.name;
      const renamedFile = new File([file], newFileName, { type: file.type });
      selectedFiles.push(renamedFile);
    }
    if (selectedFiles?.length) {
      setLoading(true);
      let tempFilesList = []
      for (let i = 0; i < selectedFiles.length; i++) {
        tempFilesList = [...tempFilesList, selectedFiles[i]]
      }
      const response = await Promise.all(tempFilesList.map(async (file) =>
        await uploadFileToDropbox({ file, path: dropboxToken?.path, access_token: dropboxAccessToken })));
      // const response1 = response.filter((file) => !!file?.path)
      // const uploadedFilesList = Array.from([...files, ...response1]
      //   .reduce((m, o) => m.set(o?.path, o), new Map)
      //   .values()
      // );
      setLoading(true);
      if (response) {
        
        const newATagsArray = response.map((item) => {
          const updatedUrl = item?.url.replace("dl=0", "dl=1");
          return `<a target="_blank" href="${updatedUrl}">${item?.name}</a>`;
        });
        
        const aTagsArray1 = item?.dropbox?.length && item.dropbox[0] !== "1" ? item?.dropbox?.[0]?.split(',').map(tag => tag.trim()) : "";
        const mergedString = item?.dropbox?.length && item.dropbox[0] !== "1" ? aTagsArray1.join(', ') + ', ' + newATagsArray : "";

        const payload = {
          quoteId: customerQuoteId ? customerQuoteId : guestQuoteId,
          itemId: item?.itemId,
          additionalOptions: {
            dropbox: item?.dropbox?.length && item.dropbox[0] !== "1" 
              ? mergedString 
              : response
                  .map((item) => {
                    const updatedUrl = item?.url.replace("dl=0", "dl=1");
                    return `<a target="_blank" href="${updatedUrl}">${item?.name}</a>`;
                  })
                  .join(", "),
          },

        };
        axios.post(baseURL + `/cart/AdditionalOptions`, payload).then((res) => {
          if (res.status == 200) {
            setLoading(false)
            if (isLoggedUser) {
              getCartItems(
                dispatch,
                setLoading,
                customerQuoteId,
                customerId,
                () => { },
                defaultURL,
                storeId,
                token, navigate, isSessionExpired
              );
            } else {
              getCartItems(
                dispatch,
                setLoading,
                guestQuoteId,
                "",
                () => { },
                defaultURL,
                storeId,
                token, navigate, isSessionExpired

              );
            }
          }
        });
      }
    }
  };
  const handleDelete = (index, item, aTagsArray) => {
    if (myRefs.current) {
      myRefs.current.value = null;
    }
    const newAtag = aTagsArray?.length ? aTagsArray.filter((tag, ind) => ind !== index) : null;
    const updatedString = newAtag.join(', ');
    const payload = {
      quoteId: customerQuoteId ? customerQuoteId : guestQuoteId,
      itemId: item?.itemId,
      additionalOptions: {
        dropbox: updatedString ? updatedString : "1",
      },
    };

    const deleteCart = {
      setGetResponseData: (res) => {
        if (res.status == 200) {
          if (isLoggedUser) {
            getCartItems(
              dispatch,
              () => { setDeleteImageLoader(prevState => ({ ...prevState, [index]: false }))  },
              customerQuoteId,
              customerId,
              () => { },
              defaultURL,
              storeId,
              token, navigate, isSessionExpired

            );
          } else {
            getCartItems(
              dispatch,
              () => { setDeleteImageLoader(prevState => ({ ...prevState, [index]: false }))  },
              guestQuoteId,
              "",
              () => { },
              defaultURL,
              storeId,
              token, navigate, isSessionExpired

            );
          }
        }
      },
      isLoader: true,
       loaderAction : (bool) => {
        setDeleteImageLoader(prevState => ({ ...prevState, [index]: true }));
       
    },
    
      getStatus: (res) => {
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      },
      axiosData: {
        url: `${baseURL}/cart/AdditionalOptions`,
        paramsData: payload,
      },
    };
    APIQueryPost(deleteCart);
  };

  function handleItemClick(index) {
    if (details.includes(index)) {
      setDetails((prevItems) => prevItems.filter((item) => item !== index));
    } else {
      setDetails((prevItems) => [...prevItems, index]);
    }
  }



  const deleteItem = async (item) => {
    setLoadingDelete(true)
    if (isLoggedUser) {
      axios
        .delete(defaultURL + `/carts/mine/items/${item?.itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {

          if (res.status == 200) {
            if(res?.data[0]?.code ==400){
              setResMessage(res?.data[0]?.message)
            }
            setLoadingDelete(false)
            getCartItems(
              dispatch,
              setLoadingDelete,
              customerQuoteId,
              customerId,
              () => { },
              defaultURL,
              storeId,
              token, navigate, isSessionExpired

            );
          }
        });
    } else {
      axios
        .delete(
          defaultURL + `/guest-carts/${guestKey}/items/${item?.itemId}`,
          {
            headers: {
              Authorization: `Bearer ${guestKey}`,
            },
          }
        )
        .then((res) => {
        
          if (res.status == 200) {
            if(res?.data[0]?.code ==400){
              setResMessage(res?.data[0]?.message)
            }
            setLoadingDelete(false)
            getCartItems(
              dispatch,
              setLoadingDelete,
              guestQuoteId,
              "",
              () => { },
              defaultURL,
              storeId,
              token, navigate, isSessionExpired
            );
          }
        });
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const removeHandler = (data) => {
    setwishIsLoading(true); 
    const wishItem = wishlistAddedData?.filter(obj => obj?.sku === data?.parentSku);
    removeWishlist(
      baseURL,
      token,
      dispatch,
      wishItem?.[0]?.itemId,
      data?.parentSku,
      wishlistAddedData,
      customerId,
      storeId,
      () => {
        setwishIsLoading(false); 
      },
      navigate,
      isSessionExpired
    );
  };
  

  const InputField = ({ item, ind, setLoadingUpdate, setResMessage }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [quantity, setQuantity] = useState({
      item: "",
      quantity: item?.qty,
      delay: false,
    });
    const [editquantity, setEditquantity] = useState({
      id: "",
      status: false,
    });
    const handleEditquantity = (id) => {
      setEditquantity({
        id,
        status: true,
      });
    };

    const updateQtyValue = async (index, item, qty, delay) => {
      setIsLoading(true);
      setQuantity({ item, quantity: qty, delay });
      if (qty === "" || qty > -1) {
        const tempItems = [...cartDetails?.totals_detail?.items];
        tempItems[index] = { ...tempItems[index], qty };
        setQuantity({ item, quantity: qty, delay });
      }
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
    };
    const updateCartCount = () => {
      const updateCart = {
        setGetResponseData: (resData) => {
          if (resData?.status == 200) {
            if (quantity?.item?.minSaleQty > quantity?.quantity) {
              setResMessage(`Het ingevoerde aantal is onder het minimum bestelaantal.`)
            }
            else if(resData?.data[0]?.code ==400){
              setResMessage(resData?.data[0]?.message)
            }
            if (isLoggedUser) {
              getCartItems(
                dispatch,
                setLoadingCart,
                customerQuoteId,
                customerId,
                () => { },
                defaultURL,
                storeId,
                token, navigate, isSessionExpired
              );

            } 
            else {
              getCartItems(
                dispatch,

                setLoadingCart,
                guestQuoteId,
                "",
                () => { },
                defaultURL,
                storeId,
                token, navigate, isSessionExpired

              );
            }
          }
          if (resData?.data[0]?.code == 400) {
            setResMessage(resData?.data[0]?.message)
          }
        },
        isLoader: true,
        loaderAction: (bool) => setLoadingUpdate(bool),
        getStatus: (res) => {
          SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
        },
        axiosData: {
          url: `${defaultURL}/cart/updateitem`,
          paramsData: {
            data: {
              storeId: storeId,
              quote_id: customerQuoteId ? customerQuoteId : guestQuoteId,
              item_id: quantity?.item?.itemId,
              qty:
                quantity?.item?.minSaleQty > quantity?.quantity
                  ? quantity.item?.minSaleQty
                  : quantity?.quantity,
              maxSaleQty: quantity?.item?.maxSaleQty,
              qty_increments:item?.qty_increments
            },
          },
        },
      };
      // API
      if (quantity?.item?.itemId) {
        APIQueryPost(updateCart);
      }
    };
    useEffect(() => {
      if (quantity?.quantity !== "") {
        const temp = setTimeout(
          () => updateCartCount(updateCartItems),
          quantity.delay ? 1000 : 0
        );
        return () => clearTimeout(temp);
      }
    }, [quantity]);
    return (
      <div className="input__container flex center">
        {item?.productId == "311373" ?
          "" :
          <button
          aria-label="button"
            onClick={() =>
              updateQtyValue(ind, item, item?.status_qty_increments ? item?.qty - item?.qty_increments : item?.qty - 1, false)
            }
            disabled={isLoading || item?.minSaleQty > item?.qty - 1 || item?.productId == "311373"}
          >
            -
          </button>
        }

        <input
          type="number"
          aria-label="number"
          value={
            editquantity.status &&
              editquantity.id == item?.itemId
              ?
              quantity?.quantity
              : item?.qty
          }
          onChange={(e) =>{
            let value = e.target.value;                               
            if (!isNaN(value)) {
              value = value.slice(0, 6); 
            updateQtyValue(ind, item,value, true)
            }
          } 
          }
          onClick={() => handleEditquantity(item?.itemId)}
          onBlur={() =>
            setQuantity((prevState) => ({
              ...prevState,
              quantity:
                item?.minSaleQty > quantity?.quantity && quantity?.quantity
                  ? item?.minSaleQty :
                  item?.minSaleQty < quantity?.quantity && quantity?.quantity
                    ? quantity?.quantity :
                    item?.qty,
            }))
          }
          onFocus={() =>
            setQuantity((prevState) => ({
              ...prevState,
              quantity: "",
            }))
          }
         
          disabled={item?.productId == "311373"}
          className="fs-16"
        />
        {item?.productId == "311373" ? "" :
          <button
            aria-label="button"
            disabled={isLoading || item?.productId == "311373"}
            onClick={() =>
              updateQtyValue(ind, item, item?.status_qty_increments ? item?.qty + item?.qty_increments : item?.qty + 1, false)
            }
          >
            +
          </button>

        }

      </div>
    )
  }


  return (
    <div className="cart__details__parent w-1/1 py-6 relative" key={`cart__details__parent${ind}`} >
      <div className="gap-4 xl-flex xl-gap-6 flex">
        <div className="product__img relative flex">
          <a
            className={`${item?.productId == "311373" ? "Cauto" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              if (item?.productId !== "311373") {

                if (item?.pdpUrl) {
                  if (item.pdpUrl.includes('http') || item.pdpUrl.includes('www')) {
                    const { pathname, search } = new URL(item?.pdpUrl);
                    let pathWithQuery = pathname + search;
                    const parsedUrl = new URL(item?.pdpUrl);
                    const queryParams = parsedUrl.searchParams;

                    queryParams.set('qty', item?.qty);

                    pathWithQuery = parsedUrl.pathname + '?' + queryParams.toString();

                    const uploadedArry = item?.dropbox?.[0]?.split(',').map(tag => tag.trim());
                    const pathList = [];
                    uploadedArry?.length && uploadedArry.map((txt) => {
                      const element = new DOMParser()?.parseFromString(txt, 'text/html')?.getElementsByTagName("a")[0]?.attributes;
                      if (element?.path?.value)
                        pathList.push(element.path.value)
                      return null
                    });
                    const url1 = pathWithQuery.replace(/\+/g, '%20');
                    const url2 = url1.replaceAll("%3A", ':');
                    const url = url2.replaceAll("%2C", ',');
                    if (pathList.length) navigate(`${url}`, { state: { uploadData: pathList } });
                    else navigate(`${url}`);
                    scrollToTop();
                  }
                  else {
                    const newUrl = `/${item.pdpUrl}`;
                    navigate(newUrl);
                    scrollToTop();
                  }
                }
              }
            }}
          >
            <Img src={handleImage(item?.image)} />
          </a>

        </div>
        <div className="flex flex-2 col gap-1 social__detail top">
          <a
            className={`${item?.productId == "311373" ? "Cauto" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              if (item?.productId !== "311373") {
                if (item?.pdpUrl) {
                  if (item.pdpUrl.includes('http') || item.pdpUrl.includes('www')) {
                    const { pathname, search } = new URL(item?.pdpUrl);
                    let pathWithQuery = pathname + search;
                    const parsedUrl = new URL(item?.pdpUrl);
                    const queryParams = parsedUrl.searchParams;

                    queryParams.set('qty', item?.qty);

                    pathWithQuery = parsedUrl.pathname + '?' + queryParams.toString();

                    const uploadedArry = item?.dropbox?.[0]?.split(',').map(tag => tag.trim());
                    const pathList = [];
                    uploadedArry?.length && uploadedArry.map((txt) => {
                      const element = new DOMParser()?.parseFromString(txt, 'text/html')?.getElementsByTagName("a")[0]?.attributes;
                      if (element?.path?.value)
                        pathList.push(element.path.value)
                      return null
                    });
                    const url1 = pathWithQuery.replace(/\+/g, '%20');
                    const url2 = url1.replaceAll("%3A", ':');
                    const url = url2.replaceAll("%2C", ',');
                    if (pathList.length) navigate(`${url}`, { state: { uploadData: pathList } });
                    else navigate(`${url}`);
                    scrollToTop();
                  }
                  else {
                    const newUrl = `/${item.pdpUrl}`;
                    navigate(newUrl);
                    scrollToTop();
                  }
                }
              }

            }}
          >
            <h3 className="fw-700 fs-16 productname">
              {item?.productName}
            </h3>
          </a>
          <div className="pt-3 fs-14 mobile_view_Artikelnummer">
            <span>Artikelnummer: </span>
            <span>{item?.sku}</span>
          </div>
          <div className="details__block flex col left w-1/1">
            {item?.options?.length || item?.additionalOptions?.length ?
              <>
                {cartDetails?.totals_detail?.isSample == 1 ?
                  <div className="flex w-1/1">
                    <div className="flex-1 py-2">
                      {details.includes(ind) ? (
                        <div className="cart__details__options">
                          <table className="py-1 fs-14 w-1/1 line-6">
                            {item?.options?.map((option, ind) => (
                              option.label === "Kleur" && (
                                <tr className="flex">
                                  <td className="w-1/2">
                                    <div className="text__ellipse">
                                      {option?.label}
                                    </div>
                                  </td>
                                  <td className="w-1/2">
                                    <div className="text__ellipse">
                                      {option?.value}
                                    </div>
                                  </td>
                                </tr>
                              )
                            ))}
                          </table>
                        </div>
                      ) : (
                        ""
                      )}
                      <button
                        onClick={() => handleItemClick(ind)}
                        className="fs-14 text-underline flex gap-1 fw-300"
                        aria-label="button"
                      >
                        {details.includes(ind)
                          ? "Verberg details"
                          : "Bekijk details"}
                        <span className="flex middle up__arrow">
                          {details.includes(ind) ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                  :
                  <div className="flex w-1/1">
                    <div className="flex-1 py-2">
                      {details.includes(ind) ? (
                        <div className="cart__details__options">
                          <table className="py-1 fs-14 w-1/1 line-6">
                            {item?.options?.map((option, ind) => (
                              <tr className="flex">
                                <td className="w-1/2">
                                  <div className="text__ellipse">
                                    {option?.label}
                                  </div>
                                </td>
                                <td className="w-1/2">
                                  <div className={`${option?.label=="Toelichting ontwerp"?"":"text__ellipse"}`}>
                                    {option?.value}
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {item?.additionalOptions.length
                              ? item?.additionalOptions?.map(
                                (option, ind) => (
                                  <tr className="flex">
                                    <td className="w-1/2">
                                      <div className="text__ellipse">
                                        {option?.label}
                                      </div>
                                    </td>
                                    <td className="w-1/2">
                                      <div className="text__ellipse">
                                        {option?.value}
                                      </div>
                                    </td>
                                  </tr>
                                )
                              )
                              : ""}
                            {item?.dropbox?.length && item.dropbox[0] === "1" ?
                              <tr className="flex">
                                <td className="w-1/2">
                                  <div className="text__ellipse">
                                    Bestand(en)
                                  </div>
                                </td>
                                <td className="w-1/2">
                                  <div className="text__ellipse">
                                    Ik lever het ontwerp later aan
                                  </div>
                                </td>
                              </tr>
                              : ""
                            }
                          </table>
                        </div>
                      ) : (
                        ""
                      )}
                      <button
                        onClick={() => handleItemClick(ind)}
                        className="fs-14 text-underline flex gap-1 fw-300"
                        aria-label="button"
                      >
                        {details.includes(ind)
                          ? "Verberg details"
                          : "Bekijk details"}
                        <span className="flex middle up__arrow">
                          {details.includes(ind) ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                }
              </>
              : ""
            }
            {cartDetails?.totals_detail?.isSample == 1 || item?.dropbox?.length == 0 ? "" :
              <InputUpload myRefs={myRefs} uploadProgress={uploadProgress}onUpload={onUpload} deleteImageloader={deleteImageloader} handleDelete={handleDelete} handleSelectFile={handleSelectFile} loading={loading} setLoading={setLoading} item={item} />
            }
            <div className="flex space-between xl-pt-4 pt-2">
              <div className="flex middle sm-flex sm-gap-4 gap-2">
                {cartDetails?.totals_detail?.isSample == 1 ? "" :
                  loadingCart ?
                    <div className={`${loadingCart?"rotateUpdate":""} input__container_loader flex center middle`}>
                        <AutorenewIcon />
                    </div> :
                    loadingupdate ?
                      <div className={`${loadingupdate ? "rotateUpdate" : ""} input__container_loader flex center middle`}>
                        <AutorenewIcon />
                      </div> :
                      <InputField item={item} ind={ind} setLoadingUpdate={setLoadingUpdate} setResMessage={setResMessage} />
                }
                <div>
                  <span className="fs-15">
                    {item?.unitPrice} per stuk
                  </span>
                </div>
              </div>
              <div className="hide__mobile">
                <p className="fw-700 fs-30 text-nowrap">{item?.totalPrice}</p>
              </div>
            </div>
            {resMessage ?
              <p className="error pt-2">{resMessage}</p> : ""
            }
          </div>
        </div>
        {/* condition is implemented for the paticular product ids */}
        {item?.productId == "311373" ?
          "" :
          <div className="icon__block absolute right-0 flex col gap-4 xl-flex xl-row-i middle">
            {loadingDelete ?
              <div className={`${loadingDelete ? "rotateUpdate" : ""} relative`}>
                <AutorenewIcon />
              </div>
              :
              <div
                className="pointer relative"
                onClick={() => {
                  deleteItem(item);
                }}
              >
                <Img src={closeIcon} className="pointer" />
              </div>
            }
            <div
              className="pointer relative"
            >
           
 {wishlistAddedData?.some(obj => obj?.sku === item?.parentSku) ? (
  wishisLoading ? (
    <AutorenewIcon className="loading-icon" />
  ) : (
    <WishFullIcon onClick={() => removeHandler(item)} />
  )
) : (
  wishisLoading ? (
    <AutorenewIcon className="loading-icon" />
  ) : (
    <WishOutlineIcon
      onClick={() => {
        if (!isLoggedUser) {
          dispatch(ACTION_OPEN__FORGOTPASSWORD(false));
          dispatch(ACTION_OPEN__LOGIN(true));
          dispatch(ACTION_WISHLISTPRODUCTID({ id: item?.productId, sku: item?.sku }));
          dispatch(ACTION_GET__URLTYPE("cart"));
        } else if (!wishlistAddedData?.some(obj => obj?.sku === item?.parentSku)) {
          setwishIsLoading(true);
          addWishList(
            defaultURL,
            dispatch,
            token,
            customerId,
            { id: item?.productId, sku: item?.parentSku },
            wishlistAddedData,
            storeId,
            navigate,
            isSessionExpired,
            () => {
              setwishIsLoading(false); 
            }
          );
        }
      }}
      className="pointer"
      style={{ color: "#656565" }}
    />
  )
)}


            </div>
          </div>
        }
      </div>
      <div className="flex right pt-2 xl-hide">
        <p className="fw-700 fs-30">{item?.totalPrice}</p>
      </div>
    </div>
  )
}
function CartItems() {
  const {
    cartDetails,
    cartDetail,
    token,
    isLoggedUser,
    guestQuoteId,
    customerQuoteId,
    customerId,
    isSessionExpired
  } = useSelector((state) => {
    return {
      cartDetails: state?.cartItems?.[0],
      cartDetail: state?.cartItems,
      token: state?.token,
      isLoggedUser: state?.isLoggedUser,
      updateCartItems: state?.updateCartItems,
      guestKey: state?.guestKey,
      guestQuoteId: state?.guestQuoteDetails?.id,
      customerQuoteId: state?.customerQuoteId,
      customerId: state?.customerDetails?.id,
      isSessionExpired: state?.isSessionExpired,
      wishlistAddedData: state?.wishlistAddedData,
    };
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { storeId, defaultURL } = useContext(DomainContext);
  const [dropboxToken, setDropboxToken] = useState(null);
  const [dropboxAccessToken, setDropboxAccessToken] = useState();
  useEffectOnce(()=>{
    if (isLoggedUser && customerQuoteId) {
      getCartItems(
        dispatch,
        () => { },
        customerQuoteId,
        customerId,
        () => { },
        defaultURL,
        storeId,
        token, navigate, isSessionExpired
      );
    } else if(!isLoggedUser) {
      getCartItems(
        dispatch,
        () => { },
        guestQuoteId,
        "",
        () => { },
        defaultURL,
        storeId,
        token, navigate, isSessionExpired
      );
    }
   
  });
  useEffect(() => {
    setDropboxToken({
      refreshToken: cartDetails?.totals_detail?.dropboxRefreshToken,
      client_id: cartDetails?.totals_detail?.dropboxClientId,
      client_secret: cartDetails?.totals_detail?.dropboxClientSecretId,
      path: cartDetails?.totals_detail?.dropboxPath,
    });
  }, [cartDetails]);
  useEffect(() => {
    const getDropBoxToken = async () => {
      const accessToken = await generateDropboxAccessToken(dropboxToken);
      setDropboxAccessToken(accessToken);
    };
    if (dropboxToken) {
      getDropBoxToken();
    }
  }, [dropboxToken]);
  const generateDropboxAccessToken = async ({
    refreshToken,
    client_id,
    client_secret,
  }) => {
    const response = await fetch(
      `https://api.dropboxapi.com/oauth2/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${client_id}&client_secret=${client_secret}&scope=files.content.read files.content.write sharing.write sharing.read file_requests.write file_requests.read`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        mode: "cors",
      }
    );
    const data = await response.json();
    return data.access_token;
  };
  return (
    <>
      {
        cartDetails?.totals_detail?.message ?
          <>
            <p className="fs-14 py-4">Your shopping cart is empty.</p>

            <p className="fs-14 pt-4 flex">
              <Link
                to="/"
                aria-label={"home"}
                className="text-underline"
              >
                Click here
              </Link>
              &nbsp;<span className="fs-15  line-6 middle">
              to go to the homepage
              </span>
            </p>
          </>
          :
          cartDetails?.totals_detail?.items?.length ? cartDetails?.totals_detail?.items?.map((item, ind) => (
            <ProductListing dropboxAccessToken={dropboxAccessToken} dropboxToken={dropboxToken} ind={ind} item={item} navigate={navigate} dispatch={dispatch} />

          )) : (
            ["", "", ""]?.map((item, ind) => (
              <div
                className="cart__details__parent   w-1/1 py-6  relative"
                key={ind}
              >
                <div className="gap-4 xl-flex xl-gap-6 flex">
                  <div className="product__img relative flex">
                    <a>
                      <SkeletonImg src={item?.image} />
                    </a>
                  </div>
                  <div className="flex flex-2 col gap-1 social__detail top">
                    <h3 className="fw-700 fs-16 productname">
                      <SkeletonLine width="80%" height="30px" />
                    </h3>
                    <div className="details__block flex col left w-1/1">
                      <div className="flex w-1/1">
                        <div className="flex-1 py-2">
                          <SkeletonLine width="80%" height="30px" />
                        </div>
                      </div>
                    </div>
                    <div className="details__block flex col left w-1/1">
                      <div className="flex w-1/1">
                        <div className="flex-1 py-2">
                          <SkeletonLine width="80%" height="30px" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )
      }
    </>
  );
}

export default CartItems;