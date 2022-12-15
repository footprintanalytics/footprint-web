import { SessionApi } from "metabase/services";

export const deleteSession = async () => {
  try {
    await SessionApi.delete();
  } catch (error) {
    if (error.status !== 404) {
      console.error("Problem clearing session", error);
    }
  }
};

/// clear out Google Auth credentials in browser if present
export async function clearGoogleAuthCredentials() {
  const googleAuth =
    typeof gapi !== "undefined" && gapi && gapi.auth2
      ? gapi.auth2.getAuthInstance()
      : undefined;
  if (!googleAuth) {
    return;
  }

  try {
    await googleAuth.signOut();
  } catch (error) {
    console.error("Problem clearing Google Auth credentials", error);
  }
}
