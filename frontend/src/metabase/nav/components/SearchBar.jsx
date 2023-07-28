/* eslint-disable react/prop-types */
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Icon from "metabase/components/Icon";
import OnClickOutsideWrapper from "metabase/components/OnClickOutsideWrapper";
import "./SearchBar.css";
import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import SearchResultsModal from "./SearchResultsModal";
import { isSearch } from "metabase/containers/dashboards/shared/utils";
import { push } from "react-router-redux";

const SearchWrapper = styled.div`
  position: relative;
  border-radius: 16px;
  border: ${props => props.isDark ? "1px solid #4A5568" : "1px solid #dcdee4"};
  flex: 1 1 auto;
  display: flex;
  column-gap: 8px;
  height: 32px;
  align-items: center;
  color: ${props => props.isDark ? "#A0AEC0" : "white"};
  transition: background 300ms ease-in;
  background-color: ${props => props.isDark ? "#2A3246" : "#f9f9f9"};
`;

const SearchInput = styled.input`
  background-color: transparent;
  width: 100%;
  border: none;
  color: ${props => props.isDark ? "#fff" : "#000"};
  font-size: 1em;
  font-weight: 500;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #adadad;
  }
`;

const ALLOWED_SEARCH_FOCUS_ELEMENTS = new Set(["BODY", "A"]);

class SearchBar extends React.Component {
  state = {
    active: false,
    searchText: "",
    activeTab: "dashboard",
  };

  UNSAFE_componentWillMount() {
    this._updateSearchTextFromUrl(this.props);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this._updateSearchTextFromUrl(nextProps);
    }
    // deactivate search on navigation
    if (this.props.location !== nextProps.location) {
      this.setState({ active: false });
    }
    if (isSearch()) {
      this.setState({ searchText: "" });
    }
  }

  _updateSearchTextFromUrl(props) {
    const components = props.location.pathname.split("/");
    if (components[components.length - 1] === "search") {
      this.setState({ searchText: props.location.query.q });
    } else {
      this.setState({ searchText: "" });
    }
  }

  handleKeyUp = e => {
    const FORWARD_SLASH_KEY = 191;
    if (
      e.keyCode === FORWARD_SLASH_KEY &&
      ALLOWED_SEARCH_FOCUS_ELEMENTS.has(document.activeElement.tagName)
    ) {
      ReactDOM.findDOMNode(this.searchInput).focus();
      this.setState({ active: true });
    }
  };

  onkeydown = e => {
    const { activeTab, searchText } = this.state;
    if (e.keyCode === 13) {
      this.props.push(
        `/search?q=${encodeURIComponent(searchText)}&model=${activeTab}`,
      );
    }
  };

  activeTabCallback = tab => {
    if (tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  render() {
    const { active, searchText } = this.state;
    const { isDark } = this.props;

    return (
      <OnClickOutsideWrapper
        handleDismissal={() => this.setState({ active: false })}
      >
        <SearchWrapper
          onClick={() => this.setState({ active: true })}
          active={active}
          isDark={isDark}
        >
          <Icon name="search" ml={["10px", 2]} className="text-medium" />
          <SearchInput
            py={1}
            pr={[0, 2]}
            pl={1}
            ref={ref => (this.searchInput = ref)}
            isDark={isDark}
            value={searchText}
            maxLength={200}
            placeholder={"Search..."}
            onClick={() => this.setState({ active: true })}
            onChange={e => this.setState({ searchText: e.target.value })}
            onKeyDown={e => this.onkeydown(e)}
          />
          {active && (
            <SearchResultsModal
              searchText={searchText}
              activeTabCallback={this.activeTabCallback}
            />
          )}
        </SearchWrapper>
      </OnClickOutsideWrapper>
    );
  }
}

export default connect(state => ({ user: getUser(state) }), { push })(SearchBar);
