import ModelNew from 'Components/Model/ModelNew';
import CloseButton from 'Components/CloseButton';
import './styles.scss';
import Input from 'Components/Common/Form/Input';
import { SearchIcon } from 'Res/icons';
import { IconButton } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useWindowSize } from 'Utilities';

const ColorPicker = ({ selectedColorData, openColorModel, setOpenColorModel, data, selectedColorItem, setSelectedColorItem }) => {
    const [width] = useWindowSize();
    let deviceHeight = window.innerHeight;
    const [topHeight, setTopHeight] = useState(0);
    const topHeightElementRef = useRef(null);

    const filtersColor = [
        { color: 'Red', hex: '#FF0000' },
        { color: 'Orange', hex: '#FF9900' },
        { color: 'Yellow', hex: '#FFEE00' },
        { color: 'Green', hex: '#88FF00' },
        { color: 'cyan', hex: '#00FFCB' },
        { color: 'Blue', hex: '#00C2FF' },
        { color: 'Purple', hex: '#0008FF' },
        { color: 'Pink', hex: '#E81C8C' },
        { color: 'White', hex: '#DFDFDF' },
        { color: 'Grey', hex: '#8A8A8A' },
        { color: 'Black', hex: '#333333' },
    ];

    const [search, setSearch] = useState('');
    const [shade, setShade] = useState({});
    const [colorsList, setColorsList] = useState([]);

    const changeHandler = (item) => {
        const colorsList = data?.[0]?.color_picker?.items?.filter((color) => color?.search.toLowerCase()?.includes((item?.color?.toLowerCase())));
        setColorsList(colorsList);
        setShade(item);
    }

    const searchHandler = (value) => {
        setShade({});
        setSearch(value);
        const colorsList = data?.[0]?.color_picker?.items?.filter((color) => color?.search.toLowerCase()?.includes((value?.toLowerCase())));
        setColorsList(colorsList);
    }

    useEffect(() => {
        if (!colorsList?.length && openColorModel) {
            setColorsList(data?.[0]?.color_picker?.items)
        }
        if (!openColorModel) {
            setTimeout(() => {
                setColorsList([]);
                setShade({});
                setSearch('');
            }, 400)
        }
    }, [openColorModel]);

    useEffect(() => {
        const elementTop = topHeightElementRef.current;
        if (elementTop) {
            const height = elementTop.offsetHeight;
            setTopHeight(height);
        }
    }, [width, openColorModel]);

    const currentPmsIds = selectedColorData && selectedColorData[selectedColorItem?.key]?.map(color => color?.pms_id);

    return (
        <ModelNew
            from="right"
            hideScroll={false}
            zindex={11}
            open={openColorModel}
            shadow={true}
            setOpen={setOpenColorModel}
            className="copy__url__sidebar"
        >
            <div className="sidebar__color w-1/1 h-1/1">
                <div className='px-4 sm-px-10 pt-4' ref={topHeightElementRef}>
                    <div className="close__block tr flex right w-1/1">
                        <CloseButton onClickFunction={() => setOpenColorModel(false)} />
                    </div>
                    <div className="color__wrapper__container">
                        <div className="sidebar__heading pb-1">
                            <h1 className="fw-700 mb-3 fs-20 line-7">Pantone kleuren</h1>
                        </div>
                        <div className="sidebar__body flex gap-y-5 col">
                            <div className="hightlight fs-15 line-6 r-5 py-4 px-5">
                                <b className='fw-700'>Let op:</b> aan de kleuren op deze pagina kunnen i.v.m. de kleurechtheid van uw monitor en het verschil met het uiteindelijk drukwerk geen rechten worden ontleend. De getoonde kleuren zijn slechts ter indicatie.
                            </div>
                            
                            <div className="input__block relative">
                                <Input
                                    value={search}
                                    onChange={(e) => searchHandler(e.target.value)}
                                    placeHolder="Zoek op kleur of Pantone kleurcode"
                                    fieldClassName="flex gap-1 col pb-0"
                                    inputClassName="w-1/1 pl-5 py-2 fs-14 r-6"
                                />
                                <IconButton className='absolute right-0 top-0 py-2 px-3 line-5 r-5 fs-14' aria-label='search toggle'>
                                    <SearchIcon />
                                </IconButton>
                            </div>
                            <div className="filter__colors flex pb-8 gap-x-5 space-between">
                                <b className='fw-700 fs-15 text-nowrap'>Kies een tint</b>
                                <div className="colorbox flex gap-1 wrap tr">
                                    {
                                        filtersColor?.map((item, key) => (
                                            <input
                                                key={`filterColor_${key}_${item?.hex}`}
                                                type='checkbox'
                                                value={item?.hex}
                                                onChange={() => changeHandler(item)}
                                                aria-label="checkbox"
                                                style={{ borderColor: item?.hex, backgroundColor: shade?.hex === item?.hex ? item?.hex : '#FFFFFF' }}
                                            />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="color__codes pl-4 sm-pl-10 mr-2 flex gap-x-4 wrap overflow-hidden overflow-y-auto" style={{ maxHeight: (deviceHeight - topHeight) }}>
                    {
                        colorsList?.map((item, key) => (

                            <button
                                key={`colorPickerCodes_${key}_${item?.hex}_${shade?.hex}`}
                                className={`color__block ${item?.pms_id === selectedColorItem.index ? "active" : ""}`}
                                onClick={() => setSelectedColorItem({ ...selectedColorItem, id: item?.pms_id > 0 ? item?.pms_id - 1 : 29, isFromPannel: true })}
                                disabled={currentPmsIds?.includes(item.pms_id)}
                                aria-label="button"

                            >

                                <div
                                    className="color r-3"
                                    style={{ width: '71px', height: '71px', border: item?.hex === '#FFFFFF' ? `1px solid #707070` : item?.hex, backgroundColor: item?.hex }}
                                ></div>
                                <div className="lable fs-12 line-4 my-1 text__ellipse" style={{ width: '71px', height: '35px' }}>{item?.search && JSON.parse(item.search)?.[0] ? JSON.parse(item.search)?.[0] : ""}</div>
                            </button>
                        ))
                    }
                </div>
            </div>
        </ModelNew>
    )
}

export default ColorPicker;