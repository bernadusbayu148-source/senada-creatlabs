/*
 * iOS Safari illustration fix:
 * draw the hero motif onto a PNG bitmap once, instead of asking Safari to
 * composite large layered SVG strokes during scrolling/transforms.
 * If Canvas or image data is unavailable the existing SVG remains as fallback.
 */
(function () {
  "use strict";
  function drawRasterHero() {
    const illustration = document.querySelector(".art img.art-squiggle");
    if (!illustration) return;
    try {
      const width = 570, height = 500;
      const scale = 2; // detailed enough for Retina/mobile, capped for memory
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: false });
      if (!ctx) return;
      ctx.scale(scale, scale);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const path = new Path2D();
      path.moveTo(99, 148);
      path.bezierCurveTo(151, 51, 332, 63, 407, 123);
      path.bezierCurveTo(482, 183, 388, 218, 301, 212);
      path.bezierCurveTo(156, 200, 110, 265, 199, 337);
      path.bezierCurveTo(288, 409, 425, 398, 496, 298);

      ctx.save();
      ctx.translate(7, 11);
      ctx.strokeStyle = "rgba(0,0,0,.16)";
      ctx.lineWidth = 87;
      ctx.stroke(path);
      ctx.restore();

      ctx.strokeStyle = "#171725";
      ctx.lineWidth = 87;
      ctx.stroke(path);

      ctx.strokeStyle = "#d9f66e";
      ctx.lineWidth = 78;
      ctx.stroke(path);

      ctx.strokeStyle = "#fffefb";
      ctx.lineWidth = 5;
      ctx.setLineDash([2, 16]);
      ctx.stroke(path);
      ctx.setLineDash([]);

      const raster = canvas.toDataURL("image/png");
      if (raster.startsWith("data:image/png;base64,")) {
        illustration.src = raster;
        illustration.dataset.renderedAs = "canvas-png";
      }
    } catch (e) {
      // Graceful fallback to the original SVG if Canvas is not supported.
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", drawRasterHero, { once: true });
  } else {
    drawRasterHero();
  }
})();
