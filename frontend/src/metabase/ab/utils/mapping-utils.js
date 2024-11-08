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
  return !!chartTypeStatus.find((project) => project.chartType === web2TypeText);
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
