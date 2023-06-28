/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import DeveloperApp from "metabase/account/developer/containers/DeveloperApp/DeveloperApp";
import "./MyApi.css";
import Statistics from "metabase/containers/dataApi/statistics";
import VipIcon from "metabase/containers/creator/components/personal/VipIcon";
import { get } from "lodash";
import VipIconDataApi from "metabase/containers/creator/components/personal/VipIconDataApi";
import Link from "metabase/core/components/Link/Link";
import { trackStructEvent } from "metabase/lib/analytics";
import { Avatar, Button, Skeleton } from "antd";
import { EditFilled } from "@ant-design/icons";
import { useQuery } from "react-query";
import { personalInfo } from "metabase/new-service";
import { getProject } from "metabase/lib/project_info";
import { getOssUrl } from "metabase/lib/image";
import "./MyProfile.css"

const MyProfile = props => {
  const { user, name, location } = props;

  const personalInfoParams = {
    name: name,
    project: getProject(),
  };

  const { isLoading, data, error } = useQuery(
    ["personalInfo", personalInfoParams],
    async () => {
      return personalInfo(personalInfoParams);
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  const logo = get(data, "userInfo.avatar");
  const userName = get(data, "userInfo.name");

  if (isLoading) {
    return <Skeleton active />;
  }

  return (
    <>
      <div className="my-profile">
        {logo ? (
          <img
            src={logo + "?x-oss-process=image/resize,m_fill,h_60,w_60"}
            className="creator__personal-base-logo"
            alt={userName}
          />
        ) : (
          <Avatar size="large" style={{ backgroundColor: "#E4E4FE" }}>
            <span style={{ fontSize: 40 }}>
              {String(userName.charAt(0)).toUpperCase()}
            </span>
          </Avatar>
        )}
        {userName && (
          <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
            <h3 style={{ WebkitBoxOrient: "vertical", }}>{userName}</h3>
          </div>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
  };
};

export default connect(mapStateToProps)(MyProfile);
