/* eslint-disable curly */
import { useEffect, useState } from "react";
import { code_generate } from "./gen";
import { QUERY_OPTIONS, DEFAULT_TOKEN } from "./config";
import { useQuery, useMutation } from "react-query";
import { MetabaseApi } from "metabase/services";
import { executeCode } from "./service";
import { message } from "antd";
import { snakeCase } from "lodash";
import { useDebounce } from "ahooks";
import { isProduction } from "metabase/env";
import { slack } from "metabase/lib/slack";

export const useDataset = ({ card }) => {
  const [dataset, setDataset] = useState();

  const { isLoading } = useQuery(
    "useQueryDataset",
    async () => {
      const params = card.dataset_query;
      params.query.limit = 10;
      const res = await MetabaseApi.dataset(params);
      setDataset(res.data);
    },
    { ...QUERY_OPTIONS, enabled: !!card },
  );

  return { isLoading, dataset, setDataset };
};

export const useTableName = ({ dataset, user }) => {
  const [tableName, setTableName] = useState();

  useEffect(() => {
    const userName = `${snakeCase(user?.common_name)}`;
    setTableName(userName);
  }, [dataset?.native_form, user?.common_name]);

  return { tableName, setTableName };
};

export const usePreview = ({ dataset, user }) => {
  const token = isProduction ? user?.auth_key || DEFAULT_TOKEN : DEFAULT_TOKEN;

  const [submitted, setSubmitted] = useState(false);
  const [complieRes, setComplieRes] = useState();
  const [executeRes, setExecuteRes] = useState();
  const [formulas, setFormulas] = useState([]);
  const debouncedFormulas = useDebounce(formulas, { wait: 1000 });

  const { mutate, isLoading } = useMutation(executeCode, {
    onSuccess: res => {
      let errorMsg;
      if (res.error) {
        if (res.error?.evalue?.includes("copy")) {
          errorMsg = `Exceeded the query limit, please reduce the query volume.`;
        } else {
          errorMsg = `${res.error?.ename}: ${res.error?.evalue}`;
        }
        message.error(errorMsg);
        notify(errorMsg);
        return;
      }
      if (res.table["text/plain"] === "False") {
        errorMsg = "Failed to save table.";
        message.error(errorMsg);
        notify(errorMsg);
        return;
      }
      if (res.table["text/plain"] === "True") {
        setSubmitted(true);
        notify("Table saved successfully.");
        return;
      }
      if (!debouncedFormulas.length) {
        res.table.columns = res.table.columns.map(item => ({
          name: item,
          formula: undefined,
          id: item + Date.now(),
        }));
      } else {
        res.table.columns = executeRes.table.columns;
      }
      setExecuteRes(res);
    },
  });

  const notify = msg => {
    slack([
      { label: "Message", value: msg },
      { label: "Formula", value: JSON.stringify(debouncedFormulas) },
      { label: "SQL", value: dataset.native_form.query },
      { label: "Email", value: user?.email },
      { label: "User", value: user?.common_name },
    ]);
  };

  const run = params => {
    try {
      const res = code_generate(params);
      setComplieRes(res);
      mutate({ code: res.split("\n") });
    } catch (error) {}
  };

  const edit = value => {
    setExecuteRes(value);
    let validFormulas = value.table.columns.filter(
      item => item.formula !== undefined,
    );
    validFormulas = validFormulas.map(item => ({
      ...item,
      formula:
        String(item.formula)
          .replace(/\[/g, "$")
          .replace(/\]/g, "") || '""',
    }));
    setFormulas(validFormulas);
  };

  const submit = tableName => {
    run({
      formulas: debouncedFormulas,
      sql: dataset.native_form.query.replace("LIMIT 10", ""),
      token,
      submitParams: {
        project_id: isProduction ? "gaia-data" : "footprint-test-341610",
        dataset_id: isProduction ? "gaia" : "kaka",
        table_name: tableName,
      },
    });
  };

  useEffect(() => {
    if (!dataset) return;
    run({ sql: dataset.native_form.query, token });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, token]);

  useEffect(() => {
    if (!debouncedFormulas.length) return;
    run({ formulas: debouncedFormulas });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFormulas]);

  return {
    complieRes,
    executeRes,
    edit,
    submit,
    running: isLoading,
    submitted,
  };
};
