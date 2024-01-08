"use client";

import { LoadingMessages } from "@/utils/consts";
import { loadingMessageAtom } from "@/utils/states";
import { useAtomValue } from "jotai/react";

export default function Loading() {
  const loadingMessage = useAtomValue(loadingMessageAtom);

  // NOTE: if you want to show progress bar
  // let loadingStateVal: number | undefined = undefined;
  // switch (loadingMessage) {
  //   case LoadingMessages.SETUP_CAMERA:
  //     loadingStateVal = 0;
  //     break;
  //   case LoadingMessages.YOLO_MODEL:
  //     loadingStateVal = 25;
  //     break;
  //   case LoadingMessages.YOLO_CLASSIFIER:
  //     loadingStateVal = 50;
  //     break;
  //   case LoadingMessages.TEST_MODEL:
  //     loadingStateVal = 75;
  //     break;
  //   default:
  //     break;
  // }

  return (
    loadingMessage && (
      <div className="absolute w-full h-full flex flex-row justify-center items-center">
        <div
          className="p-4 rounded-lg bg-base-100 bg-opacity-50 flex flex-col justify-center items-center"
          style={{
            width: "33%",
          }}
        >
          <span className="loading loading-ring loading-lg my-4"></span>
          <p className="text-center w-full px-4">{loadingMessage}</p>
        </div>
      </div>
    )
  );
}
