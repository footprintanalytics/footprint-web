/* eslint-disable react/prop-types */

import React from "react";
import PreviewDashboardCard from "metabase/components/PreviewDashboardCard";

const PreviewList = props => {
  const { section, shareAction } = props;

  return (
    <div className="home-dashboard-container">
      <div className="home-dashboard-list">
        {section.items.map(item => (
          <PreviewDashboardCard
            key={item.id + item.name}
            item={item}
            shareAction={shareAction}
          />
        ))}
      </div>
    </div>
  );
};

export default PreviewList;
