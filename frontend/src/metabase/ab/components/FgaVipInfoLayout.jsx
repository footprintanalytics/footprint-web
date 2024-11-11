/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
// import Link from "antd/lib/typography/Link";
import React from "react";
import { connect } from "react-redux";
import { getFgaProject, getUser } from "metabase/selectors/user";
import "../css/index.css";
import { Button } from "antd";

const FgaVipInfoLayout = props => {
  const { user, upgradeOnclick } = props;
  console.log(user);
  const showUpgrade = user?.vipInfoFga?.type !== "advanced";
  return (
    <div className="flex flex-column" style={{gap: 10}}>
      Vip Info Level: {user?.vipInfoFga?.type},  valid until {user?.vipInfoFga?.validEndDate}
      <div className="flex items-center" style={{gap: 10}}>
        {showUpgrade && <Button onClick={upgradeOnclick}>Upgrade</Button>}
        <Button>Cancel Subscribe</Button>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
    project: getFgaProject(state),
  };
};

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(FgaVipInfoLayout);
