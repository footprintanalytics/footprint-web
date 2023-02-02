/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { message } from "antd";
import { color } from "metabase/lib/colors";
import { extractQueryParams } from "metabase/lib/urls";
import Icon from "metabase/components/Icon";
import Label from "metabase/components/type/Label";
// import { getUserDownloadPermission } from "metabase/selectors/user";
import NeedPermissionModal from "metabase/components/NeedPermissionModal";
import { cardDownload, datasetDownload } from "metabase/new-service";
import { getUser } from "metabase/selectors/user";
import { loginModalShowAction } from "metabase/redux/control";
import { FormButton } from "metabase/components/DownloadButton.styled";

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
  mode,
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
    <FormButton
      className="hover-parent hover--inherit"
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
    </FormButton>
  );
  if (canDownload) {
    if (mode) {
      return (
        <>
          {renderModal()}
          <div
            onClick={async () => {
              if (!props.user?.id) {
                props.setLoginModalShow({ show: true });
                return;
              }
              const hide = message.loading("Downloading...", 0);
              const config = {
                headers: { "Content-Type": "multipart/form-data" },
              };
              if (params.type === "xlsx") {
                config.responseType = "blob";
              }
              try {
                switch (mode) {
                  case "saved":
                    await cardDownload(params, config);
                    break;
                  case "unsaved":
                    await datasetDownload(params, config);
                    break;
                  default:
                    break;
                }
              } catch (error) {
                if (
                  typeof error === "string" &&
                  error.includes("Free users")
                ) {
                  setNeedPermissionModal(true);
                }
              } finally {
                hide();
              }
            }}
          >
            {element}
          </div>
        </>
      );
    }
    return (
      <div>
        <form method={method} action={url}>
          {params && extractQueryParams(params).map(getInput)}
          {element}
        </form>
      </div>
    );
  }
  return (
    <div className="flex">
      {renderModal()}
      <div
        style={{ width: "100%" }}
        onClick={() => {
          setNeedPermissionModal(true);
        }}
      >
        {element}
      </div>
    </div>
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
    user: getUser(state),
  };
};

const mapDispatchToProps = {
  setLoginModalShow: loginModalShowAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(DownloadButton);
