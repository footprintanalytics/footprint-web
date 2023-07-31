/* eslint-disable react/prop-types */
import React from "react";
import List from "metabase/containers/creator/components/personal/list";
import StudioTitle from "metabase/containers/myStudio/Component/StudioTitle";

const StudioDashboards = props => {
  const {user, router, type, title} = props
  const name = user?.name;
  const renderComponent = (type) => {
    if (type === "dashboards") {
      return (
        <List
          key="dashboards"
          user={user}
          name={name}
          location={router.location}
          router={router}
          defaultModel="dashboard"
          hideToggleView
          hideTabsBar
          showTabs={
            {
              all: false,
              dashboard: true,
              card: false,
              favorite: false,
              table: false,
            }
          }
        />
      )
    }
    if (type === "charts") {
      return (
        <List
          key="charts"
          user={user}
          name={name}
          location={router.location}
          router={router}
          defaultModel="card"
          hideToggleView
          hideTabsBar
          showTabs={
            {
              all: false,
              dashboard: false,
              card: true,
              favorite: false,
              table: false,
            }
          }
        />
      )
    }
    if (type === "favorites") {
      return (
        <List
          key="favorites"
          user={user}
          name={name}
          location={router.location}
          router={router}
          defaultModel="favorite"
          hideToggleView
          hideTabsBar
          showTabs={
            {
              all: false,
              dashboard: false,
              card: false,
              favorite: true,
              table: false,
            }
          }
        />
      )
    }
    if (type === "datasets") {
      return (
        <List
          key="my-datasets"
          user={user}
          name={name}
          location={router.location}
          router={router}
          defaultModel="table"
          hideTabsBar={true}
          showTabs={
            {
              all: false,
              dashboard: false,
              card: false,
              favorite: false,
              table: true,
            }
          }
        />
      )
    }
    return (
      <></>
    )
  }

  return (
    <div className={""}>
      <StudioTitle title={title}/>
      {renderComponent(type)}
    </div>
  );
};

export default StudioDashboards;
