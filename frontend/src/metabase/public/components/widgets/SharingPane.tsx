import React, { ReactNode, useState } from "react";
import { t, jt } from "ttag";
import cx from "classnames";
import Button from "metabase/core/components/Button";
import Icon from "metabase/components/Icon";
import Toggle from "metabase/core/components/Toggle";
import CopyWidget from "metabase/components/CopyWidget";
import Confirm from "metabase/components/Confirm";

import { getPublicEmbedHTML } from "metabase/public/lib/code";
import CopyShortLink from "metabase/components/CopyShortLink";
import NeedPermissionModal from "metabase/components/NeedPermissionModal";
import { trackStructEvent } from "metabase/lib/analytics";
import Tooltip from "metabase/components/Tooltip";
import ShareButton from "./ShareButton";
import * as Urls from "metabase/lib/urls";

import * as MetabaseAnalytics from "metabase/lib/analytics";
import {
  Description,
  EmbedWidgetHeader,
  Header,
  IconContainer,
  PublicEmbedHeader,
  PublicLinkHeader,
} from "./SharingPane.styled";
import copy from "copy-to-clipboard";
import { message } from "antd";

type Resource = {
  dashboard?: number;
  question?: number;
  public_uuid?: string;
  name?: string;
};

type Extension = string | null;

interface SharingPaneProps {
  resource: Resource;
  resourceType: string;
  onCreatePublicLink: () => void;
  onDisablePublicLink: () => void;
  extensions: string[];
  getPublicUrl: (resource: Resource, extension?: Extension) => void;
  onChangeEmbedType: (embedType: string) => void;
  isAdmin: boolean;
  isPublicSharingEnabled: boolean;
  isApplicationEmbeddingEnabled: boolean;
  user: any;
  getGuestUrl: any;
  sharePage: () => void;
  onlyEmbed: boolean;
  iframeHeight: number;
  iframeWidth: number;
}

