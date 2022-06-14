/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Box } from "grid-styled";
import { t } from "ttag";
import { getScrollY } from "metabase/lib/dom";
import EditBar from "metabase/components/EditBar";
import EditWarning from "metabase/components/EditWarning";
import HeaderModal from "metabase/components/HeaderModal";
import TitleAndDescription from "metabase/components/TitleAndDescription";
import Button from "metabase/components/Button";
import { trackStructEvent } from "../lib/analytics";
import "./Header.css";
import { IconBack } from "./IconBack";

const propTypes = {
  analyticsContext: PropTypes.string,
  editingTitle: PropTypes.string,
  editingSubtitle: PropTypes.string,
  editingButtons: PropTypes.arrayOf(PropTypes.node),
  editWarning: PropTypes.string,
  headerButtons: PropTypes.arrayOf(PropTypes.node),
  headerClassName: PropTypes.string,
  headerModalMessage: PropTypes.string,
  isEditing: PropTypes.bool,
  isEditingInfo: PropTypes.bool,
  item: PropTypes.object.isRequired,
  objectType: PropTypes.string.isRequired,
  hasBadge: PropTypes.bool,
  children: PropTypes.node,
  setItemAttributeFn: PropTypes.func,
  onHeaderModalDone: PropTypes.func,
  onHeaderModalCancel: PropTypes.func,
  router: PropTypes.object.isRequired,
  titleRightPanel: PropTypes.node,
};

const defaultProps = {
  headerButtons: [],
  editingTitle: "",
  editingSubtitle: "",
  editingButtons: [],
  headerClassName: "py1 lg-py2 xl-py3 wrapper",
};

class Header extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      headerHeight: 0,
    };
    this.header = React.createRef();
  }

  componentDidMount() {
    this.updateHeaderHeight();
  }

  componentDidUpdate() {
    const modalIsOpen = !!this.props.headerModalMessage;
    if (modalIsOpen) {
      this.updateHeaderHeight();
    }
  }

  updateHeaderHeight() {
    if (!this.header.current) {
      return;
    }

    const rect = this.header.current.getBoundingClientRect();
    const headerHeight = rect.top + getScrollY();
    if (this.state.headerHeight !== headerHeight) {
      this.setState({ headerHeight });
    }
  }

  setItemAttribute(attribute, event) {
    this.props.setItemAttributeFn(attribute, event.target.value);
  }

  renderEditHeader() {
    if (this.props.isEditing) {
      return (
        <EditBar
          title={this.props.editingTitle}
          subtitle={this.props.editingSubtitle}
          buttons={this.props.editingButtons}
          style={{ marginTop: -14, marginBottom: 14 }}
        />
      );
    }
  }

  renderEditWarning() {
    if (this.props.editWarning) {
      return <EditWarning title={this.props.editWarning} />;
    }
  }

  renderHeaderModal() {
    return (
      <HeaderModal
        isOpen={!!this.props.headerModalMessage}
        height={this.state.headerHeight}
        title={this.props.headerModalMessage}
        onDone={this.props.onHeaderModalDone}
        onCancel={this.props.onHeaderModalCancel}
      />
    );
  }

  render() {
    const { router, titleRightPanel } = this.props;

    let titleAndDescription;
    if (this.props.item && this.props.item.id != null) {
      titleAndDescription = (
        <TitleAndDescription
          title={this.props.item.name}
          description={this.props.item.description}
        />
      );
    } else {
      titleAndDescription = (
        <TitleAndDescription
          title={t`New ${this.props.objectType}`}
          description={this.props.item.description}
        />
      );
    }

    const headerButtons = this.props.headerButtons.map(
      (section, sectionIndex) => {
        return (
          section &&
          section.length > 0 && (
            <span
              key={sectionIndex}
              className="Header-buttonSection flex align-center"
            >
              {section.map((button, buttonIndex) => (
                <span key={buttonIndex}>{button}</span>
              ))}
            </span>
          )
        );
      },
    );

    return (
      <div className="flex flex-column">
        {this.renderEditHeader()}
        {this.renderEditWarning()}
        {this.renderHeaderModal()}
        <div
          className={"QueryBuilder-section flex " + this.props.headerClassName}
          ref={this.header}
        >
          <HeaderTitle
            router={router}
            titleAndDescription={titleAndDescription}
            titleRightPanel={titleRightPanel}
          />
          <div
            className="header-buttons flex align-center flex-align-right html2canvas-filter"
            style={{ color: "#4C5773" }}
          >
            {headerButtons}
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export const HeaderTitle = ({
  router,
  titleAndDescription,
  titleRightPanel,
  featuresMode,
  hideSide,
  handleSideHide,
}) => {
  return (
    <Box className="dashboard-header-title flex left">
      <div className="flex align-center">
        {!featuresMode && <IconBack router={router} />}
        {featuresMode && handleSideHide && (
          <Button
            onlyIcon
            className=" Question-header-btn footprint-mr-s"
            iconColor="#5A617B"
            icon={hideSide ? "menu_right" : "menu_left"}
            iconSize={16}
            onClick={() => {
              trackStructEvent(`click toggleMenu`);
              handleSideHide({ hide: !hideSide });
            }}
          />
        )}
        <span style={{ flex: 1 }}>{titleAndDescription}</span>
      </div>
      {titleRightPanel}
      {/*{!!item && !!item["last-edit-info"] && <LastEditInfoLabel item={item} />}*/}
    </Box>
  );
};

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
