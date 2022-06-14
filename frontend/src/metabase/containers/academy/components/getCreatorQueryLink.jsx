export const getCreatorQueryLink = ({
  location = window.location,
  category = "",
  subMenu = "",
  current,
}) => {
  return (
    location.pathname +
    "?category=" +
    category +
    "&subMenu=" +
    subMenu +
    "&current=" +
    (current > 0 ? current : 1)
  );
};
