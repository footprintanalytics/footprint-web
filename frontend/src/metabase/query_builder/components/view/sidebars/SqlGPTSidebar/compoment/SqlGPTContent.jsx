/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./SqlGPTContent.css";
import { answerGPT } from "metabase/new-service";
import { Button, Form, Input } from "antd";

const SqlGPTContent = ({
  updateQuestion,
  question,
  databaseId,
  sql
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const onFinish = (values) => {
    runApi(values.input);
  }

  const runApi = async (query) => {
    setLoading(true);
    setError("");
    setSuccess(false);
    let data;
    try {
      data = await answerGPT({
        "uri": "1/en",
        "query": query,
      });
      const regex = /```([^`]*)```/g;
      const regResult = regex.exec(data?.answer);

      const regex2 = /###([^`]*)###/g;
      const regResult2 = regex2.exec(data?.answer);
      const queryText = regResult ? regResult[1] : (regResult2 ? regResult2[1] : "")
      console.log("regResult", regResult)
      console.log("regResult2", regResult2)
      if (!queryText) {
        setError(data?.answer)
      } else {
        const nativeQuery = {
          type: "native",
          native: { query: queryText.replace(/;/g, "") },
          database: databaseId,
        };

        updateQuestion(question.setDatasetQuery(nativeQuery));
        window._editor && window._editor.focus();
        setSuccess(true);
      }
    } catch (e) {
      console.log("error", e)
    }
    setLoading(false);
  }

  return (
    <div className="p2" style={{ maxWidth: 1000, margin: "0 auto" }}>
      <Form
        layout="vertical"
        initialValues={{
          input: "how can i query aave last 7 day volume?",
        }}
        style={{
          maxWidth: 1000,
        }}
        onFinish={onFinish}
      >
        <Form.Item label="Please describe your needs. e.g. How can i query aave last 7 day volume?" name="input" >
          <Input.TextArea style={{ height: 200 }}/>
        </Form.Item>
        <div className="text-centered">
          <Button type="primary" htmlType="submit" loading={loading}>Explore</Button>
        </div>
        {success && (
          <div className="mt2">The sql is already displayed in the middle sql edit box.</div>
        )}
        {error && (
          <div style={{ color: "red", lineHeight: "20px", margin: "12px 0" }}>
            <h3>The result does not contain sql, please try again. </h3>
            <span>{error}</span>
          </div>
        )}
      </Form>
    </div>
  );
};


export default React.memo(SqlGPTContent);
