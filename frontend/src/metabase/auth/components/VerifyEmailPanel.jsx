/* eslint-disable react/prop-types */
import React from "react";

import Link from "metabase/core/components/Link";
import { trackStructEvent } from "metabase/lib/analytics";

const VerifyEmailPanel = ({ show, backToLoginIn, resendAction }) =>
  !show ? (
    <div />
  ) : (
    <div className="flex flex-column">
      <div className="mt4"/>
      <div className="mt4"/>
      <div className="verify-email__title">
        Your account is not active yet. Please verify your email.
      </div>
      <div className="verify-email__desc">
        If you do not verify the email address within 10 minutes, will need to
        resend the activation link.
      </div>
      <Link
        className="loginBottomSignButton"
        onClick={backToLoginIn}
        style={{ margin: "80px auto 0px", padding: "5px" }}
      >
        <span className="link">Go back</span>
      </Link>
      <Link
        className="loginBottomSignButton"
        onClick={e => {
          e.preventDefault();
          trackStructEvent(`login-modal click resend`);
          resendAction();
        }}
      >
        {"Haven't received verification link?"}{" "}
        <span className="link">Resend</span>
      </Link>
    </div>
  );
export default VerifyEmailPanel;
