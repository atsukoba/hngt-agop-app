import { Label, defaultLabelsJaLabelMap } from "@/yolo/label";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { v4 as uuidv4 } from "uuid";
import { LoadingMessages } from "./consts";
import { InferenceBox } from "./types";

// app state
export const loadingMessageAtom = atom<LoadingMessages | undefined>(undefined);

// object detection model inference
export const inferenceCountAtom = atom<number>(0);
export const topK = atomWithStorage<number>("agop_topK", 100);
export const iouThreshold = atomWithStorage<number>("agop_iouThreshold", 0.35);
export const scoreThreshold = atomWithStorage<number>(
  "agop_scoreThreshold",
  0.2
);
export const inferenceIntervalAtom = atomWithStorage<number>(
  "agop_inferenceInterval",
  500
);

// detection result
export const resultBoxesHistoryAtom = atom<InferenceBox[][]>([[]]);
export const currentBoxesAtom = atom<InferenceBox[]>([]); // for display on canvas
export const labelsJaLabelMapAtom = atom<{ [key in Label]: string }>(
  defaultLabelsJaLabelMap
);

// image description model inference
export const describeIntervalSecAtom = atomWithStorage<number>(
  "agop_describeInterval",
  60
);
export const descibeModeBasePromptAtom = atomWithStorage<string>(
  "agop_descibeModeBasePromptAtom",
  "Describe the image above in Japanese, and English follows after the token <lang>"
);

// camera
export const isCameraOn = atom<boolean>(false);
export const currentCameraAtom = atom<MediaDeviceInfo | null>(null);
export const currentCamerasAtom = atom<MediaDeviceInfo[]>([]);

// dialog state
export const isPromptDialogOpenAtom = atom<boolean>(false);
export const promptDialogMessageAtom = atom<string>("");
export const llmResponseAtom = atom<string>("");

// OpenAI API
export const apiKeyAtom = atomWithStorage<string>("agop_apiKeyAtom", "");
// chat
export const modelNameAtom = atomWithStorage<string>(
  "agop_modelNameAtom",
  "gpt-3.5-turbo-0301"
);
