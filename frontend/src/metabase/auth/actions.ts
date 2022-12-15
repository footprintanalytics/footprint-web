import { push } from "react-router-redux";
import { getIn } from "icepick";
import { SessionApi, UtilApi } from "metabase/services";
import MetabaseSettings from "metabase/lib/settings";
import { createThunkAction } from "metabase/lib/redux";
import { loadLocalization } from "metabase/lib/i18n";
import { deleteSession, clearGoogleAuthCredentials } from "metabase/lib/auth";
import * as Urls from "metabase/lib/urls";
import { clearCurrentUser, refreshCurrentUser, loadCurrentUserVip, loadCurrentUserVipDataApi } from "metabase/redux/user";
import { refreshSiteSettings } from "metabase/redux/settings";
import { getUser } from "metabase/selectors/user";
import { State } from "metabase-types/store";
import { setRegistSuccess } from "metabase/lib/register-activity";
import { message } from "antd";
import {
  WalletAddressLogin,
  UserRegister,
  SendEmailCode,
} from "metabase/new-service";
import {
  trackLogin,
  trackLoginGoogle,
  trackLogout,
  trackPasswordReset,
} from "./analytics";
import { LoginData } from "./types";
import * as MetabaseAnalytics from "metabase/lib/analytics";

export const REFRESH_LOCALE = "metabase/user/REFRESH_LOCALE";
export const refreshLocale = createThunkAction(
  REFRESH_LOCALE,
  () => async (dispatch: any, getState: () => State) => {
    const userLocale = getUser(getState())?.locale;
    const siteLocale = MetabaseSettings.get("site-locale");
    await loadLocalization(userLocale ?? siteLocale ?? "en");
  },
);

export const REFRESH_SESSION = "metabase/auth/REFRESH_SESSION";
export const refreshSession = createThunkAction(
  REFRESH_SESSION,
  () => async (dispatch: any) => {
    await Promise.all([
      dispatch(refreshCurrentUser()),
      dispatch(refreshSiteSettings()),
    ]);
    await dispatch(refreshLocale());
  },
);

const handleLogin = async (dispatch: any, redirectUrl = '/') => {
  await Promise.all([
    dispatch(refreshCurrentUser()),
    dispatch(refreshSiteSettings()),
  ]);
  dispatch(loadCurrentUserVip());
  dispatch(loadCurrentUserVipDataApi());

  if (redirectUrl) {
    setTimeout(() => {
      dispatch(push(redirectUrl));
    }, 500);
  }
};

export const LOGIN = "metabase/auth/LOGIN";
export const login = createThunkAction(
  LOGIN,
  (data: LoginData, redirectUrl = "/") =>
    async (dispatch: any) => {
      await SessionApi.create(data);
      MetabaseAnalytics.trackStructEvent("Auth", "Login");
      await handleLogin(dispatch, redirectUrl);
    },
);

// register and login
export const REGISTERANDLOGIN = "metabase/auth/REGISTERANDLOGIN";
export const registerAndLogin = createThunkAction(
  REGISTERANDLOGIN,
  ({ token, redirectUrl = "/" } : any) => async (dispatch: any, getState: any) => {
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
      await handleLogin(dispatch, redirectUrl || "/");
    } else {
      throw message;
    }
  },
);

//register
export const regist = createThunkAction(
  "metabase/auth/REGIST",
  (credentials: any, redirectUrl = '/') => async (dispatch: any, getState: any) => {
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
    const { isNew } : any = await UserRegister({
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
  (credentials: any) => async (dispatch: any, getState: any) => {
    // NOTE: this request will return a Set-Cookie header for the session
    const { email } = credentials;
    await SendEmailCode({ email });
    MetabaseAnalytics.trackStructEvent("Auth", "Register Send Code");
  },
);

export const LOGIN_GOOGLE = "metabase/auth/LOGIN_GOOGLE";
export const loginGoogle = createThunkAction(
  LOGIN_GOOGLE,
  (
    googleUser: any,
    redirectUrl = "/",
    channel: string,
    projectRole: string,
  ) =>
    async (dispatch: any) => {

      try {
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
    },
);

// login Wallet
export const LOGIN_WALLET = "metabase/auth/LOGIN_WALLET";
export const loginWallet = createThunkAction(LOGIN_WALLET, function(
  loginParam: any,
  redirectUrl = '/',
) {
  return async function(dispatch: any, getState: any) {
    try {
      const result = await WalletAddressLogin(loginParam);
      MetabaseAnalytics.trackStructEvent("Auth", "Wallet Auth Login");
      handleLogin(dispatch, redirectUrl);
      return result;
    } catch (error: any) {
      return { error: error.message ? error.message : error };
    }
  };
});

export const LOGOUT = "metabase/auth/LOGOUT";
export const logout = createThunkAction(LOGOUT, (redirectUrl: string) => {
  return async (dispatch: any) => {
    await deleteSession();
    await dispatch(clearCurrentUser());
    await dispatch(refreshLocale());
    trackLogout();

    if (redirectUrl) {
      dispatch(push(Urls.login(redirectUrl)));
    }
    // window.location.reload(); // clears redux state and browser caches
  };
});

export const FORGOT_PASSWORD = "metabase/auth/FORGOT_PASSWORD";
export const forgotPassword = createThunkAction(
  FORGOT_PASSWORD,
  (email: string) => async () => {
    await SessionApi.forgot_password({ email });
  },
);

export const RESET_PASSWORD = "metabase/auth/RESET_PASSWORD";
export const resetPassword = createThunkAction(
  RESET_PASSWORD,
  (token: string, password: string) => async (dispatch: any) => {
    await SessionApi.reset_password({ token, password });
    await dispatch(refreshSession());
    trackPasswordReset();
  },
);

export const validatePassword = async (password: string) => {
  const error = MetabaseSettings.passwordComplexityDescription(password);
  if (error) {
    return error;
  }

  try {
    await UtilApi.password_check({ password });
  } catch (error) {
    return getIn(error, ["data", "errors", "password"]);
  }
};

export const VALIDATE_PASSWORD_TOKEN = "metabase/auth/VALIDATE_TOKEN";
export const validatePasswordToken = createThunkAction(
  VALIDATE_PASSWORD_TOKEN,
  (token: string) => async () => {
    const result = await SessionApi.password_reset_token_valid({ token });
    const valid = getIn(result, ["valid"]);

    if (!valid) {
      throw result;
    }
  },
);
