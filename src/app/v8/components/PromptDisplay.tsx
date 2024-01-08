"use client";

import { DetailedHTMLProps, HTMLAttributes } from "react";

import { promptDialogMessageAtom } from "@/utils/states";
import { useAtomValue } from "jotai/react";

export default function PromptDisplay({
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  const promptDialogMessage = useAtomValue(promptDialogMessageAtom);

  return (
    <section {...props}>
      <p className="text-lg font-serif animate-in fade-in-50 text-right">
        {promptDialogMessage}
      </p>
    </section>
  );
}
