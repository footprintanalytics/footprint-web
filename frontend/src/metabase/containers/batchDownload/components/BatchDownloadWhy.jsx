/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import { getOssUrl } from "metabase/lib/image";
import Link from "metabase/core/components/Link";
const BatchDownloadWhy = () => {

  const data = [
    {
      title: "10X faster",
      list: [
        "Fetch full history data within 1 day",
        "Cover full history & incremental",
      ],
      img: "batch-download/img_why_1.png",
    },
    {
      title: "80% cost saved",
      list: [
        "Far cheaper than nodes and self-build",
        "Affordable, developer-first pricing"
      ],
      img: "batch-download/img_why_2.png",
    },
    {
      title: "99.99% uptime",
      list: [
        "Always available, stringent verification process with thousands of test cases passed and proprietary model for curation",
      ],
      img: "batch-download/img_why_3.png",
    },
  ];

  const chainTablesLink = [
    {
      name: "transaction",
      link: "/@Footprint/Table-Info-Dashboard?table_name=ethereum_transactions",
    },
    {
      name: "token_transfers",
      link: "/@Footprint/Table-Info-Dashboard?table_name=ethereum_token_transfers",
    },
    {
      name: "traces",
      link: "/@Footprint/Table-Info-Dashboard?table_name=ethereum_traces",
    },
    {
      name: "block",
      link: "/@Footprint/Table-Info-Dashboard?table_name=ethereum_blocks",
    },
    {
      name: "event",
      link: "/@Footprint/Table-Info-Dashboard?table_name=ethereum_decoded_events",
    },
    {
      name: "logs",
      link: "/@Footprint/Table-Info-Dashboard?table_name=ethereum_logs",
    },
  ];

  const domainLeftLink = [
    {
      name: "nft_transaction",
      link: "/@Footprint/Table-Info-Dashboard?table_name=nft_transactions",
    },
    {
      name: "nft_transfers",
      link: "/@Footprint/Table-Info-Dashboard?table_name=nft_transfers",
    },
    {
      name: "nft_token_attributes",
      link: "/@Footprint/Table-Info-Dashboard?table_name=nft_token_attributes",
    },
    {
      name: "nft_orders",
      link: "/@Footprint/Table-Info-Dashboard?table_name=nft_orders",
    },
    {
      name: "gamefi",
      link: "/@Footprint/Table-Info-Dashboard?table_name=protocol_transactions",
    },
  ];

  const pics = [
    {
      title: "26 chains",
      list: ["raw and structure"],
      img: "batch-download/img_why_chain.png",
      layout: (
        <div className="batch-download__why-left-root">
          {chainTablesLink.map(item => {
            return (
              <Link className="batch-download__why-left-root-link" to={item.link} key={item.name}>
              </Link>
            )
          })}
        </div>
      )
    },
    {
      title: "Abstract domain",
      img: "batch-download/img_why_list.png?1=1",
      layout: (
        <div className="batch-download__why-right-root">
          {domainLeftLink.map(item => {
            return (
              <Link className="batch-download__why-right-root-link" to={item.link} key={item.name}>
              </Link>
            )
          })}
        </div>
      )
    },
  ]

  const renderInner = (className, item) => {
    return (
      <li className={className} key={item.title} >
        <div className="batch-download__why-li-inner">
          <h3>{item.title}</h3>
          {item.list?.map(l => {
            return <li className="batch-download__why-li-inner-li" key={l}>{l}</li>
          })}
        </div>
        {item.layout}
        <div style={{ height: "100%", width: "100%", background: `url("${getOssUrl(item.img)}")`, backgroundSize: "cover", position: "absolute", bottom: 0, right: 0, }}/>
      </li>
    )
  }

  return (
    <div className="batch-download__why">
      <h1>Why Footprint?</h1>
      <span>{`Footprint's data infrastructure provides you with affordable, efficient, and high-performing services. Start building today.`}</span>
      <div className="batch-download__why-one">
        <ul>
          {data.map(item => renderInner("batch-download__why-one-li", item))}
        </ul>
      </div>
      <div className="batch-download__why-two">
        <ul>
          {pics.map(item => renderInner("batch-download__why-two-li", item))}
        </ul>
      </div>
    </div>
  );
};

export default BatchDownloadWhy;
