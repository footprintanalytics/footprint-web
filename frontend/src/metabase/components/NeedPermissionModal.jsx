/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { message } from "antd";
import { Link, withRouter } from "react-router";
import ModalContent from "metabase/components/ModalContent";
import SvgEmptyPermission from "metabase/components/icons/SvgEmptyPermission";
import { isDefi360 } from "metabase/lib/project_info";
import Modal from "./Modal";

class NeedPermissionModal extends Component {
  static propTypes = {
    onClose: PropTypes.func,
    title: PropTypes.string,
  };

  static defaultProps = {
    title: "Sorry, You don't have permission.",
  };

  render() {
    const { title, onClose, afterChangeLocation } = this.props;
    return (
      <Modal className="w-auto" ModalClass="z-index-top" onClose={onClose}>
        <ModalContent onClose={onClose}>
          <div className="flex flex-column justify-center"
            style={{ padding: "0px 30px 20px" }}
          >
            <div style={{ marginTop: 60 }} />
            <SvgEmptyPermission />
            <div
              style={{
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
                margin: "10px 0px 20px",
                maxWidth: "400px",
              }}
            >
              {title}
            </div>
            <Link
              className="Button Button--primary text-centered"
              style={{ width: 200, margin: "auto" }}
              onClick={() => {
                if (isDefi360()) {
                  message.info("Coming soon.");
                  return;
                }
                if (window?.parent) {
                  window?.open("/pricing")
                } else {
                  window.location.href = "/pricing";
                }
                afterChangeLocation && afterChangeLocation();
              }}
            >
              {"Upgrade Now"}
            </Link>
          </div>
        </ModalContent>
      </Modal>
    );
  }
}

export default withRouter(NeedPermissionModal);
