import React from "react";
import "./styles.scss";
import CloseButton from "../../../CloseButton/index";
import ModelNew from "Components/Model/ModelNew";

const UploadInfo = ({ openModel, setOpenModel,data }) => {
  const dataBlock = (
    <div className="upload__info w-1/1 h-1/1 p-5 xl-p-7 overflow-hidden overflow-y-auto">
      <div className="flex right">
        <CloseButton onClickFunction={() => setOpenModel(false)} />
      </div>
      
      {/* <div 
      dangerouslySetInnerHTML={{ __html: data?.fil_upload_content }} className="sidebar__contents mb-5 md-mb-8">
      </div> */}
        <div className="sidebar__heading">
          <h1>Upload uw drukbestand(en)</h1>
        </div>
        <div className="sidebar__content">
          <p>
            U kunt één of meerdere bestanden uploaden van elk maximaal 100 MB.
            We controleren altijd handmatig uw bestanden en nemen contact op als
            de bestanden niet voldoen aan de minimale specificaties.
          </p>
          <h2>Aanleverspecificaties </h2>
          <h3>Bestandsformaten </h3>
          <p>
            - Lever uw ontwerpbestanden aan in vectoren (AI, EPS of PDF). Een
            ontwerp in vectoren is namelijk te vergroten zonder
            kwaliteitsverlies.
          </p>
          <p>
            - Heeft u geen vectorbestand? Upload dan uw bestand in een zo hoog
            mogelijke resolutie en onze ontwerpers zetten deze kosteloos voor u
            om in vectoren (waar mogelijk).
          </p>
          <p>
            - Betreft het een artikel met full colour bedrukking, dan voldoet
            een rasterafbeelding in bijvoorbeeld JPG, PNG of TIFF formaat.
            Minimale resolutie: 150 DPI.
          </p>
          <h3>Lettertypen</h3>
          <p>
            Stuur uw gebruikte lettertypen altijd mee. Of verander tekst in uw
            ontwerp in lettercontouren/outlines.
          </p>
          <h3>Kleuren</h3>
          <p>
            Maak uw bestanden op met CMYK kleuren en indien van toepassing met
            PMS kleuren, niet in RGB. Hierdoor kunnen wij de kleuren van de
            prints zo goed mogelijk laten overeenkomen met uw huisstijl.
          </p>
        </div>
    </div>
  );
  return (
    <ModelNew
      from="right"
      hideScroll={false}
      zindex={11}
      open={openModel}
      shadow={true}
      setOpen={setOpenModel}
      className="mondu__payment__sidebar"
  >
      {dataBlock}
    </ModelNew>
  );
};

export default UploadInfo;
