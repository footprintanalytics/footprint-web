/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, message, Modal, Skeleton } from "antd";
import "./TaggingModal.css";
import { connect } from "react-redux";
import {
  getDashboardWatermark,
  postDashboardWatermark,
} from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";

const WatermarkModal = ({ onClose, id }) => {
  const [ loading, setLoading ] = useState(false);

  const { isLoading, data, refetch } = useQuery(
    ["getDashboardWatermark", id],
    async () => {
      return await getDashboardWatermark({ id, type: "" });
    },
    QUERY_OPTIONS,
  );

  const type = data?.type || "show";
  const onCancel = () => {
    onClose && onClose();
  };

  const watermarkAction = async (id, type) => {
    setLoading(true);
    const hide = message.loading("Loading...", 0);
    await postDashboardWatermark({ id, type });
    await refetch();
    hide();
    setLoading(false);
  };

  return (
    <Modal
      className="tagging-modal"
      open={true}
      footer={null}
      maskClosable={false}
      title={"Watermark Setting"}
      onCancel={onCancel}
    >
      {name && <div className="footprint-title2">{name}</div>}

      {
        isLoading ? (
          <Skeleton active />
        ) : (
          <>
            <div>
              Current dashboard watermark: <span className="text-2xl text-bold">{type}</span>
              <br />
              You can refresh dashboard after setting success.
            </div>
            <div className="flex justify-center mt4">
              <Button
                disabled={loading}
                onClick={() => {
                  watermarkAction(id, type === "hide" ? "show" : "hide");
                }}
              >
                {type === "hide" ? "set show" : "set hide"}
              </Button>
            </div>
          </>
        )
      }

    </Modal>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state, props),
  };
};

export default connect(mapStateToProps, null)(WatermarkModal);
