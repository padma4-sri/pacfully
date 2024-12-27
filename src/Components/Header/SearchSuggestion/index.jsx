import React, { memo, useEffect } from "react";
import "./styles.scss";
import ProductCard from "Components/Productcard";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SkeletonLine } from "Components/Skeletion";
import ModelNew from "Components/Model/ModelNew";
import Button from "Components/Common/Button";
import { useWindowSize } from "Utilities";
import AdvancedLink from "Components/AdvancedLink";

const SuggestionSearch = ({
  loading = true,
  searchKeyword,
  data,
  setShowSuggestion,
  openSearch,
}) => {
  const navigate = useNavigate();

  const size = useWindowSize();

  const searchResultHandler = () => {
    setShowSuggestion(false);
    if (searchKeyword.trim() !== "") {
      let val = searchKeyword.trim();

      const encodedKeyword = encodeURIComponent(val);
      navigate(`/zoeken/zoekterm=${encodedKeyword}`, {
        state: {
          isSearchResult: true,
          value: encodedKeyword,
        },
      });
    }
  };

  const productsDetails =
    size[0] <= 768 ? data?.products?.slice(0, 4) : data?.products;

  return (
    <div className={`suggestion__search ${openSearch ? "" : "open__search"}`}>
      <div className="container pl-6 pr-5 xxl-pl-6 xxl-pr-0">
        <div className="suggestion__wrapper xl-pt-6 pt-sm-2 pb-8">
          {searchKeyword?.length < 3 ? (
            <div className="msg__block flex center middle py-8">
              <h4 className="fw-500 px-6 py-4 r-2 overflow">
                Waar bent u naar op zoek?
              </h4>
            </div>
          ) : !loading &&
            !data?.products?.length &&
            !data?.category?.length &&
            data?.response?.status === false ? (
            <div className="msg__block flex center middle py-8">
              <h4 className="fw-500 px-6 py-4 r-2 overflow">
                {data?.response?.message}
              </h4>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="flex col left gap-x-15 xl-flex xl-row xl-space-between xl-middle pt-2">
                  <div className="title__block pb-5 xl-pb-0">
                    <SkeletonLine
                      animation="pulse"
                      width="200px"
                      height="35px"
                      style={{ borderRadius: "20px" }}
                    />
                  </div>
                  <div className="seract__item overflow-hidden">
                    <div className="btn__blocks flex middle gap-x-4 nowrap nowrap overflow-hidden overflow-x-auto no-scrollbar xl-flex xl-right">
                      {["", "", "", ""]?.map((elem, ind) => (
                        <div key={`searchCategoryLoadin${ind + 1}`}>
                          <SkeletonLine
                            animation="pulse"
                            width="100px"
                            height="35px"
                            style={{ borderRadius: "20px" }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex col left gap-x-15 xl-flex xl-row pt-2">
                  <div className="title__block flex-0">
                    <h3 className="fw-700 line-9 pb-5 xl-pb-0 text-nowrap">
                      {data?.productCount} resultaten gevonden
                    </h3>
                  </div>
                  <div className="flex-1"></div>
                  <div className="seract__item overflow-hidden overflow-x-auto no-scrollbar">
                    <div className="btn__blocks flex gap-x-4 nowrap">
                      {data?.category?.map((item, index) => (
                        <AdvancedLink
                          className="button r-5"
                          to={`/${item?.urlKey}`}
                          key={`searchSuggetionCategoryLoader${index + 1}`}
                        >
                          {item?.catName}
                        </AdvancedLink>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {/* result */}
              {loading ? (
                <div className="product__reults pt-8">
                  <div className="flex gap-x-7 pb-3 product__reults_MobRes">
                    {["", "", "", ""].map((it, i) => (
                      <React.Fragment key={`searchSuggetionCard${i + 1}`}>
                        <ProductCard
                          loading={true}
                          key={`product_loading_reults_${i}`}
                          pageName="search"
                        />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ) : data?.products?.length ? (
                <div className="product__reults pt-11">
                  <div className="flex gap-x-7 pb-3 product__reults_MobRes">
                    {productsDetails?.map((item, index) => (
                      <React.Fragment key={`searchSuggetionCard${index + 1}`}>
                        <ProductCard
                          data={item}
                          key={`product__reults_${index}`}
                          plp={true}
                          pageName="search"
                        />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {!loading &&
                  !data?.products?.length &&
                  data?.category?.length &&
                  data?.response?.status === false ? (
                    <div className="msg__block flex center middle py-8">
                      <h4 className="fw-500 px-6 py-4 r-2 overflow">
                        {data?.response?.message}
                      </h4>
                    </div>
                  ) : (
                    ""
                  )}{" "}
                </>
              )}

              {/* see all results */}
              {loading ? (
                <div className="see__all__results pt-14 pb-3 tc flex center">
                  <SkeletonLine
                    animation="pulse"
                    className="tc"
                    width="250px"
                    height="50px"
                    style={{ borderRadius: "20px" }}
                  />
                </div>
              ) : data?.products?.length ? (
                <div className="see__all__results pt-4 md-pt-14 pb-3 tc">
                  <Button
                    className="r-5 r-6 fw-700"
                    onClick={() => searchResultHandler()}
                  >
                    Toon alle resultaten
                  </Button>
                </div>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
const SearchSuggestion = ({
  openModel,
  setOpenModel,
  loading,
  searchKeyword,
  searchData,
  setShowSuggestion,
  showSuggestion,
  hideScroll = false,
}) => {
  const location = useLocation();

  useEffect(() => {
    if (showSuggestion) {
      setShowSuggestion(false);
    }
  }, [location]);
  return (
    <div className="search__suggestion__container">
      <ModelNew
        from="top"
        hideScroll={hideScroll}
        zindex={9}
        open={openModel}
        shadow={true}
        setOpen={setOpenModel}
      >
        <SuggestionSearch
          loading={loading}
          searchKeyword={searchKeyword}
          data={searchData}
          setShowSuggestion={setShowSuggestion}
        />
      </ModelNew>
    </div>
  );
};

export default memo(SearchSuggestion);
