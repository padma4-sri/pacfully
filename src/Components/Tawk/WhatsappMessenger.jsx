import React,{useContext} from "react";
import "./styles.scss";
import DomainContext from "Context/DomainContext";

import { WhatsappIcon } from "Res/icons/index";

const WhatsappMessenger = () => {
  const { storeId } = useContext(DomainContext);

    return (
        <div className="whatsapp__messenger">
            <a
            href={`https://wa.me/${storeId == "1" ? "+31765018225" : "+31765021120"}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsappIcon/>
            
          </a>
        </div>
    )
}
export default WhatsappMessenger;
