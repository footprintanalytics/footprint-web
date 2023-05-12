/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Breadcrumb,
  Select,
  Typography,
  Divider,
  message,
  Card,
} from "antd";
import { connect } from "react-redux";
import { useQuery } from "react-query";
import cx from "classnames";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { getOssUrl } from "metabase/lib/image";
import { GetFgaCohort } from "metabase/new-service";
import "animate.css";

const { Text } = Typography;

const LandingPage = props => {
  const { project, onSelectCohort } = props;

  const [options, setOptions] = useState([]);
  const [cohort, setCohort] = useState(null);
  const { isLoading: loadingData, data: cohortData } = useQuery(
    ["getCohort", project?.id],
    async () => await GetFgaCohort({ projectId: project?.id }),
    { ...QUERY_OPTIONS, enabled: !!project?.id },
  );

  useEffect(() => {
    if (cohortData) {
      const options = [];
      cohortData?.list?.forEach(item => {
        options.push(
          <Select.Option
            key={item.cohortId}
            label={item.title}
            value={item.cohortId}
            disabled={item.numberOfWallets === 0}
          >
            <div className="flex flex-row items-center justify-between">
              <div>{item.title}</div>
              <div style={{ color: "GrayText" }}>
                {item.numberOfWallets} wallets
              </div>
            </div>
          </Select.Option>,
        );
      });
      setOptions(options);
    }
  }, [cohortData]);

  const handleProjectChange = (value, option) => {
    const item = cohortData?.list?.find(item => item.cohortId === value);
    setCohort(item);
    console.log("handleProjectChange", value, option, item);
  };
  const workDemoList = [
    {
      title: "Evaluate user potential value",
      desc: "By monitoring the token and NFT assets held by users through their wallet addresses, Web3 projects can identify what tokens and NFTs users own, their quantity and value, position and interests in ecosystem",
      img: getOssUrl("wallet_profile_img1.png"),
    },
    {
      title: "Identify user behavior preferences",
      desc: "Analyzing which games users have played and where they have conducted transactions can provide insights into user activity levels and preferences",
      img: getOssUrl("wallet_profile_img2.png"),
      reverse: true,
    },
  ];
  return (
    // <div
    //   className="flex flex-column items-center p1"
    //   style={{ marginBottom: 100 }}
    // >
    <div
      className="flex flex-column items-center"
      style={{ width: "100%", maxWidth: 1000, minWidth: 600 }}
    >
      <Card className="w-full animate__animated animate__faster animate__zoomIn">
        <div className="flex flex-column items-center  w-full ">
          <h1 className="w-full text-centered">
            Select a campaign cohort for diagnosis
          </h1>
          {/* <Typography.Text className=" w-full text-centered">
              {
                "Gain insight into your users' financial behavior and transaction history by exploring their wallet profiles with ease."
              }
            </Typography.Text> */}
          <div
            className="mt3 flex flex-row"
            style={{ width: "100%", maxWidth: 500 }}
          >
            <Select
              size="large"
              showSearch
              loading={loadingData}
              // value={currentProject}
              onChange={handleProjectChange}
              style={{
                flex: 1,
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
              placeholder="Select a campaign cohort for diagnosis"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              // options={options}
            >
              {options}
            </Select>
            <Button
              type="primary"
              size="large"
              style={{ borderTopRightRadius: 5, borderBottomRightRadius: 5 }}
              onClick={() => {
                if (!cohort) {
                  message.error("Please select a campaign cohort.");
                  return;
                }
                onSelectCohort?.(cohort);
              }}
            >
              Start now
            </Button>
          </div>
        </div>
      </Card>
      <h2 className="animate__animated animate__faster animate__fadeInDown mt-60 w-full text-centered">
        How it works
      </h2>
      {workDemoList.map((item, index) => {
        return (
          <div
            key={item.title}
            className={cx(
              `animate__animated animate__faster animate__fadeInDown animate__delay-${
                index + 1
              } mt4 flex flex-row w-full items-center justify-between`,
              { "flex-row-reverse": item.reverse },
            )}
          >
            <img src={item.img} style={{ width: "50%" }} alt={item.title} />
            <div
              className="flex flex-column p2"
              style={{ width: "50%", textAlign: "left" }}
            >
              <h2>{item.title}</h2>
              <Text className="mt1" style={{ whiteSpace: "pre-line" }}>
                {item.desc}
              </Text>
            </div>
          </div>
        );
      })}
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

export default connect(mapStateToProps)(LandingPage);
