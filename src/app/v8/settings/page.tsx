"use client";

import {
  apiKeyAtom,
  iouThreshold,
  isCameraOn,
  labelsJaLabelMapAtom,
  modelNameAtom,
  scoreThreshold,
  topK,
} from "@/utils/states";
import { labels, labelsIconMap } from "@/yolo/label";
import { useAtom, useSetAtom } from "jotai/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const InfoIcon = (tooltipMsg: string) => (
  <div className="tooltip tooltip-right" data-tip={tooltipMsg}>
    <span
      className="icon-[mdi--information-slab-circle-outline] w-5 h-5 mr-2"
      style={{ verticalAlign: "-0.3em" }}
    ></span>
  </div>
);

export default function SettingModal() {
  const router = useRouter();

  const setCameraOn = useSetAtom(isCameraOn);
  const [token, setToken] = useAtom(apiKeyAtom);
  const [modelName, setModelName] = useAtom(modelNameAtom);
  const [labelsJaLabelMap, setLabelsJaLabelMap] = useAtom(labelsJaLabelMapAtom);
  const [topKVal, settopK] = useAtom(topK);
  const [iouThresholdVal, setiouThreshold] = useAtom(iouThreshold);
  const [scoreThresholdVal, setscoreThreshold] = useAtom(scoreThreshold);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full flex justify-between flex-row">
        <h1 className="font-bold text-4xl mb-8">SETTINGS</h1>
        <button
          className="btn btn-primary btn-md"
          onClick={(e) => {
            setCameraOn(true);
            router.push("/v8/");
          }}
        >
          Back to App
        </button>
      </div>

      <div className="divider"></div>

      <h2 className="font-bold text-2xl mb-8">YOLO v8</h2>

      <p className="mb-8">
        currently used model is YOLO v8n (/models/yolov8n.onnx).
      </p>

      <div className="mb-8 grid md:grid-cols-3 gap-2">
        <h3 className="font-bold text-md mb-8 col-span-1">
          {InfoIcon("Number of boxes to be detected")}
          top-k: {topKVal}
        </h3>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={topKVal}
          onChange={(e) => settopK(Number(e.target.value))}
          className="range col-span-3 md:col-span-2"
        />
      </div>

      <div className="mb-8 grid md:grid-cols-3 gap-2">
        <h3 className="font-bold text-md mb-8 col-span-1">
          {InfoIcon("IOU (Intersection over Union) threshold to be detected")}
          IOU Threshold: &gt;{iouThresholdVal}
        </h3>
        <input
          type="range"
          min={0}
          max={1.0}
          step={0.01}
          value={iouThresholdVal}
          onChange={(e) => setiouThreshold(Number(e.target.value))}
          className="range col-span-3 md:col-span-2"
        />
      </div>

      <div className="mb-8 grid md:grid-cols-3 gap-2">
        <h3 className="font-bold text-md mb-8 col-span-1">
          {InfoIcon("score (probability) threshold to be detected")}
          Score Threshold: &gt;{scoreThresholdVal}
        </h3>
        <input
          type="range"
          min={0}
          max={1.0}
          value={scoreThresholdVal}
          step={0.01}
          onChange={(e) => setscoreThreshold(Number(e.target.value))}
          className="range col-span-3 md:col-span-2"
        />
      </div>

      <div className="divider"></div>

      <h2 className="font-bold text-2xl mb-8">Language Model Settings</h2>

      <div className="mb-8">
        <h3 className="font-bold text-md mb-4">
          {InfoIcon("OpenAI secret token")}
          LLM Name
        </h3>
        <p className="mb-8">
          Set the LLM name to use. You can select from &nbsp;
          <Link
            href="https://platform.openai.com/docs/models/overview"
            className="underline"
          >
            https://platform.openai.com/docs/models/overview
          </Link>
          . &nbsp;
        </p>
        <input
          type="text"
          placeholder="input your API token here"
          className="input input-bordered w-full"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
        />
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-md mb-4">
          {InfoIcon("OpenAI secret token")}
          OpenAI token
        </h3>
        <p className="mb-8">
          Set the OpenAI API token to use the LLM. You can get from &nbsp;
          <Link
            href="https://platform.openai.com/api-keys"
            className="underline"
          >
            https://platform.openai.com/api-keys
          </Link>
          . &nbsp;
        </p>
        <div className="label">
          <span className="label-text">
            Do not publish your API token to the public.
          </span>
        </div>
        <input
          type="text"
          placeholder="input your API token here"
          className="input input-bordered w-full"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />
      </div>

      <div className="divider"></div>

      <h2 className="font-bold text-2xl mb-8">Labels</h2>
      <div className="overflow-x-auto mb-8">
        <table className="table">
          <thead>
            <tr>
              <th>Icon</th>
              <th>
                <div
                  className="tooltip tooltip-bottom"
                  data-tip="Labels set for YOLO model"
                >
                  Object Label
                </div>
              </th>
              <th>
                <div
                  className="tooltip tooltip-bottom"
                  data-tip="User-editable Label for Language Model AI"
                >
                  Name
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {labels.map((label, i) => (
              <tr key={i}>
                <td>{labelsIconMap[label]}</td>
                <td>{label}</td>
                <td>
                  <input
                    type="text"
                    placeholder={`${label}の日本語`}
                    className="input input-bordered w-full max-w-xs"
                    value={labelsJaLabelMap[label]}
                    onChange={(e) => {
                      const newLabelsJaLabelMap = { ...labelsJaLabelMap };
                      newLabelsJaLabelMap[label] = e.target.value;
                      setLabelsJaLabelMap(newLabelsJaLabelMap);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divider"></div>
    </div>
  );
}
