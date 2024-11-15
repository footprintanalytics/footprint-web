import _ from "lodash";
import { fgaChartTypeMapping } from "metabase/ab/utils/mapping-data";

export function isStandardCard(cardId) {
  const fgaChartObject = getFgaChartTypeMappingById(cardId);
  return fgaChartObject?.plan === "standard";
}

export function isAdvancedCard(cardId) {
  const fgaChartObject = getFgaChartTypeMappingById(cardId);
  return fgaChartObject?.plan === "advanced";
}

export function isWeb2Card(cardId) {
  const fgaChartObject = getFgaChartTypeMappingById(cardId);
  return fgaChartObject?.category === "web2";
}

export function isWeb3Card(cardId) {
  const fgaChartObject = getFgaChartTypeMappingById(cardId);
  return fgaChartObject?.category === "web3";
}

export function isWeb2DataCreated(cardId, chartTypeStatus) {
  const web2TypeText = getWeb2TypeText(cardId);
  return !!chartTypeStatus?.find((project) => project.chartType === web2TypeText);
}

export function isWeb3DataCreated(cardId, projectObject) {
  const web3TypeText = getWeb3TypeText(cardId);
  if (!_.isEmpty(projectObject?.tokenAddress) && web3TypeText === "Token") {
    return true;
  } else if (projectObject?.protocolSlug && web3TypeText === "Slug") {
    return true;
  } else if (!_.isEmpty(projectObject?.nftCollectionAddress) && web3TypeText === "NFT") {
    return true;
  }

  return false;
}

export function getFgaChartTypeMappingById(cardId) {
  return fgaChartTypeMapping.find((mapping) => mapping.cardId === cardId);
}

export function getWeb3TypeText(cardId) {
  const fgaChartObject = getFgaChartTypeMappingById(cardId);
  const type = fgaChartObject?.type;
  switch (type) {
    case "protocol_slug":
      return "Slug";
    case "token_address":
      return "Token";
    case "nft_address":
      return "NFT";
  }
}

export function getWeb2TypeText(cardId) {
  const fgaChartObject = getFgaChartTypeMappingById(cardId);
  if (fgaChartObject?.category === "web2") {
    // return fgaChartObject?.type;
    return "";
  }
  return null;
}

export const getFgaFlowType = (user, projectObject, cardId, chartTypeStatus) => {
  if (!cardId) {
    return null
  }
  const userId = user?.id
  if (!userId) {
    return "login"
  }
  // 如果 projectid 为空 创建一个 project 
  if (!projectObject?.id) {
    return "createProject"
  }

  const payStandardPlan = user?.vipInfoFga?.find(vipInfo => vipInfo.type === "fga_standard")
  // 判断 standard 是否过期
  if (payStandardPlan?.isExpire) {
    return 'expiredPay'
  }

  const payAdvancedPlan = user?.vipInfoFga?.find(vipInfo => vipInfo.type === "fga_advanced")
  const advancedCard = isAdvancedCard(cardId)
  // 判断 advanced 是否过期
  if (payAdvancedPlan?.isExpire && advancedCard) {
    return 'expiredAdvancedPay'
  }
  // 如果当前用户不是standard付费用户 并且当前卡片是advanced卡片
  if (!payAdvancedPlan && advancedCard) {
    return 'advancedPay'
  }

  const web2Card = isWeb2Card(cardId)
  const web2DataCreated = isWeb2DataCreated(cardId, chartTypeStatus)
  // 如果当前card是web2，web2 数据没有创建
  if (web2Card && !web2DataCreated) {
    return 'integration'
  }

  const web3Card = isWeb3Card(cardId)
  const web3DataCreated = isWeb3DataCreated(cardId, projectObject)
  // 如果当前card是web3，web3 数据没有创建
  if (web3Card && !web3DataCreated) {
    return 'submitProjectInfo'
  }

  return 'normal'
}
