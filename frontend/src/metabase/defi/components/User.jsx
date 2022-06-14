/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import ProfileLink from "metabase/nav/components/ProfileLink";
import { demoTip, isDemo } from "../utils/dashboard";
import { trackStructEvent } from "metabase/lib/analytics";
import { Button } from "antd";

const User = props => {
  const { user, router, location } = props;
  const isLogin = user && user.groups && user.groups.includes("Defi360");

  useEffect(() => {
    if (
      user?.groups &&
      !user?.groups?.includes("Defi360") &&
      location.pathname === "/defi360"
    ) {
      demoTip();
    }
  }, [location.pathname, user?.groups]);

  const login = () => {
    router.push(
      "/defi360/loginModal?loginState=signIn&from=defi360_about&redirect=/defi360/protocol-dashboard&project=defi360&disableCheckLogin=true",
    );
  };

  return (
    <>
      {isLogin ? (
        <ProfileLink {...props} />
      ) : (
        <Button
          className="defi-layout__sign"
          onClick={() => {
            trackStructEvent("Footprint Enterprise", "Sign In");
            if (isDemo()) {
              demoTip();
            } else {
              login();
            }
          }}
        >
          Sign In
        </Button>
      )}
    </>
  );
};

export default User;
