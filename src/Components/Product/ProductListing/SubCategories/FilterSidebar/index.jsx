import React, { useEffect, useState } from 'react';
import './styles.scss';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Toggledown, Toggleup, CloseIconX, PlpColorFilter } from 'Res/icons';
import FormControlLabel from '@mui/material/FormControlLabel';
import MuiCheckbox from '@mui/material/Checkbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CircleIcon from '@mui/icons-material/Circle';
import { useWindowSize } from "Utilities";
import ModelNew from 'Components/Model/ModelNew';
import Button from 'Components/Common/Button';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SkeletonLine } from 'Components/Skeletion';
import AdvancedLink from 'Components/AdvancedLink';

const Categories = ({ loading = true, data = [], setThirdLevelData, selectedCategory, setSelectedCategory }) => {
  const location = useLocation();
  const [openFilter, setOpenFilter] = useState(true);

  const [width] = useWindowSize();
  const toggleAction = (index) => {
    if (selectedCategory === index) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(index);
    }
  };

  useEffect(() => {
    if (width <= 1025) {
      setOpenFilter(false);
    } else {
      setOpenFilter(true);
    }
  }, [width]);

  const DataCategories = () => {
    return (
      <ul className="main__categories__item flex col gap-y-4">
        {loading && !data?.length
          ? ["", "", "", "", "", "", "", "", "", "", ""]?.map((item, ind) => (
              <li key={`loading__plp__subcateries2${ind}`}>
                <SkeletonLine
                  animation="pulse"
                  className="tc"
                  width="200px"
                  height="22px"
                  style={{ borderRadius: "25px" }}
                />
              </li>
            ))
          : data?.map((parent, index) => (
              <li
                key={`plp__subcateries2${index}`}
                className={`main__list ${
                  location?.pathname?.slice(1) === parent?.url_key
                    ? "active"
                    : ""
                } ${
                  selectedCategory === index &&
                  location?.pathname?.slice(1) === parent?.url_key
                    ? "actives"
                    : ""
                }`}
              >
                <span
                  className="flex w-1/1 gap-2"
                  onClick={() => toggleAction(index)}
                >
                  {parent?.childCategories?.length ? (
                    <p
                      className={`flex-1 flex left pointer fs-14 fw-700 ${
                        location?.pathname?.slice(1) === parent?.url_key
                          ? " active"
                          : ""
                      } ${
                        selectedCategory === index &&
                        location?.pathname?.slice(1) === parent?.url_key
                          ? "actives"
                          : ""
                      }`}
                      onClick={() => setSelectedCategory(!selectedCategory)}
                    >
                      {parent?.name}
                    </p>
                  ) : (
                    <AdvancedLink
                      to={`/${parent?.url_key}`}
                      state={{
                        from: "subcategory",
                        urlType: {
                          entityType: "category",
                          level: "3",
                          isChildExist: 1,
                        },
                      }}
                      pageTypeCheck="plp_filter"
                      className={`flex-1 flex left ${
                        location?.pathname?.slice(1) === parent?.url_key
                          ? " active"
                          : ""
                      } ${
                        selectedCategory === index &&
                        location?.pathname?.slice(1) === parent?.url_key
                          ? "actives"
                          : ""
                      }`}
                    >
                      {parent?.name}
                    </AdvancedLink>
                  )}
                  {parent?.childCategories?.length ? (
                    selectedCategory === null ? (
                      <span
                        className="toggle__action flex center top pt-1 pointer"
                        onClick={() => setSelectedCategory(index)}
                      >
                        <Toggledown />
                      </span>
                    ) : (
                      <span
                        className="toggle__action flex center top pt-1 pointer"
                        onClick={() => setSelectedCategory(null)}
                      >
                        <Toggleup />
                      </span>
                    )
                  ) : (
                    ""
                  )}
                </span>
                {parent?.childCategories?.length &&
                selectedCategory === index ? (
                  <ul className="sub__categories__item flex col gap-y-4 pt-4 pl-7">
                    {parent?.childCategories?.map((child, ind) => (
                      <li
                        key={`plp__subcateries3__${index}_${ind}`}
                        className={`${
                          location?.pathname?.slice(1) === child?.url_key
                            ? "active"
                            : ""
                        } sub__list`}
                      >
                        <AdvancedLink
                          to={`/${child?.url_key}`}
                          state={{
                            from: "subcategory",
                            urlType: {
                              entityType: "category",
                              level: "3",
                              isChildExist: 1,
                            },
                          }}
                          pageTypeCheck="plp_filter"
                        >
                          {child?.name}
                        </AdvancedLink>
                        {child?.childCategories?.length &&
                selectedCategory === index ? (
                  <ul className="sub__categories__item flex col gap-y-4 pt-4 pl-7">
                    {child?.childCategories?.map((child1, ind1) => (
                      <li
                        key={`plp__subcateries3__${index}_${ind1}`}
                        className={`${
                          location?.pathname?.slice(1) === child1?.url_key
                            ? "active"
                            : ""
                        } sub__list`}
                      >
                        <AdvancedLink
                          to={`/${child1?.url_key}`}
                          state={{
                            from: "subcategory",
                            urlType: {
                              entityType: "category",
                              level: "3",
                              isChildExist: 1,
                            },
                          }}
                          pageTypeCheck="plp_filter"
                        >
                          {child1?.name}
                        </AdvancedLink>
                      </li>
                    ))}
                  </ul>
                ) : (
                  ""
                )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  ""
                )}
              </li>
            ))}
      </ul>
    );
  }
  return <>
    {
      width > 1024 ? <h1 className='sidebar__title fw-700 line-7 pb-4'>Categorieën</h1> : <></>
    }
    {width < 1025 ? (
      <div className='configurable__filter__block '>
        <div className={`configurable__filter ${openFilter ? 'pb-4' : 'pb-0'}`}>
          <div className="title__block flex space-between center pb-4">
            <h1 className='sidebar__title fw-700 line-7 pointer' onClick={() => openFilter ? setOpenFilter(false) : setOpenFilter(true)}>{"Categorieën"}</h1>
            <div className="action__block">
              <div className="categories__filter pt-1">
                {
                  openFilter ?
                    <p className='toggle__action flex center middle pointer' onClick={() => setOpenFilter(false)}><Toggleup /></p> :
                    <p className='toggle__action flex center middle pointer' onClick={() => setOpenFilter(true)}><Toggledown /></p>
                }
              </div>
            </div>
          </div>
          {openFilter ? <DataCategories /> : <></>}
        </div>
      </div>
    ) : (
      <div className='categories__filter__block pb-9'>
        <div className="categories__filter">
          <DataCategories />
        </div>
      </div>
    )}
  </>
}

function Checkbox({ label, value = "", icon, checkedIcon, checked = false, onChange = () => { } }) {
  return (
    <FormControlLabel
      label={label}
      control={
        <MuiCheckbox
          value={value}
          icon={icon}
          checkedIcon={checkedIcon}
          checked={checked}
          onChange={onChange}
        />
      }
    />
  );
}

const Filters = ({ loading = true, data = {},setIsLoaded, appliedFilterData = [], filterAttribute = "", isMultiSelect = "", setCurrentPage = () => { } }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openFilter, setOpenFilter] = useState(true);
  const [moreFilter, setMoreFilter] = useState(false);
  const [moreFilterCount, setMoreFilterCount] = useState(5);
  const urlFiter = location?.search?.slice(1)?.split("&")?.filter((item) => item?.split("=")?.[0] !== "page_size" && item?.split("=")?.[0] !== "product_list_order");
  const typesOfFIlters = urlFiter?.filter((it) => it?.split("=")?.[0] === filterAttribute)?.[0]?.split("=")?.[1]?.split("%");
  const [filterData, setFilterData] = useState([]);
  const isAppliedFiter = appliedFilterData?.filter((item) => item?.display === data?.attr_label);
  const handleChange = (e, filterAttribute, isMulti) => {
    const value = e.target.value;
    setCurrentPage(0);
    let getAllExceptCurrentFilter = location?.search?.slice(1)?.split("&")?.filter((item) => item?.split("=")?.[0] !== filterAttribute && item);
    const convertToStringFilter = getAllExceptCurrentFilter?.join("&");
    if (filterData?.includes(value)) {
      const updatedTodos = filterData.filter((item) => item !== value);
      setFilterData(updatedTodos)
      if (updatedTodos?.length) {
        navigate({
          search: `?${filterAttribute}=${updatedTodos?.join('%')}${getAllExceptCurrentFilter?.length ? "&" : ''}${getAllExceptCurrentFilter?.length ? convertToStringFilter : ''}`,
        });
      } else {
        setIsLoaded(true);
        navigate({
          search: `?${getAllExceptCurrentFilter?.length ? convertToStringFilter : ''}`,
        });
      }
    } else {
      filterData?.push(value);
      if (filterData === undefined || isMulti === "0") {
        navigate({
          search: `?${filterAttribute}=${value}${getAllExceptCurrentFilter?.length ? "&" : ''}${getAllExceptCurrentFilter?.length ? convertToStringFilter : ''}`,
        });
      } else {
        navigate({
          search: `?${filterAttribute}=${filterData?.join('%')}${getAllExceptCurrentFilter?.length ? "&" : ''}${getAllExceptCurrentFilter?.length ? convertToStringFilter : ''}`,
        });
      }
    }
  }

  const clearFilter = (key) => {
    const getAllExceptCurrentFilter = location?.search?.slice(1)?.split("&")?.filter((item) => item?.split("=")?.[0] !== key?.attr_code);
    const convertToStringFilter = getAllExceptCurrentFilter?.join("&");
    if (getAllExceptCurrentFilter?.length) {
      navigate({
        search: `?${getAllExceptCurrentFilter?.length ? convertToStringFilter : ''}`,
      });
    } else {
      navigate({
        search: ``
      });
    }
  }

  const seeMoreHandler = (yes = false, attr_code) => {
    const element = document.getElementById(`activeToggle${attr_code}`);
    if (moreFilter) {
      setMoreFilterCount(5);
      setMoreFilter(false);
      if (yes) {
        setTimeout(() => {
          element?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        }, 100)
      }
    } else {
      setMoreFilterCount(data?.values?.length);
      setMoreFilter(true)
    }
  };
  // datafilters
  useEffect(() => {
    setFilterData(typesOfFIlters)
  }, [])

  return <div className='configurable__filter__block pt-5'>
    <div className={`configurable__filter ${data?.values?.length <= 5 && openFilter ? 'pb-7' : openFilter ? 'pb-4' : 'pb-0'} ${filterAttribute === 'color' ? 'color' : ''}`}>
      {/* title */}
      <div className="title__block flex space-between center pb-4">
        {
          loading && !data?.attr_label ?
            <h1 className='sidebar__title fw-700 line-7 pointer' onClick={() => setOpenFilter(!openFilter)}>
              <SkeletonLine
                animation="pulse"
                className="tc"
                width="150px"
                height="28px"
                style={{ borderRadius: "5px" }}
              />
            </h1>
            :
            <h1 className='sidebar__title fw-700 line-7 pointer' onClick={() => setOpenFilter(!openFilter)}>
              {data?.attr_label}
              <span><input className='toggleFocusInput' aria-label="focus input" id={`activeToggle${data?.attr_code}`} /></span>
            </h1>
        }
        <div className="right flex row middle gap-x-2">
          {
            isAppliedFiter?.length ? <Button className='clear__btn fs-14 text-underline xl-hide' onClick={() => clearFilter(isAppliedFiter?.[0])}>wis filter</Button> : <></>
          }
          <div className="action__block">
            {
              openFilter ?
                <p className='toggle__action flex center middle pointer' onClick={() => setOpenFilter(false)}><Toggleup /></p> :
                <p className='toggle__action flex center middle pointer' onClick={() => setOpenFilter(true)}><Toggledown /></p>
            }
          </div>
        </div>
      </div>
      {/* items */}
      {
        openFilter ?
          <ul className={`configurable__item flex gap-2 col center ${data?.values?.length <= 5 ? 'pb-0' : 'pb-4'}`}>
            {
              loading && !data?.values?.length ? ['', '', '', '', '', '']?.map((item, index) => (
                <li key={`plp__${data?.attr_code}${index}`} className={`flex gap-4 ${item?.hashcode === '#ffffff' ? 'white__icon' : ''} ${typesOfFIlters?.includes(item?.value) ? 'white__icon__checked' : ''}`}>
                  <SkeletonLine
                    animation="pulse"
                    className="tc"
                    width="200px"
                    height="22px"
                    style={{ borderRadius: "25px" }}
                  />
                </li>
              ))
                :
                data?.values?.slice(0, moreFilterCount)?.map((item, index) => (
                  <li key={`plp__${data?.attr_code}${index}`} className={`flex gap-4 ${item?.hashcode === '#ffffff' ? 'white__icon' : ''} ${typesOfFIlters?.includes(item?.value) ? 'white__icon__checked' : ''}`}>
                    {
                      data?.attr_code === 'color' ?

                        <Checkbox
                          label={`${item?.display} (${item?.count})`}
                          value={item?.value}
                          icon={item?.hashcode?.includes("https:") ?
                            <img src={item?.hashcode} style={{ width: "24px", height: "24px" }} alt={item?.display} /> :

                            <CircleIcon sx={{
                              color: `${item?.hashcode === '#ffffff' && typesOfFIlters?.includes(item?.value) ? '#222222' : item?.hashcode}`
                            }} />}
                          checkedIcon={
                            (item?.hashcode === '#ffffff' && typesOfFIlters?.includes(item?.value)) ? <PlpColorFilter /> :
                              <CheckCircleIcon sx={{
                                color: `${item?.hashcode === '#ffffff' && typesOfFIlters?.includes(item?.value) ? '#ffffff' : item?.hashcode}`
                              }} />}
                          
                          checked={typesOfFIlters?.includes(item?.value)}
                          onChange={(e) => handleChange(e, filterAttribute, isMultiSelect)}
                        />
                        :
                        <Checkbox
                          label={`${item?.display} (${item?.count})`}
                          value={item?.value}
                          icon={<RadioButtonUncheckedIcon sx={{
                            color: '#FFF',
                            border: '1px solid #DFDFDF',
                            borderRadius: '50%'
                          }} />}
                          checkedIcon={<CircleIcon sx={{
                            color: 'var(--themeColor)'
                          }}
                          />}
                          checked={typesOfFIlters?.includes(item?.value)}
                          onChange={(e) => handleChange(e, filterAttribute, isMultiSelect)}
                        />
                    }
                  </li>
                ))
            }
          </ul>
          : <></>
      }
      {/* see more & less */}
      {
        data?.values?.length > 5 && openFilter ?
          <div className="show__more__less flex gap-1 middle">
            <h1 className='more__less__title fw-700 line-5 pointer' onClick={() => seeMoreHandler(true, data?.attr_code)}>{moreFilter ? 'toon minder' : 'toon meer'}</h1>
            <p className='flex center middle pointer' onClick={() => seeMoreHandler()}>{moreFilter ? <Toggleup onClick={() => setMoreFilter(5)} /> : <Toggledown onClick={() => setMoreFilter(data?.values?.length)} />}</p>
          </div>
          : <></>
      }
    </div>
  </div>
}

const FilterSidebar = ({ className = "", plpDatas = {}, setIsLoaded, loading = true, setCurrentPage, setThirdLevelData, openModel, setOpenModel }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const paramValue = params['*'];
  const [selectedCategory,setSelectedCategory]=useState(null)
  // const [plpData, setPlpData] = useState({});
  const urlFiter = location?.search?.slice(1)?.split("&")?.filter((item) => item?.split("=")?.[0] !== "page_size" && item?.split("=")?.[0] !== "product_list_order");
  let filredData = [];
  const [width, setWidth] = useState(window.innerWidth);

  urlFiter?.forEach((item) => {
    let data = item?.split('=');
    let keyName = data?.[0];
    let value = data?.[1]?.split('%');
    if (urlFiter?.[0] !== '') {
      filredData?.push({ [keyName]: value });
    }
  });
  const [openFilteredItems, setOpenFilteredItems] = useState(false);

  const clearAll = () => {
    setCurrentPage(0);
    navigate({
      search: ''
    });
  };

  const FilterContent = ({ data = {}, isLoading = true, setCurrentPage, selectedCategory,
    setSelectedCategory }) => {
    const [searchParams] = useSearchParams();
    const filterData = (
      isLoading && !data?.filter?.length ?
        ['']?.map((item, ind) => (
          <React.Fragment key={`filterContentSidebar${ind}`}>{item?.attr_code !== "price" ? <Filters setIsLoaded={setIsLoaded} loading={isLoading} data={item} appliedFilterData={data?.appliedFilter} filterAttribute={item?.attr_code} filtersIndex={ind} isMultiSelect={item?.is_multiselect} setCurrentPage={setCurrentPage} /> : <></>}</React.Fragment>
        ))
        : data?.filter?.code === 400 ? null :
        data && data?.filter?.map((item, ind) => (
          <React.Fragment key={`filterContentSidebar${ind}`}>{item?.attr_code !== "price" ? <Filters setIsLoaded={setIsLoaded} loading={isLoading} data={item} appliedFilterData={data?.appliedFilter} filterAttribute={item?.attr_code} filtersIndex={ind} isMultiSelect={item?.is_multiselect} setCurrentPage={setCurrentPage} /> : <></>}</React.Fragment>
        ))
    );

    const clearAll = () => {
      setCurrentPage(0);
      navigate({
        search: ''
      });
    }
    const clearFilter = (key) => {
      setCurrentPage(0);
      const search = location?.search?.slice(1);
      const getSingleVariantsValuesMulti = location?.search?.slice(1)?.split("=")?.[1]?.split("%");
      const getAllFilterVariants = search?.split("&");
      const getAllExceptCurrentFilter = getAllFilterVariants?.filter((item) => item?.split("=")?.[0] !== key?.attr_code);
      const getCurrentFilter = getAllFilterVariants?.filter((item) => item?.split("=")?.[0] === key?.attr_code);
      const getCurrentFilterValuesRemain = getCurrentFilter?.[0]?.split("=")?.[1]?.split("%")?.filter((item) => item !== key?.attr_label)?.join("%");
      const convertToStringFilter = getAllExceptCurrentFilter?.join("&");
      const singleVariantRemovedFilter = getSingleVariantsValuesMulti?.filter((item) => item !== key?.attr_label);
      if (getAllFilterVariants?.length > 1) {
        if (getCurrentFilterValuesRemain) {
          navigate({
            search: `?${key?.attr_code}=${getCurrentFilterValuesRemain}&${getAllExceptCurrentFilter?.length ? convertToStringFilter : ''}`,
          });
        } else {
          navigate({
            search: `?${getAllExceptCurrentFilter?.length ? convertToStringFilter : ''}`,
          });
        }

      } else if (singleVariantRemovedFilter?.length) {
        const allUrl = singleVariantRemovedFilter?.join("%");
        navigate({
          search: `?${key?.attr_code}=${allUrl}`
        });
      } else {
        navigate({
          search: ''
        });
      }
    }

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
    const getAppliedFilter = location?.search
      ?.slice(1)
      ?.split("&")
      ?.filter(
        (item) =>
          item?.split("=")?.[0] === "product_list_order" &&
          item
      );
    const navigateSorting = (e) => {
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
    };
    var sortingData =
    plpDatas?.sorting &&
      Object.keys(plpDatas?.sorting).map((key) => (
        <div className='flex col gap-3'>
          <Button key={`plp__mobile__sorting${key}`} onClick={() => navigateSorting(key)} className={`${getAppliedFilter?.[0]?.split('=')?.[1] === key ? 'active' : ''}`}>{plpDatas?.sorting[key]}</Button>
        </div>
      ));

    let tempFilterData = {};
    plpDatas?.filter?.length && plpDatas?.filter?.forEach((item) => {
      if (item?.attr_code) {
        tempFilterData[`${item.attr_code}`] = item?.attr_label
      }
    })

    return (
      <div className="flex-1 overflow-hidden">
        <div className="sidebar__wrapper px-8 xl-px-0 w-1/1 h-1/1 overflow-hidden overflow-y-auto">
          {/* mobile filtered data */}
          {plpDatas?.sorting &&
          Object.keys(plpDatas?.sorting)?.length ? (
            <div className="configurable__filter__block sorting__filter pt-5 xl-hide mb-5">
              <div
                className={`configurable__filter ${
                  openFilteredItems ? "pb-4" : "pb-0"
                }`}
              >
                {/* title */}
                <div
                  className={`title__block flex space-between center ${
                    openFilteredItems ? "pb-0" : "pb-4"
                  }`}
                >
                  <h1
                    className="sidebar__title fw-700 line-7"
                    onClick={() =>
                      openFilteredItems
                        ? setOpenFilteredItems(false)
                        : setOpenFilteredItems(true)
                    }
                  >
                    Sorteren
                  </h1>
                  <div className="right flex row middle gap-x-2">
                    <div className="action__block">
                      {openFilteredItems ? (
                        <p
                          className="toggle__action flex center middle pointer"
                          onClick={() => setOpenFilteredItems(false)}
                        >
                          <Toggleup />
                        </p>
                      ) : (
                        <p
                          className="toggle__action flex center middle pointer"
                          onClick={() => setOpenFilteredItems(true)}
                        >
                          <Toggledown />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {openFilteredItems && (
                  <div className="sorting__options flex col gap-4 pt-4">
                    {
                      // loading ?
                      //   ['', '', '', '', '']?.map((item, key) => (
                      //     <div className='flex col gap-3' key={`plp__mobile__sorting${key}`}>
                      //       <Button>
                      //         <SkeletonLine
                      //           animation="pulse"
                      //           className="tc"
                      //           width="200px"
                      //           height="22px"
                      //           style={{ borderRadius: "25px" }}
                      //         />
                      //       </Button>
                      //     </div>
                      //   ))
                      //   :
                      sortingData
                    }
                  </div>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}
          {/* {location?.state?.isSearchResult ||
          location?.pathname?.includes("/zoeken/") ? (
            <></>
          ) : data?.categoryFilter?.length ? (
            <Categories
              loading={isLoading}
              data={data?.categoryFilter}
              setCurrentPage={setCurrentPage}
              setThirdLevelData={setThirdLevelData}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          ) : (
            <></>
          )} */}
          {width > 1024  ? (
            <div className="filter__title__block pb-4">
              <div className="flex space-between middle ">
                <h1 className="sidebar__title fw-700 line-7">Filters</h1>
                {filredData?.length  ? (
                  <p className="pointer" onClick={clearAll}>
                    wis filters
                  </p>
                ) : (
                  <></>
                )}
              </div>
              {isLoading ? (
                <></>
              ) : data?.products?.code === 400 ? (
                <h2 className="pt-5 fw-700">No data found!</h2>
              ) : (
                <></>
              )}
              {/* {loading && !plpDatas?.appliedFilter?.length ? (
                ["", "", ""]?.map((item, ind) => (
                  <div
                    className="flex pt-4 wrap fs-14 middle gap-2"
                    key={`filteredItems${ind}`}
                  >
                    <div className="flex nowrap top gap-5">
                      <div className="remove__icon pointer">
                        <SkeletonLine
                          animation="pulse"
                          height="30px"
                          width="30px"
                          style={{ borderRadius: "20px" }}
                        />
                      </div>
                      <span className="fw-500">
                        <SkeletonLine
                          animation="pulse"
                          height="30px"
                          width="150px"
                          style={{ borderRadius: "20px" }}
                        />
                      </span>
                    </div>
                  </div>
                ))
              ) : plpDatas?.appliedFilter?.length ? (
                plpDatas?.appliedFilter?.map((item, ind) => (
                  <div
                    className="flex pt-4 wrap fs-14 middle gap-2"
                    key={`filteredItems${ind}`}
                  >
                    <div className="flex nowrap middle gap-2">
                      <div className="remove__icon pointer">
                        <CloseIcon onClick={() => clearFilter(item)} />
                      </div>
                      <span className="fw-500">{item?.display}:</span>
                    </div>
                    <div className="flex wrap">
                      <span className="fw-700">{item?.attr_display}</span>
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )} */}
            </div>
          ) : (
            <></>
          )}
          {filterData}
        </div>
      </div>
    );
  }

  // close sidebar
  useEffect(() => {
    setOpenModel(false);
  }, [location]);
  // useMemo(() => {
  //   if (!openModel) {
  //     setPlpData(plpDatas)
  //   }
  // }, [plpDatas]);

  // width
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // useEffect(() => {
  //   if(plpDatas?.categoryFilter?.length){
  //     const dataIndex = plpDatas.categoryFilter.findIndex((item) => {
  //       return item.url_key === paramValue
  //     })
  //     if (dataIndex >= 0) {
  //         setSelectedCategory(dataIndex);
  //     } else {
  //       plpDatas.categoryFilter.map((item, ind) => {
  //         if (item?.childCategories?.length) {
  //           const len = item.childCategories.filter((child) => child?.url_key === paramValue);
  //           if (len) {
  //               setSelectedCategory(ind);
  //           }
  //         }
  //       });
  //     }
  //   }
  // }, [plpDatas])

  return width > 1024 ? (
    <div className={`productlisting__sidebar ${className}`}>
      <FilterContent setIsLoaded={setIsLoaded} data={plpDatas} isLoading={loading} type="sidebar" setCurrentPage={setCurrentPage}  selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}/>
    </div>
  ) : (
    <>
      <ModelNew className='filterAllMenu' open={openModel} shadow={true} setOpen={setOpenModel} >
        <div className={`filterMenu w-1/1 h-1/1 flex gap-0`}>
          <div className={`menuCol main w-1/1`}>
            <div className="menuContent w-1/1 h-1/1 overflow-hidden">
              <div className="w-1/1 h-1/1 flex col gap-1 flex">
                <IconButton className="close" aria-label="close" onClick={() => setOpenModel(false)} sx={{ padding: 0 }}>
                  <CloseIconX />
                </IconButton>
                <div className="flex-0 head pt-3 flex-0">
                  <h3 onClick={() => setOpenModel(false)}>Filter</h3>
                </div>
                <FilterContent setIsLoaded={setIsLoaded} data={plpDatas} type="sidemenu" isLoading={loading} setCurrentPage={setCurrentPage}  selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}/>

                <div className="mobile__clearFIlter absolute bottom-15 mx-auto left-0 right-0 tc flex col gap-3 center middle px-8">
                  {
                    location?.search ?
                      <Button onClick={() => clearAll()} className='r-7 px-6 py-4'>Wis filters</Button>
                      : ''
                  }
                  </div>

              </div>
            </div>
          </div>
        </div>
      </ModelNew>
    </>
  )
}

export default FilterSidebar;