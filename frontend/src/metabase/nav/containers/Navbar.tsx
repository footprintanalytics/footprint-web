import React, { useMemo } from "react";
import _ from "underscore";
import { Location } from "history";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { getIsNavbarOpen } from "metabase/redux/app";
import { getUser } from "metabase/selectors/user";
import { getAdminPaths } from "metabase/admin/app/selectors";

import { User } from "metabase-types/api";
import { AdminPath, State } from "metabase-types/store";

import { AdminNavbar } from "../components/AdminNavbar";
import ABNavbar from "./ABNavbar/ABNavbar";
import FpNavbar from "./FpNavbar/FpNavbar";
import FgaNavbar from "./FgaNavbar/FgaNavbar";

type NavbarProps = {
  isOpen: boolean;
  user: User;
  location: Location;
  params: Record<string, unknown>;
  adminPaths: AdminPath[];
};

const mapStateToProps = (state: State) => ({
  isOpen: getIsNavbarOpen(state),
  user: getUser(state),
  adminPaths: getAdminPaths(state),
});

function Navbar({ isOpen, user, location, params, adminPaths }: NavbarProps) {
  const isAdminApp = useMemo(
    () => location.pathname.startsWith("/admin/"),
    [location.pathname],
  );
  const isFgaApp = useMemo(() => {
    return location.pathname.startsWith("/growth");
  }, [location.pathname]);

  const isABApp = useMemo(() => {
    return location.pathname.startsWith("/fga");
  }, [location.pathname]);

  const isFGAVCApp = useMemo(() => {
    return location.pathname.startsWith("/portfolio-fga");
  }, [location.pathname]);

  if (isAdminApp && user) {
    return <AdminNavbar user={user} path={location.pathname} adminPaths={adminPaths} />;
  }

  if (isABApp || isFGAVCApp) {
    return <ABNavbar isOpen={isOpen} location={location} params={params} />;
  }

  if (isFgaApp) {
    return <FgaNavbar isOpen={isOpen} location={location} params={params} />;
  }

  return <FpNavbar isOpen={isOpen} location={location} params={params} />;
}

export default _.compose(
  // Database.loadList({
  //   loadingAndErrorWrapper: false,
  // }),
  withRouter,
  connect(mapStateToProps),
)(Navbar);
