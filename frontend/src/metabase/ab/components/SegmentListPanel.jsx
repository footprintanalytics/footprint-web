/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { Badge, Button, Card, Divider, message, Modal, Space, Table, Tooltip, Typography } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import { getFgaProject, getUser } from "metabase/selectors/user";
import { GetFgaCohort } from "metabase/new-service";
import Link from "metabase/core/components/Link/Link";
import LoadingSpinner from "metabase/components/LoadingSpinner/LoadingSpinner";
import { formatTag, getGrowthProjectPath } from "../utils/utils";
import { cohortTips, getUserProfileLink, getWalletProfileLink } from "../utils/data";
import UploadWallets from "./buttons/UploadWallets";
import { loginModalShowAction } from "metabase/redux/control";

const SegmentListPanel = props => {
  // sourceType: projectUser, potentialUser
  const { project, router, user, sourceType, businessType } = props;
  const protocolSlug = project?.protocolSlug === "Demo Project" ? "" : project?.protocolSlug;
  const { isLoading, data, refetch } = useQuery(
    ["getCohort", project],
    async () => {
      return GetFgaCohort({ protocolSlug });
    },
    {
      refetchInterval: 5000,
    },
  );

  const dataSource = data?.list
    ?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    ?.filter(
      f =>
        !["hhh", "all"].includes(f.title) &&
        f.createdSource === sourceType &&
        !(f.numberOfWallets <= 0 && f.status === "Ready"),
    );

  const columns = [
    {
      title: "Segment Name",
      dataIndex: "title",
      render: (text, { createdBy, numberOfWallets, cohortId }) => {
        // only format tag for system cohorts
        const title = createdBy !== "user" ? formatTag(text) : text;
        return (
          <Link
            disabled={true}
            // disabled={numberOfWallets === 0}
            to={`${getUserProfileLink(businessType)}?cohort_id=${cohortId}&tag=${text}&cohort_title=${text}#from=Segment`}
          >
            {title}
          </Link>
        );
      },
    },
    {
      title: "Number of Wallets",
      dataIndex: "numberOfWallets",
      key: "numberOfWallets",
      render: (text, { status }) => {
        if (!Number(text)) {
          switch (status) {
            case "Ready":
              return Number(text).toLocaleString();
            case "Init":
            case "Generating":
            case "Failed":
            default:
              return <Badge status="processing" text="Loading" />;
            // return <Badge status="processing" text="Initing" />;
            // case "Failed":
            //   return <Badge status="error" text="Failed" />;
          }
        }
        return Number(text).toLocaleString();
      },
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      render: text => {
        return <>{text === "user" ? "Admin" : "System"}</>;
      },
    },
    {
      title: "Created Time",
      dataIndex: "createdAt",
      render: text => dayjs(text).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link
            disabled={record.numberOfWallets === 0}
            to={`${getUserProfileLink(businessType)}?cohort_id=${record.cohortId}&tag=${record.title}&cohort_title=${record.title}#from=Segment`}
          >
            User Profile
          </Link>
          <Link
            disabled={record.numberOfWallets === 0}
            to={`${getWalletProfileLink(businessType)}?cohort_id=${record.cohortId}&cohort_title=${record.title}#from=Segment`}
          >
            Wallet List
          </Link>

          <Link
            disabled={record.numberOfWallets === 0}
            onClick={() => {
              message.info("Coming soon...")
              // if (checkIsNeedContactUs(modal, project)) {
              //   return;
              // }
              // message.info("Download will start soon...");
              /*if (!user) {
                message.warning(`Kindly login before Download CSV`);
                setLoginModalShowAction({
                  show: true,
                  from: "download csv",
                  redirect: location.pathname,
                  channel: "FGA",
                });
                return;
              }
              console.log(`/api/v1/fga/cohort/address/csv?cohortId=${record.cohortId}&projectId=${project?.id}&cohortTitle=${record.title}&protocolSlug=${project?.protocolSlug}`)
              window
                .open(
                  `/api/v1/fga/cohort/address/csv?cohortId=${record.cohortId}&projectId=${project?.id}&cohortTitle=${record.title}&protocolSlug=${project?.protocolSlug}`,
                  "_blank",
                )
                .focus();*/
            }}
          >
            Download CSV
          </Link>
          {/*<Link
            to={getGrowthProjectPath(
              router?.params?.project,
              "CreateActivation",
            )}
          >
            Create Activation
          </Link>*/}
        </Space>
      ),
    },
  ];

  const getMembersUrl = () => {
    if (window.location.pathname.includes("-platform")) {
      return "members-platform"
    }
    return "members";
  }

  const items = [
    {
      key: "1",
      label: (
        <Tooltip
          title="Filter wallets in the Member page"
        >
          <Button
            type="primary"
            onClick={() =>
              router?.push({
                pathname: getGrowthProjectPath(
                  router?.params?.project,
                  sourceType === "projectUser"
                    ? getMembersUrl()
                    : "find_potential_wallets",
                ),
              })
            }
          >
            Filter Wallets
          </Button>
        </Tooltip>
      ),
    },
    {
      key: "2",
      label: <UploadWallets sourceType={sourceType} refetchData={refetch} />,
    },
  ];

  const tooltipTitle = Array.from(cohortTips).map(([key, value]) => (
    <div key={key} className="mb1">
      <Typography.Text style={{ display: "inline", whiteSpace: "nowrap" }}>
        {key === "{project slug} Users"
          ? `${project?.protocolName} Users`
          : key}{" "}
      </Typography.Text>
      <Typography.Text style={{ display: "block" }} type="secondary">
        {value}
      </Typography.Text>
    </div>
  ));

  const [modal, contextHolder] = Modal.useModal();
  return (
    <div>
      {contextHolder}
      <Card
        className="mt2"
        title={
          <>
            {"Segment"}
            {/*{sourceType === "projectUser" ? (
              <Tooltip
                placement="rightTop"
                trigger={["click", "hover"]}
                overlayClassName="my-tooltip"
                title={
                  <div className="flex flex-col m1">
                    <Typography.Title level={5}>
                      Segment Description
                    </Typography.Title>
                    <Divider className="my1" />
                    {tooltipTitle}
                  </div>
                }
                arrow={true}
              >
                {"Segment "}
                <QuestionCircleOutlined />
              </Tooltip>
            ) : (
              <>{"Segment"}</>
            )}*/}
          </>
        }
        extra={
          <div className="flex flex-row" style={{ gap: 10 }}>
            {items?.map(item => item.label)}
          </div>
          // <Dropdown menu={{ items }}>
          //   <Button type="primary">Create Segment</Button>
          // </Dropdown>
        }
      >
        {isLoading ? (
          <div style={{ height: 240 }}>
            <LoadingSpinner></LoadingSpinner>
          </div>
        ) : (
          <Table
            rowKey="cohortId"
            loading={isLoading}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
        )}
      </Card>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    project: getFgaProject(state),
  };
};

const mapDispatchToProps = {
  setLoginModalShowAction: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(SegmentListPanel);
