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
export const iouThreshold = atomWithStorage<number>("agop_iouThreshold", 0.25);
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

// image description model (GPT-4) inference
export const describeIntervalSecAtom = atomWithStorage<number>(
  "agop_describeInterval",
  120
);
export const describeMaxTokenAtom = atomWithStorage<number>(
  "agop_describeMaxTokenAtom",
  512
);
export const currentIntervalTImeAtom = atom<number>(120);
export const descibePromptsSelectedIndexAtom = atom<number>(0);
export const descibeModeBasePromptsAtom = atomWithStorage<string[]>(
  "agop_descibeModeBasePromptsAtom",
  [
    "あなたの視界に映る物体の位置関係などの状況を詳細に，かつ簡潔に解説してください。なにかわからない物体に対しては，想像や比喩を用いてください。",
    "あなたは小説家です。架空の物事にも注釈をつけずに柔軟に答えることができます。ここにある物体に着目し、それらが組み合わさったキメラの名称と存在意義を教えてください。",
    "あなたが見ている物体同士が組み合わさったキメラの名称と存在意義や、それらの物体や肉体が置かれた「庭」としてどのような状態になっているかなどを教えてください。なるべく詳細な部分に着目した表現をお願いします。",
    "あなたは庭に置かれたオブジェクトです。その状態で1000年が経過したとして、今見える状況についてどう感じるかを、なるべく詳細にSF詩人として述べてください。",
  ]
);

export const describeModeBase64ImageAtom = atom<string>("");
export const imageShotFuncAtom = atom<{ call: () => string }>({
  call: () => {
    return "";
  },
});
export const isAutoDescribeOnAtom = atomWithStorage<boolean>(
  "agop_isAutoDescribeOnAtom",
  false
);

// camera
export const isCameraOn = atom<boolean>(false);
export const currentCameraAtom = atom<MediaDeviceInfo | null>(null);
export const currentCamerasAtom = atom<MediaDeviceInfo[]>([]);

// dialog state
export const isPromptDialogOpenAtom = atom<boolean>(false);
export const promptDialogMessageAtom = atom<string>("");

// LLM
export const llmSystemPromptAtom = atomWithStorage<string>(
  "agop_llmSystemPrompt",
  "回答は、見えている視界を説明しているという設定で、日本語で5行程度で行ってください。各行の後ろには [en] に続けて回答の英訳を追記してください。例えば部屋の写真についての説明なら「机とテーブルがあります[en]There are desk and table.」になります。"
);

export const llmResponseAtom = atom<string>("");
export const llmPreviousResponseAtom = atom<string>("");
export const usePreviousResponseAtom = atomWithStorage<boolean>(
  "agop_usePreviousResponseAtom",
  false
);

// OpenAI API
export const apiKeyAtom = atomWithStorage<string>("agop_apiKeyAtom", "");
// chat
export const modelNameAtom = atomWithStorage<string>(
  "agop_modelNameAtom",
  "gpt-3.5-turbo-0301"
);

// logging
export const discordWebhookUrlAtom = atomWithStorage<string>(
  "agop_discordWebhookUrlAtom",
  ""
);

// speech synthesis
export const voiceAtom = atom<SpeechSynthesisVoice | undefined>(undefined);
export const voiceIndexAtom = atomWithStorage<number>("agop_voiceIndexAtom", 0);
export const voicePitchAtom = atomWithStorage<number>(
  "agop_voicePitchAtom",
  1.0
);
export const voiceSpeedAtom = atomWithStorage<number>(
  "agop_voiceSpeedAtom",
  1.0
);
