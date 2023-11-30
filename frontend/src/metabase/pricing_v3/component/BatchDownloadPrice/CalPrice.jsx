/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import Link from "metabase/core/components/Link";
import Head from "./Head";
import Button from "metabase/core/components/Button/Button";
import { InputNumber, message, Select, Switch } from "antd";
import { debounce, sumBy } from "lodash";
import { chainPriceData } from "metabase/pricing_v3/component/BatchDownloadPrice/data";
import Icon from "metabase/components/Icon";
import { getOssUrl } from "metabase/lib/image";
import { createBudgetRecord } from "metabase/new-service";
import CreateProjectModal2 from "metabase/ab/components/Modal/CreateProjectModal2";
import BuyModal from "metabase/pricing_v3/component/BatchDownloadPrice/BuyModal";
import { trackStructEvent } from "metabase/lib/analytics";

const CalPrice = ({ user, setLoginModalShow, onCancelSubscription }) => {
  const chainList = chainPriceData;
  const data = [
    {
      title: "Chain",
      desc: "",
      flex: 1.2,
    },
    {
      title: "Bronze tables",
      desc: "",
      tooltip: "The bronze table includes the followings:\n" +
        "Chain_blocks\n" +
        "Chain_transactions\n" +
        "Chain_token_transfers\n" +
        "Chain_logs\n" +
        "\n" +
        "Notice: Non-EVM chains normally don't have transactions/token transfers tables.",
      subData: [
        {
          title: "Archive",
          desc: "",
          tooltip: "Access our extensive historical data for a one-time fee.",
        },
        {
          title: "Months",
          desc: "",
          tooltip: "Subscribe to our monthly plan for access to incremental data updates.",
        },
      ],
      flex: 1.7,
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
      flex: 1.7,
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
    bronze: { archive: true, months: 12 },
    trace: { archive: true, months: 12 },
  }]);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const remainingChainList = chainList.filter(i => !calData.map(c => c.chain).includes(i.chain));
  const createACalData = () => {
    const chain = remainingChainList[0].chain;
    const bronzeArchive = !!remainingChainList[0].bronze;
    const traceArchive = !!remainingChainList[0].trace
    const bronzeMonthsInit = bronzeArchive ? 12 : 0
    const traceMonthsInit = traceArchive ? 12 : 0
    return { chain: chain, bronze: { archive: bronzeArchive, months: bronzeMonthsInit }, trace: { archive: traceArchive, months: traceMonthsInit } };
  };

  const calTotal = (array) => {
    return sumBy(array, (item) => {
      const priceObject = chainList.find(c => c.chain === item.chain)
      const bronzePrice = (item.bronze?.archive ? (priceObject.bronze?.historical || 0) : 0) + item.bronze?.months * (priceObject.bronze?.incremental || 0);
      const tracePrice =  (item.trace?.archive ? (priceObject.trace?.historical || 0) : 0) + item.trace?.months * (priceObject.trace?.incremental || 0);
      return bronzePrice + tracePrice;
    });
  };

  const onBuyAction = async () => {
    trackStructEvent(`batch-download-price buy now`);
    if (!user) {
      setLoginModalShow({ show: true })
      return;
    }
    setShowBuyModal(true);
  }

  const record = async (email, telegram) => {
    const hide = message.loading("Loading...", 20000);
    const params = {
      email: email,
      telegram: telegram || "",
      total: calTotal(calData),
      detail: JSON.stringify(calData
        .filter(el => {
          return calTotal([el]) > 0
        })
        .map(el => {
          return {
            chain: el.chain,
            bronze_months: el.bronze.months,
            bronze_archive: el.bronze.archive,
            trace_months: el.trace.months,
            trace_archive: el.trace.archive,
            total: calTotal([el]),
          }
        }))
    }
    await createBudgetRecord(params)
    hide();
    setTimeout(() => {
      message.success("Submit success");
    }, 500)
  }

  const debounceEventHandler = (...args) => {
    const debounced = debounce(...args);
    return e => {
      e.stopPropagation();
      return debounced(e);
    };
  };

  return (
    <div className="cal-price">
      <h2>Sync blockchain historical data in one batch</h2>
      <h3>Learn more about <Link className="text-underline text-underline-hover" style={{ color: "#3434b2" }} to="/batch-download">Batch Download</Link></h3>
      <div className="cal-price__panel">
        <Head data={data}></Head>
        <div className="cal-price__table">{
          calData?.map((item, index) => {
            const priceObject = chainList.find(c => c.chain === item.chain)
            return (
              <div className="cal-price__panel-ul" key={index}>
                <div className="cal-price__panel-ul-li" style={{ flex: 1 }}>
                  <Select
                    value={item.chain}
                    options={remainingChainList.map(r => {return {value: r.chain, label: r.chain}})}
                    style={{ width: 150 }}
                    onChange={value => {
                      const array = calData.filter((value, inx) => inx !== index);
                      const object = calData[index];
                      object.chain = value;
                      const chainValue = chainList.find(c => c.chain === value)
                      if (!chainValue.trace) {
                        object.trace = {
                          archive: false,
                          months: 0,
                        }
                      }
                      if (!chainValue.bronze) {
                        object.bronze = {
                          archive: false,
                          months: 0,
                        }
                      }
                      array.splice(index, 0, object);
                      setCalData(array);
                    }}
                  ></Select>
                </div>

                <div className="cal-price__panel-ul-li" style={{ flex: 2 }}>
                  <div className="cal-price__panel-ul-li-sub">
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
                  <div className="cal-price__panel-ul-li-sub">
                    <InputNumber
                      min={0} max={36} value={item.bronze?.months}
                      onChange={value => {
                        const array = calData.filter((value, inx) => inx !== index);
                        const object = calData[index];
                        object.bronze.months = value;
                        array.splice(index, 0, object);
                        setCalData(array);
                      }}
                    />
                  </div>
                </div>

                <div className="cal-price__panel-ul-li" style={{ flex: 2 }}>
                  <div className="cal-price__panel-ul-li-sub">
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
                  <div className="cal-price__panel-ul-li-sub">
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
                </div>

                <div className="cal-price__panel-ul-li" style={{ flex: 1 }}>
                  <div style={{ fontSize: 20 }}>{`$${calTotal([item]).toLocaleString()}`}</div>
                </div>

                <div className="cal-price__panel-ul-li" style={{ flex: 1 }}>
                  <Button
                    style={{ height: 40, lineHeight: "10px" }}
                    onClick={() => {
                      setCalData(calData.filter((value, inx) => inx !== index));
                    }}
                  >
                    -
                  </Button>
                </div>
              </div>
            );
          })
        }
        </div>

        <div className="cal-price__bottom">
          <div className="cal-price__add-button">
            <Button
              style={{ height: 40, lineHeight: "10px", width: 150 }}
              primary
              onClick={() => {
                trackStructEvent(`batch-download-price add button`);
                setCalData(array => [...array, createACalData()]);
              }}
            >
              +
            </Button>
          </div>
          <div className="cal-price__total">
            <div className="flex bold align-center">
              <span style={{ width: 120, marginRight: 10, textAlign: "center" }}>Total: </span>
              <h2>{`$${calTotal(calData).toLocaleString()}`}</h2></div>
            <div>
              <Link target="_blank" href="mailto:sales@footprint.network">
                <span style={{ width: 120, marginRight: 20 }}>{"Contact us >"}</span>
              </Link>
              <Button
                primary
                style={{
                  height: 40,
                  lineHeight: "10px",
                  width: "110px",
                  fontSize: "18px",
                }}
                disabled={calTotal(calData) === 0}
                onClick={debounceEventHandler(onBuyAction, 200)}
              >
                Buy now
              </Button></div>
          </div>
        </div>
      </div>
      <BuyModal
        open={showBuyModal}
        force={false}
        onCancel={() => {
          setShowBuyModal(false)
        }}
        onFinish={(value) => {
          record(value.email, value.telegram)
          setShowBuyModal(false)
        }}
      />
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
