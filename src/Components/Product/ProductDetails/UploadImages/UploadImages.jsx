import React, { useEffect, useState, useRef, Suspense } from 'react';
import Img from 'Components/Img';
import Button from 'Components/Common/Button';
import UploadInfo from '../uploadInfo';
import axios from "axios";
import { InfoPdpIcon } from 'Res/icons';
import CircularProgress from '@mui/material/CircularProgress';
import {Buffer} from 'buffer';
const Canvas = React.lazy(() =>  import("../canvas/canvas"));

const UploadImages = ({
    dropboxFiles, setDropboxFiles,
    imagesDropboxPreview, setImagesDropboxPreview,
    openModel, setOpenModel, data, selectedData, setSelectedData,
    imagesDropboxHome, setImagesDropboxHome, selectedKey, allData }) => {
    const InfoImage = "/res/img/info.svg";
    const DeleteIco = "/res/img/delete.svg";
    const inputRef = useRef(null);
    const [imagesDropbox, setImagesDropbox] = useState([...imagesDropboxHome]);
    const [onDelete, setOnDelete] = useState(null);
    const [onLoading, setOnLoading] = useState(false);
    const [dropboxToken, setDropboxToken] = useState({
        refreshToken: data?.dropboxRefreshToken,
        client_id: data?.dropboxClientId,
        client_secret: data?.dropboxClientSecretId,
        path: data?.dropboxPath
    });
    const [dropboxAccessToken, setDropboxAccessToken] = useState();
    const [files, setFiles] = useState([]);
    const [canvasAction, setCanvasAction] = useState("");
    const generateDropboxAccessToken = async ({refreshToken,client_id,client_secret}) => {
        const response = await fetch(
            `https://api.dropboxapi.com/oauth2/token?grant_type=refresh_token&refresh_token=${refreshToken}&client_id=${client_id}&client_secret=${client_secret}&scope=files.content.read files.content.write sharing.write sharing.read file_requests.write file_requests.read`,
            { method: "POST",headers: { "Content-Type": "application/x-www-form-urlencoded" },mode: "cors" }
        );
        const data = await response.json();
        return data.access_token;
    };
    const uploadFile = async({ file, path, access_token })=> {
        try {
            const response = await fetch(
                `https://content.dropboxapi.com/2/files/upload`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/octet-stream",
                        "Dropbox-API-Arg": JSON.stringify({
                            path: `${path}${file.name}`,
                            mode: "add",
                            autorename: true,
                            mute: false,
                        }),
                    },
                    body: file,
                }
            );
            return response.json();
        } catch (err) {
            console.error(err);
        }
    }
    const sharingFile = async({ uploadFileData, access_token })=> {
        try {
            const response = await fetch(
                `https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        path: uploadFileData.path_display,
                    }),
                }
            );
            return response.json();
        } catch (err) {
            console.error(err);
        }
    }
    const uploadFileToDropbox = async ({ file, path, access_token }) => {
        try {
            const uploadFileData = await uploadFile({ file, path, access_token });
            let data1 = await sharingFile({ uploadFileData, access_token });
            const errorData = data1?.error?.shared_link_already_exists?.metadata;
            const idData = data1?.error?.shared_link_already_exists?.metadata?.path_lower ?? data1.path_lower;
            const idUrl = data1?.error?.shared_link_already_exists?.metadata?.url ?? data1.url;
            let preview = null;
            if(idData && file?.name?.length > 0) {
                const thumbnailList = [".jpg", ".jpeg", ".png", ".tiff", ".tif", ".gif", ".webp", ".ppm", ".bmp"];
                const pdfList = [".pdf"];
                const indexThumbnail = thumbnailList.findIndex((format) => file.name.includes(format));
                const indexPdf = indexThumbnail < 0 ? pdfList.findIndex((format) => file.name.includes(format)) : -1;
                if(indexThumbnail > -1) {
                    await axios.post(
                    'https://content.dropboxapi.com/2/files/get_thumbnail_v2',
                    '',
                    {
                        headers: {
                            'Content-Type' : "text/plain; charset=utf-8",
                            'Authorization': `Bearer ${access_token}`,
                            'Dropbox-API-Arg': JSON.stringify({
                                "format": "png",
                                "mode": "strict",
                                "quality": "quality_80",
                                "resource": {
                                    ".tag": "path",
                                    "path": idData
                                },
                                "size": "w64h64"
                            })
                        }
                    }
                    ).then((response) => {
                        var fileUrl = "data:image/png;base64," + Buffer.from(response.data, 'binary').toString('base64');
                        preview = {type:"img", data:fileUrl}
                    }).catch((error) => {
                        setOnDelete(null);
                        console.error("Error preview image:", error);
                    });
                } else if(indexPdf > -1) {
                    await axios.post(
                        'https://content.dropboxapi.com/2/files/get_preview',
                        '',
                        {
                        headers: {
                            'Content-Type' : "text/plain; charset=utf-8",
                            'Authorization': `Bearer ${access_token}`,
                            'Dropbox-API-Arg': JSON.stringify({"path":idData}),
                        }
                    }).then((response) => new Blob([response?.data], {type: "image/png"})).then((blob) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(blob);
                        reader.onloadend = () => preview = {type:"img", data:reader.result}
                    }).catch((error) => {
                        setOnDelete(null);
                        console.error("Error preview pdf:", error);
                    });
                } else {
                    preview = {type:"icon", data:file.name.split('.')[1]}
                }
            } else 
                console.error(data1);
            if(errorData) data1 = errorData;
            return { url: data1?.url, name: data1?.name, preview: preview, id:data1?.id};
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
        setOnLoading(true);
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
        let temp = (files?.length && selectedFiles?.length) && files?.some((item) => item?.name === selectedFiles[0].name);
        if (temp) {
        } else {
            setFiles((prev) => [...prev, ...selectedFiles]);
            const previewUrls = [];
            const imagePromises = [];

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                if (file.type === "application/pdf") {
                    const fileURL = URL.createObjectURL(file);
                    previewUrls.push(fileURL);
                } else {
                    const filePromise = new Promise((resolve, reject) => {
                        const fileReader = new FileReader();
                        fileReader.onload = () => {
                            const fileDataUrl = fileReader.result;
                            resolve(fileDataUrl);
                        };
                        fileReader.onerror = () => {
                            reject(new Error("Failed to read file"));
                        };
                        fileReader.readAsDataURL(file);
                    });

                    imagePromises.push(filePromise);
                }
            }

            const imageUrls = await Promise.all(imagePromises);
            const response = await Promise.all(
                Array.from(selectedFiles).map(async (file) => {
                    return await uploadFileToDropbox({
                        file: file,
                        path: dropboxToken.path,
                        access_token: dropboxAccessToken,
                    });
                })
            );
            setImagesDropbox((prev) => {
                return [...prev, ...previewUrls, ...imageUrls]
            });
            setImagesDropboxPreview([...imagesDropboxPreview, ...response])
            setOnLoading(false)
            setDropboxFiles(response .map((item) => `<a target="_blank" href="${item?.url}">${item?.name}</a>`)?.join(", "));
        }
    };

    const handleDelete = (e, index) => {
        if(onDelete === null) {
            setOnDelete(index);
            const updatedImages = [...imagesDropbox];
            const updatedFiles = [...files];
            const headers = { Authorization: `Bearer ${dropboxAccessToken}`, "Content-Type": "application/json" };
            const data = { path: `${dropboxToken?.path}${e[0]?.name}` };
            axios.post("https://api.dropboxapi.com/2/files/delete_v2", data, { headers })
                .then((res) => {
                    updatedImages.splice(index, 1);
                    setImagesDropbox(updatedImages);
                    updatedFiles.splice(index, 1);
                    setFiles(updatedFiles);
                    setOnDelete(null);
                })
                .catch((error) => {
                    setOnDelete(null);
                    console.error("Error deleting image:", error);
                });
        }
    };

    useEffect(() => {
        const getDropBoxToken = async () => {
            const accessToken = await generateDropboxAccessToken(dropboxToken);
            setDropboxAccessToken(accessToken);
        };
        if (dropboxToken) getDropBoxToken();
    }, [dropboxToken]);
    useEffect(() => {
        setImagesDropboxHome(imagesDropbox)
    }, [imagesDropbox]);
    
    const handleLabelClick = () => {
        setSelectedData((prevData) => ({
          ...prevData,
          upload: prevData[selectedKey]?.[0] ? [] : ["true"],
        }));
      };

    
    
    return (
        <div className=" w-1/1 upload__image pl-10 xxl-pl-0">
            <div className="py-4">
                <div className="pb-3">
                    <p className="pb-1 fs-15">Altijd een <strong>gratis digitaal voorbeeld</strong> vooraf:</p>
                    <div className="flex gap-1 xs-flex xs-gap-3">
                        <p className="pb-1 fs-15 inline-block">- Upload uw drukbestand(en)
                        <span onClick={() => setOpenModel(true)} className="ml-2 infoimgs relative pointer">
                            <InfoPdpIcon />
                        </span>
                        </p>
                    </div>
                    {allData[selectedKey]?.isCanvas ?
                        <div className="flex gap-1 xs-flex xs-gap-3">
                            <p className="pb-1 fs-15 inline-block">- Of ontwerp zelf met de Online Designer
                            <span onClick={() => setOpenModel(true)} className="ml-2 infoimgs relative pointer">
                                <InfoPdpIcon />
                            </span>
                            </p>
                        </div>
                    : <></>}
                </div>
                <UploadInfo openModel={openModel} setOpenModel={setOpenModel} data={data?.settings} />
                <div className="field__block input__control relative checkbox flex gap-3 row  row-i right middle">
                    <label className="label fs-15 label" htmlFor="form-type" onClick={()=>handleLabelClick()}>Ik lever het ontwerp later aan</label>
                    <input checked={selectedData[selectedKey]?.[0] === "true"} type="checkbox" readOnly aria-label="checkbox"  />
                    <button onClick={(e) => setSelectedData({ ...selectedData, upload: selectedData[selectedKey]?.[0] ? [] : ["true"] })} aria-label="button"></button>
                </div>
                <input type="file" multiple ref={inputRef}
                aria-label="checkbox" 
                        accept="image/*,video/*, .pdf, application/postscript" // Added application/postscript for AI files

                 className="v-hide input__file" onClick={(e)=> e.target.value === null} onChange={(e) => handleSelectFile(e)} />
                <div className="flex col md-flex md-row gap-3">
                    {allData[selectedKey]?.isDropbox ?
                        <Button className=" w-1/1 sm r-9 px-2 py-4 pointer upload__btn fs-15 fw-700" disabled={Boolean(onLoading || selectedData[selectedKey]?.[0])}
                            onClick={() => openFileInput()} >
                                {onLoading ? <CircularProgress size={24} thickness={4} /> : "Upload bestand(en)"}
                        </Button>
                        : <></>}
                    {allData[selectedKey]?.isCanvas ?
                        <Button className=" w-1/1 sm r-9 px-2 py-4 pointer online__btn fs-15 fw-700"
                            onClick={()=>setCanvasAction("loading")}
                            disabled={Boolean(onLoading || selectedData[selectedKey]?.[0])}
                        >
                            Ontwerp online
                        </Button>
                        : <></>}
                </div>
                <Suspense fallback={<CircularProgress />}>
                    {canvasAction !== "" ? <Canvas canvasAction={canvasAction} setCanvasAction={setCanvasAction} /> : <></>}
                </Suspense>
                {!(selectedData?.["upload"]?.[0]) ?
                    <div>
                        {imagesDropbox?.length > 0 && (
                            <div className="pt-6 pb-2">
                                <h2 className="fs-15 fw-700 pb-1">Uw bestanden:</h2>
                                <div className="flex col gap-1">
                                    {imagesDropbox?.map((image, index) => (
                                        <div key={files[index]?.name} className='flex'>
                                            <div className="flex gap-5 img_title middle">
                                                <div className='w-1/1 h-1/1 r-1 flex center middle overflow-hidden' style={{maxWidth:60,maxHeight:60}}>
                                                    {imagesDropboxPreview?.[index]?.preview?.data ? 
                                                        imagesDropboxPreview?.[index]?.preview?.type === "img" ? <img className='r-1 overflow-hidden' src={`${image}`} style={{maxWidth:60, maxHeight:60}}/> :
                                                        imagesDropboxPreview?.[index]?.preview?.type === "pdf" ? <iframe src={`${image}`} style={{width:60,height:60,}} className="overflow-hidden"></iframe> : 
                                                        imagesDropboxPreview?.[index]?.preview?.type === "icon" && imagesDropboxPreview?.[index]?.preview?.data ? (<div class="fileIconBox"><div class="fileIcon"><div class="left2"></div><div class="triangle"></div><div class="triangle2"></div><div class="bottom">{`${imagesDropboxPreview[index].preview.data}`.toUpperCase()}</div></div></div>) : <></>
                                                    : <></>}
                                                    {/* onpurpose */}
                                                    {/* {imagesDropboxPreview?.[index]?.preview?.data ? 
                                                        imagesDropboxPreview?.[index]?.preview?.type === "img" ? <img className='r-1 overflow-hidden' src={`${imagesDropboxPreview[index].preview.data}`} style={{maxWidth:60, maxHeight:60}}/> :
                                                        imagesDropboxPreview?.[index]?.preview?.type === "pdf" ? <iframe src={`${imagesDropboxPreview?.[index]?.preview?.data}`} style={{width:60,height:60,}} className="overflow-hidden"></iframe> : 
                                                        imagesDropboxPreview?.[index]?.preview?.type === "icon" && imagesDropboxPreview?.[index]?.preview?.data ? (<div class="fileIconBox"><div class="fileIcon"><div class="left2"></div><div class="triangle"></div><div class="triangle2"></div><div class="bottom">{`${imagesDropboxPreview[index].preview.data}`.toUpperCase()}</div></div></div>) : <></>
                                                    : <></>} */}
                                                </div>
                                            <p className='flex-1 fs-15 text__ellipse'>{files[index]?.name}</p>
                                            {onDelete === index ? <CircularProgress color='error' size={20} thickness={4} /> : 
                                            <span className="file__delete pointer relative" onClick={() => handleDelete(files, index)} >
                                                <Img src={DeleteIco} webp={false} />
                                            </span>
                                            }
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div> : <></>
                }
            </div>
        </div>
    )
}
export default UploadImages;