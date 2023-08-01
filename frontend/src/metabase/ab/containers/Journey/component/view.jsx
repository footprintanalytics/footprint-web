/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { debounce } from "lodash";
import { Drawer, DatePicker, Button, Select, Modal, Form, Input } from "antd";
import Link from "metabase/core/components/Link";
import Detail from "./detail";
import Icon from "metabase/components/Icon";
import dayjs from "dayjs";
import "../index.css";
import { getProject } from "metabase/lib/project_info";
import { getFgaProject, getUser } from "metabase/selectors/user";
import { connect } from "react-redux";
import Buttons from "metabase/ab/containers/Journey/component/Buttons";
import Head from "metabase/ab/containers/Journey/component/Head";
import SankeyChart from "metabase/ab/containers/Journey/component/SankeyChart";

const View = props => {
  const { projectObject, router } = props;
  const projectName = projectObject.protocolSlug
  const [nodeDetail, setNodeDetail] = useState();


  return (
    <div className="journey-view">
      <Head title="Journey" buttons={["create", "list"]} router={router}/>
      <div className="journey-edit__main">
        <SankeyChart title="NFT Airdrop"/>
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
