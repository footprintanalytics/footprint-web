import { take } from "lodash";

export const login = (redirectUrl?: string) => {
  if (redirectUrl?.startsWith("/growth/")) {
    return "/growth";
  }
  if (redirectUrl?.startsWith("/growthly")) {
    return "/growthly";
  }
  if (redirectUrl?.startsWith("/fga")) {
    const array = redirectUrl.split("/")
    return take(array, 3)?.join("/") || "/fga";
  }
  return redirectUrl
    ? `/loginModal?redirect=${encodeURIComponent(redirectUrl)}`
    : "/loginModal";
};
