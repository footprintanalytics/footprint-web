const DrawUtil = (wMulti, hMulti) => {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    const minSize = Math.min(w, h);
    if (r > minSize / 2) {
      r = minSize / 2;
    }
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  };

  DrawUtil.prototype.drawBg = (ctx, color, x, y, width, height) => {
    ctx.fillStyle = color;
    ctx.fillRect(x * wMulti, y * hMulti, width * wMulti, height * hMulti);
    ctx.drawImage(ctx.canvas, 0, 0);
  };
  DrawUtil.prototype.drawBgRound = (
    ctx,
    color,
    x,
    y,
    width,
    height,
    radius,
  ) => {
    ctx.fillStyle = color;
    ctx.roundRect(
      x * wMulti,
      y * hMulti,
      width * wMulti,
      height * hMulti,
      radius * wMulti,
    );
    ctx.fill();
  };

  DrawUtil.prototype.drawBgStroke = (ctx, color, x, y, width, height) => {
    ctx.strokeStyle = color;
    ctx.strokeRect(x * wMulti, y * hMulti, width * wMulti, height * hMulti);
    ctx.drawImage(ctx.canvas, 0, 0);
  };

  DrawUtil.prototype.drawBgRoundStroke = (
    ctx,
    color,
    x,
    y,
    width,
    height,
    radius,
  ) => {
    ctx.strokeStyle = color;
    ctx.roundRect(
      x * wMulti,
      y * hMulti,
      width * wMulti,
      height * hMulti,
      radius * wMulti,
    );
    ctx.stroke();
  };

  DrawUtil.prototype.drawImage = async (ctx, url, x, y, width, height) => {
    const img = await loadImg(url);
    if (!img) {
      return;
    }
    ctx.drawImage(img, x * wMulti, y * hMulti, width * wMulti, height * hMulti);
  };

  DrawUtil.prototype.drawImageRound = async (
    ctx,
    url,
    x,
    y,
    width,
    height,
    radius,
  ) => {
    const img = await loadImg(url);
    if (!img) {
      return;
    }
    ctx.save();
    ctx.beginPath();
    ctx.arc(
      (x + radius) * wMulti,
      (y + radius) * hMulti,
      radius * wMulti,
      0,
      Math.PI * 2,
      false,
    );
    ctx.clip();
    ctx.drawImage(img, x * wMulti, y * hMulti, width * wMulti, height * hMulti);
    ctx.restore();
  };

  DrawUtil.prototype.drawTextCenter = (
    ctx,
    text,
    x,
    y,
    color,
    fontSize,
    bold,
  ) => {
    drawText(ctx, text, x, y, color, fontSize, "center", bold);
  };

  DrawUtil.prototype.drawTextCenterMultiLine = (
    ctx,
    textArray,
    x,
    y,
    color,
    fontSize,
    bold,
  ) => {
    const firstLineY = y;
    textArray.forEach((text, index) => {
      drawText(
        ctx,
        text,
        x,
        firstLineY + index * fontSize * 1.2,
        color,
        fontSize,
        "center",
        bold,
      );
    });
  };

  DrawUtil.prototype.drawTextLeftMultiLine = (
    ctx,
    textArray,
    x,
    y,
    color,
    fontSize,
    bold,
  ) => {
    const firstLineY = y;
    textArray.forEach((text, index) => {
      drawText(
        ctx,
        text,
        x,
        firstLineY + index * fontSize * 1.2,
        color,
        fontSize,
        "left",
        bold,
      );
    });
  };

  DrawUtil.prototype.drawTextRight = (
    ctx,
    text,
    x,
    y,
    color,
    fontSize,
    bold,
  ) => {
    drawText(ctx, text, x, y, color, fontSize, "right", bold);
  };

  DrawUtil.prototype.drawTextLeft = (
    ctx,
    text,
    x,
    y,
    color,
    fontSize,
    bold,
  ) => {
    drawText(ctx, text, x, y, color, fontSize, "left", bold);
  };

  const drawText = (
    ctx,
    text,
    x,
    y,
    color,
    fontSize,
    textAlign = "left",
    bold = "",
  ) => {
    ctx.font = `${bold} ${fontSize * wMulti}px sans-serif`;
    ctx.textAlign = textAlign;
    ctx.fillStyle = color;
    ctx.fillText(text, x * wMulti, y * wMulti);
  };

  const loadImg = url => {
    return new Promise(resolve => {
      const img = new Image();
      img.src = url;
      img.setAttribute("crossOrigin", "Anonymous");
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
    });
  };

  DrawUtil.prototype.formatPrice = price => {
    return String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
};

export default DrawUtil;
