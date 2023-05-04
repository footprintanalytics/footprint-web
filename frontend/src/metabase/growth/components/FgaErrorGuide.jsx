/* eslint-disable react/prop-types */
import React from "react";
import { Button, Result, Avatar, Image, Alert } from "antd";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import Link from "metabase/core/components/Link";
import { trackStructEvent } from "metabase/lib/analytics";
import { getGrowthProjectPath } from "../utils/utils";

const FgaErrorGuide = ({ router, project, menu }) => {
  return (
    <div
      style={{
        display: "flex",
        padding: 0,
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Alert
        message="There is no data available. However, if you have configured the connector, you can gain valuable insights about your users."
        type="info"
        style={{
          maxWidth: 600,
          margin: "auto",
          // paddingTop: 20,
          // paddingBottom: 20,
          textAlign: "left",
        }}
        showIcon
        action={
          <Button
            size="small"
            type="primary"
            style={{ borderRadius: 4 }}
            onClick={() => {
              router.push(getGrowthProjectPath(project, "Connector"));
            }}
          >
            Set up now
          </Button>
        }
        // closable
      />
      {/* <Result
        style={{ margin: 0, padding: 1 }}
        icon={null}
        // icon={
        //   <Image
        //     preview={false}
        //     style={{
        //       height: "30%",
        //       width: "30%",
        //       minHeight: 15,
        //       minWidth: 25,
        //       maxHeight: 250,
        //       maxWidth: 300,
        //     }}
        //     src={
        //       "https://footprint-imgs.oss-us-east-1.aliyuncs.com/no-data01.svg"
        //     }
        //   />
        // }
        // title="There is currently no data available for this project."
        subTitle="There is no data available. However, if you have configured the connector, you can gain valuable insights about your users."
        extra={
          <Button
            type="primary"
            size="small"
            style={{ borderRadius: 4 }}
            onClick={() => {
              router.push(getGrowthProjectPath(project, "Connector"));
            }}
          >
            Set up now
          </Button>
        }
      /> */}
    </div>
    // <div
    //   className="text-brand text-underline html2canvas-filter"
    //   style={{
    //     display: "flex",
    //     justifyContent: "center",
    //   }}
    // >
    //   <Link
    //     to="https://docs.footprint.network/docs/sql-compatible"
    //     // target="_blank"
    //     onClick={() => trackStructEvent(`error-guide-fix-${cardId}`)}
    //   >
    //     Goto config connector now.
    //   </Link>
    //   {/* <div className="ml2"/>
    //   <Link
    //     to="https://discord.gg/3HYaR6USM7"
    //     target="_blank"
    //     onClick={() => trackStructEvent(`error-guide-report-${cardId}`)}
    //   >
    //     Report to community
    //   </Link> */}
    // </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    project: props.params.project,
    menu: props.params.menu,
  };
};

export default withRouter(connect(mapStateToProps)(FgaErrorGuide));
