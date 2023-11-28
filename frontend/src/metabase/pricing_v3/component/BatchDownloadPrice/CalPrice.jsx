/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import Link from "metabase/core/components/Link";
import Head from "./Head";
import Button from "metabase/core/components/Button/Button";
import { InputNumber, message, Select, Switch } from "antd";
import { sumBy } from "lodash";
import { chainPriceData } from "metabase/pricing_v3/component/BatchDownloadPrice/data";
import Icon from "metabase/components/Icon";
import { getOssUrl } from "metabase/lib/image";

const CalPrice = ({ user, setLoginModalShow, onCancelSubscription }) => {
  const chainList = chainPriceData;
  const data = [
    {
      title: "Chain",
      desc: "",
      flex: 1,
    },
    {
      title: "Bronze tables",
      desc: "",
      subData: [
        {
          title: "Archive",
          desc: "",
        },
        {
          title: "Months",
          desc: "",
        },
      ],
      flex: 2,
    },
    {
      title: "Trace tables",
      desc: "",
      subData: [
        {
          title: "Archive",
          desc: "",
        },
        {
          title: "Months",
          desc: "",
        },
      ],
      flex: 2,
    },
    {
      title: "Sub total",
      flex: 1,
    },
    {
      title: "",
      flex: 1,
    },
  ];
  const [calData, setCalData] = useState([{
    chain: "Ethereum",
    bronze: { archive: true, months: 0 },
    trace: { archive: true, months: 0 },
  }]);
  const remainingChainList = chainList.filter(i => !calData.map(c => c.chain).includes(i.chain));
  const createACalData = () => {
    const chain = remainingChainList[0].chain;
    return { chain: chain, bronze: { archive: true, months: 0 }, trace: { archive: true, months: 0 } };
  };

  const calTotal = (array) => {
    return sumBy(array, (item) => {
      const priceObject = chainList.find(c => c.chain === item.chain)
      const bronzePrice = (item.bronze?.archive ? (priceObject.bronze?.historical || 0) : 0) + item.bronze?.months * (priceObject.bronze?.incremental || 0);
      const tracePrice =  (item.trace?.archive ? (priceObject.trace?.historical || 0) : 0) + item.trace?.months * (priceObject.trace?.incremental || 0);
      console.log("xxxxx", item, priceObject, item.bronze?.months * (priceObject.bronze?.incremental || 0), item.bronze?.archive ? (priceObject.bronze?.historical || 0) : 0, bronzePrice)
      return bronzePrice + tracePrice;
    });
  };

  const onBuyAction = () => {
    if (!user) {
      setLoginModalShow({ show: true })
      return ;
    }
    const hide = message.loading("Loading...", 20000);
    setTimeout(() => {
      hide();
      window.open("mailto:sales@footprint.network")
    }, 2000)
  }

  console.log("calDa ta", calData)
  return (
    <div className="cal-price">
      <h2>Sync blockchain historical data in one batch</h2>
      <h3>Learn more about <Link className="text-underline text-underline-hover" style={{ color: "#3434b2" }} to="/batch-download">Batch Download</Link></h3>
      <div className="cal-price__panel">
        <Head data={data}></Head>
        <div className="pt2">{
          calData?.map((item, index) => {
            const priceObject = chainList.find(c => c.chain === item.chain)
            return (
              <div className="cal-price__panel-ul" key={index}>
                <div className="cal-price__panel-ul-li">
                  <Select
                    value={item.chain}
                    options={remainingChainList.map(r => {return {value: r.chain, label: r.chain}})}
                    style={{ width: 150 }}
                    onChange={value => {
                      const array = calData.filter((value, inx) => inx !== index);
                      const object = calData[index];
                      object.chain = value;
                      array.splice(index, 0, object);
                      setCalData(array);
                    }}
                  ></Select>
                </div>

                <div className="cal-price__panel-ul-li">
                  <Switch
                    checked={!!item.bronze?.archive}
                    onClick={() => {
                      const array = calData.filter((value, inx) => inx !== index);
                      const object = calData[index];
                      object.bronze.archive = !object.bronze.archive;
                      array.splice(index, 0, object);
                      setCalData(array);
                    }}
                  />
                </div>
                <div className="cal-price__panel-ul-li">
                  <InputNumber
                    min={0} max={36} value={item.bronze?.months}
                    onChange={value => {
                      const array = calData.filter((value, inx) => inx !== index);
                      const object = calData[index];
                      object.bronze.months = value;
                      array.splice(index, 0, object);
                      setCalData(array);
                    }
                    } />
                </div>
                <div className="cal-price__panel-ul-li">
                  {priceObject.trace ? (
                    <Switch
                      disabled={!priceObject.trace}
                      checked={!!item.trace?.archive}
                      onClick={() => {
                        const array = calData.filter((value, inx) => inx !== index);
                        const object = calData[index];
                        object.trace.archive = !object.trace.archive;
                        array.splice(index, 0, object);
                        setCalData(array);
                      }}
                    />
                  ): (<img src={getOssUrl("icon-price-unavailable.png")} alt={"stop"}/>)}
                </div>
                <div className="cal-price__panel-ul-li">
                  <InputNumber
                    disabled={!priceObject.trace}
                    min={0} max={36}
                    value={item.trace?.months}
                    onChange={value => {
                      const array = calData.filter((value, inx) => inx !== index);
                      const object = calData[index];
                      object.trace.months = value;
                      array.splice(index, 0, object);
                      setCalData(array);
                    }}
                  />
                </div>
                <div className="cal-price__panel-ul-li">
                  <div style={{ fontSize: 20 }}>{`$${calTotal([item]).toLocaleString()}`}</div>
                </div>

                {index === calData.length - 1 && remainingChainList.length > 0 ? (
                  <div className="cal-price__panel-ul-li">
                    <Button
                      style={{ height: 40, lineHeight: "10px" }}
                      primary
                      onClick={() => {
                        setCalData(array => [...array, createACalData()]);
                      }}
                    >+</Button>
                  </div>
                ) : (
                  <div className="cal-price__panel-ul-li">
                    <Button
                      style={{ height: 40, lineHeight: "10px" }}
                      onClick={() => {
                        setCalData(calData.filter((value, inx) => inx !== index));
                      }}
                    >-</Button>
                  </div>
                )}
              </div>
            );
          })
        }
        </div>

        <div className="cal-price__total">
          <div className="flex"><span style={{ width: 120, marginRight: 10, textAlign: "center" }}>Total: </span>
            <h2>{`$${calTotal(calData).toLocaleString()}`}</h2></div>
          <div>
            <Link target="_blank" href="mailto:sales@footprint.network">
              <span style={{ width: 120, marginRight: 10 }}>{"Contact us >"}</span>
            </Link>
            <Button
              primary
              style={{
                height: 40,
                lineHeight: "10px",
                width: "110px",
              }}
              onClick={onBuyAction}
            >
              Buy now
            </Button></div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(CalPrice);
