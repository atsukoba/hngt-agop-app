"use client";

import { llmResponseAtom } from "@/utils/states";
import { useAtomValue } from "jotai/react";
import { useEffect } from "react";

export default function LMDisplay() {
  const readAloud = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const uttr = new SpeechSynthesisUtterance();
      uttr.lang = "ja-JP";
      uttr.pitch = 0.9;
      uttr.volume = 0.75;
      uttr.text = text;
      window.speechSynthesis.speak(uttr);
    }
  };

  const speakStop = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const llmResponse = useAtomValue(llmResponseAtom);

  useEffect(() => {
    if (llmResponse !== "") {
      readAloud(llmResponse);
    } else {
      speakStop();
    }
  }, [llmResponse]);

  return (
    <section
      className="w-screen h-screen absolute overflow-y-scroll left-0 top-0 px-4 py-8 hidden-scrollbar"
      style={{
        width: "75%",
      }}
    >
      <div className="pb-16">
        <p
          className="text-5xl font-serif animate-in fade-in-100 opacity-75"
          style={{
            whiteSpace: "pre-wrap",
          }}
        >
          {llmResponse.replaceAll("。", "。\n")}
        </p>
      </div>
    </section>
  );
}
