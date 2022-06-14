export const getDashboardQueryLink = ({
  category = "",
  chain = "",
  genre = "",
  current = 1,
}) => {
  return (
    "/protocols" +
    "?category=" +
    category +
    "&chain=" +
    chain +
    "&genre=" +
    genre +
    "&current=" +
    current
  );
};
