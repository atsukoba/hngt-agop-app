"use client";

import * as ort from "onnxruntime-web";
import { labels, getColorStr } from "@/yolo/label";
import { InferenceBox, InferenceSessionSet } from "@/utils/types";

export const convertToBase64 = (source: HTMLCanvasElement) => {
  return source.toDataURL("image/jpeg");
};

/**
 *
 * @param source HTMLCanvasElement instance
 * @param modelWidth model input width
 * @param modelHeight model input height
 * @returns
 */
const preprocessing = async (
  source: HTMLCanvasElement,
  modelWidth: number,
  modelHeight: number
): Promise<[any, number, number, number]> => {
  const cv = window.cv;
  const mat = cv.imread(source); // read from img tag
  const matC3 = new cv.Mat(mat.rows, mat.cols, cv.CV_8UC3); // new image 3ch matrix [y, x]
  cv.cvtColor(mat, matC3, cv.COLOR_RGBA2BGR); // RGBA to BGR

  // padding image to [n x n] dim
  // console.log("model size (w, h):", modelWidth, modelHeight);
  const maxSize = Math.max(matC3.rows, matC3.cols); // get max size from width and height
  // console.log("input size (w, h):", matC3.cols, matC3.rows);
  const ratio = maxSize / Math.min(modelHeight, modelWidth);
  // console.log("ratio:", ratio);
  const xPad = modelWidth * ratio - matC3.cols; // set xPadding
  const yPad = modelHeight * ratio - matC3.rows; // set yPadding
  // console.log("pad:", xPad, yPad);
  // eather x or y padding is 0
  const matPad = new cv.Mat(); // new mat for padded image
  cv.copyMakeBorder(
    matC3,
    matPad,
    yPad / 2,
    yPad / 2,
    xPad / 2,
    xPad / 2,
    cv.BORDER_CONSTANT
  ); // padding black
  // console.log("target size (w, h):", matPad.cols, matPad.rows);
  const input = cv.blobFromImage(
    matPad,
    1 / 255.0, // normalize
    new cv.Size(modelWidth, modelHeight), // resize to model input size
    new cv.Scalar(0, 0, 0),
    true, // swapRB
    false // crop
  ); // preprocessing image matrix

  // console.log(
  //   "preprocessing:",
  //   `mat size ${mat.rows}x${mat.cols}, model size ${modelWidth}x${modelHeight}, maxSize ${maxSize}x${maxSize}, xPad ${xPad}, yPad ${yPad}, xRatio ${xRatio}, yRatio ${yRatio}`
  // );
  // release mat opencv
  mat.delete();
  matC3.delete();
  matPad.delete();
  return [input, ratio, xPad, yPad];
};

/**
 *
 * @param image HTMLCanvasElement instance
 * @param session onnx-runtime InferenceSession
 * @param modelInputShape [batch, channel, height, width]
 * @param topk top-k samples to keep for result
 * @param iouThreshold IOU (Intersection Over Union) threshold
 * @param scoreThreshold score (probability) threshold
 * @returns
 */
export const detectImage = async (
  image: HTMLCanvasElement,
  session: InferenceSessionSet,
  modelInputShape: [number, number, number, number],
  topk: number = 100,
  iouThreshold: number = 0.35,
  scoreThreshold: number = 0.2
) => {
  const [modelWidth, modelHeight] = modelInputShape.slice(2);
  const [input, ratio, xPad, yPad] = await preprocessing(
    image,
    modelWidth,
    modelHeight
  );
  const tensor = new ort.Tensor("float32", input.data32F, modelInputShape); // to ort.Tensor
  const config = new ort.Tensor(
    "float32",
    new Float32Array([topk, iouThreshold, scoreThreshold])
  ); // nms config tensor
  const { output0 } = await session.net.run({ images: tensor }); // run session and get output layer
  const { selected } = await session.nms.run({
    detection: output0,
    config: config,
  }); // perform nms and filter boxes

  const boxes: InferenceBox[] = [];

  // looping through output
  for (let idx = 0; idx < selected.dims[1]; idx++) {
    const data = selected.data.slice(
      idx * selected.dims[2],
      (idx + 1) * selected.dims[2]
    ); // get rows
    const box = data.slice(0, 4) as unknown as number[];
    const scores = data.slice(4) as unknown as number[]; // classes probability scores
    const score = Math.max(...scores); // maximum probability scores
    const label = scores.indexOf(score); // class id of maximum probability scores

    // fix bounding box to original image size, removing padding
    const [x, y, w, h] = [
      box[0] * ratio - xPad / 2, // upscale left
      box[1] * ratio - yPad / 2, // upscale top
      box[2] * ratio, // upscale width
      box[3] * ratio, // upscale height
    ]; // keep boxes in maxSize range
    boxes.push({
      labelIndex: label,
      probability: score,
      bounding: [x, y, w, h], // upscale box
    }); // update boxes to draw later
  }
  input.delete(); // delete unused Mat
  return boxes;
};

// Render box
export const renderBoxes = (
  canvas: HTMLCanvasElement,
  boxes: InferenceBox[]
) => {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (ctx === null) {
    return;
  }
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clean canvas

  // font configs
  const font = `${Math.max(
    Math.round(Math.max(ctx.canvas.width, ctx.canvas.height) / 50),
    12
  )}px Arial`;
  ctx.font = font;
  ctx.textBaseline = "top";

  boxes.forEach((box) => {
    const klass = labels[box.labelIndex];
    const score = (box.probability * 100).toFixed(1);
    const [xCenter, yCenter, width, height] = box.bounding;
    const x1 = xCenter - width / 2;
    const y1 = yCenter - height / 2;
    // draw box.
    ctx.fillStyle = getColorStr(labels[box.labelIndex], 0.2);
    ctx.fillRect(x1, y1, width, height);
    // draw border box
    ctx.strokeStyle = getColorStr(labels[box.labelIndex], 0.9);
    ctx.lineWidth = Math.max(
      Math.min(ctx.canvas.width, ctx.canvas.height) / 250,
      2.0
    );
    ctx.strokeRect(x1, y1, width, height);
    // draw the label background.
    ctx.fillStyle = getColorStr(labels[box.labelIndex], 0.9);
    // label box
    const textWidth = ctx.measureText(klass + " - " + score + "%").width;
    const textHeight = parseInt(font, 10); // base 10
    const yText = y1 - (textHeight + ctx.lineWidth);
    ctx.fillRect(
      x1 - 1,
      yText < 0 ? 0 : yText,
      textWidth + ctx.lineWidth,
      textHeight + ctx.lineWidth
    );
    // Draw labels
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(
      klass + " - " + score + "%",
      x1 - 1,
      yText < 0 ? 1 : yText + 1
    );
  });
};
