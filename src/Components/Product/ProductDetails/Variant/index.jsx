import React, { useEffect, useState, useRef, useContext, Suspense, Fragment, useLayoutEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { Grow, IconButton } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { KeyboardArrowDown, AccessTime, ExpandMore, Translate } from '@mui/icons-material';
import AccordionSidebar from "Components/AccordionSidebar/AccordionSidebar";
import DomainContext from "Context/DomainContext";
import { TickIcon, ValidSuccesArrow, WishIcon, CopyUrl, FullWishlist } from 'Res/icons';
import Img from 'Components/Img';
import TagManager from 'react-gtm-module';
import { InfoPdpIcon } from 'Res/icons';
import DeliveryInfo from '../DeliveryInfo';
import ModelNew from "Components/Model/ModelNew";
import CloseButton from "Components/CloseButton/index";

import Button from 'Components/Common/Button';
import ServicesDetails from "Components/Header/BottomHeader/ServicesDetails";
import InfoDetails from 'Components/Header/BottomHeader/InfoDetails';
import { addWishList, useWindowSize, getCartItems, SessionExpiredLogout, removeWishlist,triggerHotjarEvent,handleImage } from "Utilities";
import { APIQueryGet, APIQueryPost } from 'APIMethods/API';
import { ACTION_OPENCART, ACTION__MINICART__ITEMS, ACTION_GUESTKEY, ACTION_GUESTQUOTE__DETAILS, ACTION_OPEN__LOGIN, ACTION_WISHLISTPRODUCTID, ACTION_OPEN__FORGOTPASSWORD, ACTION_GET__URLTYPE } from 'Store/action';
import ColorPicker from '../ColorPicker';
import { ReactComponent as RefundIcon } from "../../../../Res/images/icon-refund-money.svg"

// Styles
import "./styles.scss";
import { useEffectOnce } from 'Components/Hooks/useEffectOnce';
const UploadImages = React.lazy(() => import("../UploadImages"));

const manualSizeUnitList = ["mm", "cm", "m"]

const euroCurrency = (val) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', symbol: "" }).format(val).replace(" ", "").replace("€", "");

const BlackTooltip = styled(({ className, ...props }) => (<Tooltip {...props} arrow classes={{ popper: className }} />))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: { color: theme.palette.common.black },
  [`& .${tooltipClasses.tooltip}`]: { backgroundColor: theme.palette.common.black, font: "normal normal 300 13px/18px Poppins", padding: 16, borderRadius: 10 },
}));
const addArrayObj = (a, b) => a.map((a1, i) => {
  const ab = b.filter((b1) => b1.qty === a1.qty)
  return ab.length ? { ...a1, price: ((a1.price || 0) + (ab[0].price || 0)) } : { qty: a1.qty, price: a1.price, q: a1.qty, p: a1.price, hide: true }
}
);
const UpdateTextQty = (qtyTemp, selectedDetailsFinal, setQty, setQtyTemp, getDeliveryDate, getApiCartOptions) => {
  const option = getApiCartOptions();
  let qty = null;
  const tPrice = selectedDetailsFinal?.tier_prices;
  const increment = selectedDetailsFinal?.qty_increments || 1;

  // Adjust qtyTemp to the nearest multiple of qty_increments
  const adjustedQtyTemp = Math.round(qtyTemp / increment) * increment;

  // Handle tier prices logic
  if (tPrice?.length) {
    qty = (adjustedQtyTemp >= tPrice[0].qty) ? adjustedQtyTemp : tPrice[0].qty;
  } else if (!tPrice?.length && (selectedDetailsFinal?.price > 0) && selectedDetailsFinal?.min_sale_qty) {
    qty = (adjustedQtyTemp >= selectedDetailsFinal.min_sale_qty) ? adjustedQtyTemp : selectedDetailsFinal.min_sale_qty;
  }

  if (qty !== null) {
    setTimeout(() => {
      getDeliveryDate(option, qty); 
    }, 1000);
    setQty(qty);      
    setQtyTemp(qty);   
  }
}

// const addHyphens = (text, minWordLength = 5) => {
//   if (!text) return '';
//   const words = text.split(/\s+/);
//   return words.map(word => {
//     if (word.length < minWordLength) return word;
//     return word.replace(/([aeiou])([bcdfghjklmnpqrstvwxyz])/gi, '$1\u00AD$2');
//   }).join(' ');
// };

// const addHyphens = (text, maxWordLength = 10) => {
//   if (!text) return '';
//   const words = text.split(/\s+/);
//   return words.map(word => {
//     if (word.length <= maxWordLength) return word;
//     return word.split('').join('\u200B'); 
//   }).join(' ');
// };

const addHyphens = (text, minWordLength = 5) => {
  if (!text) return '';

  // Check if the text contains parentheses
  const hasParentheses = /\(.*?\)/.test(text);

  if (hasParentheses) {
    // If it contains parentheses, return the text as is
    return text;
  } else {
    // If no parentheses, add soft hyphens for words longer than minWordLength
    const words = text.split(/\s+/);
    return words.map(word => {
      if (word.length < minWordLength) return word;
      return word.replace(/([aeiou])([bcdfghjklmnpqrstvwxyz])/gi, '$1\u00AD$2');
    }).join(' ');
  }
};




// Calculating single qty tier price from total price based on the condition "one_time"
const getSingleTierPrice = (tp) => {
  const tier_prices = [...tp]
  tier_prices.forEach((item, index) => {
    const price =
      item?.price > 0 && item?.qty > 0 ? item.price / item.qty : 0;
    tier_prices[index] = {
      ...item,
      price,
    };
  });
  return tier_prices;
};


const InputNumber = ({ name, min = "0", max = "0", val, setVal }) => {
  const [value, setValue] = useState("");
  const [inputVal, setInputVal] = useState(0);
  const validateUpdate = (v) => parseInt(v > min ? v < max ? v : max : min);
  const updateBy = (i = 0) => setInputVal(validateUpdate(typeof (i) === "number" ? (parseInt(value) + i) : parseInt(i)));
  const update = (e) => setValue(e.target.value);
  useEffect(() => {
    const interval = setTimeout(() => {
      if (value !== inputVal) {
        const temp = validateUpdate(parseInt(value));
        if (temp === parseInt(inputVal)) setValue(temp);
        setInputVal(temp);
      }
    }, 2000);
    if (value === inputVal) setValue(`${validateUpdate(inputVal)}`);
    return () => clearInterval(interval);
  }, [value]);
  useEffect(() => {
    const temp = validateUpdate(inputVal);
    if (value !== temp) setValue(`${temp}`);
    if (val !== temp) setVal(temp);
  }, [inputVal]);
  useEffect(() => {
    const temp = validateUpdate(validateUpdate(parseInt(val)));
    setValue(`${temp}`); setInputVal(temp);
  }, []);
  return (
    <div className="flex col middle gap-2 numberButton">
      <div className="flex center">
        <h5>{name}</h5>
      </div>
      <div className="flex center" style={{ border: "1px solid #CCCCCC", borderRadius: 5, height: 42 }}>
        <button aria-label="button" disabled={inputVal <= min} onClick={() => updateBy(-1)} value="Decrease Value">-</button>
        <input style={{ width: max.length * 10 || 20 }} type="number" value={value} onChange={update} onBlur={() => updateBy(value)} />
        <button aria-label="button"
          disabled={inputVal >= max} onClick={() => updateBy(1)} value="Increase Value">+</button>
      </div>
    </div>
  );
}
const InputTextBox = ({ setInputFieldExpand, selectedData, setSelectedData, keyName, placeholder, setInputManualSize }) => {
  const [val, setVal] = useState("");
  const act = () => {
    const temp = { ...selectedData }
    temp[keyName] = [`${btoa(val)}YYYY`];
    const containsYYYYWithExtra = temp[keyName].some(
      (item) => item.includes("YYYY") && item.length > 4
    );
    if (containsYYYYWithExtra) {
      setSelectedData(temp);
      setInputFieldExpand(false)
    }
    else {
      setInputFieldExpand(true)
    }



  }
  useEffect(() => {
    let v = selectedData[keyName];
    if (Array.isArray(v)) {
      v = v.join(', ');
    }
    if (v?.includes("YYYY")) {
      v = v?.replace("YYYY", "")
    }
    if (v !== val) {
      setVal(atob(v) || "")
      setInputManualSize(atob(v) || "")
    };
  }, [selectedData[keyName]]);
  return (
    <>
      <input value={val}
        placeholder={placeholder}
        onChange={(e) => { setVal([e.target.value]); setInputManualSize(e.target.value) }}
      // onKeyDown={(e) => (e.key === 'Enter') && act()}
      // onBlur={() => act()}
      />
      <div>
        <Button onClick={() => {
          act()
        }} className='contained sm mt-4  py-2 px-4 r-9 primary'>volgende</Button>
      </div>
    </>

  );
}
const InputQtyBox = ({ data, keyName, setAllData, allData, index }) => {
  const [val, setVal] = useState("");
  const update = (v) => {
    const temp = { ...allData }
    if (val !== data.qty) {

      if (keyName)
        temp[keyName][index] = { ...temp[keyName][index], qty: v }
      else
        temp[index] = { ...temp[index], qty: v }
      setAllData(temp);
    }
  }
  const act = (v) => {
    const temp = (parseInt(val) > data.minQty) ? Math.round(val) : data.minQty;
    update(temp);
    setVal(temp)
  }
  useEffect(() => {
    if (data.qty && val === "") {
      setVal(data.qty >= data.minQty ? data.qty : data.minQty);
    }
  }, [data]);
  return (
    <input value={val} placeholder=' - '
      onKeyDown={(e) => (e.key === 'Enter') && act()}
      onBlur={() => act()}
      onChange={(e) => setVal(e.target.value)}
    />
  )
}
const InputQtyBoxArr = ({ data, setAllData, allData, index }) => {
  const [val, setVal] = useState(0);
  const update = (v) => {
    const temp = [...allData];
    if (val !== data.qty) {
      temp[index] = { ...temp[index], qty: v };
      setAllData(temp);
    }
  };

  const act = (v) => {
    const temp = parseInt(v) > data.minQty ? Math.round(v) : data.minQty;
    update(temp);
    setVal(temp.toString());
  };

  useEffect(() => {
    if (data.qty && val === 0) {
      setVal(data.qty >= data.minQty ? data.qty.toString() : data.minQty.toString());
    }
  }, [data]);
  return (
    <input
      value={val}
      placeholder="0"
      onKeyDown={(e) => (e.key === "Enter") && act(val)}
      onBlur={() => act(val)}
      onChange={(e) => {
        const inputVal = e.target.value;
        const numericVal = inputVal.replace(/\D/g, ""); // Remove non-numeric characters
        let value = parseInt(numericVal, 10); // Convert to number
        value = isNaN(value) ? "" : Math.min(value, 50000); // Check if value is NaN, if so, set it to empty string, otherwise limit to 50000
        setVal(value.toString()); // Set the value as string
        // act(value); // Call act function with updated value
      }}
    />
  );
};
const ContentInputNumber = ({ name, min, max, val, setVal }) => (
  <div className='flex left middle gap-5'>
    <InputNumber name={name} min={min} max={max} val={val} setVal={setVal} />
  </div>
);
const ContentManualSize = ({ name, min, max, val, setVal, name1, min1, max1, val1, setVal1 }) => (
  <div className='flex col gap-4 w-1/1 manualSize'>
    <div>
      <p>Geef de gewenste afmeting op {` (min. ${min} / max. ${max})`}</p>
    </div>
    <div className='flex left gap-5'>
      {name ? (
        <ContentInputNumber key={`${name}_1`} name={name} min={min} max={max} val={val} setVal={setVal} />
      ) : null}
      {name1 && setVal1 ? (
        <ContentInputNumber key={`${name}_2`} name={name1} min={min1} max={max1} val={val1} setVal={setVal1} />
      ) : null}
    </div>
  </div>
);
const VariantHeader = ({ isError, id, additional, name, order = "1", expanded, completed = false, selectedItem, label, translate }) => {
  const condition = React.useMemo(() => label && label.length ? (Array.isArray(label) ? (additional ? label.map(item => translate?.[`${item}`.toLowerCase()] ? translate[`${item}`.toLowerCase()] : item).filter(item => item.trim().toLowerCase() !== "geen")
    : label.map(item => translate?.[`${item}`.toLowerCase()] ? translate[`${item}`.toLowerCase()] : item))
    : (additional ? label?.replace(/, /g, ",")?.toLowerCase()?.split(',').map(item => translate?.[`${item}`.toLowerCase()] ? translate[`${item}`.toLowerCase()] : item).filter(item => item.trim().toLowerCase() !== "geen")
      : label?.split(',').map(item => translate?.[`${item}`.toLowerCase()] ? translate[`${item}`.toLowerCase()] : item))) : [], [label, additional])
 const Name=  translate?.[`${name}`.toLowerCase()] ? translate[`${name}`.toLowerCase()] : name
      return (
    <AccordionSummary aria-controls={`${id}acc-content`} id={`${id}_acc_header`}>
      <div className='flex w-1/1 middle gap-2 variantHeader'>
        <span className={`status flex center middle ${Boolean(completed)}`}>
          {completed ? <TickIcon /> : order}
        </span>
        <span>{Name}{condition.length ? ":" : ""}</span>
        <span className="flex-1 relative overflow-hidden nowarp">
          {condition.length ? (
            <i className='hide md-inline absolute w-1/1'>{condition.join(',')}</i>
          ) :
            isError === true ? (
              <i style={{ color: "red" }} className='hide md-inline absolute w-1/1'>Kies een optie</i>
            ) : null
          }
        </span>
        {!expanded && completed ? <span className="flex center middle show"><EditIcon /></span> : null}
      </div>
    </AccordionSummary>
  )
}

