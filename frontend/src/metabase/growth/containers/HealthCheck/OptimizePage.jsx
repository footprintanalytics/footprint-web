/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Alert,
  Breadcrumb,
  Progress,
  Typography,
  Spin,
  Avatar,
  Card,
  Divider,
} from "antd";
import {
  EditOutlined,
  LoadingOutlined,
  DeleteOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { useQuery } from "react-query";
import lottie from "lottie-web/build/player/lottie_svg";
import { withRouter } from "react-router";
import cx from "classnames";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { getOssUrl } from "metabase/lib/image";
import { GetFgaCohort } from "metabase/new-service";
import { data_scanning } from "../../utils/data-scanning";
const { Text } = Typography;
import "animate.css";

const OptimizePage = props => {
  const { router, children, user, project, onOptimize } = props;
  const ref = useRef();
  const [cohortId, setCohortId] = useState(router?.location?.query?.id);
  const [score, setScore] = useState(0);
  useEffect(() => {
    startCountdown(2000, 90);
  }, []);
  const startCountdown = (totalTime, targetScore) => {
    const intervalTime = 2000 / targetScore;
    let timerId = setInterval(() => {
      setScore(
        score => score + Math.floor(intervalTime / (totalTime / targetScore)),
      );
    }, intervalTime);
    setTimeout(() => {
      clearInterval(timerId);
      setScore(targetScore);
    }, totalTime + intervalTime);
  };

  return (
    <div
      className="flex flex-column items-center"
      style={{ width: "100%", maxWidth: 800, minWidth: 800 }}
    >
      <Card className="w-full rounded">
        <div className="flex flex-column items-center w-full p4">
          <h1>Optimize cohort</h1>
          <Typography.Text className="mt4">Coming soon~</Typography.Text>
        </div>
      </Card>
    </div>
    // </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    project: getFgaProject(state),
  };
};

export default withRouter(connect(mapStateToProps)(OptimizePage));
