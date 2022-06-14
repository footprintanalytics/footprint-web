import { gql } from "@apollo/client";

export const QUERY_OPTIONS = {
  fetchPolicy: "network-only",
};

// user_dashboard
export const USER_DASHBOARD = {
  find: gql`
    query($user_id: String!) {
      indicator_user_dashboard(
        where: { user_id: { _eq: $user_id }, status: { _eq: "success" } }
      ) {
        id
        user_id
        protocol_id
        protocol_name
        origin_dashboard_id
        dashboard_id
        dashboard_uuid
        dashboard_link
        defi_category
        first_level
        second_level
        third_level
        sort
        params
      }
    }
  `,
};
