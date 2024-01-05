import { atom } from "jotai";
import { InferenceBox } from "./types";
import { Label } from "@/yolo/label";
import { LoadingMessages } from "./consts";

// app state
export const loadingMessageAtom = atom<LoadingMessages | undefined>(undefined);

// object detection model inference
export const inferenceCountAtom = atom<number>(0);
export const topK = atom<number>(100);
export const iouThreshold = atom<number>(0.35);
export const scoreThreshold = atom<number>(0.2);

// detection result
export const resultLabelHistoryAtom = atom<Label[][]>([]);
export const currentBoxesAtom = atom<InferenceBox[]>([]);

// camera
export const isCameraOn = atom<boolean>(false);
export const currentCameraAtom = atom<MediaDeviceInfo | null>(null);
export const currentCamerasAtom = atom<MediaDeviceInfo[]>([]);
