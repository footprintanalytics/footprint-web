/* eslint-disable curly */
/* eslint-disable react/prop-types */
import React, { useEffect } from "react";
import { Button } from "antd";
import ProfileLink from "metabase/nav/components/ProfileLink";
import { trackStructEvent } from "metabase/lib/analytics";
import { demoTip, isDemo } from "../utils/dashboard";

const User = props => {
  const { user, router, location } = props;
  const isLogin = user && user.groups && user.groups.includes("ga");

  useEffect(() => {
    if (
      user?.groups &&
      !user?.groups?.includes("ga") &&
      location.pathname === "/ga"
    ) {
      demoTip();
    }
  }, [location.pathname, user?.groups]);

  const login = () => {
    router.push(
      "/ga/loginModal?loginState=signIn&from=ga_about&redirect=/ga&project=ga&disableCheckLogin=true",
    );
  };

  return (
    <>
      {isLogin ? (
        <ProfileLink {...props} />
      ) : (
        <Button
          className="ga-layout__sign"
          onClick={() => {
            trackStructEvent("Footprint Growth Analytics", "Sign In");
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
