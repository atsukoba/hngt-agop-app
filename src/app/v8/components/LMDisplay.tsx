"use client";

import { llmResponseAtom } from "@/utils/states";
import { useAtomValue } from "jotai/react";

export default function LMDisplay() {
  const llmResponse = useAtomValue(llmResponseAtom);

  llmResponse.replaceAll("。", "。\n");

  return (
    <section
      className="w-screen h-screen absolute left-0 top-0 p-4"
      style={{
        width: "75%",
      }}
    >
      <div>
        <p
          className="text-5xl font-serif animate-in fade-in-100 opacity-75"
          style={{
            whiteSpace: "pre-wrap",
          }}
        >
          {llmResponse}
        </p>
      </div>
    </section>
  );
}
