/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Card, Result, Form, Input } from "antd";

const ConfigEmail = () => {
  // const [channel, setChannels] = useState();
  return (
    <div
      className="flex flex-col w-full bg-light p2"
      style={{
        alignItems: "left",
      }}
    >
      <div className="mt1" />
      <h4>Message Title</h4>
      <div className="mt1" />
      <Form.Item
        rules={[{ required: true }]}
        name={"emailTitle"}
        wrapperCol={{
          span: 24,
        }}
      >
        <Input
          size="large"
          // placeholder={channel.field.subject}
          // value={channel.field.subject}
          onChange={e => {
            // setChannels(prev => {
            //   return prev.map(f => {
            //     if (f.name === channel.name) {
            //       f.field.subject = e.target.value;
            //     }
            //     return f;
            //   });
            // });
          }}
        />
      </Form.Item>
      {/* <div className="mt1" /> */}
      {/* <h4>From</h4>
      <div className="mt1" />
      <Input
        size="large"
        // placeholder={channel.field.from_address}
        // value={channel.field.from_address}
        onChange={e => {
          // setChannels(prev => {
          //   return prev.map(f => {
          //     if (f.name === channel.name) {
          //       f.field.from_address = e.target.value;
          //     }
          //     return f;
          //   });
          // });
        }}
      /> */}
      <h4>Message Content</h4>
      <div className="mt1" />
      <Form.Item
        name={"emailContent"}
        rules={[{ required: true }]}
        wrapperCol={{
          span: 24,
        }}
      >
        <Input.TextArea
          size="large"
          rows={5}
          placeholder={"Hi, this is..."}
          // value={channel.field.message}
          onChange={e => {
            // setChannels(prev => {
            //   return prev.map(f => {
            //     if (f.name === channel.name) {
            //       f.field.message = e.target.value;
            //     }
            //     return f;
            //   });
            // });
          }}
        />
      </Form.Item>
    </div>
  );
};

export default ConfigEmail;
