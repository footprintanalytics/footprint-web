/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import { set } from "lodash";
import { notification, Button, Modal } from "antd";
import Link from "antd/lib/typography/Link";
import { PublicApi, maybeUsePivotEndpoint } from "metabase/services";
import { dashboardIdInfo } from "metabase/new-service";

export function getFirstAddressByPriory(datas:{address: string, chain: string}[]) {
  if (datas.length === 0) return null;
  // if sandbox, return sandbox top 1 address
  const sandbox = datas.find((data) => data.address === "0xa342f5d851e866e18ff98f351f2c6637f4478db5");
  if (sandbox) {return sandbox;}
  const chainPriory = ["Ethereum", "Polygon", "BNB Chain", "Harmony"];
  //sort datas by chainPriory
  datas = datas.sort((a, b) => {
    return chainPriory.indexOf(a.chain) - chainPriory.indexOf(b.chain);
  });
  // find first address by chainPriory
  let first = datas.find((data) => chainPriory.includes(data.chain));
  // if not found, return first address
  if (!first){
    first = datas[0]
  }
  return first;
}

/**
 *
 * @param vipGrade : Enterprise, Scale, Growth, Free
 * @param menu
 * @returns
 */
export function checkVipMenuPermisson(vipGrade:string,menu:string){
  console.log("checkVipMenuPermisson",vipGrade,menu);
  // all access for Enterprise
  if(vipGrade === "Enterprise"){
    return true;
  }
  const menuPermission = new Map([
    // ["game_tokenomics", ["Enterprise", "Scale","Growth"]],
    ["game_revenue", ["Enterprise", "Scale","Growth"]],
    ["nft_revenue", ["Enterprise", "Scale","Growth"]],
    // ["twitter", ["Enterprise", "Scale","Growth"]],
    // ["discord", ["Enterprise", "Scale","Growth"]],
  ]);
  if(!menuPermission.has(menu)){
    // menu not need any permission, return true
    return true;
  }
  if(menuPermission.get(menu)?.includes(vipGrade)){
    // menu need permission, and vipGrade has permission, return true
    return true;
  }
  return false;
}

export async function getDashboardInfo(
  urlDashboardName: string,
  urlUserName: string,
) {
  try {
    const result = await dashboardIdInfo({
      dashboardName: encodeURIComponent(urlDashboardName),
      userName: urlUserName,
    });
    // /getDashboardInfo
    // console.log("getDashboardInfo", result);
    return { id: result?.id, uuid: result?.uuid };
  } catch (error) {
    console.log("getDashboardInfo", error);
    return { id: null, uuid: null };
  }
}

/**
 * parse data from dashboard link
 * @param url
 * @returns { username, dashboardName }
 */
export function parseDashboardLink(url: string) {
  if (!url.includes("/@") || !url.includes("footprint.network/")) {
    return null;
  }
  if (url.includes("?")) {
    url = url.split("?")[0];
  }
  const regex = /https?:\/\/[^\s]+\/@([^\/]+)\/([^\/\s]+)/;
  const match = url.match(regex);
  const username = match ? match[1] : null;
  const dashboardName = match ? match[2] : null;
  if (!username || !dashboardName) return null;
  return { username, dashboardName };
}

//  quickFilter --> Quick Filter
export function formatKeyLabel(label: string) {
  return label
    .replace(/(?:^|\s)\S/g, (char: string) => char.toUpperCase())
    .replace(/([a-z])([A-Z])/g, "$1 $2");
}

//  quick-filter --> Quick Filter
export function formatTag(tag: string) {
  const words = tag.split("-");
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }
  return words.join(" ").replaceAll("Nft", "NFT");
}

export function formatType(tag: string) {
  const words = tag.split(" ");
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }
  return words.join(" ");
}

// format number into 1,000,000.00
export function valueFormat(value: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(value);
}
export function showCohortSuccessModal(
  modalApi = Modal,
  cohort: any,
  router: any,
  from = "segment",
  onCancel = () => {},
) {
  return modalApi.success({
    title: "Segment created successfully",
    content: "You can view the User Profile of this segment after few mins.",
    onOk() {
      router?.push({
        pathname: getGrowthProjectPath(router?.params?.project, from),
      });
      // router?.push({
      //   pathname: `/growth/public/dashboard/55b1eb29-b15e-458f-9241-1862a0d19d3b`,
      //   query: { tag: cohort?.title, cohort_title: cohort?.title ,cohortId: cohort?.id},
      //   hash: `#from=${from}`,
      // });
    },
    onCancel() {
      onCancel?.();
    },
    closable: true,
    okText: "View Segment",
    cancelText: "Close",
  });
}

