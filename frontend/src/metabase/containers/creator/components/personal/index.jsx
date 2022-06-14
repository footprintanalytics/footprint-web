/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/prop-types */

import React from "react";
import { Avatar, Skeleton, Button } from "antd";
import "./index.css";
import { getProject } from "metabase/lib/project_info";
import { useQuery } from "react-query";
import { personalInfo } from "metabase/new-service";
import { get } from "lodash";
import VipIcon from "metabase/containers/creator/components/personal/VipIcon";
import Link from "metabase/components/Link";
import { trackStructEvent } from "metabase/lib/analytics";
import { IconBack } from "metabase/components/IconBack";
import { getOssUrl } from "metabase/lib/image";
import { EditFilled } from "@ant-design/icons";

const Index = ({ router, user, name }) => {
  const totalInfo = [
    {
      title: "Dashboards",
      count: "dashboardTotal",
    },
    {
      title: "Charts",
      count: "cardTotal",
    },
    {
      title: "Views",
      count: "viewTotal",
    },
    {
      title: "Favorites",
      count: "favoriteTotal",
    },
  ];

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

  if (isLoading) {
    return (
      <div className="creator__personal">
        <Skeleton active />
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const logo = get(data, "userInfo.avatar");
  const userName = get(data, "userInfo.name");
  const desc = get(data, "userInfo.bio");
  const twitter = get(data, "userInfo.twitter");
  const telegram = get(data, "userInfo.telegram");
  const discord = get(data, "userInfo.discord");
  // const email = get(data, "userInfo.email");

  return (
    <div className="creator__personal">
      <div className="creator__personal-base">
        <IconBack router={router} />
        {logo ? (
          <img
            src={logo + "?x-oss-process=image/resize,m_fill,h_120,w_120"}
            className="creator__personal-base-logo"
            alt={userName}
          />
        ) : (
          <Avatar size="large" style={{ backgroundColor: "#E4E4FE" }}>
            {String(userName.charAt(0)).toUpperCase()}
          </Avatar>
        )}
        <div className="creator__personal-cell">
          {userName && (
            <div style={{ display: "flex" }}>
              <h3 style={{ WebkitBoxOrient: "vertical" }}>{userName}</h3>
              <VipIcon vipInfo={data.vipInfo} />
            </div>
          )}
          {desc && (
            <div
              className="creator__personal-cell-desc"
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          )}
          <SocialList
            list={[
              { href: twitter, icon: "20220516201254.png", isBlank: true },
              { href: telegram, icon: "20220516201327.png", isBlank: true },
              { href: discord, icon: "20220516201343.png", isBlank: true },
              // { href: `mailto:${email}`, icon: "20220516201357.png" },
            ]}
          />
          {user?.id === get(data, "userInfo.metabaseId") && (
            <div className="creator__personal-cell-buttons">
              <Link
                to="/account/profile"
                onClick={() => trackStructEvent("creator click edit")}
              >
                <Button icon={<EditFilled />}>Edit Profile</Button>
              </Link>
              {get(data, "vipInfo.type") !== "pro" && (
                <Link
                  to="/pricing"
                  target="_blank"
                  onClick={() => trackStructEvent("creator click upgrade")}
                >
                  <Button>Upgrade</Button>
                </Link>
              )}
            </div>
          )}

          {/*<div>
            {socialData.map(item => {
              return (
                <Link
                  className="creator__personal-social-item"
                  key={item.label}
                  to={item.url}
                  onClick={e => {
                    e.preventDefault();
                    trackStructEvent(
                      `creator-personal click social out ${item.label}`,
                    );
                    window.open(item.url, "_blank");
                  }}
                >
                  <Icon name={item.icon} size={20} color={color("brand")} />
                </Link>
              );
            })}
          </div>*/}
        </div>
      </div>
      <div className="creator__personal-right">
        {totalInfo.map((item, index) => {
          return (
            <div key={item.title} className="creator__personal-right-item">
              {index > 0 && (
                <div className="creator__personal-right-item-split" />
              )}
              <div className="creator__personal-right-item-left">
                <h3>{get(data, item.count)}</h3>
                <div>{item.title}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

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
                <img src={getOssUrl(item.icon)} alt={item.href} />
                {item.href.startsWith("@") ? item.href : "@" + item.href}
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

export default Index;
