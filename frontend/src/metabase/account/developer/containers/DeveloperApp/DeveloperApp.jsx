import { connect } from "react-redux";
import { getUser } from "metabase/selectors/user";
import { refreshCurrentUser } from "metabase/redux/user";
import DeveloperAppForm from "../../components/DeveloperAppForm";

const mapStateToProps = state => ({
  user: getUser(state),
});

const mapDispatchToProps = {
  refreshCurrentUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeveloperAppForm);
