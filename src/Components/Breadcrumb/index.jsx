import React, { memo } from "react";
import { Link } from "react-router-dom";
import "./styles.scss";
import { SkeletonLine } from "Components/Skeletion";
import AdvancedLink from "Components/AdvancedLink";
const Breadcrumb = ({ type, key, loading = false, data }) => {
  const newObj = {
    categoryName: "home",
    urlKey: "/",
    catId: "",
  };
  const updatedData = data ? [newObj, ...data] : [newObj];
  const dataBlock = updatedData?.map((elem, ind) => (
    <div
      className={`item flex middle gap-1 border_sm`}
      key={`Breadcrumb__${key}${ind}`}
    >
      <div className="divider lg-hide-divider">{`<`}</div>
      {/* <Link
        className="link fs-14 lg-fs-13"
        to={`${elem?.urlKey}`}
        aria-label={elem?.categoryName}
        state={elem?.urlType?.level ? { urlType: elem?.urlType } : undefined}
      > */}
         <AdvancedLink
         className="link fs-14 lg-fs-13"
         to={`${elem?.urlKey}`}
         aria-label={elem?.categoryName}    
         state={{
          categoryData: {
            catId: elem?.catId,
            catUrl: elem?.url_key,
          },
          urlType: elem?.urlType,
        }}
            >
        {elem?.categoryName}

            </AdvancedLink>
      {/* </Link> */}
      {updatedData?.length !== ind + 1 ? (
        <div className="divider hide-on-mobile">{`>`}</div>
      ) : (
        ""
      )}
    </div>
  ));

  return (
    <div className="breadcrumbs__container container px-4 pb-4">
      <div className="breadcrumbs__wrapper">
        {loading && !data?.length ? (
          <div className="breadcrumbs__block flex gap-5 wrap">
            {["", ""]?.map((elem, ind) => (
              <div
                className="item flex middle gap-1"
                key={`skeleton__${type}${ind}`}
              >
                <SkeletonLine width="100px" height="21px" />
              </div>
            ))}
          </div>
        ) : (
          <div className="breadcrumbs__block flex middle gap-1">
            {dataBlock}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Breadcrumb);
