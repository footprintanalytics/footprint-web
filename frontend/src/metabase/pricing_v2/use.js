import { getProductInfo, paymentSubscriptionDetail } from "metabase/new-service";
import { useQuery } from "react-query";

export const useGetProductInfo = (service) => {
  const params = {
    "service": service || "footprint",
  }

  const { isLoading, data } = useQuery(
    ["getProductInfo", params],
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

export const useGetPaymentSubscriptionDetail = (user, service) => {
  const params = {
    "service": service || "footprint",
  }

  const { isLoading, data } = useQuery(
    ["paymentSubscriptionDetail", params],
    async () => {
      return paymentSubscriptionDetail(params);
    },
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!user,
    },
  );
  return {
    isSubscriptionDetailLoading: isLoading,
    subscriptionDetailData: data,
  };
};
