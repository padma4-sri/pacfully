import { BackgroundBox } from 'Components/MyAccount/Common';
import "./styles.scss";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from 'Components/Common/Button';
import { useDispatch } from 'react-redux';
import { logOutHandler, useWindowSize } from 'Utilities';
import Slider from "react-slick";
import { memo, useContext, useEffect, useRef, useState } from 'react';
import DomainContext from 'Context/DomainContext';

const Data = [
  {
    page: "Mijn accountoverzicht",
    link: "mijn-overzicht"
  },
  {
    page: "Mijn gegevens",
    link: "mijn-gegevens"
  },
  {
    page: "Mijn bestellingen",
    link: "mijn-bestellingen",
    highlight: "besteldetails"
  },
  {
    page: "Mijn offerteaanvragen",
    link: "mijn-offertes",
    highlight: "offertedetails"
  },
  {
    page: "Mijn favorieten",
    link: "mijn-favorieten"
  },
  {
    page: "Mijn adressen",
    link: "mijn-adressen",
    highlight: "adressenlijst"
  },
  {
    page: "Nieuwsbrief",
    link: "nieuwsbrief"
  },
  {
    page: "Uitloggen"
  }
]

const Sidebar = () => {
  const { storeId } = useContext(DomainContext);
  const [width] = useWindowSize();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location?.pathname?.split('/')?.[2];
  const [initialSlideRef, setInitialSlideRef] = useState(null);
  const sliderRef = useRef(null)
  let dragging = false;
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    initialSlide: initialSlideRef,
    swipeToSlide: true,
    arrows: false,
    variableWidth: true
  };
  const activePage = () => {
    switch (pathName) {
      case 'overzicht':
        sliderRef.current.slickGoTo(0);
        break;
      case 'mijn-gegevens':
        sliderRef.current.slickGoTo(1);
        break;
      case 'mijn-bestellingen':
        sliderRef.current.slickGoTo(2);
        break;
      case 'besteldetails':
        sliderRef.current.slickGoTo(2);
        break;
      case 'mijn-offertes':
        sliderRef.current.slickGoTo(3);
        break;
      case 'offertedetails':
        sliderRef.current.slickGoTo(3);
        break;
      case 'mijn-favorieten':
        sliderRef.current.slickGoTo(4);
        break;
      case 'mijn-adressen':
        sliderRef.current.slickGoTo(5);
        break;
      case 'nieuwsbrief':
        sliderRef.current.slickGoTo(6);
        break;
      default:
        sliderRef.current.slickGoTo(0);
    }
  }
  useEffect(() => {
    if (location?.state === null) {
      setInitialSlideRef(0);
    } else {
      setInitialSlideRef(location?.state?.initialSlide);
    }
    if (sliderRef.current === null) return
    activePage()
  }, [location, sliderRef.current]);
  const dataBlock = (
    <ul className='flex col'>
      {
        Data?.map((item, ind) => (
          item?.page === 'Uitloggen' ?
            <li key={`userPage${ind}`}>
              <Button
                className="fs-15 line-5"
                onClick={() => logOutHandler(dispatch, navigate)}
              >{item?.page}</Button>
            </li>
            :
            storeId !== 1 && item?.page === 'Mijn offerteaanvragen' ?
              <></>
              : <li key={`userPage${ind}`}>
                <Link
                  className={`fs-15 line-5  ${(pathName == item?.link) || (pathName == item?.highlight) ? 'active' : ''}`}
                  to={`/mijn-account/${item?.link}`}
                  aria-label={item?.page}
                  state={{ initialSlide: ind }}
                >{item?.page}</Link></li>
        ))
      }
    </ul>
  );
  const dataBlockMobile = (
    initialSlideRef !== null ?
      <ul className=''>
        <Slider {...settings} ref={sliderRef}>
          {
            Data?.map((item, ind, arr) => (
              item?.page === 'Uitloggen' ?
                <li key={`userPage${ind}`} style={{ width: "max-width" }}>
                  <Button
                    className="fs-15 line-5 text-nowrap"
                    onClick={(e) => logOutHandler(dispatch, navigate)}
                  >{item?.page}</Button>
                </li>
                :
                storeId !== 1 && item?.page === 'Mijn offerteaanvragen' ?
                  <></>
                  :
                  <li key={`userPage${ind}`}><Link
                    className={`fs-15 line-5 text-nowrap ${(pathName == item?.link) || (pathName == item?.highlight) ? 'active' : ''}`}
                    to={`/mijn-account/${item?.link}`}
                    state={{ initialSlide: ind }}
                    aria-label={item?.page}
                    onClick={(e) => {
                      if (arr?.length > 1) {
                        dragging && e.preventDefault();
                      }
                      setInitialSlideRef(ind);
                    }}
                  >{item?.page}</Link></li>
            ))
          }
        </Slider>
      </ul>
      : <></>
  );

  return (
    <div className='user__sidebar'>
      <BackgroundBox className='pt-6 pb-7 px-0 lg-pt-6 lg-px-8 lg-pb-8'>
        <h2 className='title line-8 fw-700 pb-2 lg-pb-4 px-5 lg-px-0'>Mijn {storeId === 1 ? "Promofit" : "Expofit"}</h2>
        {width >= 768 && dataBlock}
        <div className="lg-hide">
          {dataBlockMobile}
        </div>
      </BackgroundBox>
    </div>
  )
};

export default memo(Sidebar);