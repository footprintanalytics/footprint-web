import loadable from "@loadable/component";
import React from "react";
import { DashboardLoadingAndErrorWrapper } from "metabase/dashboard/components/Dashboard/Dashboard.styled";
import SubmitContractAddV3 from "metabase/submit/contract/addV3";

const options = {
  fallback: (
    <DashboardLoadingAndErrorWrapper
      loading={true}
      isFullHeight={true}
      isFullscreen=""
      isNightMode={false}
    />
  ),
};

// prettier-ignore
export default {
  // // main
  News: loadable(() => import("metabase/containers/news")),
  Featured: loadable(() => import("metabase/containers/news/featured")),
  Articles: loadable(() => import("metabase/containers/news/articles")),
  // // Product: loadable(() => import("metabase/containers/news/product")),
  // // Company: loadable(() => import("metabase/containers/news/company")),
  Reports: loadable(() => import("metabase/containers/news/reports")),
  FeatureCharts: loadable(() =>
    import("metabase/containers/news/feature_charts"),
  ),
  WriteForUs: loadable(() => import("metabase/containers/news/writeForUs")),
  ArticleDetail: loadable(() => import("metabase/containers/news/detail")),
  Publish: loadable(() => import("metabase/containers/news/publish")),
  Upgrade: loadable(() => import("metabase/containers/market/upgrade")),
  Market: loadable(() => import("metabase/containers/market/picture")),
  App: loadable(() => import("metabase/App.tsx")),
  // HomepageApp: loadable(() => import("metabase/home/containers/HomepageApp")),
  // AuthApp: loadable(() => import("metabase/auth/AuthApp")),
  // Register: loadable(() => import("metabase/auth/containers/Register")),
  // PasswordResetApp: loadable(() => import("metabase/auth/containers/PasswordResetApp")),

  //
  // BrowseApp: loadable(() => import("metabase/browse/components/BrowseApp")),
  // DatabaseBrowser: loadable(() => import("metabase/browse/containers/DatabaseBrowser")),
  // SchemaBrowser: loadable(() => import("metabase/browse/containers/SchemaBrowser")),
  // TableBrowser: loadable(() => import("metabase/browse/containers/TableBrowser")),
  Question: loadable(
    () => import("metabase/query_builder/containers/Question"),
    options,
  ),
  // CollectionEdit: loadable(() => import("metabase/collections/containers/CollectionEdit")),
  // CollectionCreate: loadable(() => import("metabase/collections/containers/CollectionCreate")),
  // ArchiveCollectionModal: loadable(() => import("metabase/components/ArchiveCollectionModal")),
  // CollectionPermissionsModal: loadable(() => import("metabase/admin/permissions/components/CollectionPermissionsModal/CollectionPermissionsModal")),
  // UserCollectionList: loadable(() => import("metabase/containers/UserCollectionList")),
  NotFoundFallbackPage: loadable(() =>
    import("metabase/containers/NotFoundFallbackPage"),
  ),
  SetupApp: loadable(() => import("metabase/setup/containers/SetupApp")),
  // PostSetupApp: loadable(() => import("metabase/setup/containers/PostSetupApp")),
  // CreateDashboardModal: loadable(() => import("metabase/components/CreateDashboardModal")),
  PublicQuestion: loadable(() =>
    import("metabase/public/containers/PublicQuestion"),
  ),
  PublicDashboard: loadable(() =>
    import("metabase/public/containers/PublicDashboard"),
  ),
  PublicNotFound: loadable(() =>
    import("metabase/public/components/PublicNotFound"),
  ),
  PublicApp: loadable(() => import("metabase/public/containers/PublicApp")),
  ArchiveDashboardModal: loadable(() =>
    import("metabase/dashboard/containers/ArchiveDashboardModal"),
  ),
  // DashboardHistoryModal: loadable(() => import("metabase/dashboard/components/DashboardHistoryModal")),
  DashboardMoveModal: loadable(() =>
    import("metabase/dashboard/components/DashboardMoveModal"),
  ),
  DashboardCopyModal: loadable(() =>
    import("metabase/dashboard/components/DashboardCopyModal"),
  ),
  DashboardDetailsModal: loadable(() =>
    import("metabase/dashboard/components/DashboardDetailsModal"),
  ),
  // CollectionLanding: loadable(() => import("metabase/components/CollectionLanding/CollectionLanding")),
  ArchiveApp: loadable(() => import("metabase/home/containers/ArchiveApp")),
  SearchApp: loadable(() => import("metabase/home/containers/SearchApp")),
  Pricing: loadable(() => import("metabase/pricing_v3/index")),
  Explore: loadable(() => import("metabase/containers/explore/index")),
  Features: loadable(() => import("metabase/containers/features/index")),
  Research: loadable(() => import("metabase/containers/research/index")),
  GuestDashboard: loadable(() => import("metabase/guest/Dashboard")),
  GuestQuestion: loadable(() => import("metabase/guest/Question")),
  // My: loadable(() => import("metabase/containers/my/index")),
  // Why: loadable(() => import("metabase/containers/why/index")),
  // Zkspace: loadable(() => import("metabase/containers/activity/zkspace/index")),
  Tutorials: loadable(() => import("metabase/containers/tutorials/index")),
  Academy: loadable(() => import("metabase/containers/academy/index")),
  TutorialsVisualizations: loadable(() =>
    import("metabase/containers/tutorials/visualizations"),
  ),
  TutorialsVideos: loadable(() =>
    import("metabase/containers/tutorials/videos"),
  ),
  TutorialsIndicators: loadable(() =>
    import("metabase/containers/tutorials/indicators"),
  ),
  ProjectAnalytics: loadable(() =>
    import("metabase/containers/projects/index"),
  ),
  ProjectDetail: loadable(() => import("metabase/containers/projects/detail")),
  ProtocolDetail: loadable(() =>
    import("metabase/containers/protocols/detail"),
  ),
  LoginModal: loadable(() => import("metabase/auth/containers/LoginModal")),
  ActivateAccount: loadable(() => import("metabase/containers/activate")),
  Dashboards: loadable(() => import("metabase/containers/dashboards"), options),
  CustomUpload: loadable(() => import("metabase/containers/customUpload")),
  Search: loadable(() => import("metabase/containers/search")),
  Protocols: loadable(() => import("metabase/containers/protocols")),
  Creator: loadable(() => import("metabase/containers/creator"), options),
  Widget: loadable(() => import("metabase/containers/widget")),
  About: loadable(() => import("metabase/containers/aboutV2")),
  NftPage: loadable(() => import("metabase/containers/nftPage")),
  batchDownload: loadable(() => import("metabase/containers/batchDownload")),
  community: loadable(() => import("metabase/containers/solution/Community")),
  marketing: loadable(() => import("metabase/containers/solution/Marketing")),
  blockchain: loadable(() => import("metabase/containers/solution/Blockchain")),
  games: loadable(() => import("metabase/containers/solution/Games")),
  dataApi: loadable(() => import("metabase/containers/dataApi")),
  dataApiPrice: loadable(() => import("metabase/containers/dataApi/price")),
  dataApiProduct: loadable(() => import("metabase/containers/dataApi/product")),
  dataApiStatistics: loadable(() => import("metabase/containers/dataApi/statistics")),
  MyStudio: loadable(() => import("metabase/containers/myStudio")),
  //
  // // account
  AccountApp: loadable(() => import("./account/app/containers/AccountApp")),
  WidgetPublic: loadable(() => import("metabase/containers/WidgetPublic")),
  WidgetBrand: loadable(() => import("metabase/containers/WidgetBrand")),

  // account
  UserProfileApp: loadable(() =>
    import("./account/profile/containers/UserProfileApp"),
  ),
  UserPasswordApp: loadable(() =>
    import("./account/password/containers/UserPasswordApp"),
  ),
  DeveloperApp: loadable(() =>
    import("./account/developer/containers/DeveloperApp"),
  ),
  // LoginHistoryApp: loadable(() => import("./account/login-history/containers/LoginHistoryApp")),
  // NotificationsApp: loadable(() => import("./account/notifications/containers/NotificationsApp")),
  // HelpModal: loadable(() => import("./account/notifications/components/HelpModal")),
  // ArchiveAlertModal: loadable(() => import("./account/notifications/containers/ArchiveAlertModal")),
  // ArchivePulseModal: loadable(() => import("./account/notifications/containers/ArchivePulseModal")),
  // UnsubscribeAlertModal: loadable(() => import("./account/notifications/containers/UnsubscribeAlertModal")),
  // UnsubscribePulseModal: loadable(() => import("./account/notifications/containers/UnsubscribePulseModal")),
  //
  // // admin
  // CollectionPermissionsPage: loadable(() => import("./admin/permissions/pages/CollectionPermissionsPage/CollectionPermissionsPage")),
  // DatabasesPermissionsPage: loadable(() => import("./admin/permissions/pages/DatabasePermissionsPage/DatabasesPermissionsPage")),
  // GroupsPermissionsPage: loadable(() => import("./admin/permissions/pages/GroupDataPermissionsPage/GroupsPermissionsPage")),
  // DataPermissionsPage: loadable(() => import("./admin/permissions/pages/DataPermissionsPage/DataPermissionsPage")),
  // NewUserModal: loadable(() => import("metabase/admin/people/containers/NewUserModal")),
  // UserSuccessModal: loadable(() => import("metabase/admin/people/containers/UserSuccessModal")),
  // UserPasswordResetModal: loadable(() => import("metabase/admin/people/containers/UserPasswordResetModal")),
  // EditUserModal: loadable(() => import("metabase/admin/people/containers/EditUserModal")),
  // UserActivationModal: loadable(() => import("metabase/admin/people/containers/UserActivationModal")),
  // SettingsEditorApp: loadable(() => import("metabase/admin/settings/containers/SettingsEditorApp")),
  // DatabaseListApp: loadable(() => import("metabase/admin/databases/containers/DatabaseListApp")),
  // DatabaseEditApp: loadable(() => import("metabase/admin/databases/containers/DatabaseEditApp")),
  // DataModelApp: loadable(() => import("metabase/admin/datamodel/containers/DataModelApp")),
  // MetadataEditorApp: loadable(() => import("metabase/admin/datamodel/containers/MetadataEditorApp")),
  // MetricListApp: loadable(() => import("metabase/admin/datamodel/containers/MetricListApp")),
  // MetricApp: loadable(() => import("metabase/admin/datamodel/containers/MetricApp")),
  // SegmentListApp: loadable(() => import("metabase/admin/datamodel/containers/SegmentListApp")),
  // SegmentApp: loadable(() => import("metabase/admin/datamodel/containers/SegmentApp")),
  // RevisionHistoryApp: loadable(() => import("metabase/admin/datamodel/containers/RevisionHistoryApp")),
  // AdminPeopleApp: loadable(() => import("metabase/admin/people/containers/AdminPeopleApp")),
  // FieldApp: loadable(() => import("metabase/admin/datamodel/containers/FieldApp")),
  // TableSettingsApp: loadable(() => import("metabase/admin/datamodel/containers/TableSettingsApp")),
  // TroubleshootingApp: loadable(() => import("metabase/admin/tasks/containers/TroubleshootingApp")),
  // TasksApp: loadable(() => import("metabase/admin/tasks/containers/TasksApp")),
  // TaskModal: loadable(() => import("metabase/admin/tasks/containers/TaskModal")),
  // JobInfoApp: loadable(() => import("metabase/admin/tasks/containers/JobInfoApp")),
  // JobTriggersModal: loadable(() => import("metabase/admin/tasks/containers/JobTriggersModal")),
  // Logs: loadable(() => import("metabase/admin/tasks/containers/Logs")),
  // Help: loadable(() => import("metabase/admin/tasks/containers/Help")),
  // PeopleListingApp: loadable(() => import("metabase/admin/people/containers/PeopleListingApp")),
  // GroupsListingApp: loadable(() => import("metabase/admin/people/containers/GroupsListingApp")),
  // GroupDetailApp: loadable(() => import("metabase/admin/people/containers/GroupDetailApp")),

  // submit
  SubmitContractAdd: loadable(() => import("metabase/submit/contract/add")),
  // SubmitContract: loadable(() => import("metabase/submit/contract/index")),
  // SubmitContractAddV2: loadable(() => import("metabase/submit/contract/addV2")),
  SubmitContract: loadable(() => import("metabase/submit/contract/reference/index")),
  SubmitContractAddV2: loadable(() => import("metabase/submit/contract/reference/index")),
  SubmitContractAddV3: loadable(() => import("metabase/submit/contract/addV3")),
  SubmitRefContractAdd: loadable(() => import("metabase/submit/contract/reference/add")),
  SubmitRefContract: loadable(() => import("metabase/submit/contract/reference/index")),
  SubmitContractSuccess: loadable(() =>
    import("metabase/submit/contract/success"),
  ),

  /* Browse data */
  PulseEditApp: loadable(() =>
    import("metabase/pulse/containers/PulseEditApp"),
  ),
  NewModelOptions: loadable(() =>
    import("metabase/new_model/containers/NewModelOptions"),
  ),
  CreateDashboardModal: loadable(() =>
    import("metabase/components/CreateDashboardModal"),
  ),
  UserCollectionList: loadable(() =>
    import("metabase/containers/UserCollectionList"),
  ),
  CollectionPermissionsModal: loadable(() =>
    import(
      "metabase/admin/permissions/components/CollectionPermissionsModal/CollectionPermissionsModal"
    ),
  ),
  ArchiveCollectionModal: loadable(() =>
    import("metabase/components/ArchiveCollectionModal"),
  ),
  MoveCollectionModal: loadable(() =>
    import("metabase/collections/containers/MoveCollectionModal"),
  ),
  CollectionCreate: loadable(() =>
    import("metabase/collections/containers/CollectionCreate"),
  ),
  QueryBuilder: loadable(() =>
    import("metabase/query_builder/containers/QueryBuilder"),
  ),
  TableBrowser: loadable(() =>
    import("metabase/browse/containers/TableBrowser"),
  ),
  SchemaBrowser: loadable(() =>
    import("metabase/browse/containers/SchemaBrowser"),
  ),
  DatabaseBrowser: loadable(() =>
    import("metabase/browse/containers/DatabaseBrowser"),
  ),
  BrowseApp: loadable(() => import("metabase/browse/components/BrowseApp")),

  /* Dashboards */
  DashboardApp: loadable(
    () => import("metabase/dashboard/containers/DashboardApp"),
    options,
  ),
  AutomaticDashboardApp: loadable(() =>
    import("metabase/dashboard/containers/AutomaticDashboardApp"),
  ),

  // auth containers
  ForgotPasswordApp: loadable(() =>
    import("metabase/auth/containers/ForgotPasswordApp"),
  ),
  LoginApp: loadable(() => import("metabase/auth/containers/LoginApp")),
  LogoutApp: loadable(() => import("metabase/auth/containers/LogoutApp")),
  ResetPasswordApp: loadable(() =>
    import("metabase/auth/containers/ResetPasswordApp"),
  ),
  ActivityApp: loadable(() => import("metabase/home/containers/ActivityApp")),

  // Reference Databases
  DatabaseListContainer: loadable(() =>
    import("metabase/reference/databases/DatabaseListContainer"),
  ),
  DatabaseDetailContainer: loadable(() =>
    import("metabase/reference/databases/DatabaseDetailContainer"),
  ),
  TableListContainer: loadable(() =>
    import("metabase/reference/databases/TableListContainer"),
  ),
  TableDetailContainer: loadable(() =>
    import("metabase/reference/databases/TableDetailContainer"),
  ),
  TableQuestionsContainer: loadable(() =>
    import("metabase/reference/databases/TableQuestionsContainer"),
  ),
  FieldListContainer: loadable(() =>
    import("metabase/reference/databases/FieldListContainer"),
  ),
  FieldDetailContainer: loadable(() =>
    import("metabase/reference/databases/FieldDetailContainer"),
  ),

  HomePage: loadable(() =>
    import("metabase/home/homepage/containers/HomePage"),
  ),
  CollectionLanding: loadable(() =>
    import("metabase/collections/components/CollectionLanding"),
  ),

  // Reference Segments
  SegmentListContainer: loadable(() =>
    import("metabase/reference/segments/SegmentListContainer"),
  ),
  SegmentDetailContainer: loadable(() =>
    import("metabase/reference/segments/SegmentDetailContainer"),
  ),
  SegmentQuestionsContainer: loadable(() =>
    import("metabase/reference/segments/SegmentQuestionsContainer"),
  ),
  SegmentRevisionsContainer: loadable(() =>
    import("metabase/reference/segments/SegmentRevisionsContainer"),
  ),
  SegmentFieldListContainer: loadable(() =>
    import("metabase/reference/segments/SegmentFieldListContainer"),
  ),
  SegmentFieldDetailContainer: loadable(() =>
    import("metabase/reference/segments/SegmentFieldDetailContainer"),
  ),

  // Reference Metrics
  MetricListContainer: loadable(() =>
    import("metabase/reference/metrics/MetricListContainer"),
  ),
  MetricDetailContainer: loadable(() =>
    import("metabase/reference/metrics/MetricDetailContainer"),
  ),
  MetricQuestionsContainer: loadable(() =>
    import("metabase/reference/metrics/MetricQuestionsContainer"),
  ),
  MetricRevisionsContainer: loadable(() =>
    import("metabase/reference/metrics/MetricRevisionsContainer"),
  ),

  // Tools
  Tools: loadable(() => import("metabase/admin/tools/containers/Tools")),
  RedirectToAllowedSettings: loadable(() =>
    import("metabase/admin/settings/containers/RedirectToAllowedSettings"),
  ),

  // People
  PeopleListingApp: loadable(() =>
    import("metabase/admin/people/containers/PeopleListingApp"),
  ),
  GroupsListingApp: loadable(() =>
    import("metabase/admin/people/containers/GroupsListingApp"),
  ),
  GroupDetailApp: loadable(() =>
    import("metabase/admin/people/containers/GroupDetailApp"),
  ),
  // GrowthAnalytics
  GaAboutContainer: loadable(() => import("metabase/growth/containers/About")),
  CreateCampaign: loadable(() =>
    import("metabase/growth/containers/CampaignQuestflow"),
  ),
  FgaPrice: loadable(() => import("metabase/growth/containers/price")),
  GameList: loadable(() =>
    import("metabase/ab/containers/gameList"),
  ),
  projectList: loadable(() =>
    import("metabase/ab/containers/projectList"),
  ),
  VcIndex: loadable(() =>
    import("metabase/ab/containers/VcIndex"),
  ),
  GrowthIndex: loadable(() =>
    import("metabase/ab/containers/GrowthIndex"),
  ),
  QuestDetail: loadable(() =>
    import("metabase/ab/containers/QuestDetail"),
  ),
  GrowthApp: loadable(() =>
    import("metabase/ab/app"),
  ),
  Hub: loadable(() =>
    import("metabase/ab/app/hub"),
  ),
  bindGame: loadable(() =>
    import("metabase/ab/containers/bindGame"),
  ),
  WrapDashboard: loadable(
    () => import("metabase/growth/containers/WrapDashboard"),
    options,
  ),
  GaProjectContainer: loadable(() =>
    import("metabase/growth/containers/Project"),
  ),
  ABProjectContainer: loadable(() =>
    import("metabase/ab/containers/Project"),
  ),
  // Metadata / Data model
  DataModelApp: loadable(() =>
    import("metabase/admin/datamodel/containers/DataModelApp"),
  ),
  MetadataEditorApp: loadable(() =>
    import("metabase/admin/datamodel/containers/MetadataEditorApp"),
  ),
  MetricListApp: loadable(() =>
    import("metabase/admin/datamodel/containers/MetricListApp"),
  ),
  MetricApp: loadable(() =>
    import("metabase/admin/datamodel/containers/MetricApp"),
  ),
  SegmentListApp: loadable(() =>
    import("metabase/admin/datamodel/containers/SegmentListApp"),
  ),
  SegmentApp: loadable(() =>
    import("metabase/admin/datamodel/containers/SegmentApp"),
  ),
  RevisionHistoryApp: loadable(() =>
    import("metabase/admin/datamodel/containers/RevisionHistoryApp"),
  ),
  AdminPeopleApp: loadable(() =>
    import("metabase/admin/people/containers/AdminPeopleApp"),
  ),
  FieldApp: loadable(() =>
    import("metabase/admin/datamodel/containers/FieldApp"),
  ),
  TableSettingsApp: loadable(() =>
    import("metabase/admin/datamodel/containers/TableSettingsApp"),
  ),
  TroubleshootingApp: loadable(() =>
    import("metabase/admin/tasks/containers/TroubleshootingApp"),
  ),

  TasksApp: loadable(() => import("metabase/admin/tasks/containers/TasksApp")),
  TaskModal: loadable(() =>
    import("metabase/admin/tasks/containers/TaskModal"),
  ),
  JobInfoApp: loadable(() =>
    import("metabase/admin/tasks/containers/JobInfoApp"),
  ),
  JobTriggersModal: loadable(() =>
    import("metabase/admin/tasks/containers/JobTriggersModal"),
  ),
  Logs: loadable(() => import("metabase/admin/tasks/containers/Logs")),
  Help: loadable(() => import("metabase/admin/tasks/containers/Help")),
  ModelCacheRefreshJobs: loadable(() =>
    import(
      "metabase/admin/tasks/containers/ModelCacheRefreshJobs/ModelCacheRefreshJobs"
    ),
  ),
  ModelCacheRefreshJobModal: loadable(() =>
    import(
      "metabase/admin/tasks/containers/ModelCacheRefreshJobs/ModelCacheRefreshJobModal"
    ),
  ),

  //  DB Add / list
  DatabaseListApp: loadable(() =>
    import("metabase/admin/databases/containers/DatabaseListApp"),
  ),
  DatabaseEditApp: loadable(() =>
    import("metabase/admin/databases/containers/DatabaseEditApp"),
  ),

  // Settings
  SettingsEditorApp: loadable(() =>
    import("metabase/admin/settings/containers/SettingsEditorApp"),
  ),
  PremiumEmbeddingLicensePage: loadable(() =>
    import("metabase/admin/settings/containers/PremiumEmbeddingLicensePage"),
  ),

  AdminApp: loadable(() => import("metabase/admin/app/components/AdminApp")),
  NewUserModal: loadable(() =>
    import("metabase/admin/people/containers/NewUserModal"),
  ),
  UserSuccessModal: loadable(() =>
    import("metabase/admin/people/containers/UserSuccessModal"),
  ),
  UserPasswordResetModal: loadable(() =>
    import("metabase/admin/people/containers/UserPasswordResetModal"),
  ),
  EditUserModal: loadable(() =>
    import("metabase/admin/people/containers/EditUserModal"),
  ),
  UserActivationModal: loadable(() =>
    import("metabase/admin/people/containers/UserActivationModal"),
  ),

  // permissions/routes
  CollectionPermissionsPage: loadable(() =>
    import(
      "metabase/admin/permissions/pages/CollectionPermissionsPage/CollectionPermissionsPage"
    ),
  ),
  DatabasesPermissionsPage: loadable(() =>
    import(
      "metabase/admin/permissions/pages/DatabasePermissionsPage/DatabasesPermissionsPage"
    ),
  ),
  GroupsPermissionsPage: loadable(() =>
    import(
      "metabase/admin/permissions/pages/GroupDataPermissionsPage/GroupsPermissionsPage"
    ),
  ),
  DataPermissionsPage: loadable(() =>
    import("metabase/admin/permissions/pages/DataPermissionsPage"),
  ),

  //notifications/routes
  NotificationsApp: loadable(() =>
    import("metabase/account/notifications/containers/NotificationsApp"),
  ),
  HelpModal: loadable(() =>
    import("metabase/account/notifications/components/HelpModal"),
  ),
  ArchiveAlertModal: loadable(() =>
    import("metabase/account/notifications/containers/ArchiveAlertModal"),
  ),
  ArchivePulseModal: loadable(() =>
    import("metabase/account/notifications/containers/ArchivePulseModal"),
  ),
  UnsubscribeAlertModal: loadable(() =>
    import("metabase/account/notifications/containers/UnsubscribeAlertModal"),
  ),
  UnsubscribePulseModal: loadable(() =>
    import("metabase/account/notifications/containers/UnsubscribePulseModal"),
  ),

  // timelines/routes
  DeleteEventModal: loadable(() =>
    import("metabase/timelines/collections/containers/DeleteEventModal"),
  ),
  DeleteTimelineModal: loadable(() =>
    import("metabase/timelines/collections/containers/DeleteTimelineModal"),
  ),
  EditEventModal: loadable(() =>
    import("metabase/timelines/collections/containers/EditEventModal"),
  ),
  EditTimelineModal: loadable(() =>
    import("metabase/timelines/collections/containers/EditTimelineModal"),
  ),
  MoveEventModal: loadable(() =>
    import("metabase/timelines/collections/containers/MoveEventModal"),
  ),
  MoveTimelineModal: loadable(() =>
    import("metabase/timelines/collections/containers/MoveTimelineModal"),
  ),
  NewEventModal: loadable(() =>
    import("metabase/timelines/collections/containers/NewEventModal"),
  ),
  NewEventWithTimelineModal: loadable(() =>
    import(
      "metabase/timelines/collections/containers/NewEventWithTimelineModal"
    ),
  ),
  NewTimelineModal: loadable(() =>
    import("metabase/timelines/collections/containers/NewTimelineModal"),
  ),
  TimelineArchiveModal: loadable(() =>
    import("metabase/timelines/collections/containers/TimelineArchiveModal"),
  ),
  TimelineDetailsModal: loadable(() =>
    import("metabase/timelines/collections/containers/TimelineDetailsModal"),
  ),
  TimelineIndexModal: loadable(() =>
    import("metabase/timelines/collections/containers/TimelineIndexModal"),
  ),
  TimelineListArchiveModal: loadable(() =>
    import(
      "metabase/timelines/collections/containers/TimelineListArchiveModal"
    ),
  ),

  // audit_app/routes
  UnsubscribeUserModal: loadable(() =>
    import(
      "metabase-enterprise/audit_app/containers/UnsubscribeUserModal/UnsubscribeUserModal"
    ),
  ),
  AuditApp: loadable(() =>
    import("metabase-enterprise/audit_app/containers/AuditApp"),
  ),
  AuditOverview: loadable(() =>
    import("metabase-enterprise/audit_app/pages/AuditOverview"),
  ),
  AuditDatabases: loadable(() =>
    import("metabase-enterprise/audit_app/pages/AuditDatabases"),
  ),
  AuditDatabaseDetail: loadable(() =>
    import("metabase-enterprise/audit_app/pages/AuditDatabaseDetail"),
  ),
  AuditSchemas: loadable(() =>
    import("metabase-enterprise/audit_app/pages/AuditSchemas"),
  ),
  AuditSchemaDetail: loadable(() =>
    import("metabase-enterprise/audit_app/pages/AuditSchemaDetail"),
  ),
  AuditTables: loadable(() =>
    import("metabase-enterprise/audit_app/pages/AuditTables"),
  ),
  AuditTableDetail: loadable(() =>
    import("metabase-enterprise/audit_app/pages/AuditTableDetail"),
  ),
  AuditQuestions: loadable(() =>
    import("metabase-enterprise/audit_app/pages/AuditQuestions"),
  ),
  AuditQuestionDetail: loadable(() =>
    import("metabase-enterprise/audit_app/pages/AuditQuestionDetail"),
  ),
  AuditDashboards: loadable(() =>
    import("metabase-enterprise/audit_app/pages/AuditDashboards"),
  ),
  AuditDashboardDetail: loadable(() =>
    import("metabase-enterprise/audit_app/pages/AuditDashboardDetail"),
  ),
  AuditQueryDetail: loadable(() =>
    import("metabase-enterprise/audit_app/pages/AuditQueryDetail"),
  ),
  AuditUsers: loadable(() =>
    import("metabase-enterprise/audit_app/pages/AuditUsers"),
  ),
  AuditUserDetail: loadable(() =>
    import("metabase-enterprise/audit_app/pages/AuditUserDetail"),
  ),
  AuditDownloads: loadable(() =>
    import("metabase-enterprise/audit_app/pages/AuditDownloads"),
  ),
  AuditSubscriptions: loadable(() =>
    import("metabase-enterprise/audit_app/pages/AuditSubscriptions"),
  ),
};
