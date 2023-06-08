/* eslint-disable react/prop-types */
import React from "react";
import "./index.css";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import _ from "underscore";
import Icon from "metabase/components/Icon";
import Link from "metabase/core/components/Link";
import { trackStructEvent } from "metabase/lib/analytics";
import { loginModalShowAction } from "metabase/redux/control";
import { getUser } from "metabase/selectors/user";
import { isDefi360 } from "metabase/lib/project_info";
import * as Urls from "metabase/lib/urls";
import { isFgaPath } from "metabase/growth/utils/utils"

const Profile = props => {
  const { user, setLoginModalShow, onChangeLocation } = props;
  const actions = [
    {
      title: "Create\nChart",
      background: "#FF8B00",
      action: Urls.newQuestion(),
      icon: "create_chart",
    },
    {
      title: "SQL\nQuery",
      background: "#14CDAA",
      action: Urls.newQuestion({ type: "native" }),
      icon: "sql_query",
    },
    {
      title: "Create\nDashboard",
      background: "#7155FF",
      action: `${isFgaPath() ? "/growth" : ""}/dashboard/new`,
      icon: "create_dashboard",
    },
  ];
  const hintLines = [
    "You can also:",
    "1. Duplicate charts/dashboards",
    "2. Change filters of charts/dashboards",
  ];
  const isLogin = () => {
    if (user) {
      return true;
    } else {
      setLoginModalShow({ show: true, from: "Dashboards Profile" });
      return false;
    }
  };
  const onCreateAction = () => {
    if (isLogin()) {
      window.open(actions[0].action);
    }
  };

  const myProfileUrl = `/@${user?.name}`;

  return (
    <div className="dashboards__profile">
      <div className="dashboards__area">
        <Link
          href={user ? myProfileUrl : ""}
          onClick={e => {
            e.preventDefault();
            if (isLogin()) {
              onChangeLocation(myProfileUrl);
            }
            trackStructEvent("Dashboards My profile");
          }}
        >
          <div className="dashboards__cell">
            <h2>My Profile</h2>
            {">"}
          </div>
        </Link>
        <div className="dashboards__profile-actions">
          {actions.map(item => {
            return (
              <div
                key={item.title}
                className="dashboards__profile-action-item"
                onClick={() => {
                  if (isLogin()) {
                    window.open(item.action);
                  }
                }}
              >
                <div
                  className="dashboards__profile-action-bg"
                  style={{ background: item.background }}
                >
                  <Icon name={item.icon} color="white" size={20} />
                </div>
                <div className="dashboards__profile-action-title">
                  {item.title}
                </div>
              </div>
            );
          })}
        </div>
        <div className="dashboards__profile-also">
          {hintLines.map(item => (
            <div key={item}>{item}</div>
          ))}
        </div>
        <div
          className="bg-brand dashboards__profile-create footprint-primary-text"
          onClick={onCreateAction}
        >
          <Icon name="plus" size={12} />
          <span>Create</span>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => ({
  user: getUser(state, props),
});

const mapDispatchToProps = {
  onChangeLocation: push,
  setLoginModalShow: loginModalShowAction,
};

export default _.compose(connect(mapStateToProps, mapDispatchToProps))(Profile);
