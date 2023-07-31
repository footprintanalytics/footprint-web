/* eslint-disable react/prop-types */
import React from "react";
import {  Card, List, Typography } from "antd";
import { connect } from "react-redux";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { getGrowthProjectPath } from "../utils/utils";
const { Text } = Typography;
import SegmentListPanel from "../components/SegmentListPanel"

const FindWallets = props => {
  const { router, location, children, user, projectPath, menu, projectObject } =
    props;
  const templates = [
    {
      name: "Activation",
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

  return (
    <div
      className="flex flex-column items-center p4"
      style={{ marginBottom: 100 }}
    >
      <div
        className="flex flex-column w-full"
      >
        <div className=" flex flex-row w-full items-center justify-between align-center">
          <h2>Which type of user are you looking for?</h2>

        </div>
        <div className="flex flex-row items-center mt4 w-full">
          <List
            className="w-full"
            grid={{
              gutter: 10,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 3,
              xl: 4,
              xxl: 6,
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
                      borderWidth: 0.5,
                      minHeight: 120,
                      borderRadius: 10,
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
        <SegmentListPanel router={router} sourceType = {'potentialUser'}></SegmentListPanel>

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

export default connect(mapStateToProps)(FindWallets);
