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
  Button,
  Typography,
} from "antd";
// import Link from "antd/lib/typography/Link";
import { connect } from "react-redux";
import Title from "antd/lib/typography/Title";
import CopyToClipboard from "react-copy-to-clipboard";
import { getFgaProject, getUser } from "metabase/selectors/user";
import "../css/index.css";
import Link from "metabase/core/components/Link/Link";
import UpdateProjectModal from "./Modal/UpdateProjectModal";

const ProjectInfo = props => {
  const { router, project, location,user } = props;
  const [currentProject, setCurrentProject] = useState(project);
  const [projectModalShow, setProjectModalShow] = useState({show:false,force:false});
  useEffect(() => {
    setCurrentProject(project);
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
          <Button
            type="link"
            onClick={() => {
              if(!user){
                message.error('Please login first!');
                return;
              }
              router?.push({ pathname: "/submit/contract/add" });
            }}
          >
            Submit Now
          </Button>
        </Empty>
      );
    }
    return (
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={datas}
        footer={
          <div className="w-full text-centered">
            <Typography.Text type="secondary">
              You can{" "}
              <Typography.Link
                onClick={() => {
                  if(!user){
                    message.error('Please login first!');
                    return;
                  }
                  router?.push({ pathname: "/submit/contract/add" });
                }}
              >
                click here{" "}
              </Typography.Link>{" "}
              and submit more contract!
            </Typography.Text>
          </div>
        }
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
        <div className=" flex flex-row justify-between w-full mb2">
          <Title width={"100%"} level={4} style={{ marginBottom: 0 }}>
            General
          </Title>
        </div>

        <Card
          style={{
            width: "100%",
            minHeight: 600,
            margin: 20,
            borderRadius: 10,
          }}
        >
          {currentProject?.protocolSlug !== "default" ? (
            <div className="flex flex-col">
              <div className="flex flex-row">
                <img
                  src={
                    currentProject.logo ??
                    "https://static.footprint.network/logo80.png"
                  }
                  width={80}
                  height={80}
                  style={{
                    borderRadius: 40,
                    borderWidth: 0.5,
                    padding: 5,
                    // borderStyle: "solid",
                    // borderColor: "#f8fafb",
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
              className="m4"
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{
                height: 100,
              }}
              description={
                <>
                  <span>
                    This project does not currently set up a protocol.
                  </span>
                  <span>You can set one and unlock more features to use.</span>
                </>
              }
            >
              <Button type="primary" onClick={()=>{setProjectModalShow({show:true})}}>Set up now</Button>
            </Empty>
          )}
        </Card>
      </div>
      <UpdateProjectModal
          open={projectModalShow?.show}
          force={projectModalShow?.force}
          location={location}
          onSuccess={() => {
            setProjectModalShow({ show: false });
          }}
          onCancel={() => {
            setProjectModalShow({ show: false });
          }}
        ></UpdateProjectModal>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
    project: getFgaProject(state),
  };
};

export default connect(mapStateToProps)(ProjectInfo);
