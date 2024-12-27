import React, { useEffect, useMemo, useState, useLayoutEffect, useRef, useContext } from "react";
import CategoriesDescription from "Components/Product/ProductListing/PlpCommon/CategoriesDescription";
import "./styles.scss";
import ProductCard from "Components/Productcard";
import StaticBanner from "Components/StaticBanner";
import FeaturesSection from "Components/Product/ProductListing/PlpCommon/FeaturesSection";
import { Link, useLocation, useNavigate, useSearchParams, NavigationType, useNavigationType } from "react-router-dom";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { SkeletonLine, LineLoader } from "Components/Skeletion";
import { FilterIcon } from 'Res/icons';
import Button from 'Components/Common/Button';
import { Input, InputLabel } from "@mui/material";
import { useKeenSlider } from "keen-slider/react";
import Ecobanner from "Components/Ecobanner/Ecobanner";
import DomainContext from "Context/DomainContext";

const useBackButton = () => {
  const navType = useNavigationType();
  return navType === NavigationType.Pop;
};

const GridList = ({
  setOpenModel,
  loading = true,
  plpData = {},
  currentPage,
  setCurrentPage,
  sortingData = "",
  thirdLevelData = [],
}) => {
  const { storeId } = useContext(DomainContext);
  const isPop = useBackButton();
  const [openSelect, setOpenSelect] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  // const [productsData, setProductsData] = useState([]);
  const [productFilterClass, setProductFilterClass] = useState({ class: "", top: "auto" });
  const [productFilterDir, setProductFilterDir] = useState({ class: "", top: "auto" });
  const [numCount, setNumCount] = useState(14);
  const [sortByString, setSortByString] = useState(sortingData);
  const categorySliderRef = useRef();
  const [containerWidth, setContainerWidth] = useState(10);
  const [sliderRef1] = useKeenSlider({
    loop: false,
    mode: "snap",
    rtl: false,
    slides: { perView: "auto", spacing: 13 }
  });
  const [sorting, setSorting] = useState('');

  let sortingArrayData = plpData?.sortOrderList && Object.keys(plpData?.sortOrderList);

  const getAllExceptSortPageFilter = location?.search
    ?.slice(1)
    ?.split("&")
    ?.filter(
      (item) =>
        item?.split("=")?.[0] !== "page_size" &&
        item?.split("=")?.[0] !== "product_list_order" &&
        item
    );
  const convertToStringFilter = getAllExceptSortPageFilter?.join("&");

  const navigateSorting = (e) => {
    if (e && `${e}` !== sortByString) {
      setCurrentPage(0);
      setSortByString(`${e}`);
      setSorting(e);
      navigate(
        {
          search: `?product_list_order=${e}${searchParams.get("page_size")
            ? `&page_size=${searchParams.get("page_size")}`
            : ""
            }${getAllExceptSortPageFilter?.length ? "&" : ""}${getAllExceptSortPageFilter?.length ? convertToStringFilter : ""
            }`,
        },
        { state: { from: "sorting" } }
      );
    }
  };

  // Sorting data
  const sortingDataList =
    plpData?.sortOrderList &&
    Object.keys(plpData?.sortOrderList).map((key, ind) => (
      <MenuItem value={key} key={`plp__sorting${key}`} className={`${(sorting === null) && (ind === 0) ? "Mui-selected" : ""}`}>{plpData?.sortOrderList[key]}</MenuItem>
    ));
  const staticBannerData = {
    headerTitle: "Jouw weg naar duurzame promotie",
    headerContent:
      "Maak indruk en draag bij aan een duurzame wereld met onze milieuvriendelijke producten.",
    buttonUrl: "/",
    buttonTitle: "Bekijk onze eco artikelen",
    image_url: "/res/img/staticImg.png",
  };

  // paginationHandler
  const paginationHandler = () => {
    setCurrentPage(currentPage + 1);
  };

  useMemo(() => {
    // pagination count
    let data = 14 * (currentPage === 0 ? 1 : currentPage + 1);
    if (
      (currentPage === 0 ? 1 : currentPage + 1) &&
      plpData?.total_products >= data
    ) {
      if ((currentPage + 1) > 1) {
        let countNum = data + (currentPage);
        setNumCount(countNum);
      } else {
        setNumCount(data);
      }
    } else if (
      plpData?.total_products >= 14 &&
      (currentPage === 0 ? 1 : currentPage + 1) > 0
    ) {
      setNumCount(plpData?.total_products);
    } else if (plpData?.total_products < 14) {
      setNumCount(plpData?.total_products);
    } else {
      setNumCount(14);
    }
  }, [plpData]);

  //commented for the purpose
  // useMemo(() => {
  //   if (plpData?.products?.length && !loading) {
  //     if (!productsData?.length) {
  //       setProductsData([...productsData, ...plpData?.products]);
  //     } else if (plpData?.products?.[0]?.entityId && (productsData?.[0]?.entityId !== plpData?.products?.[0]?.entityId)) {
  //       setProductsData([...productsData, ...plpData?.products]);
  //     }
  //   }
  // }, [plpData?.products]);

  // useMemo(() => {
  //   if (plpData?.products?.length && !loading) {
  //     setProductsData([]);
  //   }
  // }, [location]);

  useEffect(() => {
    if (isPop) {
      setCurrentPage(0);
      // setProductsData([]);
    }
  }, [isPop, location])
  const scrollVisible = () => {
    const ele = document.querySelector(`.resultcount__sorting`);
    const head = document.querySelector(`.header`);
    const catList = document.querySelector(`.productlisting__block`);
    const position = window.pageYOffset;
    const headerEle = head?.clientHeight - 16;
    const top = head?.clientHeight;
    const topEle = ele?.offsetTop - headerEle;
    let className = "";

    if (position <= (catList?.offsetTop + 50)) {
      className = className + "";
    } else if (position >= (ele?.offsetTop + 150)) {
      className = className + "absoluteFilter";
    }
    setProductFilterClass({ class: className, top })
  }

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlSearchParams = new URLSearchParams(currentUrl.split('?')[1]);
    const productListOrder = urlSearchParams.get('product_list_order');
    setSorting(productListOrder);
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener('scroll', scrollVisible, { passive: true });
    return () => {
      window.removeEventListener('scroll', scrollVisible);
    };
  }, []);

  useLayoutEffect(() => {
    window.addEventListener("resize", scrollVisible);
    return () => {
      window.removeEventListener("resize", scrollVisible);
    };
  }, []);

  useEffect(() => {
    const threshold = 0;
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;

      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }
      setProductFilterDir(scrollY > lastScrollY ? "down" : "up");
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [productFilterDir]);
  useEffect(() => {
    window.addEventListener('scroll', () => setOpenSelect(false));
    return () => {
      window.removeEventListener('scroll', () => setOpenSelect(false));
    };
  }, []);
  return (
    <div className="productlisting__grid">
      <div className="productlisting__grid__wrapper">
        {
          loading && !location?.pathname?.includes("/zoeken/") ?
            <div className="grid__category__description pb-xl-7 ">
              <CategoriesDescription
                data={plpData?.categoryDescription}
                bgColor={true}
                loading={plpData?.products?.length ? false : loading}
                isPlp2={true}
              />
            </div>
            :
            <></>
        }
        {
          !loading && plpData?.categoryDescription ?
            <div className="grid__category__description pb-xl-7">
              <CategoriesDescription
                data={plpData?.categoryDescription}
                bgColor={true}
                loading={loading}
              />
            </div>
            :
            <></>
        }
        {
          thirdLevelData?.length ?
            <div className="mobile__categories__list pb-5 responsive pb-xl-7 xl-hide">
              <div className="btn__blocks  pb-xl-7">
                <div className="navigation-wrapper"
                  ref={categorySliderRef}
                >
                  <div
                    ref={sliderRef1}
                    className="keen-slider autoscroll-checklist"
                  >
                    {thirdLevelData?.map((item, index) => (
                      <React.Fragment key={`mobile__categories${index}`}>
                        <Button>
                          <Link className="keen-slider__slide button capitalize r-7 fs-15 px-5 py-4 text-nowrap fw-700 block m-0 " aria-label={item?.name}to={`/${item?.url_key}`}>
                            {item?.name}
                          </Link>
                        </Button>
                      </React.Fragment>
                    ))}
                  {/* <div className="keen-slider__slide" style={{ minWidth: `${containerWidth}px`, flex: '0 0 auto' }}></div> */}
                  </div>
                </div>
              </div>
            </div>
            : <></>
        }
        <div className="productlisting__block">
          {/* sorting && result count */}
          {
            !loading && plpData?.products?.[0]?.code === 400 || plpData?.code === 400 ?
              <></>
              :
              <div className={`resultcount__sorting flex space-between middle ${productFilterDir === 'up' ? productFilterClass.class : ""} ${productFilterDir}`} style={{ top: productFilterClass.top }}>
                <div className={`xl-hide flex-1`}>
                  {
                    loading && !plpData?.products?.length ?
                      <LineLoader width="184px" height="37px" />
                      :
                      <Button size='md' className='btnFilterGrid flex gap-2 r-full' onClick={() => setOpenModel(true)}>
                        <FilterIcon /><b>filter en sorteer</b>
                      </Button>
                  }
                </div>
                <div className="count__block">
                  {
                    loading && !plpData?.products?.length ?
                      <LineLoader width="250px" height="34px" className="fs-14 relative" />
                      :
                      <p className="fs-14">{plpData?.total_products} artikelen</p>
                  }
                </div>
                <div className="sorting__block hide xl-block">
                  <form>
                    {
                      loading && !plpData?.products?.length?
                        <LineLoader width="250px" height="34px" />
                        :
                        <div className="flex row gap-4 middle">
                          <p className={`fs-14 line-6 ${!sorting ? 'pt-0' : ''} text-nowrap`}>sorteer op:</p>
                          <FormControl fullWidth>
                            {!sorting ? <InputLabel id="demo-simple-select-label">{plpData?.sortOrderList?.[sortingArrayData?.[0]]}</InputLabel> : <></>}
                            <Select
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              className="customSelect"
                              MenuProps={{
                                disableScrollLock: true
                              }}
                              open={openSelect}
                              value={sorting}
                              onChange={(e) => {
                                navigateSorting(e.target.value)
                              }}
                              input={(
                                <Input
                                  onClick={() => setOpenSelect(!openSelect)}
                                />
                              )}
                            >
                              {sortingDataList}
                            </Select>
                          </FormControl>
                        </div>
                    }
                  </form>
                </div>
              </div>
          }
          {/* grid block */}
          <div className="listing__block pb-5">
            {(loading && !plpData?.products?.length) || (!loading && plpData?.products?.[0]?.code === 400 || plpData?.code === 400) ? (
              <div className={`product__reults w-1/1 ${plpData?.products?.[0]?.code === 400 || plpData?.code === 400 ? "pt-2 xl-pt-2" : "pt-12"}`}>
                {
                  !loading && plpData?.products?.[0]?.code === 400 || plpData?.code === 400?
                    <div className="flex w-1/1 h-1/1 middle">
                      <h2 className="w-1/1 fw-700">{plpData?.message}</h2>
                    </div>
                    : <></>
                }
                {
                  !loading && plpData?.products?.[0]?.code === 400 || plpData?.code === 400 ?
                    <></> :
                    <div className="flex wrap gap-x-8 gap-y-14 xl-gap-x-8 xl-gap-y-16 pb-3">
                      {["", "", "", "", "", "", "", ""].map((item, ind) => (
                        <React.Fragment key={`productlistingGrid${ind}`}>
                          <ProductCard
                            loading={loading}
                            key={`product_loading_reults_${ind}`}
                            plp={true}
                            pageName="plp2"
                          />
                          {ind === 4 ? (
                            <StaticBanner
                              loading={loading}
                              staticBannerData={staticBannerData}
                              noPadding
                            />
                          ) : (
                            <></>
                          )}
                          {ind === 4 ? (
                            <div className="plp2_feature">
                              <FeaturesSection loading={plpData?.products?.length ? false : loading} />
                            </div>
                          ) : (
                            <></>
                          )}
                          {ind === 10 ? (
                            <div className="plp2_feature">
                              <FeaturesSection loading={plpData?.products?.length ? false : loading} />
                            </div>
                          ) : (
                            <></>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                }
              </div>
            ) :
             plpData?.products?.length ? (
              <div className="product__reults pt-xl-12 pt-8 w-1/1 overflow-hidden">
                <div className="flex wrap gap-x-8 gap-y-14 xl-gap-x-8 xl-gap-y-16 pb-3">
                  {plpData?.products?.map((item, index) => (
                    <React.Fragment key={`productlistingGrid${index}`}>
                      <ProductCard
                        data={item}
                        key={`product__reults_${index}`}
                        plp={true}
                        pageName="plp2"
                      />
                      {index === 4 ? (
                        <Ecobanner
                          loading={plpData?.products?.length ? false : loading}
                          img={plpData?.dataContent?.promotionMainBanner?.[0]?.image}
                          title={plpData?.dataContent?.promotionMainBanner?.[0]?.headerTitle}
                          buttonText={plpData?.dataContent?.promotionMainBanner?.[0]?.buttonTitle}
                          description={plpData?.dataContent?.promotionMainBanner?.[0]?.headerContent}
                          button_url={plpData?.dataContent?.promotionMainBanner?.[0]?.buttonUrl}
                          backgroundColor={storeId === 1 ? plpData?.dataContent?.promotionMainBanner?.[0]?.backgroundColor : plpData?.dataContent?.promotionMainBanner?.[0]?.backgroundColor}
                        />
                      ) : (
                        <></>
                      )}
                      {index === 4 ? (
                        <div className="plp2_feature">
                          <FeaturesSection
                            data={plpData?.dataContent?.featureContent}
                            loading={plpData?.products?.length ? false : loading}
                            noPadding
                            className="plp2 features__sliders"
                            isFeatures={true}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                      {index === 10 ? (
                        <div className="plp2_feature">
                          <FeaturesSection
                            data={plpData?.dataContent?.infoContent[0]}
                            loading={plpData?.products?.length ? false : loading}
                            noPadding
                            className="plp2 features__details"
                            isFeatures={false}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          {/* pagination handler */}
          {
            !loading && plpData?.products?.[0]?.code === 400 || plpData?.code === 400 ?
              <></>
              :
              <div className="plp__pagination__block">
                <div className="action__block flex middle  py-5 gap-x-10 right">
                  {
                    loading && !plpData?.total_products ?
                      <SkeletonLine
                        animation="pulse"
                        className="tc"
                        width="100px"
                        height="20px"
                        style={{ borderRadius: "0px" }}
                      />
                      :
                      <p className="fs-15">
                        {numCount < plpData?.total_products ? numCount : plpData?.total_products} van {plpData?.total_products}
                      </p>
                  }
                  {
                    numCount === plpData?.total_products || numCount >= plpData?.total_products ||
                      plpData?.total_products?.length > 14 ?
                      <></>
                      :
                      !plpData?.products?.length && loading ?
                        <SkeletonLine
                          animation="pulse"
                          className="tc"
                          width="250px"
                          height="50px"
                          style={{ borderRadius: "25px" }}
                        />
                        :
                        <button
                          className={`primary__btn px-3 fw-700 fs-14 ${loading ? 'rotateUpdate' : ''}`}
                          disabled={
                            numCount === plpData?.total_products ||
                              plpData?.total_products?.length > 14
                              ? true
                              : false
                          }
                          onClick={() => paginationHandler()}
                          aria-label="button"
                        >
                          {loading ? <AutorenewIcon /> : "toon meer artikelen"}
                        </button>
                  }
                </div>
              </div>
          }
        </div>
      </div>
    </div>
  );
};

export default GridList;
