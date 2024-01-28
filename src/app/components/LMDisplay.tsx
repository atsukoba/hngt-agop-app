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
const LmResponseWrap = ({
  responseJa,
  responseEn,
}: {
  responseJa: string;
  responseEn?: string;
}) => {
  const [currentResponseJa, setCurrentResponseJa] = useState("");
  const [currentResponseEn, setCurrentResponseEn] = useState("");
  useEffect(() => {
    let cnt = 1;
    if (!responseJa) return;
    const runner = setInterval(() => {
      const longerLim =
        Math.max(responseJa.length, responseEn?.length || 0) - 1;
      const currentJa = responseJa.slice(0, cnt);
      const currentEn = responseEn?.slice(0, cnt);
      setCurrentResponseJa(currentJa);
      responseEn && setCurrentResponseEn(responseEn.slice(0, cnt));
      cnt === longerLim && clearInterval(runner);
      cnt++;
    }, 15);
  }, [responseJa, responseEn]);

  return (
    <div className="grid grid-rows-2 gap-8 min-h-full">
      <p
        className="row-span-1 text-5xl font-serif animate-in fade-in-100 opacity-75"
        style={{
          whiteSpace: "pre-wrap",
        }}
      >
        {currentResponseJa}
      </p>
      {currentResponseEn && (
        <p
          className="row-span-1 text-5xl font-serif animate-in fade-in-100 opacity-75"
          style={{
            whiteSpace: "pre-wrap",
          }}
        >
          {currentResponseEn}
        </p>
      )}
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
    const res = internalResposes[currentReadingIdx];
    if (!res) return;
    let text: string;
    if (res.indexOf("[lang]") !== -1) {
      text = res.split("[lang]")[0];
    } else {
      text = res;
    }
    if (text === "" || text === undefined) return;
    readAloud(
      text,
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
      <LmResponseWrap
        responseJa={
          internalResposes[currentReadingIdx]?.split("[lang]")[0] || ""
        }
        responseEn={
          internalResposes[currentReadingIdx]?.split("[lang]")[1] || ""
        }
      />
    </section>
  );
}
