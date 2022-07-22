/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { Box, Flex } from "grid-styled";
import { connect } from "react-redux";
import { color } from "metabase/lib/colors";
import { extractQueryParams } from "metabase/lib/urls";
import Icon from "metabase/components/Icon";
import Label from "metabase/components/type/Label";
// import { getUserDownloadPermission } from "metabase/selectors/user";
import NeedPermissionModal from "metabase/components/NeedPermissionModal";

function colorForType(type) {
  switch (type) {
    case "csv":
      return color("accent7");
    case "xlsx":
      return color("accent1");
    case "json":
      return color("bg-dark");
    default:
      return color("brand");
  }
}

const DownloadButton = ({
  children,
  method,
  url,
  params,
  extensions,
  canDownload,
  ...props
}) => {
  const [needPermissionModal, setNeedPermissionModal] = React.useState(false);
  const renderModal = () => {
    return (
      needPermissionModal && (
        <NeedPermissionModal
          title="Upgrade your account to unlock download"
          onClose={() => setNeedPermissionModal(false)}
        />
      )
    );
  };
  const element = (
    <Flex
      is="button"
      className="text-white-hover bg-brand-hover rounded cursor-pointer full hover-parent hover--inherit"
      align="center"
      p={1}
      my={1}
      onClick={e => {
        if (window.OSX) {
          // prevent form from being submitted normally
          e.preventDefault();
          // download using the API provided by the OS X app
          window.OSX.download(method, url, params, extensions);
        }
      }}
      {...props}
    >
      <Icon name={children} size={32} mr={1} color={colorForType(children)} />
      <Label my={0}>.{children}</Label>
    </Flex>
  );
  if (canDownload) {
    return (
      <Box>
        <form method={method} action={url}>
          {params && extractQueryParams(params).map(getInput)}
          {element}
        </form>
      </Box>
    );
  }
  return (
    <Flex>
      {renderModal()}
      <Box
        style={{ width: "100%" }}
        onClick={() => {
          setNeedPermissionModal(true);
        }}
      >
        {element}
      </Box>
    </Flex>
  );
};

const getInput = ([name, value]) => (
  <input type="hidden" name={name} value={value} />
);

DownloadButton.propTypes = {
  url: PropTypes.string.isRequired,
  method: PropTypes.string,
  params: PropTypes.object,
  extensions: PropTypes.array,
};

DownloadButton.defaultProps = {
  method: "POST",
  params: {},
  extensions: [],
};

const mapStateToProps = state => {
  return {
    // canDownload: getUserDownloadPermission(state),
    canDownload: true,
  };
};
export default connect(mapStateToProps)(DownloadButton);
