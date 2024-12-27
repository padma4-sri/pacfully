import React, { useState, useEffect, useRef, useContext, memo } from "react";
import DomainContext from "Context/DomainContext";
import Breadcrumb from "Components/Breadcrumb";
import axios from "axios";
import "./styles.scss";
import Rating from "@mui/material/Rating";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import useScrollToTop from "Components/Hooks/useScrollToTop";
import Seo from "Components/Seo/Seo";
import { SkeletonLine, SkeletonLoader } from "Components/Skeletion";

function ReviewListing() {
  useScrollToTop();
  const APIRef = useRef(false);
  const { defaultURL, storeId } = useContext(DomainContext);
  const [data, setData] = useState([]);
  const [itemOffset, setItemOffset] = useState(1);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seoData, setSeoData] = useState({});
  const targetRef = useRef(null);
  const fetchData = async () => {
    const payload = {
      storeId: storeId,
      pageNumber: itemOffset,
    };
    if (loading) {
      setLoading(true);
    }
    const resp = await axios.post(defaultURL + "/getkiyohreviewfeeds", payload);
    setData((prevData) => [...prevData, ...resp?.data[2]]);
    if(!seoData?.metaTitle){
      setSeoData(resp?.data[1]?.seo)
    }
    setLoading(false)
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setItemOffset((prevOffset) => prevOffset + 1);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }
  }, [targetRef]);

  useEffect(() => {
    if (!APIRef.current) {
      fetchData();
      APIRef.current = true;
      setTimeout(() => APIRef.current = false, 200);
    }
  }, [itemOffset]);

  const breadCrumbData = [
    {
      categoryName: "Kiyoh klantbeoordelingen",
      urlKey: "",
      catId: "",
    },
  ];
  function handleItemClick(index) {
    if (details.includes(index)) {
      setDetails((prevItems) => prevItems.filter((item) => item !== index));
    } else {
      setDetails((prevItems) => [...prevItems, index]);
    }
  }

  return (
    <React.Fragment>
      <Seo
        metaTitle={seoData?.metaTitle}
        metaDescription={seoData?.metaDescription}
        metaKeywords={seoData?.metaKeywords}
      />
      <div>
        <div className="pt-4">
          <Breadcrumb data={breadCrumbData} />
        </div>
        <div className="review__listing px-4 container pt-4 pb-8">
          {
            loading ?
              <React.Fragment>
                <h1 className="fs-28 lg-fs-32 fw-700">
                  <SkeletonLine
                    animation="pulse"
                    width="250px"
                    height="42px"
                    style={{ borderRadius: "5px" }}
                  />
                </h1>
                <div className="review__cards flex wrap  gap-y-14  xl-gap-y-16  pt-15">
                  {
                    ['', '', '', '', '', '']?.map((item, index) => (
                      <div className="review__card p-5 relative flex col space-between w-1/1" key={`reviewListingLoader${index}`}>
                        <div>
                          <div className="absolute review__rating px-4 py-2 flex middle">
                            <Rating
                              name="half-rating-read"
                              value={0}
                              precision={0.5}
                              readOnly
                            />
                          </div>
                          <div className="flex right pb-1">
                            <SkeletonLine
                              animation="pulse"
                              width="40px"
                              height="42px"
                              className="badge flex middle center fw-600 r-2 fs-14"
                              style={{ borderRadius: "5px" }}
                            />
                          </div>
                          <SkeletonLine
                            animation="pulse"
                            width="85%"
                            height="28px"
                            className="fs-22 fw-600 mb-3 capitalize"
                            style={{ borderRadius: "5px" }}
                          />
                          <SkeletonLoader length={6} />
                        </div>
                        <SkeletonLoader length={2} pclassName="flex space-between pt-7 gap-5" />
                      </div>
                    ))
                  }
                </div>
              </React.Fragment> :
              <React.Fragment>
                <h1 className="fs-28 lg-fs-32 fw-700">Kiyoh klantbeoordelingen</h1>
                <div className="review__cards flex wrap  gap-y-14  xl-gap-y-16  pt-15">
                  {data?.length ? data?.map((item, index) => (
                    <div className="review__card p-5 relative flex col space-between w-1/1">
                      <div>
                        <div className="absolute review__rating px-4 py-2 flex middle">
                          <Rating
                            name="half-rating-read"
                            value={item?.total / 2}
                            precision={0.5}
                            readOnly
                          />
                        </div>
                        <div className="flex right pb-1">
                          <p className="badge flex middle center fw-600 r-2 fs-14">{item?.total}</p>
                        </div>
                        <h2 className="fs-22 fw-600 pb-3">{item?.one_liner}</h2>
                        <div
                          className="fs-15 line-6"
                          dangerouslySetInnerHTML={{
                            __html: item?.opinion,
                          }}
                        />

                        {item?.response ? (
                          <div className="pt-7">
                            <div
                              className="flex view__more middle pointer"
                              onClick={() => handleItemClick(index)}
                            >
                              <p className="fs-15 fw-600">{details.includes(index) ? "Toon reactie" : "Onze reactie"}</p>
                              {details.includes(index) ? (
                                <KeyboardArrowDownIcon />

                              ) : (
                                <KeyboardArrowUpIcon />

                              )}
                            </div>
                            {details.includes(index) ? (
                              ""
                            ) : (
                              <p className="fs-15 line-6 mb-4 ">{item?.response}</p>
                              
                            )}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="flex space-between pt-7">
                        <div>
                          <p className="date fs-14">{item?.created}</p>
                        </div>
                        <div>
                          <p className="recommend fs-14">
                            <span>{item?.name}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                    : ""}
                </div>
              </React.Fragment>
          }
          <div ref={targetRef}></div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default memo(ReviewListing);