export function updateHashValue(
  hash: string,
  key: string,
  value: string,
): string {
  // update hash value
  return (
    "#" +
    hash
      .substr(1)
      .split("&")
      .filter(entry => entry !== "" && entry.split("=")[0] !== key)
      .concat(`${key}=${value}`)
      .join("&")
  );
}

export function checkIsNeedContactUs(
  modal = Modal,
  project: any = null,
  action: () => any,
  onBlockAction: () => any,
  closable = true,
) {
  // if (user && user.email === "fga@footprint.network") {
  if (project?.isDemo || !project) {
    modal.info({
      title: "Contact Us",
      closable: closable,
      content: (
        <>
          <div className=" mt1 text-light">
            If you wish to view data dashboards related to your own project,
            please feel free to contact our BD team. Thank you.
          </div>
          <div className="mt2">
            <Link target="_blank" href="mailto:sales@footprint.network">
              Email: sales@footprint.network
            </Link>
          </div>
          <div>
            <Link
              target="_blank"
              className="mt2"
              href="https://t.me/joinchat/4-ocuURAr2thODFh"
            >
              Telegram: @dplinnn
            </Link>
          </div>
        </>
      ),
      okText: "Book a meeting",
      onOk() {
        window.open("https://forms.gle/Xs8WahhYh26xKoDj7", "_blank");
      },
    });
    onBlockAction?.();
    return true;
  } else {
    action?.();
    return false;
  }

  // } else {
  //   action();
  // }
}

export function updateDashboardPara(
  parameters: any[],
  parameterValues: any,
  newValueKey: string,
  newValue: [],
) {
  const name_index = parameters.findIndex(i => i.slug === newValueKey);
  if (name_index !== -1) {
    set(parameterValues, parameters[name_index].id, newValue);
    return true
  }else{
    return false
  }
}

export function getDefaultDashboardPara(
  parameters: any[],
  parameterValues: any,
  newValueKey: string,
) {
  const id = parameters.find(i => i.slug === newValueKey)?.id;
  return id ? parameterValues[id] : null;
}

export async function getDashboardDatas(uuid: string) {
  const datas: any[] = [];
  try {
    const { data } = await PublicApi.card({ uuid });
    const card = data;
    const newResult = await maybeUsePivotEndpoint(
      PublicApi.cardQuery,
      card,
    )({
      uuid,
      parameters: JSON.stringify([]),
    });
    newResult?.data?.rows?.map((i: any, index: number) => {
      const p = {};
      newResult?.data?.cols?.map((j: any, index: number) => {
        // if (j.name === "collections_list") {
        if (
          j.base_type === "type/Text" &&
          i[index].startsWith("[") &&
          i[index].endsWith("]")
        ) {
          const l = i[index]
            .replace("[", "")
            .replace("]", "")
            .replaceAll(" ", "")
            .split(",");
          set(p, j.name, l);
        } else {
          set(p, j.name, i[index]);
        }
      });
      datas.push(p);
    });
  } catch (error) {
    console.log("error", error);
  }
  return datas;
}

export function isFgaPath(){
  return location.pathname.includes("/growth") || location.pathname.includes("/ab");
}

