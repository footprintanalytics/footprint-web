/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { connect } from "react-redux";
import { Button, Card, Typography } from "antd";
import Link from "metabase/core/components/Link/Link";
import { getUser } from "metabase/selectors/user";
import "../css/index.css";

const DashboardMask = props => {
  let content = ``;

  const contact = (
    <div className="mt2">
      <Link target="_blank" href="mailto:sales@footprint.network">
        Email: sales@footprint.network
      </Link>
    </div>
  );

  if (["game_tokenomics", "game_revenue", "nft_revenue"].includes(props.currentMenu)) {
    // need to upgrade plan
    content = (
      <div className="flex flex-col justify-center p2" style={{ width: 500 }}>
        <h3 className="text-white">You need to upgrade plan.</h3>
        <Typography.Text className="mt2">
          This data is only available for Growth and above pricing plans, you
          will need to upgrade your account first.
          <br />
          <br />
          If you have any questions, please feel free to contact our BD team.
          Thank you.
        </Typography.Text>
        {contact}
        <div>
          <Link
            target="_blank"
            className="mt2"
            href="https://t.me/joinchat/4-ocuURAr2thODFh"
          >
            Telegram: @dplinnn
          </Link>
        </div>
        <div className="flex flex-row items-center justify-end w-full">
          <Button
            type="primary"
            className="mt2"
            onClick={() => {
              props.router.push("/growth/pricing");
            }}
          >
            Upgrade Plan
          </Button>
        </div>
      </div>
    );
  } else {
    // data is not yet available
    content = (
      <div className="flex flex-col justify-center p2" style={{ width: 500 }}>
        <h3 className="text-white">The data is not yet available.</h3>
        <Typography.Text className="mt2">
          If you wish to view data dashboards related to your own project,
          please feel free to contact our BD team. Thank you.
        </Typography.Text>
        {contact}
        <div>
          <Link
            target="_blank"
            className="mt2"
            href="https://t.me/joinchat/4-ocuURAr2thODFh"
          >
            Telegram: @dplinnn
          </Link>
        </div>
        <div className="flex flex-row items-center justify-end w-full">
          <Button
            type="primary"
            className="mt2"
            onClick={() => {
              window.open("https://forms.gle/Xs8WahhYh26xKoDj7", "_blank");
            }}
          >
            Book a meeting
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full ml-250  mt-60 fga-mask flex flex-col items-center "
      style={{
        paddingRight: 250,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 3,
      }}
    >
      <Card className="mt-250">{content}</Card>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(DashboardMask);
