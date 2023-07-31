/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import "./MyApi.css";
import { get } from "lodash";
import { Avatar, Button, Dropdown, Skeleton, Tooltip } from "antd";
import { useQuery } from "react-query";
import { personalInfo } from "metabase/new-service";
import { getProject } from "metabase/lib/project_info";
import { getOssUrl } from "metabase/lib/image";
import "./MyProfile.css";
import "../../creator/components/personal/index.css";
import Icon from "metabase/components/Icon";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";
import Link from "metabase/core/components/Link";
import { logout } from "metabase/auth/actions";
import * as Urls from "metabase/lib/urls";
import { formatTableTitle } from "metabase/lib/formatting/footprint";
import dayjs from "dayjs";

const MyProfile = props => {
  const { user, name, onLogout } = props;

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
      <div className="my-profile">
        <Skeleton.Avatar active style={{ width: 30, height: 30 }}/>
        <Skeleton.Button active size="small" className="pl1"/>
        <Skeleton.Button active size="small" className="pl1"/>
        <Skeleton.Button active size="small" className="pl1"/>
      </div>
    );
  }

  const getContent = () => {
   return [
     {
       key: 'account-settings',
       label: (
         <Link className="full-width full-height" to={Urls.accountSettings()}>
           Account settings
         </Link>
       ),
     },
     user?.is_superuser && {
        key: 'admin-settings',
        label: (
          <Link className="full-width full-height" to="/admin">
            Admin settings
          </Link>
        ),
      },
     (user?.is_superuser || user?.isMarket) && {
        key: 'upgrade-vip',
        label: (
          <Link className="full-width full-height" to="/market/upgrade">
            Upgrade Vip
          </Link>
        ),
      },
      {
        key: 'sign-out',
        label: (
          <Link className="full-width full-height" onClick={() => onLogout()}>
            Sign out
          </Link>
        ),
      },
     ]
  }
  const vipInfo = user?.vipInfo;
  const dataApiVipInfo = user?.vipInfoDataApi;
  const showFpVip = vipInfo && vipInfo?.type !== "free";
  const showApiVip = dataApiVipInfo && dataApiVipInfo?.type !== "free";
  const getVipToolTip = (info, title) => {
    return `${title}: ${formatTableTitle(info?.type)} plan to ${dayjs(info.validEndDate).format("YYYY-MM-DD")}`;
  }

  return (
    <>
      <div className="my-profile">
        <Tooltip title={desc}>
          {logo ? (
            <img
              src={logo + "?x-oss-process=image/resize,m_fill,h_30,w_30"}
              className="creator__personal-base-logo"
              alt={userName}
            />
          ) : (
            <Avatar size="large" style={{ backgroundColor: "#E4E4FE", width: 30, height: 30, lineHeight: "50px" }}>
              <span style={{ fontSize: 30 }}>
                {String(userName.charAt(0)).toUpperCase()}
              </span>
            </Avatar>
          )}
        </Tooltip>
        <div className="my-profile__right">
          {userName && (
            <div style={{ display: "flex", alignItems: "center"}}>
              <Tooltip title={userName}>
                <h3 className="mr1">{userName}</h3>
              </Tooltip>
              {showFpVip && (
                <Tooltip title={getVipToolTip(vipInfo, "Footprint web")}>
                  <div className="flex justify-center p1">
                    <AboutImage src={getOssUrl("/studio/img-fp-vip.png?x-oss-process=image/resize,m_fill,h_20,w_20")} />
                  </div>
                </Tooltip>
              )}
              {showApiVip && (
                <Tooltip title={getVipToolTip(dataApiVipInfo, "Data API")}>
                  <div className="flex justify-center p1">
                    <AboutImage src={getOssUrl("/studio/img-api-vip.png?x-oss-process=image/resize,m_fill,h_20,w_20")} />
                  </div>
                </Tooltip>
              )}
            </div>
          )}
          {/*<SocialList
            list={[
              { href: twitter, icon: "20220516201254.png", isBlank: true },
              { href: telegram, icon: "20220516201327.png", isBlank: true },
              { href: discord, icon: "20220516201343.png", isBlank: true },
              // { href: `mailto:${email}`, icon: "20220516201357.png" },
            ]}
          />*/}
        </div>
        <div className="my-profile__vertical-line"/>
        <Dropdown
          menu={{ items: getContent() }}
          overlayStyle={{ borderRadius: 10, border: "1px solid #ffffff20", background: "#121728" }}
          dropdownRender={(menu) => {
            console.log("menuj", menu)
            return (
              <div className="my-profile__menu">
                {menu.props.items.filter(Boolean).map(item => {
                  return (
                    <li key={item.key}>
                      {item.label}
                    </li>
                  )
                })}

              </div>
            )
          }}
          placement="rightBottom"
        >
          <div className="px3 cursor-pointer">
            <Icon name="arrow_right_simple" size={14} color="#ffffff90"/>
          </div>
        </Dropdown>
      </div>
    </>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
  };
};

const mapDispatchToProps = {
  onLogout: logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
