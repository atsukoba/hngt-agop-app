"use client";

import { iouThreshold, scoreThreshold, topK } from "@/utils/states";
import { labels, labelsIconMap } from "@/yolo/label";
import { useAtom } from "jotai/react";

const InfoIcon = (tooltipMsg: string) => (
  <div className="tooltip" data-tip={tooltipMsg}>
    <span
      className="icon-[mdi--information-slab-circle-outline] w-5 h-5 mr-2"
      style={{ verticalAlign: "-0.3em" }}
    ></span>
  </div>
);

export default function SettingModal() {
  const [topKVal, settopK] = useAtom(topK);
  const [iouThresholdVal, setiouThreshold] = useAtom(iouThreshold);
  const [scoreThresholdVal, setscoreThreshold] = useAtom(scoreThreshold);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full flex justify-between flex-row">
        <h1 className="font-bold text-4xl mb-8">SETTINGS</h1>
        <a href="/v8/" className="btn btn-primary btn-md">
          Back to App
        </a>
      </div>
      <p className="mb-8">
        Changes for the settings will be applied after you close this modal.
      </p>
      <h2 className="font-bold text-lg mb-8">YOLO v8</h2>

      <div className="mb-8">
        <h3 className="font-bold text-md mb-8">
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
          className="range"
        />
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-md mb-8">
          {InfoIcon("IOU (Intersection over Union) threshold to be detected")}
          IOU Threshold
        </h3>
        <input
          type="range"
          min={0}
          max={1.0}
          step={0.05}
          value={iouThresholdVal}
          onChange={(e) => setiouThreshold(Number(e.target.value))}
          className="range"
        />
      </div>

      <div className="mb-8">
        <h3 className="font-bold text-md mb-8">
          {InfoIcon("score (probability) threshold to be detected")}
          Score Threshold
        </h3>
        <input
          type="range"
          min={0}
          max={1.0}
          value={scoreThresholdVal}
          step={0.05}
          onChange={(e) => setscoreThreshold(Number(e.target.value))}
          className="range"
        />
      </div>

      <h2 className="font-bold text-lg mb-8">Langchain</h2>

      <div className="mb-8">
        <h3 className="font-bold text-md mb-8">
          {InfoIcon("OpenAI secret token")}
          OpenAI token
        </h3>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full"
        />
      </div>

      <h2 className="font-bold text-lg mb-8">Labels</h2>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
