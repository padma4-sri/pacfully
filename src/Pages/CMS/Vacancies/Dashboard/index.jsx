import React, { useEffect, useState, useContext, useRef, memo } from 'react';
import DomainContext from "Context/DomainContext";
import Breadcrumb from 'Components/Breadcrumb';
import './styles.scss';
import Input from 'Components/Common/Form/Input';
import { IconButton } from '@mui/material';
import { SearchIcon } from 'Res/icons';
import Img from 'Components/Img';
import Button from 'Components/Common/Button';
import { useLocation } from 'react-router-dom';
import { APIQueryGet, APIQueryPost } from 'APIMethods/API';
import useScrollToTop from 'Components/Hooks/useScrollToTop';
import Seo from 'Components/Seo/Seo';
import { SkeletonImg, SkeletonLoader } from 'Components/Skeletion';
import { useNavigate } from 'react-router-dom';

const VacanciesDashboard = () => {
    const { defaultURL, storeId } = useContext(DomainContext);
    useScrollToTop();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const APIRef = useRef(false);
    const [vanciesList, setVanciesList] = useState({});
    const [categoryUrl, setCategoryUrl] = useState("");
    const [categorySearch, setCategorySearch] = useState("");
    const seoData = vanciesList?.seo;
    const navigate = useNavigate();

    const categoryHandler = (e) => {
        if (categoryUrl === e.target.value) {
            setCategoryUrl('');
        } else {
            setCategoryUrl(e.target.value);
        }
    };

    const breadCrumbData = [{
        categoryName: "Vacatures",
        urlKey: "",
        catId: "",
    }];

    const options = {
        isLoader: true,
        loaderAction: (bool) => setLoading(bool),
        setGetResponseData: (resData) => {
            setVanciesList(resData?.data?.[0]);
        },
        axiosData: {
            url: `${defaultURL}/getvacanciesdetails?storeId=${storeId}&vacancyUrl=&searchString=${categorySearch ? categorySearch : ''}&categoryUrl=${categoryUrl ? categoryUrl : ''}`,
           
        }
    };
    useEffect(() => {
        if (!APIRef.current) {
            APIQueryGet(options);
            APIRef.current = true;
            setTimeout(() => APIRef.current = false, 200);
        };
    }, [location, categoryUrl, categorySearch]);

    return (
        <React.Fragment>
            <Seo
                metaTitle={seoData?.metaTitle}
                metaDescription={seoData?.metaDescription}
                metaKeywords={seoData?.metaKeywords}
            />
            <div className='vacancies__dashboard pt-4 pb-10 md-pb-20'>
                <Breadcrumb data={breadCrumbData} />
                <div className='page__container container px-4 pt-5'>
                    <h1 className='fs-24 line-7 fw-600 tc pb-6'>Vacatures</h1>
                    <div className="flex col xl-flex xl-row gap-10">
                        <div className="flex col gap-4 filter r-5 p-6">
                            <h2 className='fs-18 line-7 fw-600 pb-2'>Afdeling</h2>
                            {
                                loading && !vanciesList?.categories_data?.length ?
                                    <SkeletonLoader length={8} pclassName="flex col gap-3 middle" full={true} /> :
                                    vanciesList?.categories_data?.map((item, ind) => (
                                        <div className="flex" key={`vacanciesCategories${ind}`}>
                                            <Input
                                                type="checkbox"
                                                name="sales"
                                                lable={item?.nits_vacancies_category_name}
                                                value={item?.nits_vacancies_category_url}
                                                fieldClassName="checkbox flex gap-3 row pb-0 row-i right middle"
                                                checked={categoryUrl === item?.nits_vacancies_category_url ? true : false}
                                                onChange={categoryHandler}
                                            />
                                        </div>
                                    ))
                            }
                        </div>
                        <div className="openings flex-9">
                            <div className="flex gap-5 middle pb-8">
                                <div className="search flex-1">
                                    <input
                                        type="text"
                                        aria-label="search" 
                                        className="searchbox pr-14 pl-6"
                                        placeholder="Zoek op functie of zoekterm "
                                        value={categorySearch}
                                        onChange={(e) => {
                                            setCategoryUrl('');
                                            setCategorySearch(e.target.value)
                                        }}
                                    />
                                    <IconButton
                                        className='mr-2'
                                        aria-label='search toggle'
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </div>
                                {
                                    vanciesList?.total_records || vanciesList?.total_records==0 ?
                                    <p className='flex'>{vanciesList?.total_records == 0 || vanciesList?.total_records == "" ? '0 resultaat' : `${vanciesList?.total_records} resultaten`}</p>
                              :""  }

                            </div>
                            <div className="flex vancies__list wrap">
                                {
                                    loading ?
                                        ['', '', '', '', '', '']?.map((item, ind) => (
                                            <div className="list relative" key={`vacancieslist${ind}`}>
                                                <SkeletonImg
                                                    animation="pulse"
                                                    width="100%"
                                                    height="364px"
                                                    style={{ borderRadius: "20px" }}
                                                />
                                            </div>
                                        ))
                                        :
                                        <>
                                            {
                                                vanciesList?.vacancies_data?.map((item, ind) => (
                                                    <div className="list relative r-3 lg-5" key={`vacancieslist${ind}`} onClick={() => navigate(`${item?.vacancy_url}`)} >
                                                        <div className="flex">
                                                            <Img src={item?.vacancy_icon} className='absolute top-0 r-3 lg-5 image-cover' alt={item?.vacancy_name} />
                                                            <div style={{ paddingTop: '101%', width: '100%' }} className="r-3 lg-5"/></div>
                                                        <div className="flex col absolute top-0 p-5 space-between w-1/1 h-1/1">
                                                            <div className="flex col">
                                                                {/* purposely commneted */}
                                                                {/* <div className="flex icon pb-4">
                                                                <Img src={item?.vacancy_icon} className='image-contain' alt={item?.vacancy_name} />
                                                            </div> */}
                                                                <h3 className='fs-24 line-9 fw-600 pb-3'>{item?.vacancy_name}</h3>
                                                                <p className='fs-18 line-8'>{item?.vacancy_description}</p>
                                                            </div>
                                                            {/* <Button onClick={()=>navigate(`/vacatures/${item?.vacancy_url}`)}  className='fs-20 fw-600'>Bekijken <span className='fw-700 fs-28'>→</span></Button> */}

                                                            <Button href={`/vacatures/${item?.vacancy_url}`} target="_self" className='fs-20 fw-600'>Bekijken <span className='fw-700 fs-28'>→</span></Button>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            {
                                                !vanciesList?.vacancies_data?.length ?
                                                    <p className='fs-15 line-7'>Er zijn momenteel geen vacatures beschikbaar.</p>
                                                    : <></>
                                            }
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default memo(VacanciesDashboard);