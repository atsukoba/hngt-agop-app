import { InferenceBox } from "./types";

/**
 * Compare two InferenceBoxes have same set of detected objects.
 *
 * @param boxes1 InferenceBoxes
 * @param boxes2 InferenceBoxes
 * @returns
 */
export const isSameInferenceBoxes = (
  boxes1: InferenceBox[],
  boxes2: InferenceBox[]
) => {
  // compare length and each element
  if (boxes1.length !== boxes2.length) return false;
  for (let i = 0; i < boxes1.length; i++) {
    const box1 = boxes1[i];
    const box2 = boxes2[i];
    if (box1.labelIndex !== box2.labelIndex) {
      return false;
    }
  }
  return true;
};

