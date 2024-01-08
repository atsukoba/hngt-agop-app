import { atom } from "jotai";
import { InferenceBox } from "./types";
import { Label, defaultLabelsJaLabelMap } from "@/yolo/label";
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
export const labelsJaLabelMapAtom = atom<{ [key in Label]: string }>(
  defaultLabelsJaLabelMap
);

// camera
export const isCameraOn = atom<boolean>(false);
export const currentCameraAtom = atom<MediaDeviceInfo | null>(null);
export const currentCamerasAtom = atom<MediaDeviceInfo[]>([]);

// prompt dialog state
export const isPromptDialogOpenAtom = atom<boolean>(false);
export const promptDialogMessageAtom = atom<string>("");
