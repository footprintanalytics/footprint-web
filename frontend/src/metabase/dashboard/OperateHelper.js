let timer: undefined;

const register = (callback, second) => {
  countTime(callback, second);
  document.body.onmousedown = () => countTime(callback, second);
  document.body.onmousemove = () => countTime(callback, second);
  document.body.onwheel = () => countTime(callback, second);
  document.body.onkeydown = () => countTime(callback, second);
};

const countTime = (callback, second) => {
  cancelTimer();
  timer = setInterval(function() {
    callback && callback();
  }, second);
};

const cancelTimer = () => {
  if (timer) {
    clearInterval(timer);
  }
};

const unRegister = () => {
  document.body.onmousedown = undefined;
  document.body.onmousemove = undefined;
  document.body.onwheel = undefined;
  document.body.onkeydown = undefined;
  cancelTimer();
};

const OperateHelper = {
  register,
  unRegister,
};

export default OperateHelper;
