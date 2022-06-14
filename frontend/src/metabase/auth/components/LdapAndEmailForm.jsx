/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { Link } from "react-router";
import { connect } from "react-redux";

import Settings from "metabase/lib/settings";

import { getRegistEmail, login, regist } from "../auth";
import { Flex, Box } from "grid-styled";
import SignInPanel from "metabase/auth/components/SignInPanel";
import SignUpPanel from "metabase/auth/components/SignUpPanel";
import VerifyEmailPanel from "metabase/auth/components/VerifyEmailPanel";
import LogoIcon from "metabase/components/LogoIcon";
import { color } from "metabase/lib/colors";

const mapDispatchToProps = { login, regist, getRegistEmail };

@connect(null, mapDispatchToProps)
export default class LdapAndEmailForm extends Component {
  state = {
    verification: false,
    signTabState: "", //signIn signUp
    email: "",
    initEmail: "", //url param
    signUpCredentials: {},
    channel: "", //url param
  };

  componentDidMount() {
    this.getRedirectChannel();

    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const email = params.get("email") || "";
    const signUp = params.get("register") || false;
    if (email.length > 0) {
      this.setState({ initEmail: email });
    }
    this.setState({ signTabState: signUp ? "signUp" : "signIn" });
  }

  getRedirectChannel = () => {
    const search = this.props.location.search;
    const params = new URLSearchParams(search);
    const redirect = params.get("redirect") || "";
    let channel = params.get("channel") || "";
    if (redirect.length > 0 && channel.length === 0) {
      const index = redirect.indexOf("?");
      if (index > 0) {
        const redirectSearch = redirect.substring(index);
        const redirectParams = new URLSearchParams(redirectSearch);
        channel = redirectParams.get("channel") || "";
      }
    }
    this.setState({ channel: channel });
  };

  isSignIn = () => {
    return this.state.signTabState === "signIn";
  };

  isSignUp = () => {
    return this.state.signTabState === "signUp";
  };

  isSignUpConfirm = () => {
    return this.isSignUp() && this.state.verification;
  };

  onSignInSubmit = async credentials => {
    const { login, location } = this.props;
    await login(credentials, location.query.redirect);
  };

  onSignUpSubmit = async credentials => {
    const { regist, getRegistEmail, location } = this.props;
    if (this.state.verification) {
      const credentialsConfirm = {
        ...(this.state.channel.length > 0
          ? { channel: this.state.channel }
          : {}),
        ...credentials,
        ...this.state.signUpCredentials,
      };
      await regist(credentialsConfirm, location.query.redirect);
      this.setState({
        signTabState: "signIn",
        verification: false,
        signUpCredentials: {},
      });
      return;
    }
    await getRegistEmail(credentials);
    this.setState({
      verification: true,
      signUpCredentials: credentials,
      email: credentials.email,
      initEmail: "",
    });
  };

  onSignUpEmailReplace = () => {
    this.setState({
      verification: false,
    });
  };

  changeToSignUp = () => {
    this.setState({
      signTabState: "signUp",
    });
  };

  changeToSignIn = () => {
    this.setState({
      signTabState: "signIn",
      verification: false,
    });
  };

  render() {
    const ldapEnabled = Settings.ldapEnabled();
    const rememberMeDisabled = Settings.get("session-cookies");
    return (
      <Flex flexDirection="column" style={{ width: 440 }}>
        <LogoIcon height={48} width={200} />
        <div style={{ fontWeight: "bold", color: color("text-dark") }}>
          One Step Closer to Blockchain Insights
        </div>
        <Box mt={20} />
        <div className="NavTitleActive">
          {this.isSignIn() ? "Sign in" : "Sign up"}
        </div>
        <Box mt={10} />
        <SignInPanel
          show={this.isSignIn()}
          email={this.state.email}
          ldapEnabled={ldapEnabled}
          rememberMeDisabled={rememberMeDisabled}
          onSubmit={this.onSignInSubmit}
          initEmail={this.state.initEmail}
        />
        <SignUpPanel
          show={this.isSignUp() && !this.state.verification}
          credentials={this.state.signUpCredentials}
          onSubmit={this.onSignUpSubmit}
          initEmail={this.state.initEmail}
        />
        <VerifyEmailPanel
          show={this.isSignUp() && this.state.verification}
          onSubmit={this.onSignUpSubmit}
          emailReplace={this.onSignUpEmailReplace}
          email={this.state.email}
        />
        <Link
          className="loginBottomSignButton"
          style={{ display: this.isSignUpConfirm() ? "none" : "auto" }}
          onClick={() => {
            this.isSignIn() ? this.changeToSignUp() : this.changeToSignIn();
          }}
        >
          {this.isSignIn() ? "Sign up" : "Sign in"}
        </Link>
      </Flex>
    );
  }
}

// const ForgotPasswordLink = ({ credentials = {} }) => (
//   <Link
//     to={
//       "/auth/forgot_password" +
//       (Utils.isEmail(credentials.username)
//         ? "?email=" + encodeURIComponent(credentials.username)
//         : "")
//     }
//     className="text-light text-brand-hover"
//     onClick={e => {
//       window.OSX ? window.OSX.resetPassword() : null;
//     }}
//   >
//     {t`I seem to have forgotten my password`}
//   </Link>
// );
