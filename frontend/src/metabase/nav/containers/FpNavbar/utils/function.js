/* eslint-disable react/prop-types */
/* eslint-disable react/forbid-component-props */
import React from "react";
import cx from "classnames";
import AboutImage from "metabase/containers/aboutV2/components/AboutImage";
import { getOssUrl } from "metabase/lib/image";
import Link from "../../../../core/components/Link";

const renderStandardShow = ({data, className}) => {
  if (!data) {
    return (<></>);
  }
  return (
    <Link
      className={cx("main-menu__vertical-menu-standard-show", className)}
      to={data?.link}
      target={data.externalLink ? "_blank" : null}
    >
      {data?.img && (<AboutImage src={data?.img} alt={data?.title}/>)}
      {data?.layout}
      <div className="main-menu__vertical-menu-standard-show-right">
        <h4>{data?.title}</h4>
        <span>{data?.desc}</span>
      </div>
    </Link>
  )
}

const renderVerticalMenu = ({data, className}) => {
  const title = data?.title;
  const desc = data?.desc;
  const topic = data?.topic;
  const link = data?.link;
  const icon = data?.icon;
  const externalLink = data?.externalLink;

  return (
    <div className={cx("main-menu__vertical-menu", className)}>
      {link ? (<Link
        className="main-menu__vertical-menu-link"
        to={link}
        target={externalLink ? "_blank" : null}
      >
        <div className="flex flex-column px1">
          <div className="flex align-center mb1">
            {icon && (<div className="main-menu__vertical-menu-icon mr1">{icon}</div>)}
            {topic && (<h3>{topic}</h3>)}
          </div>
          {title && (<h5>{title}</h5>)}
          {desc && (<h6>{desc}</h6>)}
        </div>
      </Link>) :
        <div className="flex flex-column px1">
          <div className="flex align-center mb1">
            {icon && (<div className="main-menu__vertical-menu-icon mr1">{icon}</div>)}
            {topic && (<h3>{topic}</h3>)}
          </div>
          {title && (<h5>{title}</h5>)}
          {desc && (<h6>{desc}</h6>)}
        </div>
      }
      <ul>
        {data?.data?.map(item => {
          return (
            <li key={item.title}>
              <Link
                className="flex cursor-pointer"
                to={item.link}
                target={item.externalLink ? "_blank" : null}
              >
                {item.icon && (<div className="main-menu__vertical-menu-icon">{item.icon}</div>)}
                <div className="main-menu__vertical-menu-right">
                  {item.title && (<h4>{item.title}</h4>)}
                  {item.desc && (<span className="main-menu__vertical-menu-desc">{item.desc}</span>)}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const renderVerticalMenuSimple = ({data, className}) => {
  const title = data?.title;
  const desc = data?.desc;
  const topic = data?.topic;
  const link = data?.link;
  const externalLink = data?.externalLink;

  return (
    <div className={cx("main-menu__vertical-menu main-menu__vertical-menu-simple", className)}>
      {link ? (<Link
        className="main-menu__vertical-menu-link"
        to={link}
        target={externalLink ? "_blank" : null}
      >
        <div className="flex flex-column px1">
          {topic && (<h3>{topic}</h3>)}
          {title && (<h5>{title}</h5>)}
          {desc && (<h6>{desc}</h6>)}
        </div>
      </Link>) :
        <div className="flex flex-column px1">
          {topic && (<h3>{topic}</h3>)}
          {title && (<h5>{title}</h5>)}
          {desc && (<h6>{desc}</h6>)}
        </div>
      }
      <ul>
        {data?.data?.map(item => {
          return (
            <li key={item.title}>
              <Link
                className="flex cursor-pointer"
                to={item.link}
                target={item.externalLink ? "_blank" : null}
              >
                {item.icon && (<div className="main-menu__vertical-menu-icon">{item.icon}</div>)}
                <div className="main-menu__vertical-menu-right">
                  {item.title && (<h4>{item.title}</h4>)}
                  {item.desc && (<span className="main-menu__vertical-menu-desc">{item.desc}</span>)}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const renderChainLayout = ({data, title, additionalView}) => {
  return (
    <div>
      <h3>{title}</h3>
      <ul>
        {data?.map(item => {
          return (
            <Link key={item.title} to={item.link} target={item.target || ""}>
              <li>
                <AboutImage src={item.img} alt={item.title} style={{ width: 36, height: 36 }} imageStyle={{ borderRadius: "50%" }}/>
                <h4>{item.title}</h4>
                <span>{item.desc}</span>
              </li>
            </Link>
          )
        })}
        {additionalView}
      </ul>
    </div>
  )
}

const renderStandardImageText = ({ data }) => {
  if (!data) {
    return null;
  }
  return (
    <div className="main-menu__inner-image-text">
      <AboutImage src={getOssUrl(data?.img)} alt={data?.title} />
      <span>{data?.title}</span>
    </div>
  )
}

export const MainMenuFunction = {
  renderChainLayout,
  renderStandardImageText,
  renderVerticalMenu,
  renderVerticalMenuSimple,
  renderStandardShow,
}

