import { atom } from "jotai";
import { InferenceBox } from "./types";

// object detection model inference
export const inferenceCountAtom = atom<number>(0);
export const resultLabelHistoryAtom = atom<string[][]>([]);
export const currentBoxesAtom = atom<InferenceBox[]>([]);

export const currentCameraAtom = atom<MediaDeviceInfo | null>(null);
export const currentCamerasAtom = atom<MediaDeviceInfo[]>([]);
