/* eslint-disable react/prop-types */
import React from "react";
// import Link from "antd/lib/typography/Link";
import { connect } from "react-redux";
import { getFgaProject, getUser } from "metabase/selectors/user";
import "../css/index.css";
import { getFgaChain } from "metabase/selectors/control";
import InfoGenerate from "metabase/ab/components/InfoGenerate";
import { Card } from "antd";
import Title from "antd/lib/typography/Title";

const KeysIds = props => {
  const { router, project, location, user, chain, businessType, setProjectSubmitModalShowAction } = props;

  return (
    <div className="flex flex-col w-full items-center">
      <div
        className=" flex flex-column items-center"
         style={{
           width: 800,
           // backgroundColor: "white",
           borderRadius: 10,
           padding: "20px 20px 40px 20px",
           marginTop: 20,
         }}>
        <div className=" flex flex-row justify-between w-full mb2" >
          <Title width={"100%"} level={4} style={{ marginBottom: 0 }}>
            Key & IDs
          </Title>
        </div>
        <Card
          style={{
            width: "100%",
            borderRadius: 10,
            padding: 10,
            marginTop: 20,
          }}
        >
          <InfoGenerate project={project}/>
        </Card>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
    project: getFgaProject(state),
    chain: getFgaChain(state),
  };
};

const mapDispatchToProps = {
};
export default connect(mapStateToProps, mapDispatchToProps)(KeysIds);
