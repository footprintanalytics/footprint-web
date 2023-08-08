/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "../index.css";
import { getFgaProject } from "metabase/selectors/user";
import { connect } from "react-redux";
import Head from "metabase/ab/containers/Journey/component/Head";
import SankeyChart from "metabase/ab/containers/Journey/component/SankeyChart";
import demoData from "metabase/ab/containers/Journey/util/data";
import { journeyPathAnalyze } from "metabase/new-service";
import dayjs from "dayjs";

const View = props => {
  const { projectObject, router } = props;
  const projectName = projectObject.protocolSlug
  const [nodeDetail, setNodeDetail] = useState();
  const [isLoading, setLoading] = useState();
  const [chartData, setChartData] = useState({nodes: demoData.nodes, links: demoData.links});

  const [params, setParams] = useState({
    "eventNames": ["login","play_games"],
    "initialEventName": "login",
    "project": "benji",
    "startTime": dayjs().add(-32, 'd').format("YYYY-MM-DD"),
    "endTime": dayjs().format("YYYY-MM-DD"),
    "levelLimit": 6,
  });

  const calAction = async () => {
    setLoading(true);
    const result = await journeyPathAnalyze(params);
    setChartData({
      nodes: result?.nodes,
      links: result?.links,
    })
    setLoading(false);
  }

  return (
    <div className="journey-view">
      <Head title="Journey" buttons={["create", "list"]} router={router}/>
      <div className="journey-edit__main">
        <SankeyChart
          title="NFT Airdrop"
          isLoading={isLoading}
          nodes={chartData?.nodes}
          links={chartData?.links}
          onDateRangeChange={(strings) => {
            setParams({
              ...params,
              startTime: strings[0],
              endTime: strings[1],
            })
          }}
          runData={() => {
            calAction()
          }}
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
