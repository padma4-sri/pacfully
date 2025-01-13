import "./styles.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import BlogCard from "Components/BlogCard/BlogCard";
import { useWindowSize } from "Utilities";

const Blog = () => {
  const [width] = useWindowSize();
  const homePageLoading = useSelector(state => state?.homePageLoading);
  const getBlogs = useSelector((state) => state?.getHomePageData?.data?.blogs);
  const [sliderRef1] = useKeenSlider({
    loop: false,
    mode: "free",
    rtl: false,
    slides: { perView: "auto", spacing: width <= 1024 ? 30 : 65 }
  });
  const [sliderRef2] = useKeenSlider({
    initial: 0,
    loop: false,
    mode: "free",
    rtl: false,
    slides: { perView: "auto", spacing: width <= 1024 ? 30 : 65 }
  });

  const dataBlockEmpty = ["", "", ""]?.map((item, index) => (
    <div
      className={`keen-slider__slide number-slide${index + 1}`}
      key={`home_empty_blogs${index}`}
    >
      <BlogCard item={item} loading={homePageLoading} state={null} />
    </div>
  ))
  const dataBlock = getBlogs?.map((item, index) => (
    <div
      className={`keen-slider__slide number-slide${index + 1}`}
      key={`home__blogs${index}`}
    >
      <BlogCard
        item={item}
        loading={homePageLoading}
        isHome={true}
        state={{
          categoryUrl: item?.category_url ? item?.category_url : null
        }}
      />
    </div>
  ));
  return (
    <div className="blogs__container">
      <div className="container pt-6 md-pt-6 xl-pt-8 pb-8 md-pb-10 xl-pb-12 px-4 xxl-px-4">
        <div className="title__section flex space-between pb-6">
          <h1 className="fw-700 line-9 fs-30"><Link to="/blog"aria-label={"blog"} className="fw-700 line-9 fs-30">Blog</Link></h1>
        </div>
        <div className="slider__wrapper">
          {
            homePageLoading ?
              <div ref={sliderRef2} className="keen-slider" style={{ maxWidth: "100%" }}>
                {dataBlockEmpty}
              </div> :
              getBlogs?.length ? <div ref={sliderRef1} className="keen-slider" style={{ maxWidth: "100%" }}>
                {dataBlock}
              </div> : <></>
          }
        </div>
      </div>
    </div>
  );
};

export default Blog;
