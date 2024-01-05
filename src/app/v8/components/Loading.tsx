"use client";

import { LoadingMessages } from "@/utils/consts";
import { loadingMessageAtom } from "@/utils/states";
import { useAtom } from "jotai/react";

export default function Loading() {
  const [loadingMessage, setLoadingMessage] = useAtom(loadingMessageAtom);

  let loadingStateVal: number | undefined = undefined;
  switch (loadingMessage) {
    case LoadingMessages.SETUP_CAMERA:
      loadingStateVal = 30;
      break;
    case LoadingMessages.YOLO_MODEL:
      loadingStateVal = 50;
      break;
    case LoadingMessages.YOLO_CLASSIFIER:
      loadingStateVal = 70;
      break;
    case LoadingMessages.TEST_MODEL:
      loadingStateVal = 90;
      break;
    default:
      break;
  }

  return (
    loadingMessage &&
    (loadingStateVal ? (
      <div className="absolute w-full h-full flex flex-row justify-center items-center">
        <div className="p-4 rounded-lg glass">
          {/* <progress
            className="progress progress-primary w-56"
            value={loadingStateVal}
            max="100"
          ></progress> */}
          <div
            className="radial-progress"
            style={
              {
                "--value": loadingStateVal,
                "--size": "12rem",
                "--thickness": "5px",
              } as React.CSSProperties
            }
            role="progressbar"
          >
            {loadingStateVal}%
          </div>

          <p className="text-center">{loadingMessage}</p>
        </div>
      </div>
    ) : (
      <span className="loading loading-ring loading-lg"></span>
    ))
  );
}
