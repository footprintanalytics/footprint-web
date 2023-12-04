/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { setGames } from "metabase/redux/control";
import SubmitContract from "metabase/submit/contract/reference";
import { IconBack } from "metabase/components/IconBack";

const MySubmitProject = props => {
  const { router } =
    props;

  return (
    <div className="flex flex-column items-center">
      <SubmitContract
        showAdd={false}
        showActionColumn={false}
        tableRowClassName={"SubmitContract__table-row-fga"}
        byUser={true}
        headLayout={(
          <div className="flex">
            <IconBack router={router} url="/fga"/>
            <h2>My Submitted Project Records</h2>
          </div>
        )}
      />
    </div>
  );
};

const mapDispatchToProps = {
  setGames: setGames,
};

const mapStateToProps = (state, props) => {
  return {
    user: getUser(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MySubmitProject);
