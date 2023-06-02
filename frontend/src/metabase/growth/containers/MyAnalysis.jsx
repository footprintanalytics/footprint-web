/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import {
  List,
  Card,
  Image,
  Typography,
  message,
  Popconfirm,
  Modal,
  Button,
} from "antd";
import { Link } from "react-router";
import {
  EditOutlined,
  LoadingOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { useQuery } from "react-query";
import LoadingSpinner from "metabase/components/LoadingSpinner";
import { getUser } from "metabase/selectors/user";
import {
  dashboardIdInfo,
  GetWebsiteNesting,
  DelectWebsiteNesting,
} from "metabase/new-service";
import { createModalShowAction } from "metabase/redux/control";
import AddMyAnalysisModal from "../components/Modal/AddMyAnalysisModal";
import { checkIsNeedContactUs, parseDashboardLink } from "../utils/utils";

const { Meta } = Card;
const MyAnalysis = props => {
  const { router, location, children, user, project, setCreateModalShow } =
    props;
  const [showAdd, setShowAdd] = React.useState({ open: false, item: null });
  const { isLoading, data, refetch, isFetching } = useQuery(
    ["GetWebsiteNesting", project],
    async () => {
      return GetWebsiteNesting({ projectId: project?.id });
    },
  );
  const [messageApi, contextHolder] = message.useMessage();

  const delectDashboard = id => {
    messageApi.open({
      type: "loading",
      content: "Deleting..",
      duration: 0,
    });

    DelectWebsiteNesting({ id: id })
      .then(() => {
        messageApi.destroy();
        message.success("Successfully deleted!");
        refetch();
      })
      .catch(() => {
        messageApi.destroy();
        message.error("Failed to delete!");
      })
      .finally(() => {
        messageApi.destroy();
      });
  };
  const openPage = url => {
    if (url.includes("footprint.network")) {
      router.push(url + "#from=My Analytics");
    } else {
      window.open(url.startsWith("http") ? url : "https://" + url, "_blank");
    }
  };
  const [modal, modalContextHolder] = Modal.useModal();
  return (
    <div className="flex flex-column items-center">
      {contextHolder}
      {modalContextHolder}
      {showAdd?.open && (
        <AddMyAnalysisModal
          open={showAdd?.open}
          item={showAdd?.item}
          project={project}
          onCancel={() => setShowAdd({ open: false })}
          onSuccess={() => {
            refetch();
            setShowAdd({ open: false });
          }}
        />
      )}
      {isLoading ? (
        <LoadingSpinner message="Loading..." />
      ) : (
        <div className="flex flex-column" style={{ width: "80%" }}>
          <div>
            <div className="flex mt2 flex-row items-center">
              <h2>{"My Analytics"}</h2>{" "}
              <Button
                className="ml-10"
                type="primary"
                onClick={() => {
                  if (!checkIsNeedContactUs(modal, project)) {
                    setCreateModalShow({ show: true })
                  }
                }}
              >
                Create
              </Button>
            </div>
            <div style={{ color: "#ffffff80" }}>
              {"Add any dashboards, websites or links you find interesting. "}
            </div>
            <div className=" mt1">
              <List
                grid={{
                  gutter: 10,
                  xs: 1,
                  sm: 1,
                  md: 2,
                  lg: 2,
                  xl: 3,
                  xxl: 4,
                }}
                dataSource={[{ isFirstItem: true }].concat(
                  data
                    ?.filter(i => i.projectId === project?.id)
                    ?.sort(
                      (a, b) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime(),
                    ) || [],
                )}
                // dataSource={data}
                renderItem={(item, index) => {
                  if (index === 0) {
                    return (
                      <List.Item
                        onClick={() => {
                          setShowAdd({ open: true });
                        }}
                      >
                        <Card
                          hoverable
                          style={{
                            borderRadius: 5,
                            padding: 10,
                            height: 218,
                            borderWidth: 1,
                            borderStyle: "solid",
                          }}
                          cover={
                            <div
                              width="100%"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: 5,
                                borderWidth: 1,
                                height: 198,
                                borderColor: "#4A5568",
                                borderStyle: "dashed",
                              }}
                            >
                              <PlusCircleOutlined
                                style={{
                                  fontSize: 48,
                                  fontWeight: 700,
                                  marginBottom: 5,
                                }}
                              />
                              <h3>Add</h3>
                            </div>
                          }
                        ></Card>
                      </List.Item>
                    );
                  }
                  return (
                    <List.Item>
                      <Card
                        hoverable
                        style={{
                          borderRadius: 5,
                          padding: 5,
                          borderWidth: 1,
                          borderStyle: "solid",
                        }}
                        cover={
                          <Image
                            preview={false}
                            onClick={() => {
                              openPage(item.url);
                            }}
                            // fallback="https://statichk.footprint.network/dashboard/6863.png?image_process=resize,w_600/crop,h_310/format,jpg"
                            style={{
                              background: "white",
                              width: "100%",
                              height: 160,
                              objectFit: "cover",
                            }}
                            alt={item.title}
                            src={item?.imageUrl}
                          />
                        }
                      >
                        <div className="flex flex-row justify-between items-center w-full flex-1">
                          <Typography.Text
                            ellipsis={true}
                            onClick={() => {
                              openPage(item.url);
                            }}
                            className=" flex-1"
                          >
                            {item.title}
                          </Typography.Text>

                          <div className="flex flex-row">
                            <EditOutlined
                              key="edit"
                              className="mr1"
                              onClick={e => {
                                e.preventDefault();
                                setShowAdd({ open: true, item: item });
                              }}
                            />
                            <Popconfirm
                              title="Delete the dashboard?"
                              description="Are you sure to delete this dashboard?"
                              onConfirm={() => {
                                if (!checkIsNeedContactUs(modal, project)) {
                                  delectDashboard(item.id);
                                }
                              }}
                              placement="topRight"
                              onCancel={() => {}}
                              okText="Yes"
                              cancelText="No"
                            >
                              <DeleteOutlined
                                key="delete"
                                // onClick={e => {
                                //   e.preventDefault();
                                //   delectDashboard(item.id);
                                // }}
                              />
                            </Popconfirm>
                          </div>
                        </div>
                      </Card>
                    </List.Item>
                  );
                }}
              ></List>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const mapDispatchToProps = {
  setCreateModalShow: createModalShowAction,
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyAnalysis);
