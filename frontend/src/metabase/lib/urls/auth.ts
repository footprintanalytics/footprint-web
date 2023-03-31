export const login = (redirectUrl?: string) => {
  if (redirectUrl?.startsWith("/growth")) {
    return "/growth";
  }
  return redirectUrl
    ? `/loginModal?redirect=${encodeURIComponent(redirectUrl)}`
    : "/loginModal";
};
