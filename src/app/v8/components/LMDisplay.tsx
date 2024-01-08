"use client";

import { DetailedHTMLProps, HTMLAttributes } from "react";

import {
  promptDialogMessageAtom,
  resultLabelHistoryAtom,
} from "@/utils/states";
import { useAtomValue } from "jotai/react";

export default function LMDisplay({
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
  const promptDialogMessage = useAtomValue(promptDialogMessageAtom);

  return (
    <section {...props}>
      <div
        style={{
          width: "50%",
        }}
      >
        <p className="text-7xl font-serif animate-in fade-in-50">
          {promptDialogMessage}
        </p>
      </div>
    </section>
  );
}
