/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useQuery } from "react-query";
import Canvas from "@questflow/canvas";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { loginQuestflow, createQuestflowCampaign } from "metabase/new-service";
import { getUser, getFgaProject } from "metabase/selectors/user";
import LoadingSpinner from "metabase/components/LoadingSpinner";

const CampaignQuestflow = props => {
  const { router, location, children, user, project, type } = props;
  const { isLoading, data } = useQuery(
    ["loginQuestflow", project?.id, user],
    async () => {
      return await loginQuestflow({ projectId: parseInt(project?.id) });
    },
    { ...QUERY_OPTIONS, enabled: !!project?.id && user },
  );
  useEffect(() => {
    console.log("params", type, project, user);
    if (!isLoading && data) {
      console.log("loginQuestflow", data);
    }
  }, [data, isLoading]);
  const idToken =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImRQRmFnYnhObW1KM21zdHk2RXpuTmV1WGhpTE5LMGpmSlZhdlZDWXZtRWMifQ.eyJzdWIiOiI2NDVjYWFhMGVhM2UwZDk3YjcyNWNmY2UiLCJhdF9oYXNoIjoiUWljOEtpV0pBenRuUEliQnNSamdEdyIsInNpZCI6Ik9qeFhHQXVJa2lNWU1iaGpVVEtGTSIsImF1ZCI6ImZvb3RwcmludCIsImV4cCI6MTY4MzgyNjg5MCwiaWF0IjoxNjgzODIzMjkwLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBpL29pZGMifQ.S8Rrrn-r2mOwUpclVkWd2P6Rv3oNhOWvHwnDIjRTVjFMkeujBMWgH3aTWhvtoGBKPy3si7E2EmV5O572UTaaEr_mBljSjIiCabzvdYhbwnSw6MSpwNdt-io-G9Rxb8Zm9VFHsvnxNif2ueHc50eo9vPtAI6m47e1MU6irVBOOOmEz_6xHMCv397PXxVfpTF4peHsMNueceK-BYgjAbiXP52JJ4AeIvgwOEo5vR4ZdLMzS5KdSvELa08j_ag8KumKuK2njlaontIo2-56j_f2SvUSs7hWJfHC7F1k0VYMWcLjdmxcbucHIaViIyWszS-hmZXjQvkjUaM8blvjSd_Zfg";
  const onPublish = flow => {
    console.log(flow);
  };
  return (
    <div className="flex flex-column items-center">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <Canvas
            flowId="644a36d563b13a9b5199b672"
            idToken={idToken}
            questflowURL={"http://localhost:3000"}
            onPublish={onPublish}
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