const TooltipEle = ({ product }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [width] = useWindowSize();
  const tooltipRef = useRef(null);
  const isMobile = width < 992; 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleTooltipToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const tooltipContent = (
    <div className='flex col gap-3' ref={tooltipRef}>
      <div className='flex col gap-1'>
        <b>Huidige voorraad</b>
        <p>{product?.qty} {product?.qty === 1 ? "stuk" : "stuks"}</p>
      </div>
      {product?.shipping_info && (
        <div className='lg-flex lg-col lg-gap-1'>
          <b>Nieuwe voorraad onderweg</b>
          <p dangerouslySetInnerHTML={{ __html: product?.shipping_info }}></p>
        </div>
      )}
    </div>
  );

  return (
    <BlackTooltip
      open={isOpen}
      onClose={() => setIsOpen(false)}
      disableFocusListener={isMobile}
      disableHoverListener={isMobile}
      disableTouchListener={isMobile}
      title={tooltipContent}
      enterTouchDelay={0}
      leaveTouchDelay={isMobile ? 9999999 : undefined}
    >
      <div 
        className="time flex gap-1 middle center" 
        onClick={handleTooltipToggle}
        onMouseEnter={() => !isMobile && setIsOpen(true)}
        onMouseLeave={() => !isMobile && setIsOpen(false)}
      >
        <div className="flex center middle icon"><AccessTime /></div>
        <div className='fs-12'>{`voorraad info`}</div>
      </div>
    </BlackTooltip>
  );
  
};const VariantCard = ({setchangeCustomizeOption, qty, getApiCartOptions, getDeliveryDate, setmanualsizelabel, setmanualsizestr, selectedManualSizeData, setSelectedManualSizeData, selectedDetails, keyList, selected, setSelected, data, variantData, expandNext, setStopNextNav, isSample, translate }) => {

  const variantKey = keyList[0], mutiSelect = isSample || variantData?.mutiSelect;
  const variantIndex = selectedDetails?.[variantKey]?.variantIndex || 0;
  const [sizeInit, setSizeInit] = useState("");
  const [sizeVar, setSizeVar] = useState(null);
  const [sizeVal, setSizeVal] = useState(null);
  const [prevKey, setPrevKey] = useState("");
  const unit = sizeVar?.manual_size_entity > -1 ? parseInt(sizeVar?.manual_size_entity) : 0;
  let v = { ...sizeVal };
  const getSize = (v, key) => {
    let size = 0;
    if (key === "circle") {
      const l = v[key]?.["diameter"] || 1;
      size = 22 / 7 * Math.pow((l / 2), 2)
    } else if (key === "square") {
      const l = v[key]?.["length"] || 1;
      size = Math.pow(l, 2)
    } else if (key === "standard") {
      const l = v[key]?.["length"] || 1, w = v[key]?.["width"] || 1;
      size = l * w;
    }
    return Math.round(size);
  }
  const getPrice = (manualSize, manual_size_tier_price) => {
    let price = 0;
    manual_size_tier_price.forEach((manualTier) => {
      if (parseFloat(manualSize) >= parseFloat(manualTier.manual_size)) {
        price = parseFloat(manualSize) * parseFloat(manualTier.price);
      }
    });
    return isNaN(parseFloat(price.toFixed(2))) ? 0 : parseFloat(price.toFixed(2));
  }
  const updateSizeVal = (key, val, key2) => {
    if (sizeInit) {
      if (key2) {
        if (!v[key]) {
          v = {}; v[key] = {};
        }
        v[key][key2] = val;
      } else v[key] = val;
      v[key]["size"] = getSize(v, key);
      v[key]["price"] = getPrice(v[key]["size"], sizeVar?.manual_size_tier_price?.length ? sizeVar.manual_size_tier_price : []);
      setSizeVal({ ...v });
    }
  }
  const checkValue = (v, min, max) => parseInt(v > min ? v < max ? v : max : min);

  useEffect(() => {
    let key = "", val = null;
    if (sizeVar && selectedManualSizeData && Object.keys(selectedManualSizeData).length) {
      val = {};
      Object.keys(selectedManualSizeData).map((k) => {
        if (k === "circle" && sizeVar?.manual_size_diameter_min && sizeVar?.manual_size_diameter_max) {
          val[k] = {}; key = k;
          const l = selectedManualSizeData[k]?.["diameter"] || 1;
          val[k]["diameter"] = checkValue(l, sizeVar.manual_size_diameter_min, sizeVar.manual_size_diameter_max);
        } else if (k === "square" && sizeVar?.manual_size_length_min && sizeVar?.manual_size_length_max) {
          val[k] = {}; key = k;
          const l = selectedManualSizeData[k]?.["length"] || 1;
          val[k]["length"] = checkValue(l, sizeVar.manual_size_length_min, sizeVar.manual_size_length_max);
        } else if (k === "standard" && sizeVar?.manual_size_length_min && sizeVar?.manual_size_length_max && sizeVar?.manual_size_length_min && sizeVar?.manual_size_length_max) {
          val[k] = {}; key = k;
          const l = selectedManualSizeData[k]?.["length"] || 1, w = selectedManualSizeData[k]?.["width"] || 1;
          val[k]["length"] = checkValue(l, sizeVar.manual_size_length_min, sizeVar.manual_size_length_max);
          val[k]["width"] = checkValue(w, sizeVar.manual_size_width_min, sizeVar.manual_size_width_max);
        }
      })
      if (key) val[key]["size"] = getSize(val, key);
      if (val?.[key]?.["size"]) val[key]["price"] = getPrice(val[key]["size"], sizeVar?.manual_size_tier_price?.length ? sizeVar.manual_size_tier_price : []);
      if (val?.[key]?.["price"] && val?.[key]?.["price"] !== sizeVal?.[key]?.["price"]) setSizeVal({ ...val }); else val = null;
    } else if ((sizeVar && sizeInit === "" && val === null) || (sizeInit !== "" && sizeVar && val === null)) {
      val = {};
      const k = sizeVar?.manual_size_from;
      if (k === "circle" && sizeVar?.manual_size_diameter_min) {
        val[k] = {}; key = k;
        val[k]["diameter"] = sizeVar?.manual_size_diameter_min;
      } else if (k === "square" && sizeVar?.manual_size_length_min) {
        val[k] = {}; key = k;
        val[k]["length"] = sizeVar?.manual_size_length_min;
      } else if (k === "standard" && sizeVar?.manual_size_length_min && sizeVar?.manual_size_width_min) {
        val[k] = {}; key = k;
        val[k]["length"] = sizeVar?.manual_size_length_min;
        val[k]["width"] = sizeVar?.manual_size_width_min;
      }
      if (key) val[key]["size"] = getSize(val, key);
      if (val?.[key]?.["size"]) val[key]["price"] = getPrice(val[key]["size"], sizeVar?.manual_size_tier_price?.length ? sizeVar.manual_size_tier_price : []);
      if (val?.[key]?.["price"] && val?.[key]?.["price"] !== sizeVal?.[key]?.["price"]) setSizeVal({ ...val });
    }
    if (selectedManualSizeData) {
      if (selectedManualSizeData?.standard) {
        const { length, width } = selectedManualSizeData?.standard;
         const unit = manualSizeUnitList[selectedManualSizeData.unit] || "mm";
        setmanualsizelabel(`Hoogte: ${length} ${unit},Breedte: ${width} ${unit}`);
        setmanualsizestr(`description: ${width}x${length}${unit},width: ${width}, price: ${"XXXXX"},length:${length}, display_value:Hoogte-${length} ${unit};Breedte-${width} ${unit}`);
      }
      if (selectedManualSizeData?.circle) {
        const { diameter, size } = selectedManualSizeData?.circle;
        
        const unit = manualSizeUnitList[selectedManualSizeData.unit] || "mm";

        setmanualsizelabel(`diameter: ${diameter} ${unit}`);
        setmanualsizestr(`description: ${diameter} ${unit}, diameter:${diameter}, size:${size}, price: ${"XXXXX"}, display_value:diameter-${diameter} ${unit}`);
      }
      if (selectedManualSizeData?.square) {
        const { length, size } = selectedManualSizeData?.square;
        const unit = manualSizeUnitList[selectedManualSizeData.unit] || "mm";

        setmanualsizelabel(`lengte: ${length} ${unit}`);
        setmanualsizestr(`description: ${length} ${unit},length:${length}, size:${size}, price: ${"XXXXX"},display_value:lengte-${length} ${unit}`);
      }
    }
  }, [selectedManualSizeData, sizeVar, selected]);
  const onChangeSelected = (key) => {
    setSelectedManualSizeData({ ...sizeVal, unit, key: variantKey, id: sizeVar?.id });
    if (variantKey && sizeVal?.[key] && Object.keys(sizeVal[key]).length) {
      const d = {}
      d["key"] = key;
      Object.keys(sizeVal[key]).map((k) => {
        if (!(k === "size" || k === "price")) d[k] = sizeVal[key][k]
      })
      const selectedData = { ...selected };
      selectedData[variantKey] = [JSON.stringify({ manualSize: { ...d } }), data?.id];
      setStopNextNav(true);
      setSelected({ ...selectedData });
    }
  }
  useEffect(() => {
    if (sizeVal && Object.keys(sizeVal).length) {
      let key = ""
      Object.keys(sizeVal).map((k) => key = k)
      if (key) onChangeSelected(key);
    }
  }, [sizeVal]);

  useEffect(() => {
    setPrevKey(selectedDetails?.[keyList?.[0]]?.prevKey ? selectedDetails[keyList[0]].prevKey : "");
  }, [selectedDetails]);
  useEffect(() => {
    const products = data?.products;
    if (data?.label === 'manual-size' && products?.length) {
      if (prevKey !== "") {
        const selList = selectedDetails?.[prevKey]?.selectedOptionProductList;
        if (selList?.length) {
          products.map((prod) => {
            if (selList?.includes(prod?.id)) {
              if (prod?.id && prod?.id !== selectedManualSizeData?.id) {
                setSelectedManualSizeData(null);
                setTimeout(() => {
                  setSizeVar(prod);
                }, 500)
              }
            }
          });
        }
      }
    }

    if (data?.label === 'manual-size' && !data?.selectedProducts && data?.products?.length) {
      setSizeVar(data.products[0])
    } else if (data?.label === 'manual-size' && data?.selectedProducts) {
      setSizeVar(data.selectedProducts)
    } else if (sizeVar !== null) {
      setSizeVar(null)
    }
  }, [prevKey, selectedDetails, selectedDetails?.size?.products]);

  useEffect(() => {
    if (sizeInit === "" && sizeVal) {
      setSizeInit("loaded");
    }
  }, [sizeVal]);
  const option = getApiCartOptions();
  useEffect(() => {
    const variantIndex = selectedDetails[keyList[0]]?.variantIndex;
    // if (option && option.products.length === 1 && variantIndex === 0 && qty > 0) {
    //   getDeliveryDate(option);
    // }
  }, [selectedDetails[keyList[0]]]);
  const NewVariantData = data?.selectedProducts?.id ? [data.selectedProducts]: data?.products;
  const placeholderImage = useSelector(state => state?.getHomePageData?.data?.place_holder_image);

  return sizeVar?.manual_size_from ? (
    <React.Fragment>
      {sizeVar?.manual_size_from === "circle" && sizeVal?.circle?.diameter ? (
        <ContentManualSize key={`circle_${sizeVar?.id}`}
          name={`Diameter (${manualSizeUnitList[unit] || "mm"})`} min={sizeVar?.manual_size_diameter_min} max={sizeVar?.manual_size_diameter_max} val={sizeVal?.circle?.diameter} setVal={(v) => { updateSizeVal("circle", v, "diameter") }}
        />
      ) : sizeVar?.manual_size_from === "standard" && sizeVal?.standard?.length ? (
        <ContentManualSize key={`standard${sizeVar?.id}`}
          name={`Hoogte (${manualSizeUnitList[unit] || "mm"})`} min={sizeVar?.manual_size_length_min} max={sizeVar?.manual_size_length_max} val={sizeVal?.standard?.length} setVal={(v) => updateSizeVal("standard", v, "length")}
          name1={`Breedte (${manualSizeUnitList[unit] || "mm"})`} min1={sizeVar?.manual_size_width_min} max1={sizeVar?.manual_size_width_max} val1={sizeVal?.standard?.width} setVal1={(v) => updateSizeVal("standard", v, "width")}
        />
      ) : sizeVar?.manual_size_from === "square" && sizeVal?.square?.length ? (
        <ContentManualSize key={`square${sizeVar?.id}`}
          name={`Lengte (${manualSizeUnitList[unit] || "mm"})`} min={sizeVar?.manual_size_length_min} max={sizeVar?.manual_size_length_max} val={sizeVal?.standard?.length} setVal={(v) => updateSizeVal("square", v, "length")}
        />
      ) : null
      }
      <p></p>

    </React.Fragment>
  ) : (
    <div name={`variantCard_includes_${data.id}`} className="variantCard flex">
      <button
        aria-label="button"
        className={`content fillX flex col gap-2 ${variantKey && data?.id && selected?.[variantKey]?.length && selected?.[variantKey]?.includes(data.id) ? "active" : ""}`}
        onClick={() => {
          if (variantKey) {
            const selectedData = { ...selected }; 
        
            if (option && option.products.length === 1 && variantIndex === 0 && qty > 0) {
              setchangeCustomizeOption({
                customoption:"",
                qty:false,
                variant:data?.id
              })
            }
        
           
            
            if (
              variantData?.variantDatas?.length &&
              variantData.variantDatas.every((variant) => selected[variant]?.length > 0) 
            ) {
              const lastVariant = variantData.variantDatas[variantData.variantDatas.length - 1];
              if (selectedData[lastVariant]) {
                selectedData[lastVariant] = [];
              }
            }
            
        
            let selectedCard = [...selected[variantKey]];
            if (data?.id && selectedCard.includes(data.id) && !isSample) {
              selectedCard.splice(selectedCard.indexOf(data.id), 1); 
            } else if (data?.id) {
              if (!mutiSelect && !isSample) {
                selectedCard = []; // Single 
                expandNext(true);
              } else {
                setStopNextNav(true);
              }
        
              if (isSample) {
                const totalVariantLength = variantData?.variantLength;
                const currentVariantIndex = selectedDetails?.[keyList?.[0]]?.variantIndex;
        
                if (selectedCard.includes(data.id)) {
                  selectedCard = selectedCard.filter(id => id !== data.id);
                } else if (
                  totalVariantLength &&
                  currentVariantIndex > -1 &&
                  (
                    (currentVariantIndex < totalVariantLength - 1 && selectedCard.length < 1) ||
                    (currentVariantIndex === totalVariantLength - 1 && selectedCard.length < 3)
                  )
                ) {
                  selectedCard.push(data.id);
                }
              } else {
                selectedCard.push(data.id);
              }
            }
        
            selectedData[variantKey] = selectedCard;
            setSelected(selectedData);
          }
        }}
        
      // disabled={!(data?.products?.[0]?.stock_status)} // Disable varient
      >
        {NewVariantData?.length ? NewVariantData.map((product, i) => i === 0 ? (
          <React.Fragment key={`product__${data.id}_${variantKey}_${keyList?.join(", ")}__${i}_0`}>
           
            {(variantIndex > -1 && product?.product_gallery_images?.[variantIndex]?.image || product?.images) ? (
              <div className=' w-1/1 flex col pt-2 px-2'>
                <div className="relative w-1/1 r-3 overflow-hidden">
                  <div className="imgInfo absolute w-1/1 h-1/1">
                    <Img class src={handleImage((variantIndex > -1 && product?.product_gallery_images?.[variantIndex]?.image) ? product.product_gallery_images[variantIndex].image :product?.images ?product?.images: "" , placeholderImage)} alt={''} type='img' style={{ objectFit: "contain", maxWidth: "100%"}} />
                  </div>
                  <div style={{ paddingTop: "100%" }}></div>
                </div>
              </div>
            ) : null}
            {!(variantIndex > -1 && product?.product_gallery_images?.[0]?.image || product?.images) ? (
              <div className=' w-1/1 flex col pt-2 px-2'>
                <div className="relative w-1/1 r-3 overflow-hidden">
                  <div className="txtInfo absolute w-1/1 h-1/1 flex center middle">
                    <h5 className='tc'>{data.label ? data.label : "No name"}</h5>
                  </div>
                  <div style={{ paddingTop: "100%" }}></div>
                  {product?.manage_stock > 0 && product?.stock_status ? (
                   <div className='w-1/1 mt-6 py-2 flex col gap-1 middle'>
                     {product?.qty > 0 && variantData?.variantLength == selectedDetails[keyList[0]]?.variantIndex + 1 ? (
                       <div className='qty'>{product?.qty} {product?.qty == 1 ? "stuk" : "stuks"}</div>
                     ) : product?.qty == 0 && variantData?.variantLength == selectedDetails[keyList[0]]?.variantIndex + 1 ? (
                       <div className='qty' style={{ color: "#CE3030" }}>niet op voorraad</div>
                     ) : (
                       <div className='qty v-hide'>stuks</div>
                     )}
                     {product?.next_day_delivery_qty !== null && product?.next_day_delivery_qty > 0 && variantData?.variantLength == selectedDetails[keyList[0]]?.variantIndex + 1 ? (
                       <TooltipEle product={product} />
                     ) : (
                       <div className='time flex gap-1 middle center v-hide'>Tooltip</div>
                     )}
                   </div>
                 ) : product?.manage_stock > 0 && !product?.stock_status && variantData?.variantLength == selectedDetails[keyList[0]]?.variantIndex + 1 ? (
                   <div className='w-1/1 mt-6 py-2 flex col gap-0 middle' style={{ color: "#CE3030" }}>
                     <div>niet op </div>
                     <div>voorraad</div>
                   </div>
                 ) : null}
                </div>
              </div>) : (
             <div className='varientInfo relative w-1/1 flex col middle px-2 zindex-4'>
             {variantData?.hideStock ? (
               <h3 className='labelOnly tc fw-bold pb-2'>{addHyphens(data?.label)}</h3>
             ) : (
               <React.Fragment>
                 {data?.label ? (
                   <h3 className={`label ${product?.manage_stock > 0 ? "absolute" : "pb-2"} px-2 w-1/1 h-1/1 flex-1`}>
                     {translate?.[`${data?.label}`.toLowerCase()]
                       ? addHyphens(translate[`${data?.label}`.toLowerCase()])
                       : addHyphens(data?.label)}
                   </h3>
                 ) : (
                   <h3 className={`label ${product?.manage_stock > 0 ? "absolute" : "pb-2"} px-2 w-1/1 h-1/1 flex-1 v-hide`}>
                     {addHyphens("Title")}
                   </h3>
                 )}
                 {product?.manage_stock > 0 && product?.stock_status ? (
                   <div className='w-1/1 mt-6 py-2 flex col gap-1 middle'>
                     {product?.qty > 0 && variantData?.variantLength == selectedDetails[keyList[0]]?.variantIndex + 1 ? (
                       <div className='qty'>{product?.qty} {product?.qty == 1 ? "stuk" : "stuks"}</div>
                     ) : product?.qty == 0 && variantData?.variantLength == selectedDetails[keyList[0]]?.variantIndex + 1 ? (
                       <div className='qty' style={{ color: "#CE3030" }}>niet op voorraad</div>
                     ) : (
                       <div className='qty v-hide'>stuks</div>
                     )}
                     {product?.next_day_delivery_qty !== null && product?.next_day_delivery_qty > 0 && variantData?.variantLength == selectedDetails[keyList[0]]?.variantIndex + 1 ? (
                       <TooltipEle product={product} />
                     ) : (
                       <div className='time flex gap-1 middle center v-hide'>Tooltip</div>
                     )}
                   </div>
                 ) : product?.manage_stock > 0 && !product?.stock_status && variantData?.variantLength == selectedDetails[keyList[0]]?.variantIndex + 1 ? (
                   <div className='w-1/1 mt-6 py-2 flex col gap-0 middle' style={{ color: "#CE3030" }}>
                     <div>niet op </div>
                     <div>voorraad</div>
                   </div>
                 ) : null}
               </React.Fragment>
             )}
           </div>
           
            )}
          </React.Fragment>
        ) : null) : null}
      </button>
    </div>
  )
}
const VariantQtyPicker = ({ productData, totalValueQty, setTotalValueQty, errorQty, setErrorQty, setOpenModelQty, setVariantQtyData, setReqExpanded, selectedData, keyList, variantData, setSelected, selectedDetails, setStopNextNav }) => {
  const [tokenData, setTokenData] = useState("");
  const [data, setData] = useState([]);
  const [qtydata, setQtyData] = useState([]);

  const replaceSizeSymbols = (data) => {
    const updatedData = { ...data };
    if (updatedData.size && updatedData.size.length > 0) {
      updatedData.size = updatedData.size.map(size => {
        return decodeURIComponent(size).replace(/%3A/g, ':').replace(/%2C/g, ',');
      });
    }
    return updatedData;
  };
  useEffect(() => {
    const currentSelectedDetails = selectedDetails[keyList[0]];
    const updateDataList = [], tempQtyData = [];
    if (variantData?.multiOption && currentSelectedDetails?.prevKey !== "") {
      if (selectedDetails[currentSelectedDetails.prevKey]?.selectedOptionProductList?.length) {
        const selectedOptionProductList = [...selectedDetails[currentSelectedDetails.prevKey]?.selectedOptionProductList];
        if (variantData?.options?.length) {
          variantData.options.map((vData) => {
            let selectedProducts = null, selectedQty;
            if (vData.products.length) {
              vData.products.map((vDataProd) => {
                if (!selectedProducts && selectedOptionProductList.includes(vDataProd.id)) {
                  selectedProducts = vDataProd;
                  selectedQty = { id: vData?.id, sizeLabel: vData?.label, productId: vDataProd?.id, allProMinQty: vDataProd?.min_sale_qty, minQty: 0, qty: 0 }
                  selectedData?.size.forEach(item => selectedQty.qty = item.includes(selectedQty.id) && item.split(":")?.[1] ? parseInt(item.split(":")[1]) : 0);
                }
                return null;
              });
              vData["selectedProducts"] = selectedProducts;
            }
            if (selectedProducts) {
              updateDataList.push(vData);
              tempQtyData.push(selectedQty);
            }
            selectedData?.size?.forEach(item => {
              const [id, qty] = item.split(":");
              const index = tempQtyData.findIndex(tempItem => tempItem.id === id);
              if (index !== -1) {
                tempQtyData[index].qty = parseInt(qty);
              }
            });

            return null;
          })
        }
      }
      setData([...updateDataList]);
      if (!(qtydata?.length)) {
        setQtyData([...tempQtyData])
      }
    }
  }, [selectedDetails]);

  useEffect(() => {
    setVariantQtyData(qtydata)
    const temp = {};
    if (qtydata?.length) {
      temp[keyList[0]] = qtydata.filter(item => item.qty > 0).map(item => {
        return `${item.id}:${item.qty}`
      });
      // setReqExpanded(false);
      setStopNextNav(true)
      setSelected({ ...selectedData, ...temp })
    }
    const sumQty = Object.values(qtydata).reduce((acc, item) => acc + item.qty, 0);
    setTotalValueQty(sumQty)
    if (qtydata?.length && qtydata.some(item => item.qty > 0)) {
      if (sumQty >= productData?.settings?.min_sale_qty) {
        setErrorQty(true)
      }
      else if (sumQty <= productData?.settings?.min_sale_qty) {
        setErrorQty(false)
      }
    }
  }, [qtydata]);
  useEffect(() => {
    const updatedSelectedData = replaceSizeSymbols(selectedData);
    setSelected(updatedSelectedData);
  }, [])
  useEffect(() => {
    if (tokenData === "") setTokenData("loaded")
  }, []);

  return (
    <React.Fragment>
      <div className='flex right absolute right-0' style={{ top: "-30px" }}>
        <a aria-label="Prijstabel" className='fs-15 text-underline' onClick={() => setOpenModelQty(true)}>Prijstabel</a>
      </div>

      {qtydata && qtydata?.length ?
        <p className='py-2 px-2'>
          Meerdere maten bestellen is mogelijk. Het totaal van deze maten dient minimaal {Math.round(productData?.settings?.min_sale_qty)} stuks te zijn.
        </p>
        : ""}
      {!errorQty ?
        <p className='error py-2'>De minimale bestelhoeveelheid is nog niet bereikt.</p>
        :
        ""
      }
      <div className="variantcolorPicker flex center col gap-6 w-1/1">
        <div className='flex col gap-6'>
          <div className="flex gap-6 w-1/1">
            <div className="flex w-1/1 py-1 px-2" style={{ maxWidth: 198 }}>
              <div className='qtyChoose flex col gap-4'>
                <h4>Afmeting</h4>
              </div>
            </div>
            <div className="flex flex-1 col gap-4 py-1 px-2">
              <div className='qtyChoose flex col gap-4'>
                <h4>Aantal</h4>
              </div>
            </div>
          </div>
          {data.map((d, index) => (
            <div className="flex gap-6 w-1/1">
              <div className="flex w-1/1 py-1 px-2" style={{ maxWidth: 198 }}>
                <h3 className='labelOnly tc fw-bold'>{d?.label}</h3>
              </div>
              <div className="flex flex-1 col gap-4">
                <div className="flex col gap-3 lg-flex lg-row lg-gap-6 w-1/1">
                  <div className='qtyChoose flex col gap-4'>
                    <div className="w-1/1 flex gap-2 middle">
                      <div className="flex-1">
                        <InputQtyBoxArr data={qtydata[index]} setAllData={setQtyData} allData={qtydata} index={index} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div >
        <h2 className='fs-18 fw-bold pt-4 pb-2'>Totaal aantal: {totalValueQty}</h2>
      </div>
      <div className='variantCardList w-1/1'>
        <div className='variantCardList'>
          <Button onClick={() => {
            setStopNextNav(false)
            setReqExpanded(true);
            setSelected({ ...selectedData })
            if (qtydata?.length && totalValueQty >= productData?.settings?.min_sale_qty) {
              setErrorQty(true)
              setStopNextNav(false)
              setReqExpanded(true);

            }
            else if (totalValueQty <= productData?.settings?.min_sale_qty) {
              setErrorQty(false)
              setReqExpanded(false);
              setStopNextNav(true)
            }
          }} className='contained sm mt-4 mb-2 py-2 px-4 r-9 primary'>volgende</Button>
        </div>
      </div>
    </React.Fragment>

  );
}
const VariantColorPicker = ({ cmsError, setCmsError, keyList, setStopNextNav, product, selected, setSelected, selectedColorData, setSelectedColorData, selectedColorItem, setSelectedColorItem, openColorModel, setOpenColorModel, colorDataList, isColorPickerTierPrices }) => {
  const [tokenData, setTokenData] = useState("");
  const [colorData, setColorData] = useState({});
  const [colorList, setColorList] = useState({});
  const addMoreColor = (proData, product) => {
    const obj = { ...colorList };
    if (proData?.id) {
      let qty = 1, tier_prices = [], pms_key = "", product_ids = "";
      const productsObj = proData.products;
      if (productsObj) {
        Object.keys(productsObj).map((productKey) => {
          product_ids = productsObj[productKey]?.id;
          pms_key = productsObj[productKey]?.pms_key;
          tier_prices = productsObj[productKey]?.["tier_prices"] || [];
          qty = tier_prices?.[0]?.["qty"] || 1;
          return null;
        })
      }
      obj[proData.id].push({ color: "", qty: qty, minQty: qty, tier_prices, pms_key, product_ids });
      setColorList(obj);
    }
  }
  const removeMoreColor = (id, index) => {
    const obj = { ...colorList };
    if (obj[id].length) {
      obj[id].splice(index, 1)
      setColorList(obj);
    }
  }
  useEffect(() => {
    if (selectedColorItem) {
      if (selectedColorItem?.isFromPannel) {
        const obj = { ...colorList };
        if (!(obj[selectedColorItem.key])) {
          obj[selectedColorItem.key] = []
        }
        obj[selectedColorItem.key][selectedColorItem.index] = { ...obj[selectedColorItem.key][selectedColorItem.index], color: selectedColorItem.id || 0 };
        setColorList(obj);
        setOpenColorModel(false)
      } else {
        setOpenColorModel(true)
      }
    }
  }, [selectedColorItem]);
  useEffect(() => {
    if (colorList && Object.keys(colorList)?.length > 0) {
      const cData = {}, cDataAll = {};
      Object.keys(colorList).map((key, i) => {
        cData[key] = [];
        cDataAll[key] = [];
        colorList[key]?.length && colorList[key].map((colorItem, i) => {
          cData[key].push({ color: colorItem.color, qty: colorItem.qty });
          if (colorItem.color || colorItem.color === 0) {
            const item = colorDataList[colorItem.color];
            cDataAll[key].push({ tier_prices: [...colorItem?.tier_prices], product_ids: colorItem.product_ids, minQty: colorItem.minQty, pms_key: colorItem.pms_key, qty: colorItem.qty, pms_id: item?.pms_id, hex: item?.hex, name: item?.search && JSON.parse(item.search)?.[0] ? JSON.parse(item.search)?.[0] : "" })
          } else {
            cDataAll[key].push(undefined);
          }
          return null;
        });
        return null;
      });
      setColorData(cData)
      setSelectedColorData(cDataAll)
      // commented for purpose
      // if (colorList) {
      //   const allColorsNotEmpty = Object.values(colorList).every(dataArray => {
      //     return dataArray.every(dataObj => dataObj.color !== "");
      //   });
      //   setCmsError(allColorsNotEmpty);
      // }
    }
  }, [colorList]);

  useEffect(() => {
    if (tokenData !== "")
      if (colorData && Object.keys(colorData)?.length > 0) {
        setStopNextNav(true);
        const selectedColorTemp = { ...selected }
        selectedColorTemp[keyList] = [colorData];
        setSelected(selectedColorTemp)
      }
    if (colorList) {
      const allColorsNotEmpty = Object.values(colorList).every(dataArray => {
        return dataArray.every(dataObj => dataObj.color !== "");
      });
      setCmsError(allColorsNotEmpty == true ? "true" : "");
    }

  }, [colorData]);
  useEffect(() => {
    if (product.selected.length) {
      const obj = {}, selectedData = selected[keyList]?.length && (typeof selected[keyList][0] === "string") ? JSON.parse(selected[keyList]) : selected[keyList]?.length ? selected[keyList] : [];
      const colorListData = selectedData?.length ? selectedData[0] : {};
      Object.keys(product.data).map((key) => {
        if (product.selected.includes(product.data[key].id)) {
          let qty = 1, tier_prices = [], pms_key = "", product_ids = "";
          const productsObj = product.data[key].products;
          if (productsObj) {
            Object.keys(productsObj).map((productKey) => {
              product_ids = productsObj[productKey]?.id;
              pms_key = productsObj[productKey]?.pms_key;
              tier_prices = productsObj[productKey]?.["tier_prices"] || []
              qty = tier_prices?.[0]?.["qty"] || 1;
              return null;
            })
          }
          if (colorListData?.[product.data[key].id] && colorListData[product.data[key].id].length) {
            const tempOb = []
            colorListData[product.data[key].id].map((clc, item) => {
              tempOb.push({ color: clc.color ? clc.color : clc.color === 0 ? 0 : "", qty: clc.qty > qty ? clc.qty : qty, minQty: qty, tier_prices, pms_key, product_ids })
              return null;
            });
            obj[product.data[key].id] = tempOb;
          } else {
            obj[product.data[key].id] = [{ color: "", qty: qty, minQty: qty, tier_prices }]
          }
        }
        return null;
      });
      setColorList(obj)
    }
  }, [product.selected]);
  useEffect(() => {
    if (tokenData === "") setTokenData("loaded")
  }, []);
  const placeholderImage = useSelector(state => state?.getHomePageData?.data?.place_holder_image);
  return (
    <div className="variantcolorPicker flex center col gap-6 w-1/1">
      <div className='flex col gap-6'>
        {Object.keys(product.data).map((key, index) => product.selected.includes(product.data[key].id) ? (
          <div className="flex gap-6 w-1/1" data-key={`variantcolorPicker_${keyList}`} key={`variantcolorPicker_${keyList}_${index}_${key}_${product.data[key].id}`}>
            <div className="variantCard flex">
              <button aria-label="button" className={`content flex col gap-2 ${product.data[key]?.products[Object.keys(product.data[key].products)[0]]?.product_gallery_images?.[0]?.image || product.data[key].products[Object.keys(product.data[key].products)[0]]?.images ? 'has-image' : 'no-image'}`}>
                {product.data[key]?.products && Object.keys(product.data[key].products).length ? Object.keys(product.data[key].products).map((key2, item2) => item2 === 0 ? (
                  <React.Fragment>
                    {product.data[key].products[key2]?.product_gallery_images?.[0]?.["image"] || product.data[key].products[key2]?.images?
                   <div className='flex-1 w-1/1 flex col pt-4 px-4'>
                   <div className="relative w-1/1 r-3 overflow-hidden">
                     <div className="imgInfo absolute w-1/1 h-1/1">
                       <Img title={product.data[key].products[key2]?.product_name} src={handleImage(product.data[key].products[key2]?.product_gallery_images?.[0]?.["image"] || product.data[key].products[key2]?.images ,placeholderImage)} alt={''} type='img' style={{ objectFit: "contain", maxWidth: "100%"}} />
                     </div>
                     <div style={{ paddingTop: "100%" }}></div>
                   </div>
                 </div>
                 :null 
                  }
                   
                    <div className='varientInfo w-1/1 flex col gap-2 middle pb-2 px-2 zindex-4'>
                     <h3 className='labelOnly tc fw-bold'>{addHyphens(product.data[key]?.label)}</h3>
                    </div>
                  </React.Fragment>
                ) : null) : null}
              </button>
            </div>
            <div className="flex flex-1 col gap-4">
              <div className="hide lg-flex lg-gap-6 w-1/1">
                <div className='colorChoose flex col gap-4'>
                  <h4>Kleur</h4>
                </div>
                {!isColorPickerTierPrices ?
                  <div className='qtyChoose flex col gap-4'>
                    <h4>Aantal</h4>
                  </div> : null}
              </div>
              {colorList[product.data[key].id]?.length ? colorList[product.data[key].id].map((cData, ind) => (
                <div className="flex col gap-3 lg-flex lg-row lg-gap-6 w-1/1" key={`colorListProduct_${ind}_${key}_${product.data[key].id}`}>
                  <div className='colorChoose flex col gap-4'>
                    <div className="w-1/1 flex gap-2 middle" key={`cData${ind}_${index}`}>
                      <button aria-label="button" onClick={() => { setSelectedColorItem({ id: cData?.id, key: product.data[key].id, index: ind, isFromPannel: false }) }} className="flex-1 flex middle gap-2 colorInput">
                        {selectedColorData?.[product.data[key].id]?.[ind]?.hex ? <div className='colorBox' style={{ background: selectedColorData?.[product.data[key].id]?.[ind]?.hex }}></div> : <div className='colorBox noColor'></div>}
                        {selectedColorData?.[product.data[key].id]?.[ind]?.name ? <div className='colorName relative w-1/1 overflow-hidden' style={{ height: 20 }}><span className="absolute w-1/1 text-nowrap ellipsis overflow-hidden">{selectedColorData?.[product.data[key].id]?.[ind]?.name}</span></div> : <div className='colorName relative w-1/1 overflow-hidden'>Kies een kleur</div>}
                      </button>
                      <div className="flex-0">
                        <IconButton aria-label="edit" onClick={() => { setSelectedColorItem({ id: cData?.id, key: product.data[key].id, index: ind, isFromPannel: false }) }}>
                          <EditIcon />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                  <div className='qtyChoose flex col gap-4'>
                    <div className="w-1/1 flex gap-2 middle" key={`colorInput${ind}_${index}`}>
                      {!isColorPickerTierPrices ?
                        <div className="flex-1">
                          <InputQtyBox data={cData} keyName={product.data[key].id} setAllData={setColorList} allData={colorList} index={ind} />
                        </div> : null}
                      <div className="flex-0">
                        {ind == 0 ? <div style={{ width: 24, height: 24 }} /> : (
                          <IconButton aria-label="delete" onClick={() => removeMoreColor(product.data[key].id, ind)}>
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )) : null}
              {!isColorPickerTierPrices ?
                <div className="flex gap-6 w-1/1 addColor">
                  <a aria-label="Voeg een kleur toe" onClick={() => addMoreColor(product.data[key], product)} className="flex left">+ Voeg een kleur toe</a>
                </div> : null}
            </div>
          </div>
        ) : null)}
      </div>
    </div>
  );
}
const VariantCardSeeMore = ({setchangeCustomizeOption, qty, getApiCartOptions, getDeliveryDate, translate, setmanualsizelabel, setmanualsizestr, selectedManualSizeData, setSelectedManualSizeData, keyList, setStopNextNav, selectedDetails, variantData, selected, setSelected, handleExpandNext, expandNext, isSample }) => {
  const [width] = useWindowSize();
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState([]);
  const name = variantData?.label;

  useEffect(() => {
    const currentSelectedDetails = selectedDetails[keyList[0]];
    const updateDataList = [];
    if (variantData?.multiOption && currentSelectedDetails?.prevKey !== "") {
      if (selectedDetails[currentSelectedDetails.prevKey]?.selectedOptionProductList?.length) {
        const selectedOptionProductList = [...selectedDetails[currentSelectedDetails.prevKey]?.selectedOptionProductList];
        if (variantData?.options?.length) {
          variantData.options.map((vData) => {
            let selectedProducts = null;
            // commented for purpose add to cart issue
            // const updatedProductList =[];

            if (vData.products.length) {
              vData.products.map((vDataProd) => {

                if (selectedOptionProductList.includes(vDataProd.id)) {
                  // updatedProductList.push(vDataProd)
                  if (!selectedProducts) {
                    selectedProducts = vDataProd;
                  }
                }

                return null;
              });
              vData["selectedProducts"] = selectedProducts;
              // vData["products"]=updatedProductList;
            }

            if (selectedProducts) updateDataList.push(vData);

            return null;
          })

        }
      }
      setData([...updateDataList]);
    } else if ((!variantData?.multiOption || (variantData?.multiOption && currentSelectedDetails?.prevKey === "")) && variantData?.options?.length) setData([...variantData?.options]);
  }, [selectedDetails]);
  return data.length ? (
    <React.Fragment>
      {width < 640 ? data.map((k1, i1) => i1 < 4 ? (
        <VariantCard setchangeCustomizeOption={setchangeCustomizeOption} qty={qty} key={`varCardOnly_low1_${name}_${i1}_${k1?.id}`} getApiCartOptions={getApiCartOptions} getDeliveryDate={getDeliveryDate} setmanualsizelabel={setmanualsizelabel} setmanualsizestr={setmanualsizestr} selectedManualSizeData={selectedManualSizeData} setSelectedManualSizeData={setSelectedManualSizeData} selectedDetails={selectedDetails} keyList={[...keyList, i1]} data={k1} selected={selected} setSelected={setSelected} variantData={variantData} expandNext={expandNext} isSample={isSample} setStopNextNav={setStopNextNav} translate={translate} />
      ) : null) : data.map((k1, i1) => i1 < 6 ? (
        <VariantCard setchangeCustomizeOption={setchangeCustomizeOption} qty={qty} key={`varCardOnly_low2_${name}_${i1}_${k1?.id}`} getApiCartOptions={getApiCartOptions} getDeliveryDate={getDeliveryDate} setmanualsizelabel={setmanualsizelabel} setmanualsizestr={setmanualsizestr} selectedManualSizeData={selectedManualSizeData} setSelectedManualSizeData={setSelectedManualSizeData} selectedDetails={selectedDetails} keyList={[...keyList, i1]} data={k1} selected={selected} setSelected={setSelected} variantData={variantData} expandNext={expandNext} isSample={isSample} setStopNextNav={setStopNextNav} translate={translate} />
      ) : null)}
      {((width < 640 && data.length > 4) || (width >= 640 && data.length > 6)) ? (
        <React.Fragment>
          {expanded === "panelVarient" ? (
            <React.Fragment>
              {/* <Accordion expanded={expanded === 'panelVarient'} onChange={() => null}> */}
              {/* <AccordionSummary className='hide' aria-controls={`panelVarient_acc-content_${name}`} id={`panelVarient_acc-header_${name}`}> </AccordionSummary>
                <AccordionDetails>
                  <div className="flex left wrap gap-y-4 variantCardList"> */}
              {width < 640 ? data.map((k1, i1) => i1 > 3 ? (
                <VariantCard setchangeCustomizeOption={setchangeCustomizeOption} qty={qty} key={`varCardOnly_hig1_${name}_${i1}_${k1?.id}`} getApiCartOptions={getApiCartOptions} getDeliveryDate={getDeliveryDate} setmanualsizelabel={setmanualsizelabel} setmanualsizestr={setmanualsizestr} selectedManualSizeData={selectedManualSizeData} setSelectedManualSizeData={setSelectedManualSizeData} selectedDetails={selectedDetails} keyList={[...keyList, i1]} data={k1} selected={selected} setSelected={setSelected} variantData={variantData} expandNext={expandNext} isSample={isSample} setStopNextNav={setStopNextNav} translate={translate} />
              ) : null) : data.map((k1, i1) => i1 > 5 ? (
                <VariantCard setchangeCustomizeOption={setchangeCustomizeOption} qty={qty} key={`varCardOnly_hig2_${name}_${i1}_${k1?.id}`} getApiCartOptions={getApiCartOptions} getDeliveryDate={getDeliveryDate} setmanualsizelabel={setmanualsizelabel} setmanualsizestr={setmanualsizestr} selectedManualSizeData={selectedManualSizeData} setSelectedManualSizeData={setSelectedManualSizeData} selectedDetails={selectedDetails} keyList={[...keyList, i1]} data={k1} selected={selected} setSelected={setSelected} variantData={variantData} expandNext={expandNext} isSample={isSample} setStopNextNav={setStopNextNav} translate={translate} />
              ) : null)}
              {/* </div>
                  </AccordionDetails> */}
              {/* </Accordion>  */}
            </React.Fragment>
          ) : null}
          <div className="flex col w-1/1">
            <div className='flex center pt-4'>
              {/* purposely commented */}
              {/* <div className='flex center pt-4' style={{ maxWidth: 588 }}> */}
              <Button style={{ padding: "7px 13px 7px 23px", minWidth: 186, borderRadius: 999, fontSize: 16, fontWeight: "bold", borderColor: "#CCCCCC" }} className={`flex gap-2 meerButton ${expanded !== 'panelVarient' ? "toon" : "lees"}`} variant='outlineNoHover' onClick={() => { if (expanded === 'panelVarient') { setExpanded(false); handleExpandNext(1) } else setExpanded('panelVarient') }}>
                <span>{expanded !== 'panelVarient' ? "toon meer" : "toon minder"}</span>
                <KeyboardArrowDown />
              </Button>
            </div>
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  ) : null;
}
const CustomizeCardAction = ({storeId,selectedDetailsFinal,setQty,qtymatch, setchangeCustomizeOption,qty, getApiCartOptions, getDeliveryDate, keyList, selected, setSelected, data, setStopNextNav, expandNext, otherSettings, translate }) => {
  const customizeKey = keyList[0], mutiSelect = Boolean(otherSettings?.mutiSelect);
  const imgUrl = data?.product_gallery_images?.[0]?.["image"] ? data?.product_gallery_images?.[0]?.["image"] : data?.image ? data.image : false;
  // useEffect(() => {
  //   const option = getApiCartOptions();

  //   if (selected && selected[customizeKey]?.includes(data?.id)) {
  //     console.log(data?.id,"id")
  //     if ((data?.additional_delivery_days > 0 || customizeKey === "Verzendopties" || customizeKey ==="Levertijd" ) && qty > 0) {
  //       setTimeout(() => {
  //         getDeliveryDate(option, qty);
  //       }, 1000);
  //     }
  //   }

  // }, [selected[customizeKey][0]]);
  const placeholderImage = useSelector(state => state?.getHomePageData?.data?.place_holder_image);

  return (
    <div className="variantCard flex">
      <button
        aria-label="button"
        className={`content flex col gap-2 ${data?.id && selected[customizeKey]?.includes(data.id) ? "active" : ""}`}
       
        onClick={() => {
          const selectedData = { ...selected };
          let selectedCard = [...selected[customizeKey]];
          if (data?.id && selectedCard.includes(data.id)) {
            selectedCard.splice(selectedCard.indexOf(data.id), 1);
          } else if (data?.id) {
            if (!mutiSelect) {
          if ((data?.additional_delivery_days > 0 || customizeKey === "Verzendopties" || customizeKey ==="Levertijd" ) && qty > 0) {
            setchangeCustomizeOption({
            customoption:data?.id,
            qty:true
          })

          }
          else{
            setchangeCustomizeOption({
            customoption:"",
             qty:true
            })
          }
          
         
              selectedCard = []; 
              expandNext(true);
              setStopNextNav(false);
            } else {
              setStopNextNav(true);
            }
            selectedCard.push(data.id);
          }
        
          selectedData[customizeKey] = selectedCard;
          setSelected({ ...selectedData });
          
        }}
      >
        <React.Fragment>
          <div className='flex-1 w-1/1 flex col pt-2 px-2 customize_card'>
            <div className="relative w-1/1 r-3 overflow-hidden">
              {imgUrl ? (
                <div className="imgInfo absolute w-1/1 h-1/1">
                  <Img  src={handleImage(imgUrl , placeholderImage)} alt={data.name ? data.name : "No name"} type='img' style={{ objectFit: "contain", maxWidth: "100%" }} />
                </div>) : (
                <div className="txtInfo absolute w-1/1 h-1/1 flex center middle">
                  <h5 className='tc'>{data.name ? data.name : "No name"}</h5>
                </div>)}

              <div style={{ paddingTop: "100%" }}></div>
              
            </div>
          </div>
          {imgUrl ? (
           <div className='varientInfo auto w-1/1 flex col gap-2 middle pb-2 px-2'>
            <h3 className='label tc' lang="en">
            {translate?.[`${data?.name}`.toLowerCase()]
            ? addHyphens(translate[`${data?.name}`.toLowerCase()])
           : addHyphens(data?.name)}
           </h3>
           <React.Fragment>
    
  </React.Fragment>
          </div>
) : null}
{storeId === 1 ?
    data?.tier_prices?.length && qty >0 && qtymatch(qty, data.tier_prices) >0 ? <h4 className='fs-14 fw-300 pb-4' lang="en">+ {euroCurrency(qtymatch(qty, data.tier_prices))}</h4> 
    : data?.price && qty > 0 && data?.price > 0 ?(
    <h4 className='fs-14 fw-300 pb-4' lang="en">+ {euroCurrency(data?.price)}</h4> 
    ) 
    : null
  :
  data?.tier_prices?.length && qtymatch(qty, data.tier_prices) >0 ? <h4 className='fs-14 fw-300 pb-4' lang="en">+ {euroCurrency(qtymatch(qty, data?.tier_prices))}</h4> 
  : data?.price ?(
  <h4 className='fs-14 fw-300 pb-4' lang="en">+ {euroCurrency(data?.price)}</h4> 
  ) 
  : null}
        </React.Fragment>
      </button>
    </div>
  )
}
const CustomizeCardSingle = ({storeId,selectedDetailsFinal,setQty,  qtymatch,setchangeCustomizeOption, qty, getApiCartOptions, getDeliveryDate, keyList, selected, setSelected, data, variantData, expandNext, setStopNextNav, handleExpandNext, translate }) => {
  const [width] = useWindowSize();
  const [expanded, setExpanded] = useState(false);
  const [optionsList, setOptionsList] = useState([]);
  useEffect(() => {
    if (data?.options?.length) {
      const tempOptions = [...data.options];
      if (tempOptions?.[0]?.sort_order) tempOptions.sort((i, j) => parseInt(i.sort_order || 0) - parseInt(j.sort_order || 0));
      setOptionsList(tempOptions);
    } else {
      if (optionsList.length) setOptionsList([]);
    }
  }, [data?.options])
  return optionsList?.length ? (
    <React.Fragment>
      {width < 640 ? optionsList.map((item, i) => i < 4 ? (
        <CustomizeCardAction
        storeId={storeId}
          key={`CustomizeCardAction${variantData.label}_${keyList[0]}_${keyList[1]}_${keyList[2]}_${i}`}
          keyList={[...keyList, i]}
          selectedDetailsFinal={selectedDetailsFinal}
          setQty={setQty}
          setchangeCustomizeOption={setchangeCustomizeOption}
          selected={selected}
          setSelected={setSelected}
          data={item}
          variantData={variantData}
          expandNext={expandNext}
          setStopNextNav={setStopNextNav}
          translate={translate}
          getApiCartOptions={getApiCartOptions}
          getDeliveryDate={getDeliveryDate}
          qty={qty}
          qtymatch={qtymatch}
        />
      ) : null) : optionsList.map((item, i) => i < 6 ? (
        <CustomizeCardAction
        storeId={storeId}
        selectedDetailsFinal={selectedDetailsFinal}
        setQty={setQty}
          key={`CustomizeCardAction${variantData.label}_${keyList[0]}_${keyList[1]}_${keyList[2]}_${i}`}
          keyList={[...keyList, i]}
          setchangeCustomizeOption={setchangeCustomizeOption}
          selected={selected}
          setSelected={setSelected}
          data={item}
          variantData={variantData}
          expandNext={expandNext}
          setStopNextNav={setStopNextNav}
          translate={translate}
          getApiCartOptions={getApiCartOptions}
          getDeliveryDate={getDeliveryDate}
          qty={qty}
          qtymatch={qtymatch}

        />
      ) : null)}
      {((width < 640 && optionsList.length > 4) || (width >= 640 && optionsList.length > 6)) ? (
        <React.Fragment key={`customizeCardAccordion_${variantData.label}`} >
          {expanded === 'panelVarient' ?
            <React.Fragment>
              {width < 640 ? optionsList.map((item, i) => i > 3 ? (
                <CustomizeCardAction
                storeId={storeId}
                selectedDetailsFinal={selectedDetailsFinal}
                setQty={setQty}
                setchangeCustomizeOption={setchangeCustomizeOption}
                  key={`CustomizeCardAction${variantData.label}_${keyList[0]}_${keyList[1]}_${keyList[2]}_${i}`}
                  keyList={[...keyList, i]}
                  selected={selected}
                  setSelected={setSelected}
                  data={item}
                  variantData={variantData}
                  expandNext={expandNext}
                  setStopNextNav={setStopNextNav}
                  translate={translate}
                  getApiCartOptions={getApiCartOptions}
                  getDeliveryDate={getDeliveryDate}
                  qty={qty}
                  qtymatch={qtymatch}

                />
              ) : null) : optionsList.map((item, i) => i > 5 ? (
                <CustomizeCardAction
                storeId={storeId}
                setchangeCustomizeOption={setchangeCustomizeOption}
                selectedDetailsFinal={selectedDetailsFinal}
                setQty={setQty}
                  key={`CustomizeCardAction${variantData.label}_${keyList[0]}_${keyList[1]}_${keyList[2]}_${i}`}
                  keyList={[...keyList, i]}
                  selected={selected}
                  setSelected={setSelected}
                  data={item}
                  variantData={variantData}
                  expandNext={expandNext}
                  setStopNextNav={setStopNextNav}
                  translate={translate}
                  getApiCartOptions={getApiCartOptions}
                  getDeliveryDate={getDeliveryDate}
                  qty={qty}
                  qtymatch={qtymatch}

                />
              ) : null)}
            </React.Fragment> : null}
          <div className='flex center pt-4' style={{ width: "100%" }}>
            {/* purposely commented */}
            {/* <div className='flex center pt-4' style={{ maxWidth: 588, width:"100%" }}> */}
            <Button style={{ padding: "7px 13px 7px 23px", minWidth: 186, borderRadius: 999, fontSize: 16, fontWeight: "bold", borderColor: "#CCCCCC" }} className={`flex gap-2 meerButton ${expanded !== 'panelVarient' ? "toon" : "lees"}`} variant='outlineNoHover' onClick={() => { if (expanded === 'panelVarient') { setExpanded(false); handleExpandNext(1) } else setExpanded('panelVarient') }}>
              <span>{expanded !== 'panelVarient' ? "toon meer" : "toon minder"}</span>
              <KeyboardArrowDown />
            </Button>
          </div>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  ) : null;
}
const CustomizeCardRoot = ({storeId,selectedDetailsFinal,setQty,qtymatch, setchangeCustomizeOption,qty, getDeliveryDate, getApiCartOptions, keyList, variantData, selected, setSelected, expandNext, handleExpandNext, setStopNextNav, translate }) => {
  return variantData?.options && Object.keys(variantData?.options).length ? Object.keys(variantData.options).length === 1 ? (
    <React.Fragment>
      {Object.keys(variantData.options).map((key, i) => variantData.options[key] && variantData.options[key]?.length ? (
        <div className="flex left wrap gap-2 w-1/1" key={`CustomizeCardRoot_${variantData.label}${i}`} >
          {variantData.options[key].map((item, i2) => (
            <CustomizeCardSingle
              key={`CustomizeCardSingle_${variantData.label}_${i}_${i2}`}
              keyList={[...keyList, key, i2]}
              setchangeCustomizeOption={setchangeCustomizeOption}
              selected={selected}
              storeId={storeId}
              setSelected={setSelected}
              data={item}
              selectedDetailsFinal={selectedDetailsFinal}
              setQty={setQty}
              variantData={variantData}
              expandNext={expandNext}
              setStopNextNav={setStopNextNav}
              handleExpandNext={handleExpandNext}
              translate={translate}
              getDeliveryDate={getDeliveryDate}
              getApiCartOptions={getApiCartOptions}
              qty={qty}
              qtymatch={qtymatch}
            />
          ))}
        </div>
      ) : null)}
    </React.Fragment>
  ) : (
    <React.Fragment>
    </React.Fragment>
  ) : null;
}
const SubGroupItem = ({ setchangeCustomizeOption,setOpenModelInfo,getApiCartOptions, getDeliveryDate, keyList, data, selected, expandNext, stopNextNav, setStopNextNav, setSelected, sel, setSel, setServicesDetailsData, setOpenModel, qty, translate, dataMain }) => {
  const [exp, setExp] = useState("thisTab");
  const [optionList, setOptionList] = useState([]);
  const InfoImage = "/res/img/info.svg";
  const [imageSrc, setImageSrc] = useState("");
  const setcategoryDetails = () => {
    const categoryDetails = {
      category_name: data?.name,
      category_description: data?.description,
      hideVragen: true,
      option: {
        img: data?.optionImage,
        position: data?.name,
        positionVal: data?.subgrouplabel,
        maxi: data?.groupinfo,
        download_template_url: data?.download_template_url
      }
    }
    setServicesDetailsData({ content: { categoryDetails } })
  }
  const handleExp = () => {
    if (keyList?.[1] && selected?.[keyList[1]]?.length) {
      let temp = "thisTab"
      data.options.map((d, i) => {
        if (d?.id && selected[keyList[1]]?.includes(d.id)) temp = "";
        return null;
      })
      setExp(temp);
    }
  }
  // commented for purpose
  // const qtymatch = (qty, tier_prices) => {
  //   console.log({qty,tier_prices})
  //   let price = 0;
  //   if (tier_prices?.length) {
  //     tier_prices.forEach((t, i) => price = t.qty <= qty ? t.price : t.price)
  //   }
  //   return price ? `+ ${euroCurrency(price)}` : ""
  // }
  const qtymatch = (qty, tier_prices) => {

    let price = 0;
    if (tier_prices?.length) {
      tier_prices.sort((a, b) => a.qty - b.qty);

      tier_prices.forEach(t => {
        if (t.qty <= qty) {
          price = t.price;
        }
      });
    }

    return price  ? `+ ${euroCurrency(price)}` : "";
  };

  useEffect(() => {
    if (data?.options && data?.options?.length) {
      const tempData = [...data?.options];
      if (tempData?.[0]?.sortorder) tempData.sort((i, j) => parseInt(i.sortorder || 0) - parseInt(j.sortorder || 0));
      setOptionList(tempData);
      handleExp();
    }
  }, [data]);
  useEffect(() => {
    if (data?.options && data?.options?.length) {
      handleExp();
    }
  }, [selected]);

  useEffect(() => {
    if (data?.optionImage) {
      setImageSrc(data?.optionImage)
    }
  }, [data])

  return (
    <div className=' w-1/1 flex col gap-1 subGroupItem'>
      {data?.name ? (<h3 className='flex gap-1 middle'>
        <b>{"Drukmethode"}:</b>
        <span onClick={() => {
          if (data?.name || data?.description) {
            setOpenModelInfo(true);
            setcategoryDetails()
          }
        }}>{translate?.[`${data?.name}`.toLowerCase()] ? translate[`${data?.name}`.toLowerCase()] : data?.name}</span>
        <IconButton aria-label="info" onClick={() => {
          if (data?.name || data?.description) {
            setOpenModelInfo(true);
            setcategoryDetails()
          }
        }}><Img src={handleImage(InfoImage)} className="infoimg" /></IconButton>
      </h3>) : null}
      {data?.name ? <h4>{data?.groupinfo}</h4> : null}
      <div className='w-1/1 flex gap-5 pt-2 wrap cardItem'>
        <div className="flex-0 relative hide flex center ">
          <div className='imgCard pointer' onClick={() => {
            if (data?.name || data?.description) {
              setOpenModel(true);
              setcategoryDetails()
            }
          }}>
            {data?.optionImage ?
              <Img animation={false} style={{ position: "absolute", objectFit: "contain" }} type="img"
                onError={() => {
                  setImageSrc(data?.optionImage)
                }}
                src={handleImage(imageSrc ? imageSrc : data?.optionImage)} alt={data?.name || "img"} title={data?.name || "img"} />
              : ""
            }
          </div>
        </div>
        <div className="flex-1 flex gap-2 wrap">
          {keyList?.[1] && optionList?.length ? optionList.map((d, i) => (

            <div key={`cardAction_flex${i}`} className="cardAction flex">
              {d?.max ==="X"?null:
              <button
              aria-label="button"
              className={`content flex col gap-2 ${(!d?.tier_prices?.length) && selected?.[keyList?.[1]]?.length && exp === "thisTab" ? "none" : ""} ${d?.id && selected?.[keyList[1]]?.includes(d.id) ? "active" : ""}`}
              disabled={d?.id && selected?.[keyList[1]]?.includes(d.id)}
              onClick={() => {
                const option = getApiCartOptions();
                if (d?.additional_delivery_days >=0 && qty > 0) {
                setchangeCustomizeOption({
                  customoption :d?.id,
                  qty:true

                })
                
                }
                else
                setchangeCustomizeOption({
                  qty:true
                })
                expandNext(false)
                const selectedData = { ...selected }, selectedMainData = { ...sel }, key0 = keyList?.[0], key1 = keyList?.[1];
                if (key0 && key1 && d?.id) {
                  if (!selectedData[key1]) selectedData[key1] = [];
                  let cardSelected = [...selectedData[key1]], cardSelectedMain = [];
                  if (cardSelected.includes(d.id)) {
                    cardSelected = []
                  } else {
                    cardSelected = [d.id];
                  }
                  dataMain?.length && dataMain.forEach((opt, i) => {
                    if (opt?.id !== data?.id) {
                      const op = opt?.options?.[0];
                      if (op && op?.id && !op?.price && !op?.tier_prices?.length) {
                        cardSelected.push(op.id)
                      }
                    }
                  });
                  const objKey = Object.keys(selectedData)
                  if (objKey.length) objKey.map((k) => {
                    cardSelectedMain = [...cardSelectedMain, ...k !== key1 ? selectedData[k] : cardSelected];
                    return null;
                  });
                  selectedData[keyList?.[1]] = cardSelected;
                  selectedMainData[keyList?.[0]] = cardSelectedMain;
                  setSelected({ ...selectedData });
                  setSel({ ...selectedMainData });
                }
              }}
            >
              <React.Fragment>
              <div className='varientInfo auto w-1/1 flex col gap-2 middle'>
             <React.Fragment>
            {d?.max ? (
            <h3 className='label' lang="en">
      {translate?.[`${d.max}`.toLowerCase()]
        ? addHyphens(translate[`${d.max}`.toLowerCase()])
        : addHyphens(d.max)}
    </h3>
  ) : d?.name ? (
    <h3 className='label' lang="en">
      {translate?.[`${d.name}`.toLowerCase()]
        ? addHyphens(translate[`${d.name}`.toLowerCase()])
        : addHyphens(d.name)}
    </h3>
  ) : null}
  <React.Fragment>
    {d?.tier_prices?.length ? <h4 className='label' lang="en">{qtymatch(qty, d.tier_prices)}</h4> : null}
  </React.Fragment>
</React.Fragment>
</div>
              </React.Fragment>
            </button>
              }
              
            </div>)) : null}
        </div>
      </div>
    </div>
  )
}
const AdditionalSubGroupListDeails = ({setchangeCustomizeOption,setOpenModelInfo, getApiCartOptions, getDeliveryDate, keyList, expandNext, stopNextNav, setStopNextNav, expAddData, setExpAddData, data, selected, setSelected, setServicesDetailsData, setOpenModel, qty, translate }) => {
  return (
    <div className="w-1/1 flex col gap-2 subGroupList py-6">
      {data?.length && data.map((item, index2) => (
        <React.Fragment key={`SubGroupList_options${keyList[1]}_${keyList[2]}_${index2}`}>
          <SubGroupItem setchangeCustomizeOption={setchangeCustomizeOption} setOpenModelInfo={setOpenModelInfo} getApiCartOptions={getApiCartOptions} getDeliveryDate={getDeliveryDate} expandNext={expandNext} stopNextNav={stopNextNav} setStopNextNav={setStopNextNav} keyList={[...keyList, index2]} selected={expAddData} setSelected={setExpAddData} sel={selected} setSel={setSelected} data={item} dataMain={data} setServicesDetailsData={setServicesDetailsData} setOpenModel={setOpenModel} qty={qty} translate={translate} />
        </React.Fragment>
      ))}
    </div>
  );
}
const AdditionalSubGroupList = ({setchangeCustomizeOption,setOpenModelInfo, getApiCartOptions, getDeliveryDate, keyList, expandNext, stopNextNav, setStopNextNav, name, data, selected, setSelected, setServicesDetailsData, setOpenModel, translate, qty }) => {
  const [expanded, setExpanded] = useState("0");
  const [expAddData, setExpAddData] = useState({});

  useLayoutEffect(() => {

    const thisAddData = { ...expAddData }
    if (data && Object.keys(data)) {
      Object.keys(data).map((key) => {
        thisAddData[key] = [];
        selected[keyList[0]] && selected[keyList[0]].length && data[key].length && data[key].map((item) => item?.options && item.options.length && item.options.map((i) => selected[keyList[0]].includes(i?.id) && thisAddData[key].push(i.id)));
        return null;
      })
    }
    const thisAddDataKeys = Object.keys(thisAddData);
    let opentab = -1;
    if (thisAddDataKeys.length) {
      thisAddDataKeys.map((dKey, index) => {
        if (opentab === -1 && !thisAddData[dKey].length) opentab = index;
      })
    }
    if (expanded !== "" && parseInt(expanded) !== opentab) {
      // if (parseInt(expanded) !== opentab) { for SKU:KC5132 autoscroll issue on pdp load
      const maxTab = Object.keys(data).length;
      opentab = maxTab > opentab ? opentab : 0;
      setExpanded(`${opentab}`)
      setTimeout(() => {
        if (maxTab > opentab) {
          const head = document.querySelector(`.subHeader`);
          const commEle = document.querySelector(`.additionalSubGroupListEle`);
          const top = commEle?.offsetTop + head?.clientHeight + 72 + ((opentab) * 64);
          window.scrollTo({ top, left: 0, behavior: "smooth" });
        }
      }, 600)
    }
    setExpAddData(thisAddData)
  }, [selected]);
  return data && Object.keys(data).length ? (
    <React.Fragment>
      {Object.keys(data).map((key, index) => data[key] && data[key]?.length ? (
        <React.Fragment key={`SubGroupList_Item${name}${key}${index}`}>
          <div className={`subAccordion${index}`} />
          <div className="flex col w-1/1" >
            <Accordion expanded={(expanded === "" && index === 0) || expanded === `${index}`} onChange={() => setExpanded(expanded === `${index}` ? "" : `${index}`)}>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls={`subGroupList_Item-content${index}`} id={`subGroupList_Item-header${index}`}>{key && translate?.[`${key}`.toLowerCase()] ? translate[`${key}`.toLowerCase()] : key}</AccordionSummary>
              <AccordionDetails>
                <AdditionalSubGroupListDeails setchangeCustomizeOption={setchangeCustomizeOption} setOpenModelInfo={setOpenModelInfo} getApiCartOptions={getApiCartOptions} getDeliveryDate={getDeliveryDate} key={`AdditionalSubGroupListDeails${keyList[0]}_${key}_${index}`} expandNext={expandNext} stopNextNav={stopNextNav} setStopNextNav={setStopNextNav} keyList={[...keyList, key, index]} expAddData={expAddData} setExpAddData={setExpAddData} selected={selected} setSelected={setSelected} data={data[key]} setServicesDetailsData={setServicesDetailsData} setOpenModel={setOpenModel} qty={qty} translate={translate} />
              </AccordionDetails>
            </Accordion>
          </div>
        </React.Fragment>
      ) : null)}
    </React.Fragment>
  ) : null;
}
const ProductVariant = ({ tokenGetData, setTokenGetData, key, setMinPrice, data, setGallerySelected, setOpenCopyURLModel, urlGenData, generateNewUrl, stateUploadedPath, setStateUploadedPath, productDetailsStaticData, translateData }) => {
  const { baseURL, defaultURL, storeId } = useContext(DomainContext);
  const qtyDataDefault = { isCustomQty: false, index: -1, price: 0, addOnPrice: 0 }
  const productId = data?.settings?.product_id;
  const productSku = data?.settings?.product_sku;
  const productName = data?.settings?.product_name;
  const hasFetchedDeliveryDate = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [variantQtydata, setVariantQtyData] = useState([]);
  const [openModelQty, setOpenModelQty] = useState(false);
  const [customQty, setcustomQty] = useState(false);
  const [totalValueQty, setTotalValueQty] = useState(0);
  const [oneTimeValue, setOneTime] = useState("0");
  const [displayAfterRender, setDisplayAfterRender] = useState(false)
  const [textAreaData, setTextData] = useState("");
  const [customOptions, setCustomOptions] = useState(null);
  const [reqExpandedUpload, setreqExpandedUpload] = useState(true);
  const [inputFieldExpand, setInputFieldExpand] = useState(false);
  const [changeCustomizeOption,setchangeCustomizeOption] = useState({
    customoption:"",
    qty:false,
    variant:""
  });
  const {
    isLoggedUser, customerId, token, guestQuoteId, guestKey, customerQuoteId, isSessionExpired
  } = useSelector(state => {
    return {
      isLoggedUser: state?.isLoggedUser,
      customerId: state?.customerDetails?.id,
      token: state?.token,
      updateWishList: state?.updateWishList,
      updateCartItems: state?.updateCartItems,
      guestQuoteId: state?.guestQuoteDetails?.id,
      guestKey: state?.guestKey,
      customerQuoteId: state?.customerQuoteId,
      wilistProductId: state?.wilistProductId,
      isSessionExpired: state?.isSessionExpired,
    }
  });

  // wishlist
  const wishlistAddedData = useSelector((state) => state?.wishlistAddedData);
  const [wishlistResponse, setwishlistResponse] = useState({ res: {}, status: null });
  const wishItem = wishlistAddedData?.filter(obj => obj?.sku === productSku);

  // Free sample details
  const [openFreeSample, setOpenFreeSample] = useState(false);
  const [isSampleCalled, setIsSampleCalled] = useState(false);

  // cart
  const [isNewUrlLoad, setIsNewUrlLoad] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessing1, setIsProcessing1] = useState(false);
  const [singleToken, setSingleToken] = useState("");
  const [allData, setAllData] = useState({});
  const [selectedColorData, setSelectedColorData] = useState(null);
  const [selectedManualSizeData, setSelectedManualSizeData] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedDataNow, setSelectedDataNow] = useState(null);
  const [selectedDataBackup, setSelectedDataBackup] = useState(null);
  const [selectedDataDefault, setSelectedDataDefault] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState({});
  const [selectedDetailsDefault, setSelectedDetailsDefault] = useState({});
  // const [setupCostColor, setSetupCostColor] = useState(0);
  const [selectedDetailsFinal, setSelectedDetailsFinal] = useState({ tier_prices: [], price: 0, setup_costs: 0, product_vat: 0 });
  const [sampleProductPrice, setSampleProductPrice] = useState({
    highest_tier: 0,
    condtion_one: false,
    condition_two: false,
    condtion_three: false
  })
  const increment = selectedDetailsFinal?.qty_increments || 1;
  const [expanded, setExpanded] = useState(0);
  const scrollPositionRef = useRef(0);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const isInitialRender = useRef(true);
  const [reqExpanded, setReqExpanded] = useState(false);
  const [qty, setQty] = useState(0);
  const [qtyUrl, setQtyUrl] = useState(-1);
  const [qtyTemp, setQtyTemp] = useState(0);
  const [qtyData, setQtyData] = useState({ ...qtyDataDefault });
  const [isCustomQty, setIsCustomQty] = useState(null);
  const [isSample, setIsSample] = useState(false); // For sample
  const [sampleCustomizeItem, setSampleCustomizeItem] = useState([]); // For sample
  const [sampleQty, setSampleQty] = useState([]); // For sample
  const [openModelUpload, setOpenModelUpload] = useState(false); // For uploadInfo
  const [openModelDelivery, setOpenModelDelivery] = useState(false); // For DeliveryInfo

  const [additionalOption, setAdditionalOption] = useState({ is: false, sku: "" });
  const [deliveryData, setDeliveryData] = useState(null);
  const [expandPrice, setExpandPrice] = useState(false);
  const [servicesDetailsData, setServicesDetailsData] = useState(null);
  const [selectedColorItem, setSelectedColorItem] = useState(null)
  const [openColorModel, setOpenColorModel] = useState(false)
  const [stopNextNav, setStopNextNav] = useState(false);

  // ups
  const [tagUrl, setTagUrl] = useState("");
  const [isUpsCalled, setIsUpsCalled] = useState(false);
  const [openModelUPS, setOpenModelUPS] = useState(false);
  const [openModelInfo, setOpenModelInfo] = useState(false);
  const [openModelUPSNew, setOpenModelUPSNew] = useState(false);
  const uspHandler = (url) => {
    setTagUrl(url);
    setIsUpsCalled(false);
    setOpenModelUPSNew(true);
  }
  const [imagesDropbox, setImagesDropbox] = useState([]);
  const [imageCanvasTemplate, setImageCanvasTemplate] = useState("");
  const [dropboxFiles, setDropboxFiles] = useState("");
  const [reloadScroll, setReloadScroll] = useState(false);
  const [disableAction, setdisableAction] = useState("");
  const [errorCart, setErrorCart] = useState("");
  const [errorCartText, setErrorCartText] = useState("");
  const [errorOpenTab, setErrorOpenTab] = useState("");
  const [cmsError, setCmsError] = useState("");
  const [errorQty, setErrorQty] = useState(true);
  const [manualsizestr, setmanualsizestr] = useState(null);
  const [InputManualSize, setInputManualSize] = useState(null);
  const [manualsizelabel, setmanualsizelabel] = useState(null);
  const [width] = useWindowSize()
  useEffect(() => {
    const interval = setTimeout(() => {
      setErrorCartText(errorCart)
    }, 500);
    return () => clearInterval(interval);
  }, [setErrorCart])

  useEffect(() => {
    setTimeout(() => setErrorCart(""), 5000);

  }, [errorCart])

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        setDisplayAfterRender(true);
      }, 500);
    }
  }, [])
  const startAccordionRef = useRef(null);// Referance
  const getNextData = (fromCart, data, details) => {
    const selData = data ? data : selectedData;
    const selDetails = details ? details : selectedDetails;
    const isNotUpload = selDetails?.upload?.hide === true;
    const list = Object.keys(selDetails);
    let nextNo = -1, length = 0, isQty = "", movenext = true;
    if (selDetails?.isSample) length--;
    if (!isNotUpload) length--;
    // On purpose
    // const c4 = key === "size" && (errorQty === false);
    // if(c4) movenext = false;
    list?.length && list.forEach((key, i) => {
      if (movenext) {
        const c1 = ((key === "upload") && list.includes("upload"));
        const c2 = ((selDetails?.[key]?.thisType === "additional") && (selDetails?.[key]?.hide === true));
        const c3 = key === "cpker" && (i > parseInt(expanded) || cmsError === "false" || cmsError === "");
        const c4 = key === "size" && (i > parseInt(expanded) && allData?.size?.isManualSize == true);
        // const c4 = key === "size" && allData?.size?.isManualSize == true;
        if (c3 || c4) movenext = false;
        // if (c3) movenext = false;
        else if (!c1 && !c2) {
          const condition0 = key === "cpker";
          // const condition1 = !condition0 && key === "upload" && (selData?.upload?.length || imagesDropbox.length > 0 || textAreaData !== "");
          const condition1 = !condition0 && key === "upload" ;
          const condition2 = !condition1 && Boolean(selData[key] && selData[key].length);
          const conditionI1 = key === "qty";
          // const conditionI4 = key === "size" && allData?.size?.isManualSize == true;
          isQty = !condition2 && list[i] === 'qty' ? "now" : condition2 && list[i] === 'qty' ? (qty > 0 || isCustomQty === true ? "full" : "now") : "";
          if (conditionI1) {
            if (qty > 0 && !isCustomQty ) nextNo = nextNo + 1;
            else if( qty > 0 && isCustomQty && customQty) nextNo = nextNo + 1;
            //  if(qty > 0 && isCustomQty)nextNo = nextNo + 1;
            // if ((qty > 0 && (isCustomQty === true  && selectedDetailsFinal?.qty_increments > 1) )) nextNo = nextNo ;
            // else if (qty > 0 && isCustomQty ===false) nextNo = nextNo +1;
          //  else if ((qty > 0 && isCustomQty === true && selectedDetailsFinal?.qty_increments > 1)) nextNo = nextNo ;

            // else if (warningMessage!=="") nextNo = nextNo;
            //  else if ((qty > 0 && (isCustomQty === true && selectedDetailsFinal?.qty_increments > 1 && warningMessage !== ""))) nextNo = nextNo;
            // else if ((qty > 0 && (isCustomQty === true && selectedDetailsFinal?.qty_increments>1))) nextNo = nextNo;
            else movenext = false;
          } else if (condition0 || condition1 || condition2) nextNo = i + 1;
          else if (!condition2 && !condition1) movenext = false;
        } else if ((c1 && !isNotUpload)) {
          if (selData?.upload?.length || imagesDropbox.length > 0 || textAreaData !== "") nextNo = nextNo + 1;
          else movenext = false;
        } else if (c1 && isNotUpload) nextNo = nextNo + 1;
        else if (c2) nextNo = nextNo + 1;
      }
    });
if(selDetails?.isSample && nextNo == -1){
  nextNo = 0;
}
    // On purpose
    // const condition0 = key === "cpker" && (expanded !== 0 && expanded < i);
    // const condition1 = !condition0 && Boolean(selectedData[key] && selectedData[key].length);
    // const condition2 = !condition1 && key === "upload" && (selectedDetails?.upload?.hide || imagesDropbox.length > 0 );
    // const condition3 = !condition2 && allData[key]?.is_require === false;
    // if (condition0 || condition1 || condition2 || condition3) len++;
    // if (nextNo === -1) {
    //   nextNo = condition0 || !(condition1 || condition2 || condition3) ? i : nextNo;
    // }
    // if(isQty === "now") nextNo
    // isQty = Boolean(nextNo > -1 && length && Object.keys(selectedDetails)?.[nextNo] === "qty");
    return { nextNo, isQty, length: list?.length };
  };
  // useEffect(() => {
  //   // Validate the qtyTemp value whenever it changes
  //   if (Number(qtyTemp) % increment !== 0 && qtyTemp !== '') {
  //     setWarningMessage(` Voer een hoeveelheid in die een veelvoud is van [${selectedDetailsFinal?.qty_increments}].`);
  //   } else {
  //     setWarningMessage("");
  //   }
  // }, [qtyTemp, increment]);

 

function getPriceForQty(qty, tierprice) {
  const sortedTierPrice = [...tierprice].sort((a, b) => a.qty - b.qty);
  
  let nearestPrice = null;
  for (let i = 0; i < sortedTierPrice.length; i++) {
      if (sortedTierPrice[i].qty <= qty) {
          nearestPrice = sortedTierPrice[i].price;
      } else {
          break; // Stop searching once we exceed the qty
      }
  }

  return nearestPrice + qtyData ?.addOnPrice;
}

  const handleExpanded = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : "");
  };



  //commented for purpose
  // const handleButtonClick = () => {
  //   setExpanded(""); 
  //   setIsCustomQty(false); 
  //   setIsButtonClicked(true);

  //   UpdateTextQty(qtyTemp, selectedDetailsFinal, setQty, setQtyTemp, getDeliveryDate, getApiCartOptions);

  //   if (selectedDetailsFinal?.tier_prices?.length) {
  //     setIsCustomQty(true);
  //   }
  // };

  
  const handleExpandNext = (action, fromCart, data, details) => {
    const { nextNo, isQty, length } = getNextData(fromCart, data, details);
    if (nextNo > -1) {
      setExpanded(`${nextNo}`)
      if (fromCart) setErrorOpenTab(`${nextNo}`)
    } else if (nextNo === -1 && fromCart) {
      setErrorOpenTab("0")
    }
   
    setTimeout(() => {
      const head = document.querySelector(`.subHeader`);
      if(nextNo > -1){
        let ele = document.querySelector(`.accordion${nextNo}`);
         if (!ele ) ele =   document.querySelector(`.accordion0`) ;
         const top = ele?.offsetTop - (action ? -44 : -(head?.clientHeight));
         window.scrollTo({ top, left: 0, behavior: "smooth" });
      }
        }, action ? 800 : 600)
  };
  // const handleExpandNext = (action, fromCart, data, details) => {
  //   const { nextNo, isQty, length } = getNextData(fromCart, data, details);
  
  //   if (nextNo > -1) {
  //     setExpanded(`${nextNo}`);
  //     if (fromCart) setErrorOpenTab(`${nextNo}`);
  //   } else if (fromCart) {
  //     setErrorOpenTab("0");
  //   }
   
  //   setTimeout(() => {
  //     const headHeight = document.querySelector(`.subHeader`)?.clientHeight || 0;
  //     const targetAccordion = document.querySelector(`.accordion${nextNo}`) || document.querySelector(`.accordion0`);
  //     // const targetAccordion = document.querySelector(`.accordion${nextNo}`) || document.querySelector(`.accordion${nextNo === -1 ? nextNo + 1 : isQty =="now" ?0:nextNo } ` || document.querySelector(`.accordion0`));
  //     // const targetAccordion = document.querySelector(`.accordion${nextNo}`) || document.querySelector(`.accordion${nextNo== -1 ? 0 : ""}`);
  //     if (targetAccordion) {
  //       const offset = targetAccordion.offsetTop - (action ? -44 : -headHeight);
  //       window.scrollTo({ top: offset, left: 0, behavior: "smooth" });
  //     }
  //   }, action ? 800 : 600);
  // };
  
  const isAdditionalOption = () => (imagesDropbox.length || selectedDetailsFinal.setup_costs || (allData["cpker"]?.thisType === "cpker")) ? true : false;
  let getDeliveryDateOption = ""

  const getDeliveryDate = async (option, quantity) => {
    const addiData = [...option?.customize?.length ? option?.customize : [], ...option?.additional?.length ? option?.additional : []];
    let addiObj = {};
    if (addiData.length) {
      addiData.forEach((data) => {
        addiObj = { ...addiObj, ...data }
      })
    }
    const tempOption = {
      productId: data?.settings?.product_id,
      simpleProductId: option?.products?.length && option?.products[1]? option?.products[1] :option?.products?.length && option?.products[0]? option?.products[0]: 0,
      // simpleProductId: option?.products?.length ? option?.products[0] : "",
      customOptions: addiObj,
      itemId: 0,
      qty:  quantity ? quantity : 1,
      selOptHasVariants: isAdditionalOption ? 1 : 0,
      isSample: isSample ? 1 : 0,
      storeId: storeId
    };
    if (getDeliveryDateOption !== JSON.stringify(tempOption)) {
      try {
        getDeliveryDateOption = JSON.stringify(tempOption);
        const resp = await axios.post(`${baseURL}/getdeliverydate`, tempOption);
        setDeliveryData({ ...resp.data[0] });
      } catch (err) {
        getDeliveryDateOption = ""
        console.error(err);
      }
    }
  };

  useEffect(() => {
    if (data?.settings?.product_id && deliveryData===null) {
      getDeliveryDate({},qty)
    }
  }, [])
  // const qtymatch = (qty, tier_prices) => {
  //   let price = 0;
  //   if (tier_prices?.length) {
  //     tier_prices.forEach((t, i) => price = t.qty <= qty ? t.price : price)
  //   }
  //   return price > 0  ? parseFloat(price) : ""
  //   // return price ? `+ ${euroCurrency(price)}` : "";

  // }
  const qtymatch = (qty, tier_prices) => {

    let price = 0;
    if (tier_prices?.length) {
      tier_prices.sort((a, b) => a.qty - b.qty);

      tier_prices.forEach(t => {
        if (t.qty <= qty) {
          price = t.price;
        }
      });
    }
    return price > 0  ? parseFloat(price) : ""

  };
  const getApiCartOptions = () => {
    let option = null;
    if (data?.settings?.product_id && selectedDetails && Object.keys(selectedDetails).length) {
      option = { data: [], customize: [], additional: [], products: [], isUpload: false, isSample: false };
      Object.keys(selectedDetails).map((key, i) => {
        const d = selectedDetails[key];
        if (d && d?.thisType === "variant") {
          if (d?.products) option["products"] = [...option["products"], ...d.products]
          if (d?.returnData) option["data"] = [...option["data"], ...d.returnData]
          if (d?.returnData) option["finalData"] = [...d.returnData]
          if (d?.returnData) option["finalProducts"] = [...d.products]
        } else if (d && d?.thisType === "customize") {
          if (d?.returnData) option["customize"] = [...option["customize"], ...d.returnData]
        } else if (d && d?.thisType === "additional") {
          if (d?.returnData) option["additional"] = [...option["additional"], ...d.returnData]
        } else if (d && d?.thisType === "upload") {
          if (d?.returnData) option["isUpload"] = Boolean(d?.isUpload)
        } else if (d && d?.thisType === "isSample") {
          option["isSample"] = Boolean(d?.isSample)
        }
        return null;
      });
      // for multiple api call of get deliverydays commented
      // if (option["products"].length) getDeliveryDate(option, "getApiCartOptions")
    }
    return option;
  }
  // const getKeyVal = (option, sizeOption) => {
  //   if (!option || !option.length) return [];

  //   let result = option.map((itemOption) => {
  //     return Object.keys(itemOption).map((key) => {
  //       return { option_id: key, option_value: itemOption[key] };
  //     });
  //   }).flat();
  //   if (data?.isTextileProduct === 1) {
  //     if (sizeOption) {
  //       result.push({ option_id: sizeOption?.id, option_value: Object.values(sizeOption?.options)[0].id });
  //     }
  //   }
  //   return result;
  // };

  const isValidBase64 = (str) => {

    if (/^\d+$/.test(str)) {
      return true;
    }

    const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;

    if (!str || typeof str !== 'string' || !base64Regex.test(str)) {
      return false;
    }

    if (str === "0") {
      return true;
    }

    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };


  const decodeBase64 = (encodedString) => {
    try {
      return atob(encodedString);
    } catch (e) {
      return encodedString;
    }
  };
  //   const getKeyVal = (option, sizeOption) => {
  //     if (!option || !option.length) return [];
  //     let result = option.map((itemOption) => {
  //       return Object.keys(itemOption).map((key) => {
  //         return { option_id: key, option_value: itemOption[key] };
  //       });
  //     }).flat();
  //     if (data?.isTextileProduct === 1) {
  //       if (sizeOption && !isSample) {
  //         result.push({ option_id: sizeOption?.id, option_value: Object.values(sizeOption?.options)[0].id });
  //       }
  //     }
  //     // Remove duplicate option_id entries if not a sample
  //     if (!isSample) {
  //       let uniqueResult = result.reduce((acc, current) => {
  //         const x = acc.find(item => item.option_id === current.option_id);
  //         if (!x) {
  //           return acc.concat([current]);
  //         } else {
  //           return acc;
  //         }
  //       }, []);
  //       return uniqueResult;
  //     } else {
  //       return result;
  //     }
  // };
  const getKeyVal = (option, sizeOption) => {
    if (!option || !option.length) return [];
    let result = option.map((itemOption) => {

      return Object.keys(itemOption).map((key) => {
        let optionVal = itemOption[key]?.includes("YYYY") ? itemOption[key]?.replace("YYYY", "") : itemOption[key];
        if (itemOption[key]?.includes("YYYY")) {
          return { option_id: key, option_value: atob(optionVal) };
        }

        if (isValidBase64(optionVal)) {

          return { option_id: key, option_value: (itemOption[key]) };
        } else {
          const decodedValue = decodeBase64(optionVal);
          return { option_id: key, option_value: decodedValue };
        }
      });
    }).flat();

    if (data?.isTextileProduct === 1) {
      if (sizeOption && !isSample) {
        result.push({ option_id: sizeOption?.id, option_value: Object.values(sizeOption?.options)[0].id });
      }
    }
    // Remove duplicate option_id entries if not a sample
    if (!isSample) {
      let uniqueResult = result.reduce((acc, current) => {
        const x = acc.find(item => item.option_id === current.option_id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      return uniqueResult;
    } else {
      return result;
    }
  };
  const getColorData = (selColorData) => {
    let colorPricker = {
      pms_distribution: "",
      pms_hex_value: "",
      pms_min_value: "",
      pms_value: "",
      pms_key: "",
      product_ids: "",
      is_multiselect: 0,
      design_explanation: "",
      pms_colors_selected: 1,
    };
    Object.keys(selColorData).forEach((colorId) => {
      colorPricker = {
        ...colorPricker,
        is_multiselect: data?.settings?.xml ? 0 : 1,
        pms_distribution: `${colorPricker.pms_distribution}:`,
        pms_hex_value: `${colorPricker.pms_hex_value}:`,
        pms_min_value: `${colorPricker.pms_min_value}:`,
        pms_value: `${colorPricker.pms_value}:`,
        pms_key: `${colorPricker.pms_key},`,
        product_ids: `${colorPricker.product_ids},`,
      };
      const temp = selColorData[colorId];
      if (temp.length) {
        let pms_key = "",
          product_ids = "";
        temp.forEach((tempColor) => {
          colorPricker = {
            ...colorPricker,
            pms_distribution: `${colorPricker?.pms_distribution ? `${colorPricker?.pms_distribution},` : ""}${tempColor?.qty}`.replace(/^:|^,/g, '').replace(/:,/g, ':').replace(/^,/, ''),
            pms_hex_value: `${colorPricker?.pms_hex_value ? `${colorPricker?.pms_hex_value},` : ""}${tempColor?.hex}`.replace(/^:|^,/g, '').replace(/:,/g, ':').replace(/^,/, ''),
            pms_min_value: `${colorPricker?.pms_min_value ? `${colorPricker?.pms_min_value},` : ""}${tempColor?.minQty}`.replace(/^:|^,/g, '').replace(/:,/g, ':').replace(/^,/, ''),
            pms_value: `${colorPricker?.pms_value ? `${colorPricker?.pms_value},` : ""}${tempColor?.name}`.replace(/^:|^,/g, '').replace(/:,/g, ':').replace(/^,/, ''),
          };

          pms_key = colorId;
          product_ids = tempColor?.product_ids;
        });
        colorPricker = {
          ...colorPricker,
          pms_key: `${colorPricker?.pms_key},${pms_key}`.replace(",,", ",").replace(/^,/, ""),
          product_ids: `${colorPricker?.product_ids},${product_ids}`.replace(",,", ",").replace(/^,/, ""),
        };
      }
    });
    return colorPricker;
  };
  const addToCart__gtm = (item) => {
    const addtocartGtmData = {
      event: 'addToCart',
      eventLabel: data?.settings?.product_name,
      ecommerce: {
        add: {
          products: [
            {
              name: data?.settings?.product_name,
              id: additionalOption.is ? additionalOption.sku : data?.settings?.product_sku || "",
              is_sample: isSample,
            }
          ]
        }
      },
    };

    TagManager.dataLayer({ dataLayer: addtocartGtmData });
  };
  function generateTextileAttributeId(product, attribute) {
    const attributeId = product[attribute] ? product[attribute].id : null;
    return attributeId;
  }
  const textileAttributes = (variantQtydata) => {
    const generateAttributeId = generateTextileAttributeId(data?.options, "size");
    const filteredData = variantQtydata && variantQtydata?.length ? variantQtydata?.filter(item => item.qty > 0) : [];
    const is_textile_product = 1;
    const textile_product_ids = filteredData.map(item => item.productId).join(',');
    const textile_name = filteredData.map(item => item.sizeLabel).join(',');
    const textile_attribute_id = filteredData.map(item => generateAttributeId).join(',');
    const textile_quantity = filteredData.map(item => item.qty).join(',');
    const textile_attribute_value = filteredData.map(item => item.id).join(',');

    const result = {
      "is_textile_product": is_textile_product,
      "textile_product_ids": textile_product_ids,
      "textile_name": textile_name,
      "textile_attribute_id": textile_attribute_id,
      "textile_quantity": textile_quantity,
      "textile_attribute_value": textile_attribute_value
    };

    return result;
  }
  const guestAddToCart = (from) => {
    addToCart__gtm();
    setErrorCart("");
    const { nextNo, length } = getNextData(true, selectedDataNow);
    const option = getApiCartOptions();
    const textileProduct = data?.isTextileProduct === 1 ? textileAttributes(variantQtydata) : null;
    const colorPricker = (selectedColorData && Object.keys(selectedColorData).length) ? getColorData(selectedColorData) : null;
    // For sample attribute id and values separation
    let keys = [];
    let values = [];
    if (option?.finalData?.length) {
      for (const obj of option?.finalData) {
        const [key, value] = Object.entries(obj)[0];
        keys.push(key);
        values.push(value);
      }
    }
    // Join keys and values into strings
    const keysString = keys.join(', ');
    const valuesString = values.join(', ');
    const oneTimePrice = isCustomQty
      ? euroCurrency(
        (qtyData.price * (isSample ? sampleQty : qtyTemp)) *
        (isCpkerLength ? isCpkerLength : 1) +
        selectedDetailsFinal.change_costs +
        (selectedDetailsFinal?.amount_per_piece === "1"
          ? qtyTemp * selectedDetailsFinal?.product_cost_value
          : selectedDetailsFinal?.product_cost_value)
      ).trim()
      : euroCurrency(
        (qtyData.price * (isSample ? sampleQty : qty)) *
        (isCpkerLength ? isCpkerLength : 1) +
        selectedDetailsFinal.change_costs +
        (selectedDetailsFinal?.amount_per_piece === "1"
          ? qty * selectedDetailsFinal?.product_cost_value
          : selectedDetailsFinal?.product_cost_value)
      ).trim();
    const addCartItems = (key, id) => {
      const guestCartOptions = {
        isLoader: true,
        loaderAction: (bool) => {
          if (bool) {
            if (from) {
              setIsProcessing(bool)
            } else {
              setIsProcessing1(bool)
            }
          }
        },
        setGetResponseData: (resData) => {
          
           if (resData?.status === 200) {
            let tempError = ""
            if (resData?.data?.[0]?.code === 400) {
              tempError = resData?.data?.[0]?.message;
              if (from) {
                setIsProcessing(false)
              } else {
                setIsProcessing1(false)
              }
            }
            else if (from) {
              if (width >= 768 && !isSample) {
                dispatch(ACTION__MINICART__ITEMS("cart"))
              }
              else {
                navigate("/winkelwagen")
              }

              getCartItems(dispatch, setIsProcessing, id, "", () => dispatch(ACTION_OPENCART(!isSample)), defaultURL, storeId, token, navigate, isSessionExpired, width);
            } else {
              if (width >= 768) {
                dispatch(ACTION__MINICART__ITEMS("quote"))
              }
              else {
                navigate("/offerteaanvraag")
              }

              getCartItems(dispatch, setIsProcessing1, id, "", () => dispatch(ACTION_OPENCART(true)), defaultURL, storeId, token, navigate, isSessionExpired, width);
            }
            setErrorCart(tempError);
          } else if (resData?.status === false) {
          }
        },
        getStatus: (res) => {
          if(res?.status == 400){
         const Name=  translateData?.translations?.[`${res?.message}`.toLowerCase()] ? translateData?.translations[`${res?.message}`.toLowerCase()] : res?.message
            setErrorCart(Name)
            setIsProcessing(false)
          setIsProcessing1(false)

          }
          SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
        },
        axiosData: {
          url: `${defaultURL}/guest-carts/${key}/items`,
          paramsData: {
            cartItem: {
              // sku: additionalOption.is ? additionalOption.sku : data?.settings?.product_sku || "",
              sku: data?.settings?.product_sku || "",
              qty: isSample && getKeyVal(option?.data).length ? 1 : data?.isTextileProduct === 1 ? totalValueQty : qty ? qty : 1,
              quoteId: guestQuoteId,
              product_option: {
                extension_attributes: {
                  configurable_item_options: isSample ? getKeyVal(option?.data) : data?.isTextileProduct === 1 ? getKeyVal(option?.data, data?.options?.size) : getKeyVal(option?.data),
                  custom_options: isSample ? [...sampleCustomizeItem] : [...getKeyVal(option?.customize), ...getKeyVal(option?.additional)],
                }
              },
              extension_attributes: {
                sample_product_ids: isSample ? (option?.finalProducts?.length ? option.finalProducts.join(",") : null) : null,
                sample_attribute_id: isSample ? keysString : null,
                sample_attribute_value: isSample ? valuesString : null,
                manual_size: manualsizestr?.replace("XXXXX", `${qtymatch(qty, selectedDetailsFinal.tier_prices)}`),
                is_additional_option: isAdditionalOption ? 1 : 0,
                ...textileProduct,
                is_sample: isSample,
                one_time: oneTimeValue === "1" ? oneTimePrice : "0",
                qty_increments: selectedDetailsFinal?.qty_increments,
                input_size: InputManualSize,
                dropbox_file: selectedDetails?.upload ? (selectedDetails?.upload?.hide ? "0" : selectedDetails?.upload?.isUpload && dropboxFiles ? dropboxFiles : "1") : "0",
                setup_costs: selectedDetailsFinal?.setup_costs ? selectedDetailsFinal?.setup_costs : 0,
                product_cost: selectedDetailsFinal?.product_cost_value,
                amount_per_piece: selectedDetailsFinal?.amount_per_piece,
                product_cost_label: selectedDetailsFinal?.product_cost_name,
                product_cost_id: selectedDetailsFinal?.product_cost_id,
                pdp_url: window.location.href,
                design_explanation: textAreaData,
                config_product_id: data?.settings?.product_id,
                ...colorPricker?.pms_key && colorPricker,
                ...isSample && getKeyVal(option?.finalData).length && { sample_products: getKeyVal(option?.finalData).map((sample) => sample?.option_value) },
              }
            }
          }
        }
      };
      APIQueryPost(guestCartOptions);
    }
    const createQuoteId = (key) => {
      const guestQuoteDetailsOptions = {
        isLoader: true,
        loaderAction: (bool) => from ? setIsProcessing(bool) : setIsProcessing1(bool),
        setGetResponseData: (resData) => {
          if (resData?.status === 200) {
            dispatch(ACTION_GUESTQUOTE__DETAILS(resData?.data));
            dispatch(ACTION_GUESTKEY(key));
            addCartItems(key, resData?.data?.id);
          }
        },
        getStatus: (res) => {
          if (res?.status !== 200) {

          }
        },
        axiosData: {
          url: `${defaultURL}/guest-carts/${key}`
        }
      }
      APIQueryGet(guestQuoteDetailsOptions);
    }
    if ((nextNo !== -1) && (nextNo < (length - 1))) {
      handleExpandNext("fast", 1)
    } else if ((option && option?.["products"]?.length) || option?.isSample) {
      const guestKeyOptions = {
        isLoader: true,
        loaderAction: (bool) => from ? setIsProcessing(bool) : setIsProcessing1(bool),
        setGetResponseData: (resData) => {
          if (resData?.status === 200) {
            createQuoteId(resData?.data);
          }
        },
        getStatus: (res) => {
          if (res?.status !== 200) { }
        },
        axiosData: {
          url: `${defaultURL}/guest-carts`,
        }
      }
      if (guestQuoteId) addCartItems(guestKey, guestQuoteId);
      else APIQueryPost(guestKeyOptions);
    } else {
      handleExpandNext("fast", 1)
    }
  };

  const customerAddToCart = (from) => {
    addToCart__gtm();
    setErrorCart("");
    const { nextNo, length } = getNextData(true, selectedDataNow);
    const option = getApiCartOptions();
    const textileProduct = data?.isTextileProduct === 1 ? textileAttributes(variantQtydata) : null;
    const colorPricker = (selectedColorData && Object.keys(selectedColorData).length) ? getColorData(selectedColorData) : null;

    // For sample attribute id and values separation
    let keys = [];
    let values = [];
    if (option?.finalData?.length) {
      for (const obj of option?.finalData) {
        const [key, value] = Object.entries(obj)[0];
        keys.push(key);
        values.push(value);
      }
    }
    // Join keys and values into strings
    const keysString = keys.join(', ');
    const valuesString = values.join(', ');
    const oneTimePrice = isCustomQty
      ? euroCurrency(
        (qtyData.price * (isSample ? sampleQty : qtyTemp)) *
        (isCpkerLength ? isCpkerLength : 1) +
        selectedDetailsFinal.change_costs +
        (selectedDetailsFinal?.amount_per_piece === "1"
          ? qtyTemp * selectedDetailsFinal?.product_cost_value
          : selectedDetailsFinal?.product_cost_value)
      ).trim()
      : euroCurrency(
        (qtyData.price * (isSample ? sampleQty : qty)) *
        (isCpkerLength ? isCpkerLength : 1) +
        selectedDetailsFinal.change_costs +
        (selectedDetailsFinal?.amount_per_piece === "1"
          ? qty * selectedDetailsFinal?.product_cost_value
          : selectedDetailsFinal?.product_cost_value)
      ).trim();
    const cartOptions = {
      isLoader: true,
      loaderAction: (bool) => {
        if (bool) {
          if (from) {
            setIsProcessing(bool)
          } else {
            setIsProcessing1(bool)
          }
        }
      },
      setGetResponseData: (resData) => {

      
        if (resData?.status === 200) {
          let tempError = ""
          if (resData?.data?.[0]?.code === 400) {
            tempError = resData?.data?.[0]?.message;
            if (from) {
              setIsProcessing(false)
            } else {
              setIsProcessing1(false)
            }
          }
          else if (from) {
            if (width >= 768 && !isSample) {
              dispatch(ACTION__MINICART__ITEMS("cart"))
            }
            else {
              navigate("/winkelwagen")
            }
            getCartItems(dispatch, setIsProcessing, customerQuoteId, customerId, () => dispatch(ACTION_OPENCART(!isSample)), defaultURL, storeId, token, navigate, isSessionExpired, width);

          } else {
            if (width >= 768) {
              dispatch(ACTION__MINICART__ITEMS("quote"))

            }
            else {
              navigate("/offerteaanvraag")
            }
          getCartItems(dispatch, setIsProcessing1, customerQuoteId, customerId, () => dispatch(ACTION_OPENCART(!isSample)), defaultURL, storeId, token, navigate, isSessionExpired,width);

          }
          setErrorCart(tempError);
        } else if (resData?.status === false) {
        }
      },
      getStatus: (res) => {
        if(res?.status == 400){
          const Name=  translateData?.translations?.[`${res?.message}`.toLowerCase()] ? translateData?.translations[`${res?.message}`.toLowerCase()] : res?.message
          setErrorCart(Name)
          setIsProcessing(false)
          setIsProcessing1(false)
        }
        SessionExpiredLogout(dispatch, res?.status, navigate, isSessionExpired);
      },
      axiosData: {
        url: `${defaultURL}/carts/mine/items`,
        headers: { Authorization: `Bearer ${token}` },
        paramsData: {
          cartItem: {
            sku: data?.settings?.product_sku || "",
            // sku: additionalOption.is ? additionalOption.sku : data?.settings?.product_sku || "",
            qty: isSample && getKeyVal(option?.data).length ? 1 : data?.isTextileProduct === 1 ? totalValueQty : qty ? qty : 1,
            quoteId: customerQuoteId,
            product_option: {
              extension_attributes: {
                configurable_item_options: isSample ? getKeyVal(option?.data) : data?.isTextileProduct === 1 ? getKeyVal(option?.data, data?.options?.size) : getKeyVal(option?.data),
                custom_options: isSample ? [...sampleCustomizeItem] : [...getKeyVal(option?.customize), ...getKeyVal(option?.additional)],
              }
            },
            extension_attributes: {
              sample_product_ids: isSample ? (option?.finalProducts?.length ? option.finalProducts.join(",") : null) : null,
              sample_attribute_id: isSample ? keysString : null,
              sample_attribute_value: isSample ? valuesString : null,
              // manual_size: manualsizestr,
              manual_size: manualsizestr?.replace("XXXXX", `${qtymatch(qty, selectedDetailsFinal.tier_prices)}`),
              is_additional_option: isAdditionalOption ? 1 : 0,
              is_sample: isSample,
              one_time: oneTimeValue === "1" ? oneTimePrice : "0",
              input_size: InputManualSize,
              ...textileProduct,
              qty_increments: selectedDetailsFinal?.qty_increments,
              dropbox_file: selectedDetails?.upload ? (selectedDetails?.upload?.hide ? "0" : selectedDetails?.upload?.isUpload && dropboxFiles ? dropboxFiles : "1") : "0",
              setup_costs: selectedDetailsFinal?.setup_costs ? selectedDetailsFinal?.setup_costs : 0,
              product_cost: selectedDetailsFinal?.product_cost_value,
              amount_per_piece: selectedDetailsFinal?.amount_per_piece,
              product_cost_label: selectedDetailsFinal?.product_cost_name,
              product_cost_id: selectedDetailsFinal?.product_cost_id,
              pdp_url: window.location.href,
              design_explanation: textAreaData,
              config_product_id: data?.settings?.product_id,
              ...colorPricker?.pms_key && colorPricker,
              ...isSample && getKeyVal(option?.finalData).length && { sample_products: getKeyVal(option?.finalData).map((sample) => sample?.option_value) },

            }
          }
        }
      }
    };

    if ((nextNo !== -1) && (nextNo < length - 1)) {
      handleExpandNext("fast", 1)
    }
    else if ((option && option?.["products"]?.length) || option?.isSample) {
      APIQueryPost(cartOptions);
    } else {
      handleExpandNext("fast", 1)
    }
  };
  const kjd = (main, sec) => {
    const newArr = [...main, ...sec].map((a) => a.qty)
    const newArr1 = newArr.filter((item, pos) => newArr.lastIndexOf(item) === pos);
    const newArr2 = newArr1.sort(function (a, b) { return a - b })
    return sec?.length ? newArr2.map((d, i) => {
      let matchIndex = -1, foundKey = -1;
      sec.forEach((e, j) => {
        foundKey = (d === e.qty) ? j : foundKey
        matchIndex = (d >= e.qty) ? j : matchIndex
      });
      return (foundKey > -1) ? sec[foundKey] : (matchIndex > 0) ? { ...sec[matchIndex], qty: d } : { ...sec[0], qty: d };
    }) : [];
  }
  const mergeQty = (main, sec, isCpker, log) => {
    let arr = [], sec2 = [], main2 = [];
    if (main?.length) {
      if (isCpker) main2 = kjd(sec, main)
      else main2 = main
      if (isCpker) sec2 = kjd(main2, sec)
      else sec2 = sec
      if (sec?.length) arr = addArrayObj(main2, sec2)
      else arr = main;
    } else if (sec?.length) arr = sec;
    return arr;
  }
  const getAlignAllData = (urlGenData) => {
    const variantObj = {}, tempSelectedObj = {}, tempSelectedDetails = {};
    const firstObjName = data?.settings?.custom_made_option_title ? data.settings.custom_made_option_title : "";
    const variantTempObj = { ...data?.options }, isColorPicker = data?.settings?.is_color_picker && translateData?.color_picker?.totalRecords > 0, additionalTempObj = { ...data?.additionalCustomizables }, isColorPickerTierPrices = data?.settings?.xml;
    let tempSelectedObjDefault = {}, isSizeQty = false, isSampleProduct = false, prevKey = "", isAnyDefault = [];
    Object.keys(variantTempObj).map((key, i) => {
      const tempVariantItem = variantTempObj[key];
      if (tempVariantItem) {
        const tempOption = [];
        let isManualSize = false, defaultSelected = [];
        const variantOptions = tempVariantItem?.["options"] && Object.keys(tempVariantItem["options"]);
        if (tempVariantItem && variantOptions?.length) {
          variantOptions.map((key1) => {
            const tempOptionItem = tempVariantItem["options"][key1];
            const tempOptionProducts = [];
            tempOptionItem?.["products"] &&
              Object.keys(tempOptionItem["products"]).length &&
              Object.keys(tempOptionItem["products"]).map((key2) => {
                if (!isManualSize) isManualSize = !!tempOptionItem["products"][key2]?.manual_size_from;
                tempOptionItem["products"][key2] &&
                  (Object.keys(tempOptionItem["products"][key2]).length ?
                    tempOptionProducts.push({ ...tempOptionItem["products"][key2], pms_key: "key1" }) :
                    tempOptionProducts.push(tempOptionItem["products"][key2]))
              });
            tempOptionItem["id"] = tempOptionItem["id"] === 0 ? "0" : tempOptionItem["id"];
            if (variantOptions.length === 1) defaultSelected.push(tempOptionItem.id)
            tempOption.push({ ...tempOptionItem, ...tempOptionProducts.length && { products: tempOptionProducts } })
            return null;
          });
        }
        if (!isSizeQty) {
          isSizeQty = data?.isTextileProduct === 1 && key === "size";
        }
        variantObj[key] = {
          ...variantTempObj[key],
          thisType: "variant",
          ...variantTempObj[key]?.["id"] && { id: variantTempObj[key]?.["id"] },
          ...tempOption.length && { options: tempOption },
          label: firstObjName && !prevKey ? firstObjName : `Kies een ${(variantTempObj[key]?.["label"] ? variantTempObj[key]["label"] : "").toLowerCase()}`,
          // label: `Kies een ${(variantTempObj[key]?.["label"] ? variantTempObj[key]["label"] : "").toLowerCase()}`,
          mutiSelect: isColorPicker && !data?.settings?.xml,
          hideStock: isColorPicker,
          sizeQty: data?.isTextileProduct === 1 && key === "size",
          variantPosition: i,
          isManualSize,
          isAdditionalOption: !!(additionalTempObj && Object.keys(additionalTempObj).length),
          multiOption: Object.keys(variantTempObj).length > 1,
          variantLength: Object.keys(variantTempObj).length,
          variantDatas:Object.keys(variantTempObj),
        }

        isAnyDefault.push(defaultSelected.length ? "true" : "false");
        // tempSelectedObj[key.replace('&', '')] = defaultSelected;
        // tempSelectedDetails[key.replace('&', '')] = { thisType: "variant", prevKey, labels: [], products: [], returnData: [], setup_costs: 0, price: 0, tier_prices: [] };
        tempSelectedObj[key] = defaultSelected;
        tempSelectedDetails[key] = { thisType: "variant", prevKey, labels: [], products: [], returnData: [], setup_costs: 0, price: 0, tier_prices: [] };
        prevKey = key;
      }
    });
    if (data?.settings?.is_color_picker && translateData?.color_picker?.totalRecords) {
      const label = data?.settings?.color_picker_title, k = "cpker";
      variantObj[k] = {
        thisType: k,
        label: label ? label : `Kies de gewenste kleur`,
      }
      tempSelectedObj[k] = [];
      tempSelectedDetails[k] = isColorPickerTierPrices ? { thisType: k, labels: [], products: [], returnData: [] } : { thisType: k, labels: [], products: [], returnData: [], setup_costs: 0, price: 0, tier_prices: [] };
    }
    const customizeTempObj = { ...data?.customizables }, sampleCustomizeTemp = [];
    Object.keys(customizeTempObj).map((key) => {
      const tempCustomizeItem = customizeTempObj[key]
      if (tempCustomizeItem && Object.keys(tempCustomizeItem).length) {
        if (Object.keys(tempCustomizeItem).length) {
          const key1 = Object.keys(tempCustomizeItem)[0];
          if (Object.keys(tempCustomizeItem).length > 1 || (key1 && tempCustomizeItem?.[key1]?.length > 1) || (tempCustomizeItem?.[key1]?.[0]?.grouplabel && tempCustomizeItem?.[key1]?.[0]?.groupinfo) || tempCustomizeItem?.[key1]?.[0]?.subgrouplabel) {
            const additionalCustomize100 = customizeTempObj;
            Object.keys(additionalCustomize100).map((key1) => {
              const additionalCustomize200 = additionalCustomize100[key1];
              if (additionalCustomize200 && Object.keys(additionalCustomize200).length) {
                Object.keys(additionalCustomize200)?.forEach((key200) => {
                  additionalCustomize200[key200]?.length && additionalCustomize200[key200].forEach((item200, index200) => {
                    additionalCustomize200[key200][index200]["optionImage"] = additionalCustomize200[key200][index200]?.options?.[0]?.image;
                  })
                })
                if (!variantObj[key1]) variantObj[key1] = {
                  thisType: "additional",
                  options: {},
                  label: key1,
                  variantId: key1
                }
                if (!(variantObj[key1]?.["data"])) variantObj[key1]["data"] = {}
                variantObj[key1]["data"][key1] = additionalCustomize200;
                tempSelectedObj[key1] = [];

                tempSelectedDetails[key1] = { thisType: "additional", labels: [], products: [], returnData: [], setup_costs: 0, price: 0, tier_prices: [] };
              }
              return null;
            });
          } else {
            const k = "customize";
            let labelName = key, varientType = "", is_require = "", defaultSelected = [];
            Object.keys(tempCustomizeItem).map((key1) => {
              const tempPersonal100 = tempCustomizeItem[key1];
              if (tempPersonal100 && tempPersonal100?.length) {
                tempPersonal100.map((itemTemp) => {
                  let ifFound = false;
                  varientType = itemTemp?.type;
                  const tempPersonal200 = itemTemp?.options;
                  if (tempPersonal200 && tempPersonal200?.length) {
                    tempPersonal200.map((iTemp) => {
                      if (iTemp?.default === "1") {
                        defaultSelected.push(iTemp?.id)
                      }
                      if (!ifFound && iTemp?.price === 0) {
                        sampleCustomizeTemp.push({ option_id: itemTemp?.id, option_value: varientType === "field" ? "" : iTemp?.id });
                        ifFound = true;
                      }
                      return null;
                    })
                  }
                  labelName = itemTemp?.["grouplabel"] ? itemTemp["grouplabel"] : itemTemp?.["name"] ? itemTemp["name"] : labelName;
                  is_require = true;
                  // itemTemp?.["is_require"] === "1" ? true : false // On purpose 
                  return null;
                })
              }
              return null;
            });
            variantObj[key] = {
              ...variantTempObj[key],
              varientType,
              is_require,
              thisType: k,
              ...tempCustomizeItem && Object.keys(tempCustomizeItem).length && { options: tempCustomizeItem },
              label: labelName
            }
            // variantData[key]?.options ? variantData[key]?.options?.[0]?.type === "field
            tempSelectedObj[key] = [...defaultSelected];
            isAnyDefault.push(defaultSelected.length ? "true" : "false");
            tempSelectedDetails[key] = { thisType: k, labels: [], products: [], returnData: [], setup_costs: 0, price: 0, tier_prices: [] };
          }
        }
      }
    });
    if (additionalTempObj && Object.keys(additionalTempObj).length) {
      Object.keys(additionalTempObj).map((bey100) => {
        const addCustom100 = additionalTempObj[bey100];
        Object.keys(addCustom100).map((key200) => {
          let addCustom200 = addCustom100[key200];
          const keyArry = addCustom200 ? Object.keys(addCustom200) : null;
          if (keyArry.length) {
            const sortorder200 = []; let is_require = true, reqFound = false;
            keyArry.map((key300, i) => {
              const addCustom300 = addCustom200[key300];
              if (addCustom300.length) {
                if (!reqFound && addCustom300[0]?.is_require) {
                  is_require = true;
                  reqFound = true;
                }
                addCustom300.sort((i, j) => parseInt(i.sortorder || 0) - parseInt(j.sortorder || 0));
                sortorder200.push({ key: key300, sortorder: parseInt(addCustom300[0]?.custom_sort_order || 0) })
              }
              return null;
            })
            if (sortorder200.length) {
              sortorder200.sort((k, l) => k.sortorder - l.sortorder);
              const temp200 = {};
              sortorder200.map((orderItem200) => temp200[orderItem200.key] = addCustom200[orderItem200.key])
              addCustom200 = { ...temp200 };
            }
            if (!variantObj[key200]) variantObj[key200] = {
              thisType: "additional",
              options: {},
              label: key200,
              is_require
            }
            setAdditionalOption({ is: true, sku: "" })
            if (!(variantObj[key200]?.["data"])) variantObj[key200]["data"] = {}
            variantObj[key200]["data"][bey100] = addCustom200;
            tempSelectedObj[key200] = [];
            tempSelectedDetails[key200] = { thisType: "additional", labels: [], products: [], returnData: [], setup_costs: 0, price: 0, tier_prices: [] };
          }
          return null;
        });
        return null;
      });
    }
    if (sampleCustomizeTemp.length) setSampleCustomizeItem([...sampleCustomizeTemp]);

    if (!isSizeQty && (!(variantObj?.["cpker"]?.label) || (variantObj?.["cpker"]?.label && isColorPickerTierPrices))) {
      const k = "qty";
      variantObj[k] = {
        label: "Kies aantal", //Choose quantity
      }
      tempSelectedObj[k] = [];
      tempSelectedDetails[k] = { labels: [] };
    }
    if (data?.settings?.show_design_options && ((data?.dropboxClientId && data?.dropboxClientSecretId && data?.dropboxRefreshToken) || (data?.settings?.customer_canvas_id))) {
      const k = "upload";
      variantObj[k] = {
        label:storeId === 1 ? "Gratis ontwerp" : "Bestand uploaden", // Upload / ontwerp
        isDropbox: Boolean(data?.dropboxClientId && data?.dropboxClientSecretId && data?.dropboxRefreshToken),
        isCanvas: Boolean(data?.settings?.customer_canvas_id && data?.settings?.customer_canvas_key && data?.settings?.customer_canvas_domain),
        canvasData: {
          id: data?.settings?.customer_canvas_id,
          key: data?.settings?.customer_canvas_key,
          domain: data?.settings?.customer_canvas_domain
        }
      }
      tempSelectedObj[k] = [];
      tempSelectedDetails[k] = { labels: [] };
    }
    if ((data?.settings?.allowed_sample === "1")) {
      const k = "isSample";
      variantObj[k] = {}
      tempSelectedObj[k] = [];
      tempSelectedDetails[k] = {};
    }
    tempSelectedObjDefault = { ...tempSelectedObj };
    setSelectedDataDefault({ ...tempSelectedObj });
    setSelectedDetailsDefault({ ...tempSelectedDetails });
    setAllData({ ...variantObj })
    if (urlGenData && Object.keys(urlGenData)?.length) {
      let hasValue = false;
      Object.keys(urlGenData).map((k, i) => {
        if (tempSelectedObj[k] && urlGenData[k]) {
          let manual_size_data = null;
          try {
            if (urlGenData[k].includes('manualSize')) {
              const a = JSON.parse(`[${urlGenData[k]}]`)
              manual_size_data = a?.[0]?.manualSize ? a?.[0]?.manualSize : null;
            }
          }
          catch (e) { }
          if (manual_size_data && manual_size_data?.key) {
            const a = {}, b = {};
            Object.keys(manual_size_data).map((k) => {
              if (k !== "key") a[k] = manual_size_data[k]
            })
            b[manual_size_data?.key] = { ...a };
            setSelectedManualSizeData({ ...b });
          } else {
            hasValue = true;
            tempSelectedObj[k] = `${urlGenData[k]}`.split(',')
          }
        }
        if (data?.settings?.allowed_sample && k === "isSample" && urlGenData[k] === "true") {
          isSampleProduct = true;
        }
        if (k === "qty" && urlGenData[k] && Number(urlGenData[k]) > 0) {
          if (urlGenData?.size?.includes("manualSize")) {
            setTimeout(() => {
              setQtyUrl(Math.round(Number(urlGenData[k])))
            }, 300)
          }
          else {
            setQtyUrl(Math.round(Number(urlGenData[k])))
          }

        }
        return null;
      });
      setReqExpanded(hasValue);
    }
    // For swaping the upload and quantity section - has bug (commented on purpose)
    // let orderedVariantList = {}, orderedVariantObj = {}, orderedSelectedDetails = {};
    // if(variantObj["upload"] && Object.keys(variantObj).length) {
    //   Object.keys(variantObj).map((key,i)=>{
    //     if(key!=="upload" && key!=="isSample") {
    //       orderedVariantList[key] = variantObj[key];
    //     }
    //   });
    //   if(variantObj["upload"]) orderedVariantList["upload"] = variantObj["upload"];
    //   if(variantObj["isSample"]) orderedVariantList["isSample"] = variantObj["isSample"];
    // }
    // if(tempSelectedObj["upload"] && Object.keys(tempSelectedObj).length) {
    //   Object.keys(tempSelectedObj).map((key,i)=>{
    //     if(key!=="upload" && key!=="isSample") {
    //       orderedVariantObj[key] = tempSelectedObj[key];
    //     }
    //   });
    //   if(tempSelectedObj["upload"]) orderedVariantObj["upload"] = tempSelectedObj["upload"];
    //   if(tempSelectedObj["isSample"]) orderedVariantObj["isSample"] = tempSelectedObj["isSample"];
    // }
    // if(tempSelectedDetails["upload"] && Object.keys(tempSelectedDetails).length) {
    //   Object.keys(tempSelectedDetails).map((key,i)=>{
    //     if(key!=="upload" && key!=="isSample") {
    //       orderedSelectedDetails[key] = tempSelectedDetails[key];
    //     }
    //   });
    //   if(tempSelectedDetails["upload"]) orderedSelectedDetails["upload"] = tempSelectedDetails["upload"];
    //   if(tempSelectedDetails["isSample"]) orderedSelectedDetails["isSample"] = tempSelectedDetails["isSample"];
    // }
    // const modifiedObject = [];
    // Object.keys(tempSelectedObj).forEach(key => {
    //     const newKey = key.replace('&', ''); // Remove '&' symbol
    //     modifiedObject[newKey] = tempSelectedObj[key];
    // });
    if (isSampleProduct) {
      setSelectedDataBackup({ ...tempSelectedObj });
      setIsSample(true);
    } else {
      setSelectedData({ ...tempSelectedObj });
    }
    setSelectedDetails({ ...tempSelectedDetails });

    setTimeout(() => {
      const indexDefault = (isAnyDefault.indexOf("false") > -1) ? isAnyDefault.indexOf("false") : (isAnyDefault.indexOf("true") > -1) ? isAnyDefault.indexOf("true") + (Object.keys(tempSelectedObj)?.length === 3 ? 1 : 1) : -1;
      setExpanded(indexDefault > -1 ? `${indexDefault}` : `${isAnyDefault.length}`);
    }, 300);
  };
  useEffect(() => {
    if (tokenGetData === "")
      if (data?.settings?.product_id) {
        // on purpose
        // if (data?.settings?.product_id && cmsColor?.color_picker?.totalRecords > 0 ) {
        setTokenGetData("loaded");
        getAlignAllData(urlGenData);
      };
      
  }, [data, urlGenData, translateData]);

  const availablePrintCustomize = ["print", "Print", "afdrukken", "bedrukken", "bedrukking", "laserengraving", "bewerking", "gewenste", "lasergraveren", "lasergravering", "colour", "LAS05", "LAS06", "debossing"];
  //  const noPrintCustomizeOption = ["","bedrukking","None", "Geen", "geen", "Nee", "nee", "No", "no","middenblad","kies kleur tafelblad","kleur dop","verzendopties", "onbedrukt","levertijd","kies kleur tafelblad","kleur dop","laserengraving"];
  const noPrintCustomizeOption = ["", "bedrukking", "None", "Geen", "none", "geen", "Nee", "nee", "No", "no", "middenblad", "verzendopties", "onbedrukt", "levertijd", "kies kleur tafelblad", "kleur dop", "laserengraving"];
  //  commented for purpose
  // const noPrintCustomizeOption = ["middenblad","kies kleur tafelblad","kleur dop","verzendopties","geen", "none", "onbedrukt", "nee", "no","levertijd",""];

  useEffect(() => {
    if (selectedDataDefault && selectedData && Object.keys(selectedData)?.length) {
      setdisableAction("selectedData")
      const tempSelectedDetails = { ...selectedDetails };
      const tempSelectedData = { ...selectedData }, isColorPickerTierPrices = data?.settings?.xml;
      let isManualSizeProduct = false;
      let tempTierPriceSmaple = [];
      let temp = { delivery: "",qtyStock:0,manageStock:0, qty_increments: "", product_cost_name: "", product_cost_id: "", amount_per_piece: null, product_cost_value: null, tier_prices: [], price: 0, min_sale_qty: 0, setup_costs: 0, productsArray: [], am_shipping_type: 0, am_shipping_type_free: false, product_vat: data?.settings?.product_vat || 0, change_costs: 0 }, isPrintProduct = data?.settings?.show_design_options ? 0 : -1;
      let delivery = "", product_cost_name = "",qtyStock=0,manageStock=0, qty_increments = "", product_cost_id = "", amount_per_piece = null, product_cost_value = null, selectedSampleQty = 0, selectedVarientQty = 0, tempVariantId = "", isSizeQtyProduct = false, productsArray = [], am_shipping_type_free = false, am_shipping_type = 0, prevKey = "", variantCount = -1, tempCanvasTemplate = "", isGallerySelected = false, change_costs = data?.settings?.size_change_costs_price || 0, isCpker = Object.keys(tempSelectedData).indexOf("cpker") > -1, isCpkerLength = 0, reduseCount = 0;
      Object.keys(tempSelectedData).map((k, i) => {
        const allDataItem = allData[k], thisObjSample = tempSelectedData["isSample"]?.[0] === "true";
        if (allDataItem?.thisType === "variant") {
          if (tempSelectedData[k]?.length && allDataItem?.options?.length) {
            const isManualSize = !!(`${tempSelectedData?.[k]?.[0]}`.includes("manualSize"));
            if (!isManualSizeProduct)
              isManualSizeProduct = isManualSize;
            variantCount++;
            selectedSampleQty = tempSelectedData[k]?.length;
            let singleProductId = [], tempLabel = [], tempProductId = [], tempReturnData = [], tier_prices = [], price = 0, min_sale_qty = 1, setup_costs = 0, product_vat = 0, selectedOptionProductList = [], isNoMachSelected = false;
            if (allDataItem?.multiOption && prevKey)
              allDataItem.options.map((item) => {
                if (item?.id && tempSelectedData[k].includes(item.id)) {
                  if (item?.products && item.products.length) item.products.map((pro) => singleProductId.push(pro.id))
                }
                return null;
              });
            const isSingleOptions = allDataItem?.options?.length;
            isSizeQtyProduct = !isManualSize && tempSelectedData[k]?.length ? tempSelectedData[k][0]?.includes(":") ? true : false : false;
            allDataItem.options.map((item, optionIndex) => {
              const tempId = tempSelectedData[k].map(i => i.includes(":") ? i.split(":")[0] : i);
              if (item?.id && tempId.includes(item.id)) {
                if (isManualSize) {
                  setStopNextNav(true)
                }
                if (isSample && ((allDataItem?.variantPosition === allDataItem?.variantLength - 1))) {
                  tempTierPriceSmaple.push(item?.products?.[0]?.tier_prices?.slice(-1)?.pop()?.price || 0)
                } else if ((prevKey && isSizeQtyProduct) || variantCount > 0) {
                  tier_prices = temp.tier_prices
                }
                const prevSelectedOptionProductList = tempSelectedDetails?.[prevKey]?.["selectedOptionProductList"]
                if (!allDataItem?.multiOption || !prevKey ||
                  (allDataItem?.multiOption && prevKey && singleProductId.length && prevSelectedOptionProductList?.["length"])) {
                  let isProductInclude = false;
                  if (allDataItem?.multiOption && prevKey)
                    prevSelectedOptionProductList.map((pId) => {
                      if (!isProductInclude && singleProductId.includes(pId)) isProductInclude = true;
                      return null;
                    });
                  if (!allDataItem?.multiOption || !prevKey || isProductInclude || isManualSize) {
                    let temp = {};
                    selectedVarientQty++;
                    temp[allDataItem.id] = item?.id;
                    tempReturnData.push({ ...temp });
                    if (item?.products && item.products.length) {
                      item.products.map((pro) => {
                        tempCanvasTemplate = pro?.customer_canvas_design ? pro?.customer_canvas_design : "";
                        if (prevSelectedOptionProductList?.length) {
                          if (prevSelectedOptionProductList?.includes(pro.id))
                            selectedOptionProductList.push(pro.id);
                        } else
                          selectedOptionProductList.push(pro.id);

                        if (additionalOption.is) {
                          setAdditionalOption({ is: true, sku: pro.sku })
                        }
                      });
                    }
                    // selected varient gallery old logic commented on purpose
                    // if(variantCount > 0 && item.products[0]?.product_gallery_images?.[variantCount]?.image && item.products[0]["product_name"]){
                    if (isSingleOptions > 1 && variantCount < 2)
                      if (item.products[0]?.product_gallery_images?.length) {
                        // Commented on purpose for Gallery show order
                        // setGallerySelected({
                        //   name:item.products[0]["product_name"],
                        //   image:item.products[0].product_gallery_images[variantCount].image,
                        // });
                        setGallerySelected([...item.products[0]?.product_gallery_images]);
                        isGallerySelected = true
                      } else if (item.products[0]?.["images"] && item.products[0]["product_name"]) {
                        setGallerySelected([{
                          name: item.products[0]["product_name"],
                          image: item.products[0]?.["images"],
                        }]);
                        isGallerySelected = true
                      }
                    if (item?.label) tempLabel = [...tempLabel, item.label];
                    if (item?.label) {
                      if (`${item.label}`.toLowerCase().includes("print")) isPrintProduct = 2
                    }
                    if (item?.products?.[0]?.["id"]) {
                      tempProductId = [...tempProductId, item.products[0]["id"]];
                      tempVariantId = variantCount < 2 ? item.products[0]["id"] : tempVariantId;
                    }
                    // New login to get selected product price and tire_price for SKU:RU-QS
                    const selectedProductItem = item?.selectedProducts?.id ? item.selectedProducts : item.products?.[0];
                    if (isManualSize && selectedProductItem?.["tier_prices"]?.length) {
                      let price = 0;
                      if (selectedManualSizeData && Object.keys(selectedManualSizeData).length) {
                        Object.keys(selectedManualSizeData).forEach((a) => {
                          if (selectedManualSizeData[a]?.price)
                            price = selectedManualSizeData[a]?.price
                        })
                      }
                      const tempManualTier = [];
                      selectedProductItem?.["tier_prices"].forEach((manualTier) => {
                        const p = ((price || 1) * ((manualTier?.percentage || 100) / 100)).toFixed(4);
                        tempManualTier.push({ qty: manualTier?.qty, price: parseFloat(p) });
                      })
                      tier_prices = tempManualTier;
                    } else if ((selectedProductItem?.["price"] > -1) && selectedProductItem?.["tier_prices"]?.length) {
                      // && variantCount===0
                      tier_prices = selectedProductItem["tier_prices"];
                    } else if (selectedProductItem?.["price"] > -1) {
                      // && variantCount === 0 CN-KC-onbedrukt
                      price = parseFloat(selectedProductItem?.["price"]);

                    }

                    if (selectedProductItem?.["qty_increments"]) {
                      qty_increments = parseFloat(selectedProductItem?.["qty_increments"]);
                    }
                   
                    if (selectedProductItem?.["setup_costs"]) {
                      setup_costs = parseFloat(selectedProductItem?.["setup_costs"]);
                    }
                    if (selectedProductItem?.["min_sale_qty"]) {
                      min_sale_qty = parseFloat(selectedProductItem?.["min_sale_qty"]);
                    }
                    if (selectedProductItem?.["product_vat"]) {
                      product_vat = parseFloat(selectedProductItem?.["product_vat"]);
                    }
                    if (selectedProductItem?.["product_cost"]) {
                      product_cost_id = selectedProductItem?.["product_cost"];
                    }
                    if (selectedProductItem?.["product_cost_name"]) {
                      product_cost_name = selectedProductItem?.["product_cost_name"];
                    }
                    if (selectedProductItem?.["amount_per_piece"]) {
                      amount_per_piece = selectedProductItem?.["amount_per_piece"];
                    }
                    if (selectedProductItem?.["product_cost_value"]) {
                      product_cost_value = selectedProductItem?.["product_cost_value"];
                    }
                    if (selectedProductItem?.["am_shipping_type_free"]) {
                      am_shipping_type_free = selectedProductItem?.["am_shipping_type_free"];
                    }
                    if (selectedProductItem?.["qty"] !== undefined && selectedProductItem?.["qty"] !== null) {
                      qtyStock = parseFloat(selectedProductItem?.["qty"]);
                  }
                  if (selectedProductItem?.["manage_stock"] !== undefined && selectedProductItem?.["qty"] !== null) {
                  
                    manageStock = parseFloat(selectedProductItem?.["manage_stock"]);
                }
                  
                  
                    if (selectedProductItem?.["am_shipping_type"]) {
                      am_shipping_type = parseFloat(selectedProductItem?.["am_shipping_type"]);
                    }
                    if (item.products?.length) {
                      productsArray = item?.products;
                    }
                  } else if (!(!allDataItem?.multiOption || !prevKey)) {
                    isNoMachSelected = true;
                  }
                }
              }
              return null;
            });
            if (isNoMachSelected) tempSelectedData[k] = [];

            const totalLength = selectedColorData &&
              Object.values(selectedColorData).reduce((sum, array) => {
                const uniqueIds = new Set(array?.map(item => item?.pms_id));
                return sum + uniqueIds?.size;
              }, 0);
              let sample_tier_price = tier_prices?.slice(-1)?.pop()?.price;
      setSampleProductPrice({
       highest_tier:tempTierPriceSmaple.reduce((accumulator, currentValue) => {
          const updatedAccumulator = accumulator + currentValue;
          return updatedAccumulator > data?.settings?.sample_product_minimumprice 
              ? updatedAccumulator 
              : 0;
      }, 0),
        condtion_one: sample_tier_price < parseFloat(data?.settings?.sample_product_minimumprice),
        condition_two: sample_tier_price >= parseFloat(data?.settings?.sample_product_minimumprice) &&
          sample_tier_price < parseFloat(data?.settings?.sample_product_maximumprice),
        condtion_three: sample_tier_price >= parseFloat(data?.settings?.sample_product_maximumprice)
      }
      )
            // let totalLength = tempSelectedData?.cpker?.length && Object.values(tempSelectedData?.cpker[0]).reduce((sum, array) => sum + array.length, 0);
            // multi varient single price (Commented on purpose)
            // temp = {...temp, tier_prices:mergeQty(temp["tier_prices"], tier_prices),min_sale_qty:(temp.min_sale_qty<min_sale_qty) ? min_sale_qty:temp.min_sale_qty, price:temp["price"] + price, setup_costs:temp["setup_costs"]+setup_costs, product_vat:temp["product_vat"]+product_vat};
            temp = {
              ...temp,
              tier_prices: tier_prices,
              min_sale_qty: (temp.min_sale_qty < min_sale_qty) ? min_sale_qty : temp.min_sale_qty,
              price: price,
              setup_costs: setup_costs,
              product_vat: product_vat,
              qtyStock:qtyStock,
              manageStock:manageStock,
              qty_increments: qty_increments,
              am_shipping_type_free: am_shipping_type_free,
              product_cost_name: product_cost_name,
              amount_per_piece: amount_per_piece,
              product_cost_value: product_cost_value,
              product_cost_id: product_cost_id,
              am_shipping_type: am_shipping_type,
              change_costs: change_costs && !thisObjSample && tempSelectedData[k]?.length ? ((totalLength - 1) * change_costs) : 0
            };
            tempSelectedDetails[k] = {};
            tempSelectedDetails[k]["labels"] = tempLabel;
            tempSelectedDetails[k]["products"] = tempProductId;
            tempSelectedDetails[k]["returnData"] = tempReturnData;
            tempSelectedDetails[k]["variantIndex"] = i;
            if (allDataItem?.multiOption) {
              tempSelectedDetails[k]["prevKey"] = prevKey;
              tempSelectedDetails[k]["variantCount"] = variantCount;
              tempSelectedDetails[k]["selectedOptionProductList"] = selectedOptionProductList;
            }
            tempSelectedDetails[k]["thisType"] = "variant";
            prevKey = k;
          } else if (allDataItem?.multiOption) {
            tempSelectedDetails[k] = { variantIndex: i, thisType: "variant", prevKey, labels: [], products: [], returnData: [], setup_costs: 0, change_costs: 0, price: 0, min_sale_qty: 0, tier_prices: [] };
            prevKey = k;
            selectedSampleQty = 0;
          } else {
            if (additionalOption.is) {
              setAdditionalOption({ is: true, sku: "" })
            }
            tempSelectedDetails[k] = { variantIndex: i, thisType: "variant", prevKey, labels: [], products: [], returnData: [], setup_costs: 0, change_costs: 0, price: 0, min_sale_qty: 0, tier_prices: [] };
          }

        }
        else if (!thisObjSample && allDataItem?.thisType === "customize") {
          const TempTierPrice = temp?.tier_prices
          if (isPrintProduct === 0 && allDataItem?.label) {

            let isAny = false;
            availablePrintCustomize.forEach((i) => {
              if (`${allDataItem.label}`.toLowerCase().includes(i.toLowerCase()) || `${allDataItem.label}`.toLowerCase() !== "none") isAny = true;
            })
            if (isAny) isPrintProduct = 1;
          }
          if (tempSelectedData[k]?.length && allDataItem?.options && Object.keys(allDataItem.options)) {
            tempSelectedDetails[k] = {};
            let tempLabel = [], tempProductId = [], tempReturnData = [], tier_prices = [], price = 0, setup_costs = 0, product_vat = 0;
            if (allData[k]?.["varientType"] === "field") {
              tempLabel = tempSelectedData[k];
              Object.keys(allDataItem.options).map((k1) => {
                if (allDataItem.options[k1].length) {
                  allDataItem.options[k1].map((dataItem) => {
                    let temp = {};
                    temp[dataItem.id] = tempSelectedData[k]?.length ? tempSelectedData[k][0] : "";
                    tempReturnData.push({ ...temp });
                    return null;
                  })
                }
                return null;
              })
            } else {
              let isAnyPrintOption = false;
              Object.keys(allDataItem.options).map((k1) => {
                if (allDataItem.options[k1].length) {
                  allDataItem.options[k1].map((dataItem) => {
                    setOneTime(dataItem?.one_time)

                    if (dataItem.options.length)
                      dataItem.options.map((item) => {
                        if (item?.id && tempSelectedData[k].includes(item.id)) {
                          if (!isAnyPrintOption && isPrintProduct === 1 && item?.name && !noPrintCustomizeOption.includes(`${item.name}`.toLocaleLowerCase())) isAnyPrintOption = true;
                          let temp = {};
                          temp[dataItem.id] = item.id;

                          tempReturnData.push({ ...temp });
                          if (item?.name) tempLabel = [...tempLabel, item.name];

                          if (item?.["price"] > -1) {
                            if (item?.tier_prices?.length) {
                              if (dataItem?.one_time === "1") {
                                tier_prices = getSingleTierPrice(item?.tier_prices)
                              } else {
                                tier_prices = item["tier_prices"];
                              }
                            }
                            else {
                              if (dataItem?.one_time === "1" && TempTierPrice?.length) {
                                let newTierPrice = [];
                                TempTierPrice.map((priceItem) => {
                                  newTierPrice.push({ qty: priceItem.qty, price: item?.["price"] / priceItem.qty })
                                })
                                tier_prices = newTierPrice;
                              }
                              else if(dataItem?.one_time === "0") {
                                price = parseFloat(item?.["price"]);
                              }

                            }
                            // if (dataItem?.one_time === "0") {
                            //   price = parseFloat(item?.["price"]);
                              
                            // }
                            // if (dataItem?.one_time !== "1") {
                            //   let newTierPrice = [];
                            //   TempTierPrice.map((priceItem) => {
                            //     newTierPrice.push({ qty: priceItem.qty, price: parseFloat(item?.["price"]) })
                            //   })
                            //   tier_prices = newTierPrice;
                            // }

                          }

                          // if (item?.["name"] && item["name"].includes("Zelfde")) {
                          //   delivery = item?.["name"];
                          // }

                          if (item?.["setup_costs"]) {
                            setup_costs = item?.["setup_costs"] ? item?.["setup_costs"] : 0;
                            //  setSetupCostColor(item?.["setup_costs"] ? item?.["setup_costs"] : 0)
                            // setup_costs = item?.["setup_costs"] ? item?.["setup_costs"] * (isCpkerLength ? isCpkerLength : 1) : 0;
                          }
                          if (item?.["product_vat"]) {
                            product_vat = parseFloat(item?.["product_vat"]);
                          }
                        }
                        return null;
                      });
                    return null;
                  });
                }

                if (isPrintProduct === 1) isPrintProduct = isAnyPrintOption ? 2 : 0;
                return null;
              })
            }
            if (isManualSizeProduct && tier_prices.length) {
              const newTierPrice = [], additionalPercentage = tier_prices[0].percentage;
              if (additionalPercentage && temp["tier_prices"]?.length) {
                temp["tier_prices"].map((item) => {
                  newTierPrice.push({
                    ...item, price: item.price + (item.price * additionalPercentage / 100)
                  })
                })
                temp["tier_prices"] = newTierPrice
              }
            }
            temp = {
              ...temp,
              delivery,
              tier_prices: mergeQty(temp["tier_prices"], tier_prices, isCpker),
              price: tier_prices.length ? temp["price"] : temp["price"] + price,
             setup_costs: temp["setup_costs"] + setup_costs,
              product_vat: temp["product_vat"] + product_vat,
            };
            // temp = { ...temp, delivery, tier_prices: mergeQty(temp["tier_prices"], tier_prices, isCpker), price:temp["price"] + price, setup_costs: temp["setup_costs"] + setup_costs, product_vat: temp["product_vat"] + product_vat };
            tempSelectedDetails[k]["labels"] = tempLabel;
            tempSelectedDetails[k]["products"] = tempProductId;
            tempSelectedDetails[k]["returnData"] = tempReturnData;
            tempSelectedDetails[k]["thisType"] = "customize";
          } else {
            if (isPrintProduct === 1) isPrintProduct = 0;
            tempSelectedDetails[k] = { thisType: "customize", labels: [], products: [], returnData: [], setup_costs: 0, price: 0, tier_prices: [] };
          }
        } else if (!thisObjSample && allDataItem?.thisType === "additional") {
          if (allDataItem.variantId === k) tempVariantId = k;

          if (isPrintProduct === 0 && allDataItem?.label) {
            let isAny = false;
            availablePrintCustomize.forEach((i) => {
              if (`${allDataItem.label}`.toLowerCase().includes(i.toLowerCase()) || `${allDataItem.label}`.toLowerCase() !== "none") isAny = true;
            })
            if (isAny) {
              isPrintProduct = 1;
            }
          }
          if (tempVariantId) {
            tempSelectedDetails[k] = {};
            tempSelectedDetails[k]["variant"] = tempVariantId;
            const additionalVarientData = allDataItem?.["data"]?.[tempVariantId], sampleCustomizeTemp = [];
            let tempLabel = [], tempProductId = [], tempReturnData = [], tier_prices = [], price = 0, setup_costs = 0, product_vat = 0;
            let isAnyPrintOption = false;
            if (additionalVarientData) {
              Object.keys(additionalVarientData).map((key) => {
                const tempAdd = additionalVarientData[key];
                if (tempAdd && tempAdd.length) {
                  tempAdd.map((i) => {
                    let ifFound = false;
                    if (i.options && i.options.length) {
                      i.options.map((j) => {
                        if (tempSelectedData[k]?.length) {
                          if (j.id && tempSelectedData[k].includes(j.id)) {
                            if (!isAnyPrintOption && isPrintProduct === 1 && j?.name && !noPrintCustomizeOption.includes(`${j.name}`.toLocaleLowerCase())) isAnyPrintOption = true;
                            let t = {};
                            t[i.id] = j.id;
                            tempReturnData.push({ ...t });
                            if (j?.name) tempLabel = [...tempLabel, j.name];
                            if (j?.["tier_prices"] && j["tier_prices"].length) {
                              tier_prices = mergeQty(j["tier_prices"], tier_prices, isCpker, true)
                            } else if (j?.["price"]) {
                              price = price + parseFloat(j?.["price"]);
                            }
                            if (j?.["setup_costs"]) {
                              setup_costs = setup_costs + parseFloat(j?.["setup_costs"]);
                            }
                            if (j?.["product_vat"]) {
                              product_vat = product_vat + parseFloat(j?.["product_vat"]);
                            }
                          }
                        } else {
                          if (!ifFound && j?.price === 0) {
                            ifFound = true;
                            sampleCustomizeTemp.push({ option_id: i?.id, option_value: j?.id })
                          }
                        }
                        return null;
                      })
                    }
                    return null;
                  })
                }
                return null;
              })
            }
            if (isPrintProduct === 1) isPrintProduct = isAnyPrintOption ? 2 : 0;
            if (sampleCustomizeTemp.length) {
              setSampleCustomizeItem([...sampleCustomizeTemp])
            }
            temp = { ...temp, tier_prices: mergeQty(temp["tier_prices"], tier_prices, isCpker), price: temp["price"] + price, setup_costs: temp["setup_costs"] + setup_costs, product_vat: temp["product_vat"] + product_vat };
            tempSelectedDetails[k]["labels"] = tempLabel;
            tempSelectedDetails[k]["products"] = tempProductId;
            tempSelectedDetails[k]["returnData"] = tempReturnData;
            tempSelectedDetails[k]["thisType"] = "additional";
            tempSelectedDetails[k]["hide"] = !allData?.[k]?.["data"]?.[tempVariantId];
            reduseCount = !allData?.[k]?.["data"]?.[tempVariantId] ? reduseCount + 1 : reduseCount
          } else {
            if (isPrintProduct === 1) isPrintProduct = 0;
            tempSelectedDetails[k] = { thisType: "additional", labels: [], products: [], returnData: [], setup_costs: 0, price: 0, tier_prices: [] };
          }
        } else if (!thisObjSample && k === "upload") {
          tempSelectedDetails[k] = {};
          tempSelectedDetails[k]["reduseCount"] = reduseCount;
          tempSelectedDetails[k]["labels"] =
            tempSelectedData[k]?.[0] === "true" ? "Ik lever het ontwerp later aan" :
              imagesDropbox.length ? "Bestanden geupload" : "";
          tempSelectedDetails[k]["isUpload"] = isPrintProduct !== 2 || tempSelectedData[k]?.[0] === "true" ? false : true;
          tempSelectedDetails[k]["thisType"] = "upload"; // isPrintProduct
          tempSelectedDetails[k]["hide"] = isPrintProduct !== 2;
          // setReqExpanded(isPrintProduct === 2 && tempSelectedData[k]?.[0] === "true");
        } else if (k === "isSample") {
          tempSelectedDetails[k] = {};
          tempSelectedData[k] = (tempSelectedData[k]?.[0] === "true") ? ['true'] : [];
          tempSelectedDetails[k]["thisType"] = "isSample";
          tempSelectedDetails[k]["isSample"] = tempSelectedData[k]?.[0] === "true";
        } else if (k === "qty") {
          const qty1 = thisObjSample ? selectedVarientQty : qtyUrl > -1 ? qtyUrl : qty;
          if (qtyUrl > -1) {
            setQty(qtyUrl);
            setQtyTemp(qtyUrl);
            setQtyUrl(-1);
          }
          tempSelectedDetails[k] = {};
          let tempQty = { ...qtyDataDefault };
          tempSelectedData[k] = thisObjSample ? [] : qty1 ? [`${qty1}`] : [];
          tempSelectedDetails[k]["labels"] = qty1 ? `${qty1}  stuk(s)` : "";
          tempSelectedDetails[k]["reduseCount"] = reduseCount;
          const tier_prices = temp?.tier_prices?.length ? isCpker ? temp.tier_prices : temp.tier_prices.filter((a) => a?.hide !== true) : [];

          if (qty1 > 0 && temp.tier_prices.length) {
            // let nm_tier_prices = (temp?.tier_prices?.length ? [...temp.tier_prices].filter((a) => a?.hide === true) : []).length;
            tier_prices.map((tier_i, i) => {
              if (tier_i.qty !== qty1 && tier_i.qty < qty1) {
                tempQty = { isCustomQty: true, index: i, price: !isNaN(parseFloat(tier_i?.price)) ? (parseFloat(tier_i?.price) + temp.price) : 0, addOnPrice: temp.price }
                setQtyTemp(qty1);
              } else if (tier_i.qty === qty1) {
                tempQty = { isCustomQty: isCustomQty === true ? true : false, index: i, price: !isNaN(parseFloat(tier_i?.price)) ? (parseFloat(tier_i?.price) + temp.price) : 0, addOnPrice: temp.price }
              } else if (thisObjSample) {
                tempQty = { isCustomQty: true, index: -1, price: !isNaN(parseFloat(tier_prices[0]?.price)) ? (parseFloat(tier_prices[0]?.price) + temp.price) : 0, addOnPrice: temp.price }
                setQtyTemp(qty1);
              }
              return null;
            })
          } else if (!tier_prices?.length && (temp?.price > 0) && (temp?.min_sale_qty > 0)) {
            tempQty = { isCustomQty: true, index: -1, price: !isNaN(parseFloat(temp?.price)) ? parseFloat(temp.price) : 0, addOnPrice: temp.price }
            setQtyTemp(qty <= temp.min_sale_qty ? temp.min_sale_qty : qty);
            if (qty <= temp.min_sale_qty) {
              tempSelectedData[k] = [temp.min_sale_qty];
            }
          } else {
            tempQty = { isCustomQty: false, index: -1, price: 0.0, addOnPrice: temp.price }
            setQtyTemp(0);
            setQty(0);
            tempSelectedData[k] = [];
          }
          setIsCustomQty(tempQty.isCustomQty)
          setQtyData(tempQty)
          setMinPrice({ qty: tier_prices[0]?.qty, price: parseFloat(tier_prices[0]?.price) });
          if (thisObjSample) setSampleQty(selectedSampleQty);
        }
        if (!thisObjSample && isSizeQtyProduct) {
          let qtySizeVariant = totalValueQty;
          if (variantQtydata?.length && (totalValueQty >= data?.settings?.min_sale_qty)) {
            setQty(qtySizeVariant);
          }
          let tempQty = { ...qtyDataDefault };
          if (qtySizeVariant > 0 && temp.tier_prices.length) {
            temp.tier_prices.map((tier_i, i) => {
              if (tier_i.qty !== qtySizeVariant && tier_i.qty < qtySizeVariant) {
                tempQty = { isCustomQty: true, index: -1, price: !isNaN(parseFloat(tier_i?.price)) ? (parseFloat(tier_i?.price) + temp.price) : 0, addOnPrice: temp.price }
              } else if (tier_i.qty === qtySizeVariant) {

                tempQty = { isCustomQty: false, index: i, price: !isNaN(parseFloat(tier_i?.price)) ? (parseFloat(tier_i?.price) + temp.price) : 0, addOnPrice: temp.price }
              } else if (thisObjSample) {
                tempQty = { isCustomQty: true, index: -1, price: !isNaN(parseFloat(temp.tier_prices[0]?.price)) ? (parseFloat(temp.tier_prices[0]?.price) + temp.price) : 0, addOnPrice: temp.price }
              }
              return null;
            })
          }
          setQtyData(tempQty);
          setMinPrice({ qty: temp.tier_prices[0]?.qty, price: parseFloat(temp.tier_prices[0]?.price) });
        }
        if ((!thisObjSample && k === "cpker") || (!thisObjSample && allDataItem?.thisType === "customize" && Object.keys(tempSelectedData)?.includes("cpker"))) {
          const k = "cpker";
          isCpker = true;
          tempSelectedDetails[k] = {};
          tempSelectedDetails[k]["labels"] = tempSelectedData[k] && Object.keys(tempSelectedData[k]).length ? [" "] : [];
          tempSelectedDetails[k]["thisType"] = "cpker";
          let objTemp = {}
          if (tempSelectedData[k]?.length && (typeof tempSelectedData[k][0] === "string")) {
            const tempStringSelected = tempSelectedData[k].join();
            objTemp = JSON.parse(tempStringSelected)
          } else if (tempSelectedData[k]?.length) {
            objTemp = tempSelectedData[k][0]
          }
          if (!isColorPickerTierPrices) {
            let qtyCpker = 0;
            if (objTemp && Object.keys(objTemp)?.length) {
              Object.keys(objTemp).map((cKey, index) => {
                const tempColorItem = objTemp[cKey]
                if (tempColorItem && tempColorItem.length) {
                  tempColorItem.map((clr) => qtyCpker = qtyCpker + (clr.qty || 0))
                }
                return null;
              })
            }
            setQty(qtyCpker);
            let tempQty = { ...qtyDataDefault };
            if (qtyCpker > 0 && temp.tier_prices.length) {
              temp.tier_prices.map((tier_i, i) => {
                if (tier_i.qty !== qtyCpker && tier_i.qty < qtyCpker) {
                  tempQty = { isCustomQty: true, index: -1, price: !isNaN(parseFloat(tier_i?.price)) ? (parseFloat(tier_i?.price) + temp.price) : 0, addOnPrice: temp.price }
                } else if (tier_i.qty === qtyCpker) {
                  tempQty = { isCustomQty: false, index: i, price: !isNaN(parseFloat(tier_i?.price)) ? (parseFloat(tier_i?.price) + temp.price) : 0, addOnPrice: temp.price }
                } else if (thisObjSample) {
                  tempQty = { isCustomQty: true, index: -1, price: !isNaN(parseFloat(temp.tier_prices[0]?.price)) ? (parseFloat(temp.tier_prices[0]?.price) + temp.price) : 0, addOnPrice: temp.price }
                }
                return null;
              })
            }
            setQtyData(tempQty);
            setMinPrice({ qty: temp.tier_prices[0]?.qty, price: parseFloat(temp.tier_prices[0]?.price) });
          }
        }
      });
      if (!isGallerySelected) {
        setGallerySelected([]);
      }
      const matched_tier_prices = temp?.tier_prices?.length 
  ? (isCpker 
      ? temp.tier_prices 
      : temp.tier_prices
          .filter((a) => a?.hide !== true)
          .map((tier) => ({
            ...tier,
            price: Math.ceil(tier.price * 100) / 100 
          }))
    ) 
  : [];
      // const matched_tier_prices = temp?.tier_prices?.length ? isCpker ? temp.tier_prices : temp.tier_prices.filter((a) => a?.hide !== true) : [];
      const not_matched_tier_prices = temp?.tier_prices?.length ? temp.tier_prices.filter((a) => a?.hide === true) : [];
      setImageCanvasTemplate(tempCanvasTemplate);
      setSelectedDetailsFinal({ ...temp, tier_prices: matched_tier_prices, not_matched_tier_prices, product_vat: temp?.product_vat ? temp.product_vat : data?.settings?.product_vat ? data.settings.product_vat : 0 })
      
      setSelectedDetails({ ...tempSelectedDetails });
     
      if (reqExpanded) {
        setReloadScroll(true)
        handleExpandNext(reloadScroll ? 1 : 0, reqExpanded === "cart", tempSelectedData, tempSelectedDetails);
        setReqExpanded(false);
      }
      setSelectedDataNow(tempSelectedData)

      generateNewUrl(tempSelectedData);
      if (isNewUrlLoad) {
        // const reCheckExpandOnload = Object.keys(selectedDataDefault).length - 1 - (isPrintProduct !== 2 ? 1 : 0);
        // if (`${reCheckExpandOnload}` === expanded || expanded === 0) {
        // setTimeout(()=> {
        //   if (isPrintProduct !== 2) setExpanded(`${reCheckExpandOnload + 1}`)
        // },300)
        // }
        setIsNewUrlLoad(false);
      }
    }
  }, [selectedData, qty]);
  
  useEffect(() => {
    let CustomOptions;
    if (!isSample && (data?.settings?.product_id && selectedDetails && Object.keys(selectedDetails).length)) {
      const option = getApiCartOptions();
      CustomOptions = isSample ? [...sampleCustomizeItem] : [...getKeyVal(option?.customize), ...getKeyVal(option?.additional)]
      // if (option && option["products"].length) getDeliveryDate(option, "selectedDetails"); // On purpose For reduse mutiple API call
      if (data?.settings?.product_id && deliveryData === null && qty > 0 && !hasFetchedDeliveryDate.current) {
        getDeliveryDate(option, qty);
        hasFetchedDeliveryDate.current = true; 
      }
    }
    setdisableAction("selectedDetails");
    // if (!stopDouble) {
    //   setStopDouble(true)
    // } else setStopDouble(false);
    setCustomOptions(CustomOptions)
    if (changeCustomizeOption?.qty) {
      if (selectedDetailsFinal?.not_matched_tier_prices?.length) {
        const matchedQty = selectedDetailsFinal.not_matched_tier_prices.some(
          item => item.qty === qty
        );
    
        if (matchedQty) {
          setQty(0);
          setReqExpanded(true);
          setchangeCustomizeOption({ qty: false });
        }
      }
    
    }
    if(changeCustomizeOption?.customoption || changeCustomizeOption?.variant){
      setchangeCustomizeOption({
        customoption:"",
        variant:""
      })
      const option = getApiCartOptions();
      getDeliveryDate(option,qty)
    }
    
  }, [selectedDetails]);

  useEffect(() => {
    if (disableAction !== "") {
      setTimeout(() => {
        if (disableAction !== "") setdisableAction("");
      }, 600);
    }
  }, [disableAction])
  useEffect(() => {
    if (data && selectedDataDefault) {
      const tempSelectedObj = { ...selectedDataDefault };
      if (urlGenData && Object.keys(urlGenData)?.length) {
        Object.keys(urlGenData).map((k, i) => {
          // if (tempSelectedObj[k] && urlGenData[k]) tempSelectedObj[k] = `${urlGenData[k]}`.split(',');
          if (k === "qty" && urlGenData[k] && Number(urlGenData[k]) > 0) {
            // setQtyUrl(Math.round(Number(urlGenData[k])))
          } else if (tempSelectedObj[k] && urlGenData[k]) {
            let manual_size_data = null;
            try {
              const a = JSON.parse(urlGenData[k])
              manual_size_data = a?.[0]?.manualSize ? a?.[0]?.manualSize : null;
            }
            catch (e) { }
            if (manual_size_data && manual_size_data?.key) {
              const a = {}, b = {};
              Object.keys(manual_size_data).map((k) => {
                if (k !== "key") a[k] = manual_size_data[k]
              })
              b[manual_size_data?.key] = [{ ...a }];
              tempSelectedObj[k] = [{ manualSize: { ...b } }]
            } else tempSelectedObj[k] = `${urlGenData[k]}`.split(',')
          } else {
            setQtyUrl(0)
          }
          return null;
        })
      }
      if (stopNextNav) {
        setStopNextNav(false)
      } else setReqExpanded(true);
      try {
        if (JSON.stringify(tempSelectedObj) !== JSON.stringify(selectedData))
          setSelectedData({ ...tempSelectedObj })
      } catch (e) {
        console.log(e, "error")
      }
    }
  }, [urlGenData]);
  useEffect(() => {
    if (singleToken === "loaded" && data && selectedDataDefault) {
      if (isSample) {
        const temp = {}, temp1 = {};
        Object.keys(selectedDetailsDefault).length && Object.keys(selectedDetailsDefault).forEach((k) => {
          const vType = selectedDetailsDefault[k]?.thisType;
          if (vType === "isSample" || vType === "variant") {
            temp1[k] = selectedDetailsDefault[k];
          }
        })
        setSelectedDetails({ ...temp1 });
        const backup = selectedDataBackup && Object.keys(selectedDataBackup).length ? { ...selectedDataBackup } : { ...selectedDataDefault };
        setSelectedDataBackup({ ...selectedData });
        setReqExpanded(true);
        setExpanded("0");
        Object.keys(backup).length && Object.keys(selectedDetailsDefault).forEach((k) => {
          const vType = selectedDetailsDefault[k]?.thisType;
          if (vType === "isSample" || vType === "variant") {
            temp[k] = backup[k];
          }
        })
        setSelectedData({ ...temp, isSample: ["true"] });
      } else {
        const backup = selectedDataBackup && Object.keys(selectedDataBackup).length ? { ...selectedDataBackup } : { ...selectedDataDefault };
        setSelectedDetails({ ...selectedDetailsDefault })
        setSelectedDataBackup({ ...selectedData });
        setSelectedData({ ...backup });
      }
    }
  }, [isSample]);

  useEffect(() => {
    if (singleToken === "") setSingleToken("loaded");
  }, [singleToken]);

  const addToWishlist__gtm = (productName, productSku) => {
    const data = {
      event: 'addToWishlist',
      eventLabel: productName,
      ecommerce: {
        addwishlist: {
          products: [
            {
              name: productName,
              id: productSku,
            }
          ]
        }
      },
    };
    TagManager.dataLayer({ dataLayer: data });
  };
  const includesNameOrPmsKey = (dataArray) => {
    return dataArray.some(obj => {
      return Object.keys(obj).includes("name") || Object.keys(obj).includes("pms_key");
    });
  };

  const calculateShippingCostsFree = () => {
    const isCpkerLength = selectedColorData &&
      Object.values(selectedColorData).reduce((sum, array) => {
        const uniqueIds = new Set(array?.map(item => item?.pms_id));
        return sum + uniqueIds?.size;
      }, 0);
    let shippingCostsFree = false;
    if (
      parseInt(selectedDetailsFinal?.am_shipping_type) === 3338 &&
      ((qtyData.price * (isSample ? sampleQty : qty)) + selectedDetailsFinal.setup_costs * (isCpkerLength ? isCpkerLength : 1) + selectedDetailsFinal.change_costs) > 500
    ) {
      return true;
    }
    if (selectedDetailsFinal?.am_shipping_type_free) {
      shippingCostsFree = selectedDetailsFinal?.am_shipping_type_free;
    }
    return shippingCostsFree;
  };
  const shippingCostsFree1 = calculateShippingCostsFree();
  // const ShippingCostsInitText = () => {
  //   if (data?.settings?.product_type === "configurable") {
  //     if (data.settings?.init_shipping_type === "Gratis verzending") {
  //       return <b className='normal green'>Gratis</b>;
  //     } else {
  //       return <b className='normal green'>Zie winkelwagen</b>;
  //     }
  //   }
  //   return <b className='normal green'>Gratis</b>;
  // };
  const isCpkerLength =
    selectedColorData &&
    Object.values(selectedColorData).reduce((sum, array) => {
      const uniqueIds = new Set(array?.map((item) => item?.pms_id));
      return sum + uniqueIds?.size;
    }, 0);

  const isBase64Encoded = (str) => {
    let string;
    try {
      if (str?.includes("YYYY")) {
        string = str?.replace("YYYY", "");
        return atob(string);
      } else {
        return atob(str);
      }
    } catch (e) {
      return str;
    }
  };
  useEffect(() => {
    if (selectedDetailsFinal?.manageStock === 1 ) {
      let formattedQtyStock = selectedDetailsFinal?.qtyStock.toString().includes('.') ? Math.round(selectedDetailsFinal.qtyStock * 1000): selectedDetailsFinal.qtyStock 
        if (selectedDetailsFinal?.qtyStock === 0 || formattedQtyStock < qty || selectedDetailsFinal?.text?.includes("onbekend")) {
        setIsOutOfStock(true);
      } else {
        setIsOutOfStock(false);
      }
    }
  }, [selectedDetailsFinal?.qtyStock, qty , selectedDetailsFinal?.manageStock]);
  return (
    <React.Fragment key={key}>
      <div className='productVariant'>
        {/* {disableAction !== "" ? <div className='variantOverlay' /> : null} */}
        <div ref={startAccordionRef} style={{ minHeight: 1 }} />
        <div className={`accordion0`} />
        <div className={`w-1/1 gap-6 flex ${isSample ? "col-i" : "col"}`}>
          <div className='variant-list'>
            {Object.keys(allData).length ? (
              <React.Fragment>
                {Object.keys(allData).map((key, item) => (
                  <React.Fragment key={`aoptions[0]?.labelllData-${item}`}>
                    {allData[key]?.thisType === "variant" ? (
                      <React.Fragment key={`Fragment_${key}_${allData[key]?.label}_${item}`}>
                        {/* setPrevKey( ? selectedDetails[keyList[0]].prevKey : ""); */}
                        <Accordion key={`Accordion_${allData[key]?.label}_${item}`} expanded={expanded === `${item}`} onChange={handleExpanded(`${item}`)}>
                          <VariantHeader id={`${item}`} name={`${allData[key]?.label}`} isError={(parseInt(expanded) > item && !(allData[key]?.sizeQty ? variantQtydata?.length && totalValueQty >= data?.settings?.min_sale_qty : allData[key]?.options[0]?.label == "manual-size" ? selectedDetails?.[key]?.products?.length : selectedData?.[key]?.length)) || (expanded === `${item}` && expanded === errorOpenTab)} expanded={expanded === `${item}` || expanded === item} label={allData[key]?.options[0]?.label == "manual-size" ? manualsizelabel : selectedDetails[key]?.labels?.join(", ")} order={item + 1} completed={allData[key]?.sizeQty ? variantQtydata?.length && totalValueQty >= data?.settings?.min_sale_qty : allData[key]?.options[0]?.label == "manual-size" ? selectedDetails?.[key]?.products?.length : selectedData?.[key]?.length} translate={translateData?.translations} />
                          <AccordionDetails>
                            {allData[key]?.options && allData[key]?.options?.length ?
                              <React.Fragment>
                                {isSample ? <p className='mb-4' style={{ fontSize: 15, lineHeight: "23px" }}>{`Indien mogelijk kunt u maximaal 3 kleursamples tegelijk aanvragen (één item per kleur). `}</p> : null}
                                {/* {allData[key]?.mutiSelect ? <p className='mb-4' style={{ fontSize: 15, lineHeight: "23px" }}>{`Selecteer de gewenste opties, meerdere keuzes mogelijk.`}</p> : null} As per client request it was removed on purpose */}
                                {item === 0 && data?.settings?.custom_made_option_subtitle ? <p className='mb-4' style={{ fontSize: 15, lineHeight: "23px" }}>{data?.settings?.custom_made_option_subtitle}</p> : null}
                                {allData[key]?.sizeQty ? (
                                  <div className="sizeQty relative">
                                    <VariantQtyPicker
                                      keyList={[key]}
                                      allData={allData}
                                      isSample={isSample}
                                      variantData={allData[key]}
                                      setSelected={setSelectedData}
                                      selectedDetails={selectedDetails}
                                      setStopNextNav={setStopNextNav}
                                      selectedData={selectedData}
                                      setReqExpanded={setReqExpanded}
                                      expanded={expanded}
                                      setExpanded={setExpanded}
                                      selectedDetailsFinal={selectedDetailsFinal}
                                      setVariantQtyData={setVariantQtyData}
                                      variantQtydata={variantQtydata}
                                      setOpenModelQty={setOpenModelQty}
                                      openModelQty={openModelQty}
                                      setErrorQty={setErrorQty}
                                      errorQty={errorQty}
                                      setTotalValueQty={setTotalValueQty}
                                      totalValueQty={totalValueQty}
                                      productData={data}
                                    />
                                  </div>
                                ) : (
                                  <div className="flex left wrap gap-y-4 variantCardList">
                                    <VariantCardSeeMore
                                    setchangeCustomizeOption={setchangeCustomizeOption}
                                      qty={qty}
                                      getApiCartOptions={getApiCartOptions}
                                      getDeliveryDate={getDeliveryDate}
                                      keyList={[key]}
                                      allData={allData}
                                      isSample={isSample}
                                      variantData={allData[key]}
                                      selected={selectedData}
                                      setSelected={setSelectedData}
                                      expandNext={setReqExpanded}
                                      selectedDetails={selectedDetails}
                                      setStopNextNav={setStopNextNav}
                                      handleExpandNext={handleExpandNext}
                                      selectedManualSizeData={selectedManualSizeData}
                                      setSelectedManualSizeData={setSelectedManualSizeData}
                                      setmanualsizestr={setmanualsizestr}
                                      setmanualsizelabel={setmanualsizelabel}
                                      translate={translateData?.translations}
                                    />
                                    {allData[key]?.options[0]?.label == "manual-size" ?
                                      <div className='variantCardList'>
                                        <Button onClick={() => {
                                          if (expanded === 0) setExpanded("0")
                                          const selectedD = { ...selectedData };
                                          setSelectedData(selectedD);
                                          setReqExpanded(true);
                                        }} className='contained sm mt-4 mb-2 py-2 px-4 r-9 primary'>volgende</Button>
                                      </div>
                                      : null}
                                  </div>
                                )}
                              </React.Fragment> : null
                            }
                            {allData[key]?.mutiSelect ?
                              <div className='variantCardList'>
                                <Button onClick={() => {
                                  if (expanded === 0) setExpanded("0")
                                  const selectedD = { ...selectedData };
                                  setSelectedData(selectedD);
                                  setReqExpanded("cart");
                                }} className='contained sm mt-4 mb-2 py-2 px-4 r-9 primary'>volgende</Button>
                              </div>
                              : null}
                          </AccordionDetails>
                        </Accordion>
                      </React.Fragment>
                    ) : !isSample && allData[key]?.thisType === "cpker" ? (
                      <React.Fragment key={`Fragment_${key}_${allData[key]?.label}_${item}`}>
                        <div className={`accordion${item}`} />
                        {/* selectedColorData && Object.keys(selectedColorData).length) && Object.values(selectedColorData).some(array => array.length === 0) */}
                        <Accordion expanded={expanded === `${item}`} onChange={handleExpanded(`${item}`)}>
                          <VariantHeader id={`${item}`} name={`${allData[key]?.label}`} isError={(cmsError == "false" && true)} expanded={expanded === `${item}`} order={item + 1} label="" completed={cmsError == "true" ? true : false} translate={translateData?.translations} />

                          <AccordionDetails>
                            <div className="flex left wrap gap-y-4 cpList">
                              {selectedData[Object.keys(allData)[item - 1]]?.length ?
                                <React.Fragment key={`cpker${selectedData[Object.keys(allData)[item - 1]]?.length}`}>
                                  <div className='variantCardList w-1/1'>
                                    <VariantColorPicker
                                      keyList={key}
                                      product={{ selected: selectedData[Object.keys(allData)[item - 1]], data: allData[Object.keys(allData)[item - 1]].options }}
                                      selected={selectedData}
                                      setSelected={setSelectedData}
                                      setStopNextNav={setStopNextNav}
                                      selectedColorData={selectedColorData}
                                      setSelectedColorData={setSelectedColorData}
                                      openColorModel={openColorModel}
                                      setOpenColorModel={setOpenColorModel}
                                      selectedColorItem={selectedColorItem}
                                      setSelectedColorItem={setSelectedColorItem}
                                      colorDataList={translateData?.color_picker?.items}
                                      isColorPickerTierPrices={data?.settings?.xml}
                                      setCmsError={setCmsError}
                                      cmsError={cmsError}
                                    />
                                  </div>

                                  <div className='variantCardList w-1/1'>
                                    {cmsError == "false" && <p className='error'>Kies een kleur om verder te gaan</p>}
                                    <Button
                                      onClick={() => {
                                        const selectedD = { ...selectedData };
                                        setSelectedData(selectedD);
                                        if (selectedD) {
                                          let isError = "true";

                                          selectedD?.[key]?.forEach(obj => {
                                            Object.values(obj).forEach(array => {
                                              array.forEach(dataObj => {
                                                if (dataObj.color === "") isError = "false";
                                                else setReqExpanded(true);
                                              });
                                            });
                                          });
                                          setCmsError(isError);
                                        }
                                      }}
                                      className='contained sm mt-4 mb-2 py-2 px-4 r-9 primary'
                                    >
                                      volgende
                                    </Button>
                                  </div>
                                </React.Fragment> : null}
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </React.Fragment>
                    ) : !isSample && allData[key]?.thisType === "customize" ? (
                      <React.Fragment key={`Fragment_${key}_${allData[key]?.label}_${item}`}>
                        <div className={`accordion${item}`} />
                        <Accordion expanded={expanded === `${item}`} onChange={handleExpanded(`${item}`)}>
                          <VariantHeader id={`${item}`} name={`${allData[key]?.label}`} isError={(parseInt(expanded) > item && !(selectedData?.[key]?.length > 4)) || inputFieldExpand || (expanded === `${item}` && expanded === errorOpenTab)} expanded={expanded === `${item}`} label={allData[key]?.varientType === "field" ? isBase64Encoded(selectedDetails[key]?.labels?.join("")) : selectedDetails[key]?.labels?.length ? selectedDetails[key]?.labels?.join(", ") : allData[key]?.is_require === false ? "optioneel" : ""} order={item + 1} completed={selectedData?.[key]?.length} translate={translateData?.translations} />
                          <AccordionDetails>
                            <div className="flex left wrap gap-y-4 variantCardList">
                              {allData[key]?.varientType === "field" ?
                                <div className='pt-3 pb-3 w-1/1 flex col gap-2'>
                                  {allData[key]?.options?.[key]?.[0]?.custom_option_description ? <p>{allData[key].options[key][0].custom_option_description}</p> : null}
                                  {allData[key]?.options?.[0]?.custom_option_description ? <p>{allData[key].options[0].custom_option_description}</p> : null}
                                  <InputTextBox setInputFieldExpand={setInputFieldExpand} selectedData={selectedData} setSelectedData={setSelectedData} keyName={key} placeholder={"Typ hier..."} setInputManualSize={setInputManualSize} />
                                  <div>
                                  </div>
                                </div> : allData[key]?.options ?
                                  <>
                                    {allData[key]?.options?.[key]?.[0]?.custom_option_description ? <p>{allData[key].options[key][0].custom_option_description}</p> : null}
                                    {allData[key]?.options?.[0]?.custom_option_description ? <p>{allData[key].options[0].custom_option_description}</p> : null}

                                    <CustomizeCardRoot
                                     selectedDetailsFinal={selectedDetailsFinal}
                                     setQty={setQty}
                                     storeId={storeId}
                                      keyList={[key]}
                                      setchangeCustomizeOption={setchangeCustomizeOption}
                                      variantData={allData[key]}
                                      selected={selectedData}
                                      setSelected={setSelectedData}
                                      expandNext={setReqExpanded}
                                      handleExpandNext={handleExpandNext}
                                      setStopNextNav={setStopNextNav}
                                      translate={translateData?.translations}
                                      getDeliveryDate={getDeliveryDate}
                                      getApiCartOptions={getApiCartOptions}
                                      qty={qty}
                                      qtymatch={qtymatch}

                                    />
                                  </>
                                  : null
                              }
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </React.Fragment>
                    ) : !isSample && allData[key]?.thisType === "additional" && selectedDetails[key]?.hide !== true ? (
                      <React.Fragment key={`Fragment_${key}_${allData[key]?.label}_${item}`}>
                        <div className={`accordion${item}`} />
                        <div className={`additionalSubGroupListEle`} />
                        <Accordion expanded={expanded === `${item}`} onChange={handleExpanded(`${item}`)}>
                          <VariantHeader id={`${item}`} additional={true} name={`${allData[key]?.label}`} isError={(parseInt(expanded) > item && !(selectedData?.[key]?.length)) || (expanded === `${item}` && expanded === errorOpenTab)} expanded={expanded === `${item}`} label={selectedDetails[key]?.labels?.length ? selectedDetails[key]?.labels?.join(", ") : allData[key]?.is_require === false ? "optioneel" : ""} order={item + 1} completed={selectedData?.[key]?.length} translate={translateData?.translations} />
                          <AccordionDetails>
                            <div className="flex left wrap gap-y-4 additionalSubGroupList">
                              {selectedDetails?.[key]?.["variant"] && allData[key]?.["data"]?.[selectedDetails[key]["variant"]] && Object.keys(allData[key]["data"][selectedDetails[key]["variant"]]).length ?
                                <>
                                  <AdditionalSubGroupList
                                  setchangeCustomizeOption={setchangeCustomizeOption}
                                    getApiCartOptions={getApiCartOptions} getDeliveryDate={getDeliveryDate}
                                    key={`additionalSubGroup${item}`}
                                    keyList={[key]}
                                    name={`${allData[key]?.label}`}
                                    data={allData[key]["data"][selectedDetails[key]["variant"]]}
                                    selected={selectedData}
                                    setSelected={setSelectedData}
                                    expandNext={setReqExpanded}
                                    stopNextNav={stopNextNav}
                                    setStopNextNav={setStopNextNav}
                                    setOpenModel={setOpenModelUPS}
                                    setOpenModelInfo={setOpenModelInfo}
                                    setServicesDetailsData={setServicesDetailsData}
                                    translate={translateData?.translations}
                                    qty={qty}
                                  />
                                  <div>
                                    <Button onClick={() => {
                                      const selectedD = { ...selectedData };
                                      setSelectedData(selectedD);
                                      if (selectedData?.[key]?.length) {
                                        setReqExpanded(true);
                                      }
                                      else {
                                        setReqExpanded("cart");
                                      }
                                    }} className='contained sm mt-4 mb-2 py-2 px-4 r-9 primary'>volgende</Button>
                                  </div>
                                </> : null
                              }
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </React.Fragment>
                    ) : !isSample && key === "qty" ? (
                      <React.Fragment key={`Fragmentqty`}>

                        <div className={`accordion${item}`} id={`${item}`} data-id={`${typeof expanded}:${typeof `${item}`} ${expanded}:${item}`} />
                        <Accordion expanded={expanded === `${item}`} onChange={handleExpanded(`${item}`)}>
                          <VariantHeader id={`${item}`} name={`${allData[key]?.label}`} isError={(parseInt(expanded) > item && !(qty > 0 || (isCustomQty && qty > 0))) || (expanded === `${item}` && expanded === errorOpenTab)} expanded={expanded === `${item}`} label={selectedDetails[key]?.labels}
                            // order={selectedDetails?.["upload"]?.hide === true ? (item - (selectedDetails[key]?.reduseCount || 0)) : (item + 1 - (selectedDetails[key]?.reduseCount || 0))}
                            order={item + 1}
                            completed={(qty > 0 || (isCustomQty && qty > 0)) } translate={translateData?.translations} />
                          {(selectedDetailsFinal?.tier_prices?.length || (qtyData.addOnPrice > 0 || (!selectedDetailsFinal?.tier_prices?.length && (selectedDetailsFinal?.price > 0)))) ?
                            <AccordionDetails>
                              <div className="flex w-1/1 qtyTable1">
                                <div className="table-head">
                                  <div className="table-row table-row-title">
                                    <div className="item-cell">Aantal</div>
                                    <div className="item-cell"><i>Bespaar</i></div>
                                    <div className="item-cell">Stuksprijs</div>
                                    {width <= 768 ?
                                      <div className="item-cell">Totaalprijs</div>
                                      :
                                      <div className="item-cell">Totaal (excl. BTW)</div>
                                    }
                                  </div>
                                </div>
                                <div className="table-body">
                                  {selectedDetailsFinal?.not_matched_tier_prices?.length ? selectedDetailsFinal.not_matched_tier_prices.map((item, i) => (
                                    <div key={`qty_no_${i}`} className={`relative table-row ${item.hide || ""}`}>
                                      <div className="item-cell " data-label="Quantity">
                                        <div className='flex middle gap-4'>
                                          <input aria-label="checkbox" type="checkbox" readOnly checked={false} />
                                          <span className='span'></span>
                                          <span>{item.hide ? item.q : item?.qty}</span>
                                        </div>
                                      </div>
                                      <div className="item-cell" data-label="Save"> - </div>
                                      <div className="item-cell" data-label="Price"> - </div>
                                      <div className="item-cell" data-label="Total"> - </div>
                                    </div>
                                  )) : null}
                                  {selectedDetailsFinal?.tier_prices?.length ? selectedDetailsFinal.tier_prices.map((item, i) => (
                                    <div key={`qty_${i}`} className={`relative table-row`} onClick={() => {
                                      const option = getApiCartOptions()
                                      setTimeout(() => {
                                        getDeliveryDate(option, item.qty)
                                      }, 1000)
                                      setQtyTemp(item.qty); setIsCustomQty(false); setReqExpanded(true); setQty(item.qty)
                                    }}>
                                      <div className="item-cell " data-label="Quantity">
                                        <div className='flex middle gap-4'>
                                          <input type="checkbox" aria-label="checkbox" readOnly checked={!isCustomQty && qtyData.index === i} />
                                          <span className='span'></span>
                                          <span>{item?.qty}</span>
                                        </div>
                                      </div>
                                      <div className="item-cell" data-label="Save">
                                        <i>
                                          {!item.hide && item.qty > 1 ?
                                            <>
                                              {Math.round(((((selectedDetailsFinal.tier_prices[0].price || 0) + qtyData.addOnPrice) - ((item?.price
                                                || 0) + qtyData.addOnPrice)) / ((selectedDetailsFinal.tier_prices[0].price || 0) + qtyData.addOnPrice))
                                                * 100) || <span className='hypen'>-</span>}
                                              <span>%</span>
                                            </>
                                            : '-'}
                                        </i>
                                      </div>
                                      {/* <div className="item-cell" data-label="Price">{`${item.hide ? "-" : euroCurrency((item?.price || 0) +
                                        qtyData.addOnPrice)}`}</div>
                                      <div className="item-cell" data-label="Total">{`${item.hide ? "-" : euroCurrency(((item?.price || 0) +
                                        qtyData.addOnPrice) * item.qty)}`}</div> */}
                                      <div className="item-cell" data-label="Price">{`${item.hide ? "-" : euroCurrency(parseFloat(((item?.price || 0) +
                                        qtyData.addOnPrice).toFixed(2)))}`}</div>
                                      <div className="item-cell" data-label="Total">{`${item.hide ? "-" : euroCurrency(parseFloat((((item?.price || 0) +
                                        qtyData.addOnPrice) * item.qty).toFixed(2)))}`}</div>

                                    </div>
                                  )) : <div><div className="item-cell" style={{ height: 12 }}></div></div>}
                                  <div className={`relative text-row table-row`}  onClick={() => {
                                          if (selectedDetailsFinal?.tier_prices?.length) {
                                            setIsCustomQty(true)
                                          };
                                        }}>
                                    <div className="item-cell" data-label="Quantity">
                                      <div className={`flex middle gap-4 ${isCustomQty ? "custom" : ""}`}>
                                        <input type="checkbox" aria-label="checkbox" readOnly checked={isCustomQty}/>
                                        <span className='span'></span>
                                       
                                        
                                        <div className="input__container flex center">
                                            <button
                                             onClick={() =>{
                                                const newQtyTemp = qtyTemp - (selectedDetailsFinal?.qty_increments || 1);
                                                  if(newQtyTemp<0){
                                                    setQtyTemp(0);
                                                  }
                                                  else{
                                                setQtyTemp(newQtyTemp);
                                                  }
                                              UpdateTextQty(newQtyTemp, selectedDetailsFinal, setQty, setQtyTemp, getDeliveryDate, getApiCartOptions)

                                               
                                              }
                                            }
                                              aria-label="button"
                                            >
                                              -
                                            </button>

                                            <input className="text-qty" type="text" placeholder="0" style={{ width: "100%", zIndex: isCustomQty ? 1 : 0, position: "relative", border: "0",textAlign:"center" }}
                                              
                                             value={isCustomQty ? qtyTemp : ''}
                                            onChange={(e) => {
                                              let value = e.target.value;
                                              
                                              if (!isNaN(value)) {
                                                value = value.slice(0, 6);
                                                setQtyTemp(value);
                                              }
                                            }}
                                            // onChange={(e) => {
                                            //   let value = parseFloat(e.target.value);
                                        
                                            //   if (!isNaN(value)) {
                                            //     const increment = selectedDetailsFinal?.qty_increments || 1;
                                        
                                            //     // Adjust value to the nearest multiple of qty_increments
                                            //     const nearestMultiple = Math.round(value / increment) * increment;
                                        
                                            //     if (nearestMultiple >= 0) {
                                            //       setQtyTemp(nearestMultiple.toString().slice(0, 6)); // Update qtyTemp with nearest multiple
                                            //     }
                                            //   }
                                            // }}

                                            onKeyDown={(e) =>
                                              (e.key === 'Enter') && UpdateTextQty(qtyTemp, selectedDetailsFinal, setQty, setQtyTemp, getDeliveryDate, getApiCartOptions)
                                            }
                                            onBlur={() =>
                                              UpdateTextQty(qtyTemp, selectedDetailsFinal, setQty, setQtyTemp, getDeliveryDate, getApiCartOptions)
                                            }
                                          />
                                            {/* <button
                                              onClick={() =>{
                                                const newQtyTemp = qtyTemp + (selectedDetailsFinal?.qty_increments || 1);
  
                                                setQtyTemp(newQtyTemp);
                                               
                                              }
                                              
                                              }
                                              aria-label="button"
                                            >
                                              +
                                            </button> */}
                                            <button
                                             onClick={() =>{
                                                const newQtyTemp = qtyTemp + (selectedDetailsFinal?.qty_increments || 1);
                                                  if(newQtyTemp > 50000){
                                                    setQtyTemp(50000);
                                                  }
                                                  else{
                                                setQtyTemp(newQtyTemp);
                                                  }

                                              }
                                            }
                                              aria-label="button"
                                            >
                                              +
                                            </button>

                                          </div>

                                        <button aria-label="button" onClick={() => {
                                          if (selectedDetailsFinal?.tier_prices?.length) {
                                            setIsCustomQty(true)
                                          };
                                          const newQtyTemp = qtyTemp + (selectedDetailsFinal?.qty_increments || 1);
                                              if(newQtyTemp > 50000){
                                                setQtyTemp(50000);
                                              }
                                              else{
                                            setQtyTemp(newQtyTemp);
                                              }
                                          
 
                                          // if (selectedDetailsFinal?.qty_increments > 1 && isCustomQty) {
                                          //   setReqExpanded(false);
                                          // }
                                           UpdateTextQty(qtyTemp, selectedDetailsFinal, setQty, setQtyTemp, getDeliveryDate, getApiCartOptions);
                                          // setTimeout(() => {
                                          //   if (selectedDetailsFinal?.qty_increments > 1 && warningMessage == "") {
                                          //     setReqExpanded(false);
                                          //   }

                                          // })
                                        }}></button>
                                      </div>
                                    </div>
                                    {isCustomQty ? (
                                      // <React.Fragment>
                                      //   <div className="item-cell" data-label="Save"><i>{qtyTemp > 1 && selectedDetailsFinal?.tier_prices?.length ?
                                      //     `${Math.round(((((selectedDetailsFinal.tier_prices[0].price || 0) + qtyData.addOnPrice) -  (qtyData.price)) / ((selectedDetailsFinal.tier_prices[0].price || 0) + qtyData.addOnPrice)) * 100)}%`
                                      //     : '-'}</i></div>
                                      //   <div className="item-cell" data-label="Price">{`${euroCurrency (qtyData.price)}`}</div>
                                      //   <div className="item-cell" data-label="Total">{`${euroCurrency( (qtyData.price) * qty)}`}</div>
                                      // </React.Fragment>
                                      <React.Fragment>

                                        {/* <div className="item-cell" data-label="Save"><i>{qtyTemp > selectedDetailsFinal?.tier_prices?.[0]?.qty && selectedDetailsFinal?.tier_prices?.length ?
                                          `${Math.round(((((selectedDetailsFinal.tier_prices[0].price || 0) + qtyData.addOnPrice) - (qtymatch(qtyTemp, selectedDetailsFinal.tier_prices) || 0)) / ((selectedDetailsFinal.tier_prices[0].price || 0) + qtyData.addOnPrice)) * 100)}%`
                                          : '-'}</i></div> */}
                                        <div className="item-cell middle" data-label="Save">
                                          <i>
                                            {qtyTemp > selectedDetailsFinal?.tier_prices?.[0]?.qty && selectedDetailsFinal?.tier_prices?.length
                                              ? (() => {
                                                const priceDiff = Math.round(
                                                  ((((selectedDetailsFinal.tier_prices[0].price || 0) + qtyData.addOnPrice) -
                                                    (qtymatch(qtyTemp, selectedDetailsFinal.tier_prices) || 0)) /
                                                    ((selectedDetailsFinal.tier_prices[0].price || 0) + qtyData.addOnPrice)) * 100
                                                );
                                                return priceDiff === 0 ? '-' : `${priceDiff}%`;
                                              })()
                                              : '-'}
                                          </i>
                                        </div>

                                        <div className="item-cell middle" data-label="Price">{`${euroCurrency(qtymatch(qtyTemp, selectedDetailsFinal?.tier_prices?.length ? selectedDetailsFinal?.tier_prices : selectedDetailsFinal?.price) + qtyData.addOnPrice || selectedDetailsFinal?.price)}`}</div>
                                        <div className="item-cell middle" data-label="Total">{`${euroCurrency((qtymatch(qtyTemp, selectedDetailsFinal?.tier_prices?.length ? selectedDetailsFinal?.tier_prices : selectedDetailsFinal?.price) + qtyData.addOnPrice || selectedDetailsFinal?.price) * qtyTemp)}`}</div>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        <div className="item-cell flex middle" data-label="Save">Ander aantal</div>
                                        {/* <div className="item-cell" data-label="Save"><i>-</i></div> */}
                                        <div className="item-cell flex middle" data-label="Price">-</div>
                                        <div className="item-cell flex middle" data-label="Total">-&nbsp;</div>
                                      </React.Fragment>
                                    )}
                                  </div>
                                </div>
                                {isCustomQty  &&
                                    <div className='py-2'>
                                      <button aria-label="button" onClick={() => {
                                        const selectedD = { ...selectedData };
                                        setSelectedData(selectedD);
                                      setReqExpanded(true);
                                      setcustomQty(true)
                                      UpdateTextQty(qtyTemp, selectedDetailsFinal, setQty, setQtyTemp, getDeliveryDate, getApiCartOptions);
                                      if (selectedDetailsFinal?.tier_prices?.length) {
                                        setIsCustomQty(true)
                                      };
                                      
                                      }}
                                        className='contained sm mt-4  py-2 px-4 r-9 primary'
                                      >
                                        volgende
                                      </button>
                                    </div>
                                    }
                              </div>
                            </AccordionDetails>
                            : null}
                        </Accordion>
                      </React.Fragment>
                    )
                      : !isSample && key === "upload" && selectedDetails[key]?.hide !== true ? (
                        <React.Fragment key={`Fragment_upload`}>
                          <div className={`accordion${item}`} />
                          <Accordion  expanded={expanded === `${item}`} onChange={handleExpanded(`${item}`)} >
                            <VariantHeader id={`${item}`} name={`${allData[key]?.label}`} isError={(parseInt(expanded) > item && ((!(selectedData?.[key]?.[0]) && (!imagesDropbox?.length) && (textAreaData == "")))) || (expanded === `${item}` && expanded === errorOpenTab || reqExpandedUpload === false)} expanded={expanded === `${item}` || ((!(selectedData?.[key]?.length) && (!imagesDropbox?.length) && (textAreaData == "")))} label={selectedDetails[key]?.labels && selectedDetails[key].labels !== "Bestanden geupload" ? selectedDetails[key].labels : imagesDropbox?.length ? "Bestanden geupload" : ""} order={(item + 1 - (selectedDetails[key]?.reduseCount || 0))} completed={selectedData?.[key]?.length || imagesDropbox?.length || textAreaData !== ""} translate={translateData?.translations} />
                            <AccordionDetails>
                              <Suspense fallback={<CircularProgress />}>
                                <UploadImages
                                  customOptions={customOptions}
                                  setreqExpandedUpload={setreqExpandedUpload}
                                  textAreaData={textAreaData}
                                  setTextData={setTextData}
                                  isSample={isSample}
                                  deliveryData={deliveryData}
                                  dropboxFiles={dropboxFiles} setDropboxFiles={setDropboxFiles}
                                  imagesDropboxHome={imagesDropbox} setImagesDropboxHome={setImagesDropbox}
                                  openModel={openModelUpload} setOpenModel={setOpenModelUpload}
                                  data={data}
                                  selectedData={selectedData} setSelectedData={setSelectedData}
                                  selectedKey={key} allData={allData} imageCanvasTemplate={imageCanvasTemplate}
                                  stateUploadedPath={stateUploadedPath} setStateUploadedPath={setStateUploadedPath}
                                  expandNext={setReqExpanded}
                                  isUploadOpen={expanded === `${item}`}
                                />
                              </Suspense>
                            </AccordionDetails>
                          </Accordion>
                        </React.Fragment>
                      )
                        : null}
        {/* <div className={`accordion${item}`} /> */}

                  </React.Fragment>
                ))}
              </React.Fragment>
            ) : null}
          </div>
          {Object.keys(allData).map((key, item) => (
            <React.Fragment key={`alldata_${key}_${item}`}>
              {(((storeId === 1 && key === "qty" && expanded === `${item}`) && (selectedDetailsFinal?.tier_prices?.length && data?.settings?.allowed_sample === "1")) || (key === "qty" && isSample)) ? (
                <div className='sampleForm'>
                  <div className="content">
                    <div className="flex w-1/1 gap-3">
                      <div className="flex-0 checkbox">
                        <input type="checkbox" aria-label="checkbox" checked={isSample} readOnly />
                        <button aria-label="button" onClick={() => setIsSample(!isSample)}></button>
                      </div>
                      {sampleProductPrice?.condition_two ?
                        <div className="flex-1 flex col gap-2">
                          <h3>{data?.settings?.message2Heading}</h3>
                          <p>
                            {data?.settings?.message2Content}
                            <p className='refund-icon'>
                              <RefundIcon />
                              <b>
                                {data?.settings?.message2HighlightedText}
                              </b>
                            </p>
                            <span className='pointer' onClick={() => setOpenFreeSample(true)}>{data?.settings?.hyperlink_text}</span>
                          </p>
                        </div>
                        :
                        sampleProductPrice?.condtion_three ?
                          <div className="flex-1 flex col gap-2">
                            <h3>{data?.settings?.message3Heading}</h3>
                            <p>
                              {data?.settings?.message3Content}
                              <span className='pointer' onClick={() => setOpenFreeSample(true)}>{data?.settings?.hyperlink_text}</span>
                            </p>
                          </div> :
                          //condition one and if condition not satisfied it will render
                          <div className="flex-1 flex col gap-2">
                            <h3>{data?.settings?.message1Heading}</h3>
                            <p>
                              {data?.settings?.message1Content}
                              <span className='pointer' onClick={() => setOpenFreeSample(true)}>{data?.settings?.hyperlink_text}</span>
                            </p>
                            {/* <ol>
                          <li>-  Samples worden geleverd zonder opdruk</li>
                          <li>- Sample aanvraag is alleen mogelijk voor bedrijven</li>
                          <li>-  Samples kunnen niet worden geretourneerd</li>
                        </ol> */}
                          </div>
                      }
                    </div>
                  </div>
                </div>
              ) : (null)}
            </React.Fragment>
          ))}
        </div>

        {displayAfterRender &&
          <div className='flex col w-1/1 gap-6 pt-6'>
            {deliveryData && deliveryData ? (
              <>
    <div className={`deliveryTime ${isOutOfStock ? "deliverytime_red" : ""}`}>
                <div className="content ">
                    <div className="flex w-1/1 gap-3">
                      <div className="flex-0">
                        <div className="icon">
                          <AccessTimeIcon />
                        </div>
                      </div>
                      {isSample ? (
                        <div className="flex-1 flex col gap-2">
                          {/* commented for purpose */}
                          {/* <h3> Verstuurd na: ongeveer 1-3 werkdag(en)</h3> */}
                          {deliveryData?.text.includes("onbekend")?null:
                          <div className='flex middle'>
                          <h3 className='pb-2'>Verstuurd na: {selectedDetailsFinal.delivery ? selectedDetailsFinal.delivery : `ongeveer ${deliveryData?.working_days == 0 ? "zelfde" : deliveryData?.working_days}  werkdag(en)`}</h3>
                          <span onClick={() => setOpenModelDelivery(true)} className="ml-2 infoimgs relative pointer">
                            <InfoPdpIcon />
                          </span>
                        </div>
                          }
                          <p style={{ fontWeight: "300"}} dangerouslySetInnerHTML={{ __html: deliveryData?.text }}></p>
                        </div>
                      ) : (
                        <div className="flex-1 flex col gap-2">
                          {deliveryData?.text.includes("onbekend")?null:
                          <div className='flex middle'>
                          <h3 className='pb-2'>Verstuurd na: {selectedDetailsFinal.delivery ? selectedDetailsFinal.delivery : `ongeveer ${deliveryData?.working_days == 0 ? "zelfde" : deliveryData?.working_days}  werkdag(en)`}</h3>
                          <span onClick={() => setOpenModelDelivery(true)} className="ml-2 infoimgs relative pointer">
                            <InfoPdpIcon />
                          </span>
                        </div>
                          }
                          
                          <p style={{ fontWeight: "300"}} dangerouslySetInnerHTML={{ __html: deliveryData?.text }}></p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <DeliveryInfo isSample={isSample} deliveryData={deliveryData} openModel={openModelDelivery} setOpenModel={setOpenModelDelivery} data={data?.settings} />
              </>
            ) : null}
            <div className='flex col w-1/1 gap-3'>
              <Accordion expanded={expandPrice} onChange={() => null}>
                <AccordionSummary className='hide' aria-controls={`expandPrice-content"`} id={`expandPrice-header`}> </AccordionSummary>
                <AccordionDetails>
                  <div className='flex col w-1/1 md-flex md-row'>
                    <div className='flex-1'></div>
                    <div className='flex-2'>
                      <div className='priceDetails py-3 px-7'>
                        <div className="content">
                          <div className="flex w-1/1 gap-3">
                            {isSample
                              // && 
                              // ((((sampleProductPrice?.highest_tier * (isSample ? sampleQty : qty)) + selectedDetailsFinal.setup_costs) + (((sampleProductPrice * (isSample ? sampleQty : qty)) + selectedDetailsFinal.setup_costs) * selectedDetailsFinal.product_vat / 100)) < 2.50)
                              ? (
                                <table>
                                  <tbody>
                                  
                                    {isSample ? null
                                      : <tr>
                                        <td>Digitale drukproef</td>
                                        <td><b className='normal green'>Gratis</b></td>
                                      </tr>}
                                    {isSample ? null :
                                      <tr>
                                        <td>Instelkosten</td>
                                        <td>Gratis</td>
                                      </tr>}
                                    <tr>
                                      <td>Verzendkosten</td>
                                      <td>Gratis</td>
                                    </tr>
                                    <tr>
                                      <td><b>Totaal excl. BTW</b></td>
                                      <td><b>{sampleProductPrice?.condtion_one ? "Gratis"
                                        : sampleProductPrice?.condition_two ? `${euroCurrency(sampleProductPrice?.highest_tier)}`
                                          : sampleProductPrice?.condtion_three ? `${euroCurrency(sampleProductPrice?.highest_tier)}`
                                            : "Gratis"}</b></td>
                                    </tr>
                                    <tr>
                                      <td>BTW {sampleProductPrice?.condtion_one ? "0" : selectedDetailsFinal.product_vat}%</td>
                                      <td>{
                                        sampleProductPrice?.condtion_one ? `${euroCurrency(0)}`
                                          : sampleProductPrice?.condition_two ? `${euroCurrency((sampleProductPrice?.highest_tier) * selectedDetailsFinal.product_vat / 100)}`.trim()
                                            : sampleProductPrice?.condtion_three ? `${euroCurrency((sampleProductPrice?.highest_tier) * selectedDetailsFinal.product_vat / 100)}`.trim()
                                              : `${euroCurrency(0)}`
                                      }
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>Totaal incl. BTW</td>
                                      <td>
                                        {
                                          sampleProductPrice?.condtion_one ? "Gratis"
                                            : sampleProductPrice?.condition_two ? `${euroCurrency((sampleProductPrice?.highest_tier) + ((sampleProductPrice?.highest_tier) * selectedDetailsFinal.product_vat / 100)
                                            )}`.trim()
                                              : sampleProductPrice?.condtion_three ? `${euroCurrency((sampleProductPrice?.highest_tier) + ((sampleProductPrice?.highest_tier) * selectedDetailsFinal.product_vat / 100)
                                              )}`.trim()
                                                : "Gratis"
                                        }
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              ) : (
                                <table>
                                  <tbody>
                                  {isSample ? null :
                                      <tr>
                                        <td>Prijs per stuk</td>
                                        <td>{`(${qty}x) `}{euroCurrency(getPriceForQty(qty,selectedDetailsFinal?.tier_prices))}</td>
                                      </tr>
                                    }
                                    

                                    {isSample ? null :
                                      <tr>
                                        <td>Instelkosten</td>
                                        <td>{selectedDetailsFinal?.setup_costs ? `${euroCurrency(selectedDetailsFinal.setup_costs * (isCpkerLength ? isCpkerLength : 1)).trim()}` : <b className='normal green'>Gratis</b>}</td>

                                      </tr>}
                                      {isSample ? null :
                                      <tr>
                                        <td>Digitale drukproef</td>
                                        <td><b className='normal green'>Gratis</b></td>
                                      </tr>
                                    }

                                    {selectedDetailsFinal.change_costs ? (
                                      <tr>
                                        <td>Maatwisselkosten</td>
                                        <td>{`${euroCurrency(selectedDetailsFinal.change_costs)}`.trim()}</td>
                                      </tr>
                                    ) : null}
                                    <tr>
                                      <td>Verzendkosten</td>
                                      <td>{shippingCostsFree1 == true ?
                                        <b className='normal green'>Gratis</b> : <b className='normal green'>Zie winkelwagen</b>}</td>

                                    </tr>
                                    {selectedDetailsFinal?.product_cost_name ?
                                      <tr>
                                        <td>{selectedDetailsFinal?.product_cost_name}</td>
                                        <td>{`${euroCurrency(selectedDetailsFinal?.amount_per_piece === "1" ? qty * selectedDetailsFinal?.product_cost_value : selectedDetailsFinal?.product_cost_value)}`.trim()}</td>
                                      </tr> : ""}
                                    <tr>
                                      <td><b>Totaal excl. BTW</b></td>
                                      {isCustomQty ?
                                        <td><b>{`${euroCurrency(
                                          ((qtyData.price * (isSample ? sampleQty : qtyTemp)) + selectedDetailsFinal.setup_costs * (isCpkerLength ? isCpkerLength : 1) + selectedDetailsFinal.change_costs + (selectedDetailsFinal?.amount_per_piece === "1" ? qtyTemp * selectedDetailsFinal?.product_cost_value : selectedDetailsFinal?.product_cost_value))
                                        )}`.trim()}</b></td>
                                        :
                                        <td><b>{`${euroCurrency(
                                          ((qtyData.price * (isSample ? sampleQty : qty)) + selectedDetailsFinal.setup_costs * (isCpkerLength ? isCpkerLength : 1) + selectedDetailsFinal.change_costs + (selectedDetailsFinal?.amount_per_piece === "1" ? qty * selectedDetailsFinal?.product_cost_value : selectedDetailsFinal?.product_cost_value))
                                        )}`.trim()}</b></td>
                                      }


                                    </tr>
                                    <tr>
                                      <td>BTW {selectedDetailsFinal.product_vat} %</td>
                                      {isCustomQty ?
                                        <td>{`${euroCurrency((((qtyData.price * (isSample ? sampleQty : qtyTemp)) + selectedDetailsFinal.setup_costs * (isCpkerLength ? isCpkerLength : 1) + selectedDetailsFinal.change_costs + (selectedDetailsFinal?.amount_per_piece === "1" ? qtyTemp * selectedDetailsFinal?.product_cost_value : selectedDetailsFinal?.product_cost_value)) * selectedDetailsFinal.product_vat / 100))}`.trim()}</td>
                                        :
                                        <td>{`${euroCurrency((((qtyData.price * (isSample ? sampleQty : qty)) + selectedDetailsFinal.setup_costs * (isCpkerLength ? isCpkerLength : 1) + selectedDetailsFinal.change_costs + (selectedDetailsFinal?.amount_per_piece === "1" ? qty * selectedDetailsFinal?.product_cost_value : selectedDetailsFinal?.product_cost_value)) * selectedDetailsFinal.product_vat / 100))}`.trim()}</td>

                                      }
                                    </tr>
                                    <tr>
                                      <td>Totaal incl. BTW</td>
                                      {isCustomQty ?
                                        <td>{`${euroCurrency(
                                          ((qtyData.price * (isSample ? sampleQty : qtyTemp)) + selectedDetailsFinal.setup_costs * (isCpkerLength ? isCpkerLength : 1) + selectedDetailsFinal.change_costs + (selectedDetailsFinal?.amount_per_piece === "1" ? qtyTemp * selectedDetailsFinal?.product_cost_value : selectedDetailsFinal?.product_cost_value)) + (((qtyData.price * (isSample ? sampleQty : qtyTemp)) + selectedDetailsFinal.setup_costs + selectedDetailsFinal.change_costs + (selectedDetailsFinal?.amount_per_piece === "1" ? qtyTemp * selectedDetailsFinal?.product_cost_value : selectedDetailsFinal?.product_cost_value)) * selectedDetailsFinal.product_vat / 100)
                                        )}`.trim()}</td>
                                        :
                                        <td>{`${euroCurrency(
                                          ((qtyData.price * (isSample ? sampleQty : qty)) + selectedDetailsFinal.setup_costs * (isCpkerLength ? isCpkerLength : 1) + selectedDetailsFinal.change_costs + (selectedDetailsFinal?.amount_per_piece === "1" ? qty * selectedDetailsFinal?.product_cost_value : selectedDetailsFinal?.product_cost_value)) + (((qtyData.price * (isSample ? sampleQty : qty)) + selectedDetailsFinal.setup_costs * (isCpkerLength ? isCpkerLength : 1) + selectedDetailsFinal.change_costs + (selectedDetailsFinal?.amount_per_piece === "1" ? qty * selectedDetailsFinal?.product_cost_value : selectedDetailsFinal?.product_cost_value)) * selectedDetailsFinal.product_vat / 100)
                                        )}`.trim()}</td>
                                      }

                                    </tr>
                                  </tbody>
                                </table>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
              {isSample ? (
                <React.Fragment>
                  <div className='flex w-1/1 top-1 action'>
                    <div className='flex-1'></div>
                    <div className='flex-0 tr'>
                      <button  aria-label="button" className='text-nowrap fw-300' onClick={() => setExpandPrice(!expandPrice)}>{expandPrice ? "Verberg prijsdetails" : "Bekijk prijsdetails"}</button>
                    </div>
                  </div>
                  <div className='flex w-1/1 top-1 priceFinal'>
                    <div className='flex-1'>Totaal (excl. BTW)</div>
                    <div className='flex-0 tr'>{
                      sampleProductPrice?.condtion_one ? "Gratis"
                        : sampleProductPrice?.condition_two ?
                          `${euroCurrency(
                            (sampleProductPrice?.highest_tier)
                          )}`
                          : sampleProductPrice?.condtion_three ?
                            `${euroCurrency(
                              (sampleProductPrice?.highest_tier)
                            )}`
                            : "Gratis"

                    }</div>
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className='flex w-1/1 top-1 action'>
                    <div className='flex-1'></div>
                    <div className='flex-0 tr'>
                      <button aria-label="button" className='text-nowrap fw-300' onClick={() => setExpandPrice(!expandPrice)}>{expandPrice ? "Verberg prijsdetails" : "Bekijk prijsdetails"}</button>
                    </div>
                  </div>
                  <div className='flex w-1/1 top-1 priceFinal'>
                    <div className='flex-1'>Totaal (excl. BTW)</div>
                    {isCustomQty ?
                      <div className='flex-0 tr'>{`${euroCurrency(
                        ((qtyData.price * qtyTemp) + selectedDetailsFinal.setup_costs * (isCpkerLength ? isCpkerLength : 1) + selectedDetailsFinal.change_costs + (selectedDetailsFinal?.amount_per_piece === "1" ? qtyTemp * selectedDetailsFinal?.product_cost_value : selectedDetailsFinal?.product_cost_value))
                      )}`}</div>
                      :
                      // <div className='flex-0 tr'>{`${euroCurrency(
                      //   (((Math.ceil(qtyData.price * 100) / 100) * qty) + selectedDetailsFinal.setup_costs * (isCpkerLength ? isCpkerLength : 1) + selectedDetailsFinal.change_costs + (selectedDetailsFinal?.amount_per_piece === "1" ? qty * selectedDetailsFinal?.product_cost_value : selectedDetailsFinal?.product_cost_value))
                      // )}`}</div>
                      
                      <div className='flex-0 tr'>
                        {`${euroCurrency(
                        ((qtyData.price * (isSample ? sampleQty : qty)) + selectedDetailsFinal.setup_costs * (isCpkerLength ? isCpkerLength : 1) + selectedDetailsFinal.change_costs + (selectedDetailsFinal?.amount_per_piece === "1" ? qty * selectedDetailsFinal?.product_cost_value : selectedDetailsFinal?.product_cost_value))
                      )}`.trim()}
                      </div>
                    }
                  </div>
                </React.Fragment>
              )}
            </div>
            <Grow in={!!errorCart} direction="up" mountOnEnter unmountOnExit >
              <div className='alertBox error'>
                <div className="msg">{errorCartText || errorCart}</div>
              </div>
            </Grow>
            <div className="action__blocks pt-2 flex col gap-y-6">
              {isSample ? (
                <React.Fragment>
                  <Button

                    className={`fs-20 line-8 fw-700 r-9 py-5 px-5 ${isProcessing ? 'rotateUpdate' : ''}`}
                    fullWidth
                    disabled={isProcessing}
                    onClick={() => {
                      isLoggedUser ? customerAddToCart(1) : guestAddToCart(1);
                      triggerHotjarEvent('order_button_click');
                    }}
                    style={{ minHeight: 72 }}
                  >{isProcessing ? <AutorenewIcon /> : <>Vraag sample aan <span className='flex middle'><KeyboardArrowRightIcon /></span></>}
                  </Button>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Button
                    className={`fs-20 line-8 fw-700 r-9 py-5 px-5 ${isProcessing ? 'rotateUpdate' : ''}`}
                    fullWidth disabled={isProcessing || isProcessing1} style={{ minHeight: 72 }}
                    onClick={() => {
                      if (cmsError == "") {
                        setCmsError("false")
                      }
                      triggerHotjarEvent('order_button_click');
                      isLoggedUser ? customerAddToCart(1) : guestAddToCart(1);
                    }}
                  >
                    {isProcessing ? <AutorenewIcon /> : <>Bestellen <span className='flex middle'><KeyboardArrowRightIcon /></span></>}
                  </Button>
                  {storeId == 1 ?
                    <Button className={`fs-20 line-8 fw-700 r-9 py-5 px-5 ${isProcessing1 ? 'rotateUpdate' : ''}`}
                      fullWidth disabled={isProcessing || isProcessing1} style={{ minHeight: 72 }}
                      onClick={() => {
                        if (cmsError == "") {
                          setCmsError("false")
                        }
                        triggerHotjarEvent('quote_request_click');
                        isLoggedUser ? customerAddToCart(0) : guestAddToCart(0);
                      }}
                    >
                      {isProcessing1 ? <AutorenewIcon /> : "Vrijblijvende offerte"}
                    </Button> : ""
                  }

                </React.Fragment>
              )}
              <div className="share flex col lg-flex lg-row gap-3 center pb-2 lg-pb-0">
                {data?.settings?.stock_status ? <React.Fragment>
                  {
                    wishItem?.length ?
                      <div
                        className="flex middle gap-2 pointer center"
                        onClick={() => removeWishlist(baseURL, token, dispatch, wishItem?.[0]?.itemId, productSku, wishlistAddedData, customerId, storeId, () => { }, navigate, isSessionExpired)}
                      >
                        <FullWishlist />
                        <span className='fs-15 line-6'>Bewaard in favorieten</span>
                      </div> :
                      <div
                        className="flex middle gap-2 pointer center"
                        onClick={() => {
                          if (!isLoggedUser) {
                            dispatch(ACTION_OPEN__LOGIN(true));
                            dispatch(ACTION_OPEN__FORGOTPASSWORD(false));
                            dispatch(ACTION_WISHLISTPRODUCTID({ id: productId, sku: productSku }));
                            dispatch(ACTION_GET__URLTYPE('pdp'));
                          } else {

                            if (!wishItem?.length) {
                              addToWishlist__gtm(productSku, productName)
                              addWishList(defaultURL, dispatch, token, customerId, { id: productId, sku: productSku }, wishlistAddedData, storeId, navigate, isSessionExpired);
                            }
                          }
                        }}
                      >
                        <WishIcon className="pointer" color="#222" />
                        <span className='fs-15 line-6'>Toevoegen in favorieten</span>
                      </div>
                  }
                  <div className='arrow hide lg-block'></div>
                </React.Fragment> : null}
                <div className="flex middle gap-2 pointer center" onClick={() => setOpenCopyURLModel(true)}>
                  <CopyUrl />
                  <span className='fs-15 line-6'>Deel uw configuratie met unieke link</span>
                </div>
              </div>
              {
                wishlistResponse?.res?.data?.[0]?.message ? <p className='error'>{wishlistResponse?.res?.data?.[0]?.message}</p> : null
              }
              <div className="ups__content flex col gap-3">
                <div
                  className="flex middle space-between pointer"
                  onClick={() => {
                    uspHandler(productDetailsStaticData?.feature_content?.[0]?.menu?.tag_url);
                    // purposely commented
                    // setOpenModelUPS(true)
                    // setServicesDetailsData(data?.settings?.feature_content && data?.settings?.feature_content?.[2]?.menu ? data?.settings?.feature_content?.[2]?.menu : null)
                  }}
                  Fragment  >
                  <div className="flex middle gap-3 lg-gap-2">
                    <ValidSuccesArrow />
                    {
                      storeId === 1 ?
                        <span className='fs-15 line-6'>Ervaar onze <b className='fw-700'>snelle topservice!</b></span>
                        :
                        <span className='fs-15 line-6'><b className='fw-700'>High level service </b><span className='hide lg-inline-block'>met een vast contact persoon</span></span>
                    }
                  </div>
                  <KeyboardArrowRightIcon />
                </div>
                <div
                  className="flex middle space-between pointer"
                  onClick={() => {
                    uspHandler(productDetailsStaticData?.feature_content?.[1]?.menu?.tag_url);
                    // purposely commented
                    // setOpenModelUPS(true)
                    // setServicesDetailsData(data?.settings?.feature_content && data?.settings?.feature_content?.[1]?.menu ? data?.settings?.feature_content?.[1]?.menu : null)
                  }}
                >
                  <div className="flex middle gap-3 lg-gap-2">
                    <ValidSuccesArrow />
                    {
                      storeId === 1 ?
                        <span className='fs-15 line-6'><b className='fw-700'>Laagste prijsgarantie<b className='hide lg-inline'>:</b></b> <span className='hide lg-inline-block'>elders goedkoper? Wij matchen!</span></span>
                        :
                        <span className='fs-15 line-6'><b className='fw-700'>Beste prijs-kwaliteitverhouding</b></span>
                    }
                  </div>
                  <KeyboardArrowRightIcon />
                </div>
                <div
                  className="flex middle space-between pointer"
                  onClick={() => {
                    uspHandler(productDetailsStaticData?.feature_content?.[2]?.menu?.tag_url);
                    // purposely commented
                    // setOpenModelUPS(true)
                    // setServicesDetailsData(data?.settings?.feature_content && data?.settings?.feature_content?.[0]?.menu ? data?.settings?.feature_content?.[0]?.menu : null)
                  }}>
                  <div className="flex middle gap-3 lg-gap-2">
                    <ValidSuccesArrow />
                    {
                      storeId === 1 ?
                        <span className='fs-15 line-6'><b className='fw-700'>Gratis digitaal voorbeeld</b> <span className='hide lg-inline-block'>binnen enkele uren in uw e-mail!</span></span>
                        :
                        <span className='fs-15 line-6'><b className='fw-700'>Eigen productie</b> <span className='hide lg-inline-block'>dus snel geleverd</span></span>
                    }
                  </div>
                  <KeyboardArrowRightIcon />
                </div>
                <div
                  className="flex middle space-between pointer"
                  onClick={() => {
                    uspHandler(productDetailsStaticData?.feature_content?.[3]?.menu?.tag_url);
                    // purposely commented
                    // setOpenModelUPS(true)
                    // setServicesDetailsData(data?.settings?.feature_content && data?.settings?.feature_content?.[3]?.menu ? data?.settings?.feature_content?.[3]?.menu : null)
                  }}
                >
                  <div className="flex middle gap-3 lg-gap-2">
                    <ValidSuccesArrow />
                    {
                      storeId === 1 ?

                        <span className='fs-15 line-6'><b className='fw-700'>Veilig betalen</b> <span className='hide lg-inline-block'>o.a. iDeal, Bancontact, ook achteraf!</span></span>
                        :
                        <span className='fs-15 line-6'><b className='fw-700'>Achteraf betalen</b> <span className='hide lg-inline-block'>mogelijk</span></span>
                    }
                  </div>
                  <KeyboardArrowRightIcon />
                </div>
              </div>
            </div>
          </div>}
        <ModelNew
          from="top"
          hideScroll={false}
          zindex={11}
          open={openModelQty}
          shadow={true}
          setOpen={setOpenModelQty}
          className="pdp_quantity_popup"
        >
          <div className='qtyTable_popup'>
            <div className='flex py-2 px-4'>
              <div className=" tr flex left w-1/1 middle">
                <h2 className='fw-700 fs-20'>
                  Prijstabel
                </h2>
              </div>
              <div className="close__block tr flex right w-1/1">
                <CloseButton onClickFunction={() => setOpenModelQty(false)} />
              </div>
            </div>

            <div className="flex w-1/1 qtyTable1 ">
              <div className="table-head">
                <div className="table-row table-row-title">
                  <div className="item-cell">Aantal</div>
                  <div className="item-cell"><i>Bespaar</i></div>
                  <div className="item-cell">Stuksprijs</div>

                  {width <= 768 ?
                    <div className="item-cell">Totaalprijs</div>
                    :
                    <div className="item-cell">Totaal (excl. BTW)</div>
                  }
                </div>
              </div>
              <div className="table-body">
                {selectedDetailsFinal?.tier_prices?.length ?
                  selectedDetailsFinal.tier_prices.map((item, i) => (
                    <div key={`qty_${i}`} className={`relative table-row`} onClick={() => { setReqExpanded(true); setQty(item.qty) }}>
                      <div className="item-cell " data-label="Quantity">
                        <div className='flex middle gap-4'>
                          <span>{item?.qty}</span>
                        </div>
                      </div>
                      {
                        !item.hide && item.qty > 1 ?
                          <div className="item-cell" data-label="Save">
                            <i>
                              <>
                                {Math.round(((((selectedDetailsFinal.tier_prices[0].price || 0) + qtyData.addOnPrice) - ((item?.price
                                  || 0) + qtyData.addOnPrice)) / ((selectedDetailsFinal.tier_prices[0].price || 0) + qtyData.addOnPrice))
                                  * 100) || <span className='hypen'>-</span>}
                                <span>%</span>
                              </>
                            </i>
                          </div>
                          :
                          <div className="item-cell fs-12 flex middle" data-label="Save">
                            <i>
                              Ander aantal
                            </i>
                          </div>
                      }

                      <div className="item-cell flex middle" data-label="Price">{`${item.hide ? "-" : euroCurrency((item?.price || 0) +
                        qtyData.addOnPrice)}`}</div>
                      <div className="item-cell flex middle" data-label="Total">{`${item.hide ? "-" : euroCurrency(((item?.price || 0) +
                        qtyData.addOnPrice) * item.qty)}`}</div>
                    </div>
                  )) :
                  <div><div className="item-cell " style={{ height: 12 }}></div></div>}
              </div>

            </div>
          </div>
        </ModelNew>
      </div>
      {<ColorPicker
        selectedColorData={selectedColorData}
        selectedColorItem={selectedColorItem}
        setSelectedColorItem={setSelectedColorItem}
        openColorModel={openColorModel}
        setOpenColorModel={setOpenColorModel}
        data={[{ color_picker: translateData?.color_picker || { totalRecords: 0, items: [] } }]} />}
      {/* MODEL */}
      <ServicesDetails openModel={openModelUPS} setOpenModel={setOpenModelUPS} servicesDetailsData={servicesDetailsData} translate={translateData?.translations} />
      <InfoDetails openModel={openModelInfo} setOpenModel={setOpenModelInfo} servicesDetailsData={servicesDetailsData} translate={translateData?.translations} />
      <AccordionSidebar openModel={openFreeSample} setOpenModel={setOpenFreeSample} isSampleCalled={isSampleCalled} setIsSampleCalled={setIsSampleCalled} tagUrl="sample" />
      <AccordionSidebar openModel={openModelUPSNew} setOpenModel={setOpenModelUPSNew} isSampleCalled={isUpsCalled} setIsSampleCalled={setIsUpsCalled} tagUrl={tagUrl} />
    </React.Fragment>
  );
};
export default ProductVariant;