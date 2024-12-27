import React, { useState, useContext } from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import useScrollToTop from "Components/Hooks/useScrollToTop";
import { useEffectOnce } from 'Components/Hooks/useEffectOnce';
import { APIQueryGet } from 'APIMethods/API';
import { Link,useNavigate } from "react-router-dom";
import {
    SearchIcon,
    XIcon,
} from "Res/icons";
import IconButton from "@mui/material/IconButton";
import { SkeletonLine } from "Components/Skeletion";
import Seo from 'Components/Seo/Seo';
import { ACTION_OPEN__LOGIN } from "Store/action";
import { useDispatch, useSelector } from "react-redux";


function SiteMap() {
    useScrollToTop();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { defaultURL, storeId } = useContext(DomainContext);
    const [data, setData] = useState();
    const [searchKeyword, setSearchKeyword] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const isLoggedUser = useSelector((state) => state?.isLoggedUser);

    const CategoryListItem = ({ category, searchKeyword }) => {
      
      return (
        <>
        
          <div key={category?.id} className="column overall-container">
            <p
              className={`${
                searchKeyword?.length > 3 &&
                !category.names?.toLowerCase().includes(searchKeyword?.toLowerCase())
                  ? "hide"
                  : ""
              } ${ category.names ? "main-category" : "" }`} 
     >
              <Link to={`/${category?.url_key}`} aria-label={category?.names?category?.names:category?.name}>{category?.names?category?.names:category?.name}</Link>
            </p>

            {category?.sub && category.sub.length > 0 && (
              <div className="pl-4 category-list">
                {category?.sub?.map((childCategory) => (
                  <CategoryListItem
                    key={childCategory?.id}
                    category={childCategory}
                    searchKeyword={searchKeyword}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      );
    };

    const renderCategories = (categories, searchKeyword) => {
        return categories?.map((category) => (
            <CategoryListItem
                key={category?.id}
                category={category}
                searchKeyword={searchKeyword} // Pass searchKeyword to renderCategories
            />
        ));
    };
    const options = {
        isLoader: true,
        setGetResponseData: (resData) => {
            setData(resData?.data[0]);
        },
        axiosData: {
            url: `${defaultURL}/getSitemap?storeId=${storeId}`,
           
        },
    };
    useEffectOnce(() => APIQueryGet(options));
    return (
      <React.Fragment>
        <Seo
          metaTitle={storeId === 1? "Sitemap | Promofit.nl" : "Sitemap | Expofit.nl"}
          metaDescription="Sitemap"
          metaKeywords="Sitemap"
        />
        <div className="sitemap__container container px-4 pt-5">
          <h1 className="fw-700 line-9 fs-30 py-4">{data?.title}</h1>
          <div
            className={`search px-4 pb-3 relative ${
              isFocused ? "focused" : ""
            }`}
          >
            <input
              type="text"
              className="searchbox pr-14 pl-6"
              aria-label="search" 
              placeholder="Zoek op categorie of product"
              onFocus={() => {
                setIsFocused(true);
              }}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
              }}
              value={searchKeyword}
            />
            <IconButton
              className="mr-2"
              aria-label="search toggle"
              onClick={() => {
                setSearchKeyword("");
              }}
            >
              {searchKeyword ? (
                <XIcon style={{ width: 14, height: 14 }} />
              ) : (
                <SearchIcon />
              )}
            </IconButton>
          </div>
          {data ? (
            <>
              <div className="category__list">
                <h2 className="fw-700 line-9 fs-30 py-4">
                  {data?.categoriesTitle}
                </h2>
                <ul className="category-container">
                  {renderCategories(data?.categories?.root?.main, searchKeyword)}
                </ul>
              </div>
              <div className="product__list">
                <h2 className="fw-700 line-9 fs-30 py-4">
                  {data?.productsTitle}
                </h2>
                <ul className="pl-4">
                  {Object.values(data?.products || {}).map((product, index) => (
                    <li key={index}>
                      <Link
                        to={`/${product.request_path}`}
                        aria-label={product?.name}
                        className={`${
                          searchKeyword?.length > 3 &&
                          !product.name
                            .toLowerCase()
                            .includes(searchKeyword.toLowerCase())
                            ? "hide"
                            : ""
                        }`}
                      >
                        {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="product__list">
                <h2 className="fw-700 line-9 fs-30 py-4">{data?.linksTitle}</h2>
                <ul className="pl-4">
                  {data?.links?.map((producName, index) => (
                    <li key={index}>
                      
                      <Link
                        to={`/${producName?.url}`}
                        aria-label={producName?.title}
                        className={`${
                          searchKeyword?.length > 3 &&
                          !producName.title
                            .toLowerCase()
                            .includes(searchKeyword.toLowerCase())
                            ? "hide"
                            : ""
                        }`}
                        onClick={(e)=>{
                          if (!isLoggedUser && (producName?.title?.includes("Inloggen"))) {
                            e.preventDefault();
                            dispatch(ACTION_OPEN__LOGIN(true));
                          }
                          else{
                            navigate(producName?.url)
                          }
                        }}
                      >
                        {producName?.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="category__list">
              <ul className="category-container">
                {[
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                  "",
                ]?.map((childCategory) => (
                  <div className="py-4">
                    <SkeletonLine width="100%" height="30px" />
                  </div>
                ))}
              </ul>
            </div>
          )}
        </div>
      </React.Fragment>
    );
}

export default SiteMap;
