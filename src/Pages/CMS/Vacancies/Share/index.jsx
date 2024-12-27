import ModelNew from 'Components/Model/ModelNew';
import CloseButton from 'Components/CloseButton';
import './styles.scss';
import { Whatsaap, Email } from "Res/icons";
import { WhatsappShareButton, LinkedinShareButton, EmailShareButton } from 'react-share';
import { useLocation } from 'react-router-dom';
import { memo, useEffect, useState } from 'react';

const Share = ({ openCopyURLModel, setOpenCopyURLModel }) => {
    const location = useLocation();
    const [url, setUrl] = useState("");

    useEffect(() => {
        setUrl(window.location.href)
    }, [location])
    return (
        <ModelNew
            from="right"
            hideScroll={false}
            zindex={11}
            open={openCopyURLModel}
            shadow={true}
            setOpen={setOpenCopyURLModel}
            className="vacancies__sidebar"
        >
            <div className="sidebar__vacancies w-1/1 h-1/1 px-4 sm-px-6 py-4 overflow-hidden overflow-y-auto">
                <div className="close__block tr flex right w-1/1">
                    <CloseButton onClickFunction={() => setOpenCopyURLModel(false)} />
                </div>
                <div className="copyurl__wrapper__container">
                    <div className="sidebar__heading pb-8">
                        <h1 className="fw-700 mb-4 fs-20">Deel deze vacature</h1>
                    </div>
                    <div className="sidebar__body">
                        <div className="social__actions flex col gap-4">
                            <EmailShareButton url={url}>
                                <Email /> Deel via e-mail
                            </EmailShareButton>
                            <WhatsappShareButton url={url}>
                                <Whatsaap /> Deel via WhatsApp
                            </WhatsappShareButton>
                            <LinkedinShareButton url={url}>
                                <span className='px-1 fw-700 fs-17'>in</span> Deel via Linkedin
                            </LinkedinShareButton>
                        </div>
                    </div>
                </div>
            </div>
        </ModelNew>
    )
}

export default memo(Share);