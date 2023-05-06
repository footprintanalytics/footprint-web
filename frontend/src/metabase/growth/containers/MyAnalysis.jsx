/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { List, Card, Image, Typography, message } from "antd";
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
import { template_gallery } from "../utils/data";
import AddMyAnalysisModal from "../components/Modal/AddMyAnalysisModal";
import { parseDashboardLink } from "../utils/utils";

const { Meta } = Card;
const MyAnalysis = props => {
  const { router, location, children, user, project } = props;
  const [showAdd, setShowAdd] = React.useState(false);
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
  return (
    <div className="flex flex-column items-center">
      {contextHolder}
      {showAdd && (
        <AddMyAnalysisModal
          open={showAdd}
          project={project}
          onCancel={() => setShowAdd(false)}
          onSuccess={() => {
            refetch();
            setShowAdd(false);
          }}
        />
      )}
      {isLoading ? (
        <LoadingSpinner message="Loading..." />
      ) : (
        <div className="flex flex-column" style={{ width: "80%" }}>
          <div>
            <h2 className=" mt3">{"My Analysis"}</h2>
            <div style={{ color: "#ffffff80" }}>
              {"Add any dashboards, websites or links you find interesting."}
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
                dataSource={[{ isFirstItem: true }].concat(data || [])}
                // dataSource={data}
                renderItem={(item, index) => {
                  if (index === 0) {
                    return (
                      <List.Item
                        onClick={() => {
                          setShowAdd(true);
                        }}
                      >
                        <Card
                          hoverable
                          style={{
                            borderRadius: 5,
                            padding: 10,
                            height: 236,
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
                                height: 216,
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
                      <Link to={item.url + "#from=My Analysis"}>
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
                              // fallback="https://statichk.footprint.network/dashboard/6863.png?image_process=resize,w_600/crop,h_310/format,jpg"
                              style={{
                                background: "white",
                                width: "100%",
                                height: 160,
                              }}
                              alt={item.title}
                              src={item?.imageUrl}
                            />
                          }
                        >
                          <div className="flex flex-row justify-between items-center">
                            <div className=" flex-full">{item.title}</div>
                            <div className="flex flex-row">
                              {/* <EditOutlined key="edit" disabled={true} /> */}
                              <DeleteOutlined
                                key="delete"
                                onClick={e => {
                                  e.preventDefault();
                                  delectDashboard(item.id);
                                }}
                              />
                            </div>
                          </div>
                          {/* <Meta title={item.title} /> */}
                        </Card>
                      </Link>
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

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(MyAnalysis);
