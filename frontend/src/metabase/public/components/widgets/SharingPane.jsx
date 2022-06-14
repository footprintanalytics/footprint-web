import React, { Component } from "react";
import { t } from "ttag";
import Icon from "metabase/components/Icon";
import Toggle from "metabase/components/Toggle";
import CopyWidget from "metabase/components/CopyWidget";
import Confirm from "metabase/components/Confirm";

import { getPublicEmbedHTML } from "metabase/public/lib/code";

import cx from "classnames";

import type { EmbedType } from "./EmbedModalContent";
import type { EmbeddableResource } from "metabase/public/lib/types";

import ShareButton from "./ShareButton";
import NeedPermissionModal from "metabase/components/NeedPermissionModal";
import CopyShortLink from "metabase/components/CopyShortLink";
import Button from "metabase/components/Button";
import Tooltip from "metabase/components/Tooltip";
import { Flex } from "grid-styled";
import { trackStructEvent } from "metabase/lib/analytics";
import { isDefi360 } from "metabase/lib/project_info";

type Props = {
  resourceType: string,
  resource: EmbeddableResource,
  extensions?: string[],
  onlyEmbed?: boolean,

  isAdmin: boolean,
  user: Object,
  sharePage: string,

  isPublicSharingEnabled: boolean,
  isApplicationEmbeddingEnabled: boolean,

  onCreatePublicLink: () => Promise<void>,
  onDisablePublicLink: () => Promise<void>,
  getPublicUrl: (resource: EmbeddableResource, extension: ?string) => string,
  getGuestUrl: (resource: EmbeddableResource, extension: ?string) => string,
  onChangeEmbedType: (embedType: EmbedType) => void,

  isShowCancelWatermarkSwitch: boolean,
  cancelWatermarkCheckChange: () => {},
  cancelWatermarkEnabled: () => {},
};

type State = {
  extension: ?string,
};

export default class SharingPane extends Component {
  props: Props;
  state: State = {
    extension: null,
    showVip: false,
  };

  static defaultProps = {
    extensions: [],
  };

  render() {
    const {
      resource,
      resourceType,
      onCreatePublicLink,
      onDisablePublicLink,
      // extensions,
      getGuestUrl,
      getPublicUrl,
      onChangeEmbedType,
      isAdmin,
      user,
      isPublicSharingEnabled,
      isApplicationEmbeddingEnabled,
      sharePage,
      onlyEmbed,
      // isShowCancelWatermarkSwitch,
      // cancelWatermarkCheckChange,
      // cancelWatermarkEnabled,
    } = this.props;

    const guestUrl = getGuestUrl && getGuestUrl(resource, this.state.extension);
    const iframeSource = getPublicEmbedHTML(getPublicUrl(resource));
    const shareUrl = guestUrl;
    const shareTitle = `Footprint - ${resource.name || ""}`;
    // const shareDesc = resource.description || shareUrl;
    // const shareImage = getOssUrl("Footprint.png");
    const shareSource = "Footprint";
    const shareTag = ["Footprint", "DeFi", "Blockchain"];

    const isPaidUser = user && user.vipInfo && user.vipInfo.type !== "free";
    const isMarket = user && user.isMarket;

    const renderModal = context => {
      return (
        context.state.showVip && (
          <NeedPermissionModal
            title="Upgrade your account to set your dashboard/chart to private"
            onClose={() => context.setState({ showVip: false })}
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

    return (
      <div className="pt2 ml-auto mr-auto" style={{ maxWidth: 600 }}>
        {renderModal(this)}
        {!onlyEmbed && (
          <>
            {isPublicSharingEnabled && (
              <div className="pb2 mb4 border-bottom flex align-center">
                <Flex alignItems="center">
                  <h4>{t`Set to private`}</h4>
                  <Tooltip tooltip="Once private is set, your dashboard will not appear on Explore. You can not share the public link with others either.">
                    <Icon name="question" style={{ marginLeft: 10 }} />
                  </Tooltip>
                </Flex>
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
                          if (isAdmin || isPaidUser || isDefi360()) {
                            return;
                          }
                          e.stopPropagation();
                          this.setState({ showVip: true });
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
                      <div
                        onClick={e => {
                          handleGa();
                          if (isAdmin || isPaidUser || isDefi360()) {
                            return;
                          }
                          e.stopPropagation();
                          this.setState({ showVip: true });
                        }}
                      />
                    </Toggle>
                  )}
                </div>
              </div>
            )}
            {(isMarket || isAdmin) && (
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
            )}
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
              className={cx("mb4 flex align-center", {
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
    );
  }
}
