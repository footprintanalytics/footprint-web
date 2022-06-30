import { GET, POST, DELETE } from "metabase/lib/new-api";
import axios from "axios";
import { getProject, isDefi360 } from "./lib/project_info";

export const apiGet = async api => {
  return await axios.get(api);
};

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
  return GET(`/api/collection/${collectionId}/items`, params);
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

export const getUserInterests = async () => {
  return GET(`/api/v1/user/interests`);
};

export const postUserInterests = async params => {
  return POST(`/api/v1/user/interests`, params);
};

export const getProductInfo = async () => {
  return POST(`/api/v1/payment/product/list`);
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
  return POST(`/api/v1/database/table/searchV2`, params);
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
  return POST(`/api/v1/personalInfo`, params);
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
