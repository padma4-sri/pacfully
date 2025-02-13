import React, { useState, useEffect, memo,useContext } from "react";
import "./styles.scss";
import { Button, IconButton } from "@mui/material";
import Img from "Components/Img";
import { SkeletonLine } from "Components/Skeletion";
import { useWindowSize } from "Utilities";
import { CloseIconX } from "Res/icons";
import AdvancedLink from "Components/AdvancedLink";
import { CombinedContext } from "Context/CombinedContext";

const ContentData = ({ listItem }) => {
  return (
    <div className="flex gap-4 w-1/1 middle">
      {listItem?.menu_image_code && (
        <div className="img flex-0">
          <span className={`${listItem?.menu_image_code}`}></span>
        </div>
      )}
      <div style={{ color: listItem?.menu_color_code }} className="name flex-1">
        {listItem &&
          (listItem.names
            ? listItem.names
            : listItem.name
            ? listItem.name
            : "")}
      </div>

      {listItem?.menu_tag_title && (
        <div className="chip flex-0">
          <span
            style={{
              color: listItem?.menu_tag_text_color_code,
              backgroundColor: listItem?.menu_tag_gb_color_code,
            }}
          >
            {listItem?.menu_tag_title}
          </span>
        </div>
      )}
      {listItem?.sub && listItem?.sub.length ? (
        <div className="nav flex-0">
          <div className="right-arrow"></div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
const ButtonData = ({
  listItem,
  enableClick,
  isTrue,
  inListNo,
  menuId,
  setInListNo,
  setSelectedData,
  setOpen,
  setisBackdropLoading
}) => {
  const [mouseEnter, setMouseEnter] = useState(false);
  const [mouseOver, setMouseOver] = useState(0);
  useEffect(() => {
    setInListNo(mouseEnter && mouseOver === 0);
    if (
      mouseEnter &&
      mouseOver === 0 &&
      listItem?.sub &&
      listItem?.sub.length
    ) {
      setSelectedData(listItem);
    }
  }, [mouseEnter, mouseOver]);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (mouseOver > 0) setMouseOver(0);
    }, 100);
    return () => clearTimeout(delayDebounceFn);
  }, [mouseOver]);
  return (
    <Button
      sx={{ color: listItem?.menu_color_code }}
      className={`menuItem w-1/1 ${menuId !== inListNo && isTrue}`}
      onMouseMove={() => setMouseOver(mouseOver + 1)}
      onMouseOverCapture={() => !enableClick && setMouseEnter(true)}
      onMouseOutCapture={() => !enableClick && setMouseEnter(false)}
      onClick={() => {
        if (enableClick) {
          setSelectedData(listItem);
        } else if (enableClick) {
          setOpen(false);
        setisBackdropLoading(true);

        } else {
          setOpen(false);
        setisBackdropLoading(true);

        }
      }}
    >
      <ContentData listItem={listItem} enableClick={enableClick} />
    </Button>
  );
};
const NonButtonData = ({
  listItem,
  enableClick,
  isTrue,
  inListNo,
  menuId,
  setInListNo,
  setSelectedData,
  setOpen,
  setisBackdropLoading
}) => {
  const [mouseEnter, setMouseEnter] = useState(false);
  const [mouseOver, setMouseOver] = useState(0);
  useEffect(() => {
    setInListNo(true);
    if (mouseEnter && mouseOver === 0) {
      setSelectedData({});
    }
  }, [mouseEnter, mouseOver]);
  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (mouseOver > 0) setMouseOver(0);
    }, 100);
    return () => clearTimeout(delayDebounceFn);
  }, [mouseOver]);

  return (
    <Button
      style={{ color: listItem?.menu_color_code }}
      className={`menuItem w-1/1 ${menuId !== inListNo && isTrue}`}
      onClick={() => setOpen(false)}
      onMouseMove={() => setMouseOver(mouseOver + 1)}
      onMouseOverCapture={() => setMouseEnter(true)}
      onMouseOutCapture={() => setMouseEnter(false)}
    >
      <ContentData listItem={listItem} enableClick={enableClick} />
    </Button>
  );
};
const MenuList = ({
  setOpen,
  dataWithSub,
  enableClick = false,
  selectedData = {},
  setSelectedData = () => {},
  menuId = "0",
  inListNo,
  setInListNo,
  setisBackdropLoading
}) => {
  const data = dataWithSub?.main
    ? dataWithSub.main
    : dataWithSub?.sub
    ? dataWithSub.sub
    : [];
    
  const getLevel = (item) => {
    if (!item?.sub || item.sub.length === 0) {
      return "3";
    }
    return dataWithSub.sub ? "3" : "2";
  };

  return data?.length > 0 ? (
    data.map((listItem, index) => (
      <React.Fragment key={`menuList_${data?.id}${index}`}>

        {enableClick ? (
          listItem?.sub && listItem?.sub.length ? (
            <ButtonData
              listItem={listItem}
              setisBackdropLoading={setisBackdropLoading}
              enableClick={true}
              isTrue={selectedData?.id === listItem?.id}
              inListNo={inListNo}
              menuId={menuId}
              setInListNo={(active) => active && setInListNo(menuId)}
              setSelectedData={setSelectedData}
              setOpen={setOpen}
            />
          ) : (
            <AdvancedLink
              className="1"
              to={listItem?.url_key ? `/${listItem.url_key}` : ""}
              state={{
                categoryData: {
                  catId: listItem?.id,
                  catUrl: listItem?.url_key,
                },
                urlType: {
                  entityType: "category",
                  level: getLevel(listItem),
                  // level: dataWithSub.sub ? "3" : "2", commented for purpose
                  isChildExist: 1,
                },
              }}
            >
              <NonButtonData
                listItem={listItem}
                setisBackdropLoading={setisBackdropLoading}
                enableClick={enableClick}
                isTrue={selectedData?.id === listItem?.id}
                inListNo={inListNo}
                menuId={menuId}
                setInListNo={(active) => active && setInListNo(menuId)}
                setSelectedData={setSelectedData}
                setOpen={setOpen}
              />
            </AdvancedLink>
          )
        ) : listItem?.sub && listItem?.sub.length ? (
          <AdvancedLink
            className="3"
            to={listItem?.url_key ? `/${listItem.url_key}` : ""}
            state={{
              categoryData: {
                catId: listItem?.id,
                catUrl: listItem?.url_key,
              },
              urlType: {
                entityType: "category",
                level: getLevel(listItem),
                // level: dataWithSub.sub ? "3" : "2", commented for purpose
                isChildExist: 1,
              },
            }}
            onClick={() => setOpen(false)}
          >
            <ButtonData
            setisBackdropLoading={setisBackdropLoading}
              listItem={listItem}
              enableClick={false}
              isTrue={selectedData?.id === listItem?.id}
              inListNo={inListNo}
              menuId={menuId}
              setInListNo={(active) => active && setInListNo(menuId)}
              setSelectedData={setSelectedData}
              setOpen={setOpen}
            />
          </AdvancedLink>
        ) : (
          <AdvancedLink
            className="4"
            to={listItem?.url_key ? `/${listItem.url_key}` : ""}
            state={{
              categoryData: {
                catId: listItem?.id,
                catUrl: listItem?.url_key,
              },
              urlType: {
                entityType: "category",
                level: getLevel(listItem),
                // level: dataWithSub.sub ? "3" : "2", commented for purpose
                isChildExist: 1,
              },
            }}
          >
            <NonButtonData
              listItem={listItem}
              setisBackdropLoading={setisBackdropLoading}
              enableClick={true}
              isTrue={selectedData?.id === listItem?.id}
              inListNo={inListNo}
              menuId={menuId}
              setInListNo={(active) => active && setInListNo(menuId)}
              setSelectedData={setSelectedData}
              setOpen={setOpen}
            />
          </AdvancedLink>
        )}
      </React.Fragment>
    ))
  ) : (
    <></>
  );
};
const MenuListSkeleton = ({ dataWithSub }) => {
  const data = dataWithSub?.main
    ? dataWithSub.main
    : dataWithSub?.sub
    ? dataWithSub.sub
    : [];
  return ["", "", "", "", "", "", "", "", "", "", "", ""].map(
    (listItem, index) => (
      <Button
        key={`menuList_${data?.id}${index}`}
        className="menuItem w-1/1 relative"
      >
        <SkeletonLine
          height="34px"
          animation="pulse"
          style={{ margin: "8px 0px" }}
        />
      </Button>
    )
  );
};
const AllCategories = ({
  open,
  loading = false,
  setOpen = () => {},
  menuData = {},
}) => {
  const [width, height] = useWindowSize();
  const [data, setData] = useState({});
  const [enableClick, setEnableClick] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState({});
  const [selectedMenuStatus, setSelectedMenuStatus] = useState("");
  const [selectedSubMenu, setSelectedSubMenu] = useState({});
  const [selectedSubMenuStatus, setSelectedSubMenuStatus] = useState("");
  const [inListNo, setInListNo] = useState("");
  const {setisBackdropLoading} =useContext(CombinedContext)

  useEffect(() => {
    if (open) {
      setData(menuData);
      setSelectedMenu({});
      setSelectedMenuStatus("");
      setSelectedSubMenu({});
      setSelectedSubMenuStatus("");
    }
  }, [open, menuData]);

  const goBack = () => {
    setSelectedMenu({});
  };
  const goBack2 = () => {
    setSelectedSubMenu({});
  };

  useEffect(() => {
    if (selectedSubMenuStatus !== "") setSelectedSubMenuStatus("closing");
    if (selectedMenu?.sub) setSelectedMenuStatus("opening");
    else setSelectedMenuStatus("closing");
    setSelectedSubMenu({});
    setTimeout(() => {
      if (selectedMenu?.sub) setSelectedMenuStatus("open");
      else setSelectedMenuStatus("");
      if (selectedSubMenuStatus !== "") setSelectedSubMenuStatus("");
    }, 300);
  }, [selectedMenu]);

  useEffect(() => {
    if (selectedSubMenu?.sub) setSelectedSubMenuStatus("opening");
    else if (selectedSubMenuStatus !== "") setSelectedSubMenuStatus("closing");
    setTimeout(() => {
      if (selectedSubMenu?.sub) setSelectedSubMenuStatus("open");
      else if (selectedSubMenuStatus !== "") setSelectedSubMenuStatus("");
    }, 300);
  }, [selectedSubMenu]);

  useEffect(() => {
    setEnableClick(width < 1025);
  }, [width, height]);

  return (
    <div className={`megamenu w-1/1 h-1/1 flex gap-0`}>
      <div
        className={`menuCol main w-1/1`}
        onMouseEnter={() => setInListNo("0")}
      >
        <div className="menuContent w-1/1 h-1/1 overflow-hidden">
          <div className="w-1/1 h-1/1 flex col gap-1">
            <button className="close" onClick={() => setOpen(false)} aria-label="button">
              <CloseIconX />
            </button>
            <div className="head pt-9 flex-0">
              <h3>Categorieën</h3>
            </div>
            <div className="list flex-1 flex w-1/1 h-1/1 overflow-hidden">
              <div className="menuList w-1/1 flex col overflow-hidden overflow-y-auto">
                {loading ? (
                  <MenuListSkeleton dataWithSub={data} />
                ) : (
                  <MenuList
                  setisBackdropLoading={setisBackdropLoading}
                    setOpen={setOpen}
                    enableClick={enableClick}
                    dataWithSub={data}
                    imgData={""}
                    selectedData={selectedMenu}
                    setSelectedData={setSelectedMenu}
                    menuId={"0"}
                    inListNo={inListNo}
                    setInListNo={setInListNo}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`menuCol w-1/1 ${Boolean(
          selectedMenu?.sub
        )} ${selectedMenuStatus}`}
        onMouseEnter={() => setInListNo("1")}
      >
        <div className="menuContent w-1/1 h-1/1 overflow-hidden">
          <div className="w-1/1 h-1/1 flex col gap-1">
            <IconButton aria-label="back" onClick={() => goBack()} className="backIcon xl-hide">
              <svg
                // aria-hidden="true"
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                  fill="#222"
                />
              </svg>
            </IconButton>
            <div className="head pt-9 flex-0">
              <h3>{selectedMenu?.names ? selectedMenu?.names : ""}</h3>
            </div>
            <div className="list flex-1 flex w-1/1 h-1/1 overflow-hidden">
              <div className="menuList w-1/1 flex col overflow-hidden overflow-y-auto">
                <MenuList
                setisBackdropLoading={setisBackdropLoading}
                  setOpen={setOpen}
                  enableClick={enableClick}
                  dataWithSub={selectedMenu}
                  imgData={""}
                  selectedData={selectedSubMenu}
                  setSelectedData={setSelectedSubMenu}
                  backData={true}
                  menuId={"1"}
                  inListNo={inListNo}
                  setInListNo={setInListNo}
                />
              </div>
            </div>
            {selectedMenu?.menu_image ? (
              <div
                className="menu_image flex-0 relative flex center middle px-8"
                style={{ maxWidth: 350 }}
              >
                <Img
                  src={selectedMenu?.menu_image}
                  type="img"
                  alt={selectedMenu?.names ? selectedMenu.names : ""}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div
        className={`menuCol w-1/1 ${Boolean(
          selectedSubMenu?.sub
        )} ${selectedSubMenuStatus}`}
        onMouseEnter={() => setInListNo("2")}
      >
        <div className="menuContent w-1/1 h-1/1 overflow-hidden">
          <div className="w-1/1 h-1/1 flex col gap-1">
            <IconButton onClick={() => goBack2()} aria-label="back" className="backIcon xl-hide">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
              >
                <path
                  d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
                  fill="#222"
                />
              </svg>
            </IconButton>
            <div className="head pt-9 flex-0">
              <h3>
                {selectedSubMenu?.names
                  ? selectedSubMenu.names
                  : selectedSubMenu?.name
                  ? selectedSubMenu.name
                  : ""}
              </h3>
            </div>
            <div className="list flex-1 flex w-1/1 h-1/1 overflow-hidden">
              <div className="menuList w-1/1 flex col overflow-hidden overflow-y-auto">
                <MenuList
                setisBackdropLoading={setisBackdropLoading}
                  setOpen={setOpen}
                  enableClick={enableClick}
                  dataWithSub={selectedSubMenu}
                  imgData={""}
                  menuId={"2"}
                  inListNo={inListNo}
                  setInListNo={setInListNo}
                />
              </div>
            </div>
            {selectedSubMenu?.menu_image ? (
              <div
                className="menu_image flex-0 relative flex center middle px-8"
                style={{ maxWidth: 350 }}
              >
                <Img
                  src={selectedSubMenu?.menu_image}
                  type="img"
                  alt={
                    selectedSubMenu?.names
                      ? selectedSubMenu.names
                      : selectedSubMenu?.name
                      ? selectedSubMenu.name
                      : ""
                  }
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(AllCategories);
