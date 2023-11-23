import axios from "axios";
import { GET, POST, PUT, DELETE } from "metabase/lib/new-api";
import { getProject, isDefi360 } from "./lib/project_info";

export const apiGet = async api => {
  return await axios.get(api);
};

export const getRefBaseApi = () => {
  const domain = window.location.hostname;
  return domain === "localhost" || domain === "preview.footprint.network"
    ? "https://beta-footprint-ref-data.footprint.network" // local test
    : "https://ref-api-adapter.footprint.network"; // production
};

// FGA Api

/**
 *
 * @param {*} params {projectId:1}
 * @returns
 */
export const loginQuestflow = async params => {
  return POST("/api/v1/fga/quest-flow/login", params);
};

/**
 *
 * @param {*} params {
  "projectId": 0,
  "campaignType": "Quest",
  "workflowId": "string",
  "webhook": "string"
}
 * @returns
 */
export const createQuestflowCampaign = async params => {
  return POST("/api/v1/fga/quest-flow/campaign", params);
};

/**
 *
 * @param {*} params {projectId,url}
 * @returns
 */
export const uploadMapping = async params => {
  return POST("/api/v1/fga/campaign/mapping/customize-upload", params);
};

/**
 *
 * @param {*} params  {
     "url": "string",
   }
 * @returns
 */
export const GetThirdpartWebsiteInfo = async params => {
  return POST("/api/v1/fga/website-nesting/preview-graph", params);
};

/**
 *
 * @param {*} params : {
    "projectId": 0,
    "url": "string",
    "imageUrl": "string",
    "title": "string"
  }
 * @returns
 */
export const AddWebsiteNesting = async params => {
  return POST("/api/v1/fga/website-nesting", params);
};

export const UpdateWebsiteNesting = async (id, params) => {
  // params: {
  //   "projectId": 0,
  //   "url": "string",
  //   "imageUrl": "string",
  //   "title": "string"
  // }
  return PUT(`/api/v1/fga/website-nesting/${id}`, params);
};

export const GetWebsiteNesting = async params => {
  // {projectId}
  return GET("/api/v1/fga/website-nesting", params);
};
export const DelectWebsiteNesting = async params => {
  //{id}
  return DELETE(`/api/v1/fga/website-nesting`, { data: params });
};
export const GetFgaCohort = async params => {
  return GET("/api/v1/fga/cohort", params);
};
export const GetMemberInfo = async params => {
  return GET("/api/v1/fga/community/info/new", params);
};
export const CreateFgaCohort = async params => {
  return POST("/api/v1/fga/cohort", params);
};

export const CreateFgaCohortByAddress = async params => {
  return POST("/api/v1/fga/cohort/address", params);
};

export const CreateFgaPotentialCohortByAddress = async params => {
  return POST("/api/v1/fga/potential-user/list/address/cohort", params);
};

export const CreateFgaCampaign = async params => {
  return POST("/api/v1/fga/campaign", params);
};

export const CreateFgaProject = async params => {
  return POST("/api/v1/fga/project", params);
};

/**
 *
 * @param {*} params {projectId,name,creatorId,protocolSlug,protocolName}
 * @returns
 */
export const UpdateFgaProject = async params => {
  return PUT("/api/v1/fga/project", params);
};

/**
 *
 * @param {*} params {projectId:4 ,cohortId:61}
 * @returns
 */
export const downloadCohortAddress = async params => {
  return GET("/api/v1/fga/cohort/address/csv", params);
};

export const GetFgaProject = async params => {
  return GET("/api/v1/fga/project", params);
};

export const GetAllProtocol = async params => {
  return GET("/api/v1/fga/potential-user/protocolInfo", params);
};

export const GetFgaProjectDetail = async params => {
  return POST("/api/v1/fga/project/detail", params);
};

export const GetFgaConnectorJob = async params => {
  return POST("/api/v1/fga/connector-config/connection/job", params);
};

export const CreateFgaConnector = async params => {
  return POST("/api/v1/fga/connector-config", params);
};

export const GetFgaConnectors = async params => {
  return GET("/api/v1/fga/connector-config", params);
};

