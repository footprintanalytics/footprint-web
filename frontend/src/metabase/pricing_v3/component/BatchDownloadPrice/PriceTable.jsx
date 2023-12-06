/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { loginModalShowAction } from "metabase/redux/control";
import Head from "./Head";
import Content from "./Content";
import { chainPriceData } from "metabase/pricing_v3/component/BatchDownloadPrice/data";

const PriceTable = ({ user, setLoginModalShow, onCancelSubscription }) => {
  const data = [
    {
      title: "Chain",
      desc: "",
      flex: 1,
    },
    {
      title: "Bronze tables",
      tooltip: "Chain_blocks\n" +
        "Chain_transactions\n" +
        "Chain_token_transfers\n" +
        "Chain_logs\n" +
        "Notice: Non-EVM chains normally don't have transactions/token transfers tables",
      desc: "",
      subData: [
        {
          title: "Historical data",
          desc: "(One time fee)",
        },
        {
          title: "Incremental data",
          desc: "(Monthly subscription)",
        },
      ],
      flex: 2,
    },
    {
      title: "Trace tables",
      desc: "",
      subData: [
        {
          title: "Historical data",
          desc: "(One time fee)",
        },
        {
          title: "Incremental data",
          desc: "(Monthly subscription)",
        },
      ],
      flex: 2,
    },
  ]


  return (
    <div className="price-table">
      <Head data={data}></Head>
      <Content data={chainPriceData}></Content>
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

export default connect(mapStateToProps, mapDispatchToProps)(PriceTable);
