/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { connect } from "react-redux";
import "./MyApi.css";
import { get } from "lodash";
import { Avatar, Dropdown, Skeleton, Tooltip, Tag } from "antd";
import { useQuery } from "react-query";
import dayjs from "dayjs";
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
import { useGetPaymentSubscriptionDetail } from "metabase/pricing_v2/use";
import SubscriptionDetailModal from "metabase/containers/creator/components/personal/SubscriptionDetailModal";

const MyProfile = props => {
  const { user, name, onLogout, showMenu = true, textMode = false } = props;
  const [showSubscriptionDetailModal, setShowSubscriptionDetailModal] = useState(false);

  const personalInfoParams = {
    name: name,
    project: getProject(),
  };
  const isProFga = window.location.pathname.startsWith("/fga/pro")
  const { subscriptionDetailData, refetch } = useGetPaymentSubscriptionDetail(user, isProFga ? "fga" : "footprint", () => !!user);
  console.log("subscriptionDetailData", subscriptionDetailData)
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

  const subscriptionDetailList = subscriptionDetailData?.list;
  const showSubscriptionCancelButton = subscriptionDetailList?.length > 0;

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
      !isProFga && {
       key: 'account-settings',
       label: (
         <Link className="my-profile__menu-link" to={Urls.accountSettings()} style={{ color: "white" }}>
           Account settings
         </Link>
       ),
     },
     showSubscriptionCancelButton && {
       key: 'cancel-automatic-renewal',
       label: (
         <Link className="my-profile__menu-link" onClick={() => {
          setShowSubscriptionDetailModal(true);
         }} style={{ color: "white" }}>
           Cancel Automatic Renewal
         </Link>
       ),
     },
     user?.is_superuser && {
        key: 'admin-settings',
        label: (
          <Link className="my-profile__menu-link" to="/admin"  style={{ color: "white" }}>
            Admin settings
          </Link>
        ),
      },
     (user?.is_superuser || user?.isMarket) && {
        key: 'upgrade-vip',
        label: (
          <Link className="my-profile__menu-link" to="/market/upgrade"  style={{ color: "white" }}>
            Upgrade Vip
          </Link>
        ),
      },
      {
        key: 'sign-out',
        label: (
          <Link className="my-profile__menu-link" onClick={() => onLogout(location.pathname)}  style={{ color: "white" }}>
            Sign out
          </Link>
        ),
      },
     ]?.filter(Boolean)
  }
  const vipInfo = user?.vipInfo;
  const dataApiVipInfo = user?.vipInfoDataApi;
  const vipInfoFgaWithRenewals = user?.vipInfoFga?.map(vipInfo => {
    return {
      showCancelAutoRenewal: !!subscriptionDetailData?.list?.find(s => s.groupType === vipInfo.type),
      productId: subscriptionDetailData?.list?.find(s => s.groupType === vipInfo.type)?.productId,
      type: vipInfo.type,
      validEndDate: vipInfo.validEndDate,
      isExpire: vipInfo.isExpire,
    }
  })
  const standardFgaVip = isProFga && vipInfoFgaWithRenewals?.find(vipInfo => vipInfo.type === "fga_standard" && !vipInfo.isExpire)
  const advancedFgaVip = isProFga && vipInfoFgaWithRenewals?.find(vipInfo => vipInfo.type === "fga_advanced" && !vipInfo.isExpire);

  const showFpVip = !isProFga && vipInfo && vipInfo?.type !== "free";
  const showApiVip = !isProFga && dataApiVipInfo && dataApiVipInfo?.type !== "free";
  const getVipToolTip = (info, title) => {
    const titleStr = title ? `${title} :` : "";
    return `${titleStr} ${formatTableTitle(info?.type)} plan to ${dayjs(info.validEndDate).format("YYYY-MM-DD")}`;
  }
  const renderVipLayout = ({img, title}) => {
    if (textMode) {
      return (
        <Tag className="flex justify-center items-center p1">
          <div className="flex justify-center" style={{ width: 16, height: 16, marginRight: 4 }}>
            <AboutImage src={getOssUrl(img)} />
          </div>
          {title}
        </Tag>
      )
    }
    return (
      <Tooltip title={title}>
        <div className="flex justify-center items-center p1" style={{ width: 36, height: 36 }}>
          <AboutImage src={getOssUrl(img)} />
        </div>
      </Tooltip>
    )
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
            <Avatar size="large" style={{ backgroundColor: "#E4E4FE", width: 30, height: 30, lineHeight: "30px" }}>
              <span style={{ fontSize: 20 }}>
                {String(userName.charAt(0)).toUpperCase()}
              </span>
            </Avatar>
          )}
        </Tooltip>
        <div className="my-profile__right">
          {userName && (
            <div className="flex items-center flex-wrap">
              <Tooltip title={userName}>
                <h3 className="mr1">{userName}</h3>
              </Tooltip>
              {showFpVip && renderVipLayout({
                img: getOssUrl("/studio/img-fp-vip.png?x-oss-process=image/resize,m_fill,h_20,w_20"),
                title: getVipToolTip(vipInfo, "Footprint web")
              })}
              {showApiVip && renderVipLayout({
                img: getOssUrl("/studio/img-api-vip.png?x-oss-process=image/resize,m_fill,h_20,w_20"),
                title: getVipToolTip(dataApiVipInfo, "Data API")
              })}
              {standardFgaVip && renderVipLayout({
                img: getOssUrl("/studio/img-fp-vip.png?x-oss-process=image/resize,m_fill,h_20,w_20"),
                title: getVipToolTip(standardFgaVip, "")
              })} 
              {advancedFgaVip && renderVipLayout({
                img: getOssUrl("/studio/img-api-vip.png?x-oss-process=image/resize,m_fill,h_20,w_20"),
                title: getVipToolTip(advancedFgaVip, "")
              })}
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
        {showMenu && (
          <>
            <div className="my-profile__vertical-line"/>
            <Dropdown
              trigger={['click']}
              menu={{ items: getContent() }}
              overlayStyle={{ borderRadius: 10, border: "1px solid #ffffff20" }}
              dropdownRender={(menu) => (
                <div>
                  {menu}
                </div>
              )}
              placement="rightBottom"
            >
              <div className="px3 cursor-pointer">
                <Icon name="arrow_right_simple" size={14} color="#ffffff90"/>
              </div>
            </Dropdown>
          </>
        )}
        {showSubscriptionDetailModal && (
          <SubscriptionDetailModal
            subscriptionDetailList={subscriptionDetailList}
            onClose={() => {
              setShowSubscriptionDetailModal(false);
          }}
        />
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

const mapDispatchToProps = {
  onLogout: logout,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
