import React, { useState, useEffect } from "react";
import "./styles.scss";
import Button from "Components/Common/Button";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import AddAddress from "../AddAddress";
import {
  AccountMobile,
  AccountHome,
  AccountPerson,
  AccountJob,
  EditIcon
} from "Res/icons";
import { useSelector ,useDispatch} from "react-redux";
import ModelNew from "Components/Model/ModelNew";
import {
  ACTION__SELECTEDADDRESS_SHIPPING,

} from "Store/action";
function CustomerShippingAddress({
  customerAddress,
  countryList,
  GetCustomerAddress,
  getCustomerShippingAddress,
  onTabClick,
  handleExpandNext,
  summaryData,
  customerBillingAddress,
  customerShippingAddress,
  AddCustomerBillingShippingAddress

}) {
  const [editAddress, setEditAddress] = useState(false);
  const [openModelAddress, setOpenModelAddress] = useState(false);
  const [editShippingAddress, setEditShippingAddress] = useState(false);
  const [defaultBilling, setDefaultBilling] = useState(null);
  const [sampleError, setSampleError] = useState("");
  const addressShipping = useSelector((state) => state?.addressShipping);
  const selectedshipping = useSelector((state) => state?.selectedshipping);
  const isLoggedUser = useSelector((state)=>state?.isLoggedUser);
  const customerDetails = useSelector((state)=>state?.customerDetails) ;
  const dispatch = useDispatch();
  const company = customerDetails?.custom_attributes?.filter((item) => item?.attribute_code === "customer_company");
  const defaultBillingAddress = customerAddress?.allAddress?.find(
    (address) => address?.default_shipping == 1
  );
  const handleAddressClick = (item) => {
    dispatch(ACTION__SELECTEDADDRESS_SHIPPING(item));

  };

useEffect(()=>{
  if(selectedshipping?.address_id==addressShipping?.address_id){
    dispatch(ACTION__SELECTEDADDRESS_SHIPPING(addressShipping));
  }
},[addressShipping,selectedshipping])
  
  useEffect(() => {
    const datas = {
      defaultBilling: selectedshipping,
      defaultBillingAddress: defaultBillingAddress,
    };
    getCustomerShippingAddress(datas);
  }, [defaultBilling, customerAddress,selectedshipping]);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional, for smooth scrolling
    });
  };
  return (
    <>
      <h3 className="fw-700 fs-20 pb-4">Afleveradres</h3>
      {customerAddress?.allAddress?.length ? (
        editAddress ? (
          <div className="edit__address__section ">
            <div className="lg-flex lg-gap-x-4 lg-w-1/1 lg-wrap">
              {customerAddress?.allAddress?.map((item, index) => (
                <div className="relative pb-4 ">
                  <div
                    className={`edit__address__block p-4 r-3 ${selectedshipping?.address_id === item?.address_id
                        ? "selected"
                        : "unselected"
                      }`}
                    onClick={() => handleAddressClick(item)}
                  >
                    {item?.company && (
                      <div className="flex gap-3 middle address__box ">
                        <div>
                          <AccountJob />
                        </div>
                        <div>
                          <p className="line-8 fs-15 ">{item?.company}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-3 middle address__box ">
                      <div>
                        <AccountPerson />
                      </div>
                      <div>
                        <p className="line-8 fs-15">
                          {item?.firstname} {item?.lastname}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="pt-1">
                        <AccountHome />
                      </div>
                      <div>
                        <p className="line-8 fs-15">{item?.street2} {item?.street1}</p>
                        <p className="line-8 fs-15">
                        {item?.postcode}  {item?.city} 
                        </p>
                        <p className="line-8 fs-15">{item?.country_code}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 middle address__box ">
                      <div>
                        <AccountMobile />
                      </div>
                      <div>
                        <p className="line-8 fs-15">
                          Tel.&nbsp; {item?.mobile_number}
                        </p>
                        {item?.vat_id && (
                          <p className="line-7 fs-15">
                            {item?.vat_id
                            }
                          </p>
                        )}
                      </div>
                    </div>
                    <button className="absolute top-6 right-4 select__text fs-12" aria-label="button">
                      {selectedshipping?.address_id === item?.address_id
                        ? "Selecteer"
                        : ""}
                    </button>
                  </div>
                </div>
              ))}
              {addressShipping?.addedAddress === 0 && (
                <div className="relative pb-4">
                  <div
                    className={`edit__address__block p-4 r-3 ${selectedshipping?.address_id === addressShipping?.address_id
                        ? "selected"
                        : "unselected"
                      }`}
                    onClick={() => handleAddressClick(addressShipping)}
                  >
                    {addressShipping?.company && (
                      <div className="flex gap-3 middle address__box ">
                        <div>
                          <AccountJob />
                        </div>
                        <div>
                          <p className="line-8 fs-15 ">
                            {addressShipping?.company}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 middle address__box ">
                      <div>
                        <AccountPerson />
                      </div>
                      <div>
                        <p className="line-8 fs-15">
                          {addressShipping?.firstname}{" "}
                          {addressShipping?.lastname}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3  ">
                      <div className="pt-1">
                        <AccountHome />
                      </div>
                      <div>
                        <p className="line-8 fs-15">
                          {addressShipping?.street2} &nbsp;
                          {addressShipping?.street1}
                        </p>
                        <p className="line-8 fs-15">
                          {addressShipping?.postcode}  {addressShipping?.city} 
                        </p>
                        <p className="line-8 fs-15">
                          {addressShipping?.country_code}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 middle address__box ">
                      <div>
                        <AccountMobile />
                      </div>
                      <div>
                        <p className="line-8 fs-15">
                          Tel.&nbsp; {addressShipping?.mobile_number}
                        </p>
                        {addressShipping?.vat_id && (
                          <p className="line-7 fs-15">
                            {addressShipping?.vat_id
                            }
                          </p>
                        )}
                      </div>
                    </div>
                    <button className="absolute top-6 right-4 select__text fs-12" aria-label="button">
                      {selectedshipping?.address_id === addressShipping?.address_id
                        ? "Selecteer"
                        : ""}
                    </button>
                    <div className="action underline flex gap-5 pt-3 right">
                      <Button
                        className='fs-15 text-underline'
                        onClick={() => {
                          setOpenModelAddress(true);
                          setEditShippingAddress(true);
                        }}
                      >
                        <EditIcon />
                      </Button>

                    </div>
                  </div>
                </div>
              )}
            </div>
            {addressShipping?.addedAddress !== 0 && (
              <div className="flex right pb-8">
                <button
                  className="text-underline fs-15"
                  aria-label="button"
                  onClick={() => {
                    setOpenModelAddress(true);
                  }}
                >
                  + Adres toevoegen
                </button>
              </div>
            )}
            <div className="flex right gap-8 pb-8">
              <button
                className="fs-15"
                aria-label="button"
                onClick={() => {
                  setEditAddress(false);
                  scrollToTop();
    dispatch(ACTION__SELECTEDADDRESS_SHIPPING(defaultBillingAddress));


                }}
              >
                Annuleren
              </button>

              <Button
                className="fs-16 line-8 fw-700 r-8  px-5 save__button"
                fullWidth
                type="submit"
                onClick={() => {
                  scrollToTop();
                  setEditAddress(false);
                  setDefaultBilling(selectedshipping);
                }}
              >
                Opslaan
                <span className="flex middle">
                  <KeyboardArrowRightIcon />
                </span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="default__address">
            <div className="relative pb-6">
            {(selectedshipping?.company && selectedshipping?.firstname) || 
   (defaultBillingAddress?.company && Object.keys(selectedshipping).length === 0) ? (
    <div className="flex gap-3 middle address__box">
      <div>
        <AccountJob />
      </div>
      <div>
        <p className="line-7 fs-15">
          {selectedshipping?.company ||
            (defaultBillingAddress?.company && selectedshipping?.firstname)
            ? selectedshipping?.company
            : defaultBillingAddress?.company}
        </p>
        <p className="line-7 fs-15"></p>
      </div>
    </div>
  ) : null}
              <div className="flex gap-3 middle address__box ">
                <div>
                  <AccountPerson />
                </div>
                <div>
                  <p className="line-8 fs-15">
                    {selectedshipping?.firstname
                      ? selectedshipping?.firstname
                      : defaultBillingAddress?.firstname}
                    &nbsp;
                    {selectedshipping?.lastname
                      ? selectedshipping?.lastname
                      : defaultBillingAddress?.lastname}
                  </p>
                </div>
              </div>
              <div className="flex gap-3  ">
                <div className="pt-1">
                  <AccountHome />
                </div>
                <div>
                  <p className="line-8 fs-15">
                    {selectedshipping?.street2
                      ? selectedshipping?.street2
                      : defaultBillingAddress?.street2}
                    &nbsp;
                        {selectedshipping?.street1
                      ? selectedshipping?.street1
                      : defaultBillingAddress?.street1}
                  </p>
                  <p className="line-8 fs-15">
                  {selectedshipping?.postcode
                      ? selectedshipping?.postcode
                      : defaultBillingAddress?.postcode}{" "}
                   
                  {selectedshipping?.city
                      ? selectedshipping?.city
                      : defaultBillingAddress?.city}
                    
                  </p>
                  <p className="line-8 fs-15">
                    {selectedshipping?.country_code
                      ? selectedshipping?.country_code
                      : defaultBillingAddress?.country_code}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 middle address__box ">
                <div>
                  <AccountMobile />
                </div>
                <div>
                  <p className="line-8 fs-15">
                    Tel.&nbsp;
                    {selectedshipping?.mobile_number
                      ? selectedshipping?.mobile_number
                      : defaultBillingAddress?.mobile_number}
                  </p>
                  {selectedshipping?.vat_id || defaultBillingAddress?.vat_id && (
                    <p className="line-7 fs-15">
                      {selectedshipping?.vat_id
                        ? selectedshipping?.vat_id
                        : defaultBillingAddress?.vat_id}</p>
                  )}
                </div>
              </div>
              <button
                aria-label="button"
                className="absolute top-2 right-0 text-underline fs-15"
                onClick={() => setEditAddress(true)}
              >
                wijzigen
              </button>
            </div>
          {sampleError &&
          <p className="error">
            {sampleError}
          </p>}
            <div className="button__info pt-4 pb-6">
              <Button
                className="fs-16 line-8 fw-700 r-8  px-5 cart__button"
                fullWidth
                type="submit"
                onClick={(e) => {
                  if(customerBillingAddress?.defaultBilling?.company || customerShippingAddress?.defaultBilling?.company){
                    onTabClick("shipping");
                    AddCustomerBillingShippingAddress(summaryData?.shipping_methods?.length && summaryData?.shipping_methods[0])

                    handleExpandNext("fast");
                  }
                  else if (isLoggedUser && company?.length==0 && summaryData?.totals_detail?.isSample == "1") {
                    setSampleError('Alleen bedrijven kunnen samples bestellen. Controleer of uw accountgegevens correct zijn ingesteld; momenteel staat het type als particulier geselecteerd.');
                  }
                  else{
                    onTabClick("shipping");
                    AddCustomerBillingShippingAddress(summaryData?.shipping_methods?.length && summaryData?.shipping_methods[0])
                    handleExpandNext("fast");
                  }
                 
                }}
              >
                Naar verzending
                <span className="flex middle fw-600">
                  &nbsp;&nbsp;&nbsp;&nbsp;<KeyboardArrowRightIcon />
                </span>
              </Button>
            </div>
          </div>
        )
      ) : (
        ""
      )}


      <ModelNew
        from="right"
        hideScroll={false}
        zindex={11}
        open={openModelAddress}
        shadow={true}
        setOpen={setOpenModelAddress}
        className="checkout__address__sidebar"
      >
        <AddAddress
          openModel={openModelAddress}
          setOpenModel={setOpenModelAddress}
          countryList={countryList}
          GetCustomerAddress={GetCustomerAddress}
          address="shipping"
          editShippingAddress={editShippingAddress}
          setEditShippingAddress={setEditShippingAddress}
          summaryData={summaryData}
          AddCustomerBillingShippingAddress={AddCustomerBillingShippingAddress}
        />
      </ModelNew>
    </>
  );
}

export default CustomerShippingAddress;
