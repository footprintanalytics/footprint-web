import { getProductInfo, getProductInfoV2, paymentSubscriptionDetail } from "metabase/new-service";
import { useQuery } from "react-query";

export const useGetProductInfo = (service) => {
  const params = service === "fga" ? {
    "project": service,
  } : {
    "service": service || "footprint",
  }

  const { isLoading, data } = useQuery(
    ["getProductInfo", params],
    async () => {
      return service === "fga" ? getProductInfoV2(params) : getProductInfo(params);
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

export const useGetPaymentSubscriptionDetail = (user, service, enabledFunction) => {
  const params = {
    "service": service || "footprint",
  }

  const { isLoading, data, refetch } = useQuery(
    ["paymentSubscriptionDetail", params],
    async () => {
      return paymentSubscriptionDetail(params);
    },
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: enabledFunction ? enabledFunction() : !!user,
    },
  );
  return {
    isSubscriptionDetailLoading: isLoading,
    subscriptionDetailData: data,
    refetch,
  };
};
