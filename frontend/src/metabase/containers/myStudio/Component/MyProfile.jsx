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
import { Avatar, Button, Skeleton, Tooltip } from "antd";
import { EditFilled } from "@ant-design/icons";
import { useQuery } from "react-query";
import { personalInfo } from "metabase/new-service";
import { getProject } from "metabase/lib/project_info";
import { getOssUrl } from "metabase/lib/image";
import "./MyProfile.css"
import { DotChartOutlined } from "@ant-design/icons";
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
  const desc = get(data, "userInfo.bio");
  const twitter = get(data, "userInfo.twitter");
  const telegram = get(data, "userInfo.telegram");
  const discord = get(data, "userInfo.discord");

  const SocialList = ({ list }) => {
    return (
      <ul className="creator__personal-cell-social">
        {[...list.filter(f => f.href), ...list.filter(f => !f.href)].map(item => (
          <li
            key={item.icon}
            className={!item.href ? "creator__personal-cell-social--empty" : ""}
          >
            {item.href ? (
              item.href.startsWith("http") ? (
                <a
                  href={item.href}
                  target={item.isBlank ? "_blank" : ""}
                  rel="nofollow"
                >
                  <img src={getOssUrl(item.icon)} alt={item.href} />
                </a>
              ) : (
                <div className="creator__personal-cell-social--with">
                  <Tooltip title={item.href.startsWith("@") ? item.href : "@" + item.href}>
                    <img src={getOssUrl(item.icon)} alt={item.href} />
                  </Tooltip>
                </div>
              )
            ) : (
              <img src={getOssUrl(item.icon)} alt={item.href} />
            )}
          </li>
        ))}
      </ul>
    );
  };

  if (isLoading) {
    return (
      <div className="p2 flex flex-column align-center">
        <Skeleton.Avatar active style={{ width: 60, height: 60 }}>
        </Skeleton.Avatar>
        <br />
        <Skeleton.Button active size="small"/>
      </div>
    );
  }

  return (
    <>
      <div className="my-profile">
        <Tooltip title={desc}>
          {logo ? (
            <img
              src={logo + "?x-oss-process=image/resize,m_fill,h_60,w_60"}
              className="creator__personal-base-logo"
              alt={userName}
            />
          ) : (
            <Avatar size="large" style={{ backgroundColor: "#E4E4FE", width: 60, height: 60, lineHeight: "50px" }}>
              <span style={{ fontSize: 30 }}>
                {String(userName.charAt(0)).toUpperCase()}
              </span>
            </Avatar>
          )}
        </Tooltip>
        {userName && (
          <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
            <h3 style={{ WebkitBoxOrient: "vertical", }}>{userName}</h3>
          </div>
        )}
        <SocialList
          list={[
            { href: twitter, icon: "20220516201254.png", isBlank: true },
            { href: telegram, icon: "20220516201327.png", isBlank: true },
            { href: discord, icon: "20220516201343.png", isBlank: true },
            // { href: `mailto:${email}`, icon: "20220516201357.png" },
          ]}
        />
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
