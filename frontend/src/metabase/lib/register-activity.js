import { isDefi360 } from "metabase/lib/project_info";

const ACTIVITY_ZKSPACE_SUBMIT_MODAL = "ACTIVITY_KCC_SUBMIT_MODAL";
const ACTIVITY_ZKSPACE_FINISH_TASK = "ACTIVITY_KCC_FINISH_TASK";
const ACTIVITY_ZKSPACE_SUBMIT_ADDR = "ACTIVITY_KCC_SUBMIT_ADDR";
const ACTIVITY_ZKSPACE_REGISTER_SUCCESS = "ACTIVITY_KCC_REGISTER_SUCCESS";
const activityChannel = ["kcc"];

export const activityStartTime = 1667210400000; // 2022/10/31 00:10:00+0
export const activityEndTime = 1667728800000; // 2022/11/6 00:10:00+0

/**
 *
 * @param {String} string
 * @return {Boolean}
 */

export function isRegisterActivityChannel(string) {
  if (typeof string !== "string") {
    return false;
  }
  return activityChannel.includes(string.toLowerCase());
}

export function zkspaceDate() {
  if (isDefi360()) {
    return false;
  }
  const currentDate = new Date().getTime();
  return currentDate > activityStartTime && currentDate < activityEndTime;
}

export function setRegistSuccess(email) {
  localStorage.setItem(ACTIVITY_ZKSPACE_REGISTER_SUCCESS, email);
}

export function getActivityZkspaceRegisterSuccess(email) {
  if (!email) {
    return false;
  }
  const result = localStorage.getItem(ACTIVITY_ZKSPACE_REGISTER_SUCCESS);
  if (result === email) {
    localStorage.removeItem(ACTIVITY_ZKSPACE_REGISTER_SUCCESS);
    return true;
  } else {
    return false;
  }
}

const isSameDay = function(t1, t2) {
  return new Date(t1).toDateString() === new Date(t2).toDateString();
};

export function canShowZkspaceSubmitModal(email) {
  if (getShowZkspaceSubmitAddr(email)) {
    return false;
  }
  const lastTime = localStorage.getItem(ACTIVITY_ZKSPACE_SUBMIT_MODAL + email);
  return !lastTime || !isSameDay(parseInt(lastTime), new Date().getTime());
}

export function setShowZkspaceSubmitModal(email) {
  localStorage.setItem(
    ACTIVITY_ZKSPACE_SUBMIT_MODAL + email,
    new Date().getTime(),
  );
}

export function getShowZkspaceSubmitAddr(email) {
  const str = localStorage.getItem(ACTIVITY_ZKSPACE_SUBMIT_ADDR) || "";
  const emailArray = str.split("|");
  return emailArray.includes(email);
}

export function setShowZkspaceSubmitAddr(email) {
  const str = localStorage.getItem(ACTIVITY_ZKSPACE_SUBMIT_ADDR) || "";
  const emailArray = str.split("|");
  if (!emailArray.includes(email)) {
    localStorage.setItem(
      ACTIVITY_ZKSPACE_SUBMIT_ADDR,
      [...emailArray, email].join("|"),
    );
    localStorage.removeItem(
      ACTIVITY_ZKSPACE_SUBMIT_MODAL + email,
      new Date().getTime(),
    );
  }
}

export function getShowZkspaceFinishTask(email) {
  const str = localStorage.getItem(ACTIVITY_ZKSPACE_FINISH_TASK) || "";
  const emailArray = str.split("|");
  return emailArray.includes(email);
}

export function setShowZkspaceFinishTask(email) {
  const str = localStorage.getItem(ACTIVITY_ZKSPACE_FINISH_TASK) || "";
  const emailArray = str.split("|");
  if (!emailArray.includes(email)) {
    localStorage.setItem(
      ACTIVITY_ZKSPACE_FINISH_TASK,
      [...emailArray, email].join("|"),
    );
  }
}
