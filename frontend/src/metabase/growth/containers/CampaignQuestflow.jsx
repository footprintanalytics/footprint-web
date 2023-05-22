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
  console.log("params", type, project, user);
  useEffect(() => {
    if (!isLoading && data) {
      console.log("loginQuestflow", data);
    }
  }, [data, isLoading]);
  const onPublish = flow => {
    console.log(flow);
    createQuestflowCampaign({
      projectId: parseInt(project?.id),
      campaignType: type,
      workflowId: flow.flowId,
      webhook: flow.webhook
    }).then(res => {
      Modal.success({
        content: 'Campaign created successfully!',
        okText: 'View Campaigns',
        onOk: () => {
          router?.push({
            pathname: `/growth/project/${project?.protocolSlug}/Campaign`,
          });
        }
      });
      console.log(res);
    }).catch(err => {
      console.log(err);
    }).finally(() => {

    });
  };

  return (
    <div className="flex flex-column items-center">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full h-full">
          <Canvas
            flowId={data?.flowId}
            idToken={data?.id_token}
            // TODO: need a questflowURL in production
            // questflowURL={data?.questflowURL}
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
