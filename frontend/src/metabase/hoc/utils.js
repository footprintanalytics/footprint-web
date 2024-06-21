export function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export function isScrollWhiteList(path) {
  return path?.startsWith("/solution")
}
