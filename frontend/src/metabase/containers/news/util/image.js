// eslint-disable-next-line import/no-commonjs
exports.getContentFirstImg = html => {
  const imgReg = /<img.*?(?:>|\/>)/gi;
  const srcReg = /src=[\"\"]?([^\"\"]*)[\"\"]?/i;
  const arr = html.match(imgReg);
  let img = "";
  if (arr) {
    arr.forEach(data => {
      const src = data.match(srcReg);
      if (src && src.length > 1 && !img) {
        img = src[1];
      }
    });
  }
  return img;
};
