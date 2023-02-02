/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react/prop-types */

import React, { useState } from "react";
import { Avatar, Button, Modal } from "antd";
import "./index.css";
import { get } from "lodash";
import { EditFilled, ExclamationCircleOutlined } from "@ant-design/icons";
import { cancelSubscription } from "metabase/new-service";
import VipIcon from "metabase/containers/creator/components/personal/VipIcon";
import Link from "metabase/core/components/Link";
import { trackStructEvent } from "metabase/lib/analytics";
import { IconBack } from "metabase/components/IconBack";
import { getOssUrl } from "metabase/lib/image";
import { slack } from "metabase/lib/slack";
import VipIconDataApi from "metabase/containers/creator/components/personal/VipIconDataApi";
import { useGetPaymentSubscriptionDetail } from "metabase/pricing_v2/use";
import SubscriptionDetailModal from "metabase/containers/creator/components/personal/SubscriptionDetailModal";

const Index = ({ router, user, data }) => {
  const [loading, setLoading] = useState(false);
  const [showSubscriptionDetailModal, setShowSubscriptionDetailModal] = useState(false);

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

  const { subscriptionDetailData } = useGetPaymentSubscriptionDetail(user, "footprint");
  const subscriptionDetailList = subscriptionDetailData?.list;
  const showSubscriptionCancelButton = subscriptionDetailList?.length > 0;

  const logo = get(data, "userInfo.avatar");
  const userName = get(data, "userInfo.name");
  const desc = get(data, "userInfo.bio");
  const twitter = get(data, "userInfo.twitter");
  const telegram = get(data, "userInfo.telegram");
  const discord = get(data, "userInfo.discord");
  // const email = get(data, "userInfo.email");

  const onCancelSubscription = async (productId) => {
    Modal.confirm({
      title: "Do you want to cancel automatic renewal?",
      icon: <ExclamationCircleOutlined />,
      confirmLoading: loading,
      onOk: async () => {
        setLoading(true);
        await cancelSubscription({ productId });
        setLoading(false);
        slack([{ label: "Cancel Subscription", value: user?.email }]);
        location.reload();
      },
      onCancel: () => {},
    });
  };

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
            <div style={{ display: "flex", alignItems: "center" }}>
              <h3 style={{ WebkitBoxOrient: "vertical" }}>{userName}</h3>
              <VipIcon
                vipInfo={data.vipInfo}
                isOwner={user?.id === get(data, "userInfo.metabaseId")}
              />
              <VipIconDataApi
                dataApiVipInfo={data.dataApiVipInfo}
                isOwner={user?.id === get(data, "userInfo.metabaseId")}
              />
            </div>
          )}
          <div className="flex justify-between">
            <div className="flex flex-column">
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
                    <Button type="primary" ghost icon={<EditFilled />}>
                      Edit Profile
                    </Button>
                  </Link>
                  {get(data, "vipInfo.type") !== "business" && (
                    <Link
                      to="/pricing"
                      target="_blank"
                      onClick={() => trackStructEvent("creator click upgrade")}
                    >
                      <Button>Upgrade</Button>
                    </Link>
                  )}
                  {showSubscriptionCancelButton && (
                    <Button onClick={() => setShowSubscriptionDetailModal(true)}>
                      Cancel Automatic Renewal
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="creator__personal-right">
              {totalInfo.map((item, index) => {
                return (
                  <div
                    key={item.title}
                    className="creator__personal-right-item"
                  >
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
      {showSubscriptionDetailModal && (
        <SubscriptionDetailModal
          subscriptionDetailList={subscriptionDetailList}
          onCancelSubscription={onCancelSubscription}
          onClose={() => {
            setShowSubscriptionDetailModal(false)
          }}
        />
      )}
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
