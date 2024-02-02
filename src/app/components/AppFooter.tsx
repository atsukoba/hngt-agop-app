"use client";

import PromptDisplay from "@/app/components/PromptDisplay";
import { buildPreviousResponseAsPrompt } from "@/prompts/builder";
import { updateDescribeResponse } from "@/utils/api";
import { LoadingMessages } from "@/utils/consts";
import { postDiscordWebhook } from "@/utils/logging";
import {
  apiKeyAtom,
  currentCameraAtom,
  currentCamerasAtom,
  currentIntervalTImeAtom,
  descibeModeBasePromptsAtom,
  descibePromptsSelectedIndexAtom,
  describeIntervalSecAtom,
  describeMaxTokenAtom,
  describeModeBase64ImageAtom,
  discordWebhookUrlAtom,
  imageShotFuncAtom,
  isAutoDescribeOnAtom,
  isCameraOn,
  llmPreviousResponseAtom,
  llmResponseAtom,
  llmSystemPromptAtom,
  loadingMessageAtom,
} from "@/utils/states";
import { useAtom, useAtomValue, useSetAtom } from "jotai/react";
import { useAtomCallback } from "jotai/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function AppFooter({
  gpt4mode = false,
}: {
  gpt4mode?: boolean;
}) {
  const router = useRouter();
  const [loadingMessage, setLoadingMessage] = useAtom(loadingMessageAtom);

  const cameras = useAtomValue(currentCamerasAtom);
  const [currentCamera, setCamera] = useAtom(currentCameraAtom);
  const setCameraOn = useSetAtom(isCameraOn);

  const token = useAtomValue(apiKeyAtom);
  const imageShotFunc = useAtomValue(imageShotFuncAtom);
  const [image, setImage] = useAtom(describeModeBase64ImageAtom);
  const [isAutoDescribeOn, setIsAutoDescribeOn] = useAtom(isAutoDescribeOnAtom);
  const [currentIntervalTIme, setCurrentIntervalTIme] = useAtom(
    currentIntervalTImeAtom
  );
  const descIntervalTime = useAtomValue(describeIntervalSecAtom);
  const describeMaxToken = useAtomValue(describeMaxTokenAtom);
  const descPrompts = useAtomValue(descibeModeBasePromptsAtom);
  const [descPromptSelectedIdx, setDescPromptSelectedIdx] = useAtom(
    descibePromptsSelectedIndexAtom
  );
  const systemPrompt = useAtomValue(llmSystemPromptAtom);
  const webhook = useAtomValue(discordWebhookUrlAtom);

  const [llmResponse, setLlmsResponse] = useAtom(llmResponseAtom);
  const setLlmsPreviousResponse = useSetAtom(llmPreviousResponseAtom);

  const updateDescribeResponseCallback = useCallback(
    (text: string) => {
      console.log(llmResponse);
      setLlmsPreviousResponse(llmResponse);
      console.log(text);
      setLlmsResponse(text);
    },
    [llmResponse]
  );

  const getPreviousResponseAsPrompt = useAtomCallback(
    useCallback((get) => {
      const res = get(llmPreviousResponseAtom);
      return buildPreviousResponseAsPrompt(res);
    }, [])
  );

  useEffect(() => {
    // after interval time value is changed, update current time
    if (currentIntervalTIme >= descIntervalTime && isAutoDescribeOn) {
      setCurrentIntervalTIme(descIntervalTime);
    }
  });

  useEffect(() => {
    /**
     * @description trigger image description when image is updated
     */
    if (image) {
      setLoadingMessage(LoadingMessages.GENERATING);
      // randomly select a prompt
      const descPrompt = descPrompts[descPromptSelectedIdx];
      // trigger generation
      const promptSend = [
        systemPrompt,
        descPrompt,
        getPreviousResponseAsPrompt(),
      ].join("\n");
      updateDescribeResponse(
        image,
        promptSend,
        token,
        describeMaxToken,
        updateDescribeResponseCallback
      )
        .then((content: string) =>
          postDiscordWebhook(
            webhook,
            "[Prompt]\r" + promptSend + "\r\r[Response]\r" + content,
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
          value={currentCamera ? cameras.indexOf(currentCamera) : 0}
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
            <div className="prompt_selector flex flex-row gap-2 items-center">
              <span className="label-text mr-2">Prompts</span>
              {descPrompts.map((p, i) => (
                <div
                  className="tooltip tooltip-top flex items-center"
                  data-tip={p}
                >
                  <input
                    type="radio"
                    name={`radio__prompt${i}`}
                    className="radio radio-accent"
                    checked={i === descPromptSelectedIdx}
                    onChange={() => setDescPromptSelectedIdx(i)}
                  />
                </div>
              ))}
            </div>
            <div className="form-control">
              <label className="cursor-pointer label">
                <span className="label-text mr-2 font-mono">
                  Auto: {isAutoDescribeOn ? "入" : "切"}
                </span>
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
