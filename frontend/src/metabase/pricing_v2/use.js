import { getProductInfo, paymentSubscriptionDetail } from "metabase/new-service";
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

export const useGetPaymentSubscriptionDetail = (user, service) => {
  const params = {
    "service": service || "footprint",
  }

  const { isLoading, data } = useQuery(
    ["paymentSubscriptionDetail"],
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
