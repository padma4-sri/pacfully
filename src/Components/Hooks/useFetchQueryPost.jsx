import { useState, useEffect, useRef } from "react";
import axios from "axios";

const useFetchQueryPost = ({
    isLoader = false, loaderAction = () => { }, axiosData = {}
}) => {
    const APIReference = useRef(false);
    const { url, paramsData, headers } = axiosData;
    const [data, setData] = useState(null);
    const fetchAPI = async () => {
        if (isLoader) {
            loaderAction(true)
        }
        try {
            const resData = await axios.post(url, paramsData, { headers })
            setData(resData)
            if (isLoader) {
                loaderAction(false)
            }
            getStatus(resData?.data[0]?.code);

        } catch (err) {
            getStatus(err?.response?.status);
            if (isLoader) {
                loaderAction(false)
            }
        }
    }
    useEffect(() => {
        if (!APIReference.current) {
            APIReference.current = true
            fetchAPI();
            setTimeout(() => APIReference.current = false, 300)
        }
    }, [axiosData?.url]);

    return [data];
};

export default useFetchQueryPost;