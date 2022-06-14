import React from "react";
import LogoIconNoText from "metabase/components/LogoIconNoText";
import ExternalLink from "metabase/components/ExternalLink";

type Props = {
  dark: boolean,
};

const LogoBadge = ({ dark }: Props) => (
  <ExternalLink
    href="https://www.footprint.network/"
    target="_blank"
    className="h4 flex text-bold align-center no-decoration"
  >
    <span className="text-small flex align-center">
      <span className="mr1 md-ml2 text-medium">Powered by</span>
      <LogoIconNoText height={28} dark={dark} />
      <span className="ml1 text-medium">
        {
          <span className={dark ? "text-white" : "text-brand"}>
            Footprint Analytics
          </span>
        }
      </span>
    </span>
  </ExternalLink>
);

export default LogoBadge;
