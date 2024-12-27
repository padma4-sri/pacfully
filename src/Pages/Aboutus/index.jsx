import React, { useState, useContext, memo } from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import Img from "Components/Img";
import { useEffectOnce } from "Components/Hooks/useEffectOnce";
import {  APIQueryGet} from "APIMethods/API";
import useScrollToTop from 'Components/Hooks/useScrollToTop';
import Seo from "Components/Seo/Seo";
import { LineLoader, SkeletonImg, SkeletonLoader } from "Components/Skeletion";

const AboutUs = () => {
  useScrollToTop();
  const { defaultURL, storeId } = useContext(DomainContext);
  const [data, setData] = useState([]);
  const seoData = data?.[0]?.seo;
  const [loading, setLoading] = useState(true);

  const options = {
    isLoader: true,
    loaderAction: (bool) => setLoading(bool),
    setGetResponseData: (resData) => {
      setData(resData?.data);
    },
    axiosData: {
      url: `${defaultURL}/cms/aboutus?storeId=${storeId}`,

    },
  };

  // render once
  useEffectOnce(() => {
    APIQueryGet(options);
  });

  const loaderLines = ['', '', ''].map((item, ind) => (
    <React.Fragment>
      <LineLoader width={ind === 0 ? "80%" : "100%"} className="mb-3" />
      {ind !== 2 ? <br /> : <></>}
    </React.Fragment>
  ))
  return (
    <React.Fragment>
      <Seo
        metaTitle={seoData?.metaTitle}
        metaDescription={seoData?.metaDescription}
        metaKeywords={seoData?.metaKeywords}
      />
      {
        loading ?
          <div className="container px-4 aboutus">
            <div className="promofit__header">
              <div className="promofit__header__section w-1/1">
                <div className="hide sm-block">
                  <SkeletonImg
                    animation="pulse"
                    height="480px"
                    width="100%"
                    style={{ borderRadius: "5px" }}
                  />
                </div>
                <div className="sm-hide">
                  <SkeletonImg
                    animation="pulse"
                    height="300px"
                    width="100%"
                    style={{ borderRadius: "5px" }}
                  />
                </div>
              </div>
            </div>
            <div className="aboutus__section__one xl-py-4 main__section rb-3 lg-rb-5 ">
              <div className="md-py-12 py-4 px-8">
                {loaderLines}
              </div>
            </div>
            {<LoadingBlock />}
            <div className="aboutus__section__one ">
              <div className="md-py-12 py-4 px-8 line-6">
                <div className="md-py-12 py-4 px-8">
                  {loaderLines}
                </div>
              </div>
            </div>
            {<LoadingBlock />}
            <div className="aboutus__section__one r-3 lg-r-5 xl-py-4 main__section">
              <div className="md-py-12 py-4 px-8 line-6">
                <LineLoader height="28px" className="mb-3" />
                <br />
                <SkeletonLoader length={6} height="28px" />
              </div>
            </div>
            {<LoadingBlock reverse="flex md-row-i" />}
            {<LoadingBlock />}
            {<LoadingBlock reverse="flex md-row-i" />}
            {<LoadingBlock />}
          </div>
          :
          <div className="container px-4 aboutus">
            <div
              className="promofit__header"
              style={{
                backgroundImage: `url(${data && data[1]?.banner?.aboutusBannerImageUrl})`,
              }}
            >
              <div className="promofit__header__section">
                <h1 className="fw-600 ">{data && data[1]?.banner?.bannerText}</h1>
              </div>
            </div>
            {
              data[2]?.block1?.block1Text || data[2]?.block1?.block1Content ?
                <div className="aboutus__section__one xl-py-4 main__section rb-3 lg-rb-5 ">
                  <div className="md-py-12 py-4 px-8 line-6">
                    {data[2]?.block1?.block1Text ? <h4 className="fs-20 fw-600 pb-4">{data[2]?.block1?.block1Text}</h4> : <></>}
                    {
                      data[2]?.block1?.block1Content ?
                        <p className="pb-4 fs-15 line-6" dangerouslySetInnerHTML={{__html:data[2]?.block1?.block1Content}}/>
                         
                        : <></>
                    }
                  </div>
                </div>
                : <></>
            }
            {
              data[3]?.block2?.block1Text || data[3]?.block2?.block1Content || data[3]?.block2?.aboutusBlock2ImageUrl ?
                <div className="md-flex md-gap-8 aboutus__section__two center mx-auto middle md-py-16 py-4">
                  {
                    data[3]?.block2?.block1Text || data[3]?.block2?.block1Content ?
                      <div className="xl-w-1/2 px-8 flex center col">
                        {
                          data[3]?.block2?.block1Text ?
                            <h4 className="fs-32 fw-600 pb-4">{data[3]?.block2?.block1Text}</h4>
                            : <></>
                        }
                        {
                          data[3]?.block2?.block1Content ?
                            <p className="pb-4 fs-15 line-6" dangerouslySetInnerHTML={{__html:data[3]?.block2?.block1Content}}/>
                             
                           
                            : <></>
                        }
                      </div>
                      : <></>
                  }
                  {
                    data[3]?.block2?.aboutusBlock2ImageUrl ?
                      <div className="about__img relative">
                        <Img
                          type="img"
                          src={data[3]?.block2?.aboutusBlock2ImageUrl}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contained",
                          }}
                          className="r-3 lg-r-5 absolute image-cover"
                          alt={data[4]?.block3?.block1Text}
                        />
                        <div style={{paddingTop: '76.39%', width: '100%'}}></div>
                      </div>
                      : <></>
                  }
                </div>
                : <></>
            }
            {
              data[4]?.block3?.block1Text || data[4]?.block3?.block1Content ?
                <div className="aboutus__section__one ">
                  <div className="md-py-12 py-4 px-8 line-6">
                    {
                      data[4]?.block3?.block1Text ?
                        <h4 className="fs-20 fw-600 pb-4">{data[4]?.block3?.block1Text}</h4>
                        : <></>
                    }
                    {
                      data[4]?.block3?.block1Content ?
                        <p className="pb-4 fs-15 line-6" dangerouslySetInnerHTML={{__html:data[4]?.block3?.block1Content}}/>
                          
                        : <></>
                    }
                  </div>
                </div>
                : <></>
            }
            {
              data[5]?.block4?.block4Text || data[5]?.block4?.block4Content || data[5]?.block4?.aboutusBlock4ImageUrl ?
                <div className="md-flex md-gap-8 aboutus__section__two center mx-auto middle md-py-16 py-4">
                  {
                    data[5]?.block4?.block4Text || data[5]?.block4?.block4Content ?
                      <div className="xl-w-1/2 px-8 flex center col">
                        {
                          data[5]?.block4?.block4Text ?
                            <h4 className="fs-32 fw-600 pb-4">{data[5]?.block4?.block4Text}</h4>
                            : <></>
                        }
                        {
                          data[5]?.block4?.block4Content ?
                            <p className="pb-4 fs-15 line-6" dangerouslySetInnerHTML={{__html:data[5]?.block4?.block4Content}}/>
                            
                            : <></>
                        }
                      </div>
                      : <></>
                  }
                  {
                    data[5]?.block4?.aboutusBlock4ImageUrl ?
                      <div className="about__img relative">
                        <Img
                          type="img"
                          src={data[5]?.block4?.aboutusBlock4ImageUrl}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contained",
                          }}
                          className="r-3 lg-r-5 absolute image-cover"
                          alt={data[6]?.block5?.block5Text}
                        />
                        <div style={{paddingTop: '76.39%', width: '100%'}}></div>
                      </div>
                      : <></>
                  }
                </div>
                : <></>
            }
            {
              data[6]?.block5?.block5Text || data[6]?.block5?.block5Content1 || data[6]?.block5?.block5Content2 || data[6]?.block5?.block5Content3 || data[6]?.block5?.block5Content4 ?
                <div className="aboutus__section__one r-3 lg-r-5 xl-py-4 main__section">
                  <div className="md-py-12 py-4 px-8 line-6">
                    {data[6]?.block5?.block5Text ? <h4 className="fs-20 fw-600 pb-4">{data[6]?.block5?.block5Text}</h4> : <></>}
                    {data[6]?.block5?.block5Content1 ? <p className="pb-4 fs-15 pb-4" dangerouslySetInnerHTML={{__html:data[6]?.block5?.block5Content1}}/> : <></>}
                    {data[6]?.block5?.block5Content2 ? <p className="pb-4 fs-15 pb-4" dangerouslySetInnerHTML={{__html:data[6]?.block5?.block5Content2}}/> : <></>}
                    {data[6]?.block5?.block5Content3 ? <p className="pb-4 fs-15 pb-4" dangerouslySetInnerHTML={{__html:data[6]?.block5?.block5Content3}}/>: <></>}
                    {data[6]?.block5?.block5Content4 ? <p className=" fs-15 " dangerouslySetInnerHTML={{__html:data[6]?.block5?.block5Content4}}/>: <></>}
                  </div>
                </div>
                : <></>
            }
            {
              data[7]?.block6?.block6Text || data[7]?.block6?.block6Content || data[7]?.block6?.aboutusBlock6ImageUrl ?
                <div className="md-flex md-gap-8 aboutus__section__two center mx-auto middle md-py-16 py-4">
                  {
                    data[7]?.block6?.block6Text || data[7]?.block6?.block6Content ?
                      <div className="xl-w-1/2 px-8 flex center col">
                        {data[7]?.block6?.block6Text ? <h4 className="fs-32 fw-600 pb-4">{data[7]?.block6?.block6Text}</h4> : <></>}
                        {data[7]?.block6?.block6Content ? <p className="pb-4 fs-15 line-6" dangerouslySetInnerHTML={{__html:data[7]?.block6?.block6Content}}/> : <></>}
                      </div>
                      : <></>
                  }
                  {
                    data[7]?.block6?.aboutusBlock6ImageUrl ?
                      <div className="about__img relative">
                        <Img
                          type="img"
                          src={data[7]?.block6?.aboutusBlock6ImageUrl}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contained",
                          }}
                          className="r-3 lg-r-5 absolute image-cover"
                          alt={data[7]?.block6?.block6Text}
                        />
                        <div style={{paddingTop: '76.39%', width: '100%'}}></div>
                      </div>
                      : <></>
                  }
                </div>
                : <></>
            }
            {
              data[8]?.block7?.aboutusBlock7ImageUrl || data[8]?.block7?.block7Text || data[8]?.block7?.block7Content1 || data[8]?.block7?.block7Content2 ?
                <div className="md-flex md-gap-8 aboutus__section__two center mx-auto middle md-py-16 py-4">
                  {
                    data[8]?.block7?.aboutusBlock7ImageUrl ?
                      <div className="about__img relative">
                        <Img
                          type="img"
                          src={data[8]?.block7?.aboutusBlock7ImageUrl}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contained",
                          }}
                          className="r-3 lg-r-5 absolute image-cover"
                          alt={data[8]?.block7?.block7Text}
                        />
                        <div style={{paddingTop: '76.39%', width: '100%'}}></div>
                      </div>
                      : <></>
                  }
                  {
                    data[8]?.block7?.block7Text || data[8]?.block7?.block7Content1 || data[8]?.block7?.block7Content2 ?
                      <div className="xl-w-1/2 px-8 flex center col">
                        {data[8]?.block7?.block7Text ? <h4 className="fs-32 fw-600 pb-4">{data[8]?.block7?.block7Text}</h4> : <></>}
                        {data[8]?.block7?.block7Content1 ? <p className="pb-4 fs-15 line-6 pb-4" dangerouslySetInnerHTML={{__html:data[8]?.block7?.block7Content1}}/> : <></>}
                        {data[8]?.block7?.block7Content2 ? <p className="pb-4 fs-15 line-6" dangerouslySetInnerHTML={{__html:data[8]?.block7?.block7Content2}}/> : <></>}
                      </div>
                      : <></>
                  }
                </div>
                : <></>
            }
            {
              data[9]?.block8?.block8Text || data[9]?.block8?.block8Content1 || data[9]?.block8?.block8Content2 ?
                <div className="aboutus__section__one xl-py-4 ">
                  <div className="md-py-12 py-4 px-8 line-6">
                    {data[9]?.block8?.block8Text ? <h4 className="fs-20 fw-600 pb-4">{data[9]?.block8?.block8Text}</h4> : <></>}
                    {data[9]?.block8?.block8Content1 ? <div className="pb-4 fs-15 pb-4" dangerouslySetInnerHTML={{
            __html: data[9]?.block8?.block8Content1}}/> : <></>}
                  
                    {data[9]?.block8?.block8Content2 ? <div className="pb-4 fs-15 pb-4"  dangerouslySetInnerHTML={{
            __html: data[9]?.block8?.block8Content2}}/> : <></>}
                  </div>
                </div>
                : <></>
            }
            {
              data[10]?.block9?.aboutusBlock9ImageUrl || data[10]?.block9?.block9Text || data[10]?.block9?.block9Content ?
                <div className="md-flex md-gap-8 aboutus__section__two center mx-auto middle md-py-16 py-4">
                  {
                    data[10]?.block9?.aboutusBlock9ImageUrl ?
                      <div className="about__img relative">
                        <Img
                          type="img"
                          src={data[10]?.block9?.aboutusBlock9ImageUrl}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contained",
                          }}
                          className="r-3 lg-r-5 absolute image-cover"
                          alt={data[10]?.block9?.block9Text}
                        />
                        <div style={{paddingTop: '76.39%', width: '100%'}}></div>
                      </div>
                      : <></>
                  }
                  {
                    data[10]?.block9?.block9Text || data[10]?.block9?.block9Content ?
                      <div className="xl-w-1/2 px-8 flex center col">
                        {data[10]?.block9?.block9Text ? <h4 className="fs-32 fw-600 pb-4">{data[10]?.block9?.block9Text}</h4> : <></>}
                        {data[10]?.block9?.block9Content ? <p className="pb-4 fs-15 line-6" dangerouslySetInnerHTML={{
            __html: data[10]?.block9?.block9Content}}/> : <></>}
                      </div>
                      : <></>
                  }
                </div>
                : <></>
            }
            {
              data[11]?.block10?.block10Text || data[11]?.block10?.block10Content ?
                <div className="aboutus__section__one xl-py-4 main__section">
                  <div className="md-py-12 py-4 px-8 line-6">
                    {data[11]?.block10?.block10Text ? <h4 className="fs-20 fw-600 pb-4">{data[11]?.block10?.block10Text}</h4> : <></>}
                    {data[11]?.block10?.block10Content ? <p className="pb-4 fs-15 line-6" dangerouslySetInnerHTML={{__html:data[11]?.block10?.block10Content}}/> : <></>}
                  </div>
                </div>
                : <></>
            }
            {
              data[12]?.block11?.block11Text || data[12]?.block11?.block11Content || data[12]?.block11?.aboutusBlock11ImageUrl ?
                <div className="md-flex md-gap-8 aboutus__section__two center mx-auto middle md-py-16 py-4">
                  {
                    data[12]?.block11?.block11Text || data[12]?.block11?.block11Content ?
                      <div className="xl-w-1/2 px-8 flex center col">
                        {data[12]?.block11?.block11Text ? <h4 className="fs-32 fw-600 pb-4">{data[12]?.block11?.block11Text}</h4> : <></>}
                        {data[12]?.block11?.block11Content ? <p className="pb-4 fs-15 line-6" dangerouslySetInnerHTML={{__html:data[12]?.block11?.block11Content}}/>
                           : <></>}
                      </div>
                      : <></>
                  }
                  {
                    data[12]?.block11?.aboutusBlock11ImageUrl ?
                      <div className="about__img relative ">
                        <Img
                          type="img"
                          src={data[12]?.block11?.aboutusBlock11ImageUrl}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contained",
                          }}
                          className="r-3 lg-r-5 absolute image-cover"
                          alt={data[12]?.block11?.block11Text}
                        />
                        <div style={{paddingTop: '76.39%', width: '100%'}}></div>
                      </div>
                      : <></>
                  }
                </div>
                : <></>
            }
          </div>
      }
    </React.Fragment>
  );
};

export default memo(AboutUs);

const LoadingBlock = ({ reverse = "" }) => {
  return (
    <div className={`flex col md-flex md-row gap-8 mx-auto py-5 md-py-0 md-py-16 py-4 ${reverse}`}>
      <div className="w-1/1 md-w-1/2 px-8 flex center col">
        <div className="flex col gap-1 w-1/1">
          <LineLoader width="250px" height="42px" className="mb-4" />
          <SkeletonLoader length={5} />
        </div>
      </div>
      <div className="w-1/1 md-w-1/2 about__img relative">
        <SkeletonImg
          animation="pulse"
          width="100%"
          height="369px"
          style={{ borderRadius: "20px" }}
        />
      </div>
    </div>
  );
};