function lessInterval(lastTime, interval) {
  const nowTime = new Date().getTime();
  return nowTime - lastTime < interval;
}

const canBlock = (scene, isLimit = false) => {
  const lastTime = localStorage.getItem(`cancel-feedback-last-time`);
  if (lastTime && lessInterval(lastTime, 60 * 60 * 1000)) {
    return false;
  }
  if (isLimit) {
    const times = localStorage.getItem(`cancel-feedback-times-normal`);
    if (times) {
      let timesArray = [];
      try {
        timesArray = times.split(",");
      } catch (e) {}
      return timesArray.length < 3;
    }
  }
  return true;
};

const userCancelFeedbackUtil = {
  canBlock,
};

export default userCancelFeedbackUtil;
