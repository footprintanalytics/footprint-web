/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "../index.css";
import { getFgaProject } from "metabase/selectors/user";
import { connect } from "react-redux";
import Head from "metabase/ab/containers/Journey/component/Head";
import SankeyChart from "metabase/ab/containers/Journey/component/SankeyChart";
import demoData from "metabase/ab/containers/Journey/util/data";

const View = props => {
  const { projectObject, router } = props;
  const projectName = projectObject.protocolSlug
  const [nodeDetail, setNodeDetail] = useState();

  return (
    <div className="journey-view">
      <Head title="Journey" buttons={["create", "list"]} router={router}/>
      <div className="journey-edit__main">
        <SankeyChart
          title="NFT Airdrop"
          nodes={demoData.nodes}
          links={demoData.links}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    projectObject: getFgaProject(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(View);
