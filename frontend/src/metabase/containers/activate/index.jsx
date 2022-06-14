/* eslint-disable react/prop-types */

import React, { useEffect, useState } from "react";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";
import "./index.css";
import { registerAndLogin } from "metabase/auth/auth";
import { connect } from "react-redux";

const ActivateAccount = props => {
  const { location, router, registerAndLogin } = props;
  const [error, setError] = useState();
  const token = location.query.token;

  useEffect(() => {
    const goHome = () => {
      router.replace("/");
    };
    const run = async () => {
      try {
        await registerAndLogin({ token, redirectUrl: "/" });
      } catch (e) {
        setError({ message: e });
        setTimeout(() => {
          goHome();
        }, 3000);
      }
    };
    if (token) {
      run();
    } else {
      goHome();
    }
  }, [registerAndLogin, router, setError, token]);

  return (
    <div className="activate">
      <LoadingAndErrorWrapper
        className="shrink-below-content-size full-height flex-full"
        loading={true}
        error={error}
        loadingMessages={["Activate Account..."]}
      />
    </div>
  );
};

function mapStateToProps(state) {
  return {};
}

const mapDispatchToProps = {
  registerAndLogin,
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivateAccount);
