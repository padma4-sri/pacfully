import React, { memo } from 'react';
import './styles.scss';
import Img from 'Components/Img';
import { useKeenSlider } from 'keen-slider/react';

const animation = { duration: 7000, easing: (t) => t };

const Brands = () => {
  const data = [
    { image: "/res/img/aeromexico.webp", title: "aeromexico" },
    { image: "/res/img/basic_fit.webp", title: "basic fit" },
    { image: "/res/img/black_label.webp", title: "black label" },
    { image: "/res/img/de_rool_pannen.webp", title: "de rool pannen" },
    { image: "/res/img/fvs.webp", title: "fvs" },
    { image: "/res/img/gemeente_breda.webp", title: "gemeente breda" },
    { image: "/res/img/politie.webp", title: "politie" },
    { image: "/res/img/sophia.webp", title: "sophia" },
  ];

  const [sliderRef, slider] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    drag: true,
    slides: {
      origin: "center",
      perView: "auto",
      spacing: 25,
    },
    rtl: false,
    created(s) {
      s.moveToIdx(5, true, animation);
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
    dragEnded(s) {
      if (s.dragDetails.direction === "right") {
        s.moveToIdx(s.track.details.abs + 1, true, animation);
      } else {
        s.moveToIdx(s.track.details.abs + 5, true, animation);
      }
    },
  });

  const dataBlock = data.map((item, index) => (
    <div className="slide__item keen-slider__slide number-slide" key={`brand_index_${index}`}>
      <div className="image__block">
        <span
          onMouseEnter={() => slider.current.animator.stop()}
          onMouseLeave={() => slider.current.update()}
        >
          <Img src={item.image} alt={item.title} />
        </span>
      </div>
    </div>
  ));

  return (
    <div className="brands__container" style={{ width: "100%", overflow: "hidden" }}>
      <div className="wrapper py-12 px-4 xl-py-12 xxl-py-17">
        <div ref={sliderRef} className="keen-slider">
          {dataBlock}
        </div>
      </div>
    </div>
  );
}

export default memo(Brands);