export default function SharingPane({
  resource,
  resourceType,
  onCreatePublicLink,
  onDisablePublicLink,
  extensions = [],
  getPublicUrl,
  onChangeEmbedType,
  isAdmin,
  isPublicSharingEnabled,
  isApplicationEmbeddingEnabled,
  user,
  getGuestUrl,
  sharePage,
  onlyEmbed,
  iframeHeight,
  iframeWidth,
}: SharingPaneProps) {
  const [extensionState, setExtension] = useState<Extension>(null);
  const [showVip, setShowVip] = useState(false);
  const inputRef: any = React.createRef();

  const guestUrl = getGuestUrl(resource, extensionState);
  const iframeSource = getPublicEmbedHTML({iframeUrl: getPublicUrl(resource), height: iframeHeight, width: iframeWidth});

  const shouldDisableEmbedding = !isAdmin || !isApplicationEmbeddingEnabled;
  const shareUrl = guestUrl;
  const shareTitle = `Footprint - ${resource.name || ""}`;

  const shareSource = "Footprint";
  const shareTag = ["Footprint", "DeFi", "Blockchain"];

  const isPaidUser = user && user.vipInfo && user.vipInfo.type !== "free";
  const isMarket = user && user.isMarket;

  const embeddingHelperText = getEmbeddingHelperText({
    isAdmin,
    isApplicationEmbeddingEnabled,
  });

  const renderModal = () => {
    return (
      showVip && (
        <NeedPermissionModal
          title="Upgrade your account to set your dashboard/chart to private"
          onClose={() => setShowVip(false)}
        />
      )
    );
  };

  const handleGa = () => {
    if (sharePage) {
      if (isAdmin) {
        trackStructEvent(`click ${sharePage}-click-toggle-isAdmin`);
      } else if (isPaidUser) {
        trackStructEvent(`click ${sharePage}-click-toggle-isPaidUser`);
      } else {
        trackStructEvent(`click ${sharePage}-click-toggle-free`);
      }
    }
  };

  const copyChannelUrl = () => {
    const channel = inputRef.current.value.trim();
    let separator = "";
    const url = shareUrl;
    if (!url.includes("?")) {
      separator = "?";
    } else if (!url.endsWith("?") && !url.endsWith("&")){
      separator = "&";
    }
    const channelStr = channel.length > 0 ? `channel=${channel}` : "";
    const channelGuestUrl = `${url}${separator}${channelStr}`;
    copy(channelGuestUrl || "");
    message.success("Copy channel link success！");
  }

  return (
    <div className="pt2 ml-auto mr-auto" style={{ maxWidth: 600 }}>
      {renderModal()}
      {!onlyEmbed && (
        <>
          {isPublicSharingEnabled && (
            <div className="pb2 mb4 border-bottom flex align-center">
              <div className="flex align-center">
                <h4>{t`Set to private`}</h4>
                <Tooltip tooltip="Once private is set, your dashboard will not appear on Explore. You can not share the public link with others either.">
                  <Icon name="question" style={{ marginLeft: 10 }} />
                </Tooltip>
              </div>
              <div className="ml-auto">
                {resource.public_uuid ? (
                  <Confirm
                    title={t`Disable this public link?`}
                    content={t`This will cause the existing link to stop working. You can re-enable it, but when you do it will be a different link.`}
                    action={() => {
                      trackStructEvent(
                        "Sharing Modal",
                        "Public Link Disabled",
                        resourceType,
                      );
                      onDisablePublicLink();
                    }}
                  >
                    <div
                      onClick={e => {
                        handleGa();
                        if (isAdmin || isPaidUser) {
                          return;
                        }
                        e.stopPropagation();
                        setShowVip(true)
                      }}
                    >
                      <Toggle value={false} />
                    </div>
                  </Confirm>
                ) : (
                  <Toggle
                    value={true}
                    onChange={() => {
                      trackStructEvent(
                        "Sharing Modal",
                        "Public Link Enabled",
                        resourceType,
                      );
                      onCreatePublicLink();
                    }}
                  >
                    {/*<div*/}
                    {/*  onClick={e => {*/}
                    {/*    handleGa();*/}
                    {/*    if (isAdmin || isPaidUser) {*/}
                    {/*      return;*/}
                    {/*    }*/}
                    {/*    e.stopPropagation();*/}
                    {/*    setShowVip(true);*/}
                    {/*  }}*/}
                    {/*/>*/}
                  </Toggle>
                )}
              </div>
            </div>
          )}
          {(isMarket || isAdmin) && (
            <div className="flex justify-between border-bottom pb2">
              <input className="Button mr1" ref={inputRef} placeholder="Dashboard channel" />
              <Button onClick={copyChannelUrl}>
                create channel link
              </Button>
            </div>
          )}
          {/*{(isMarket || isAdmin) && (
            <div className="pb2 mb4 border-bottom flex align-center">
              <h4>{t`Create short link`}</h4>
              <div className="ml-auto">
                <CopyShortLink url={guestUrl}>
                  <Button
                    className="ml1 Question-header-btn-with-text"
                    iconColor="#ffffff"
                    icon="shortLink"
                    iconSize={16}
                    primary={true}
                    color={"#ffffff"}
                  />
                </CopyShortLink>
              </div>
            </div>
          )}*/}
          {/*{isShowCancelWatermarkSwitch && (
          <div className="pb2 mb4 border-bottom flex align-center">
            <h4>{t`Remove watermark`}</h4>
            <div className="ml-auto">
              <Toggle
                value={cancelWatermarkEnabled}
                onChange={check => {
                  cancelWatermarkCheckChange &&
                    cancelWatermarkCheckChange(check);
                }}
              ></Toggle>
            </div>
          </div>
        )}*/}
          <div
            className={cx("mt2 mb4 flex align-center", {
              disabled: !resource.public_uuid,
            })}
          >
            <div
              style={{ width: 98, height: 63 }}
              className="bordered rounded shadowed flex layout-centered"
            >
              <Icon name="link" size={32} />
            </div>
            <div className="ml2">
              <h3 className="text-brand mb1">{t`Public link`}</h3>
              <div className="mb1">{t`Share this ${resourceType} with people who don't have a Footprint account using the URL below:`}</div>
              <CopyWidget value={guestUrl} readOnly={true} />
              {/* {extensions && extensions.length > 0 && (
              <div className="mt1">
                {extensions.map(extension => (
                  <span
                    key={extension}
                    className={cx(
                      "cursor-pointer text-brand-hover text-bold text-uppercase",
                      extension === this.state.extension
                        ? "text-brand"
                        : "text-light",
                    )}
                    onClick={() =>
                      this.setState({
                        extension:
                          extension === this.state.extension ? null : extension,
                      })
                    }
                  >
                    {extension}{" "}
                  </span>
                ))}
              </div>
            )} */}
            </div>
          </div>
        </>
      )}
      <div
        className={cx("mb4 flex align-center", {
          disabled: !resource.public_uuid,
        })}
      >
        <img
          width={98}
          src="app/assets/img/simple_embed.png"
          srcSet="
              app/assets/img/simple_embed.png     1x,
              app/assets/img/simple_embed@2x.png  2x
            "
        />
        <div className="ml2">
          <h3 className="text-green mb1">{t`Public embed`}</h3>
          <div className="mb1">{t`Embed this ${resourceType} in blog posts or web pages by copying and pasting this snippet:`}</div>
          <CopyWidget value={iframeSource} readOnly={true} />
        </div>
      </div>
      {isAdmin && isApplicationEmbeddingEnabled && (
        <div
          className={cx("mb4 flex align-center cursor-pointer", {
            disabled: !isApplicationEmbeddingEnabled,
          })}
          onClick={() => onChangeEmbedType("application")}
        >
          <img
            width={100}
            src="app/assets/img/secure_embed.png"
            srcSet="
                app/assets/img/secure_embed.png     1x,
                app/assets/img/secure_embed@2x.png  2x
              "
          />
          <div className="ml2">
            <h3 className="text-purple mb1">{t`Embed this ${resourceType} in an application`}</h3>
            <div className="">{t`By integrating with your application server code, you can provide a secure stats ${resourceType} limited to a specific user, customer, organization, etc.`}</div>
          </div>
        </div>
      )}
      {!onlyEmbed && resource.public_uuid && (
        <ShareButton
          shareUrl={shareUrl}
          shareTitle={shareTitle}
          // shareDesc={shareDesc}
          // shareImage={shareImage}
          shareSource={shareSource}
          shareTag={shareTag}
        />
      )}
    </div>
    /*<div className="pt2 ml-auto mr-auto" style={{ maxWidth: 600 }}>
      {isAdmin && isPublicSharingEnabled && (
        <div className="px4 py3 mb4 bordered rounded flex align-center">
          <Header>{t`Enable sharing`}</Header>
          <div className="ml-auto">
            {resource.public_uuid ? (
              <Confirm
                title={t`Disable this public link?`}
                content={t`This will cause the existing link to stop working. You can re-enable it, but when you do it will be a different link.`}
                action={() => {
                  MetabaseAnalytics.trackStructEvent(
                    "Sharing Modal",
                    "Public Link Disabled",
                    resourceType,
                  );
                  onDisablePublicLink();
                }}
              >
                <Toggle value={true} />
              </Confirm>
            ) : (
              <Toggle
                value={false}
                onChange={() => {
                  MetabaseAnalytics.trackStructEvent(
                    "Sharing Modal",
                    "Public Link Enabled",
                    resourceType,
                  );
                  onCreatePublicLink();
                }}
              />
            )}
          </div>
        </div>
      )}

      <SharingOption
        className={cx("border-bottom", {
          disabled: !resource.public_uuid,
        })}
        illustration={
          <IconContainer>
            <Icon name="link" size={32} />
          </IconContainer>
        }
      >
        <PublicLinkHeader>{t`Public link`}</PublicLinkHeader>
        <Description className="mb1">{t`Share this ${resourceType} with people who don't have a Metabase account using the URL below:`}</Description>
        <CopyWidget value={publicLink} />
        {extensions && extensions.length > 0 && (
          <div className="mt1">
            {extensions.map(extension => (
              <span
                key={extension}
                className={cx(
                  "cursor-pointer text-brand-hover text-bold text-uppercase",
                  extension === extensionState ? "text-brand" : "text-light",
                )}
                onClick={() =>
                  setExtension(extensionState =>
                    extension === extensionState ? null : extension,
                  )
                }
              >
                {extension}{" "}
              </span>
            ))}
          </div>
        )}
      </SharingOption>

      <SharingOption
        className={cx("border-bottom", {
          disabled: !resource.public_uuid,
        })}
        illustration={
          <ResponsiveImage imageUrl="app/assets/img/simple_embed.png" />
        }
      >
        <PublicEmbedHeader>{t`Public embed`}</PublicEmbedHeader>
        <Description className="mb1">{t`Embed this ${resourceType} in blog posts or web pages by copying and pasting this snippet:`}</Description>
        <CopyWidget value={iframeSource} />
      </SharingOption>

      <SharingOption
        className={cx({
          disabled: shouldDisableEmbedding,
          "cursor-pointer": !shouldDisableEmbedding,
        })}
        illustration={
          <ResponsiveImage imageUrl="app/assets/img/secure_embed.png" />
        }
        onClick={() => {
          if (!shouldDisableEmbedding) {
            onChangeEmbedType("application");
          }
        }}
      >
        <EmbedWidgetHeader>{t`Embed in your application`}</EmbedWidgetHeader>
        <Description>{t`Add this ${resourceType} to your application server code. You’ll be able to preview the way it looks and behaves before making it securely visible for your users.`}</Description>
        {embeddingHelperText && (
          <Description enableMouseEvents>{embeddingHelperText}</Description>
        )}
        <Button primary>{t`Set up`}</Button>
      </SharingOption>
    </div>*/
  );
}

