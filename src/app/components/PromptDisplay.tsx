"use client";

import { updateChatResponse, updateDescribeResponse } from "@/utils/api";
import { LoadingMessages } from "@/utils/consts";
import {
  apiKeyAtom,
  descibeModeBasePromptAtom,
  describeModeBase64ImageAtom,
  llmResponseAtom,
  loadingMessageAtom,
  modelNameAtom,
  promptDialogMessageAtom,
} from "@/utils/states";
import { useAtom, useAtomValue, useSetAtom } from "jotai/react";
import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from "react";

const PromptWrap = ({ prompt }: { prompt: string }) => {
  const [currentPrompt, setCurrentPrompt] = useState("");

  useEffect(() => {
    let cnt = 0;
    const runner = setInterval(() => {
      const current = prompt.slice(0, cnt);
      setCurrentPrompt(current);
      current === prompt && clearInterval(runner);
      cnt++;
    }, 30);
  }, [prompt]);
  return (
    <p className="w-full text-right align-middle text-lg font-serif">
      {currentPrompt}
    </p>
  );
};

export default function PromptDisplay({
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  const [loadingMessage, setLoadingMessage] = useAtom(loadingMessageAtom);
  const token = useAtomValue(apiKeyAtom);

  // obj detect mode
  const promptDialogMessage = useAtomValue(promptDialogMessageAtom);
  const modelName = useAtomValue(modelNameAtom);

  // describe mode
  const [descriptionState, setDescriptionState] = useState<string>("");
  const image = useAtomValue(describeModeBase64ImageAtom);
  const descPrompt = useAtomValue(descibeModeBasePromptAtom);

  // update llm response
  const setLlmsResponse = useSetAtom(llmResponseAtom);

  useEffect(() => {
    /**
     * @description trigger image description when image is updated
     */
    if (image) {
      setLoadingMessage(LoadingMessages.GENERATING);
      updateDescribeResponse(image, descPrompt, token, setLlmsResponse).finally(
        () => {
          setLoadingMessage(undefined);
        }
      );
    }
  }, [image]);

  useEffect(() => {
    /**
     * @description trigger chat response when prompt built from the results
     * of object detection is updated
     */
    if (promptDialogMessage) {
      setLoadingMessage(LoadingMessages.GENERATING);
      updateChatResponse(
        promptDialogMessage,
        token,
        setLlmsResponse,
        modelName
      ).finally(() => {
        setLoadingMessage(undefined);
      });
    }
  }, [promptDialogMessage]);

  return (
    <section {...props}>
      <div className="w-full">
        <PromptWrap prompt={promptDialogMessage} />
      </div>
    </section>
  );
}
