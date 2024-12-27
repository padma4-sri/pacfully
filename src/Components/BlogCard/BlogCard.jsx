import Img from 'Components/Img';
import { SkeletonImg, SkeletonLoader } from 'Components/Skeletion';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import "./styles.scss";

const BlogCard = ({ item = {}, loading = true, isHome = false, state }) => {

    return (
        loading ?
            <div className="blogCard">
                <div className="flex r-3 lg-r-5 mb-8 w-1/1 h-1/1 relative">
                    <div
                        className='block absolute w-1/1 h-1/1'>
                        <SkeletonImg
                            animation="pulse"
                            style={{ borderRadius: "20px" }}
                        />
                    </div>
                    <div style={{ paddingTop: '67.07%', width: '100%' }}></div>
                </div>
                <div className="flex col">
                    <SkeletonLoader width="60%" className='mb-4' />
                    <SkeletonLoader length={2} height="30px" />
                    <div className='flex col gap-1 fs-15 line-7 mt-5'>
                        <SkeletonLoader length={4} />
                    </div>
                </div>
            </div>
            :
            <div className="blogCard">
                <div className="flex overflow-hidden r-3 lg-r-5 mb-8">
                    <Link
                        to={`/blog/${isHome ? item?.urley : item?.post_url}`}
                        state={state}
                        aria-label={isHome ? item?.name : item?.post_title}
                        className='relative w-1/1 h-1/1'>
                        <Img src={isHome ? item?.featuredImage : item?.featured_image} className='absolute image-cover' alt={isHome ? item?.name : item?.post_title} />
                        <div style={{ paddingTop: '67.07%', width: '100%' }} />
                    </Link>
                </div>
                <div className="flex col blogText">
                    <p className='title fs-13 pb-3 lightcolor'>{isHome ? item?.authorName : item?.author_name}</p>
                    <Link
                        className='mb-5 title fs-24 fw-700 line-9'
                        state={state}
                        aria-label={isHome ? item?.name : item?.post_title}
                        to={`/blog/${isHome ? item?.urley : item?.post_url}`}>{isHome ? item?.name : item?.post_title}</Link>
                    <div className='fs-15 line-7 text__ellipse blogContent' dangerouslySetInnerHTML={{ __html: isHome ? item?.shortContent : item?.short_content }} />
                </div>
            </div>
    )
}

export default memo(BlogCard);