interface SharingOptionProps {
  className: string;
  onClick?: () => void;
  illustration: ReactNode;
  children: ReactNode;
}

function SharingOption({
  className,
  onClick,
  illustration,
  children,
}: SharingOptionProps) {
  return (
    <div
      className={cx("pt1 pb4 mb3 flex align-start", className)}
      onClick={onClick}
    >
      {illustration}
      <div className="ml2">{children}</div>
    </div>
  );
}

function ResponsiveImage({ imageUrl }: { imageUrl: string }) {
  return <img width={100} src={imageUrl} srcSet={getSrcSet(imageUrl)} />;
}

const imageRegExp = /(?<baseUrl>.*)(?<extension>\.[A-z]{3,4})/;
function getSrcSet(imageUrl: string) {
  const { baseUrl, extension } = imageRegExp.exec(imageUrl)?.groups as {
    baseUrl: string;
    extension: string;
  };

  return `${baseUrl}${extension} 1x, ${baseUrl}@2x${extension} 2x`;
}

function getEmbeddingHelperText({
  isAdmin,
  isApplicationEmbeddingEnabled,
}: {
  isAdmin: boolean;
  isApplicationEmbeddingEnabled: boolean;
}) {
  if (!isAdmin) {
    return t`Only Admins are able to embed questions. If you need access to this feature, reach out to them for permissions.`;
  }

  if (!isApplicationEmbeddingEnabled && isAdmin) {
    return jt`In order to embed your question, you have to first ${(
      <a
        className="link"
        href="/admin/settings/embedding-in-other-applications"
      >
        enable embedding in your Admin settings.
      </a>
    )}`;
  }

  return null;
}
