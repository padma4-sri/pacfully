import React, { useState,useEffect,useContext } from 'react';
import { Dialog, useMediaQuery, useTheme } from '@mui/material';
import Button from 'Components/Common/Button';
import { CloseIconX } from "Res/icons";
import "./styles.scss";
import DomainContext from "Context/DomainContext";
import { ACTION__COOKIE_VALUE } from 'Store/action';
import { useDispatch } from "react-redux";

const Institutions = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [infoDialog, setInfoDialog] = useState(null);
  const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));
  const [toggles, setToggles] = useState({
    essential:true,
    marketing: true,
    analytics: true,
  });


   // Dialog style configuration
   const dialogStyle = {
    '& .MuiDialog-paper': {
      margin: '32px',
      width: '100%',
      maxHeight: 'calc(100% - 64px)',
      borderRadius: '8px',
      overflow: 'auto',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {  
        display: 'none'
      },
      '@supports (-moz-appearance:none)': {
        margin: '32px 20px',
        position: 'relative',
      }
    },
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }
  };
  
  const handleToggle = (key) => {
    setToggles((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const handleInstellingen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleInfoClose = () => {
    setInfoDialog(null); 
  };
  const options = [
    {
      label: 'Essentiële',
      key: 'essential',
      message: 'Deze noodzakelijk cookies zorgen ervoor dat onze website goed werkt. Het zorgt er bijvoorbeeld voor dat je ingelogd blijft met je eigen gegevens en dat de producten in je winkelwagen zichtbaar blijven.',
      disabled: true,
      tableContents: {
        headings: ['Cookie naam', 'Cookie Omschrijving'],
        rows: [
          ['PHPSESSID', 'Houdt gebruikerssessiestatus voor alle pagina aanvragen bij.'], // Removed 2nd, 4th, and 5th items
          ['private_content_version', 'Voegt een willekeurig nummer en huidige tijd toe aan de pagina om zo te voorkomen dat gegevens lokaal worden opgeslagen.'],
          ['persistent_shopping_cart', 'Een link naar informatie over uw winkelwagen, en uw bestelgeschiedenis indien u van deze optie gebruik gemaakt hebt.'],
          ['form_key', 'Een veiligheidsmaatregel welke een willekeurig algoritme toevoegt aan formulieren om zo te beschermen tegen CSRF.'],
          ['store', 'Houdt bij welk winkelaanzicht is gekozen door de bezoeker.'],
          ['login_redirect', 'Behoudt de bestemmingspagina waarnaar de klant aan het navigeren was voordat hij werd gevraagd om in te loggen.'],
          ['mage-messages', 'Volgt foutmeldingen en andere meldingen die aan de gebruiker worden getoond, zoals het toestemmingsbericht voor cookies, en diverse foutmeldingen.'],
          ['mage-cache-storage', 'Lokale opslag van bezoekerspecifieke inhoud die e-commerce functies mogelijk maakt.'],
          ['mage-cache-storage-section-invalidation', 'Forceert lokale opslag van specifieke contentsecties die ongeldig moeten worden gemaakt.'],
          ['mage-cache-sessid', 'De waarde van deze cookie activeert het opschonen van lokale cache-opslag.'],
          ['product_data_storage', 'Slaat configuratie op voor productgegevens gerelateerd aan recent bekeken / vergeleken producten.'],
          ['user_allowed_save_cookie', 'Geeft aan of de huidige gebruiker akkoord gaat met het gebruik van cookies.'],
          ['mage-translation-storage', 'Slaat vertaalde inhoud op op verzoek van de klant.'],
          ['mage-translation-file-version', 'Opslag van lokale vertalingen.'],
        ],
      },
    },
    {
      label: 'Marketing',
      key: 'marketing',
      message: 'Marketing cookies worden gebruikt voor marketingdoeleinden, zoals aanbiedingen, nieuwsbrief voorkeuren en advertenties. Ze zorgen ervoor dat je alleen relevante en gepersonaliseerde aanbiedingen te zien krijgt.',
      disabled: false,
      tableContents: {
        headings: ['Cookie naam', 'Cookie Omschrijving'],
        rows: [
          ['section_data_ids', 'Opslag van persoonlijke informatie van winkelgerelateerde acties, bijvoorbeeld voor het tonen een verlanglijst of afreken informatie.'], // Removed 2nd, 4th, and 5th items
          ['recently_viewed_product', 'Bewaart product-ID\'s van recent bekeken producten voor eenvoudige navigatie.'],
          ['recently_viewed_product_previous', 'Bewaart product-ID\'s van recent eerder bekeken producten voor eenvoudige navigatie.'],
          ['recently_compared_product', 'Slaat product-ID\'s op van recentelijk vergeleken producten.'],
          ['recently_compared_product_previous', 'Bewaart product-ID\'s van eerder vergeleken producten voor eenvoudige navigatie.'],
        ],
      },
    },
    {
      label: 'Google Analytics',
      key: 'analytics',
      message: 'Deze cookies worden gebruikt om bezoekersstatistieken te meten op basis van anonieme data, zodat we fouten op onze website kunnen ontdekken en de gebruiksvriendelijkheid van de site kunnen verbeteren.',
      disabled: false,
      tableContents: {
        headings: ['Cookie naam', 'Cookie Omschrijving'],
        rows: [
          ['_ga', 'Wordt gebruikt om gebruikers te identificeren.'], // Removed 2nd, 4th, and 5th items
          ['_gid', 'Wordt gebruikt om gebruikers te identificeren.'],
          ['_gat', 'Wordt gebruikt om de verzoeksnelheid te bepalen.'],
        ],
      },
    },
  ];
  
  
  
const handleSubmit=()=>{
  setOpen(false);
  if(toggles?.marketing){
    dispatch(ACTION__COOKIE_VALUE("marketing"));
  }
  if(toggles?.analytics){
    dispatch(ACTION__COOKIE_VALUE("analytics"));
  }
  if(toggles?.analytics && toggles?.marketing){
    dispatch(ACTION__COOKIE_VALUE("granted"));
  }
  if(!toggles?.analytics && !toggles?.marketing){
    dispatch(ACTION__COOKIE_VALUE("denied"));
  }
}
  return (
    <React.Fragment>
      <Button
        onClick={handleInstellingen}
        className="fs-15  py-1 line-8 fw-700 r-8 Instellingen_button "
      >
        Instellingen
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        maxWidth="md"
        className='institutions_dialog'
        sx={dialogStyle}    
          >
        <div className='insititutions_parent p-8' >
          <div className="closeButton flex right pb-4">
            <button className="close__icon" aria-label="button" onClick={()=>{
              handleClose();
              handleSubmit()
            }} sx={{ padding: 0 }}>
              <CloseIconX />
            </button>
          </div>
          <div>
            <p className='fs-16'>Selecteer en accepteer uw cookiegroep</p>
            {options.map((option) => (
              <div key={option.key}>
                <div className='flex space-between py-4'>
                  <p className='fw-600 fs-16'>{option.label}</p>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      className="toggle-switch-checkbox"
                      id={`toggle-switch-${option.key}`}
                      checked={toggles[option.key]}
                      onChange={() => handleToggle(option.key)}
                      disabled={option.disabled}
                      aria-label="checkbox"
                    />
                    <label className="toggle-switch-label" htmlFor={`toggle-switch-${option.key}`}>
                      <span className={`toggle-switch-inner ${option?.disabled ? "disabled" : ""}`} />
                      <span className="toggle-switch-switch" />
                    </label>
                  </div>
                </div>
                <p className='py-2 fs-15'>{option.message}</p>
                <a 
                  className='more_info fs-15' 
                  onClick={() => setInfoDialog(option.key)}
                >
                  Meer informatie
                </a>
              </div>
            ))}
          </div>
          <div className='flex center py-8'>
            <Button
              onClick={handleSubmit}
              className="fs-15 px-5 py-1 line-8 fw-700 r-8 w-1/1 secondary"
            >
             Selectie toestaan
            </Button>
          </div>
        </div>
      </Dialog>

      {options.map((option) => (
        <Dialog
          key={option.key}
          open={infoDialog === option.key}
          onClose={handleInfoClose}
          maxWidth="lg"
        >
          <div className='p-8'>
            <div className="closeButton flex right pb-4">
              <button className="close__icon" aria-label="button" onClick={handleInfoClose} sx={{ padding: 0 }}>
                <CloseIconX />
              </button>
            </div>
            <div className='fs-16'>
              <p className='fs-15  pb-4'>{option.message}</p>
              <table className='table-contents w-1/1'>
                <thead>
                  <tr>
                    {option.tableContents.headings.map((heading, index) => (
                      <th key={index} className='pr-4'>{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {option.tableContents.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((data, cellIndex) => (
                        <td key={cellIndex}>{data}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='flex center py-8'>
              <Button
                onClick={handleInfoClose}
                className="fs-15 px-5 py-1 line-8 fw-700 r-8 w-1/1 secondary"
              >
                Opslaan
              </Button>
            </div>
          </div>
        </Dialog>
      ))}
    </React.Fragment>
  );
};

export default Institutions;
