import { getProductInfo } from "metabase/new-service";
import { useQuery } from "react-query";

export const useGetProductInfo = (service) => {
  const params = {
    "service": service || "footprint",
  }

  const { isLoading, data } = useQuery(
    ["getProductInfo"],
    async () => {
      return getProductInfo(params);
    },
    {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  );

  return {
    isLoading,
    data,
  };
};
