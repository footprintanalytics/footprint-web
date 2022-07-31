/* eslint-disable curly */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import React, { memo } from "react";
import connect from "react-redux/lib/connect/connect";
import { compose } from "underscore";
import "./TableChartInfo.css";
import ModalContent from "metabase/components/ModalContent";
import Modal from "metabase/components/Modal";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";
import { useQuery } from "react-query";
import { chartInfo } from "metabase/new-service";
import { QUERY_OPTIONS } from "metabase/containers/about/config";
import moment from "moment";

const TableChartInfoModel = ({
  showInfo,
  cardId,
  dashboardId,
  parameters = [],
  onCancel,
}) => {
  const params = {
    id: cardId,
    model: "card",
    dashboard_id: dashboardId,
    parameters: parameters,
  };

  const { isLoading, data, error } = useQuery(
    ["chartInfo", params],
    async () => {
      return await chartInfo(params);
    },
    { ...QUERY_OPTIONS, retry: 0 },
  );

  const formatDate = date => {
    if (!date) {
      return "none";
    }
    return `${moment(date)
      .utc()
      .format("YYYY-MM-DD HH:mm:ss")} (UTC)`;
  };

  const renderTableInfo = () => {
    console.log("showInfoshowInfoshowInfo", showInfo);
    return (
      <div>
        <h1>Chart info</h1>
        <div className="flex">
          <div style={{ width: 150 }}>Cache last update: </div>
          {formatDate(data?.cacheUpdated)}
        </div>
        <div className="flex">
          <div style={{ width: 150 }}>Table last update: </div>
          {formatDate(data?.tableUpdated)}
        </div>
        {showInfo && (
          <div
            style={{
              height: "2px",
              background: "aliceblue",
              margin: "10px 0",
            }}
          />
        )}
        <div>{showInfo}</div>
      </div>
    );
  };

  console.log("isLoading", isLoading);
  console.log("data", data);

  return (
    <>
      <Modal normal dismissOnClickOutside={false}>
        <ModalContent
          className="Modal-content Modal-content--small new-guide-start__modal"
          onClose={onCancel}
        >
          <LoadingAndErrorWrapper loading={!data} error={error}>
            {() => renderTableInfo()}
          </LoadingAndErrorWrapper>
        </ModalContent>
      </Modal>
    </>
  );
};

const mapStateToProps = state => ({});

export default compose(connect(mapStateToProps, null))(
  memo(TableChartInfoModel),
);
