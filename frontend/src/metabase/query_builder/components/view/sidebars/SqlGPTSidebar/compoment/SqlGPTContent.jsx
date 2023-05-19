/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "./SqlGPTContent.css";
import { Button, Form, Input } from "antd";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const SqlGPTContent = ({
  updateQuestion,
  runQuestionQuery,
  question,
  databaseId,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  // const [result, setResult] = useState("")
  const onFinish = (values) => {
    runApi(values.input);
  }
  let tempString = "";
  const fetchData = async (query) => {
    tempString = ""
    // setResult(tempString)
    await fetchEventSource(
      `https://footprint-gpt-production.up.railway.app/answer`,
      // `https://gpt.footprint.network/answer`,
      // `http://localhost:3002/test`,
      {
      method: "POST",
      headers: {
        "Content-Type": 'application/json',
      },
      body: JSON.stringify({
        "uri": "7/en",
        "query": query,
        "is_stream": true,
      }),
      onopen(res) {
        console.log("sse onopen", res)
      },
      onmessage: (event) => {
        let data = event.data;
        if (!data) {
          data = " ";
        }
        tempString = tempString.concat(data)
        // setResult(tempString)
        console.log("sse sql", tempString)
        const nativeQuery = {
          type: "native",
          native: { query: tempString.replace(/;/g, "") },
          database: databaseId,
        };

        updateQuestion(question.setDatasetQuery(nativeQuery));
      },
      onclose() {
        // console.log("Connection closed by the server");
        setLoading(false);
        if (!(tempString.trim())) {
          setError("This query did not explore the correct sql. Please try again with a different question.");
        }
        if (tempString?.includes("SELECT")) {
          runQuestionQuery();
        }
      },
      onerror(err) {
        console.log("sse error", err);
        setLoading(false);
      },
    });
  };

  const runApi = async (query) => {
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      fetchData(query);
    } catch (e) {
      console.log("error", e)
    }
  }

  return (
    <div className="p2" style={{ maxWidth: 1000, margin: "0 auto" }}>
      <Form
        layout="vertical"
        initialValues={{
          // input: "query total mint of doodles and azuki?",
        }}
        style={{
          maxWidth: 1000,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Please describe your question and you will get the answer."
          name="input"
          rules={[
             {
               required: true,
               message: "Please describe your question. e.g. how to query the price of SAND last 3 days",
             },
          ]}
        >
          <Input.TextArea placeholder="Your question" style={{ height: 160 }}/>
        </Form.Item>
        <div className="text-centered mt1 pt1">
          <Button type="primary" htmlType="submit" loading={loading}>Explore</Button>
        </div>
        {success && (
          <div className="mt2">The sql is already displayed in the middle sql edit box.</div>
        )}
        {error && (
          <div style={{ color: "red", lineHeight: "20px", margin: "12px 0" }}>
            {/*<h3>The result does not contain sql, please try again. </h3>*/}
            <span>{error}</span>
          </div>
        )}
        {/*{result && (
          <>
            <div>Outputs:</div>
            <div style={{ width: 250, height: 300, textAlign: "left", border: "1px white solid", lineHeight: 1.5, padding: 20, whiteSpace: "pre-wrap", overflow: "auto" }}>{result}</div>
            <div className="text-centered">
              <Button type="primary" onClick={() => {
                if (result) {
                  const nativeQuery = {
                    type: "native",
                    native: { query: result.replace(/;/g, "") },
                    database: databaseId,
                  };

                  updateQuestion(question.setDatasetQuery(nativeQuery));
                  window._editor && window._editor.focus();
                }
              }}>Sync to edit box</Button>
            </div>
          </>
        )}*/}
      </Form>
    </div>
  );
};

export default React.memo(SqlGPTContent);
