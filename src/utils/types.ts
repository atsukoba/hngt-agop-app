import * as ort from "onnxruntime-web";

declare global {
  interface Window {
    cv: any; // OpenCV.js
  }
}

export type InferenceBox = {
  labelIndex: number;
  probability: number;
  bounding: [number, number, number, number];
};

export type InferenceSessionSet = {
  net: ort.InferenceSession;
  nms: ort.InferenceSession;
};
