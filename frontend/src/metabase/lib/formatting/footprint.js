/* eslint-disable react/prop-types */
import React from "react";
import upperFirst from "lodash/upperFirst";
import upperCase from "lodash/upperCase";
import lowerCase from "lodash/lowerCase";
import { DEFAULT_DATE_STYLE, DEFAULT_TIME_STYLE, getTimeFormatFromStyle, hasHour } from "metabase/lib/formatting/date";


export function formatTitle(title) {
  if (!title) {
    return title;
  }
  const lowerArray = [
    "a",
    "all",
    "the",
    "at",
    "with",
    "of",
    "for",
    "info",
    "in",
    "or",
    "and",
    "to",
    "about",
    "but",
    "by",
    "on",
    "vs",
  ];
  const upperArray = [
    "nft",
    "ens",
  ];
  const mapFunction = (item) => {
    if (lowerArray.includes(item?.toLowerCase())) {
      return lowerCase(item);
    }
    if (upperArray.includes(item?.toLowerCase())) {
      return upperCase(item);
    }
    return upperFirst(item);
  }
  const titleBlock = title.split(" ");
  if (titleBlock && titleBlock.length > 0) {
    const result = titleBlock
      .map(item => mapFunction(item))
      .join(" ")
      .trim();
    return upperFirst(result);
  }

  return title.trim();
}

export function formatTableTitle(title) {
  if (!title) {
    return title;
  }
  return formatTitle(title.replaceAll("_", " "));
}

export function formatSectionTitle(title) {
  if (!title) {
    return title;
  }
  return formatTitle(title.replaceAll("-", " "));
}

export function formatDashboardChartSaveTitle(name) {
  if (!name) {
    return name;
  }
  return name.replaceAll(/\s+/g, " ").trim();
}

export function formatArticleSaveTitle(name) {
  if (!name) {
    return name;
  }
  return name.replaceAll(/\s+/g, " ").trim();
}

export function formatArticleTitle(title) {
  return formatTitle(title);
  /*//有冒号，但不是Footprint
  if (title.includes(":") && !title.toLowerCase().includes("footprint")) {
    return formatTitle(title);
  }
  //对几个特殊的关键词，不处理，其他都加上Footprint Analytics
  const keys = [
    "Footprint Analytics",
    "Footprint Weekly Report",
    "Footprint November Monthly Report",
    "Footprint",
  ].map(item => item.toLowerCase());
  const wordArray = words(title, /[^:：]+/g);
  if (
    wordArray.length > 0 &&
    !some(
      keys.map(key => wordArray[0].toLowerCase().includes(key)),
      Boolean,
    )
  ) {
    wordArray.unshift("Footprint Analytics");
  }
  //单独处理Footprint:和Footprint X的情况
  const result = formatTitle(wordArray.map(p => p.trim()).join(": "))
    .replaceAll("Footprint:", "Footprint Analytics:")
    .replaceAll("Footprint X", "Footprint Analytics X");
  //处理没有:的情况
  if (!result.includes(":")) {
    return `Footprint Analytics: ${result}`;
  } else {
    return result;
  }*/
}

export function articleTitle(item) {
  if (!item) {
    return item;
  }
  return item.type === "article" ? formatArticleTitle(item.title) : item.title;
}

export function getDescription({ description, orderedCards }) {
  // 读取 description
  if (description) {
    return description;
  }

  if (orderedCards) {
    // 读取 text box
    const textCard = orderedCards
      ?.sort((a, b) => a.row - b.row)
      ?.find(item => item.card.display === "text");
    if (textCard) {
      return textCard.visualization_settings?.text
        ?.replace(/#/g, "") // markdown 标题处理
        ?.replace(/\s+/g, " ") // 空格处理
        ?.trim()
        ?.slice(0, 500); //限制最多 500 长度的desc
    } else {
      // 读取 chart title
      return orderedCards?.find(item => item.card.name)?.card?.name;
    }
  }

  return "";
}

export function getTableNameListFromSQL(nativeQuery) {
  return (
    nativeQuery?.match(/(?:FROM|from|join|JOIN)+(\s|`|")+(\w|`|"|\.)+/gi)?.map(item =>
      item
        .toLowerCase()
        .replace(/from|FROM/g, "")
        .replace(/join|JOIN/g, "")
        .replace(/`/g, "")
        .replace(/"/g, "")
        .trim()
        .replace(/iceberg.footprint./g, "")
        .replace(/footprint./g, ""),
    ) || []
  );
}
