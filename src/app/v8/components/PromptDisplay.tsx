"use client";

import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from "react";

import {
  apiKeyAtom,
  modelNameAtom,
  promptDialogMessageAtom,
} from "@/utils/states";
import { useAtomValue } from "jotai/react";
import { fetchGenerate } from "@/utils/api";

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
  const promptDialogMessage = useAtomValue(promptDialogMessageAtom);
  const token = useAtomValue(apiKeyAtom);
  const modelName = useAtomValue(modelNameAtom);

  useEffect(() => {
    if (promptDialogMessage) {
      fetchGenerate(promptDialogMessage, token, modelName);
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
