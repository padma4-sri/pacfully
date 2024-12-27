import axios from "axios";
export const APIQueryPost = async ({
    isLoader = false, loaderAction = () => { }, axiosData = {},
    getStatus = () => { }, setGetResponseData = () => { }
}) => {
    if (isLoader) {
        loaderAction(true);
    }
    try {
        const { url, paramsData, headers } = axiosData;
        const resData = await axios.post(url, paramsData, { headers });
        setGetResponseData(resData);
        if (isLoader) {
            loaderAction(false);
        }
        getStatus({
            status: resData?.status,
            message: resData?.statusText || resData?.message || ""
        });
    } catch (err) {
        getStatus({
            status: err?.response?.status,
            message: err?.response?.data?.message
        });
        if (isLoader) {
            loaderAction(false);
        }
    }
}

export const APIQueryGet = async ({
    isLoader = false, loaderAction = () => { }, axiosData = {},
    getStatus = () => { }, setGetResponseData = () => { }
}) => {
    if (isLoader) {
        loaderAction(true);
    }
    try {
        const { url, headers } = axiosData;
        const resData = await axios.get(url, { headers });
        setGetResponseData(resData);
        if (isLoader) {
            loaderAction(false);
        }
        getStatus({
            status: resData?.status,
            message: resData?.statusText
        });
    } catch (err) {
        getStatus({
            status: err?.response?.status,
            message: err?.response?.data?.message
        });
        if (isLoader) {
            loaderAction(false);
        }
    }
}