export const UpdateFgaConnector = async params => {
  return PUT(`/api/v1/fga/connector-config/${params.id}`, params);
};

export const getAvailableConnectors = async params => {
  return POST(`/api/v1/fga/connector-config/available`, params);
};

export const addConnectors = async params => {
  return POST(`/api/v1/fga/connector-config`, params);
};
// camppaign process: getCampaignTemplate() --> addCampaign() --> getCampaign() --> getCampaignDetail()
export const getCampaignTemplate = async params => {
  return GET(`/api/v1/fga/campaign/template`, params);
};
// create a new Campaign
export const addCampaign = async params => {
  return POST(`/api/v1/fga/campaign`, params);
};
// get Campaign list
export const getCampaign = async params => {
  return GET(`/api/v1/fga/campaign`, params);
};

export const getCampaignDetail = async params => {
  return GET(`/api/v1/fga/campaign/${params.id}`);
};
export const createCampaignCohort = async params => {
  return POST(`/api/v1/fga/campaign/mapping/cohort`, params);
};
export const getCommunityInfo = async params => {
  return GET(`/api/v1/fga/community/info`, params);
};
export const getCommunityQuickFilter = async params => {
  return GET(`/api/v1/fga/community/quick-filter`, params);
};
export const getCommunityWalletAddress = async params => {
  return POST(`/api/v1/fga/community/wallet-address`, params);
};
export const getPotentialUseFilter = async params => {
  return GET(`/api/v1/fga/potential-user/filter`, params);
};
export const getPotentialUseFilterProject = async params => {
  return GET(`/api/v1/fga/potential-user/filter/project`, params);
};
export const getPotentialUserFilterCollection = async params => {
  return GET(`/api/v1/fga/potential-user/filter/collection`, params);
};
export const getPotentialUserFilterToken = async params => {
  return GET(`/api/v1/fga/potential-user/filter/token`, params);
};
export const getPotentialUserFilterTag = async params => {
  return GET(`/api/v1/fga/potential-user/filter/tag`, params);
};
export const getPotentialUserFilterFeaturedTag = async params => {
  return GET(`/api/v1/fga/potential-user/filter/featuredTag`, params);
};
export const queryPotentialUser = async params => {
  return POST(`/api/v1/fga/potential-user`, params);
};
export const queryPotentialUserByFilter = async params => {
  return POST(`/api/v1/fga/potential-user/list/queryByFilter`, params);
};
export const createPotentialUserCohortByFilter = async params => {
  return POST(`/api/v1/fga/potential-user/list/queryByFilter/cohort`, params);
};
export const createPotentialUserTagging = async params => {
  return POST(
    `/api/v1/fga/potential-user/list/queryByFilter/addressTag`,
    params,
  );
};
export const createPotentialUserCohort = async params => {
  return POST(`/api/v1/fga/potential-user/cohort`, params);
};
export const createCommunityUserCohort = async params => {
  return POST(`/api/v1/fga/community/cohort`, params);
};
export const getPublicChainProjects = async params => {
  return GET(
    `https://www.footprint.network/api/v1/public/card/3604fc56-8d81-4ffb-a010-86671c4888d5/query?parameters=%5B%7B%22id%22%3A%229b5b908e-b060-3dfe-f9c1-6c0cad410de6%22%2C%22type%22%3A%22string%2F%3D%22%2C%22target%22%3A%5B%22dimension%22%2C%5B%22template-tag%22%2C%22chain%22%5D%5D%2C%22name%22%3A%22Chain%22%2C%22slug%22%3A%22chain%22%2C%22default%22%3A%5B%22Ethereum%22%5D%2C%22value%22%3A%5B%22Ethereum%22%5D%7D%5D`,
    params,
  );
};
export const getPublicChainProjectDetail = async params => {
  return GET(
    `https://www.footprint.network/api/v1/public/card/87dcf516-5b30-4200-97d8-42862c366bab/query?parameters=%5B%7B%22id%22%3A%229b5b908e-b060-3dfe-f9c1-6c0cad410de6%22%2C%22type%22%3A%22string%2F%3D%22%2C%22target%22%3A%5B%22dimension%22%2C%5B%22template-tag%22%2C%22chain%22%5D%5D%2C%22name%22%3A%22Chain%22%2C%22slug%22%3A%22chain%22%2C%22default%22%3A%5B%22Ethereum%22%5D%2C%22value%22%3A%5B%22Ethereum%22%5D%7D%2C%7B%22id%22%3A%2249264363-3612-16cc-ccd0-3d519aa5f917%22%2C%22type%22%3A%22category%22%2C%22target%22%3A%5B%22variable%22%2C%5B%22template-tag%22%2C%22protocol_name%22%5D%5D%2C%22name%22%3A%22Protocol%20name%22%2C%22slug%22%3A%22protocol_name%22%2C%22value%22%3A%5B%22${params.protocolSlug}%22%5D%7D%5D`,
    params,
  );
};
export const getProtocolFavorite = async params => {
  return GET(`/api/v1/project/protocol/favorite`, params);
};
export const postProtocolFavorite = async params => {
  return POST(`/api/v1/project/protocol/favorite`, params);
};
export const deleteProtocolFavorite = async params => {
  return DELETE(`/api/v1/project/protocol/favorite`, { data: params });
};
export const getProtocolList = async params => {
  return GET(`/api/v1/project/protocol/list`, params, {'Cache-Control': 'max-age=1800'});
};
export const getProjectList = async params => {
  return GET(`/api/v1/project/list`, params);
};
export const postProject = async params => {
  return POST(`/api/v1/project`, params);
};
export const deleteProject = async params => {
  return DELETE(`/api/v1/project`, { data: params });
};
export const getProtocolDetail = async params => {
  return GET(`/api/v1/project/protocol/detail`, params);
};

