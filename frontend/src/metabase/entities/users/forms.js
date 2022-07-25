import { t } from "ttag";
import { PLUGIN_ADMIN_USER_FORM_FIELDS } from "metabase/plugins";
import validate from "metabase/lib/validate";
import FormGroupsWidget from "metabase/components/form/widgets/FormGroupsWidget";

import type { FormFieldDefinition } from "metabase/containers/Form";

const USER_NAME_FIELD: () => FormFieldDefinition[] = () => [
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

const USER_AVATAR_FIELD: () => FormFieldDefinition[] = () => [
  {
    name: "avatar",
    title: t`Profile Photo`,
    type: "avatar",
  },
];

const USER_INFO_FIELD: () => FormFieldDefinition[] = () => [
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

const DETAILS_FORM_FIELDS: () => FormFieldDefinition[] = () => [
  ...USER_NAME_FIELD(),
  {
    name: "email",
    title: t`Email`,
    placeholder: "youlooknicetoday@email.com",
    validate: validate.required().email(),
  },
];

const DETAILS_FORM_FIELDS_USER_VIP: () => FormFieldDefinition[] = () => [
  ...USER_AVATAR_FIELD(),
  ...USER_NAME_FIELD(),
  {
    name: "email",
    title: t`Email`,
    placeholder: "youlooknicetoday@email.com",
    readOnly: true,
    validate: validate.required().email(),
  },
  ...USER_INFO_FIELD(),
  {
    name: "hideWatermark",
    title: t`Remove watermarks from all the dashboards and charts you create`,
    checkboxCss: true,
    type: "checkbox",
  },
];

const DETAILS_FORM_FIELDS_USER: () => FormFieldDefinition[] = () => [
  ...USER_AVATAR_FIELD(),
  ...USER_NAME_FIELD(),
  {
    name: "email",
    title: t`Email`,
    placeholder: "youlooknicetoday@email.com",
    readOnly: true,
    validate: validate.required().email(),
  },
  ...USER_INFO_FIELD(),
];

/*const LOCALE_FIELD: FormFieldDefinition = {
  name: "locale",
  title: t`Language`,
  type: "select",
  options: [
    [null, t`Use site default`],
    ..._.sortBy(
      MetabaseSettings.get("available-locales") || [["en", "English"]],
      ([code, name]) => name,
    ),
  ].map(([code, name]) => ({ name, value: code })),
};*/

const PASSWORD_FORM_FIELDS: () => FormFieldDefinition[] = () => [
  {
    name: "password",
    title: t`Create a password`,
    type: "password",
    placeholder: t`Shhh...`,
    validate: validate.required().passwordComplexity(),
  },
  {
    name: "password_confirm",
    title: t`Confirm your password`,
    type: "password",
    placeholder: t`Shhh... but one more time so we get it right`,
    validate: (password_confirm, { values: { password } = {} }) =>
      (!password_confirm && t`required`) ||
      (password_confirm !== password && t`passwords do not match`),
  },
];

export default {
  admin: {
    fields: [
      ...DETAILS_FORM_FIELDS(),
      {
        name: "group_ids",
        title: t`Groups`,
        type: FormGroupsWidget,
      },
      ...PLUGIN_ADMIN_USER_FORM_FIELDS,
    ],
  },
  user: {
    fields: [...DETAILS_FORM_FIELDS_USER()],
    disablePristineSubmit: true,
  },
  vipUser: {
    fields: [...DETAILS_FORM_FIELDS_USER_VIP()],
    disablePristineSubmit: true,
  },
  setup: () => ({
    fields: [
      ...DETAILS_FORM_FIELDS(),
      ...PASSWORD_FORM_FIELDS(),
      {
        name: "site_name",
        title: t`Your company or team name`,
        placeholder: t`Department of Awesome`,
        validate: validate.required(),
      },
    ],
  }),
  password: {
    fields: [
      {
        name: "old_password",
        type: "password",
        title: t`Current password`,
        placeholder: t`Shhh...`,
        validate: validate.required(),
      },
      ...PASSWORD_FORM_FIELDS(),
    ],
  },
  password_reset: {
    fields: [...PASSWORD_FORM_FIELDS()],
  },
};
