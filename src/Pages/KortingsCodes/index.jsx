import React, { memo, useContext, useCallback } from 'react';
import DomainContext from "Context/DomainContext";
import "./style.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useState } from "react";
import { Tooltip } from "@mui/material";
import useWindowSize from "./windowsize";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Breadcrumb from "Components/Breadcrumb";
import { useEffectOnce } from 'Components/Hooks/useEffectOnce';
import { APIQueryPost } from 'APIMethods/API';
import useScrollToTop from 'Components/Hooks/useScrollToTop';
import Seo from 'Components/Seo/Seo';
import { SkeletonLoader } from 'Components/Skeletion';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const breadCrumbData = [{
  categoryName: "Kortingscodes",
  urlKey: "",
  catId: "",
}];

const KortingsCodes = () => {
  useScrollToTop();
  const { defaultURL, storeId } = useContext(DomainContext);
  const [tooltipState, setTooltipState] = useState({});
  const [infonewtooltipopen, infonewtooltipsetOpen] = React.useState(false);
  const [infotooltipTitle, setinfoTooltipTitle] = React.useState("Kopiëren");
  const handleinfoTooltipOpen = (code) => {
  infonewtooltipsetOpen(true);
  setinfoTooltipTitle("Gekopieerd");
  copyCodeToClipboard(code)
};

const handleinfoTooltipClose = () => {
  infonewtooltipsetOpen(false);
  // setinfoTooltipTitle("Kopiëren");
};
  //copy text
  const copyCodeToClipboard = (code) => {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      // Try using the Clipboard API
      navigator.clipboard.writeText(code)
        .then(() => {
          setCopied(true);
          setCopiedCode(code);
          setTimeout(() => {
            setCopied(false);
            handleinfoTooltipClose();
            setCopiedCode("");
          }, 1500);
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
          fallbackCopyText(code); // Use fallback in case of an error
        });
    } else {
      // Fallback for unsupported browsers
      fallbackCopyText(code);
    }
  };
  
  // Fallback method using textarea
  const fallbackCopyText = (code) => {
    const textArea = document.createElement("textarea");
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setCopiedCode(code);
        setTimeout(() => {
          setCopied(false);
          handleinfoTooltipClose();
          setCopiedCode("");
        }, 1500);
      } else {
        console.error('Fallback: Copying text command was unsuccessful');
      }
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
  
    document.body.removeChild(textArea);
  };
  
  
const handleTooltipOpen = (code) => {
  setTooltipState((prevState) => ({
    ...prevState,
    [code]: {
      open: true,
      title: "Gekopieerd",
    },
  }));
  copyCodeToClipboard(code);

  setTimeout(() => {
    handleTooltipClose(code);
  }, 1000);

};

