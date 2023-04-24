/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { Button, Card, Breadcrumb, List, Typography } from "antd";
import { connect } from "react-redux";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { getGrowthProjectPath } from "../utils/utils";
const { Text } = Typography;
import { getOssUrl } from "metabase/lib/image";
import cx from "classnames";

const UserTemplate = props => {
  const { router, location, children, user, projectPath, menu, projectObject } =
    props;
  const templates = [
    {
      name: "Campaign",
      name2: "Participant",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/airdrop2.svg",
      bg: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/token_airdrop.png",
      key: "campaign-participant",
    },
    {
      name: "NFT",
      name2: "Collector",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/nft_hunter.svg",
      bg: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/nft_collector.png",
      key: "nft-collector",
    },
    {
      name: null,
      name2: "Gamer",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/activity_gamer.svg",
      bg: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/gamer.png",
      key: "gamer",
    },
    {
      name: "Token",
      name2: "Whale",
      icon: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/whale_tracking.svg",
      bg: "https://footprint-imgs.oss-us-east-1.aliyuncs.com/token_whale.png",
      key: "token-whale",
    },
    {
      name: "Customer",
      name2: "Filter",
      key: "CustomerFilter",
      hiden: true,
    },
  ];

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
                pathname: getGrowthProjectPath(
                  projectPath,
                  "Potential Users List",
                ),
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
                  <Card
                    hoverable
                    style={{
                      width: "100%",
                      borderWidth: 0,
                      minHeight: 120,
                      borderRadius: 8,
                      backgroundImage: "url(" + item?.bg + ")",
                      backgroundSize: "cover",
                    }}
                  >
                    <div className=" flex flex-column">
                      <Text style={{ fontSize: 14 }} ellipsis={true}>
                        {item?.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: 900,
                          marginTop: item?.name ? 0 : 15,
                        }}
                        ellipsis={true}
                      >
                        {item?.name2}
                      </Text>
                    </div>
                  </Card>
                )}
              </List.Item>
            )}
          />
        </div>

        <h2 className="m mt4 w-full text-centered">How it work?</h2>
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

export default connect(mapStateToProps)(UserTemplate);
