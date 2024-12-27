import "./styles.scss";
import ModelNew from 'Components/Model/ModelNew';
import CloseButton from 'Components/CloseButton';
import { Rating } from "@mui/material";

const AllReviews = ({ openModel, setOpenModel, data }) => {

    return (
        <ModelNew
            from="right"
            hideScroll={false}
            zindex={11}
            open={openModel}
            shadow={true}
            setOpen={setOpenModel}
            className="header__reviews__sidebar"
        >
            <div className="sidebar__reviews w-1/1 h-1/1 px-4 sm-px-6 py-4 overflow-hidden overflow-y-auto">
                <div className="close__block tr flex right w-1/1">
                    <CloseButton onClickFunction={() => setOpenModel(false)} />
                </div>
                <div className="reviews__wrapper__container">
                    <div className="sidebar__heading pb-5">
                        <h1 className="fw-700 mb-2 fs-20">Bekijk alle reviews</h1>
                    </div>
                    <div className="reviews__all">
                        {data &&
                            data?.map((item,index) => (
                                <div className="reviews__block flex col gap-3 py-5" key={`reviews_all_${index}`}>
                                    <div className="rating flex middle gap-3">
                                        <Rating
                                            name="half-rating-read"
                                            value={(item?.ratingValue/2)}
                                            precision={0.5}
                                            readOnly
                                        />
                                        <p className="fs-20 line-7 fw-700">{item?.ratingValue}</p>
                                    </div>
                                    <div className="info">
                                        <h3 className="fs-18 line-7 fw-700 pb-1">{item?.title}</h3>
                                        <p className="pb-5 md-pb-10 fs-15 line-7">{item?.detail}</p>
                                        <p className="fs-15 line-7">
                                            {item?.created_at} | {item?.nickname}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </ModelNew>
    )
}

export default AllReviews;