/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { connect } from "react-redux";
import { Button, Card, Typography } from "antd";
import Link from "metabase/core/components/Link/Link";
import { getUser } from "metabase/selectors/user";
import "../css/index.css";

const DashboardMask = props => {
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
      <Card className="mt-250">
        <div className="flex flex-col justify-center p2" style={{ width: 500 }}>
          <h3 className="text-white">The data is not yet available.</h3>
          <Typography.Text className="mt2">
            {
              "We're still prepping the data, but don't panic. Reach out to our sales team and we'll fast-track the production process."
            }
          </Typography.Text>
          <div className="mt1">
            <Link target="_blank" href="mailto:sales@footprint.network">
              Email: sales@footprint.network
            </Link>
          </div>
          <div>
            <Link
              target="_blank"
              className="mt2"
              href="https://t.me/joinchat/4-ocuURAr2thODFh"
            >
              Telegram: @dplinnn
            </Link>
          </div>
          <div className="flex flex-row items-center justify-center w-full">
            <Button
              type="primary"
              className="mt2 w-1_2"
              onClick={() => {
                window.open("https://forms.gle/Xs8WahhYh26xKoDj7", "_blank");
              }}
            >
              Book a meeting
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(DashboardMask);
