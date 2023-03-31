/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Avatar,
  List,
  Tooltip,
  Empty,
  Card,
  Tag,
  Divider,
  Tabs,
  message,
} from "antd";
import Link from "antd/lib/typography/Link";
import { connect } from "react-redux";
import Title from "antd/lib/typography/Title";
import CopyToClipboard from "react-copy-to-clipboard";
import { getUser } from "metabase/selectors/user";
import { top_protocols } from "../utils/data";
import "../css/index.css";

const ProjectInfo = props => {
  const { router, project, location } = props;
  const [currentProject, setCurrentProject] = useState(project?.project);
  useEffect(() => {
    setCurrentProject(project?.project);
  }, [project]);
  const onTabChange = key => {
    console.log(key);
  };
  const getScanLink = address => {
    switch (currentProject?.chain) {
      case "Ethereum":
        return `https://etherscan.io/token/${address}`;
    }
  };
  const getTabPanel = type => {
    let datas = [];
    switch (type) {
      case "NFT":
        datas = currentProject?.nftCollectionAddress;
        break;
      case "Contract":
        datas = [];
        break;
      case "Token":
        datas = currentProject?.tokenAddress;
        break;
      default:
        datas = [];
    }
    console.log("datas", datas);
    if (!Array.isArray(datas) || datas.length <= 0) {
      return (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 100,
          }}
          description={
            <span>
              This project does not currently include the relevant contract
              address information. You can assist us in enhancing it by
              providing this information!
            </span>
          }
        >
          <Link href="growth/submit/contract/add">Submit Now</Link>
          {/* <Button type="primary">Submit Now</Button> */}
        </Empty>
      );
    }
    return (
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={datas}
        renderItem={item => (
          <List.Item
            actions={[
              <CopyToClipboard
                key="list-copy"
                text={`${item.address}`}
                onCopy={() => {
                  message.success("Copied!");
                }}
              >
                <Tooltip title={`Copy this contract address!`}>
                  <a>copy</a>
                </Tooltip>
              </CopyToClipboard>,
              // <Tooltip key="list-more" title={`View in scan!`}>
              //   <a
              //     onClick={() => {
              //       window.open(getScanLink(item), "_blank");
              //     }}
              //   >
              //     more
              //   </a>
              // </Tooltip>,
            ]}
          >
            <div>
              <Avatar style={{ marginRight: 5 }}>{type}</Avatar>
              {item.address} <Tag>{item.chain}</Tag>
            </div>
          </List.Item>
        )}
      />
    );
  };
  return (
    <div className="flex flex-col w-full items-center">
      <div
        className=" flex flex-column items-center"
        style={{
          width: 800,
          // backgroundColor: "white",
          borderRadius: 10,
          padding: 20,
          marginTop: 20,
          minHeight: 800,
        }}
      >
        <div className=" flex flex-row justify-between w-full">
          <Title width={"100%"} level={4} style={{ marginBottom: 0 }}>
            General
          </Title>
        </div>
        <Divider></Divider>
        <Card
          style={{
            width: "100%",
            minHeight: 600,
            margin: 20,
            borderRadius: 10,
          }}
        >
          {currentProject ? (
            <div className="flex flex-col">
              <div className="flex flex-row">
                <img
                  src={currentProject.logo}
                  width={80}
                  height={80}
                  style={{
                    borderRadius: 40,
                    borderWidth: 0.5,
                    borderStyle: "solid",
                    borderColor: "#f8fafb",
                  }}
                  alt="Project Icon"
                />
                <div className="flex flex-col ml3">
                  <div style={{ fontSize: 22, fontWeight: 500 }}>
                    {currentProject.protocolName}
                  </div>
                  <div className=" mt1">
                    {currentProject?.protocolType &&
                      currentProject?.protocolType !== "NFT" && (
                        <Tag>{currentProject?.protocolType}</Tag>
                      )}
                    {currentProject?.nftCollectionAddress?.length > 0 && (
                      <Tag>NFT</Tag>
                    )}
                    {currentProject?.tokenAddress?.length > 0 && (
                      <Tag>Token</Tag>
                    )}
                  </div>
                </div>
              </div>
              {/* <Divider></Divider> */}
              <Tabs
                className=" mt1"
                defaultActiveKey="1"
                onChange={onTabChange}
                items={[
                  {
                    label: `NFT Collection Address`,
                    key: "nft",
                    children: getTabPanel("NFT"),
                  },
                  {
                    label: `Token Address`,
                    key: "Token",
                    children: getTabPanel("Token"),
                  },
                  {
                    label: `Contract Address`,
                    key: "Contract",
                    children: getTabPanel("Contract"),
                  },
                ]}
              />
            </div>
          ) : (
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 100,
              }}
              description={
                <span>
                  This project does not currently include the relevant contract
                  address information. You can assist us in enhancing it by
                  providing this information!
                </span>
              }
            >
              {/* <Button type="primary">Create Now</Button> */}
            </Empty>
          )}
        </Card>
      </div>
    </div>
  );
};;

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(ProjectInfo);
