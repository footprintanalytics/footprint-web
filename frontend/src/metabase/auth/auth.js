import {
  handleActions,
  combineReducers,
  createThunkAction,
} from "metabase/lib/redux";

import { push, replace } from "react-router-redux";

import * as MetabaseAnalytics from "metabase/lib/analytics";
import { clearGoogleAuthCredentials, deleteSession } from "metabase/lib/auth";
import { setRegistSuccess } from "metabase/lib/register-activity";

import { refreshSiteSettings } from "metabase/redux/settings";
import {
  loadCurrentUserVip,
  refreshCurrentUser,
  clearCurrentUser,
} from "metabase/redux/user";

import { SessionApi } from "metabase/services";
import {
  WalletAddressLogin,
  UserRegister,
  SendEmailCode,
} from "metabase/new-service";
import { message } from "antd";
import { setRequestUnloaded } from "metabase/redux/requests";

const handleLogin = async (dispatch, redirectUrl) => {
  await Promise.all([
    dispatch(refreshCurrentUser()),
    dispatch(refreshSiteSettings()),
  ]);
  dispatch(loadCurrentUserVip());

  if (redirectUrl) {
    setTimeout(() => {
      dispatch(push(redirectUrl));
    }, 500);
  }
};

// login
export const LOGIN = "metabase/auth/LOGIN";
export const login = createThunkAction(
  LOGIN,
  (credentials, redirectUrl) => async (dispatch, getState) => {
    // NOTE: this request will return a Set-Cookie header for the session
    await SessionApi.create(credentials);

    MetabaseAnalytics.trackStructEvent("Auth", "Login");
    await handleLogin(dispatch, redirectUrl);
  },
);

// login
export const REGISTERANDLOGIN = "metabase/auth/REGISTERANDLOGIN";
export const registerAndLogin = createThunkAction(
  REGISTERANDLOGIN,
  ({ token, redirectUrl }) => async (dispatch, getState) => {
    // NOTE: this request will return a Set-Cookie header for the session
    const { code, message, data } = await SessionApi.registerAndLogin({
      token,
    });
    if (code === 0) {
      const { isNew, email } = data;
      if (isNew) {
        setRegistSuccess(email);
      }
      MetabaseAnalytics.trackStructEvent("Auth", "registerAndLogin");
      await handleLogin(dispatch, redirectUrl);
    } else {
      throw message;
    }
  },
);

//register
export const regist = createThunkAction(
  "metabase/auth/REGIST",
  (credentials, redirectUrl) => async (dispatch, getState) => {
    // NOTE: this request will return a Set-Cookie header for the session
    const {
      firstName,
      lastName,
      purpose,
      email,
      password,
      emailCode,
      channel,
    } = credentials;
    const { isNew } = await UserRegister({
      firstName,
      lastName,
      purpose,
      email,
      password,
      emailCode,
      channel,
    });
    if (isNew) {
      setRegistSuccess(email);
    }

    // await SessionApi.create({ username: email, password });
    message.success("Register Success!");
    MetabaseAnalytics.trackStructEvent("Auth", "Register");
    // await Promise.all([
    //   dispatch(refreshCurrentUser()),
    //   dispatch(refreshSiteSettings()),
    // ]);
    if (redirectUrl) {
      setTimeout(() => {
        dispatch(push("/loginModal"));
      }, 500);
    }
  },
);

export const getRegistEmail = createThunkAction(
  "metabase/auth/REGISTEMAILCODE",
  credentials => async (dispatch, getState) => {
    // NOTE: this request will return a Set-Cookie header for the session
    const { email } = credentials;
    await SendEmailCode({ email });
    MetabaseAnalytics.trackStructEvent("Auth", "Register Send Code");
  },
);

// login Google
export const LOGIN_GOOGLE = "metabase/auth/LOGIN_GOOGLE";
export const loginGoogle = createThunkAction(LOGIN_GOOGLE, function(
  googleUser,
  redirectUrl,
  channel,
  projectRole,
) {
  return async function(dispatch, getState) {
    try {
      // NOTE: this request will return a Set-Cookie header for the session
      if (projectRole && projectRole === "defi360") {
        projectRole = "Defi360";
      }
      const { data } = await SessionApi.createWithGoogleAuth({
        idToken: googleUser.getAuthResponse().id_token,
        channel,
        ...(projectRole ? { projectRole } : {}),
      });
      const { isNew, email } = data;
      if (isNew) {
        setRegistSuccess(email);
      }
      MetabaseAnalytics.trackStructEvent("Auth", "Google Auth Login");

      handleLogin(dispatch, redirectUrl);
    } catch (error) {
      await clearGoogleAuthCredentials();
      return error;
    }
  };
});

// login Wallet
export const LOGIN_WALLET = "metabase/auth/LOGIN_WALLET";
export const loginWallet = createThunkAction(LOGIN_WALLET, function(
  loginParam,
  redirectUrl,
) {
  return async function(dispatch, getState) {
    try {
      const result = await WalletAddressLogin(loginParam);
      MetabaseAnalytics.trackStructEvent("Auth", "Wallet Auth Login");
      handleLogin(dispatch, redirectUrl);
      return result;
    } catch (error) {
      return { error: error.message ? error.message : error };
    }
  };
});

// logout
export const LOGOUT = "metabase/auth/LOGOUT";
export const logout = createThunkAction(LOGOUT, function() {
  return async function(dispatch, getState) {
    // actively delete the session and remove the cookie
    await deleteSession();

    // clear Google auth credentials if any are present
    await clearGoogleAuthCredentials();

    MetabaseAnalytics.trackStructEvent("Auth", "Logout");

    // dispatch(push("/auth/login"))

    dispatch(setRequestUnloaded(["entities"]));

    dispatch(clearCurrentUser());

    dispatch(replace("/"));

    // refresh to ensure all application state is cleared
    // window.location.reload();
  };
});

// reducers

const loginError = handleActions(
  {
    [LOGIN_GOOGLE]: {
      next: (state, { payload }) => (payload ? payload : null),
    },
  },
  null,
);

export default combineReducers({
  loginError,
});
