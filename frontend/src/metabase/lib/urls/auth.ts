export const login = (redirectUrl?: string) => {
  if (redirectUrl?.startsWith("/growth")) {
    return "/growth";
  }
  if (redirectUrl?.startsWith("/ab")) {
    return "/ab";
  }
  return redirectUrl
    ? `/loginModal?redirect=${encodeURIComponent(redirectUrl)}`
    : "/loginModal";
};
