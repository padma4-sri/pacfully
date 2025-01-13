import React, { useContext } from 'react'
import "./styles.scss";
import Button from 'Components/Common/Button';
import DomainContext from 'Context/DomainContext';
import Img from 'Components/Img';

const NoRoute = () => {
    const { storeId } = useContext(DomainContext);
    const Image = "/res/img/404-route.webp";
    return (
        <>
           
            <div className="noroute container mx-auto py-24 px-4 tc">
                <div className="mb-5"><Img src={Image} /></div>
                <h4 className='fw-700 pb-3 fs-32'>404 - Pagina niet gevonden</h4>
                <p className='pb-7 fs-18 fw-300 line-7 mx-auto'>De pagina die u probeert te bezoeken is verwijderd of tijdelijk niet bereikbaar.</p>
                <Button className='fs-15 py-3 px-7 r-full fw-700' href='/' target="_self">Naar homepage</Button>
            </div>
        </>
    )
}

export default NoRoute;
