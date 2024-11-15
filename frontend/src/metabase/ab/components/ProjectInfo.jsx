/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button, Card, Empty, List, message, Tabs, Tag, Tooltip, Tour, Typography, Modal } from "antd";
// import Link from "antd/lib/typography/Link";
import { connect } from "react-redux";
import Title from "antd/lib/typography/Title";
import { SwapOutlined } from "@ant-design/icons";
import CopyToClipboard from "react-copy-to-clipboard";
import { getFgaProject, getUser } from "metabase/selectors/user";
import "../css/index.css";
import { createFgaProjectModalShowAction, projectSubmitModalShowAction } from "metabase/redux/control";
import { removeProjectContract } from "metabase/new-service";
import { loadCurrentFgaProjectById } from 'metabase/redux/user';
import UpdateProjectModal from "./Modal/UpdateProjectModal";

const ProjectInfo = props => {
  const { project, location, user, setProjectSubmitModalShowAction, setCreateFgaProjectModalShowAction, loadCurrentFgaProjectById } = props;
  const [currentProject, setCurrentProject] = useState(project);
  const [tourOpen, setTourOpen] = useState(false);
  const ref1 = useRef(null);
  const [modal, contextHolder] = Modal.useModal();
  const [projectModalShow, setProjectModalShow] = useState({
    show: false,
    force: false,
  });
  const isProFga = window.location.pathname.startsWith("/fga/pro")
  useEffect(() => {
    if (project) {
      setCurrentProject(project);
    }
  }, [project]);

  const onTabChange = key => {
    // console.log(key);
  };
  const enableTour = false;
  const steps = [
    {
      title: 'Submit Contract',
      description: 'You can submit more contract. So that you can be analyzed it at FGA.',
      target: () => ref1?.current,
      nextButtonProps: {children: <div>ok</div>},
    }
  ]

  useEffect(() => {
    setTimeout(() => {
      setTourOpen(true)
      window.localStorage.setItem("tour_project_info", "true");
    }, 1000)
  }, [])

  const getScanLink = address => {
    switch (currentProject?.chain) {
      case "Ethereum":
        return `https://etherscan.io/token/${address}`;
    }
  };

  const removeClick = async (item) => {
    await removeProjectContract({
      "projectId": currentProject?.id,
      "contractList": [
        {
          "address": item.address,
          "chain": item.chain,
        }
      ]
    })
    await loadCurrentFgaProjectById(currentProject?.id, "project-info", true, false)
  }

  const getTabPanel = type => {
    let datas = [];
    switch (type) {
      case "NFT":
        datas = currentProject?.nftCollectionAddress;
        break;
      case "Contract":
        datas = currentProject?.contractAddress;
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
              if (!user) {
                message.error("Kindle login first, please");
                return;
              }
              if (project.id === 1) {
                message.error("Kindle add your project to submit, please");
              }
              // router?.push({ pathname: "/fga/game/submit/contract/add" });
              if (isProFga) {
                setCreateFgaProjectModalShowAction({ show: true, projectObject: project });
              } else {
                setProjectSubmitModalShowAction({ show: true })
              }
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
        pagination={
          datas?.length > 10 ? { pageSize: 10 } : null
        }
        footer={
          <div className="w-full text-centered">
            <Typography.Text type="secondary">
              You can{" "}
              <Typography.Link
                ref={ref1}
                onClick={() => {
                  // if (!user) {
                  //   message.error("Please login first!");
                  //   return;
                  // }
                  // if (businessType) {
                  //   router?.push({ pathname: `/fga/${businessType}/submit/contract/add` });
                  // } else {
                  //   router?.push({ pathname: "/submit/contract/add" });
                  // }
                  if (isProFga) {
                    setCreateFgaProjectModalShowAction({ show: true, projectObject: project });
                  } else {
                    setProjectSubmitModalShowAction({ show: true })
                  }
                }}
              >
                click here{" "}
              </Typography.Link>{" "}
              and submit more contracts!
            </Typography.Text>
          </div>
        }
        renderItem={item => {
          const copyAction = <CopyToClipboard
            key="list-copy"
            text={`${item.address}`}
            onCopy={() => {
              message.success("Copied!");
            }}
          >
            <Tooltip title={`Copy this contract address!`}>
              <a>Copy</a>
            </Tooltip>
          </CopyToClipboard>
          const removeAction =  <Tooltip key="list-delete" title={`Remove this contract address from project!`}>
            <a
              onClick={() => {
                modal.confirm({
                  title: 'Confirm Removal',
                  content: `Are you sure you want to remove this contract address from the project? ${item.address}`,
                  okText: 'Confirm',
                  cancelText: 'Cancel',
                  width: 420,
                  onOk: async () => {
                    await removeClick(item);
                  },
                });
              }}
            >
              Remove
            </a>
          </Tooltip>
          /*const moreAction = <Tooltip key="list-more" title={`View in scan!`}>
            <a
              onClick={() => {
                window.open(getScanLink(item), "_blank");
              }}
            >
              more
            </a>
          </Tooltip>*/
          return (
            <List.Item
              actions={[
                copyAction,
                isProFga && removeAction,
              ].filter(Boolean)}
            >
              <div>
                <Avatar style={{ marginRight: 5 }}>{type}</Avatar>
                {item.address} <Tag>{item.chain}</Tag>
              </div>
            </List.Item>
          )
        }}
      />
    );
  };
  return (
    <div className="flex flex-col w-full items-center">
      {contextHolder}
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
        <div className=" flex flex-row justify-between w-full mb2" >
          <Title width={"100%"} level={4} style={{ marginBottom: 0 }}>
            Project Info
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
              <div className="flex flex-row justify-between">
                <div className="flex align-center">
                  <Avatar
                    src={
                      currentProject?.logo ??
                      "https://static.footprint.network/logo80.png"
                    }
                    style={{
                      width: 80,
                      height: 80,
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
                      <Button
                        className="ml0"
                        type="text"
                        hidden={true}
                        onClick={() => {
                          setProjectModalShow({ show: true });
                        }}
                      >
                        <SwapOutlined />
                      </Button>
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
              <Button
                type="primary"
                onClick={() => {
                  setCreateFgaProjectModalShowAction({ show: true, projectObject: project });
                }}
              >
                Submit Now
              </Button>
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
      {enableTour && window.localStorage.getItem("tour_project_info") !== "true" &&
        <Tour open={tourOpen} onClose={() => setTourOpen(false)} steps={steps} />
      }
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
    project: getFgaProject(state),
  };
};

const mapDispatchToProps = {
  setProjectSubmitModalShowAction: projectSubmitModalShowAction,
  setCreateFgaProjectModalShowAction: createFgaProjectModalShowAction,
  loadCurrentFgaProjectById,
};
export default connect(mapStateToProps, mapDispatchToProps)(ProjectInfo);
