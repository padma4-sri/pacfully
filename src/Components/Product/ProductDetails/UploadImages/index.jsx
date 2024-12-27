import React, { useEffect, useState, useRef, Suspense ,useContext} from 'react';
import Img from 'Components/Img';
import Button from 'Components/Common/Button';
import UploadInfo from '../uploadInfo';
import axios from "axios";
import { InfoPdpIcon } from 'Res/icons';
import CircularProgress from '@mui/material/CircularProgress';
import DropboxThumbnail from './dropboxThumbnail';
import ProgressBar from "./progressbar";
import TextAreaFileUpload from './textArea';
import {  useSelector } from "react-redux";
import DomainContext from "Context/DomainContext";

const UploadImages = ({customOptions, setreqExpandedUpload, textAreaData, setTextData, imagesDropboxHome, setImagesDropboxHome, dropboxFiles, setDropboxFiles, openModel, setOpenModel, data, selectedData, setSelectedData, selectedKey, allData, imageCanvasTemplate, stateUploadedPath, setStateUploadedPath, expandNext, isUploadOpen }) => {
    const DeleteIco = "/res/img/delete.svg";
    const inputRef = useRef(null);
    const [onDelete, setOnDelete] = useState(null);
  const {  storeId } = useContext(DomainContext);

    const [onLoading, setOnLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const translateData = useSelector((state) => state?.translateData);
    const [dropboxToken, setDropboxToken] = useState({
        refreshToken: translateData?.length && translateData[0]?. dropboxRefreshToken,
        client_id: translateData?.length && translateData[0]?.dropboxClientId,
        client_secret: translateData?.length && translateData[0]?.dropboxClientSecretId,
        path: translateData?.length && translateData[0]?.dropboxPath
    });
    const [dropboxAccessToken, setDropboxAccessToken] = useState(null);
    const [files, setFiles] = useState([]);
    const [canvasAction, setCanvasAction] = useState("");
    const [showIframe, setShowIframe] = useState(false);
    // Handler to show the iframe
    const handleButtonClick = () => {
        setShowIframe(true);
    };
    const generateDropboxAccessToken = async ({ refreshToken, client_id, client_secret }) => {
        const response = await fetch(
            `https://api.dropboxapi.com/oauth2/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${client_id}&client_secret=${client_secret}&scope= files.content.read files.content.write sharing.read sharing.write file_requests.write file_requests.read`,
            { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, mode: "cors" }
        );
        const data = await response.json();
        return data.access_token;
    };
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;



    const uploadFile = async ({ file, path, access_token }) => {
        const fileNameParts = file.name.split('.');
        const extension = fileNameParts.pop();
        const nameWithoutExtension = fileNameParts.join('.');
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
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
            setUploadProgress(0)
            const response = await axios.post(url, file, {
                headers: headers,
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    const progress = Math.floor((loaded * 100) / total);
                    setUploadProgress(progress);
                },
            });
            return response.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };


    const createSharingFile = async ({ path, access_token }) => {
        try {
            const response = await fetch(
                `https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ path }),
                }
            );
            return response.json();
        } catch (err) {
            console.error(err);
        }
    }
    const sharingFile = async ({ path, access_token }) => {
        let data1 = await createSharingFile({ path, access_token });
        const errorData = data1?.error?.shared_link_already_exists?.metadata;
        const idData = data1?.error?.shared_link_already_exists?.metadata?.path_lower ?? data1.path_lower;
        let preview = null;
        if (idData) {
            const thumbnailList = [
                ".jpg", ".jpeg", ".svg", ".png", ".tiff", ".tif", ".gif", ".webp", ".ppm", ".bmp", ".pdf", ".ai", ".doc", ".docm", ".docx", ".eps", ".gdoc", ".gslides", ".odp", ".odt", ".pps", ".ppsm", ".ppsx", ".ppt", ".pptm", ".pptx", ".rtf"
            ];
            const indexThumbnail = thumbnailList.findIndex((format) => `${path}`.toLowerCase().includes(format));
            if (indexThumbnail > -1) {
                preview = { type: "img", pathhUrl: idData, data: access_token }
            } else {
                preview = { type: "icon", data: path.split('.')[1] }
            }
        } else
            console.error(data1);
        if (errorData) data1 = errorData;
        return { url: data1?.url, name: data1?.name, path, preview }; // Id may needed future id:data1?.id
    }
    const uploadFileToDropbox = async ({ file, path, access_token }) => {
        try {
            const uploadFileData = await uploadFile({ file, path, access_token });
            if (uploadFileData?.path_display) {
                return await sharingFile({ path: uploadFileData?.path_display, access_token })
            } else {
                return null;
            }
        } catch (err) {
            console.error(err);
        }
    };
    const getFileFromDropbox = async ({ path, access_token }) => {
        try {
            if (path) {
                return await sharingFile({ path, access_token })
            } else {
                return null;
            }
        } catch (err) {
            console.error(err);
        }
    };

    const openFileInput = () => {
        if (inputRef.current) {
            inputRef.current.value = "";
            inputRef.current.click();
        }
    };
    const handleSelectFile = async (event) => {
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
            setOnLoading(true);
            let tempFilesList = []
            for (let i = 0; i < selectedFiles.length; i++) {
                tempFilesList = [...tempFilesList, selectedFiles[i]]
            }
            const response = await Promise.all(tempFilesList.map(async (file) =>
                await uploadFileToDropbox({ file, path: dropboxToken.path, access_token: dropboxAccessToken })));
            const response1 = response.filter((file) => !!file?.path)
            const uploadedFilesList = Array.from([...files, ...response1]
                .reduce((m, o) => m.set(o?.path, o), new Map)
                .values()
            );
            setFiles(uploadedFilesList);
            setOnLoading(false)
        }
    }
    const addSelectFile = async (filePathList) => {
        if (filePathList?.length) {

            setOnLoading(true);
            const response = await Promise.all(filePathList.map(async (path) =>
                await getFileFromDropbox({ path, access_token: dropboxAccessToken })));
            const response1 = response.filter((file) => !!file?.path)
            const uploadedFilesList = Array.from([...response1]
                .reduce((m, o) => m.set(o?.path, o), new Map)
                .values()
            );
            setFiles(uploadedFilesList);
            setOnLoading(false)
        }
    }
    const handleDelete = (e, index) => {
        if (onDelete === null) {
            setOnDelete(index);
            const updatedFiles = [...files];
            setTimeout(() => {
                updatedFiles.splice(index, 1);
                setFiles(updatedFiles);
                setOnDelete(null);
            }, 100);
        }
    };

    useEffect(() => {
        const getDropBoxToken = async () => {
            const accessToken = await generateDropboxAccessToken(dropboxToken);
            setDropboxAccessToken(accessToken);
        };
        if (isUploadOpen && dropboxToken) getDropBoxToken();
    }, [dropboxToken, isUploadOpen]);

    useEffect(() => {
        setImagesDropboxHome([...files])
        // if (files.length > 0) {
        //     console.log(files,"files")
        //     setDropboxFiles(files.map((item) => `<a href="${item?.url}" path="${item?.path}" target="_blank">${item?.name}</a>`)?.join(", "));
        // } else setDropboxFiles("")
        if (files.length > 0) {
            const updatedDropboxFiles = files.map((item) => {
                const updatedUrl = item?.url.replace("dl=0", "dl=1");
                return `<a href="${updatedUrl}" path="${item?.path}" target="_blank">${item?.name}</a>`;
            }).join(", ");
            
            setDropboxFiles(updatedDropboxFiles);
        } else {
            setDropboxFiles("");
        }
        
    }, [files]);

    useEffect(() => {
        if (dropboxAccessToken && stateUploadedPath?.length) {
            addSelectFile(stateUploadedPath)
        }
    }, [dropboxAccessToken, stateUploadedPath]);

    const handleLabelClick = () => {
        setSelectedData((prevData) => ({
            ...prevData,
            upload: prevData[selectedKey]?.[0] ? [] : ["true"],
        }));
    };
    const handleClick = async () => {
        const productId = 399316;
        const url = `https://byi.creativepromotions.nl/productdesigner/index/index/id/${productId}`;
        const formData = new URLSearchParams();
        formData.append('product', data?.settings?.product_id);
        formData.append('selected_configurable_option', productId);
        customOptions.forEach(option => {
            formData.append(`options[${option.option_id}]`, option.option_value);
          });
        try {
          const response = await axios.post(
            `https://byi.creativepromotions.nl/productdesigner/index/index/id/${productId}`, // Replace with your actual API endpoint
            formData.toString(),
            {
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          );
          if (response.status === 200) {
            window.location.href = url;
          } else {
            console.error('API call failed:', response);
          }
        } catch (error) {
          console.error('Error occurred during API call:', error);
        }
      };
    return (
        <>
            <div className=" w-1/1 upload__image pl-10 xxl-pl-0">
                <div className="py-4">
                    <div className="pb-3">
                    {storeId === 1 ?
                        <p className="pb-1 fs-15">Altijd een <strong>gratis digitaal voorbeeld</strong> vooraf:</p>
                       :null}
                       <div className="flex gap-1 xs-flex xs-gap-3">
                            {storeId === 1 ?
                             <p className="pb-1 fs-15 inline-block">- Upload uw drukbestand(en)
                             <span onClick={() => setOpenModel(true)} className="ml-2 infoimgs relative pointer">
                                 <InfoPdpIcon />
                             </span>
                         </p>
                            :
                            <p className="pb-1 fs-15 inline-block">
                            Upload eenvoudig uw drukbestand(en) of lever deze aan na de bestelling.

                            <span onClick={() => setOpenModel(true)} className="ml-2 infoimgs relative pointer">
                                <InfoPdpIcon />
                            </span>
                        </p>
                            
                            }
                           

                        </div>
                        {imageCanvasTemplate && allData[selectedKey]?.isCanvas && storeId === 1 ?
                            <div className="flex gap-1 xs-flex xs-gap-3">
                                <p className="pb-1 fs-15 inline-block">- Of ontwerp zelf met de Online Designer
                                </p>
                            </div>
                            : <></>
                        }
                    </div>
                    <UploadInfo openModel={openModel} setOpenModel={setOpenModel} data={data?.settings} />
                    <div className="field__block input__control relative checkbox flex gap-3 row  row-i right middle">
                        <label className="label fs-15 label" htmlFor="form-type"
                       
                            onClick={(e) => { expandNext(selectedData[selectedKey]?.[0]); setSelectedData({ ...selectedData, upload: selectedData[selectedKey]?.[0] ? [] : ["true"] }) }}
                            >Ik lever het ontwerp later aan</label>
                        <input aria-label="checkbox" checked={selectedData[selectedKey]?.[0] === "true"} type="checkbox" readOnly />
                        <button
                            onClick={(e) => { expandNext(selectedData[selectedKey]?.[0]); setSelectedData({ ...selectedData, upload: selectedData[selectedKey]?.[0] ? [] : ["true"] }) }}
                            aria-label="button" ></button>
                    </div>
                    <input type="file" ref={inputRef}
                    aria-label="file upload" 
                        accept="image/*,video/*, .pdf, application/postscript" // Added application/postscript for AI files
                        className="v-hide input__file" onClick={(e) => e.target.value === null} onChange={(e) => handleSelectFile(e)} />
                    {Boolean(selectedData[selectedKey]?.[0]) ?
                        null :
                        <>
                            <div className="flex col md-flex md-row gap-3">
                                {allData[selectedKey]?.isDropbox ?
                                    <Button className="w-1/1 sm r-9 px-2 py-4 pointer upload__btn fs-15 fw-700" disabled={Boolean(onLoading || selectedData[selectedKey]?.[0])}
                                        onClick={() => openFileInput()} >
                                        {onLoading ? <CircularProgress size={24} thickness={4} /> : "Upload bestand(en)"}
                                    </Button>
                                    : <></>}
                                      {/* <Button className="w-1/1 sm r-9 px-2 py-4 pointer online__btn fs-15 fw-700"
                                    onClick={handleClick}
                                >
                                    Ontwerp online
                                </Button> */}
                                
                            </div>
                            
                            {onLoading && <div className="mui-pro-gress"> <ProgressBar value={uploadProgress} />  </div>}

                            {!(selectedData?.["upload"]?.[0]) ?
                                <div>
                                    {files?.length > 0 && (
                                        <div className="pt-6 pb-2">
                                            <h2 className="fs-15 fw-700 pb-1">Uw bestanden:</h2>
                                            <div className="flex col gap-1">
                                                {files?.map((imageFile, index) => (
                                                    <div key={files[index]?.name} className='flex'>
                                                        <div className="flex middle gap-5 w-1/1 img_title">
                                                            <a href={imageFile?.url} target='_blank' aria-label={"imageFile"} className='r-1 flex center middle overflow-hidden' style={{ minWidth: 61, height: 61, border: `1px solid #ebebeb` }}>
                                                                <span className='w-1/1 h-1/1 r-1 flex center middle overflow-hidden' style={{ maxWidth: 60, maxHeight: 60 }}>
                                                                    {imageFile?.preview?.data ?
                                                                        imageFile?.preview?.type === "img" ? <DropboxThumbnail filePath={imageFile?.preview?.pathhUrl} dropboxToken={dropboxToken} dropboxAccessToken={dropboxAccessToken} /> :
                                                                            imageFile?.preview?.type === "pdf" ? <DropboxThumbnail filePath={imageFile?.preview?.pathhUrl} dropboxToken={dropboxToken} dropboxAccessToken={dropboxAccessToken} /> :
                                                                                imageFile?.preview?.type === "icon" && imageFile?.preview?.data ? (<div className="fileIconBox"><div className="fileIcon"><div className="left2"></div><div className="triangle"></div><div className="triangle2"></div><div className="bottom">{`${imageFile.preview.data}`.toUpperCase()}</div></div></div>) : <></>
                                                                        : <></>}
                                                                </span>
                                                            </a>
                                                            <div className='flex-1 w-1/1 overflow-hidden flex gap-5 left middle'>
                                                                <div className='flex-0' style={{ maxWidth: "calc(100% - 48px)" }}><a href={imageFile?.url} aria-label={"imageFile"}target='_blank' className='fs-15 text-underline text__ellipsed'>{files[index]?.name}</a></div>
                                                                {onDelete === index ? <CircularProgress color='error' size={20} thickness={4} /> :
                                                                    <span className="file__delete pointer relative" onClick={() => handleDelete(files, index)} >
                                                                        <Img src={DeleteIco} />
                                                                    </span>}
                                                                <div className='flex-1'></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div> : <></>
                            }
                        </>
                    }

                </div>
            </div>
            <>
                    <TextAreaFileUpload textAreaData={textAreaData} setTextData={setTextData} />
                    <Button className='contained sm  mb-2 py-2 px-4 r-9 primary'
                        onClick={(e) => {
                            setSelectedData({ ...selectedData })

                            if (selectedData[selectedKey]?.[0]&& (!dropboxFiles?.length)&& textAreaData === "") {
                                setreqExpandedUpload(false)
                            }
                            else{
                            expandNext(true);
                            }
                            

                        }}

                    >
                        volgende
                    </Button>
                </>

        </>

    )
}
export default UploadImages;