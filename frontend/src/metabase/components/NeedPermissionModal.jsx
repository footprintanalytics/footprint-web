/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import ModalContent from "metabase/components/ModalContent";
import { Flex, Box } from "grid-styled";
import { Link, withRouter } from "react-router";
import SvgEmptyPermission from "metabase/components/icons/SvgEmptyPermission";
import Modal from "./Modal";
import { isDefi360 } from "metabase/lib/project_info";
import { message } from "antd";

@withRouter
export default class NeedPermissionModal extends Component {
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
          <Flex
            flexDirection="column"
            justifyContent="center"
            style={{ padding: "0px 30px 20px" }}
          >
            <Box mt={60} />
            <SvgEmptyPermission />
            <div
              style={{
                fontSize: 16,
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
                window.location.href = "/pricing";
                afterChangeLocation && afterChangeLocation();
              }}
            >
              {"Upgrade now"}
            </Link>
          </Flex>
        </ModalContent>
      </Modal>
    );
  }
}
