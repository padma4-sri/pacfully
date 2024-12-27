import React, { useState, useEffect } from "react";
import "./styles.scss";
import Button from "Components/Common/Button";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import {
  AccountMobile,
  AccountHome,
  AccountPerson,
  AccountJob,
  EditIcon,
} from "Res/icons";
import {
  ACTION__SELECTEDADDRESS_BILLING,

} from "Store/action";
import { useSelector, useDispatch } from "react-redux";
import AddAddress from "../AddAddress";
import ModelNew from "Components/Model/ModelNew";

function CustomerBillingAddress({
  customerAddress,
  countryList,
  GetCustomerAddress,
  getCustomerBillingAddress,
  summaryData,
  AddCustomerBillingShippingAddress
}) {
  const [editAddress, setEditAddress] = useState(false);
  const [openModelAddress, setOpenModelAddress] = useState(false);
  const [editBillingAddress, setEditBillingAddress] = useState(false);
  const [defaultBilling, setDefaultBilling] = useState(null);
  const dispatch = useDispatch();
  const defaultBillingAddress = customerAddress?.allAddress?.find(
    (address) => address?.default_billing == 1
  );
  const addressDefault = useSelector((state) => state?.addressDefault);
  const selectedbilling = useSelector((state) => state?.selectedbilling);
 const handleAddressClick = (item) => {
    dispatch(ACTION__SELECTEDADDRESS_BILLING(item));

  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  
useEffect(()=>{
  if(selectedbilling?.address_id==addressDefault?.address_id){
    dispatch(ACTION__SELECTEDADDRESS_BILLING(addressDefault));
  }
},[addressDefault,selectedbilling])
  useEffect(() => {
    const datas = {
      defaultBilling: selectedbilling,
      defaultBillingAddress: defaultBillingAddress,
    };
    getCustomerBillingAddress(datas);

  }, [customerAddress, defaultBilling, selectedbilling]);
  return (
    <>
      <h3 className="fw-700 fs-20 pb-4">Factuuradres</h3>
      {customerAddress?.allAddress?.length ? (
        editAddress ? (
          <div className="edit__address__section ">
            <div className="lg-flex lg-gap-x-4 lg-w-1/1 lg-wrap">
              {customerAddress?.allAddress?.map((item, index) => (
                <div className="relative pb-4 ">
                  <div
                    className={`edit__address__block p-4 r-3 pointer ${selectedbilling?.address_id === item?.address_id
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
                          <p className="line-7 fs-15 ">{item?.company}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-3 middle address__box ">
                      <div>
                        <AccountPerson />
                      </div>
                      <div>
                        <p className="line-7 fs-15">
                          {item?.firstname} {item?.lastname}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="pt-1">
                        <AccountHome />
                      </div>
                      <div>
                        <p className="line-7 fs-15">{item?.street2} {item?.street1}</p>
                        <p className="line-7 fs-15">
                          <span>{item?.postcode}</span>
                          <span> {item?.city}</span>


                        </p>
                        <p className="line-7 fs-15">{item?.country_code}</p>
                      </div>
                    </div>
                    <div className="flex gap-3  ">
                      <div className="pt-1">
                        <AccountMobile />
                      </div>
                      <div>
                        <p className="line-7 fs-15">
                          Tel.&nbsp;
                          {defaultBilling?.mobile_number
                            ? defaultBilling?.mobile_number
                            : defaultBillingAddress?.mobile_number}
                        </p>

                        {defaultBilling?.vat_id || defaultBillingAddress?.vat_id && (
                          <p className="line-7 fs-15">
                            {defaultBilling?.vat_id
                              ? defaultBilling?.vat_id
                              : defaultBillingAddress?.vat_id}
                          </p>
                        )}
                      </div>
                    </div>
                    <button className="absolute top-6 right-4 select__text fs-12" aria-label="button">
                      {selectedbilling?.address_id === item?.address_id
                        ? "Selecteer"
                        : ""}
                    </button>
                  </div>
                </div>
              ))}

              {addressDefault?.addedAddress == 0 && (
                <div className="relative pb-4 ">
                  <div
                    className={`edit__address__block p-4 r-3 ${selectedbilling?.address_id === addressDefault?.address_id
                      ? "selected"
                      : "unselected"
                      }`}
                    onClick={() => handleAddressClick(addressDefault)}
                  >

                    {addressDefault?.company && (
                      <div className="flex gap-3 middle address__box ">
                        <div>
                          <AccountJob />
                        </div>
                        <div>
                          <p className="line-7 fs-15 ">
                            {addressDefault?.company}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-3 middle address__box ">
                      <div>
                        <AccountPerson />
                      </div>
                      <div>
                        <p className="line-7 fs-15">
                          {addressDefault?.firstname} {addressDefault?.lastname}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3  ">
                      <div className="pt-1">
                        <AccountHome />
                      </div>
                      <div>
                        <p className="line-7 fs-15">
                          {addressDefault?.street2} {addressDefault?.street1}
                        </p>
                        <p className="line-7 fs-15">
                        {addressDefault?.postcode}   {addressDefault?.city} 
                        </p>
                        <p className="line-7 fs-15">
                          {addressDefault?.country_code}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3  ">
                      <div className="pt-1">
                        <AccountMobile />
                      </div>
                      <div>
                        <p className="line-7 fs-15">
                          Tel.&nbsp;
                          {addressDefault?.mobile_number
                          }
                        </p>
                        {addressDefault?.vat_id && (
                          <p className="line-7 fs-15">
                            {addressDefault?.vat_id
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    <button className="absolute top-6 right-4 select__text fs-12" aria-label="button">
                      {selectedbilling?.address_id === addressDefault?.address_id
                        ? "Selecteer"
                        : ""}
                    </button>
                    <div className="action underline flex gap-5 pt-3 right">
                      <Button
                        className='fs-15 text-underline'
                        onClick={() => {
                          setOpenModelAddress(true);
                          setEditBillingAddress(true);
                        }}
                      >
                        <EditIcon />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {addressDefault?.addedAddress !== 0 && (
              <div className="flex right pb-8">
                <button
                  className="text-underline fs-15"
                  onClick={() => {
                    setOpenModelAddress(true);
                  }}
                  aria-label="button"
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
                  dispatch(ACTION__SELECTEDADDRESS_BILLING(defaultBillingAddress));
                }}
              >
                Annuleren
              </button>

              <Button
                className="fs-16 line-7 fw-700 r-8  px-5 save__button"
                fullWidth
                type="submit"
                onClick={() => {
                  scrollToTop();
                  setEditAddress(false);
                  setDefaultBilling(selectedbilling);
                }}
              >
                Opslaan
                <span className="flex middle">
                  &nbsp;
                  <KeyboardArrowRightIcon />
                </span>
              </Button>
            </div>
          </div>
        ) :
          (
            <div className="default__address">
              <div className="relative pb-6">
                {/* {selectedbilling?.company && selectedbilling?.firstname
                  || (defaultBillingAddress?.company && selectedbilling=={}  ) ? (
                  <div className="flex gap-3 middle address__box ">
                    <div>
                      <AccountJob />
                    </div>
                    <div>
                      <p className="line-7 fs-15 ">
                        {selectedbilling?.company
                          ? selectedbilling?.company

                        : (defaultBillingAddress?.company && selectedbilling?.firstname) ? selectedbilling?.company : defaultBillingAddress?.company

                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  ""
                )} */}
                 {(selectedbilling?.company && selectedbilling?.firstname) || 
   (defaultBillingAddress?.company && Object.keys(selectedbilling).length === 0) ? (
    <div className="flex gap-3 middle address__box">
      <div>
        <AccountJob />
      </div>
      <div>
        <p className="line-7 fs-15">
          {selectedbilling?.company ||
            (defaultBillingAddress?.company && selectedbilling?.firstname)
            ? selectedbilling?.company
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
                    <p className="line-7 fs-15">
                      {selectedbilling?.firstname
                        ? selectedbilling?.firstname
                        : defaultBillingAddress?.firstname}
                      &nbsp;
                      {selectedbilling?.lastname
                        ? selectedbilling?.lastname
                        : defaultBillingAddress?.lastname}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3  ">
                  <div className="pt-1">
                    <AccountHome />
                  </div>
                  <div>
                    <p className="line-7 fs-15">
                      {selectedbilling?.street2
                        ? selectedbilling?.street2
                        : defaultBillingAddress?.street2}
                      &nbsp;
                      {selectedbilling?.street1
                        ? selectedbilling?.street1
                        : defaultBillingAddress?.street1}
                      <br />
                      {selectedbilling?.postcode
                        ? selectedbilling?.postcode
                        : defaultBillingAddress?.postcode}
                        &nbsp;
                      {selectedbilling?.city
                        ? selectedbilling?.city
                        : defaultBillingAddress?.city}
                      
                      <br />
                      {selectedbilling?.country_code
                        ? selectedbilling?.country_code
                        : defaultBillingAddress?.country_code}
                    </p>


                  </div>
                </div>
                <div className="flex gap-3  ">
                  <div className="pt-1">
                    <AccountMobile />
                  </div>
                  <div>
                    <p className="line-7 fs-15">
                      Tel.&nbsp;
                      {selectedbilling?.mobile_number
                        ? selectedbilling?.mobile_number
                        : defaultBillingAddress?.mobile_number}
                    </p>
                    {selectedbilling?.vat_id || defaultBillingAddress?.vat_id && (
                      <p className="line-7 fs-15">
                        {selectedbilling?.vat_id
                          ? selectedbilling?.vat_id
                          : defaultBillingAddress?.vat_id}</p>
                    )}
                  </div>
                </div>
                <button
                  className="absolute top-2 right-0 text-underline fs-15"
                  onClick={() => setEditAddress(true)}
                  aria-label="button"
                >
                  wijzigen
                </button>
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
          editBillingAddress={editBillingAddress}
          setEditBillingAddress={setEditBillingAddress}
          countryList={countryList}
          GetCustomerAddress={GetCustomerAddress}
          address="billing"
          summaryData={summaryData}
          AddCustomerBillingShippingAddress={AddCustomerBillingShippingAddress}
        />
      </ModelNew>


    </>
  );
}

export default CustomerBillingAddress;
