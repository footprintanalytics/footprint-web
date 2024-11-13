/* eslint-disable react/prop-types */
/* eslint-disable react/react-in-jsx-scope */
// import Link from "antd/lib/typography/Link";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getFgaProject, getUser } from "metabase/selectors/user";
import "../css/index.css";
import { Button, message } from "antd";
import { useGetPaymentSubscriptionDetail } from "metabase/pricing_v2/use";
import { showCancelAutoRenewal } from "metabase/utils/Utils";

const FgaVipInfoLayout = props => {
  const { user, upgradeOnclick } = props;

  const hasStandardPay = user?.vipInfoFga?.find(vipInfo => vipInfo.type === "fga_standard");
  const hasAdvancedPay = user?.vipInfoFga?.find(vipInfo => vipInfo.type === "fga_advanced");
  const showUpgrade = hasStandardPay && !hasAdvancedPay
  const { subscriptionDetailData, refetch } = useGetPaymentSubscriptionDetail(user, "fga");

  useEffect(() => {
    if (user.vipInfoFga) {
      refetch()
    }
  }, [user.vipInfoFga]);

  const data = user?.vipInfoFga?.map(vipInfo => {
    return {
      showCancelAutoRenewal: !!subscriptionDetailData?.list?.find(s => s.groupType === vipInfo.type),
      productId: subscriptionDetailData?.list?.find(s => s.groupType === vipInfo.type)?.productId,
      type: vipInfo.type,
      validEndDate: vipInfo.validEndDate,
      isExpire: vipInfo.isExpire,
    }
  })

  const textMapping = {
    fga_standard: "Standard Plan",
    fga_advanced: "Advanced Plan",
  }

  return (
    <div className="flex flex-column" style={{gap: 10}}>
      Vip Info Level:
      {data?.map((vipInfo, index) => (
        <div key={index}>
          {vipInfo?.type}, valid until {vipInfo?.validEndDate}, isExpire: {vipInfo?.isExpire ? "Yes" : "No"}
          {vipInfo?.showCancelAutoRenewal && (
            <Button
              onClick={() => {
                showCancelAutoRenewal({
                  productId: vipInfo?.productId,
                  title: `Do you want to cancel ${textMapping[vipInfo?.type]} automatic renewal?`,
                  onSuccess: () => {
                    message.success("Cancel success");
                    refetch()
                  }
                });
              }
            }>
              Cancel Subscribe
            </Button>
          )}
          {vipInfo?.isExpire && (
            <Button
              onClick={() => {
                upgradeOnclick(vipInfo?.type)
              }
            }>
              Renewal Plan
            </Button>
          )}
        </div>
      ))}

      <div className="flex items-center" style={{gap: 10}}>
        {showUpgrade && <Button onClick={() => upgradeOnclick("fga_advanced")}>Upgrade Advanced Plan</Button>}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: getUser(state),
    project: getFgaProject(state),
  };
};

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(FgaVipInfoLayout);
