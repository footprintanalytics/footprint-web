/* eslint-disable react/prop-types */
import React from "react";
import { Button, Result, Avatar, Image } from "antd";
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
        justifyContent: "center",
      }}
    >
      <Result
        style={{ margin: 0 }}
        icon={
          <Image
            preview={false}
            style={{
              height: "50%",
              width: "50%",
              minHeight: 30,
              minWidth: 50,
              maxHeight: 500,
              maxWidth: 550,
            }}
            src={
              "https://footprint-imgs.oss-us-east-1.aliyuncs.com/no-data01.svg"
            }
          />
        }
        // title="There is currently no data available for this project."
        subTitle="Unfortunately, there is no data available for the current project. However, if you have configured the connector, you can gain valuable insights about your users by accessing additional data."
        extra={
          <Button
            type="primary"
            onClick={() => {
              router.push(getGrowthProjectPath(project, "Connector"));
            }}
          >
            Config Connector now
          </Button>
        }
      />
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
