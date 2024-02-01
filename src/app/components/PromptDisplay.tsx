"use client";

import { updateChatResponse } from "@/utils/api";
import { LoadingMessages } from "@/utils/consts";
import {
  apiKeyAtom,
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

  // update llm response
  const setLlmsResponse = useSetAtom(llmResponseAtom);

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
