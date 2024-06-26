import { t } from "ttag";

export const SEARCH_DEBOUNCE_DURATION = 300;

export const DEFAULT_SEARCH_LIMIT = 50;

// A part of hack required to work with both null and 0
// values in numeric dimensions
export const NULL_NUMERIC_VALUE = -Infinity;

export const NULL_DISPLAY_VALUE = t`(empty)`;

// Hack to work with numeric and string x values in waterfall charts
// Must be a unique string which can be converted to a number since
// crossfilter converts strings to numbers when grouping starts with numeric data
export const TOTAL_ORDINAL_VALUE = "Infinity";

export const CHAIN_COUNT = "30+";
