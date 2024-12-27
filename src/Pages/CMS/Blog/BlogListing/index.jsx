import React, { useEffect, useMemo, useState, useContext, useRef, memo } from 'react';
import DomainContext from "Context/DomainContext";
import Breadcrumb from 'Components/Breadcrumb';
import '../styles.scss';
import Img from 'Components/Img';
import Button from 'Components/Common/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { APIQueryGet } from 'APIMethods/API';
import { useKeenSlider } from "keen-slider/react";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import useScrollToTop from 'Components/Hooks/useScrollToTop';
import Seo from 'Components/Seo/Seo';
import { LineLoader, SkeletonImg, SkeletonLine, SkeletonLoader } from 'Components/Skeletion';
import BlogCard from 'Components/BlogCard/BlogCard';

const BlogListing = () => {
    useScrollToTop();
    const { defaultURL, storeId } = useContext(DomainContext);
    const location = useLocation();
    const navigate = useNavigate();
    const APIRef = useRef(false);
    const [numCount, setNumCount] = useState(6);
    const [productsData, setProductsData] = useState([]);
    const [wishCount, setWishCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [blogList, setBlogList] = useState({});
    const [blogDataAll, setBlogDataAll] = useState([]);
    const [appliedCategory, setAppliedCategory] = useState("");
    const [categories, setCategories] = useState([]);

    const [sliderRef1] = useKeenSlider({
        loop: false,
        mode: "free",
        rtl: false,
        slides: { perView: "auto", spacing: 64 }
    }
    );

    const breadCrumbData = [{
        categoryName: "Blog",
        urlKey: "",
        catId: "",
    }];

    useEffect(() => {
        const all = [{
            category_url: "",
            category_name: "Alle"
        }]
        if (blogList?.[2]?.[0]?.categories?.length) {
            let data = all.concat(blogList?.[2]?.[0]?.categories);
            setCategories(data);
        }
    }, [blogList]);

    // paginationHandler
    const paginationHandler = () => {
        setCurrentPage(currentPage + 1);
    };

    useMemo(() => {
        // pagination count
        let data = 6 * (currentPage === 1 ? 1 : currentPage);
        if (
            (currentPage === 1 ? 1 : currentPage) &&
            wishCount >= data
        ) {
            setNumCount(data);
        } else if (
            wishCount >= 6 &&
            (currentPage === 1 ? 1 : currentPage) > 0
        ) {
            setNumCount(wishCount);
        } else if (wishCount < 6) {
            setNumCount(wishCount);
        } else {
            setNumCount(6);
        }
    }, [productsData]);

    useMemo(() => {
        if (productsData?.length && !loading) {
            if (!blogDataAll?.length) {
                setBlogDataAll([...blogDataAll, ...productsData]);
            } else if (productsData?.[0]?.id && (blogDataAll?.[0]?.id !== productsData?.[0]?.id)) {
                setBlogDataAll([...blogDataAll, ...productsData]);
            }
        }
    }, [productsData]);

    const options = {
        isLoader: true,
        loaderAction: (bool) => setLoading(bool),
        setGetResponseData: (resData) => {
            setProductsData(resData?.data?.[0]);
            setBlogList(resData?.data);
            setWishCount(resData?.data?.[5]?.[0]?.total_records);
        },
        axiosData: {
            url: `${defaultURL}/getblogdetails?storeId=${storeId}&blogPostUrl=&searchString=&pageNumber=${currentPage}&categoryUrl=${appliedCategory}`,
            
        }
    };

    useEffect(() => {
        if (!APIRef.current) {
            APIQueryGet(options);
            APIRef.current = true;
            setTimeout(() => APIRef.current = false, 200);
        }
    }, [location, currentPage, appliedCategory]);

    useMemo(() => {
        setBlogList([]);
        setProductsData([]);
        setBlogDataAll([]);
        setCurrentPage(1);
        setNumCount(6);
        setAppliedCategory('');
    }, [location]);

    return (
        <React.Fragment>
            <Seo
                metaTitle={blogList?.[6]?.metaTitle}
                metaDescription={blogList?.[6]?.metaDescription}
                metaKeywords={blogList?.[6]?.metaKeywords}
            />
            <div className='blog__page pt-4 pb-10'>
                <Breadcrumb data={breadCrumbData} />
                <div className='page__container container px-4 pt-6 flex col'>
                    {
                        loading && !categories?.length ?
                            <div className="categories mb-13 lg-mb-18">
                                <SkeletonLoader width="100px" height="26px" pclassName="flex gap-2" length={2} full={true} />
                            </div>
                            :
                            <div className="categories">
                                {
                                    categories && categories?.length ?
                                        <div
                                            ref={sliderRef1}
                                            className="keen-slider sliderLeftRightVisible mb-13 lg-mb-18"
                                            style={{ maxWidth: "100%" }}
                                        >
                                            {
                                                categories?.map((item, index) => (
                                                    <div
                                                        className={`keen-slider__slide number-slide${index + 1}`}
                                                        key={`blogCategories${index}`}
                                                    >
                                                        <Button
                                                            className={`fs-20 fw-700 text-nowrap ${appliedCategory === item?.category_url ? 'active' : ''} ${((index === 0) && (!appliedCategory)) ? 'active' : ''}`}
                                                            onClick={() => {
                                                                setAppliedCategory(item?.category_url);
                                                                setBlogList([]);
                                                                setProductsData([]);
                                                                setBlogDataAll([]);
                                                                setCurrentPage(1);
                                                                setNumCount(6);
                                                            }}
                                                        >{item?.category_name}</Button>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        : <></>
                                }
                            </div>
                    }
                    {
                        loading ?
                            <div className="flex col lg-flex lg-row gap-12 lg-gap-14 pb-5 lg-pb-10">
                                <div className="flex relative flex-1 image__block overflow-hidden r-3 lg-r-5">
                                    <Link className='absolute block fs-24 line-9 pb-5 fw-700 w-1/1 h-1/1' aria-label={"skeleton"}>
                                        <SkeletonImg
                                            animation="pulse"
                                            style={{ borderRadius: "20px" }}
                                        />
                                    </Link>
                                    <div style={{ paddingTop: '67.21%', width: '100%' }}></div>
                                </div>
                                <div className="flex col flex-1">
                                    <LineLoader width="250px" className="mb-4" />
                                    <LineLoader width="90%" height="36px" className="mb-5" />
                                    <SkeletonLoader length={8} pclassName='flex col gap-1 mb-4' />
                                    <LineLoader width="160px" height="46px" className="mb-5" borderRadius="36px" />
                                </div>
                            </div>
                            :
                            blogDataAll?.length ?
                                <div className="flex col lg-flex lg-row gap-12 lg-gap-14 pb-5 lg-pb-10">
                                    <div className="flex relative flex-1 image__block overflow-hidden r-3 lg-r-5">
                                        <Link className='block fs-24 line-9 pb-5 fw-700' to={`/blog/${blogDataAll?.[0]?.post_url}`}aria-label={blogDataAll?.[0]?.post_title} state={{ categoryUrl: blogDataAll?.[0]?.category_url ? blogDataAll?.[0]?.category_url : appliedCategory }}>
                                            <Img src={blogDataAll?.[0]?.featured_image} className='absolute' alt={blogDataAll?.[0]?.post_title} />
                                        </Link>
                                        <div style={{ paddingTop: '67.21%', width: '100%' }}></div>
                                    </div>
                                    <div className="flex col flex-1">
                                        <p className='fs-12 line-5 pb-4 lightcolor'>door {blogDataAll?.[0]?.author_name}</p>
                                        <Link className='block fs-24 line-9 pb-5 fw-700' to={`/blog/${blogDataAll?.[0]?.post_url}`} aria-label={blogDataAll?.[0]?.post_title}state={{ categoryUrl: blogDataAll?.[0]?.category_url ? blogDataAll?.[0]?.category_url : appliedCategory }}>{blogDataAll?.[0]?.post_title}</Link>
                                        <div className='fs-15 line-7 mb-4 text__ellipse' dangerouslySetInnerHTML={{ __html: blogDataAll?.[0]?.short_content }}></div>
                                        <Button
                                            className='py-3 px-9 r-9 fw-700 mt-6'
                                            onClick={() => navigate(
                                                `/blog/${blogDataAll?.[0]?.post_url}`,
                                                {
                                                    state: {
                                                        categoryUrl: blogDataAll?.[0]?.category_url ? blogDataAll?.[0]?.category_url : appliedCategory
                                                    }
                                                })}
                                        >Lees meer</Button>
                                    </div>
                                </div>
                                : <></>
                    }
                    {
                        blogDataAll?.slice(1)?.length ?
                            <div className="listing flex gap-y-12 lg-gap-y-15 wrap pt-10">
                                {
                                    blogDataAll?.slice(1)?.map((item, ind) => (
                                        <div className="items" key={`blogdetails${ind}`}>
                                            <BlogCard
                                                item={item}
                                                loading={false}
                                                state={{
                                                    categoryUrl: item?.category_url ? item?.category_url : appliedCategory
                                                }}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                            : <></>
                    }
                    {
                        loading ?
                            <div className="listing flex gap-y-12 lg-gap-y-15 wrap pt-10">
                                {
                                    ["", "", "", "", "", ""]?.map((item, ind) => (
                                        <div className="items" key={`blogdetails${ind}`}>
                                            <BlogCard
                                                item={item}
                                                loading={true}
                                                state={null}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                            : <></>
                    }
                    {
                        loading ?
                            <div className="flex center pt-15 lg-pt-21">
                                <SkeletonLine
                                    animation="pulse"
                                    width="235px"
                                    height="46px"
                                    style={{ borderRadius: "36px" }}
                                />
                            </div>
                            :
                            numCount === wishCount ?
                                <></> :
                                <div className="flex center pt-15 lg-pt-21">
                                    <Button
                                        className={`py-3 px-7 r-9 fw-700 outlined ${loading ? 'rotateUpdate' : ''}`}
                                        variant="outlined"
                                        disabled={
                                            numCount === wishCount
                                                ? true
                                                : false
                                        }
                                        onClick={() => paginationHandler()}
                                    >{loading ? <AutorenewIcon /> : "Laad meer artikelen"}</Button>
                                </div>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

export default memo(BlogListing);