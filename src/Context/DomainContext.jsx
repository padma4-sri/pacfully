import React, { createContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";


export const stageUrl = process.env.REACT_APP_STAGE_BACKEND_URL;


export const locServer = process.env.REACT_APP_LOCAL_SERVER;
export const locPacTit = process.env.REACT_APP_PACFULLY_TITLE
export const locPacFav = process.env.REACT_APP_PACFULLY_FAVICON
export const locPacMan = process.env.REACT_APP_PACFULLY_MANIFEST

const DomainContext = createContext({});
export const DomainProvider = ({ children }) => {
    const decode = (t) => atob(t);

    const [tokenSingle, setTokenSingle] = useState("");
    const [EnvObj, setEnvObj] = useState({baseUrl: "", defaultURL: ""});
    const [baseURL, setBaseURL] = useState("");
    const [defaultURL, setDefaultURL] = useState("");
    useEffect(() => {
        if(EnvObj.baseUrl){
            setBaseURL(`${EnvObj.baseUrl}/V1`);
            setDefaultURL(`${EnvObj.defaultURL}/default/V1`)
        }
    }, [ EnvObj])
    const getHeaderData = useSelector((state) => state?.getHeaderFooterData?.data?.header);
    useEffect(() => {
            const meta ={
                tit: locPacTit,
                fav: locPacFav,
                man: locPacMan
            } 
            const pacfully = "/favicon.pacfully.svg";
            const header = document.getElementById('header');

        
            if (header) {
                const favIconPath =pacfully ;
            
                const favLink = document.createElement('link');
                favLink.rel = 'icon';
                favLink.href = favIconPath;
                header.appendChild(favLink);
            
                const manLink = document.createElement('link');
                manLink.rel = 'manifest';
                manLink.href = meta.man;
                header.appendChild(manLink);
            }
    }, [ getHeaderData?.favIcon])
    useEffect(() => {
        if(tokenSingle === "") setTokenSingle("loaded");
        else {
            const hostName = window?.location?.host;
            // const hostName="http://13.126.238.23/react-app/"

            if(hostName) {
                if(hostName.includes(decode('bG9jYWw=')) && locServer) { // Check is dev
                    const server = `${locServer}`;

                    setEnvObj(
                        server.includes(decode('U1RBR0lORw==')) ? {baseUrl: stageUrl, defaultURL: stageUrl} :
                        {baseUrl: stageUrl, defaultURL: stageUrl});
                }
                else if(hostName.includes(decode('aHR0cDovLzEzLjEyNi4yMzguMjM='))) { 
                    setEnvObj({baseUrl: stageUrl, defaultURL: stageUrl});

             }     
                
            }
        }
    }, [tokenSingle])
console.log(baseURL,"baseurl")
    return (
        <DomainContext.Provider value={{  defaultURL, baseURL }}>
            {children}
        </DomainContext.Provider>
    )
}

export default DomainContext;