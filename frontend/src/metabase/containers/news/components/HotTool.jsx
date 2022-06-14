/* eslint-disable react/prop-types */
import connect from "react-redux/lib/connect/connect";
import Hots from "metabase/containers/news/components/Hots";
import React from "react";
import { dashboardMap, menuData } from "metabase/containers/tools/data";
import flatten from "underscore/modules/_flatten";
import { guestUrl } from "metabase/lib/urls";

const HotTool = props => {
  const list = flatten(
    menuData.map(menu => {
      return menu.subMenus.map(subMenu => {
        return {
          menuValue: menu.value,
          ...subMenu,
        };
      });
    }),
  )
    .slice(0, 5)
    .map(item => {
      const dashboard = dashboardMap[item.value];
      return {
        id: dashboard.publicUuid,
        title: dashboard.name,
        url: guestUrl({
          publicUuid: dashboard.publicUuid,
          type: "dashboard",
          name: dashboard.name,
        }),
      };
    });
  return <Hots list={list} moreLink="/" title="5+ Hot Tools" icon="hotTool" />;
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(HotTool);
