"use client";

import * as ort from "onnxruntime-web";
import { labels } from "./label";
import { InferenceBox, InferenceSessionSet } from "@/utils/types";

export const preprocessing = async (
  source: HTMLImageElement | HTMLCanvasElement,
  modelWidth: number,
  modelHeight: number
): Promise<[any, number, number]> => {
  const cv = window.cv;

  const mat = cv.imread(source); // read from img tag
  const matC3 = new cv.Mat(mat.rows, mat.cols, cv.CV_8UC3); // new image matrix
  cv.cvtColor(mat, matC3, cv.COLOR_RGBA2BGR); // RGBA to BGR

  // padding image to [n x n] dim
  const maxSize = Math.max(matC3.rows, matC3.cols); // get max size from width and height
  const xPad = maxSize - matC3.cols, // set xPadding
    xRatio = maxSize / matC3.cols; // set xRatio
  const yPad = maxSize - matC3.rows, // set yPadding
    yRatio = maxSize / matC3.rows; // set yRatio
  const matPad = new cv.Mat(); // new mat for padded image
  cv.copyMakeBorder(matC3, matPad, 0, yPad, 0, xPad, cv.BORDER_CONSTANT); // padding black

  const input = cv.blobFromImage(
    matPad,
    1 / 255.0, // normalize
    new cv.Size(modelWidth, modelHeight), // resize to model input size
    new cv.Scalar(0, 0, 0),
    true, // swapRB
    false // crop
  ); // preprocessing image matrix

  // release mat opencv
  mat.delete();
  matC3.delete();
  matPad.delete();

  return [input, xRatio, yRatio];
};

export const detectImage = async (
  image: HTMLImageElement | HTMLCanvasElement,
  session: InferenceSessionSet,
  modelInputShape: [number, number, number, number],
  topk: number = 100,
  iouThreshold: number = 0.35,
  scoreThreshold: number = 0.2
) => {
  const [modelWidth, modelHeight] = modelInputShape.slice(2);
  const [input, xRatio, yRatio] = await preprocessing(
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

    const [x, y, w, h] = [
      (box[0] - 0.5 * box[2]) * xRatio, // upscale left
      (box[1] - 0.5 * box[3]) * yRatio, // upscale top
      box[2] * xRatio, // upscale width
      box[3] * yRatio, // upscale height
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

  const colors = new Map<number, string>();
  labels.forEach((_, idx) => {
    colors.set(idx, "#" + Math.floor(Math.random() * 16777215).toString(16));
  });

  // font configs
  const font = `${Math.max(
    Math.round(Math.max(ctx.canvas.width, ctx.canvas.height) / 40),
    14
  )}px Arial`;
  ctx.font = font;
  ctx.textBaseline = "top";

  boxes.forEach((box) => {
    const klass = labels[box.labelIndex];
    const color = colors.get(box.labelIndex) || "#ffffff";
    const score = (box.probability * 100).toFixed(1);
    const [x1, y1, width, height] = box.bounding;

    // draw box.
    ctx.fillStyle = color;
    ctx.fillRect(x1, y1, width, height);
    // draw border box
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(
      Math.min(ctx.canvas.width, ctx.canvas.height) / 200,
      2.5
    );
    ctx.strokeRect(x1, y1, width, height);

    // draw the label background.
    ctx.fillStyle = color;
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
    ctx.fillStyle = "#ffffff";
    ctx.fillText(
      klass + " - " + score + "%",
      x1 - 1,
      yText < 0 ? 1 : yText + 1
    );
  });
};
