import React, { useContext, useEffect } from 'react';
import { SearchIcon, XIcon } from "Res/icons";
import IconButton from "@mui/material/IconButton";
import "./styles.scss";
import SearchSuggestion from '../SearchSuggestion';
import { useWindowSize } from 'Utilities';
import RenderContext from 'Context/RenderContext';

const Search = ({
    className = "", id = "searchInput",
    isFocused, setIsFocused, handlesetsearchkeyword,
    searchResultHandler, inputRef, searchKeyword,
    showSuggestion, setShowSuggestion, setOpenSearch,
    loadingSearch, searchData, openSearch
}) => {
    const [width] = useWindowSize();
    const { loadPreRender }=useContext(RenderContext);
    useEffect(() => {
        const htmlTag = document.getElementsByTagName("html").item(0);
        if (showSuggestion && (width < 768)) {
            htmlTag.classList.add("fixedHeader");
        } else {
            htmlTag.classList.remove("fixedHeader");
        }
        return () => htmlTag.classList.remove("fixedHeader");
    }, [showSuggestion]);
    return (
        <div
            className={`search__container ${className}`}
        >
            <div className={`w-1/1 ${showSuggestion && (width < 768) ? "zindex-20 openedmobile__suggestion" : ""}`} style={{ backgroundColor: "#fff" }}>
                <div className={`header__search px-4 lg-px-0  ${isFocused ? "focused" : ""}`}>
                    <input
                        type="text"
                        aria-label="Search"
                        className="searchbox pr-14 pl-6"
                        placeholder="Search your box"
                        onFocus={() => {
                            setIsFocused(true);
                        }}
                        onChange={(e) => handlesetsearchkeyword(e)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                searchResultHandler();
                            }
                        }}
                        id={id}
                        value={searchKeyword}
                    />
                    <IconButton
                        className="mr-2"
                        aria-label="search toggle"
                        onClick={() => {
                            setShowSuggestion(false);
                            setOpenSearch(false);
                        }}
                        onMouseUp={() => {
                            inputRef?.current?.focus();
                        }}
                    >
                        {showSuggestion ? (
                            <XIcon style={{ width: 14, height: 14 }} />
                        ) : (
                            <SearchIcon />
                        )}
                    </IconButton>
                </div>
            </div>
            {!loadPreRender &&
            <div className="lg-hide header__suggestion relative">
                <SearchSuggestion
                    hideScroll={false}
                    openModel={showSuggestion}
                    setOpenModel={setShowSuggestion}
                    loading={loadingSearch}
                    searchKeyword={searchKeyword}
                    searchData={searchData}
                    setShowSuggestion={setShowSuggestion}
                    showSuggestion={showSuggestion}
                    openSearch={openSearch}
                    setOpenSearch={setOpenSearch}
                />
            </div>}
        </div>
    )
}

export default Search;