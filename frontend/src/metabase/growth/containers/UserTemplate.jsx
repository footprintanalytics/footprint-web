/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Button, Card, Breadcrumb, List, Typography } from "antd";
import { connect } from "react-redux";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { getGrowthProjectPath } from "../utils/utils";
const { Text } = Typography;

const UserTemplate = props => {
  const { router, location, children, user, projectPath, menu, projectObject } =
    props;
  const templates = [
    {
      name: "Token Airdrop",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/airdrop2.svg",
      key: "campaign-participant",
    },
    {
      name: "NFT Collector",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/nft_hunter.svg",
      key: "nft-collector",
    },
    {
      name: "Active Gamer",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/activity_gamer.svg",
      key: "gamer",
    },
    {
      name: "Token Whale",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/whale_tracking.svg",
      key: "token-whale",
    },
    {
      name: "Customer Filter",
      key: "CustomerFilter",
      hiden: true,
    },
  ];
  return (
    <div
      className="flex flex-column items-center"
      style={{ marginBottom: 100 }}
    >
      <div
        className="flex flex-column"
        style={{ width: "90%", maxWidth: 1000, minWidth: 600 }}
      >
        <div className=" mt-50 flex flex-row w-full items-center justify-between align-center">
          <h2>Which type of user are you looking for?</h2>
          <Button
            type="link"
            onClick={() => {
              // setTemplate("CustomerFilter");
              router.push({
                pathname: getGrowthProjectPath(projectPath, "Potential Users List"),
              });
            }}
          >
            {"Custom Filter >"}
          </Button>
        </div>
        <div className="flex flex-row items-center mt4 w-full">
          <List
            className="w-full"
            grid={{
              gutter: 10,
              xs: 2,
              sm: 2,
              md: 2,
              lg: 4,
              xl: 4,
              xxl: 4,
            }}
            dataSource={templates}
            renderItem={item => (
              <List.Item
                onClick={() => {
                  // setIsModalOpen(false);
                  // setTemplate(item.key);
                  router.push({
                    pathname: getGrowthProjectPath(
                      projectPath,
                      "Potential Users List",
                    ),
                    query: { tag: item.key },
                  });
                }}
              >
                {!item.hiden && (
                  <Card hoverable style={{ width: "100%" }}>
                    <div className=" flex flex-column items-center" style={{}}>
                      <img src={item?.icon} className="ga-big-icon"></img>
                      <Text ellipsis={true}>{item?.name}</Text>
                    </div>
                  </Card>
                )}
              </List.Item>
            )}
          />
        </div>

        <h2 className="m mt4 w-full text-centered">How it work?</h2>
        <div className="mt3 flex flex-row w-full items-center justify-between">
          <img
            src="https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220225181036.png"
            style={{ width: "40%" }}
          ></img>
          <div className="flex flex-column p2" style={{ width: "50%" }}>
            <h3>
              Gain access to and analyze over 120 million wallet profiles and tags.
            </h3>
            <Text className="mt1" style={{ whiteSpace: "pre-line" }}>
              {
                "View holding detailed information on any wallet address, including their token assets and NFTs.\nView historical activities and preferences on any wallet address to mine new opportunities."
              }
            </Text>
          </div>
        </div>
        <div className="mt2 flex flex-row w-full items-center justify-between">
          <div className="flex flex-column p2" style={{ width: "50%" }}>
            <h3>Identify valuable users from the top NFTs, protocols, and chains.</h3>
            <Text className="mt1" style={{ whiteSpace: "pre-line" }}>
              {
                "Select on-chain users of any contract，NFTs, protocols, and chains.\nFilter by holding assets and historical active protocols to build your ideal audience.\nFilter out bot,Sybil and low-value users to boost your campaign ROI."
              }
            </Text>
          </div>
          <img
            src="https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220225185345.png"
            style={{ width: "40%" }}
          ></img>
        </div>
        <div className="mt2 flex flex-row w-full items-center justify-between">
          <img
            src="https://footprint-imgs.oss-us-east-1.aliyuncs.com/20220225210539.png"
            style={{ width: "40%" }}
          ></img>
          <div className="flex flex-column p2" style={{ width: "50%" }}>
            <h3>{"Dive deep into analyzing target audiences' holding value and activities on the chain."}</h3>
            <Text className="mt1" style={{ whiteSpace: "pre-line" }}>
              {
                "View unique user profiling that is cross-chain, cross-protocol, and integrates off-chain data.\nView more preference indicators and performance analysis."
              }
            </Text>
          </div>
        </div>
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

export default connect(mapStateToProps)(UserTemplate);
