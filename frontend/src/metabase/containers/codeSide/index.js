/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { connect } from "react-redux";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/neat.css";
import "codemirror/mode/shell/shell.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/go/go.js";
import "codemirror/mode/clike/clike.js";
import "./index.css";
import Button from "metabase/components/Button";
import cx from "classnames";
import CopyToClipboard from "react-copy-to-clipboard";
import { message } from "antd";
import jsBeautify from "js-beautify";
import { querySql } from "metabase/new-service";

const CodeSide = ({ children }) => {
  const array = [
    {
      language: "shell",
      code:
        "curl --request GET \\\n" +
        "     --url https://api.footprint.network/api/v1/chain/list \\\n" +
        "     --header 'accept: application/json'",
      options: {
        mode: "shell",
        theme: "material",
        lineNumbers: true,
        readOnly: true,
      },
    },
    {
      language: "NodeJs",
      code:
        "const axios = require('axios');\n" +
        "\n" +
        'axios.post(\'https://api.chainbase.online/v1/dw/query\', {"query":"select * from ethereum.blocks"}, {\n' +
        "  headers: {\n" +
        "    'x-api-key': '2F6dQBgjblfEFRVbGgSsjFX83PI'\n" +
        "  }\n" +
        "});",
      options: {
        mode: "javascript",
        theme: "material",
        lineNumbers: true,
        readOnly: true,
      },
    },
    {
      language: "python",
      code:
        "import requests\n" +
        "\n" +
        'url = "https://api.chainbase.online/v1/dw/query"\n' +
        "\n" +
        'payload = {"query":"select * from ethereum.blocks"}\n' +
        "\n" +
        "headers = {\n" +
        '    "x-api-key": "2F6dQBgjblfEFRVbGgSsjFX83PI"\n' +
        "}\n" +
        "\n" +
        "response = requests.post(url, json=payload, headers=headers)\n" +
        "\n" +
        "print(response.text)\n",
      options: {
        mode: "python",
        theme: "material",
        lineNumbers: true,
        readOnly: true,
      },
    },
    {
      language: "go",
      code:
        "package main\n" +
        "\n" +
        "import (\n" +
        '\t"bytes"\n' +
        '\t"fmt"\n' +
        '\t"io/ioutil"\n' +
        '\t"net/http"\n' +
        ")\n" +
        "\n" +
        "func main() {\n" +
        "\n" +
        '\t_json := []byte(`{"query":"select * from ethereum.blocks"}`)\n' +
        "\tbody := bytes.NewBuffer(_json)\n" +
        "\n" +
        "\tclient := &http.Client{}\n" +
        "\n" +
        '\treq, err := http.NewRequest("POST", "https://api.chainbase.online/v1/dw/query", body)\n' +
        "\n" +
        '\treq.Header.Add("x-api-key", "2F6dQBgjblfEFRVbGgSsjFX83PI")\n' +
        "\n" +
        "\tresp, err := client.Do(req)\n" +
        "\n" +
        "\tif err != nil {\n" +
        '\t\tfmt.Println("Failure : ", err)\n' +
        "\t}\n" +
        "\n" +
        "\trespBody, _ := ioutil.ReadAll(resp.Body)\n" +
        "\n" +
        '\tfmt.Println("response Status : ", resp.Status)\n' +
        '\tfmt.Println("response Headers : ", resp.Header)\n' +
        '\tfmt.Println("response Body : ", string(respBody))\n' +
        "\n" +
        "}",
      options: {
        mode: "go",
        theme: "material",
        lineNumbers: true,
        readOnly: true,
      },
    },
    {
      language: "java",
      code:
        "OkHttpClient client = new OkHttpClient();\n" +
        "\n" +
        'MediaType mediaType = MediaType.parse("application/json");\n' +
        'RequestBody body = RequestBody.create(mediaType, "{\\"query\\":\\"select * from ethereum.blocks\\"}");\n' +
        "\n" +
        "Request request = new Request.Builder()\n" +
        '        .url("https://api.chainbase.online/v1/dw/query")\n' +
        "        .post(body)\n" +
        '        .addHeader("x-api-key", "2F6dQBgjblfEFRVbGgSsjFX83PI")\n' +
        "        .build();\n" +
        "\n" +
        "Response response = client.newCall(request).execute();",
      options: {
        mode: "clike",
        theme: "material",
        lineNumbers: true,
        readOnly: true,
      },
    },
  ];
  const [themeIndex, setThemeIndex] = useState(0);
  const [response, setResponse] = useState();

  const requestSql = async () => {
    const response = await querySql({
      type: "native",
      native: {
        query: "select * from `protocol_daily_stats` limit 10",
      },
      database: 3,
    });
    setResponse(response);
    console.log("response", response);
  };

  return (
    <div className="bg-gray">
      <div className="LanguageBox">
        <h3>Select Language</h3>
        <div className="LanguagePicker">
          {array.map((item, index) => {
            return (
              <div
                key={item.language}
                className={cx("LanguagePicker__item", {
                  "LanguagePicker__item-select": index === themeIndex,
                })}
                onClick={() => setThemeIndex(index)}
              >
                {item.language}
              </div>
            );
          })}
        </div>
      </div>
      <CodeMirror
        className="codeMirror"
        value={array[themeIndex].code}
        options={array[themeIndex].options}
        onChange={(editor, data, value) => {}}
      />
      <div>
        <CopyToClipboard
          text={array[themeIndex].code}
          onCopy={() => message.success("Copied!")}
        >
          <Button>Copy</Button>
        </CopyToClipboard>
        <Button
          onClick={() => {
            requestSql();
          }}
        >
          Try it
        </Button>
      </div>
      <CodeMirror
        className="codeMirror"
        value={response ? jsBeautify(JSON.stringify(response)) : response}
        options={{
          mode: "application/json",
          lineNumbers: true,
          readOnly: true,
        }}
        onChange={(editor, data, value) => {}}
      />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.currentUser,
  };
};

export default connect(mapStateToProps)(CodeSide);
