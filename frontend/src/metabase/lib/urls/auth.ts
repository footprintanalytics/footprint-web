export const login = (redirectUrl?: string) => {
  return redirectUrl
    ? `/loginModal?redirect=${encodeURIComponent(redirectUrl)}`
    : "/loginModal";
};
