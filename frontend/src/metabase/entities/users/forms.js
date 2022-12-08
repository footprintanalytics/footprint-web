import { t } from "ttag";
import { PLUGIN_ADMIN_USER_FORM_FIELDS } from "metabase/plugins";
import validate from "metabase/lib/validate";
import FormGroupsWidget from "metabase/components/form/widgets/FormGroupsWidget";


const USER_AVATAR_FIELD = [
  {
    name: "avatar",
    title: t`Profile Photo`,
    type: "avatar",
  },
];

const USER_NAME_FIELD = [
  {
    name: "name",
    title: t`Name`,
    placeholder: "Your Name",
    description:
      "Tip: Name is a unique certificate for your account. It can only be changed once!",
    descriptionPosition: "bottom",
    autoFocus: true,
    validate: validate
      .required()
      .minLength(2)
      .maxLength(20)
      .checkUserName(),
    normalize: value => value.trim(),
  },
];


const USER_INFO_FIELD = [
  {
    name: "twitter",
    title: t`Twitter`,
    placeholder: "@Footprint_Data or https://twitter.com/Footprint_Data",
  },
  {
    name: "telegram",
    title: t`Telegram`,
    placeholder:
      "@FootprintAnalytics or https://t.me/joinchat/4-ocuURAr2thODFh",
  },
  {
    name: "discord",
    title: t`Discord`,
    placeholder: "@FootprintOfficial#5374 or https://discord.gg/3HYaR6USM7",
  },
  {
    name: "bio",
    title: t`A Short Bio`,
    placeholder:
      "Brief description for your profile or add your wallet address...",
    type: "text",
  },
];

const DETAILS_FORM_FIELDS_USER_VIP = [
  ...USER_AVATAR_FIELD,
  ...USER_NAME_FIELD,
  {
    name: "email",
    title: t`Email`,
    placeholder: "youlooknicetoday@email.com",
    readOnly: true,
    validate: validate.required().email(),
  },
  ...USER_INFO_FIELD,
  {
    name: "hideWatermark",
    title: t`Remove watermarks from all the dashboards and charts you create`,
    checkboxCss: true,
    type: "checkbox",
  },
];

const DETAILS_FORM_FIELDS_USER = [
  ...USER_AVATAR_FIELD,
  ...USER_NAME_FIELD,
  {
    name: "email",
    title: t`Email`,
    placeholder: "youlooknicetoday@email.com",
    readOnly: true,
    validate: validate.required().email(),
  },
  ...USER_INFO_FIELD,
];

export default {
  vipUser: {
    fields: [...DETAILS_FORM_FIELDS_USER_VIP],
    disablePristineSubmit: true,
  },
  user: {
    fields: [...DETAILS_FORM_FIELDS_USER],
    disablePristineSubmit: true,
  },
  admin: {
    fields: [
      ...DETAILS_FORM_FIELDS_USER_VIP,
      {
        name: "user_group_memberships",
        title: t`Groups`,
        type: FormGroupsWidget,
      },
      ...PLUGIN_ADMIN_USER_FORM_FIELDS,
    ],
  },
};
