export const isStripeSubscribe = ({ subscriptionDetailList, service, groupType }) => {
  return !!subscriptionDetailList?.find(detail => detail.service === service && detail.groupType === groupType);
};

export const getCurrentSubscriptionProductId = ({ subscriptionDetailList, service, groupType }) => {
  return subscriptionDetailList?.find(detail => detail.service === service && detail.groupType === groupType)?.productId;
};