export const tokenGeneral = params => {
  return POST(`api/v1/project/token/general`, params);
};

// FP Api ---------------
export const UserRegister = async params => {
  return POST("/api/v1/user/signup", params);
};

export const WalletAddressNonce = async params => {
  return POST("/api/v1/user/address/nonce", params);
};

export const WalletAddressNonceCheck = async params => {
  return POST("/api/v1/user/address/sign/check", params);
};

export const WalletAddressLogin = async params => {
  return POST("/api/v1/user/address/login", params);
};

export const SendEmailCode = async params => {
  return POST("/api/v1/user/sendEmailCode", params);
};

export const getCollectionItems = async ({ params = {}, collectionId }) => {
  return GET(`/api/v1/collection/${collectionId}/items`, params);
};

export const getMyAnalytics = async ({ params = {}, valueX, valueY }) => {
  const newParams = {
    ...params,
    ...(isDefi360() ? { project: getProject() } : {}),
  };
  return GET(
    `/api/v1/collection/items?models=${valueX}&models=${valueY}`,
    newParams,
  );
};

export const getUserVipInfo = async () => {
  return GET(`/api/v1/user/vip`, { project: getProject() });
};

export const getDataApiVipInfo = async () => {
  return GET(`/api/v1/user/vip/dataApi`, { project: getProject() });
};

export const getUserInterests = async () => {
  return GET(`/api/v1/user/interests`);
};

export const postUserInterests = async params => {
  return POST(`/api/v1/user/interests`, params);
};

export const getProductInfo = async params => {
  return POST(`/api/v1/payment/product/list`, params);
};

export const payProduct = async params => {
  return POST(`/api/v1/payment/pay`, params);
};

export const payMethods = async params => {
  return POST(`/api/v1/payment/methods`, params);
};

export const getTag = async params => {
  return GET("/api/v1/tag", params);
};

export const getExplore = async params => {
  return GET("/api/v1/explore", params);
};

export const getHome = async params => {
  return GET("/api/v1/home", params);
};

export const updateTag = async params => {
  return POST(`/api/v1/tag/entityTag/update/batch`, params);
};

export const addTagging = async params => {
  return POST(`/api/v1/tag/entityTag/tagging`, params);
};

export const getEntityTag = async params => {
  return POST(`/api/v1/tag/entityTag/getEntityTags`, params);
};

