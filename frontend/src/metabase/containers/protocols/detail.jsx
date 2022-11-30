/* eslint-disable react/prop-types */

import React, { useEffect, useState } from "react";
import ShareModal from "metabase/containers/home/components/ShareModal";
import "./detail.css";
import "../dashboards/components/Dashboards/index.css";
import title, { updateTitle } from "metabase/hoc/Title";
import { connect } from "react-redux";
import { compose } from "metabase/lib/redux";
import { getLandingDetail } from "metabase/new-service";
import { useQuery } from "react-query";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { Skeleton } from "antd";
import DefaultDashboardCard from "metabase/components/DefaultDashboardCard";
import DetailHead from "metabase/containers/protocols/components/detail/DetailHead";
import PreviewDashboardCard from "metabase/components/PreviewDashboardCard";
import List from "metabase/containers/dashboards/components/Dashboards/List";
import { get } from "lodash";
import { parseTitleId } from "metabase/lib/urls";

const ProtocolDetail = ({ user, router, protocolId }) => {
  const [shareModalResource, setShareModalResource] = useState({});
  const params = {
    protocol_id: protocolId,
  };

  const { isLoading, data } = useQuery(
    ["getLandingDetail", "protocol", params],
    async () => {
      return await getLandingDetail("protocol", params);
    },
    QUERY_OPTIONS,
  );

  useEffect(() => {
    if (data) {
      updateTitle(get(data, "basic.protocol_name"));
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="project-detail__container">
        <div className="project-detail__head">
          <div className="project-detail__head-container">
            <Skeleton active />
          </div>
        </div>
        <div className="project-detail__Content">
          <Skeleton active />
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="project-detail__container">
        {data && (
          <React.Fragment>
            <DetailHead protocol={data.basic} router={router} />
            <div className="project-detail__Content">
              <div className="project-detail__section">
                <span className="project-detail__section-title">
                  Featured Dashboard
                </span>

                <div className="project-detail__dashboard-list">
                  {data.hots?.data?.length === 0 && (
                    <DefaultDashboardCard height={225} />
                  )}
                  {data.hots?.data?.map((item, index) => (
                    <div key={index} className="project-detail__dashboard-item">
                      <PreviewDashboardCard
                        item={{ ...item }}
                        shareAction={entity => {
                          setShareModalResource({
                            open: true,
                            public_uuid: entity.publicUuid,
                            type: entity.type,
                            name: entity.name,
                            id: entity.id,
                            uniqueName: entity.uniqueName,
                            creator: entity.creator,
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="project-detail__section">
                <List
                  user={user}
                  router={router}
                  protocolName={data.basic?.protocol_name}
                />
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
      <ShareModal
        resource={shareModalResource}
        onClose={() => setShareModalResource({})}
      />
    </React.Fragment>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: state.currentUser,
    protocolId: props.params.id || parseTitleId(props.params.slug).id,
  };
};

export default compose(connect(mapStateToProps), title())(ProtocolDetail);
