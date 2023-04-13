/* eslint-disable react/prop-types */
import React from "react";
import { connect } from "react-redux";
import { useQueries } from "react-query";
import { getUser, getFgaProject } from "metabase/selectors/user";
import { QUERY_OPTIONS } from "metabase/containers/dashboards/shared/config";
import { project } from "cljs/clojure.set";
import {
  getCommunityInfo,
  getCommunityQuickFilter,
} from "metabase/new-service";
import { StatisticIndex } from "../components/Community/StatisticIndex";
import { QuickFilter } from "../components/Community/QuickFilter";
import { ValueFilter } from "../components/Community/ValueFilter";
import { WalletList } from "../components/Community/WalletList";

const Community = props => {
  const { router, location, children, user, projectPath, menu, project } =
    props;
  const results = useQueries(
    [
      {
        queryKey: ["getCommunityInfo", project?.id],
        queryFn: async () => getCommunityInfo({ projectId: project?.id }),
      },
      {
        queryKey: ["getCommunityQuickFilyer", project?.id],
        queryFn: async () =>
          getCommunityQuickFilter({ projectId: project?.id }),
      },
    ],
    QUERY_OPTIONS,
  );
  console.log("results", results);
  return (
    <div className="flex flex-column items-center w-full p2">
      <StatisticIndex />
      <ValueFilter className="mt2" />
      <QuickFilter />
      <WalletList router={router} />
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
    projectPath: props?.params?.project,
    projectObject: getFgaProject(state),
    menu: props?.params?.menu,
  };
};

export default connect(mapStateToProps)(Community);
