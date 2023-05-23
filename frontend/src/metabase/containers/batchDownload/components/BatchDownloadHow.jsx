/* eslint-disable react/prop-types */
import React from "react";
import "../index.css";
import Link from "metabase/core/components/Link";

const BatchDownloadHow = () => {

  const data = [
    {
      title: "Select data",
      desc: (
        <div>{"Speak with our sales team to build your custom data plan. To get started, "}
          <Link
            target="_blank"
            className="text-underline text-underline-hover"
            style={{ color: "#3434B2"}}
            to={"https://calendly.com/partners-79/footprint-growth-analytics-demo"}
          >
            book a call.
          </Link>
        </div>
      )
    },
    {
      title: "Data push",
      desc: "Receive a data dump containing the history, data types and instruments that accompany your license."
    },
  ];


  return (
    <div className="batch-download__how">
      <h1>How it works</h1>
      <div className="batch-download__how-steps">
        <div className="batch-download__how-step">1</div>
        <div className="batch-download__how-arrow"/>
        <div className="batch-download__how-step">2</div>
        <div className="batch-download__how-arrow-box"/>
      </div>
      <ul>
        {data.map(item => {
          return (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <span>{item.desc}</span>
            </li>
          )
        })}
      </ul>
    </div>
  );
};

export default BatchDownloadHow;
