import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {pdpUrlTypeState} from 'Utilities';

const UrlGeneratorPdp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [singleToken, setSingleToken] = useState("");
    const [timeOuts, setTimeouts] = useState(null);
    const [urlGenDataArr, setUrlGenDataArr] = useState([]);
    const generateNewUrl = (currentData) => {
        if(singleToken==="") setSingleToken("loaded");
        else {
            let data = [currentData];
            const sortedData = data.sort()?.[0];
            let newData = [];

            for (let keyValue in sortedData) {
                const d = sortedData?.[keyValue];
                if(d?.length) newData?.push({ value: `${keyValue}=${`${d}`=== '[object Object]' ? `${JSON.stringify(d)}` : `${d}` }` })
            }
            let stringData = "";
            newData?.forEach((item, ind) => {
                const temp =item?.value? item?.value.replaceAll("&","ANDAND"):""
                stringData += `${temp}${newData?.length !== ind + 1 ? '&' : ''}`
            });
            stringData = stringData.replaceAll("#","HASH")
            if((stringData ? `?${encodeURI(stringData)}` : "") !==  location?.search) {
              if(timeOuts) {
                    clearTimeout(timeOuts)
                    setTimeouts(null)
                }
                if(!timeOuts) {
                    const urlTempData = stringData;
                    const to = setTimeout(()=> {
                        navigate({
                            search: urlTempData ? `?${encodeURI(urlTempData)}` : "",
                            state: pdpUrlTypeState
                        });
                        clearTimeout(timeOuts)
                        setTimeouts(null)
                    }, 240)
                    setTimeouts(to)
                }
            }
        }
    }
    useEffect(() => {
        const urlSearch = location?.search?.slice(1)?.replaceAll("HASH", "#")
        const urlData = urlSearch?.split("&");

        let data = {};
        if (urlData?.[0] !== '') {
            urlData?.forEach((item, ind) => {
                const key = item?.split("=")?.[0], value= item?.split("=")?.[1];
                const key1 =key? key.replaceAll("ANDAND","&"):""
                if(key1 && value ) data[decodeURI(key1)] = decodeURI(value);
            });
        }
        setUrlGenDataArr(data);
    }, [location?.search]);

    const urlGenData = useMemo(()=> urlGenDataArr,[urlGenDataArr])

    return { urlGenData, generateNewUrl };
}

export default UrlGeneratorPdp;
