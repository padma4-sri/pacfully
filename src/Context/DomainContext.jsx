import React, { createContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const prodUrl = process.env.REACT_APP_PROD_BACKEND_URL;
export const prodDefault = process.env.REACT_APP_PROD_SERVER_BASE_URL_DEFAULT;
export const prodExpofitUrl = process.env.REACT_APP_PROD_EXPOFIT_BACKEND_URL;
export const prodExpofitDefault = process.env.REACT_APP_PROD_EXPOFIT_SERVER_BASE_URL_DEFAULT;

export const uatUrl = process.env.REACT_APP_UAT_BACKEND_URL;
export const uatDefault = process.env.REACT_APP_UAT_SERVER_BASE_URL_DEFAULT;
export const uatExpofitUrl = process.env.REACT_APP_UAT_EXPOFIT_BACKEND_URL;
export const uatExpofitDefault = process.env.REACT_APP_UAT_EXPOFIT_SERVER_BASE_URL_DEFAULT;

export const stageUrl = process.env.REACT_APP_STAGE_BACKEND_URL;
export const stageDefault = process.env.REACT_APP_STAGE_SERVER_BASE_URL_DEFAULT;
export const stageExpoUrl = process.env.REACT_APP_STAGE_EXPOFIT_BACKEND_URL;
export const stageExpoDefault = process.env.REACT_APP_STAGE_EXPOFIT_SERVER_BASE_URL_DEFAULT;

export const liveUrl = process.env.REACT_APP_LIVE_BACKEND_URL;
export const liveDefault = process.env.REACT_APP_LIVE_SERVER_BASE_URL_DEFAULT;
export const liveExpoUrl = process.env.REACT_APP_LIVE_EXPOFIT_BACKEND_URL;
export const liveExpoDefault = process.env.REACT_APP_LIVE_EXPOFIT_SERVER_BASE_URL_DEFAULT;


export const ProductionUrl = process.env.REACT_APP_PRODUCTION_BACKEND_URL;
export const ProductionDefault = process.env.REACT_APP_PRODUCTION_SERVER_BASE_URL_DEFAULT;
export const ProductionExpoUrl = process.env.REACT_APP_PRODUCTION_EXPOFIT_BACKEND_URL;
export const ProductionExpoDefault = process.env.REACT_APP_PRODUCTION_EXPOFIT_SERVER_BASE_URL_DEFAULT;

export const mageUrl = process.env.REACT_APP_MAGE_BACKEND_URL;
export const mageDefault = process.env.REACT_APP_MAGE_SERVER_BASE_URL_DEFAULT;

export const locServer = process.env.REACT_APP_LOCAL_SERVER;
export const locStore = process.env.REACT_APP_LOCAL_STORE;
export const locProTit = process.env.REACT_APP_PROMOFIT_TITLE
export const locProDes = process.env.REACT_APP_PROMOFIT_DESCRIPTION
export const locProFav = process.env.REACT_APP_PROMOFIT_FAVICON
export const locProMan = process.env.REACT_APP_PROMOFIT_MANIFEST
export const locExpTit = process.env.REACT_APP_EXPOFIT_TITLE
export const locExpDes = process.env.REACT_APP_EXPOFIT_DESCRIPTION
export const locExpFav = process.env.REACT_APP_EXPOFIT_FAVICON
export const locExpMan = process.env.REACT_APP_EXPOFIT_MANIFEST
const DomainContext = createContext({});
export const DomainProvider = ({ children }) => {
    const decode = (t) => atob(t);

    const [tokenSingle, setTokenSingle] = useState("");
    const [EnvObj, setEnvObj] = useState({baseUrl: "", defaultURL: ""});
    const [storeId, setStoreId] = useState(0);
    const [categoriesId, setCategoriesId] = useState(2);
    const [baseURL, setBaseURL] = useState("");
    const [expofitUrl, setExpofitUrl] = useState("");
    const [defaultURL, setDefaultURL] = useState("");
    useEffect(() => {
        const htmlTag  = document.getElementsByTagName("html").item(0);
        if(storeId && EnvObj.baseUrl){
            setBaseURL(`${EnvObj.baseUrl}/V1`);
            setExpofitUrl(`${EnvObj.baseUrl}/${storeId === 1 ? `V1` : `expofit/V1`}`)
            setDefaultURL(`${EnvObj.defaultURL}/${storeId === 1 ? `default/V1` : `expofit/V1`}`)
            htmlTag.classList.add(`${storeId === 1 ? `promofit` : `expofit`}`);
        }
        setCategoriesId(storeId === 1 ? 2 : 21365)
        return () => htmlTag.classList.remove(`${storeId === 1 ? `promofit` : `expofit`}`);
    }, [storeId, EnvObj])
    const getHeaderData = useSelector((state) => state?.getHeaderFooterData?.data?.header);
    useEffect(() => {
        if(storeId > 0) {
            const meta = storeId === 1 ? {
                tit: locProTit,
                des: locProDes,
                fav: locProFav,
                man: locProMan
            } : {
                tit: locExpTit,
                des: locExpDes,
                fav: locExpFav,
                man: locExpMan
            }
            // commented for purpose
            // const fav = document.getElementById('fav-link'),
            //     man = document.getElementById('man-link'),
            //     tit = document.getElementById('meta-title'),
            //     dec = document.getElementById('meta-description');
            // man.href = meta.man;
            // fav.href = getHeaderData?.favIcon? getHeaderData?.favIcon : meta.fav;

            const expofit = "/favicon-expofit.ico";
            const promofit = "/favicon-promofit.ico";
            const header = document.getElementById('header');

            //commented for purpose
            // if(getHeaderData?.favIcon){

            //     // Create and append fav icon link element
            //     const favLink = document.createElement('link');
            //     favLink.rel = 'icon';
            //     favLink.href = getHeaderData?.favIcon ? getHeaderData.favIcon : meta.fav;
            //     header.appendChild(favLink);

            //     // Create and append manifest link element
            //     const manLink = document.createElement('link');
            //     manLink.rel = 'manifest';
            //     manLink.href = meta.man;
            //     header.appendChild(manLink);
               
            // }

            if (header) {
                // Determine favicon based on storeId
                const favIconPath = storeId === 1 ? promofit : expofit;
            
                // Create and append fav icon link element
                const favLink = document.createElement('link');
                favLink.rel = 'icon';
                favLink.href = favIconPath;
                header.appendChild(favLink);
            
                // Create and append manifest link element
                const manLink = document.createElement('link');
                manLink.rel = 'manifest';
                manLink.href = meta.man;
                header.appendChild(manLink);
            }
        }
    }, [storeId, getHeaderData?.favIcon])
    useEffect(() => {
        if(tokenSingle === "") setTokenSingle("loaded");
        else {
            const hostName = window?.location?.host;
            // const hostName="https://www.promofit.nl"

            if(hostName) {
                if(hostName.includes(decode('bG9jYWw=')) && locServer) { // Check is dev
                    const server = `${locServer}`, store = `${locStore}`;

                    setEnvObj(
                        server.includes(decode('U1RBR0lORw==')) ? {baseUrl: stageUrl, defaultURL: stageDefault} :
                        server.includes(decode('VUFU')) ? {baseUrl: uatUrl, defaultURL: uatDefault} :
                        server.includes(decode('bGl2ZQ==')) ? {baseUrl: liveUrl, defaultURL: liveDefault} :
                        {baseUrl: prodUrl, defaultURL: prodDefault});
                    setStoreId(store.includes(decode('UFJPTU9GSVQ=')) ?  1 : 2);
                }
                else if(hostName.includes(decode('Y3JlYXRpdmVwcm9tb3Rpb25z'))) { //creativepromotions
                    if(hostName.includes(decode('LWltcG9ydA=='))) { // Check is pro/exp import for akeneo import
                        setEnvObj({baseUrl: mageUrl, defaultURL: mageDefault});
                        setStoreId(hostName.includes(decode('cHJvLQ==')) ? 1 : 2);
                    } 
                    else if(hostName.includes(decode('ZXhwb2ZpdA=='))){ //expofit
                    setEnvObj({baseUrl: stageExpoUrl, defaultURL: stageExpoDefault});
                    setStoreId(hostName.includes(decode('ZXhwb2ZpdA==')) ? 2 : 1);
                    } else{
                        setEnvObj({baseUrl: stageUrl, defaultURL: stageDefault});
                        setStoreId(hostName.includes(decode('ZXhwb2ZpdA==')) ? 2 : 1);
                    }
             } 
             else if(hostName.includes(decode('bGl2ZQ=='))) { //LIVE.NL
                if(hostName.includes(decode('LWltcG9ydA=='))) { // Check is pro/exp import for akeneo import
                    setEnvObj({baseUrl: mageUrl, defaultURL: mageDefault});
                    setStoreId(hostName.includes(decode('cHJvLQ==')) ? 1 : 2);
                } 
                else if(hostName.includes(decode('ZXhwb2ZpdA=='))){ //expofit
                setEnvObj({baseUrl: liveExpoUrl, defaultURL: liveExpoDefault});
                setStoreId(hostName.includes(decode('ZXhwb2ZpdA==')) ? 2 : 1);
                } else{
                    setEnvObj({baseUrl: liveUrl, defaultURL: liveDefault});
                    setStoreId(hostName.includes(decode('ZXhwb2ZpdA==')) ? 2 : 1);
                }
         } 
         else if(hostName.includes(decode('cmVhY3QucHJvbW9maXQubmw'))) { //promofit.NL
            if(hostName.includes(decode('LWltcG9ydA=='))) { // Check is pro/exp import for akeneo import
                setEnvObj({baseUrl: mageUrl, defaultURL: mageDefault});
                setStoreId(hostName.includes(decode('cHJvLQ==')) ? 1 : 2);
            } 
            else if(hostName.includes(decode('ZXhwb2ZpdA=='))){ //expofit
            setEnvObj({baseUrl: prodExpofitUrl, defaultURL: prodExpofitDefault});
            setStoreId(hostName.includes(decode('ZXhwb2ZpdA==')) ? 2 : 1);
            } else{
                setEnvObj({baseUrl: prodUrl, defaultURL: prodDefault});
                setStoreId(hostName.includes(decode('ZXhwb2ZpdA==')) ? 2 : 1);
            }
     } 
         else if(hostName.includes(decode('cHJvbW9maXQubmw='))) { //promofit.NL
            if(hostName.includes(decode('LWltcG9ydA=='))) { // Check is pro/exp import for akeneo import
                setEnvObj({baseUrl: mageUrl, defaultURL: mageDefault});
                setStoreId(hostName.includes(decode('cHJvLQ==')) ? 1 : 2);
            } 
            else if(hostName.includes(decode('ZXhwb2ZpdA=='))){ //expofit
            setEnvObj({baseUrl: ProductionExpoUrl, defaultURL: ProductionExpoDefault});
            setStoreId(hostName.includes(decode('ZXhwb2ZpdA==')) ? 2 : 1);
            } else{
                setEnvObj({baseUrl: ProductionUrl, defaultURL: ProductionDefault});
                setStoreId(hostName.includes(decode('ZXhwb2ZpdA==')) ? 2 : 1);
            }
     } 

             else if(hostName.includes(decode('Y3JlYXRpdmUtcHJvbW90aW9ucw=='))) { //uatreact
                    if(hostName.includes(decode('LWltcG9ydA=='))) { // Check is pro/exp import for akeneo import
                        setEnvObj({baseUrl: mageUrl, defaultURL: mageDefault});
                        setStoreId(hostName.includes(decode('cHJvLQ==')) ? 1 : 2);
                    }
                    else if(hostName.includes(decode('ZXhwb2ZpdA=='))){ //expofit
                        setEnvObj({baseUrl: uatExpofitUrl, defaultURL: uatExpofitDefault});
                        setStoreId(hostName.includes(decode('ZXhwb2ZpdA==')) ? 2 : 1);
                        } else{
                            setEnvObj({baseUrl: uatUrl, defaultURL: uatDefault});
                            setStoreId(hostName.includes(decode('ZXhwb2ZpdA==')) ? 2 : 1);
                        }
                    } 
                   
                else {
                    
                    if(hostName.includes(decode('cmVhY3QuZXhwb2ZpdC5ubA=='))){ //preproexpofit
                        setEnvObj({baseUrl: prodExpofitUrl, defaultURL: prodExpofitDefault});
   
                        }
                   else  if(hostName.includes(decode(' ZXhwb2ZpdC5ubA=='))){
                     setEnvObj({baseUrl: ProductionExpoUrl, defaultURL: ProductionExpoDefault});

                     }

                    else if(hostName.includes(decode('ZXhwb2ZpdA==')))
                     setEnvObj({baseUrl: prodExpofitUrl, defaultURL: prodExpofitDefault});
                    else
                     setEnvObj({baseUrl: prodUrl, defaultURL: prodDefault});
 
                     setStoreId(hostName.includes(decode('ZXhwb2ZpdA==')) ? 2 : 1);
 
                  }
            }
        }
    }, [tokenSingle])

    return (
        <DomainContext.Provider value={{ storeId, categoriesId, defaultURL, baseURL,expofitUrl }}>
            {children}
        </DomainContext.Provider>
    )
}

export default DomainContext;