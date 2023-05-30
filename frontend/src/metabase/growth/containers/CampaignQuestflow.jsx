/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { connect } from "react-redux";
import { useQuery } from "react-query";
import Canvas from "@questflow/canvas";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { loginQuestflow, createQuestflowCampaign } from "metabase/new-service";
import { getUser, getFgaProject } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner";
window.React = React;
const CampaignQuestflow = props => {
  const { router, location, children, user, project, type } = props;
  const { isLoading, data } = useQuery(
    ["loginQuestflow", project?.id, user],
    async () => {
      return await loginQuestflow({ projectId: parseInt(project?.id) });
    },
    { ...QUERY_OPTIONS, enabled: !!project?.id && !!user?.id },
  );

  const onPublish = flow => {
    console.log(flow);
    createQuestflowCampaign({
      projectId: parseInt(project?.id),
      campaignType: type,
      workflowId: flow.flowId,
      webhook: flow.webhook,
    })
      .then(res => {
        Modal.success({
          content: "Campaign created successfully!",
          okText: "View Campaigns",
          onOk: () => {
            router?.push({
              pathname: `/growth/project/${project?.protocolSlug}/activation`,
            });
          },
        });
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {});
  };

  const flowTemplate = {
    nodes: [
      {
        id: "quest-start",
        type: "quest",
        selected: false,
        position: {
          x: 0,
          y: 0,
        },
        draggable: false,
        data: {
          appKey: "fp-start",
          key: "fp-start:start-campaign",
          label: "Footprint GA",
          name: "Start a Campaign",
          testResult: {
            status: "success",
          },
          validate: true,
          parameters: {},
        },
      },
      {
        id: "defaultNode-o0kSJ",
        type: "action",
        selected: true,
        position: {
          x: 0,
          y: 150,
        },
        draggable: false,
        data: {
          appKey: "fp-email-cohort",
          key: "fp:send-email-to-cohort",
          name: "Send an Email",
          label: "Email",
          validate: false,
          parameters: {
            subject: "Your email subject here.",
            body: "Your email content here.",
          },
        },
      },
      {
        id: "end",
        position: {
          x: 0,
          y: 300,
        },
        height: 42,
        width: 150,
        type: "defaultNode",
        data: {
          label: "end",
        },
        style: {
          opacity: 0,
        },
        draggable: false,
        deletable: false,
        selected: false,
      },
    ],
    edges: [
      {
        id: "quest-start@defaultNode-o0kSJ",
        type: "withPlusEdge",
        source: "quest-start",
        target: "defaultNode-o0kSJ",
        data: {
          text: "+",
        },
      },
      {
        id: "defaultNode-o0kSJ@end",
        type: "endWithAdd",
        source: "defaultNode-o0kSJ",
        target: "end",
        data: {
          text: "+",
        },
      },
    ],
  };

  return (
    <div className="flex flex-column items-center">
      {isLoading || !data?.idToken ? (
        <LoadingSpinner message="Loading~" />
      ) : (
        <div className="w-full h-full">
          <Canvas
            flowName={"Footprint Growth Analytics Email Flow"}
            flowDescription={"Footprint Growth Analytics Email Flow"}
            theme="dark"
            idToken={data?.idToken}
            template={flowTemplate}
            questflowURL={data?.host}
            onPublish={onPublish}
            onPre={() => {
              router?.goBack();
            }}
            showSave={false}
            showPublish={true}
          />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectPath: props.params.project,
    project: getFgaProject(state),
    menu: props.params.menu,
    type: props.params.type,
  };
};

export default connect(mapStateToProps)(CampaignQuestflow);
