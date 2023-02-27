import React, { useMemo } from "react";
import _ from "underscore";
import { Location } from "history";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import Database from "metabase/entities/databases";
import { getIsNavbarOpen } from "metabase/redux/app";
import { getUser } from "metabase/selectors/user";
import { getAdminPaths } from "metabase/admin/app/selectors";

import { User } from "metabase-types/api";
import { AdminPath, State } from "metabase-types/store";

import { AdminNavbar } from "../components/AdminNavbar";
import MainNavbar from "./MainNavbar";
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
  const isFgaApp = useMemo(
    () => location.pathname.startsWith("/growth"),
    [location.pathname],
  );
  return isAdminApp && user ? (
    <AdminNavbar user={user} path={location.pathname} adminPaths={adminPaths} />
  ) : isFgaApp ? (
    <FgaNavbar isOpen={isOpen} location={location} params={params} />
  ) : (
    <FpNavbar isOpen={isOpen} location={location} params={params} />
  );
}

export default _.compose(
  // Database.loadList({
  //   loadingAndErrorWrapper: false,
  // }),
  withRouter,
  connect(mapStateToProps),
)(Navbar);
