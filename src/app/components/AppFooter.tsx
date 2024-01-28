"use client";

import PromptDisplay from "@/app/components/PromptDisplay";
import { updateDescribeResponse } from "@/utils/api";
import { LoadingMessages } from "@/utils/consts";
import { postDIscordWebhook } from "@/utils/logging";
import {
  apiKeyAtom,
  currentCameraAtom,
  currentCamerasAtom,
  currentIntervalTImeAtom,
  descibeModeBasePromptAtom,
  describeIntervalSecAtom,
  describeModeBase64ImageAtom,
  discordWebhookUrlAtom,
  imageShotFuncAtom,
  isAutoDescribeOnAtom,
  isCameraOn,
  llmResponseAtom,
  loadingMessageAtom,
} from "@/utils/states";
import { useAtom, useAtomValue, useSetAtom } from "jotai/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

  const token = useAtomValue(apiKeyAtom);
  const imageShotFunc = useAtomValue(imageShotFuncAtom);
  const [image, setImage] = useAtom(describeModeBase64ImageAtom);
  const [isAutoDescribeOn, setIsAutoDescribeOn] = useAtom(isAutoDescribeOnAtom);
  const currentIntervalTIme = useAtomValue(currentIntervalTImeAtom);
  const descIntervalTime = useAtomValue(describeIntervalSecAtom);
  const [descriptionState, setDescriptionState] = useState<string>("");
  const descPrompt = useAtomValue(descibeModeBasePromptAtom);
  const webhook = useAtomValue(discordWebhookUrlAtom);

  const setLlmsResponse = useSetAtom(llmResponseAtom);

  useEffect(() => {
    /**
     * @description trigger image description when image is updated
     */
    if (image) {
      setLoadingMessage(LoadingMessages.GENERATING);
      updateDescribeResponse(image, descPrompt, token, setLlmsResponse)
        .then((content: string) =>
          postDIscordWebhook(
            webhook,
            "Prompt: " + descPrompt + "\rResponse: " + content,
            image
          )
        )
        .finally(() => {
          setLoadingMessage(undefined);
        });
    }
  }, [image]);

  return (
    <div className="app__footer absolute left-0 bottom-0 px-4 py-2 w-full h-16 flex flex-row justify-between gap-4 bg-black bg-opacity-50">
      <div className="flex flex-row justify-start gap-4 items-center w-full">
        <div>
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
        <button
          className="btn btn-outline"
          onClick={() => {
            if (typeof window !== "undefined") {
              document.body.requestFullscreen();
            }
          }}
        >
          Full <br />
          Screen
        </button>
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
        {gpt4mode ? (
          <div className="flex-grow flex flex-row justify-end gap-4">
            <div className="form-control">
              <label className="cursor-pointer label">
                <span className="label-text mr-2">Auto Mode</span>
                <input
                  type="checkbox"
                  className="toggle toggle-accent toggle-lg"
                  checked={isAutoDescribeOn}
                  onChange={(e) => {
                    setIsAutoDescribeOn(e.target.checked);
                  }}
                />
              </label>
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
            <div>
              <button
                onClick={(_) => {
                  const base64 = imageShotFunc.call();
                  setImage(base64);
                }}
                className="btn btn-accent"
              >
                <div
                  className="tooltip tooltip-top"
                  data-tip={"Trigger Image Description"}
                >
                  <span
                    className="icon-[mdi--camera] w-8 h-8"
                    style={{ verticalAlign: "-0.3em" }}
                  ></span>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <PromptDisplay className="flex-grow flex flex-col justify-center align-middle" />
        )}
      </div>
    </div>
  );
}
