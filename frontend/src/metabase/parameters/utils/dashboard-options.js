import { t } from "ttag";
import { ID_OPTION, SERIES_CATEGORY_OPTIONS } from "metabase-lib/parameters/constants";
import { buildTypedOperatorOptions } from "metabase-lib/parameters/utils/operators";

export function getDashboardParameterSections() {
  const userId = window.localStorage.getItem("GAUserId");
  const showFgaText = userId === "6" || userId === "10";
  return [
    {
      id: "date",
      name: t`Time`,
      description: t`Date range, relative date, time of day, etc.`,
      options: buildTypedOperatorOptions("date", "date", t`Date`),
    },
    {
      id: "location",
      name: t`Location`,
      description: t`City, State, Country, ZIP code.`,
      options: buildTypedOperatorOptions("string", "location", t`Location`),
    },
    {
      id: "id",
      name: t`ID`,
      description: t`User ID, Product ID, Event ID, etc.`,
      options: [
        {
          ...ID_OPTION,
          sectionId: "id",
        },
      ],
    },
    {
      id: "number",
      name: t`Number`,
      description: t`Subtotal, Age, Price, Quantity, etc.`,
      options: buildTypedOperatorOptions("number", "number", t`Number`),
    },
    {
      id: "series_category",
      name: t`Series Text`,
      description: t`A series of category option.`,
      options: SERIES_CATEGORY_OPTIONS,
    },
    showFgaText ? {
      id: "fp_enum",
      name: t`Enum`,
      description: t`Name, Rating, Description, etc.`,
      options: buildTypedOperatorOptions("string", "fp_enum", t`Enum`),
    } : null,
    {
      id: "string",
      name: t`Text or Category`,
      description: t`Name, Rating, Description, etc.`,
      options: buildTypedOperatorOptions("string", "string", t`Text`),
    },
  ].filter(Boolean);
}
