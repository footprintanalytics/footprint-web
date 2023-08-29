export const login = (redirectUrl?: string) => {
  if (redirectUrl?.startsWith("/growth")) {
    return "/growth";
  }
  if (redirectUrl?.startsWith("/fga")) {
    return "/fga";
  }
  return redirectUrl
    ? `/loginModal?redirect=${encodeURIComponent(redirectUrl)}`
    : "/loginModal";
};