export const deleteTag = async params => {
  return POST(`/api/v1/tag/entityTag/delete/batch`, params);
};

export const getDataset = async params => {
  return POST(`/api/v1/database/dataset/list`, params);
};

export const queryDataset = async params => {
  return POST(`/api/v1/database/dataset`, params);
};

export const getTable = async params => {
  return POST(`/api/v1/database/table/list`, params);
};

export const getDatabaseCategory = async params => {
  return POST(`/api/v1/database/category`, params);
};

export const getFavorite = async ({ params = {} }) => {
  return GET(`/api/v1/favorite`, params);
};

export const postDashboardFavorite = async ({ id }) => {
  return POST(`/api/v1/dashboard/${id}/favorite`);
};

export const deleteDashboardFavorite = async ({ id }) => {
  return DELETE(`/api/v1/dashboard/${id}/favorite`);
};

export const postDashboardPublicFavorite = async ({ uuid }) => {
  return POST(`/api/v1/public/dashboard/${uuid}/favorite`);
};

export const deleteDashboardPublicFavorite = async ({ uuid }) => {
  return DELETE(`/api/v1/public/dashboard/${uuid}/favorite`);
};

export const postCardFavorite = async ({ id }) => {
  return POST(`/api/v1/card/${id}/favorite`);
};

export const deleteCardFavorite = async ({ id }) => {
  return DELETE(`/api/v1/card/${id}/favorite`);
};

export const postCardPublicFavorite = async ({ uuid }) => {
  return POST(`/api/v1/public/card/${uuid}/favorite`);
};

export const deleteCardPublicFavorite = async ({ uuid }) => {
  return DELETE(`/api/v1/public/card/${uuid}/favorite`);
};

export const copyCard = async ({ params, cardId }) => {
  return POST(`/api/v1/card/${cardId}/copy`, params);
};

export const menu = async () => {
  return GET(`/api/v1/home/menu`);
};

export const menuDetailList = async params => {
  return GET(`/api/v1/home/menu/detail/list`, params);
};

export const feedback = async params => {
  return POST(`/api/v1/feedback`, params);
};

export const getLandingList = async (type, params) => {
  return GET(`/api/v1/landing/${type}/list`, params);
};

export const getLandingCategory = async type => {
  return GET(`/api/v1/landing/${type}/category`);
};

export const getLandingDetail = async (type, params) => {
  return GET(`/api/v1/landing/${type}/detail`, params);
};

export const getLandingDetailMore = async (type, params) => {
  return GET(`/api/v1/landing/${type}/detail/more`, params);
};

export const dynamicParamsApi = async (templateId, params) => {
  return POST(`/api/v1/template/${templateId}`, params, { silent: true });
};

export const searchCards = async params => {
  return POST(`/api/v1/card/search`, params);
};

export const searchTags = async params => {
  return GET(`/api/v1/search/tags`, params);
};

export const exploreByTags = async params => {
  const newParams = {
    ...params,
    ...(isDefi360() ? { project: getProject() } : {}),
  };
  return POST(`/api/v1/exploreByTags`, newParams);
};

export const mediaCreate = async params => {
  return POST(`/api/v1/media/create`, params);
};

export const mediaEdit = async params => {
  return POST(`/api/v1/media/edit`, params);
};

export const mediaDelete = async params => {
  return POST(`/api/v1/media/delete`, params);
};

export const mediaList = async params => {
  return POST(`/api/v1/media/list`, params);
};

export const mediaDetail = async params => {
  return POST(`/api/v1/media/detail`, params);
};

export const mediaRecommend = async params => {
  return POST(`/api/v1/media/recommend`, params);
};

export const subscribeEdit = async params => {
  return POST(`/api/v1/subscribe/edit`, params);
};

export const getShortLink = async params => {
  return POST(`/api/v1/shortLink/getShortLink`, params);
};

export const screenshotThumbnail = async params => {
  return POST(`/api/v1/screenshot/thumbnail`, params);
};

export const updateVipLevel = async params => {
  return POST(`/api/v1/user/updateVipLevel`, params);
};

