/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import {
  Avatar,
  List,
  Image,
  Tooltip,
  Empty,
  Button,
  Card,
  Tag,
  Divider,
  Tabs,
  message,
} from "antd";
import Link from "antd/lib/typography/Link";
import { connect } from "react-redux";
import CopyToClipboard from "react-copy-to-clipboard";
import { getUser } from "metabase/selectors/user";
import { top_protocols } from "../utils/data";
import "../css/index.css";

const ProjectInfo = props => {
  const { router, project, location } = props;
  const [currentProject, setCurrentProject] = useState();
  useEffect(() => {
    const p = top_protocols.find(i => i.protocol_slug === project);
    setCurrentProject(p ?? null);
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
        datas = currentProject?.collections_list;
        break;
      case "Contract":
        datas = [];
        break;
      case "Token":
        datas = [];
        break;
      default:
        datas = [];
    }
    if (datas.length <= 0) {
      return (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 100,
          }}
          description={<span>Data is empty!</span>}
        >
          <Link href="submit/contract/add">Submit Now</Link>
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
                text={item}
                onCopy={() => {
                  message.success("Copied!");
                }}
              >
                <Tooltip title={`Copy this contract address!`}>
                  <a>copy</a>
                </Tooltip>
              </CopyToClipboard>,
              <Tooltip key="list-more" title={`View in scan!`}>
                <a
                  onClick={() => {
                    window.open(getScanLink(item), "_blank");
                  }}
                >
                  more
                </a>
              </Tooltip>,
            ]}
          >
            <div>
              <Avatar style={{ marginRight: 5 }}>{type}</Avatar>
              {item}
            </div>
          </List.Item>
        )}
      />
    );
  };
  return (
    <div className="flex flex-col w-full items-center">
      <Card
        style={{ width: 600, minHeight: 600, margin: 20, borderRadius: 10 }}
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
                  {currentProject.protocol_name}
                </div>
                <div className=" mt1">
                  <Tag>{currentProject.chain}</Tag>
                  <Tag>NFT</Tag>
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
            description={<span>This project is empty!</span>}
          >
            {/* <Button type="primary">Create Now</Button> */}
          </Empty>
        )}
      </Card>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(ProjectInfo);
