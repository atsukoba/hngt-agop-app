"use client";

import {
  llmResponseAtom,
  voiceAtom,
  voicePitchAtom,
  voiceSpeedAtom,
} from "@/utils/states";
import { useAtomValue } from "jotai/react";
import { useCallback, useEffect, useState } from "react";

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
      currentEn && setCurrentResponseEn(currentEn);
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
  const voice = useAtomValue(voiceAtom);
  const voicePitch = useAtomValue(voicePitchAtom);
  const voiceSpeed = useAtomValue(voiceSpeedAtom);

  const [currentReadingIdx, setCurrentReadingIdx] = useState(0);
  const [internalResposes, setInternalResposes] = useState<string[]>([]);

  const separateString = "\n";

  const readAloud = useCallback(
    (
      text: string,
      voicePitch: number,
      voiceSpeed: number,
      voice?: SpeechSynthesisVoice,
      onend?: (e: SpeechSynthesisEvent) => void,
      onerror?: (e: SpeechSynthesisErrorEvent) => void,
      maxSpeechTime: number = 30000
    ) => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        let maxSpeechTimeOut: NodeJS.Timeout;
        const uttr = new SpeechSynthesisUtterance(text);
        if (voice) uttr.voice = voice;
        uttr.lang = "ja-JP";
        uttr.pitch = voicePitch;
        uttr.volume = voiceSpeed;
        uttr.onstart = (e) => {
          maxSpeechTimeOut = setTimeout(() => {
            window.speechSynthesis.cancel();
          }, maxSpeechTime);
        };
        uttr.onend = (e) => {
          clearTimeout(maxSpeechTimeOut);
          if (onend) {
            onend(e);
          }
        };
        uttr.onerror = (e) => {
          clearTimeout(maxSpeechTimeOut);
          if (onerror) {
            onerror(e);
          }
        };
        window.speechSynthesis.speak(uttr);
      }
    },
    []
  );

  const speakStop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("beforeunload", () => speechSynthesis.cancel());
    speakStop();
    setInternalResposes(
      llmResponse.split(separateString).filter((t) => t !== "")
    );
    setCurrentReadingIdx(0);
  }, [llmResponse]);

  useEffect(() => {
    const res = internalResposes[currentReadingIdx];
    if (!res) return;
    let text: string;
    if (res.indexOf("[en]") !== -1) {
      text = res.split("[en]")[0];
    } else {
      text = res;
    }
    if (text === "" || text === undefined) return;
    readAloud(
      text,
      voicePitch,
      voiceSpeed,
      voice,
      (e) => {
        if (currentReadingIdx < internalResposes.length - 1) {
          setCurrentReadingIdx(currentReadingIdx + 1);
        }
      },
      (e) => {
        console.log("speech synthesis error: ", e);
        if (currentReadingIdx < internalResposes.length - 1) {
          setCurrentReadingIdx(currentReadingIdx + 1);
        }
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
        responseJa={internalResposes[currentReadingIdx]?.split("[en]")[0] || ""}
        responseEn={internalResposes[currentReadingIdx]?.split("[en]")[1] || ""}
      />
    </section>
  );
}