export const userList = async params => {
  return GET(`/api/v1/user/userlist`, params);
};

export const quickRegister = async params => {
  return POST(`/api/v1/quick/register`, params);
};

export const quickRegisterDefi360 = async params => {
  return POST(`/api/v1/quick/defi360/register`, params);
};

export const quickAuth = async params => {
  return POST(`/api/v1/quick/auth`, params);
};

export const zkspaceCreateUserAddress = async params => {
  return POST(`/api/v1/zkspaceUserAddress/createUserAddress`, params);
};

export const addressActivityInfo = async params => {
  return GET(`/api/v1/zkspaceUserAddress/AddressActivityInfo`, params);
};

export const databaseTemplate = async params => {
  return POST(`/api/v1/database/recommend/template`, params);
};

export const personalSaveIndicator = async params => {
  return POST(`/api/v1/database/dataset/personalSaveIndicator`, params);
};

export const recentTableList = async params => {
  return POST(`/api/v1/database/recent/table/list`, params);
};

export const tableSearchV2 = async params => {
  return POST(`/api/v1/database/table/search`, params);
};

export const fetchTableCategory = async params => {
  return POST(`/api/v1/database/table/category`, params);
};

export const fetchHomeNewRecommend = async () => {
  return POST(`/api/v1/home/new/recommend`);
};

export const fetchHomeNewNews = async () => {
  return POST(`/api/v1/home/new/news`);
};

export const fetchHomeNewCategory = async () => {
  return POST(`/api/v1/home/new/category`);
};

export const fetchHomeNewCategoryDashboard = async params => {
  return POST(`/api/v1/home/new/category/dashboard`, params);
};

export const generateAuthKey = async () => {
  return POST(`/api/v1/user/generateAuthKey`);
};

export const uploadCSVConfirm = async params => {
  return POST(`/api/v1/custom/data/upload/csv/confirm`, params);
};

export const checkTableName = async params => {
  return POST(`/api/v1/custom/data/check/tableName`, params);
};

export const checkTableNameChart = async params => {
  return POST(`/api/v1/udTable/checkTableName`, params);
};

export const elasticSearch = async params => {
  return POST(`/api/v1/elasticsearch/search`, params);
};

export const navigationSearch = async params => {
  return POST(`/api/v1/navigation/search`, params);
};

export const navigationHotList = async params => {
  return POST(`/api/v1/navigation/hotList`, params);
};

export const navigationRecommend = async () => {
  return POST(`/api/v1/navigation/recommend`);
};

export const navigationNum = async params => {
  return POST(`/api/v1/navigation/num`, params);
};

export const helpSearch = async params => {
  return POST(`/api/v1/help/search`, params);
};

export const executeCode = async params => {
  return POST(`/api/v1/buffet/execute_code`, params, { silent: true });
};

export const getHomeNewPriority = async dashboardId => {
  return GET(`/api/v1/home/new/priority/${dashboardId}`);
};

export const postHomeNewPriority = async params => {
  return POST(`/api/v1/home/new/priority`, params);
};

export const personalInfo = async params => {
  return POST(`/api/v1/personalInfo`, params, { silent: true });
};

export const dashboardIdInfo = async params => {
  return POST(`/api/v1/dashboard/basic`, params, { silent: true });
};

export const chartIdInfo = async params => {
  return POST(`/api/v1/card/basic`, params, { silent: true });
};

export const dashboardParams = async params => {
  return GET(
    `api/v1/dashboard/${params.dashboardId}/params/${params.paramId}/values`,
    { pageSize: 100, current: 1 },
  );
};

export const publicDashboardParams = async params => {
  return GET(
    `api/v1/public/dashboard/${params.dashboardId}/params/${params.paramId}/values`,
    { pageSize: 100, current: 1 },
  );
};

export const brandPageIndicator = async () => {
  return GET(`api/v1/brandPage/indicator`);
};

export const tutorialsMenu = () => {
  return GET(`api/v1/tutorials/menu`);
};

export const tutorialsMenuDetail = params => {
  return GET(`api/v1/tutorials/menu/detail/list`, params);
};

