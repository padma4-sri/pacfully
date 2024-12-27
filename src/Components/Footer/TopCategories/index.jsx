import React, { memo, useContext, useEffect, useState } from "react";
import "./styles.scss";
import { Link } from "react-router-dom";
import { Toggleup, Toggledown } from "Res/icons";
import { useWindowSize } from "Utilities";
import { SkeletonLine } from "Components/Skeletion";
import { useSelector } from "react-redux";
import DomainContext from "Context/DomainContext";
import AdvancedLink from "Components/AdvancedLink";

const TopCategories = () => {
  const { storeId } = useContext(DomainContext);
  const homePageLoading = useSelector((state) => state?.homePageLoading );
  const HeaderFooterDataLoading = useSelector((state) => state?.HeaderFooterDataLoading );
  const getFooterData = useSelector((state) => state?.getHeaderFooterData?.data?.footer?.[0]?.popularCategories );

  const [width, height] = useWindowSize();
  const dataLength = ["", "", "", "", "", "", "", "", "", "", "", ""];
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const toggleAction = (index) => {
    if (selectedCategory === index) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(index);
    }
  };
  const dataBlock =
    homePageLoading && HeaderFooterDataLoading
      ? dataLength?.map((item, index) => (
          <div className="categories__list py-4 active" key={`category__list${index}`}>
            <div className="flex parent md-pb-4">
              <div className="flex-1 pr-3 md-pb-4">
                <SkeletonLine animation="pulse" width="150px" height="26px" />
              </div>
            </div>
            <ul className="flex gap-y-7 md-flex md-gap-y-3 col">
              {["", "", "", "", ""]?.map((items, i) => (
                <li key={`subcategory__list_${index}_${i}`}>
                  <SkeletonLine animation="pulse" height="20px" />
                </li>
              ))}
            </ul>
          </div>
        ))
      : getFooterData?.map((item, index) => (
          <div
            className={`categories__list py-4 ${
              selectedCategory === index && isMobile ? "active" : ""
            }`}
            key={`footer__category__item_${item?.url}_${index}`}
          >
            <div className="flex parent md-pb-4">
              <p className="flex-1 pr-3">
                <AdvancedLink
                  to={new URL(item?.url)?.pathname}
                  className="fw-700"
                  state={{
                    urlType: {
                      "entityType": "category",
                      "level": "2",
                      "isChildExist": 1
                  }
                  }}
                >
                  {item?.mainCategories}
                </AdvancedLink>
              </p>
              {isMobile ? (
                <div
                  className="toggle__arrow  md-hide"
                  onClick={() => toggleAction(index)}
                >
                  {selectedCategory === index ? <Toggleup /> : <Toggledown />}
                </div>
              ) : (
                ""
              )}
            </div>
            {selectedCategory === index || !isMobile ? (
              <ul className="flex gap-y-7 md-flex md-gap-y-3 col">
                {item?.data?.map((menu, ind) => (
                  <li key={`subcategory__item__${item?.url}_${ind}`}>
                    <AdvancedLink to={new URL(menu?.url)?.pathname}  state={{
                   urlType:{
                    "entityType": "category",
                    "level": "3",
                    "isChildExist": 1
                }
                  }} >
                      {menu?.name}
                    </AdvancedLink>
                  </li>
                ))}
              </ul>
            ) : (
              ""
            )}
          </div>
        ));

  useEffect(() => {
    if (width >= 640) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  }, [width, height]);
  return (
    <div className="topcategories__container container-fluid">
      <div className="wrapper container pt-12 pb-7 md-pt-17 px-4">
        {homePageLoading && HeaderFooterDataLoading ? (
          <h1 className="fw-700 pb-3 md-pb-9 w-1/1 md-w-1/2">
            <SkeletonLine animation="pulse" height="40px" />
          </h1>
        ) : (
          <h1 className="fw-700 pb-3 md-pb-9">
            Ontdek alle producten bij  {storeId === 1 ? "Promofit" : "Expofit"}
          </h1>
        )}
        <div className="category__block flex col md-flex md-gap-y-6 md-row md-wrap md-pb-8">
          {dataBlock}
        </div>
      </div>
    </div>
  );
};

export default memo(TopCategories);
