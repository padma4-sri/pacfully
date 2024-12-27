import './styles.scss';
import Img from 'Components/Img';
import leftArrow from 'Res/images/footer/rightArrow.webp';
import rightArrow from 'Res/images/footer/leftArrow.webp';
import { SkeletonImg } from 'Components/Skeletion';
import { useSelector } from 'react-redux';

const SliderArrow = ({ actionLeft, actionRight }) => {
    const homePageLoading = useSelector(state => state?.homePageLoading );
    return (
        <div className="slick__arrow__btn__wrapper absolute w-1/1 h-1-1">
            <div className="container px-3 md-px-4">
                <div className="w-1/1 relative">
                    {
                        homePageLoading ? (
                            <div className='slick__arrow__block w-1/1'>
                                <button className='slick__arrow left__arrow' aria-label="button">
                                    <SkeletonImg className="flex absolute top-0 left-0 zindex-1" style={{ borderRadius: "50%" }} />
                                </button>
                                <button className='slick__arrow right__arrow' aria-label="button">
                                    <SkeletonImg className="flex absolute top-0 left-0 zindex-1" style={{ borderRadius: "50%" }} />
                                </button>
                            </div>
                        ) : (
                            <div className='slick__arrow__block w-1/1'>
                                <button className='slick__arrow left__arrow' onClick={actionLeft} aria-label="button">
                                    <Img src={leftArrow} />
                                </button>
                                <button className='slick__arrow right__arrow' onClick={actionRight} aria-label="button">
                                    <Img src={rightArrow} />
                                </button>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default SliderArrow;