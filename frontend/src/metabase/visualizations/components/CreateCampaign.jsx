/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Modal, Input, message, Button } from "antd";
import axios from "axios";
import Toggle from "metabase/core/components/Toggle";
import Icon from "metabase/components/Icon";
import {
  saveLatestGACampaigns,
  getLatestGACampaigns,
} from "metabase/growth/utils/utils";

const CreateCampaign = ({ state, style, propData }) => {
  const dashboardData = propData.dashboard;
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [channels, setChannels] = useState([
    {
      icon: "mail",
      name: `Email`,
      type: "email",
      enabled: true,
      field: {
        from_address:
          "Footprint Analytics <fp-alert-noreply@footprint.network>",
        subject: "You have a new message",
        message: "",
      },
    },
    {
      icon: "telegram",
      name: `Telegram`,
      type: "telegram",
      enabled: false,
      field: {
        message: "",
        telegram_bot_token: "",
        telegram_room_id: "",
      },
    },
    {
      icon: "discord",
      name: `Discord`,
      type: "discord",
      enabled: false,
      field: {
        message: "",
        discord_webhook_url: "",
      },
    },
  ]);

  const result = state?.series[0];
  const emailIndex = result?.data?.cols?.findIndex(
    f => f.display_name.toLowerCase() === "email",
  );
  const emailList = result?.data?.rows
    ?.map(f => f[emailIndex])
    ?.filter(f => !!f);
  console.log(result.data);
  console.log(emailList);

  const onSend = async () => {
    const current = channels.find(f => f.enabled);
    const content = current.field.message;
    const channel = current.type;

    const body = {
      subject: current.field.subject,
      message: content,
      channel,
      channel_config: {
        from_address: current.field.from_address,
        to_address: emailList,
        email_format: "html",
        cc: [],
        bcc: [],
        reply_to: "",
        smtp_host: "smtp.gmail.com",
        smtp_port: 465,
        smtp_ssl: true,
      },
      source: "footprint frontend",
    };

    switch (channel) {
      case "telegram":
        body.channel_config = {
          telegram_bot_token: current.field.telegram_bot_token,
          telegram_room_id: current.field.telegram_room_id,
          telegram_api_url: "api.telegram.org",
          telegram_parse_mode: "html",
        };
        break;
      case "discord":
        body.channel_config = {
          discord_webhook_url: current.field.discord_webhook_url,
        };
        break;
      default:
        break;
    }

    const hide = message.loading("Sending... ", 0);
    setIsNotificationModalOpen(false);
    console.log(body);
    const pre_datas = getLatestGACampaigns();
    pre_datas.push(body);
    saveLatestGACampaigns(pre_datas);
    // await axios.post(
    //   "https://app.internal.footprint.network/api/v0/task/notify",
    //   body,
    // );
    setTimeout(() => {
      hide();
      message.success("Send successfully");
    }, 1000);
  };

  return (
    <>
      <Button
        type="primary"
        style={style}
        onClick={() => setIsNotificationModalOpen(true)}
      >
        Send Email/Telegram/Discord
      </Button>
      <Modal
        open={isNotificationModalOpen}
        onCancel={() => setIsNotificationModalOpen(false)}
        onOk={onSend}
        okText="Send"
        closable={false}
        title="Where do you want to send?"
      >
        <h3>You have selected {emailList.length} users.</h3>
        <div className="mt2" />
        <ul className="bordered rounded bg-white">
          {channels.map(channel => (
            <li key={channel.type} className="border-row-divider">
              <div className="flex align-center p2 border-row-divider">
                <Icon
                  className="mr1 text-light"
                  name={channel.icon}
                  size={24}
                />
                <h3>{channel.name}</h3>
                <Toggle
                  className="flex-align-right"
                  value={channel.enabled}
                  onChange={() => {
                    setChannels(prev => {
                      return prev.map(item => {
                        if (item.name === channel.name) {
                          item.enabled = !item.enabled;
                        } else {
                          item.enabled = false;
                        }
                        return item;
                      });
                    });
                  }}
                />
              </div>
              {channel.enabled && (
                <ul className="bg-light px3">
                  <li key={channel.type} className="py2">
                    {channel.type === "email" ? (
                      <>
                        <h4>Message Title</h4>
                        <div className="mt2" />
                        <Input
                          size="large"
                          placeholder={channel.field.subject}
                          value={channel.field.subject}
                          onChange={e => {
                            setChannels(prev => {
                              return prev.map(f => {
                                if (f.name === channel.name) {
                                  f.field.subject = e.target.value;
                                }
                                return f;
                              });
                            });
                          }}
                        />
                        <div className="mt2" />
                        <h4>From</h4>
                        <div className="mt2" />
                        <Input
                          size="large"
                          placeholder={channel.field.from_address}
                          value={channel.field.from_address}
                          onChange={e => {
                            setChannels(prev => {
                              return prev.map(f => {
                                if (f.name === channel.name) {
                                  f.field.from_address = e.target.value;
                                }
                                return f;
                              });
                            });
                          }}
                        />
                        <div className="mt2" />
                      </>
                    ) : null}
                    <h4>Message Content</h4>
                    <div className="mt2" />
                    <Input.TextArea
                      size="large"
                      rows={5}
                      placeholder={"Hi, this is..."}
                      value={channel.field.message}
                      onChange={e => {
                        setChannels(prev => {
                          return prev.map(f => {
                            if (f.name === channel.name) {
                              f.field.message = e.target.value;
                            }
                            return f;
                          });
                        });
                      }}
                    />
                    <div className="mt2" />
                    {channel.type === "telegram" ? (
                      <>
                        <h4>Bot Token</h4>
                        <div className="mt2" />
                        <Input
                          size="large"
                          placeholder={"0000000000:xxxxxxxxxx..."}
                          value={channel.field.telegram_bot_token}
                          onChange={e => {
                            setChannels(prev => {
                              return prev.map(f => {
                                if (f.name === channel.name) {
                                  f.field.telegram_bot_token = e.target.value;
                                }
                                return f;
                              });
                            });
                          }}
                        />
                        <div className="mt2" />
                        <h4>Room ID</h4>
                        <div className="mt2" />
                        <Input
                          size="large"
                          placeholder={"-1000000000000"}
                          value={channel.field.telegram_room_id}
                          onChange={e => {
                            setChannels(prev => {
                              return prev.map(f => {
                                if (f.name === channel.name) {
                                  f.field.telegram_room_id = e.target.value;
                                }
                                return f;
                              });
                            });
                          }}
                        />
                      </>
                    ) : null}
                    {channel.type === "discord" ? (
                      <>
                        <h4>Webhook URL</h4>
                        <div className="mt2" />
                        <Input
                          size="large"
                          placeholder={
                            "https://discord.com/api/webhooks/******"
                          }
                          value={channel.field.discord_webhook_url}
                          onChange={e => {
                            setChannels(prev => {
                              return prev.map(f => {
                                if (f.name === channel.name) {
                                  f.field.discord_webhook_url = e.target.value;
                                }
                                return f;
                              });
                            });
                          }}
                        />
                      </>
                    ) : null}
                  </li>
                </ul>
              )}
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
};

export default CreateCampaign;
