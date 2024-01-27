"use client";

import {
  currentCameraAtom,
  currentCamerasAtom,
  currentIntervalTImeAtom,
  descibeModeBasePromptAtom,
  describeIntervalSecAtom,
  describeModeBase64ImageAtom,
  imageShotFuncAtom,
  isCameraOn,
  loadingMessageAtom,
} from "@/utils/states";
import { useAtom, useAtomValue, useSetAtom } from "jotai/react";
import { useRouter } from "next/navigation";
import PromptDisplay from "@/app/components/PromptDisplay";
import { useEffect } from "react";
import { updateDescribeResponse } from "@/utils/api";

export default function AppFooter({
  gpt4mode = false,
}: {
  gpt4mode?: boolean;
}) {
  const router = useRouter();
  const [loadingMessage, setLoadingMessage] = useAtom(loadingMessageAtom);

  const cameras = useAtomValue(currentCamerasAtom);
  const setCamera = useSetAtom(currentCameraAtom);
  const setCameraOn = useSetAtom(isCameraOn);

  const imageShotFunc = useAtomValue(imageShotFuncAtom);
  const [image, setImage] = useAtom(describeModeBase64ImageAtom);
  const currentIntervalTIme = useAtomValue(currentIntervalTImeAtom);
  const descIntervalTime = useAtomValue(describeIntervalSecAtom);

  return (
    <div className="app__footer absolute left-0 bottom-0 px-4 py-2 w-full h-16 flex flex-row justify-between gap-4 bg-black bg-opacity-50">
      <div className="flex flex-row justify-start gap-4">
        <div className="w-24">
          <button
            onClick={(_) => {
              setCameraOn(false);
              router.push(`/settings?mode=${gpt4mode ? "gpt4" : "yolo"}`);
            }}
            className="btn btn-primary"
            disabled={loadingMessage !== undefined}
          >
            <div
              className="tooltip tooltip-right"
              data-tip={"Go to settings page"}
            >
              <span
                className="icon-[mdi--cog] w-8 h-8"
                style={{ verticalAlign: "-0.3em" }}
              ></span>
            </div>
          </button>
        </div>
        <select
          className="select select-accent w-full max-w-sm"
          onChange={(e) =>
            setCamera(cameras[e.target.value as unknown as number])
          }
        >
          {cameras.map((c, i) => (
            <option key={i} value={i}>
              {c.label}
            </option>
          ))}
        </select>
        {gpt4mode && (
          <>
            <div>
              <button
                onClick={(_) => {
                  const base64 = imageShotFunc.call();
                  setImage(base64);
                }}
                className="btn btn-accent btn-outline"
              >
                <div
                  className="tooltip tooltip-top"
                  data-tip={"Trigger Image Description"}
                >
                  Describe
                </div>
              </button>
            </div>
            <div className="w-12">
              <div
                className="radial-progress text-accent"
                style={
                  {
                    "--value": Math.floor(
                      100 * (currentIntervalTIme / descIntervalTime)
                    ),
                    "--size": "3rem",
                  } as any
                }
                role="progressbar"
              >
                {currentIntervalTIme}
              </div>
            </div>
          </>
        )}
      </div>
      <PromptDisplay className="flex-grow flex flex-col justify-center align-middle" />
    </div>
  );
}
