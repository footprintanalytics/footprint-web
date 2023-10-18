/* eslint-disable react/prop-types */
import React, { useContext,useState } from "react";
import { connect } from "react-redux";
import { Button, Card, Typography } from "antd";
import Link from "metabase/core/components/Link/Link";
import { getUser } from "metabase/selectors/user";
import "../css/index.css";
import UpdateProjectModal from "./Modal/UpdateProjectModal"
import { getGrowthProjectPath } from "metabase/ab/utils/utils";

const DashboardMask = props => {
  let content = ``;

  const [projectModalShow, setProjectModalShow] = useState({show:false,force:false});
  const contact = (
    <div className="mt2">
      <Link target="_blank" href="mailto:sales@footprint.network">
        Email: sales@footprint.network
      </Link>
    </div>
  );
  if (["set_protocol"].includes(props.currentMenu)) {
    // need to set protocol
    content = (
      <div className="flex flex-col justify-center p2" style={{ width: 500 }}>
        <h3 className="text-white">You need to set up a protocol.</h3>
        <Typography.Text className="mt2">
          This project does not currently set up a protocol. You can set one and
          unlock more features to use.
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
              setProjectModalShow({show:true,force:false});
            }}
          >
            Set up now
          </Button>
        </div>
      </div>
    );
  } else if (
    ["game_tokenomics", "game_revenue", "nft_revenue"].includes(
      props.currentMenu,
    )
  ) {
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
              props.router.push("/fga/pricing");
            }}
          >
            Upgrade Plan
          </Button>
        </div>
      </div>
    );
  } else if (
    ["web2_connect"].includes(
      props.currentMenu,
    )
  ) {
    // need to upgrade plan
    content = (
      <div className="flex flex-col justify-center p2" style={{ width: 500 }}>
        <h3 className="text-white">You need to set up connector</h3>
        <Typography.Text className="mt2">
          Please use connector to upload web2 data before you can see the web2 dashboard.
        </Typography.Text>
        <div className="flex flex-row items-center justify-end w-full">
          <Button
            type="primary"
            className="mt2"
            onClick={() => {
              props.router.push(getGrowthProjectPath(props.project.protocolSlug,"integration"));
            }}
          >
            Set up connector
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
      <UpdateProjectModal
          open={projectModalShow?.show}
          force={projectModalShow?.force}
          location={location}
          onSuccess={() => {
            setProjectModalShow({ show: false });
          }}
          onCancel={() => {
            setProjectModalShow({ show: false });
          }}
        ></UpdateProjectModal>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps)(DashboardMask);
