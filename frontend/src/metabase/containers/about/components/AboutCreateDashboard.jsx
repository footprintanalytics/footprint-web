/* eslint-disable react/prop-types */
import React from "react";
import AboutSection from "metabase/containers/about/components/AboutSection";

const AboutCreateDashboard = props => {
  const { data, list, title, className } = props;
  return (
    <div className={className}>
      <div className="About__title">{title}</div>
      {data && (
        <div className={"About__explore-chains-panel"}>
          {data?.map((item, index) => {
            return (
              <React.Fragment key={item.title}>
                {index > 0 && <div className="divider" />}
                <div className={"About__explore-chains-panel-item"}>
                  <h3>{item.value}</h3>
                  <span>{item.title}</span>
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
          list={item.list}
          height={item.height}
          exploreButton={item.exploreButton}
        />
      ))}
    </div>
  );
};

export default AboutCreateDashboard;
