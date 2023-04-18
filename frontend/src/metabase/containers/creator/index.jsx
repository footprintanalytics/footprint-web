/* eslint-disable react/prop-types */
import React from "react";
import "./index.css";
import { connect } from "react-redux";
import { compose } from "underscore";
import { useQuery } from "react-query";
import { Skeleton } from "antd";
import Personal from "metabase/containers/creator/components/personal";
import List from "metabase/containers/creator/components/personal/list";
import MetaViewportControls from "metabase/dashboard/hoc/MetaViewportControls";
import title, { updateTitle } from "metabase/hoc/Title";
import { personalInfo } from "metabase/new-service";
import { getProject } from "metabase/lib/project_info";
import Link from "metabase/core/components/Link";
import Meta from "metabase/components/Meta";
import { getOssUrl } from "metabase/lib/image";
import { ossPath } from "metabase/lib/ossPath";
import { get } from "lodash";

const Index = ({ router, user, params, userInfoDataApi }) => {
  const name = params?.name?.replace("@", "") || "";

  if (name) {
    updateTitle(`@${name}`);
  }

  const personalInfoParams = {
    name: name,
    project: getProject(),
  };

  const { isLoading, data, error } = useQuery(
    ["personalInfo", personalInfoParams],
    async () => {
      return personalInfo(personalInfoParams);
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  if (isLoading) {
    return (
      <div className="creator__personal">
        <Skeleton active />
      </div>
    );
  }

  if (error) {
    return (
      <div className="creator__personal flex flex-column footprint-title2">
        <span>{`Info: ${error}`}</span>
        <span>
          {"Please view the correct "}
          <Link to="/" className="text-brand">
            link
          </Link>
        </span>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      {data && (
        <Meta
          title={`${get(data, "userInfo.name")} - Footprint Analytics`}
          description={get(data, "userInfo.bio")}
          keywords={name}
        />
      )}
      <div className="creator__wrap">
        <span>Preview</span>
        <Personal router={router} user={user} data={data} />
        <List
          router={router}
          user={user}
          name={name}
          location={router.location}
        />
      </div>
    </>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
    userInfoDataApi: state.vipInfoDataApi,
  };
};

export default compose(
  connect(mapStateToProps),
  MetaViewportControls,
  title(),
)(Index);
