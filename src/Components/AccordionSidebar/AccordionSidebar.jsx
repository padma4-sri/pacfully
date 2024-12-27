import React, { memo, useContext, useEffect, useRef, useState } from "react";
import "./styles.scss";
import { Toggleup } from "Res/icons";
import CloseButton from "Components/CloseButton";
import ModelNew from "Components/Model/ModelNew";
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { LineLoader, SkeletonLoader } from "Components/Skeletion";
import { APIQueryGet } from "APIMethods/API";
import DomainContext from "Context/DomainContext";
import Img from "Components/Img";

const AccordionSidebar = ({ openModel, setOpenModel, setIsSampleCalled, isSampleCalled, load = true, tagUrl = "", qTitle = "Veelgestelde vragen", titleImage = "" }) => {
    const { baseURL, storeId ,defaultURL} = useContext(DomainContext);
    const accordionRef = useRef(null);
    const [loading, setLoading] = useState(load);
    const [data, setData] = useState({});
    const { details, items } = data;
    const [expanded, setexpanded] = useState(null);
    const handleChange = (n) => {
        accordionRef.current?.focus();
        if (expanded === n) {
            setexpanded(null);
        } else {
            setexpanded(n);
            const accordionItem = document.getElementById(`accordionItem_${n}`);
            if (accordionItem) {
                setTimeout(() => {
                    accordionItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 200);
            }
        }
    };
    const options = {
        isLoader: true,
        loaderAction: (bool) => setLoading(bool),
        setGetResponseData: (res) => {
            setData(res?.data?.[0]);
            setIsSampleCalled(true);
        },
        axiosData: {
            url: `${defaultURL}/faq/queries?storeId=${storeId}&tag_url=${tagUrl}`,
            
        },
    };

    useEffect(() => {
        setexpanded(null);
        if (openModel && !isSampleCalled) {
            APIQueryGet(options);
        }
        return setexpanded(null);
    }, [openModel]);

    return (
        <ModelNew
            from="right"
            hideScroll={false}
            zindex={11}
            open={openModel}
            shadow={true}
            setOpen={setOpenModel}
            className="accordion__sidebar"
        >
            <div className="wrapper w-1/1 h-1/1 p-5 xl-px-7 xl-pt-10 xl-pb-7 overflow-hidden overflow-y-auto">
                <div className="relative">
                    <div className="closeButton absolute top-0 right-0">
                        <CloseButton onClickFunction={() => {
                            setOpenModel(false)
                        }} />
                    </div>
                </div>
                <div className="flex col h-1/1">
                    <div className="flex-1 flex col sidebar__contents mb-5 md-mb-8 pt-8">
                        <div className="sidebar__heading pb-3 mb-3 flex col start gap-4 sm-flex sm-row sm-middle">
                            {
                                loading ?
                                    <LineLoader width="80%" height="28px" />
                                    :
                                    <>
                                        <h3 className="fw-700 fs-20 line-7">{details?.category_name}</h3>
                                        {
                                            titleImage ?
                                                <div className="title__img">
                                                    <Img className="image-contain" src={titleImage} alt={details?.category_name} />
                                                </div>
                                                : <></>
                                        }
                                    </>
                            }
                        </div>
                        <div className="description overflow-hidden overflow-y-auto">
                            {
                                loading ?
                                    <SkeletonLoader length={10} />
                                    :
                                    <p className="fs-15 line-7" dangerouslySetInnerHTML={{ __html: details?.category_description }} />
                            }
                        </div>
                        {
                            loading ?
                                <div className="list py-6">
                                    <h3 className="fw-700 fs-20 line-7 pb-5">
                                        <LineLoader width="80%" height="18px" />
                                    </h3>
                                    {
                                        ['', '', '', '', '', '', '', ''].map((item, key) => (
                                            <div className="flex gap-4 pb-3" key={`accordionref_${key}`}>
                                                <LineLoader width="30px" height="30px" className="r-5" />
                                                <LineLoader height="31px" width="100%" />
                                            </div>
                                        ))
                                    }
                                </div>
                                :
                                <div className="list py-6">
                                    {qTitle && items?.length ? <h3 className="fw-700 fs-20 line-7 pb-5">{qTitle}</h3> : <></>}
                                    {
                                        items?.map((item, key) => (
                                            <Accordion
                                                onChange={() => handleChange(key)}
                                                ref={accordionRef}
                                                expanded={expanded === key}
                                                key={`accordionref_${key}`}
                                                TransitionProps={{ timeout: { appear: 200, enter: 200, exit: 300 } }}
                                            >
                                                <AccordionSummary
                                                    expandIcon={<Toggleup sx={{ fontSize: '0.9rem' }} />}
                                                >
                                                    <p id={`accordionItem_${key}`}>{item?.faq_title}</p>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <div dangerouslySetInnerHTML={{ __html: item?.faq_detail_description }} />
                                                </AccordionDetails>
                                            </Accordion>
                                        ))
                                    }
                                </div>
                        }
                    </div>
                </div>
            </div>
        </ModelNew>
    );
};

export default memo(AccordionSidebar);
