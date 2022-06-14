/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./index.css";
import connect from "react-redux/lib/connect/connect";
import Button from "metabase/components/Button";
import {
  createModalShowAction,
  loginModalShowAction,
} from "metabase/redux/control";
import ExternalLink from "metabase/components/ExternalLink";
import {
  getShowZkspaceFinishTask,
  getShowZkspaceSubmitAddr,
  setShowZkspaceSubmitAddr,
  zkspaceDate,
} from "metabase/lib/register-activity";
import { trackStructEvent } from "metabase/lib/analytics";
import { Form, Input, message } from "antd";
import { zkspaceCreateUserAddress } from "metabase/new-service";
import { push } from "react-router-redux";
import { getOssUrl } from "metabase/lib/image";
import * as Urls from "metabase/lib/urls";

const Zkspace = props => {
  const { setLoginModalShow, user, onChangeLocation } = props;
  const email = user && user.email;

  const [hadSubmitAddress, setHadSubmitAddress] = useState(
    getShowZkspaceSubmitAddr(email),
  );

  const hadDoneTask = getShowZkspaceFinishTask(email);

  const onSubmit = async data => {
    trackStructEvent(`zkspace-landing click submit`);
    if (data.userAddress.trim().length !== 42) {
      message.info("Please input 42-bit length Ethereum address.");
      return;
    }
    const hide = message.loading("Loading...", 0);
    try {
      const {
        userIdIsExist,
        userAddressIsExist,
      } = await zkspaceCreateUserAddress(data);
      if (userIdIsExist) {
        message.info("You have already submitted an address");
        setShowZkspaceSubmitAddr(email);
        setHadSubmitAddress(true);
      } else if (userAddressIsExist) {
        message.info(
          "This address has already been submitted, please fill in another address",
        );
      } else {
        trackStructEvent(`zkspace-landing click submit success`);
        setShowZkspaceSubmitAddr(email);
        setHadSubmitAddress(true);
      }
    } finally {
      hide();
    }
  };

  if (!zkspaceDate()) {
    return (
      <div className="zkspace" style={{ padding: "100px 0 0", color: 20 }}>
        <div>This activity has not started or has ended</div>
        <div>Date: February 14th to 25th, 2022 (UTC+8)</div>
      </div>
    );
  }

  return (
    <div className="zkspace">
      <div className="zkspace__head">
        <div className="zkspace__logo">
          <img
            src="https://static.footprint.network/activity-zkspace/img-logo-white.png"
            alt={"img-logo"}
          />
          <span className="zkspace__line" />
          <img
            src="https://static.footprint.network/activity-zkspace/img-logo-zkspace.png"
            alt={"img-logo-zkspace"}
          />
        </div>
        <div className="zkspace__slogan">
          Complete the Mission and Win ZKSpace NFT!
        </div>
      </div>
      <div className="zkspace__box">
        <div className="zkspace__task-title">Footprint Analytics Task List</div>
        <ul className="zkspace__task-list">
          <li className="zkspace__item">
            <span className="zkspace__star">*</span>Sign in Footprint Analytics
            and create a dashboard or chart
            <div className="zkspace__item-todo">
              1. You can create your own charts or you can duplicate one and
              make changes.
            </div>
            <div className="zkspace__item-todo">
              2. You need at least one chart in your dashboard.
            </div>
          </li>
          <li className="zkspace__item">
            Share Footprint Analytics on Twitter
            <div className="zkspace__item-todo">
              1. You can share one of the dashboard on
              <ExternalLink
                href="https://www.footprint.network"
                target="_blank"
                style={{ marginLeft: 4 }}
              >
                Footprint Analytics
              </ExternalLink>{" "}
              or the dashboard you created.
            </div>
            <div className="zkspace__item-todo">
              2. You can also retweet this tweet from @Footprint_DeFi:
              <ExternalLink
                href="https://twitter.com/Footprint_DeFi/status/1486882251954528257?s=20&t=JPNHJwoSkBamxZxtd1Eosw"
                target="_blank"
                style={{ marginLeft: 4 }}
              >
                Footprint Raises $1.5M in Seed Round!
              </ExternalLink>
            </div>
          </li>
          <li className="zkspace__item">Join Footprint Analytics community</li>
          <div className="zkspace__media">
            <ExternalLink
              href={"https://discord.gg/3HYaR6USM7"}
              target="_blank"
            >
              <Button icon="discord_oppo" size={32} color={"#fff"} borderless>
                <span className="text-underline">Discord</span>
              </Button>
            </ExternalLink>
            <ExternalLink
              href={"https://t.me/joinchat/4-ocuURAr2thODFh"}
              target="_blank"
            >
              <Button icon="telegram_oppo" size={32} color={"#fff"} borderless>
                <span className="text-underline">Telegram</span>
              </Button>
            </ExternalLink>
            <ExternalLink
              href={"https://twitter.com/Footprint_DeFi"}
              target="_blank"
            >
              <Button icon="twitter_oppo" size={32} color={"#fff"} borderless>
                <span className="text-underline">Twitter</span>
              </Button>
            </ExternalLink>
          </div>
        </ul>
        {(!user || !hadDoneTask) && (
          <Button
            className="zkspace__button"
            borderless
            onClick={() => {
              trackStructEvent(`zkspace-landing click create a chart`);
              if (user) {
                onChangeLocation(Urls.newQuestion());
              } else {
                setLoginModalShow({ show: true, from: "activity_zkspace" });
              }
            }}
          >
            {"Create A Chart Now >>"}
          </Button>
        )}

        {user && hadDoneTask && !hadSubmitAddress && (
          <Form onFinish={onSubmit}>
            <div className="zkspace__submit-tip">
              Submit your Ethereum address to receive NFT airdrop
            </div>
            <Form.Item name="userAddress">
              <Input className="zkspace__address" maxLength={42} />
            </Form.Item>
            <div style={{ textAlign: "center" }}>
              <Button className="zkspace__button-submit" borderless>
                Submit
              </Button>
            </div>
          </Form>
        )}

        {user && hadSubmitAddress && (
          <div>
            <div className="zkspace__submit-tip">
              <img
                src={getOssUrl("/activity-zkspace/img-right.png")}
                style={{
                  width: "16px",
                  height: "16px",
                  objectFit: "fill",
                  margin: "0 10px 0 0",
                }}
                alt={""}
              />
              You have completed the task and will be airdropped NFT after
              verification.
            </div>
            <Button
              className="zkspace__button"
              borderless
              onClick={() => {
                trackStructEvent(`zkspace-landing click explore more`);
                onChangeLocation("/");
              }}
            >
              {"Explore More >"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
  setCreateModalShow: createModalShowAction,
  onChangeLocation: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(Zkspace);
