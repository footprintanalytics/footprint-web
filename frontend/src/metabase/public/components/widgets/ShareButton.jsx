import React, { Component } from "react";
import * as Share from "react-share";

type Props = {
  shareUrl: string,
  shareTitle: string,
  // shareDesc: string,
  // shareImage: string,
  shareSource: string,
  shareTag: string[],
};

export default class ShareButton extends Component {
  props: Props;

  render() {
    const {
      shareUrl,
      shareTitle,
      // shareDesc,
      // shareImage,
      shareSource,
      shareTag,
    } = this.props;

    return (
      <ul className="ShareButton">
        <li title="Facebook">
          <Share.FacebookShareButton
            url={shareUrl}
            quote={shareTitle}
            hashtag={"#" + shareTag[0]}
          >
            <Share.FacebookIcon size={32} round />
          </Share.FacebookShareButton>
        </li>
        <li title="Twitter">
          <Share.TwitterShareButton
            url={shareUrl}
            title={shareTitle}
            hashtags={shareTag}
            via={"Footprint_DeFi"}
            related={["Footprint_DeFi"]}
          >
            <Share.TwitterIcon size={32} round />
          </Share.TwitterShareButton>
        </li>
        <li title="Telegram">
          <Share.TelegramShareButton url={shareUrl} title={shareTitle}>
            <Share.TelegramIcon size={32} round />
          </Share.TelegramShareButton>
        </li>
        <li title="LinkedIn">
          <Share.LinkedinShareButton
            url={shareUrl}
            title={shareTitle}
            summary={shareUrl}
            source={shareSource}
          >
            <Share.LinkedinIcon size={32} round />
          </Share.LinkedinShareButton>
        </li>
        {/* <li title="WhatsApp">
          <Share.WhatsappShareButton url={shareUrl} title={shareTitle}>
            <Share.WhatsappIcon size={32} round />
          </Share.WhatsappShareButton>
        </li>
        <li title="Pinterest">
          <Share.PinterestShareButton
            url={shareUrl}
            media={shareImage}
            description={shareDesc}
          >
            <Share.PinterestIcon size={32} round />
          </Share.PinterestShareButton>
        </li>
        <li title="VK">
          <Share.VKShareButton
            url={shareUrl}
            title={shareTitle}
            image={shareImage}
          >
            <Share.VKIcon size={32} round />
          </Share.VKShareButton>
        </li>
        <li title="OK">
          <Share.OKShareButton
            url={shareUrl}
            image={shareImage}
            description={shareDesc}
          >
            <Share.OKIcon size={32} round />
          </Share.OKShareButton>
        </li>
        <li title="Reddit">
          <Share.RedditShareButton url={shareUrl} title={shareTitle}>
            <Share.RedditIcon size={32} round />
          </Share.RedditShareButton>
        </li>
        <li title="Tumblr">
          <Share.TumblrShareButton
            url={shareUrl}
            title={shareTitle}
            tags={shareTag}
            caption={shareDesc}
            posttype="link"
          >
            <Share.TumblrIcon size={32} round />
          </Share.TumblrShareButton>
        </li>
        <li title="LiveJournal">
          <Share.LivejournalShareButton
            url={shareUrl}
            title={shareTitle}
            description={shareDesc}
          >
            <Share.LivejournalIcon size={32} round />
          </Share.LivejournalShareButton>
        </li>
        <li title="Mail.ru">
          <Share.MailruShareButton
            url={shareUrl}
            title={shareTitle}
            description={shareDesc}
            imageUrl={shareImage}
          >
            <Share.MailruIcon size={32} round />
          </Share.MailruShareButton>
        </li>
        <li title="Email">
          <Share.EmailShareButton
            url={shareUrl}
            subject={shareTitle}
            body={shareUrl}
          >
            <Share.EmailIcon size={32} round />
          </Share.EmailShareButton>
        </li>
        <li title="Viber">
          <Share.ViberShareButton url={shareUrl} title={shareTitle}>
            <Share.ViberIcon size={32} round />
          </Share.ViberShareButton>
        </li>
        <li title="Workplace">
          <Share.WorkplaceShareButton
            url={shareUrl}
            quote={shareTitle}
            hashtag={"#" + shareTag[0]}
          >
            <Share.WorkplaceIcon size={32} round />
          </Share.WorkplaceShareButton>
        </li>
        <li title="Line">
          <Share.LineShareButton url={shareUrl} title={shareTitle}>
            <Share.LineIcon size={32} round />
          </Share.LineShareButton>
        </li>
        <li title="Weibo">
          <Share.WeiboShareButton
            url={shareUrl}
            title={shareTitle}
            image={shareImage}
          >
            <Share.WeiboIcon size={32} round />
          </Share.WeiboShareButton>
        </li>
        <li title="Pocket">
          <Share.PocketShareButton url={shareUrl} title={shareTitle}>
            <Share.PocketIcon size={32} round />
          </Share.PocketShareButton>
        </li>
        <li title="Instapaper">
          <Share.InstapaperShareButton
            url={shareUrl}
            title={shareTitle}
            description={shareDesc}
          >
            <Share.InstapaperIcon size={32} round />
          </Share.InstapaperShareButton>
        </li>
        <li title="Hatena">
          <Share.HatenaShareButton url={shareUrl} title={shareTitle}>
            <Share.HatenaIcon size={32} round />
          </Share.HatenaShareButton>
        </li> */}
      </ul>
    );
  }
}
