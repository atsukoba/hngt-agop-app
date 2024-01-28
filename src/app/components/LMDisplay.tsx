"use client";

import {
  llmResponseAtom,
  voicePitchAtom,
  voiceSpeedAtom,
} from "@/utils/states";
import { useAtomValue } from "jotai/react";
import { useEffect, useState } from "react";

const readAloud = (
  text: string,
  voicePitch: number,
  voiceSpeed: number,
  onend?: (e: SpeechSynthesisEvent) => void,
  onerror?: (e: SpeechSynthesisErrorEvent) => void
) => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const uttr = new SpeechSynthesisUtterance();
    uttr.lang = "ja-JP";
    uttr.pitch = voicePitch;
    uttr.volume = voiceSpeed;
    uttr.text = text;
    if (onend) uttr.addEventListener("end", onend);
    if (onerror) uttr.addEventListener("error", onerror);
    window.speechSynthesis.speak(uttr);
  }
};

const speakStop = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 *
 * @description This component is responsible for displaying each line of the response text.
 */
const LmResponseWrap = ({ response }: { response: string }) => {
  const [currentResponse, setCurrentResponse] = useState("");
  useEffect(() => {
    let cnt = 0;
    if (!response) return;
    const runner = setInterval(() => {
      const current = response.slice(0, cnt);
      setCurrentResponse(current);
      current === response && clearInterval(runner);
      cnt++;
    }, 30);
  }, [response]);

  return (
    <div className="pb-16">
      <p
        className="text-5xl font-serif animate-in fade-in-100 opacity-75"
        style={{
          whiteSpace: "pre-wrap",
        }}
      >
        {currentResponse}
      </p>
    </div>
  );
};

/**
 * @description This component is responsible for displaying the response from the LLM.
 */
export default function LMDisplay({
  rightMargin = undefined,
}: {
  rightMargin?: number;
}) {
  const llmResponse = useAtomValue(llmResponseAtom);
  const voicePitch = useAtomValue(voicePitchAtom);
  const voiceSpeed = useAtomValue(voiceSpeedAtom);

  const [currentReadingIdx, setCurrentReadingIdx] = useState(0);
  const [internalResposes, setInternalResposes] = useState<string[]>([]);

  const separateString = "\n";

  useEffect(() => {
    speakStop();
    setInternalResposes(llmResponse.split(separateString));
  }, [llmResponse]);

  useEffect(() => {
    readAloud(
      internalResposes[currentReadingIdx],
      voicePitch,
      voiceSpeed,
      (e) => {
        if (currentReadingIdx < internalResposes.length - 1) {
          setCurrentReadingIdx(currentReadingIdx + 1);
        }
      },
      (e) => {
        console.log("speech synthesis error: ", e);
      }
    );
  }, [internalResposes, currentReadingIdx, voicePitch, voiceSpeed]);

  return (
    <section
      className="w-screen h-screen absolute overflow-y-scroll left-0 top-0 px-4 py-8 hidden-scrollbar"
      style={{
        width: `calc(100% - ${rightMargin}px)`,
      }}
    >
      <LmResponseWrap response={internalResposes[currentReadingIdx]} />
    </section>
  );
}
