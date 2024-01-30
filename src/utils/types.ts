import * as ort from "onnxruntime-web";

declare global {
  interface Window {
    cv: any; // OpenCV.js
  }
}

/**
 * InferenceBox
 * @typedef {Object} InferenceBox
 * @property {number} labelIndex predicted label index
 * @property {number} probability probability of the predicted label
 * @property {[number, number, number, number]} bounding bounding box [x, y, w, h]
 */
export type InferenceBox = {
  labelIndex: number;
  probability: number;
  bounding: [number, number, number, number];
};

export type InferenceSessionSet = {
  net: ort.InferenceSession;
  nms: ort.InferenceSession;
};