const handleTooltipClose = (code) => {
  setTooltipState((prevState) => ({
    ...prevState,
    [code]: {
      open: false,
      title: prevState[code]?.title || "Kopiëren",
    },
  }));
};



  //open popup
  const [open, setOpen] = useState(false);

  //popupdata
  const [popupData, setPopupData] = useState(null);

  //copied
  const [copied, setCopied] = useState(false);

  //copied text
  const [copiedCode, setCopiedCode] = useState("");

  //get window size
  const windowSize = useWindowSize();

  //coupen details
  const [coupenCode, setCoupenCOde] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleClickOpen = (data) => {
    setOpen(true);
    setPopupData(data);
  };

  const handleClose = () => {
    setOpen(false);
  }
 
  //commented for purpose
  // const closeModal = (e) => {
  //   if (typeof handleClose == 'function') {
  //     handleClose();
  //   }
  // };

  const options = {
    isLoader: true,
    loaderAction: (bool) => setLoading(bool),
    setGetResponseData: (resData) => {
      setCoupenCOde(resData?.data);
    },
    axiosData: {
      url: `${defaultURL}/coupen/details`,
      paramsData: {
        storeId: storeId
      }
    },
  };

  // render once
  useEffectOnce(() => {
    APIQueryPost(options);
  });

  return (
    <>
      <Seo
        metaTitle={coupenCode?.[0]?.seo?.metaTitle}
        metaDescription={coupenCode?.[0]?.seo?.metaDescription}
        metaKeywords={coupenCode?.[0]?.seo?.metaKeywords}
      />
      <div className="pt-4">
        <Breadcrumb data={breadCrumbData} />
      </div>

      <div className="kortingscode container px-4">

        <h1 className="heading fs-32 fw-700 pt-8">Kortingscodes</h1>

        <p className="content fs-15 py-5 line-7">
          Een overzicht van kortingscodes en actiecodes bij Promofit vindt u
          hieronder. De codes zijn eenmalig geldig op een nieuwe online
          bestelling of offerte aanvraag, niet met terugwerkende kracht geldig
          op lopende bestellingen/aanvragen. Hou deze pagina in de gaten om op
          de hoogte te blijven van nieuwe actiecodes. Schrijf in voor onze
          nieuwsbrief of volg ons op onze socials voor meer kortingscodes!
          <br />
          <br />
          De kortingscodes zijn niet van toepassing op BTW, verzendkosten en
          zijn niet geldig op beursmaterialen en buitenreclame.
        </p>

        <TableContainer
          className="tableContainer"
          component={Paper}
          style={{ boxShadow: "none" }}
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell className="tablecell fw-bold w-1/4 fs-20 tl tableResKorting" style={{ paddingLeft: "0px" }}>
                  Korting
                </TableCell>
                <TableCell className="tablecell fw-bold w-1/4 fs-20 tl tableResCode">
                  Code
                </TableCell>
                {windowSize.width > 640 && (
                  <TableCell className="tablecell fw-bold w-1/4 fs-20 tl">
                    Voorwaarden
                  </TableCell>
                )}

                {windowSize.width > 640 && (
                  <TableCell
                    style={{ textAlignLast: "center" }}
                    className="tablecell fw-bold w-1/4 fs-20 tl"
                  >
                    Geldigheid
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                loading ?
                  ['', '', '', '', '', '', '', '', '', '', '', '', '']?.map((row, index) => (
                    <TableRow
                      key={`TableBody_${row.name}_${index}`}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      style={{ verticalAlign: "top" }}
                    >
                      <TableCell
                        style={{ paddingLeft: "0px" }}
                        className="tabledata tl"
                        colSpan={4}
                      >
                        <SkeletonLoader height='100px' />
                      </TableCell>
                    </TableRow>
                  ))
                  :
                  coupenCode?.[1]?.coupenCode?.map((row, index) => (
                    <TableRow
                      key={`TableBody_${row.name}_${index}`}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      style={{ verticalAlign: "top" }}
                    >
                      <TableCell
                        style={{ opacity: row.is_active === "1" ? 1 : 0.3, paddingLeft: "0px" }}
                        className="tabledata tl"
                        align="right"
                      >
                        {row.name}
                      </TableCell>
                      <TableCell className="tabledata tl" align="right">
                        <div className='flex relative gap-5 space-between'>
                          <p style={{ opacity: row.is_active === "1" ? 1 : 0.3 }}>
                            {row.coupon_code}
                          </p>

                          <div className="iconParent flex middle gap-2">
                          <div>
  {windowSize.width <= 640 ? (
    <Tooltip
      PopperProps={{
        disablePortal: true,
      }}
      onClose={() => handleTooltipClose(row.coupon_code)} 
      open={tooltipState[row.coupon_code]?.open || false}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      title={tooltipState[row.coupon_code]?.title || "Kopiëren"}
      arrow
    >
      <ContentCopyIcon
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleTooltipOpen(row.coupon_code);
        }}
        onClick={(e) => {
          e.preventDefault();
          handleTooltipOpen(row.coupon_code);
        }}
        style={{
          cursor: "pointer",
          pointerEvents: row.is_active === "1" ? "all" : "none",
          opacity: row.is_active === "1" ? 1 : 0.3,
        }}
      />
    </Tooltip>
  ) : (
    <Tooltip
      title={copied && copiedCode === row.coupon_code ? "Gekopieerd" : "Kopiëren"}
      arrow
    >
      <ContentCopyIcon
        className="ContentCopyIcon"
        style={{
          cursor: "pointer",
          pointerEvents: row.is_active === "1" ? "all" : "none",
          opacity: row.is_active === "1" ? 1 : 0.3,
        }}
        onClick={() => {
          copyCodeToClipboard(row.coupon_code);
        }}
      />
    </Tooltip>
  )}

  {windowSize.width <= 640 && (
    <Tooltip className="infoIcon" title="info" arrow>
      <InfoOutlinedIcon
        className="InfoOutlinedIcon"
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleClickOpen(row);
        }}
        onClick={() => handleClickOpen(row)}
        style={{
          cursor: "pointer",
        }}
      />
    </Tooltip>
  )}
</div>
                          </div>
                        </div>
                      </TableCell>
                      {windowSize.width > 640 && (
                        <TableCell
                          style={{ opacity: row.is_active === "1" ? 1 : 0.3 }}
                          className="tabledata tl"
                          align="right"
                        >
                          {row.description}
                        </TableCell>
                      )}
                      {windowSize.width > 640 && (
                        <TableCell
                          className="tabledata tl"
                          style={{ textAlignLast: "center" }}
                          align="right"
                        >
                          {row.is_active === "1" ? (
                            <button className="fs-15 active_true" aria-label="button">Actief</button>
                          ) : (
                            <button className="fs-15 active_false" aria-label="button">Verlopen</button>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </div >

      <BootstrapDialog
        className="BootstrapDialog"
        style={{ borderRadius: "25px" }}
        aria-labelledby="customized-dialog-title"
        open={open}
        onClose={(_, reason) => {
          if (reason === "backdropClick") {
            handleClose(); 
          }
        }}
      >
        <IconButton
          aria-label="close"
         onClick={handleClose}
         onClose={handleClose}
         role="button"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            WebkitTapHighlightColor: 'transparent', 
            touchAction: 'manipulation',
            cursor: 'auto',
            zIndex: 1000,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent
          style={{ paddingLeft: "20px", paddingRight: "20px", paddingTop: "25px", paddingBottom: "25px" }}
          className="DialogContentParent gap-y-7 flex col"
          dividers
          onClick={(e) => e.stopPropagation()}
        >
          <div>
            <h4 className="popup_heading fw-bold fs-20">Korting</h4>
            <p className="popup_content fs-15">{popupData?.name}</p>
          </div>
          <div>
            <h4 className="popup_heading fw-bold">Code</h4>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <p className="popup_content fs-15">{popupData?.coupon_code}</p>


              {/* <Tooltip
                title={
                  copied && copiedCode === popupData?.coupon_code ? "Gekopieerd" : "Kopiëren"
                }
                arrow
              >
                <ContentCopyIcon
                  style={{
                    cursor: "pointer",
                    pointerEvents: `${popupData?.is_active === '1' ? "all" : "none"}`,
                    opacity: `${popupData?.is_active === '1' ? "1" : "0.3"}`
                  }}
                  onClick={() => copyCodeToClipboard(popupData?.coupon_code)}
                />
              </Tooltip> */}
              <Tooltip
               PopperProps={{
                            disablePortal: true,
                          }}
                // title={
                //   copied && copiedCode === popupData?.coupon_code ? "Gekopieerd" : "Kopiëren"
                // }
                open={infonewtooltipopen}
                title={infotooltipTitle}
                disableFocusListener
                disableHoverListener
               disableTouchListener
                arrow
              >
                <ContentCopyIcon
                  style={{
                    cursor: "pointer",
                    pointerEvents: `${popupData?.is_active === '1' ? "all" : "none"}`,
                    opacity: `${popupData?.is_active === '1' ? "1" : "0.3"}`
                  }}
                  onClick={() => handleinfoTooltipOpen(popupData?.coupon_code)}
                />
              </Tooltip>
            </div>
          </div>
          <div>
            <h4 className="popup_heading fw-bold">Voorwaarden</h4>
            <p className="popup_content fs-15">{popupData?.description}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <h4 className="popup_heading fw-bold">Geldigheid</h4>
            {popupData?.is_active === "1" ? (
              <button className="active_true" style={{ height: "fit-content" }} aria-label="button">
                Actief
              </button>
            ) : (
              <button
                className="active_false"
                style={{ height: "fit-content" }}
                aria-label="button"
              >
                Verlopen
              </button>
            )}
          </div>
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default memo(KortingsCodes);
