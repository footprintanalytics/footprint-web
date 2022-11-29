import moment from "moment";

const oneMinuteTime = 60 * 1000;
const oneHourTime = 60 * 60 * 1000;
const oneDayTime = 24 * 60 * 60 * 1000;

const formatDate = time => {
  let result;
  const now = new Date().getTime();
  const diff = now - time;
  if (diff < oneMinuteTime) {
    result = `now`;
  } else if (diff < oneHourTime) {
    //in 1hours
    const minutes = Math.floor(diff / oneMinuteTime);
    result = `${minutes} minutes ago`;
  } else if (now - time < oneDayTime) {
    //1~24hours
    const hours = Math.floor(diff / oneHourTime);
    result = `${hours} hours ago`;
  } else {
    result = moment(new Date(time).getTime()).format("YYYY-MM-DD");
  }
  return result;
};
export default formatDate;
