/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import PeaPage from "metabase/ab/containers/PeaPage";
import { useQuery } from "react-query";
import { getPeaTokenAPI } from "metabase/new-service";
import { QUERY_OPTIONS_NORMAL } from "metabase/containers/dashboards/shared/config";
import { Skeleton, Button } from "antd";
import { loginModalShowAction } from "metabase/redux/control";
import { push } from "react-router-redux";
import { getPeaHost } from "metabase/ab/utils/utils";

const ActivityHub = props => {
  const {router, location, user, setLoginModalShow} = props
  const paramsSearch = location.query.params ? decodeURIComponent(location.query.params) : "1=1"
  const { isLoading, data: peaToken } = useQuery(
    ["getPeaTokenAPI"],
    async () => {
      return await getPeaTokenAPI();
    },
    {...QUERY_OPTIONS_NORMAL, enabled: !!user },
  );
  const url = `${getPeaHost()}${paramsSearch}&app_name=fga&token=${(user ? peaToken : "") || ""}`
  if (isLoading) {
    return (<Skeleton />)
  }

  return (
    <div style={{width: "100%"}}>
      <PeaPage
        router={router}
        location={location}
        url={url}
        toLoginCallback={() => {
          setLoginModalShow({
            show: true,
            from: "quest detail",
          });
        }}
      />
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
  };
};

const mapDispatchToProps = {
  onChangeLocation: push,
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityHub);
