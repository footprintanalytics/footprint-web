/* eslint-disable react/prop-types */
import { useGetProductInfo } from "metabase/pricing_v2/use";
import PricingModal from "metabase/pricing_v2/components/PricingModal";
import React from "react";

const DashCardPricingModal = ({ user, onClose, setCallback, open, type }) => {
  const { isLoading, data } = useGetProductInfo("fga");
  const fgaPaymentProducts = data?.filter((item) => item.productType === type) || []
  return (
    <PricingModal
      isModal={true}
      visible={open}
      showTitle={true}
      user={user}
      subscribeOptions={fgaPaymentProducts}
      onClose={onClose}
      setCallback={setCallback}
    />
  )
}

export default DashCardPricingModal
