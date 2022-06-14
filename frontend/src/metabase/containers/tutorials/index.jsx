/* eslint-disable react/prop-types */
import TitleBanner from "metabase/components/TitleBanner";
import React from "react";
import Category from "../explore/components/Category";
import { getOssUrl } from "../../lib/image";
import "../explore/index.css";
import "./index.css";

const Tutorials = props => {
  const { routes, location, router, children } = props;

  const indexPath = "/tutorials";
  const pathConfig = {
    [`${indexPath}/visualizations`]: {
      title: "Featured Charts",
      desc: `Find insights in your data, create dashboards and share your findings.`,
      bg: getOssUrl("tutorials_visualizations_banner.jpg"),
    },
    [`${indexPath}/videos`]: {
      title: "Tutorial Videos",
      desc: `Footprint product videos showing how to use and what you can do with Footprint.`,
      bg: getOssUrl("tutorials_videos_banner.jpg"),
    },
    [`${indexPath}/indicators`]: {
      title: "Indicators",
      desc: "Footprint provides 100+ indicators to analyze data.",
      bg: getOssUrl("tutorials_indicators_banner.jpg"),
    },
  };

  const category = pathConfig[location.pathname] || {};
  const categoryList = routes
    .find(item => item.path === indexPath)
    .childRoutes.map(item => ({
      label: item.title,
      path: item.path,
      seoLink: `${indexPath}/${item.path}`,
      selected: location.pathname.includes(item.path),
    }));

  return (
    <div className="tutorials bg-gray">
      <Category
        categoryList={categoryList}
        onCategoryClick={item => router.push(`${indexPath}/${item.path}`)}
      />
      <div className="tutorials__wrap">
        <TitleBanner
          title={category.title}
          desc={category.desc}
          bg={category.bg}
        />
        <div className="tutorials__body">{children}</div>
      </div>
    </div>
  );
};

export default Tutorials;
