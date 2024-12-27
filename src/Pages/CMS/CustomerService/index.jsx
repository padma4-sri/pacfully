import React, { useState, useEffect, useRef, useContext, memo } from "react";
import DomainContext from "Context/DomainContext";
import "./styles.scss";
import { useLocation } from "react-router-dom";
import Img from "Components/Img";
import Button from "Components/Common/Button";
import Breadcrumb from "Components/Breadcrumb";
import { useWindowSize } from "Utilities";
import { useEffectOnce } from "Components/Hooks/useEffectOnce";
import { APIQueryGet, APIQueryPost } from "APIMethods/API";
import Seo from "Components/Seo/Seo";
import { LineLoader, SkeletonLine, SkeletonLoader } from "Components/Skeletion";

function CustomerService() {
  const { defaultURL, storeId } = useContext(DomainContext);
  const [width] = useWindowSize();
  const [data, setData] = useState(null);
  const location = useLocation();
  const pathName = location?.pathname?.split("/")?.[2];
  const pathNameMain = location?.pathname?.split("/");
  const seoData = data?.[0]?.seo;
  const [loading, setLoading] = useState(true);

  const options = {
    isLoader: true,
    loaderAction: (bool) => setLoading(bool),
    setGetResponseData: (resData) => {
      setData(resData?.data);
      setTimeout(() => {
        serviceHandle();
      }, 100);
    },
    axiosData: {
      url: `${defaultURL}/customerservice?storeId=${storeId}`,
      
    }
  };

  const circle = "/res/img/circle.svg";
  const serviceRef = useRef();
  const orderRef = useRef();
  const paymentRef = useRef();
  const shippingRef = useRef();
  const warrantyRef = useRef();
  const deliveryRef = useRef();
  const printingRef = useRef();
  const faqRef = useRef();
  const containerRef = useRef();
  // form focus
  var headerHeight = 105;
  var headerHeightSearch = 92;
  var serviceElem = document.querySelector('.cservice__service');
  var orderElem = document.querySelector('.cservice__order');
  var paymentElem = document.querySelector('.cservice__payment');
  var shippingElem = document.querySelector('.cservice__shipping');
  var warrentyElem = document.querySelector('.cservice__warranty');
  var deliveryElem = document.querySelector('.cservice__delivery');
  var printingElem = document.querySelector('.cservice__printing');
  var faqElem = document.querySelector('.cservice__faq');

  const serviceHandle = () => {
    if (serviceElem) {
      if (width >= 768) {
        window.scroll({ top: (serviceElem.offsetTop - headerHeight), left: 0, behavior: 'smooth' });
      } else {
        window.scroll({ top: (serviceElem.offsetTop - headerHeightSearch), left: 0, behavior: 'smooth' });
      }
    }
  };
  const orderHandle = () => {
    if (orderElem) {
      if (width >= 768) {
        window.scroll({ top: (orderElem.offsetTop - headerHeight), left: 0, behavior: 'smooth' });
      } else {
        window.scroll({ top: (orderElem.offsetTop - headerHeightSearch), left: 0, behavior: 'smooth' });
      }
    }
  };
  const shippingHandle = () => {
    if (shippingElem) {
      if (width >= 768) {
        window.scroll({ top: (shippingElem.offsetTop - headerHeight), left: 0, behavior: 'smooth' });
      } else {
        window.scroll({ top: (shippingElem.offsetTop - headerHeightSearch), left: 0, behavior: 'smooth' });
      }
    }
  };
  const warrantyHandle = () => {
    if (warrentyElem) {
      if (width >= 768) {
        window.scroll({ top: (warrentyElem.offsetTop - headerHeight), left: 0, behavior: 'smooth' });
      } else {
        window.scroll({ top: (warrentyElem.offsetTop - headerHeightSearch), left: 0, behavior: 'smooth' });
      }
    }
  };
  const paymentHandle = () => {
    if (paymentElem) {
      if (width >= 768) {
        window.scroll({ top: (paymentElem.offsetTop - headerHeight), left: 0, behavior: 'smooth' });
      } else {
        window.scroll({ top: (paymentElem.offsetTop - headerHeightSearch), left: 0, behavior: 'smooth' });
      }
    }
  };
  const deliveryHandle = () => {
    if (deliveryElem) {
      if (width >= 768) {
        window.scroll({ top: (deliveryElem.offsetTop - headerHeight), left: 0, behavior: 'smooth' });
      } else {
        window.scroll({ top: (deliveryElem.offsetTop - headerHeightSearch), left: 0, behavior: 'smooth' });
      }
    }
  };

  const printingHandle = () => {
    if (printingElem) {
      if (width >= 768) {
        window.scroll({ top: (printingElem.offsetTop - headerHeight), left: 0, behavior: 'smooth' });
      } else {
        window.scroll({ top: (printingElem.offsetTop - headerHeightSearch), left: 0, behavior: 'smooth' });
      }
    }
  };
  const faqHandle = () => {
    if (faqElem) {
      if (width >= 768) {
        window.scroll({ top: (faqElem.offsetTop - headerHeight), left: 0, behavior: 'smooth' });
      } else {
        window.scroll({ top: (faqElem.offsetTop - headerHeightSearch), left: 0, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (pathNameMain?.length < 3) {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    } else {
      if (faqElem || printingElem || deliveryElem || paymentElem || warrentyElem || shippingElem || orderElem || serviceElem) {
        if (pathName === 'service-contact') {
          setTimeout(() => {
            serviceHandle();
          }, 100);
        }
        if (pathName === 'bestellen') {
          orderHandle();
        }
        if (pathName === 'betalen') {
          paymentHandle();
        }
        if (pathName === 'verzending') {
          shippingHandle();
        }
        if (pathName === 'aanleverspecificaties') {
          deliveryHandle();
        }
      }
    }
  }, [location, faqElem, printingElem, deliveryElem, paymentElem, shippingElem, warrentyElem, orderElem, serviceElem, data]);

  // render once
  useEffectOnce(() => APIQueryGet(options));

  const loadingBlock = (
    <div className="flex col gap-1">
      <LineLoader width="50%" height="27px" className="my-2" />
      <SkeletonLoader length={5} />
    </div>
  )

  const loadingBlockTable = (
    <div className="flex col gap-1">
      <div className="flex gap-1 w-1/1">
        {
          ['', ''].map((elem, ind) => (
            <div className="w-1/1" key={`customerSericeLoaderTable${ind}`}>
              <LineLoader height="52px" />
            </div>
          ))
        }
      </div>
    </div>
  )

  const serviceBlock = (
    loading ?
      <div className="services mt-8">
        <LineLoader width="50%" height="26px" className="mb-4" />
        <LineLoader className="pb-4" />
        <div className="order__block my-4">
          {
            ["", "", "", "", ""].map((elem, ind) => (
              <div className="flex gap-6 middle w-1/1 pb-4" key={`cusrtomerServiceBlocKeys${ind}`}>
                <div className="icon__block relative">
                  <LineLoader width="40px" height="40px" />
                </div>
                <div className="flex col gap-1 flex-1">
                  <SkeletonLoader length={3} />
                </div>
              </div>
            ))
          }
        </div>
      </div>
      :
      <div className="services">
        <h2 className="fs-20 fw-700 pb-4">Service & contact</h2>
        <p className="fs-15 pb-4">
          {data?.[1]?.service_and_contact[0]?.service_and_contact_description}
        </p>
        <div className="order__block my-4">
          <div className="flex gap-6 middle w-1/1 pb-4">
            <div className="icon__block relative">
              <Img src={data?.[1]?.service_and_contact[0]?.phone_image} alt="Phone" />
            </div>
            <div>
              <h3 className="fw-700 fs-15">
                {data?.[1]?.service_and_contact[0]?.service_phone}
              </h3>
              <p
                className="fs-15"
                dangerouslySetInnerHTML={{
                  __html: data?.[1]?.service_and_contact[0]?.service_phone_content,
                }}
              />
            </div>
          </div>
          <div className="flex gap-6 middle w-1/1 pb-4">
            <div className="icon__block relative">
              <Img src={data?.[1]?.service_and_contact[0]?.whatsapp_image} alt="Whatsaap" />
            </div>
            <div>
              <h3 className="fw-700 fs-15">
                {data?.[1]?.service_and_contact[0]?.service_whatsapp}
              </h3>
              <p
                className="fs-15"
                dangerouslySetInnerHTML={{
                  __html:
                    data?.[1]?.service_and_contact[0]?.service_whatsapp_description,
                }}
              />
            </div>
          </div>
          <div className="flex gap-6 middle w-1/1 pb-4">
            <div className="icon__block relative">
              <Img src={data?.[1]?.service_and_contact[0]?.livechat_image} alt="Live chat" />
            </div>
            <div>
              <h3 className="fw-700 fs-15">
                {data?.[1]?.service_and_contact[0]?.service_livechat}
              </h3>
              <p
                className="fs-15"
                dangerouslySetInnerHTML={{
                  __html: data?.[1]?.service_and_contact[0]?.service_livechat_content,
                }}
              />
            </div>
          </div>
          <div className="flex gap-6 middle w-1/1 pb-4">
            <div className="icon__block relative">
              <Img src={data?.[1]?.service_and_contact[0]?.email_image} alt="Email" />
            </div>
            <div>
              <h3 className="fw-700 fs-15">
                {data?.[1]?.service_and_contact[0]?.service_email}
              </h3>
              <p
                className="fs-15"
                dangerouslySetInnerHTML={{
                  __html: data?.[1]?.service_and_contact[0]?.service_email_description,
                }}
              />
            </div>
          </div>
          <div className="flex gap-6 middle w-1/1 mb-4">
            <div className="icon__block relative">
              <Img src={data?.[1]?.service_and_contact[0]?.socail_image} alt="Social" />
            </div>
            <div>
              <h3 className="fw-700 fs-15">
                {data?.[1]?.service_and_contact[0]?.service_social_media}
              </h3>
              <p
                className="fs-15"
                dangerouslySetInnerHTML={{
                  __html:
                    data?.[1]?.service_and_contact[0]
                      ?.service_social_media_description,
                }}
              />
            </div>
          </div>
        </div>
      </div>
  );
  const orderBlock = (
    loading ?
      <div className="order">
        <LineLoader width="50%" height="26px" className="mb-4" />
        <LineLoader className="pb-4" />
        <div className="py-4">
          <div className="flex col gap-6 middle w-1/1 pb-4">
            {
              ["", "", "", "", ""].map((elem, ind) => (
                <div className="flex gap-6 middle w-1/1 pb-4" key={`orderTo${ind}`}>
                  <div className="icon__block relative">
                    <LineLoader width="40px" height="40px" />
                  </div>
                  <LineLoader width="80%" />
                </div>
              ))
            }
          </div>
        </div>
        {loadingBlock}
      </div> :
      <div className="order">
        <h2 className="fs-20 fw-700 pb-4">Bestellen</h2>
        <p className="fs-15 pb-4">{data?.[1]?.to_order[0]?.to_order_description}</p>
        <div className="py-4">
          <div className="flex gap-6 middle w-1/1 pb-4">
            <div className="icon__block relative">
              <p className="number__one fs-15 absolute">1</p>
              <Img src={circle} alt="To order customer" className="circle1" />
            </div>
            <div>
              <p className="fs-15">{data?.[1]?.to_order[0]?.order_step1} </p>
            </div>
          </div>
          <div className="flex gap-6 middle w-1/1 pb-4">
            <div className="icon__block relative">
              <p className="number fs-15 absolute">2</p>
              <Img src={circle} alt="To order customer" className="circle2" />
            </div>
            <div>
              <p className="fs-15">{data?.[1]?.to_order[0]?.order_step2}</p>
            </div>
          </div>
          <div className="flex gap-6 middle w-1/1 pb-4">
            <div className="icon__block relative">
              <p className="number fs-15 absolute">3</p>
              <Img src={circle} alt="To order customer" className="circle3" />
            </div>
            <div>
              <p className="fs-15">{data?.[1]?.to_order[0]?.order_step3}</p>
            </div>
          </div>
          <div className="flex gap-6 middle w-1/1 pb-4">
            <div className="icon__block relative">
              <p className="number fs-15 absolute">4</p>
              <Img src={circle} alt="To order customer" className="circle4" />
            </div>
            <div>
              <p className="fs-15">{data?.[1]?.to_order[0]?.order_step4} </p>
            </div>
          </div>
          <div className="flex gap-6 middle w-1/1 pb-4">
            <div className="icon__block relative">
              <p className="number fs-15 absolute">5</p>
              <Img src={circle} alt="To order customer" className="circle4 circle5" />
            </div>
            <div>
              <p className="fs-15">{data?.[1]?.to_order[0]?.order_Step5} </p>
            </div>
          </div>
        </div>
        <h2 className="fs-20 fw-700 pb-2 pt-2">Veilig bestellen</h2>
        <p className="fs-15 pb-4 line-6"
          dangerouslySetInnerHTML={{
            __html: data?.[1]?.to_order[0]?.secure_ordering_description,
          }}
        >
        </p>
      </div>
  );
  const paymentBlock = (
    loading ?
      <div className="payment mt-7">
        {loadingBlock}
      </div>
      :
      <div className="payment">
        <h2 className="fs-20 fw-700 pb-2 pt-2">Veilig betalen</h2>
        <p
          className="fs-15 pb-4 line-6"
          dangerouslySetInnerHTML={{
            __html: data?.[1]?.secure_payment[0]?.secure_payment_description,
          }}
        />
      </div>
  );
  const shippingBlock = (
    loading ?
      <div className="shipping flex col mt-7 gap-3">
        {loadingBlock}
        {loadingBlock}
        {loadingBlockTable}
        {loadingBlockTable}
        {loadingBlockTable}
        {loadingBlockTable}
        {loadingBlock}
        {loadingBlock}
        {loadingBlock}
      </div>
      :
      <div className="shipping">
        <h2 className="fs-20 fw-700 pb-2 pt-2">Verzending & afhalen</h2>
        <p
          className="fs-15 pb-4 line-6"
          dangerouslySetInnerHTML={{
            __html: data?.[1]?.shipping_and_pickup[0]?.shipping_and_pickup_description,
          }}
        />
        <h2 className="fs-15 fw-600 pb-2 pt-2">
          {data?.[1]?.shipping_and_pickup[0]?.shipping_costs}
        </h2>
        <p
          className="fs-15 pb-4 line-6"
          dangerouslySetInnerHTML={{
            __html: data?.[1]?.shipping_and_pickup[0]?.shipping_costs_description,
          }}
        />
        {storeId == 1 ?
          <div className="table-responsive pb-8">
            <table className=" fs-15">
              <thead className="">
                <tr>
                  <th>
                    {data?.[1]?.shipping_and_pickup[0]?.shipping_cost_table1_heading1}
                  </th>
                  <th>
                    {data?.[1]?.shipping_and_pickup[0]?.shipping_cost_table2_heading2}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="free">
                    {data?.[1]?.shipping_and_pickup[0]?.shipping_cost_free_shipping}
                  </td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
          </div> : ""
        }

        <div className="table-responsive pb-8">
          <table className=" fs-15">
            <thead className="">
              <tr>
                <th>
                  {" "}
                  {data?.[1]?.shipping_and_pickup[0]?.shipping_cost_table2_heading1}
                </th>
                <th>
                  {" "}
                  {data?.[1]?.shipping_and_pickup[0]?.shipping_cost_table2_heading2}
                </th>
              </tr>
            </thead>
            <tbody>

              <tr>
                <td> {data?.[1]?.shipping_and_pickup[0]?.shipping_cost1}</td>
                <td>
                  {" "}
                  {data?.[1]?.shipping_and_pickup[0]?.shipping_cost1_excluding_vat}
                </td>
              </tr>
              <tr>
                <td> {data?.[1]?.shipping_and_pickup[0]?.shipping_cost2}</td>
                <td>
                  {" "}
                  {data?.[1]?.shipping_and_pickup[0]?.shipping_cost2_excluding_vat}
                </td>
              </tr>
              <tr>
                <td className="free">
                  {data?.[1]?.shipping_and_pickup[0]?.shipping_cost_free_shipping}
                </td>
                <td>
                  {" "}
                  {
                    data?.[1]?.shipping_and_pickup[0]
                      ?.shipping_cost_free_shipping_excluding_vat
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="fs-15 fw-600 pb-2 pt-2">
          {data?.[1]?.shipping_and_pickup[0]?.shipping_cost_delivery_time}
        </h2>
        <p className="fs-15 pb-4 line-6">
          {data?.[1]?.shipping_and_pickup[0]?.shipping_cost_delivery_time_description}
        </p>
        <h2 className="fs-15 fw-600 pb-2 pt-2">
          {data?.[1]?.shipping_and_pickup[0]?.shipping_cost_urgent}
        </h2>
        <p className="fs-15 pb-4 line-6">
          {data?.[1]?.shipping_and_pickup[0]?.shipping_cost_urgent_description}
        </p>
        <h2 className="fs-15 fw-600 pb-2 pt-2">
          {data?.[1]?.shipping_and_pickup[0]?.shipping_cost_carriers}
        </h2>
        <p className="fs-15 pb-4 line-6">
          {data?.[1]?.shipping_and_pickup[0]?.shipping_cost_carriers_description}
        </p>
        <h2 className="fs-15 fw-600 pb-2 pt-2">
          {data?.[1]?.shipping_and_pickup[0]?.shipping_cost_collection}
        </h2>
        <p className="fs-15 pb-4 line-6">
          {data?.[1]?.shipping_and_pickup[0]?.shipping_cost_collection_description}
        </p>
        <h2 className="fs-15 fw-600 pb-2 pt-2">
          {data?.[1]?.shipping_and_pickup[0]?.shipping_cost_complaints}
        </h2>
        <p
          className="fs-15 pb-4 line-6"
          dangerouslySetInnerHTML={{
            __html:
              data?.[1]?.shipping_and_pickup[0]?.shipping_cost_complaints_description,
          }}
        />

        <h2 className="fs-15 fw-600 pb-2 pt-2">
          {data?.[1]?.shipping_and_pickup[0]?.shipping_cost_return}
        </h2>
        <p
          className="fs-15 pb-4 line-6"
          dangerouslySetInnerHTML={{
            __html:
              data?.[1]?.shipping_and_pickup[0]?.shipping_cost_return_description,
          }}
        />
      </div>
  );
  const WarrantyBlock = (
    loading ?
      <div className="warrranty">
        {loadingBlock}
        {loadingBlock}
      </div>
      :
      <div className="warrranty">
        <h2 className="fs-20 fw-700 pb-2 pt-2">{data?.[1]?.grantie_section[0]?.title}</h2>
        <p className="fs-15 pb-4 line-6" dangerouslySetInnerHTML={{
          __html: data?.[1]?.grantie_section[0]?.title_description,
        }} />
        <h2 className="fs-15 fw-600 pb-2 pt-2">
          {" "}
          {data?.[1]?.grantie_section[0]?.subtitle_one}
        </h2>
        <p
          className="fs-15 pb-4 line-6"
          dangerouslySetInnerHTML={{
            __html: data?.[1]?.grantie_section[0]?.description_one,
          }}
        />
        <h2 className="fs-15 fw-600 pb-2 pt-2">
          {" "}
          {data?.[1]?.grantie_section[0]?.subtitle_two}
        </h2>
        <p
          className="fs-15 pb-4 line-6"
          dangerouslySetInnerHTML={{
            __html: data?.[1]?.grantie_section[0]?.description_two,
          }}
        />
        <h2 className="fs-15 fw-600 pb-2 pt-2">
          {" "}
          {data?.[1]?.grantie_section[0]?.subtitle_three}
        </h2>
        <p
          className="fs-15 mb-4 line-6"
          dangerouslySetInnerHTML={{
            __html: data?.[1]?.grantie_section[0]?.description_three,
          }}
        />

        <h2 className="fs-15 fw-600 pb-2 pt-2">
          {" "}
          {data?.[1]?.grantie_section[0]?.subtitle_four}
        </h2>
        <p className="fs-15 pb-4 line-6"
          dangerouslySetInnerHTML={{
            __html: data?.[1]?.grantie_section[0]?.description_four,
          }} />

        <h2 className="fs-15 fw-600 pb-2 pt-2">
          {data?.[1]?.grantie_section[0]?.subtitle_five}
        </h2>
        <p className="fs-15 pb-4 line-6" dangerouslySetInnerHTML={{
          __html: data?.[1]?.grantie_section[0]?.description_five,
        }} />



      </div>
  );
  const deliveryBlock = (
    loading ?
      <div className="delivery">
        {loadingBlock}
        {loadingBlock}
      </div>
      :
      <div className="delivery">
        <h2 className="fs-20 fw-700 pb-2 pt-2">Aanleverspecificaties</h2>

        <h2 className="fs-15 fw-600 pb-2 pt-2">
          {" "}
          {data?.[1]?.delivery_specifications[0]?.general_guidelines}
        </h2>
        <p className="fs-15 pb-4 line-6">
          {data?.[1]?.delivery_specifications[0]?.general_guidelines_description}
        </p>
        <div className="left__border mt-4 mb-8">
          <h2 className="fs-15 fw-600 pb-2 pt-2">
            {" "}
            {data?.[1]?.delivery_specifications[0]?.file_formats}
          </h2>
          <p
            className="fs-15 pb-4 line-6"
            dangerouslySetInnerHTML={{
              __html: data?.[1]?.delivery_specifications[0]?.file_formats_description,
            }}
          />
          <h2 className="fs-15 fw-600 pb-2 pt-2">
            {" "}
            {data?.[1]?.delivery_specifications[0]?.fonts}
          </h2>
          <p
            className="fs-15 pb-4 line-6"
            dangerouslySetInnerHTML={{
              __html: data?.[1]?.delivery_specifications[0]?.fonts_description,
            }}
          />
          <h2 className="fs-15 fw-600 pb-2 pt-2">
            {" "}
            {data?.[1]?.delivery_specifications[0]?.colors}
          </h2>
          <p
            className="fs-15 mb-4 line-6"
            dangerouslySetInnerHTML={{
              __html: data?.[1]?.delivery_specifications[0]?.colors_description,
            }}
          />
        </div>

        <h2 className="fs-15 fw-600 pb-2 pt-2">
          {" "}
          {data?.[1]?.delivery_specifications[0]?.delivering_your_files}
        </h2>
        <p className="fs-15 pb-4 line-6">
          {data?.[1]?.delivery_specifications[0]?.delivering_your_files_description}
        </p>
        <div className="left__border my-4">
          <h2 className="fs-15 fw-600 pb-2 pt-2">
            {data?.[1]?.delivery_specifications[0]?.quote_request}
          </h2>
          <p className="fs-15 pb-4 line-6">
            {data?.[1]?.delivery_specifications[0]?.quote_request_description}
          </p>
          <h2 className="fs-15 fw-600 pb-2 pt-2">
            {data?.[1]?.delivery_specifications[0]?.design_yourself}
          </h2>
          <p className="fs-15 pb-4 line-6">
            {data?.[1]?.delivery_specifications[0]?.design_yourself_description}
          </p>
          <h2 className="fs-15 fw-600 pb-2 pt-2">
            {data?.[1]?.delivery_specifications[0]?.later_via_email}
          </h2>
          <p className="fs-15 pb-4 line-6">
            {data?.[1]?.delivery_specifications[0]?.later_via_email_description}
          </p>
          <h2 className="fs-15 fw-600 pb-2 pt-2">
            {data?.[1]?.delivery_specifications[0]?.sending_large_files}
          </h2>
          <p className="fs-15  line-6">
            {data?.[1]?.delivery_specifications[0]?.sending_large_files_description}
          </p>

        </div>
        <div className="py-4 upload__button ">
          <Button className="fs-13 line-8 fw-700 r-8  px-5  ">
            <a
              href="https://wetransfer.com/?msg=Opmerkingen:"
              target="__blank"
              className="fs-13 line-8 fw-700"
            >
              {data?.[1]?.delivery_specifications[0]?.button_text}
            </a>
          </Button>
        </div>

        <h2 className="fs-15 fw-600 pb-2 pt-2">
          {data?.[1]?.delivery_specifications[0]?.dont_have_design}
        </h2>
        <p className="fs-15 pb-4 line-6">
          {data?.[1]?.delivery_specifications[0]?.dont_have_design_description}
        </p>
        <h2 className="fs-15 fw-600 pb-2 pt-2">
          {data?.[1]?.delivery_specifications[0]?.questions}
        </h2>
        <p
          className="fs-15 pb-4 line-6"
          dangerouslySetInnerHTML={{
            __html: data?.[1]?.delivery_specifications[0]?.questions_description,
          }}
        />
      </div>
  );
  const printingBlock = (
    <div className="delivery">
      <h2 className="fs-20 fw-700 pb-2 pt-2">Druktechnieken</h2>
      <p
        className="fs-15 pb-4 line-6"
        dangerouslySetInnerHTML={{
          __html: data?.[1]?.printing_techniques[0]?.printing_techniques_description,
        }}
      />
    </div>
  );
  const faqBlock = (
    <div className="delivery">
      <h2 className="fs-20 fw-700 pb-2 pt-2">Meest gestelde vragen</h2>
      <p
        className="fs-15 pb-4 line-6"
        dangerouslySetInnerHTML={{
          __html: data?.[1]?.faq[0]?.faq_description,
        }}
      />
    </div>
  );
  const breadCrumbData = [
    {
      categoryName: "Klantenservice",
      urlKey: "",
      catId: "",
    },
  ];
  return (
    <>
      <Seo
        metaTitle={seoData?.metaTitle}
        metaDescription={seoData?.metaDescription}
        metaKeywords={seoData?.metaKeywords}
      />
      <div className="pt-4">
        <Breadcrumb data={breadCrumbData} />
      </div>
      <div className="container px-4 pb-8 customer__service" ref={containerRef}>
        <div className="">
          {
            loading ?
              <React.Fragment>
                <h3 className="fs-32 fw-700 py-4">
                  <SkeletonLine
                    animation="pulse"
                    width="50%"
                    height="42px"
                    style={{ borderRadius: "0px" }}
                  />
                </h3>
                <div className="flex col gap-2">
                  <SkeletonLine
                    animation="pulse"
                    width="70%"
                    height="20px"
                    style={{ borderRadius: "0px" }}
                  />
                  {
                    ['', '', '', '', '', '', ''].map((elem, ind) => (
                      <div key={`customerServiceList${ind}`}>
                        <SkeletonLine
                          animation="pulse"
                          width="250px"
                          height="20px"
                          style={{ borderRadius: "0px" }}
                        />
                      </div>
                    ))
                  }
                </div>
              </React.Fragment>
              :
              <React.Fragment>
                <h3 className="fs-32 fw-700 py-4">Klantenservice</h3>
                <p className="fs-15">
                  {
                    data?.[1]?.customer_service_titles[0]
                      ?.customer_service_titles_description
                  }
                </p>
                <div className="heading__section py-4">
                  <p
                    onClick={() => {
                      serviceHandle();
                    }}
                  >
                    <span>
                      {data?.[1]?.customer_service_titles[0]?.service_and_contact}
                    </span>
                  </p>
                  <p
                    onClick={() => {
                      orderHandle();
                    }}
                  >
                    <span>{data?.[1]?.customer_service_titles[0]?.to_order}</span>
                  </p>
                  <p
                    onClick={() => {
                      paymentHandle();
                    }}
                  >
                    <span>{data?.[1]?.customer_service_titles[0]?.secure_payment}</span>
                  </p>
                  {storeId == 1 ? "" :
                    <p
                      onClick={() => {
                        warrantyHandle();
                      }}
                    >
                      <span>
                        {data?.[1]?.customer_service_titles[0]?.grantie}
                      </span>
                    </p>
                  }

                  <p
                    onClick={() => {
                      shippingHandle();
                    }}
                  >
                    <span>
                      {data?.[1]?.customer_service_titles[0]?.shipping_and_pickup}
                    </span>
                  </p>
                  <p
                    onClick={() => {
                      deliveryHandle();
                    }}
                  >
                    <span>
                      {data?.[1]?.customer_service_titles[0]?.delivery_specifications}
                    </span>
                  </p>
                  <p
                    onClick={() => {
                      printingHandle();
                    }}
                  >
                    <span>
                      {data?.[1]?.customer_service_titles[0]?.printing_techniques}
                    </span>
                  </p>
                  <p
                    onClick={() => {
                      faqHandle();
                    }}
                  >
                    <span>{data?.[1]?.customer_service_titles[0]?.faq}</span>
                  </p>
                </div>
              </React.Fragment>
          }
          <div ref={serviceRef} className="cservice__service">{serviceBlock}</div>
          <div ref={orderRef} className="cservice__order">{orderBlock}</div>
          <div ref={paymentRef} className="cservice__payment">{paymentBlock}</div>
          <div ref={shippingRef} className="cservice__shipping">{shippingBlock}</div>
         {storeId==1?"":
          <div ref={warrantyRef} className="cservice__warranty">{WarrantyBlock}</div>
         }
          <div ref={deliveryRef} className="cservice__delivery">{deliveryBlock}</div>
          <div ref={printingRef} className="cservice__printing">{printingBlock}</div>
          <div ref={faqRef} className="cservice__faq">{faqBlock}</div>
        </div>
      </div>
    </>
  );
}

export default memo(CustomerService);