export function getGrowthProjectPath(project: string, menu?: string) {
  return `/growth/project/${project}/${menu ?? ""}`;
}
export function getGaMenuTabs(
  tabs_data: any[],
  protocol_type?: string,
  hasNftContract?: boolean,
  user?: any,
) {
  const dashboardMap = new Map();
  const menuTabs: any[] = [];
  tabs_data?.map(item => {
    const temp = getGaMenuTabs(
      item.children,
      protocol_type,
      hasNftContract,
      user,
    );
    const children: any[] = temp.menuTabs;
    temp.dashboardMap.forEach((value, key, map) => {
      dashboardMap.set(key, value);
    });
    // those menu items are turn into native pages,so that they are not in the dashboard
    let disabled =
      children.length <= 0 &&
      !item.uuid &&
      [
        "Connector",
        "Campaign",
        "Activation",
        "Community",
        "Members",
        "Wallet Profile",
        "Project Info",
        "Template Gallery",
        "Opt-In Tool",
        "Social Connect",
        "Custom Analysis",
        "Activator",
        "Channel",
        "General",
        "My Analysis",
        "Cohort",
      ].findIndex(i => i === item.name) === -1
        ? true
        : false;
    if (!hasNftContract && ["NFT", "NFT Minting"].includes(item.name)) {
      disabled = true;
    }
    if (protocol_type !== "GameFi" && item.name === "GameFi") {
      disabled = true;
    }
    if (["Token Airdrop"].includes(item.name)) {
      //token airdrop is only for demo account
      disabled = user?.email === "fga@footprint.network" ? false : true;
    }
    if (!disabled) {
      menuTabs.push({
        key: `${item.name}${children.length > 0 ? "-sub" : ""}`,
        icon: item.icon,
        children: children.length > 0 ? children : null,
        disabled: disabled,
        label: item.name,
        dashboard_uuid: item.uuid ?? null,
        // type: children.length > 0 ? "group" : null,
      });
    }
    if (item.uuid) {
      dashboardMap.set(item.name, item.uuid);
    }
  });
  return { menuTabs, dashboardMap };
}

export function clearGACache() {
  localStorage.removeItem("LatestGACampaigns");
  localStorage.removeItem("LatestGAMenuTag");
  localStorage.removeItem("GASearchHistory");
  localStorage.removeItem("GAFavoritedTemplate");
  localStorage.removeItem("LatestGAProjectId");
  localStorage.removeItem("LatestGAProject");
  localStorage.removeItem("GAUserId");
  localStorage.removeItem("IsFgaDemoProject");
}

export function saveLatestGAProject(LatestGAProject: string) {
  localStorage.setItem("LatestGAProject", LatestGAProject);
}
export function getLatestGAProject() {
  return localStorage.getItem("LatestGAProject");
}

export function saveLatestGAProjectId(LatestGAProjectId: string) {
  localStorage.setItem("LatestGAProjectId", LatestGAProjectId);
}
export function getLatestGAProjectId() {
  const id = localStorage.getItem("LatestGAProjectId");
  return id === "undefined" || !id ? null : id;
}

export function saveLatestGAMenuTag(LatestGAMenuTag: string) {
  localStorage.setItem("LatestGAMenuTag", LatestGAMenuTag);
}
export function getLatestGAMenuTag() {
  return localStorage.getItem("LatestGAMenuTag");
}

export function saveLatestGACampaigns(LatestGACampaigns: any) {
  saveGAObject("LatestGACampaigns", LatestGACampaigns);
}
export function getLatestGACampaigns() {
  return getGAObject("LatestGACampaigns")
    ? getGAObject("LatestGACampaigns")
    : [];
}

export function saveGASearchHistory(item: any) {
  if (item) {
    const temp: any[] = getGASearchHistory();
    if (temp.findIndex(i => i.value === item.value) === -1) {
      temp.push(item);
    }
    if (temp.length > 3) {
      temp.splice(0, 1);
    }
    localStorage.setItem("GASearchHistory", JSON.stringify(temp));
  } else {
    localStorage.setItem("GASearchHistory", JSON.stringify([]));
  }
}
export function getGASearchHistory() {
  return localStorage.getItem("GASearchHistory")
    ? JSON.parse(localStorage.getItem("GASearchHistory")!)
    : [];
}

export function saveGAObject(key: string, item: any) {
  localStorage.setItem(key, JSON.stringify(item));
}

export function getGAObject(key: string) {
  return JSON.parse(localStorage.getItem("key")!);
}

export function saveGAFavoritedTemplate(item: any, like: boolean) {
  const temp: any[] = getGAFavoritedTemplate();
  const index = temp.findIndex(i => i.No === item.No);
  if (like && index === -1) {
    temp.push(item);
  }
  if (!like && index !== -1) {
    temp.splice(index, 1);
  }
  localStorage.setItem("GAFavoritedTemplate", JSON.stringify(temp));
}
export function getGAFavoritedTemplate() {
  return localStorage.getItem("GAFavoritedTemplate")
    ? JSON.parse(localStorage.getItem("GAFavoritedTemplate")!)
    : [];
}
