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
} from "antd";
import { connect } from "react-redux";
import cx from "classnames";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { getOssUrl } from "metabase/lib/image";
import { getGrowthProjectPath } from "../utils/utils";
import { isAddress } from "metabase-lib/types/utils/isa";
const { Text } = Typography;

const WalletProfile = props => {
  const { router, location, children, user, projectPath, menu, projectObject } =
    props;

  const workDemoList = [
    {
      title:
        "Gain access to and analyze over 120 million wallet profiles and tags.",
      desc: "View holding detailed information on any wallet address, including their token assets and NFTs.\nView historical activities and preferences on any wallet address to mine new opportunities.",
      img: getOssUrl("img_potential1.png"),
    },
    {
      title:
        "Identify valuable users from the top NFTs, protocols, and chains.",
      desc: "Select on-chain users of any contract，NFTs, protocols, and chains.\nFilter by holding assets and historical active protocols to build your ideal audience.\nFilter out bot,Sybil and low-value users to boost your campaign ROI.",
      img: getOssUrl("img_potential2.png"),
      reverse: true,
    },
    {
      title:
        "Dive deep into analyzing target audiences' holding value and activities on the chain.",
      desc: "View unique user profiling that is cross-chain, cross-protocol, and integrates off-chain data.\nView more preference indicators and performance analysis.",
      img: getOssUrl("img_potential3.png"),
    },
  ];
  const [wallet_address, setWallet] = useState("");
  return (
    <div
      className="flex flex-column items-center"
      style={{ marginBottom: 100 }}
    >
      <div
        className="flex flex-column items-center"
        style={{ width: "90%", maxWidth: 1000, minWidth: 600 }}
      >
        <h1 className=" mt-50  w-full text-centered">
          Expore User Wallet Profiles
        </h1>
        <Typography.Text className=" w-full text-centered">
          {
            "Gain insight into your users' financial behavior and transaction history by exploring their wallet profiles with ease."
          }
        </Typography.Text>
        <Space.Compact className="mt3" style={{ width: "100%", maxWidth: 500 }}>
          <Input
            size="large"
            onChange={e => setWallet(e.target.value)}
            className="rounded"
            placeholder={
              "Input the wallet which you want to explore user profile."
            }
          />
          <Button
            type="primary"
            size="large"
            onClick={() => {
              const wallet = wallet_address?.trim()?.toLowerCase();
              if (!wallet?.length > 0 || !wallet?.startsWith("0x")) {
                message.error("Please provide a valid wallet address.");
                return;
              }
              router?.push({
                pathname:
                  "/growth/public/dashboard/f7cd2f21-1e14-438d-8820-011418607450",
                query: { wallet_address: wallet },
                hash: "#from=Wallet Profile",
              });
            }}
          >
            Expore
          </Button>
        </Space.Compact>
        <h2 className=" mt-60 w-full text-centered">How it work?</h2>
        {workDemoList.map(item => {
          return (
            <div
              key={item.title}
              className={cx(
                "mt4 flex flex-row w-full items-center justify-between",
                { "flex-row-reverse": item.reverse },
              )}
            >
              <img src={item.img} style={{ width: "40%" }} alt={item.title} />
              <div className="flex flex-column p2" style={{ width: "50%" }}>
                <h3>{item.title}</h3>
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
