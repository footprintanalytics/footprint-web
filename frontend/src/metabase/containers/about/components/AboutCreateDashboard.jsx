/* eslint-disable react/prop-types */
import React from "react";
import AboutSection from "metabase/containers/about/components/AboutSection";
import { Spin } from "antd";

const AboutCreateDashboard = props => {
  const { data, list, title, className } = props;
  return (
    <div className={className}>
      <div className="About__title">{title}</div>
      {data && (
        <div className={"About__explore-domain-panel"}>
          {data?.map((item, index) => {
            return (
              <React.Fragment key={item.title}>
                {index > 0 && <div className="divider" />}
                <div className={"About__explore-domain-panel-item"}>
                  <b>{item.total ? item.total.toLocaleString() : <Spin />}</b>
                  <h3>{item.title}</h3>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
      {list?.map(item => (
        <AboutSection
          key={item.subTitle}
          reverse={item.reverse}
          borderless={item.borderless}
          title={item.title}
          subTitle={item.subTitle}
          desc={item.desc}
          hideBoxShadow={item.hideBoxShadow}
          list={item.list}
          height={item.height}
          exploreButton={item.exploreButton}
          exploreTip={item.exploreTip}
        />
      ))}
    </div>
  );
};

export default AboutCreateDashboard;
