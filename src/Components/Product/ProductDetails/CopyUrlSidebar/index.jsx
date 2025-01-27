import React, { useContext, useEffect, useState } from 'react';
import ModelNew from 'Components/Model/ModelNew';
import CloseButton from 'Components/CloseButton';
import './styles.scss';
import Input from 'Components/Common/Form/Input';
import Button from 'Components/Common/Button';
import { useLocation } from 'react-router-dom';
import { Whatsaap, Email } from "Res/icons";
import Mailto from "Components/Mailto";
import { WhatsappShareButton } from 'react-share';
import DomainContext from 'Context/DomainContext';

const CopyUrlSidebar = ({ openCopyURLModel, setOpenCopyURLModel, productName }) => {
    const { storeId } = useContext(DomainContext);
    const location = useLocation();
    const [url, setUrl] = useState("");
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyClick = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url)
                .then(() => {
                    setIsCopied(true);
                    setTimeout(() => {
                        setIsCopied(false);
                    }, 1000);
                })
                .catch((error) => {
                    setIsCopied(false);
                });
        }
    };

    const emailBody = `Bekijk hier het artikel met de gekozen opties bij : 
${url}`;

useEffect(() => {
    setUrl(window.location.href)
}, [location, window?.location])
return (
    <ModelNew
        from="right"
        hideScroll={false}
        zindex={11}
        open={openCopyURLModel}
        shadow={true}
        setOpen={setOpenCopyURLModel}
        className="copy__url__sidebar"
    >
        <div className="sidebar__copyurl w-1/1 h-1/1 px-4 sm-px-6 py-4 overflow-hidden overflow-y-auto">
            <div className="close__block tr flex right w-1/1">
                <CloseButton onClickFunction={() => setOpenCopyURLModel(false)} />
            </div>
            <div className="copyurl__wrapper__container">
                <div className="sidebar__heading pb-8">
                    <h1 className="fw-700 mb-4 fs-20">Bewaar of deel dit artikel</h1>
                    <p className="line-6 fs-15">Met onderstaande link kunt u gemakkelijk het artikel met de gekozen opties bewaren en delen.</p>
                </div>
                <div className="sidebar__body">
                    <p className="fs-15 fw-700 pb-3 line-6">Uw unieke link:</p>
                    <div className="input__block relative">
                        <Input
                            value={url}
                            placeHolder="Vul uw e-mailadres in"
                            readOnly={true}
                            fieldClassName="flex gap-1 col pb-5"
                            inputClassName="w-1/1 pl-5 py-2 fs-14 r-6 text__ellipse"
                        />
                        <Button className='absolute right-1 top-1 py-2 px-3 line-5 r-5 fs-14' onClick={() => handleCopyClick()}>{isCopied ? 'Gekopieerd' : 'Kopieer link'}</Button>
                    </div>
                    <div className="social__actions flex row gap-7">
                        <Mailto
                            className='px-3 line-5 r-5 fs-14 md r-6 w-1/1 email'
                            email={""}
                            subject={`Bekijk artikel: ${productName}`}
                            body={emailBody}
                        ><Email /> Deel via e-mail</Mailto>
                        <WhatsappShareButton url={url}>
                            <Whatsaap /> Deel via WhatsApp
                        </WhatsappShareButton>
                      </div>
                </div>
            </div>
        </div>
    </ModelNew>
)
}

export default CopyUrlSidebar;