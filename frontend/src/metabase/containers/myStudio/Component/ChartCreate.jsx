/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import StudioTitle from "metabase/containers/myStudio/Component/StudioTitle";
import * as Urls from "metabase/lib/urls";
import "./ChartCreate.css";
import { getOssUrl } from "metabase/lib/image";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";
import Link from "metabase/core/components/Link";

const ChartCreate = () => {
  const data = [
    {
      title: "0 Coding Chart",
      desc: "Pick some data, view it, and easily filter, summarize, and visualize it.",
      url: Urls.newQuestion({ type: "query" }),
      icon: getOssUrl("/studio/img-studio-create-1.png"),
    },
    {
      title: "SQL Chart",
      desc: "For more complicated queries, you can write your own SQL or native query.",
      url: Urls.newQuestion({ type: "native", creationType: "native_question" }),
      icon: getOssUrl("/studio/img-studio-create-3.png"),
    },
    {
      title: "New Dashboard",
      desc: "Pick some data, view it, and easily filter, summarize, and visualize it.",
      url: "dashboard/new#from=studio",
      icon: getOssUrl("/studio/img-studio-create-2.png"),
    },

  ]

  return (
    <>
      <div className={"chart-create"}>
        <StudioTitle title={"Create"}/>
        <ul>
          {data.map(item => {
            return (
              <li key={item.title}>
                <AboutImage
                  src={item.icon}
                  alt={item.title}
                />
                <h3>{item.title}</h3>
                <span>{item.desc}</span>
                <Link className="chart-create__button" to={item.url}>
                  + Create
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
  };
};

export default connect(mapStateToProps)(ChartCreate);
