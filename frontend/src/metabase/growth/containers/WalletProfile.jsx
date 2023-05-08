/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Breadcrumb,
  Space,
  Typography,
  Divider,
  message,
  Card,
} from "antd";
import { connect } from "react-redux";
import cx from "classnames";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { getOssUrl } from "metabase/lib/image";
import { getGrowthProjectPath } from "../utils/utils";
import { isAddress } from "metabase-lib/types/utils/isa";
import { wallet_profile_link } from "../utils/data";
const { Text } = Typography;

const WalletProfile = props => {
  const { router, location, children, user, projectPath, menu, projectObject } =
    props;

  const workDemoList = [
    {
      title: "Evaluate user potential value",
      desc: "By monitoring the token and NFT assets held by users through their wallet addresses, Web3 projects can identify what tokens and NFTs users own, their quantity and value, position and interests in ecosystem",
      img: getOssUrl("wallet_profile_img1.png"),
    },
    {
      title: "Identify user behavior preferences",
      desc: "Analyzing which games users have played and where they have conducted transactions can provide insights into user activity levels and preferences",
      img: getOssUrl("wallet_profile_img2.png"),
      reverse: true,
    },
  ];
  const [wallet_address, setWallet] = useState("");
  return (
    <div
      className="flex flex-column items-center p1"
      style={{ marginBottom: 100 }}
    >
      <div
        className="flex flex-column items-center"
        style={{ width: "100%", maxWidth: 1000, minWidth: 600 }}
      >
        <Card className=" mt-50 w-full ">
          <div className="flex flex-column items-center  w-full ">
            <h1 className="w-full text-centered">
              Expore User Wallet Profiles
            </h1>
            <Typography.Text className=" w-full text-centered">
              {
                "Gain insight into your users' financial behavior and transaction history by exploring their wallet profiles with ease."
              }
            </Typography.Text>
            <div
              className="mt3 flex flex-row"
              style={{ width: "100%", maxWidth: 500 }}
            >
              <Input
                size="large"
                onChange={e => setWallet(e.target.value)}
                style={{
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                }}
                className="rounded"
                placeholder={
                  "Input the wallet which you want to explore user profile."
                }
              />
              <Button
                type="primary"
                size="large"
                style={{ borderTopRightRadius: 5, borderBottomRightRadius: 5 }}
                onClick={() => {
                  const wallet = wallet_address?.trim()?.toLowerCase();
                  if (!wallet?.length > 0 || !wallet?.startsWith("0x")) {
                    message.error("Please provide a valid wallet address.");
                    return;
                  }
                  router?.push({
                    pathname: wallet_profile_link,
                    query: { wallet_address: wallet },
                    hash: "#from=Explore",
                  });
                }}
              >
                Expore
              </Button>
            </div>
          </div>
        </Card>
        <h2 className=" mt-60 w-full text-centered">
          Explore preferences and spending habits beyond behavior and assets
        </h2>
        {workDemoList.map(item => {
          return (
            <div
              key={item.title}
              className={cx(
                "mt4 flex flex-row w-full items-center justify-between",
                { "flex-row-reverse": item.reverse },
              )}
            >
              <img src={item.img} style={{ width: "50%" }} alt={item.title} />
              <div
                className="flex flex-column p2"
                style={{ width: "50%", textAlign: "left" }}
              >
                <h2>{item.title}</h2>
                <Text className="mt1" style={{ whiteSpace: "pre-line" }}>
                  {item.desc}
                </Text>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectObject: getFgaProject(state),
  };
};

export default connect(mapStateToProps)(WalletProfile);
