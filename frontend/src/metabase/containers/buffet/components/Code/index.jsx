/* eslint-disable react/prop-types */
import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/ext-language_tools";

const Code = ({ value }) => {
  return (
    <AceEditor
      readOnly
      style={{ marginTop: 48 }}
      width="100%"
      maxLines={Infinity}
      mode="python"
      theme="terminal"
      fontSize={14}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={value}
      setOptions={{
        showLineNumbers: true,
        tabSize: 4,
      }}
    />
  );
};

export default Code;
