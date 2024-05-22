/* eslint-disable react/prop-types */
import React from "react";
import { Button, Result } from "antd";
import { connect } from "react-redux";
import { SmileOutlined } from "@ant-design/icons/lib/icons";
import { getFgaProject, getUser } from "metabase/selectors/user";

const ContactUs = props => {

  return (
    <div
      className="flex flex-column items-center"
      style={{ marginBottom: 100, padding: 60 }}
    >
      {/*<span style={{color: "#ffffff", fontSize: 20, padding: 10}}>Contact Us</span>*/}
      <Result
        icon={<SmileOutlined />}
        title="Please contact the BD team to add more project"
        extra={
          <Button
            style={{ marginTop: 20 }}
            onClick={() => {
              window.open("mailto:sales@footprint.network");
            }}
          >
            Contact Us
          </Button>
        }
      />
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectObject: getFgaProject(state),
  };
};

export default connect(mapStateToProps)(ContactUs);
