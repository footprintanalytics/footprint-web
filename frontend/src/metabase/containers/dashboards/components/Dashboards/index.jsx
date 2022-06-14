/* eslint-disable react/prop-types */
import React from "react";
import Tags from "../Tags";
import "./index.css";
import List from "./List";
// import Sort from "./Sort";
import Category from "./Category";
import { getDashboardQueryTags } from "../../shared/utils";

const Dashboards = ({ router, user }) => {
  const tags = getDashboardQueryTags(router.location.query.tags);

  return (
    <div>
      <div className="dashboards__cell">
        <h2>Dashboard</h2>
      </div>
      <div className="dashboards__filter">
        <Category router={router} />
        {/* <Sort router={router} /> */}
      </div>
      <div className="dashboards__tags-filter">
        <Tags router={router} list={tags} closable />
      </div>
      <List user={user} router={router} />
    </div>
  );
};

export default Dashboards;
