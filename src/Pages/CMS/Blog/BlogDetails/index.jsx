import React, { useEffect, useState, useContext, memo, useRef } from 'react';
import DomainContext from "Context/DomainContext";
import Breadcrumb from 'Components/Breadcrumb';
import '../styles.scss';
import Img from 'Components/Img';
import { useLocation } from 'react-router-dom';
import { APIQueryGet } from 'APIMethods/API';
import { WhatsappShareButton, LinkedinShareButton, FacebookShareButton } from 'react-share';
import { useKeenSlider } from "keen-slider/react";
import useScrollToTop from 'Components/Hooks/useScrollToTop';
import Seo from 'Components/Seo/Seo';
import { LineLoader, SkeletonImg, SkeletonLoader } from 'Components/Skeletion';
import BlogCard from 'Components/BlogCard/BlogCard';
import { useWindowSize } from 'Utilities';

const BlogDetails = () => {
    useScrollToTop();
    const [width] = useWindowSize();
    const { defaultURL, storeId } = useContext(DomainContext);
    const location = useLocation();
    const [url, setUrl] = useState("");
    const [blogList, setBlogList] = useState({});
    const APIRef = useRef(false);
    const [loading, setLoading] = useState(true);
    const [categoryUrl, setCategoryUrl] = useState('');
    const [sliderRef1] = useKeenSlider({
        loop: false,
        mode: "free",
        rtl: false,
        slides: { perView: "auto", spacing: width <= 1024 ? 30 : 64 }
    }
    );
    const breadCrumbData = [
        {
            categoryName: "Blog",
            urlKey: "/blog",
            catId: "",
        } ,
        //commented for purpose
        // {
        //     categoryName: categoryUrl ? categoryUrl : "",
        //      urlKey: "",
        //     catId: "",
        // } ,
        {
            categoryName: location?.pathname
                ?.slice(6) 
                ?.replace(/-/g, ' ') 
                ?.replace(/\.html$/, ''),
            urlKey: "",
            catId: "",
        }
        

    ];
    const options = {
        isLoader: true,
        loaderAction: (bool) => setLoading(bool),
        setGetResponseData: (resData) => {
            setBlogList(resData?.data);
            const extractedCategoryUrl = resData?.data?.[2]?.[0]?.categories?.[0]?.category_url || 'blog';
                        setCategoryUrl(extractedCategoryUrl);
        },
        axiosData: {
            url: `${defaultURL}/getblogdetails?storeId=${storeId}&pageNumber=1&searchString=&blogPostUrl=${location?.pathname?.slice(6)}&categoryUrl=${location?.state?.categoryUrl ? location?.state?.categoryUrl : ''}`,
           
        }
    };
    useEffect(() => {
        setUrl(window.location.href);
    }, [location]);

    useEffect(() => {
        if (!APIRef.current) {
            APIQueryGet(options);
            APIRef.current = true;
            setTimeout(() => APIRef.current = false, 200);
        }
        window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
    }, [location, location?.state?.categoryUrl]);
    return (
        <React.Fragment>
            <Seo
                metaTitle={blogList?.[6]?.metaTitle}
                metaDescription={blogList?.[6]?.metaDescription}
                metaKeywords={blogList?.[6]?.metaKeywords}
            />
            <div className='blog__page blog__page__details pt-4'>
                <Breadcrumb data={breadCrumbData} />
                <div className='page__container container px-4 pt-6 flex col'>
                    {
                        loading ?
                            <div className="details">
                                <div className="blog__container mx-auto pb-8 lg-pb-13">
                                    <SkeletonLoader length={2} height="30px" pclassName="flex col middle gap-1 mb-9" />
                                    <div className='flex col gap-1 middle fs-15 line-8 tc px-4'>
                                        <SkeletonLoader length={6} pclassName="flex col gap-1 middle mx-auto w-1/1" />
                                    </div>
                                    <div className="author pt-8 center flex middle gap-4">
                                        <LineLoader width="40px" height="40px" />
                                        <LineLoader width="150px" />
                                    </div>
                                </div>
                                <div className="blog__image relative mt-8 lg-mt-13 mb-5 lg-mb-8">
                                    <SkeletonImg
                                        animation="pulse"
                                        width="100%"
                                        height="474px"
                                        style={{ borderRadius: "10px" }}
                                    />
                                </div>
                                <div className="blog__container description mx-auto pb-7 lg-pb-13 pt-8 flex col gap-2">
                                    <SkeletonLoader length={12} pclassName="flex col gap-1 middle mx-auto w-1/1" />
                                    <LineLoader height="35px" className='my-7' />
                                    <SkeletonLoader length={12} pclassName="flex col gap-1 middle mx-auto w-1/1" />
                                </div>
                                <div className="blog__container mx-auto author__details py-9 my-8 lg-my-16 flex col md-flex md-row space-between md-middle gap-5">
                                    <div className="center flex md-flex md-middle gap-6">
                                        <LineLoader width="80px" height="80px" />
                                        <SkeletonLoader length={2} width="150px" />
                                    </div>
                                    <div className="social flex center middle gap-6">
                                        <LineLoader width="150px" />
                                        <SkeletonLoader length={2} width="36px" height="36px" borderRadius="50%" full={true} className="item" pclassName="flex row gap-2" />
                                    </div>
                                </div>
                                <div className="recent__listing py-8 lg-py-16">
                                    <LineLoader width="250px" height="36px" className='mb-15 lg-mb-22 mx-auto' />
                                    <div className="item flex gap-10">
                                        <div
                                            ref={sliderRef1}
                                            className="keen-slider sliderLeftRightVisible"
                                            style={{ maxWidth: "100%" }}
                                        >
                                            {
                                                ['', '', '']?.map((item, index) => (
                                                    <div
                                                        className={`keen-slider__slide number-slide${index + 1}`}
                                                        key={`recentBlogCategories${index}`}
                                                    >
                                                        <BlogCard item={item} loading={true} state={null} />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : <></>
                    }
                    {
                        !loading ?
                            <div className="details">
                                <div className="blog__container mx-auto pb-8 lg-pb-13">
                                    <h1 className='fw-700 line-13 lg-line-17 tc pb-9'>{blogList?.[0]?.[0]?.post_title}</h1>
                                    <div className='fs-15 line-8 tc px-4' dangerouslySetInnerHTML={{ __html: blogList?.[0]?.[0]?.short_content }}></div>
                                    <div className="author pt-8 center flex middle gap-4">
                                        <div className="relative">
                                            <Img src={blogList?.[0]?.[0]?.author_image} alt={blogList?.[0]?.[0]?.author_name} />
                                        </div>
                                        <p className='fs-15 line-6'>door <b className='fw-700'>{blogList?.[0]?.[0]?.author_name}</b></p>
                                    </div>
                                </div>
                                <div className="blog__image relative mt-8 lg-mt-13 mb-5 lg-mb-8">
                                    <Img src={blogList?.[0]?.[0]?.featured_image} className='r-5' alt={blogList?.[0]?.[0]?.post_title} />
                                </div>
                                <div className="blog__container description mx-auto pb-7 lg-pb-13 pt-8">
                                    <div className='fs-15 line-8' dangerouslySetInnerHTML={{ __html: blogList?.[0]?.[0]?.content }}></div>
                                </div>
                                <div className="blog__container mx-auto author__details py-9 my-8 lg-my-10 flex col md-flex md-row space-between md-middle gap-5">
                                    <div className="center flex md-flex md-middle gap-6 blog_author">
                                        <div className="relative">
                                            <Img src={blogList?.[0]?.[0]?.author_image} alt={blogList?.[0]?.[0]?.author_name} />
                                        </div>
                                        <div className="flex col">
                                            <p className='fs-15 line-6'>Geschreven door</p>
                                            <p className='fs-15 line-6'><b className='fw-700'>{blogList?.[0]?.[0]?.author_name}</b></p>
                                    <p className='fs-15 line-8' dangerouslySetInnerHTML={{ __html: blogList?.[0]?.[0]?.author_full_bio }}/>
                                        </div>
                                    </div>
                                   
                                </div>

                                <div className="social flex center middle gap-6  mx-auto  py-2 my-8 lg-my-4 flex col md-flex md-row right md-middle gap-5">
                                        <p className='fs-15 line-6'>Deel artikel</p>
                                        <div className="flex gap-2">
                                            <div className="item">
                                                <div className="default relative">
                                                    <FacebookShareButton url={url}>
                                                        <Img src={blogList?.[0]?.[0]?.socialLinks?.faceBook} alt="Blog facebook share" />
                                                    </FacebookShareButton>
                                                </div>
                                                <div className="hover relative">
                                                    <FacebookShareButton url={url}>
                                                        <Img src={blogList?.[0]?.[0]?.socialLinks?.faceBookHover} alt="Blog facebook share" />
                                                    </FacebookShareButton>
                                                </div>
                                            </div>
                                            <div className="item">
                                                <div className="default relative">
                                                    <LinkedinShareButton url={url}>
                                                        <Img src={blogList?.[0]?.[0]?.socialLinks?.linkedIn} alt="Blog linkedin share" />
                                                    </LinkedinShareButton>
                                                </div>
                                                <div className="hover relative">
                                                    <LinkedinShareButton url={url}>
                                                        <Img src={blogList?.[0]?.[0]?.socialLinks?.linkedInHover} alt="Blog linkedin share" />
                                                    </LinkedinShareButton>
                                                </div>
                                            </div>
                                            <div className="item">
                                                <div className="default relative">
                                                    <WhatsappShareButton url={url}>
                                                        <Img src={blogList?.[0]?.[0]?.socialLinks?.whatsapp} alt="Blog whatsaap share" />
                                                    </WhatsappShareButton>
                                                </div>
                                                <div className="hover relative">
                                                    <WhatsappShareButton url={url}>
                                                        <Img src={blogList?.[0]?.[0]?.socialLinks?.whatsappHover} alt="Blog whatsaap share" />
                                                    </WhatsappShareButton>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                {
                                    blogList?.[1]?.recent_posts && blogList?.[1]?.recent_posts?.length ?
                                        <div className="recent__listing py-8 lg-py-16">
                                            <h2 className='fs-28 line-10 fw-700 tc w-1/1 pb-15 lg-pb-22'>Deze vind je misschien ook leuk</h2>
                                            <div className="item flex gap-10">
                                                <div
                                                    ref={sliderRef1}
                                                    className="keen-slider sliderLeftRightVisible"
                                                    style={{ maxWidth: "100%" }}
                                                >
                                                    {
                                                        blogList?.[1]?.recent_posts?.map((item, index) => (
                                                            <div
                                                                className={`keen-slider__slide number-slide${index + 1}`}
                                                                key={`recentBlogCategories${index}`}
                                                            >
                                                                <BlogCard
                                                                    item={item}
                                                                    loading={false}
                                                                    state={{
                                                                        categoryUrl: item?.category_url ? item?.category_url : ""
                                                                    }}
                                                                />
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        : <></>
                                }
                            </div>
                            : <></>
                    }
                </div>
            </div >
        </React.Fragment>
    )
}

export default memo(BlogDetails);