export const relatedDashboard = params => {
  return POST(`api/v1/dashboard/relatedDashboard`, params, { silent: true });
};

export const loadAppConfig = params => {
  return GET(`api/v1/config`, params, { silent: true });
};

export const chartInfo = params => {
  return POST(`api/v1/dataDictionary/chartInfo`, params);
};

export const cardDownload = (params, config) => {
  const { cardId, parameters, type } = params;
  const formData = new FormData();
  formData.append("parameters", parameters || "");
  formData.append("type", type);
  return POST(`api/v1/card/${cardId}/download`, formData, config);
};

export const datasetDownload = (params, config) => {
  const { query, visualization_settings, type } = params;
  const formData = new FormData();
  formData.append("query", query);
  formData.append("visualization_settings", visualization_settings);
  formData.append("type", type);
  return POST(`api/v1/card/dataset/download`, formData, config);
};

export const paymentSubscriptionDetail = params => {
  return POST(`api/v1/payment/subscription/detail`, params);
};

export const cancelSubscription = params => {
  return POST(`api/v1/payment/subscription/cancel`, params);
};

export const userinfoProfile = params => {
  return PUT(`api/v1/userinfo/profile`, params);
};

export const reviewContract = params => {
  return POST(`/api/v1/contract/review`, params);
};

export const getContractSubmittedList = params => {
  return GET(`/api/v1/contract/submitted/list`, params);
};

export const getRefContractSubmittedList = params => {
  return GET(`${getRefBaseApi()}/api/v1/protocol/submit/record`, params);
};

export const submitRefProtocols = params => {
  return POST(`${getRefBaseApi()}/api/v1/protocol/submit`, params);
};

export const submitFGAProtocols = params => {
  return POST(`/api/v1/project/protocol/submit`, params);
};

// get audit list ,status = ['reviewing'] type = contract | protocol
export const getRefAuditList = params => {
  return GET(`${getRefBaseApi()}/api/v1/protocol/audit/list`, params);
};
// {record_id, status:approved/rejected,reason,operator}
export const doRefAudit = params => {
  return POST(`${getRefBaseApi()}/api/v1/protocol/audit`, params);
};
export const doRefContractAudit = params => {
  return POST(`${getRefBaseApi()}/api/v1/contract/audit`, params);
};

export const getRefProtocolList = () => {
  return GET(`${getRefBaseApi()}/api/v1/protocol/list`);
};

export const getContractSubmittedByAddress = params => {
  return GET(`/api/v1/contract/find/one`, params);
};

export const getContractProtocolByAddress = params => {
  return GET(`/api/v1/protocol/find/list`, params);
};

export const getProtocolInfoByAddress = params => {
  return GET(`/api/v1/protocol/find/info`, params);
};

export const submitContract = params => {
  return POST(`/api/v1/contract/submit`, params);
};

export const batchSubmitContract = params => {
  return POST(`/api/v1/contract/batchSubmit`, params);
};

export const publicDashboard = (uuid, params) => {
  return GET(`api/v1/public/dashboard/${uuid}`, { silentFp: true });
};

export const publicDashboardChartData = (uuid, cardId, params) => {
  return GET(`api/public/dashboard/${uuid}/card/${cardId}`, { silentFp: true });
};

export const tableColumns = params => {
  return POST(`api/v1/database/table/column`, params);
};

export const udTableDetail = params => {
  return POST(`api/v1/udTable/detail`, params);
};

export const udTableSaveModelConfig = params => {
  return POST(`api/v1/udTable/saveModelConfig`, params);
};

export const setTableBelongType = params => {
  return POST(`api/v1/userPage/setTableBelongType`, params);
};

export const ownerTable = params => {
  return POST(`api/v1/userPage/owner/table`, params);
};

export const journeyPathAnalyze = params => {
  return POST(`api/v1/ab/user-journey/path-analyze`, params);
};

export const journeyPathUserDetail = params => {
  return POST(`api/v1/ab/user-journey/path-user-detail`, params);
};

export const journeyPathUserTrend = params => {
  return POST(`api/v1/ab/user-journey/path-user-trend`, params);
};
