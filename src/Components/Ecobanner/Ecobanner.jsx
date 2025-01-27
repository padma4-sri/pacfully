import React,{useContext} from 'react';
import './styles.scss';
import Img from 'Components/Img';
import { SkeletonImg, SkeletonLine } from 'Components/Skeletion';
import Button from 'Components/Common/Button';
import { Link ,useNavigate} from 'react-router-dom';
import RenderContext from 'Context/RenderContext';
import AdvancedLink from 'Components/AdvancedLink';
import DomainContext from "Context/DomainContext";

const Ecobanner = ({
    loading,
    img,
    title,
    buttonText,
    description,
    button_url,
    backgroundColor
}) => {
    const { loadIfUser, loadPreRender } = useContext(RenderContext);
    const navigate = useNavigate();
    const {storeId, defaultURL } = useContext(DomainContext);

    return (
        <div className='ecobanner mobile-ecobanner container px-4 pb-6 xl-pb-9'  onClick={() => navigate(button_url)}>
        <div
            className="wrapper mobile_wrapper  r-5"
            style={{ backgroundColor: "#FFDDD6" }}
        >
            <div className="w-1/1 flex col-i gap-2 lg-flex lg-row lg-gap-2 lg-fillY mobile-wrapper_inside">
                <div className="mainCol image-mobile-responsive lg-pt-8 pb-8 lg-pb-10 pl-7 pr-7 lg-pr-0 lg-pl-12">
                    <div className="content-banner flex-1 flex col h-1/1">
                        <div className="banner-info flex-1 flex col"
                        >
                            {
                                loading ?
                                    <>
                                        <SkeletonLine height="56px" animation="pulse" />
                                        <SkeletonLine height="28px" animation="pulse" />
                                    </>
                                    :
                                    <>
                                        <h3 className="ellips fw-700 pb-4 resposive-mobile">{title}</h3>
                                        <p className="ellips fs-20 line-9 hide xl-block fw-700">{description}</p>
                                    </>
                            }
                        </div>
                        {
                            loading ?
                                <SkeletonLine
                                    height="48px"
                                    width="50%"
                                    className="r-full"
                                    animation="pulse"
                                /> :
                                buttonText &&
                                <AdvancedLink
                                    className="fw-700 px-3"
                                    to={button_url}
                                    style={{
                                        maxWidth: 'fit-content'
                                    }}
                                >
                                    <Button
                                        size="md"
                                        className={`r-2 mt-2 lg-mt-6 banner-button-responsive `}
                                        
                                    >
                                       Shop Now
                                    </Button>
                                </AdvancedLink>
                        }
                    </div>
                </div>
                <div className={`mainCol imgContainer mobile_responsive_container ${loading ? 'block' : 'flex'} overflow-hidden center lg-flex lg-right middle relative zindex-1`}>
                    <div className='mobile_responsive_imagewidth lg-tr relative lg-absolute lg-top-0 lg-left-0 flex center lg-flex lg-right w-1/1' style={{ maxWidth: "100%", maxHeight: "100%", height: "100%" }}>
                        <div className='eco_img flex'>
                            {
                                loading ?
                                    <SkeletonImg
                                        className="r-full"
                                        animation="pulse"
                                        style={{
                                            width: "100%",
                                            minHeight: "330px",
                                        }}
                                    />
                                    :
                                    (loadIfUser || loadPreRender) && img &&
                                    <AdvancedLink
                                        className="fw-700"
                                        to={button_url}
                                        style={{
                                            maxWidth: 'fit-content'
                                        }}
                                    >
                                            <img
                                                src={img}
                                                alt={title}
                                                type="img"
                                                animation={false}
                                                style={{
                                                    maxWidth: "100%",
                                                    maxHeight: "100%",
                                                   
                                                }}
                                                className='rtl-4 rtr-4 rbr-0 rbl-0 lg-rtl-0 lg-rtr-4 lg-rbr-4 lg-rbl-0'
                                            />
                                    </AdvancedLink>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Ecobanner;